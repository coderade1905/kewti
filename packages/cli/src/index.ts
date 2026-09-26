#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";
import ora from "ora";
import pc from "picocolors";

const REGISTRY_URL = "https://kewti-registry.vercel.app";

// Track installed items to prevent duplicate processing
const installedItems = new Set<string>();

// Helper to exit gracefully
function exitWithError(message: string, code = 1): never {
  console.error(pc.red(message));
  process.exitCode = code;
  throw new Error(message);
}

// Helper to check if a file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Detect package manager
async function detectPackageManager(): Promise<string> {
  const cwd = process.cwd();
  if (await fileExists(path.resolve(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (
    (await fileExists(path.resolve(cwd, "bun.lockb"))) ||
    (await fileExists(path.resolve(cwd, "bun.lock")))
  )
    return "bun";
  if (await fileExists(path.resolve(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

// Automatically manage index.ts barrel exports for components
async function updateBarrelExport(item: any) {
  const barrelPath = path.resolve(process.cwd(), "src", "kewti/ui/index.ts");

  if (!item || !item.files || item.files.length === 0) return;

  const mainFile =
    item.files.find((f: any) => /component\.(ts|tsx)$/i.test(f.target)) ||
    item.files.find((f: any) => /index\.(ts|tsx)$/i.test(f.target)) ||
    item.files.find((f: any) => /\.(ts|tsx)$/i.test(f.target)) ||
    item.files[0];

  if (!mainFile?.target) return;

  const absoluteTarget = path.resolve(process.cwd(), mainFile.target);
  const barrelDir = path.dirname(barrelPath);
  const targetDir = path.dirname(absoluteTarget);

  let relativeFolder = path.relative(barrelDir, targetDir).replace(/\\/g, "/");

  if (!relativeFolder || relativeFolder === ".") {
    relativeFolder = path.basename(absoluteTarget, path.extname(absoluteTarget));
  }

  const exportLine = `export * from "./${relativeFolder}/component";\n`;

  let currentContent = "";
  try {
    currentContent = await fs.readFile(barrelPath, "utf8");
  } catch {}

  if (!currentContent.includes(`./${relativeFolder}/component`)) {
    await fs.mkdir(barrelDir, { recursive: true });
    await fs.writeFile(barrelPath, currentContent + exportLine, "utf8");
    console.log(pc.green(`Updated barrel export in src/kewti/ui/index.ts`));
  }
}

// Generic file & dependency installer
async function installItem(itemName: string, registryItems: any[]) {
  if (installedItems.has(itemName)) return;

  const cleanName = itemName.toLowerCase().replace(/^kewti-/, "");
  const item = registryItems.find(
    (c) =>
      c.name.toLowerCase() === itemName.toLowerCase() ||
      c.name.toLowerCase() === cleanName ||
      (cleanName === "calender" && c.name.toLowerCase() === "calendar") ||
      (cleanName === "calendar" && c.name.toLowerCase() === "calender")
  );

  if (!item) {
    exitWithError(`\n❌ Item '${itemName}' not found in registry.`);
  }

  const pkgManager = await detectPackageManager();

  if (item.registryDependencies?.length) {
    for (const dep of item.registryDependencies) {
      await installItem(dep, registryItems);
    }
  }

  const isFont = item.folder !== undefined || item.type === "registry:font" || item.type === "font";
  console.log(`\nInstalling ${isFont ? "font" : "component"}: ${pc.cyan(itemName)}...`);

  // Download and save files
  for (const file of item.files) {
    const remotePath = file.path || `fonts/${item.folder}/${file.file}`;
    const fileUrl = `${REGISTRY_URL}/${remotePath}`;

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch ${fileUrl}`);

      const arrayBuffer = await response.arrayBuffer();
      const contentBuffer = Buffer.from(arrayBuffer);

      let relativeTarget = file.target || `src/kewti/fonts/${item.folder}/${file.file}`;
      const targetPath = path.resolve(process.cwd(), relativeTarget);

      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, contentBuffer);
      console.log(`Created ${relativeTarget}`);
    } catch (error) {
      exitWithError(`Failed to download ${remotePath}`);
    }
  }

  if (!isFont) {
    await updateBarrelExport(item);
  }

  if (item.dependencies?.length) {
    const installCmd = pkgManager === "yarn" ? "add" : "install";
    console.log(`📦 Installing npm dependencies: ${item.dependencies.join(", ")}`);
    try {
      await execa(pkgManager, [installCmd, ...item.dependencies], { stdio: "inherit" });
    } catch (error) {
      exitWithError(`\nFailed to install npm dependencies for ${itemName}`);
    }
  }

  installedItems.add(itemName);
}

async function fetchRegistry(endpoint: string) {
  const spinner = ora(`Fetching registry...`).start();
  try {
    const response = await fetch(`${REGISTRY_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`Could not reach ${endpoint}`);
    const data = await response.json();
    spinner.succeed(`Registry loaded`);
    return data.items || data || [];
  } catch (error: any) {
    spinner.fail(pc.red(`Registry fetch failed.`));
    exitWithError(`\n❌ ${error.message}\n`);
  }
}

// Find the actual monorepo packages/fonts directory based on the script's physical location
async function getFontsPackageDir(): Promise<string | null> {
  if (process.env.KEWTI_FONTS_DIR) return process.env.KEWTI_FONTS_DIR;

  let currentDir = path.dirname(fileURLToPath(import.meta.url));

  for (let i = 0; i < 5; i++) {
    const siblingFontsDir = path.join(currentDir, "..", "fonts");
    if (await fileExists(siblingFontsDir)) {
      return siblingFontsDir; 
    }

    const nestedFontsDir = path.join(currentDir, "packages", "fonts");
    if (await fileExists(nestedFontsDir)) {
      return nestedFontsDir; 
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
}

// -------------------------------------------------------------
// LOCAL REGISTRY ADDITION (MAINTAINER ONLY)
// -------------------------------------------------------------
async function handleAddFontToRegistry(fontName: string, options: any) {
  const cwd = process.cwd(); // User's terminal directory
  
  if (!options.files || options.files.length === 0) {
    exitWithError(`❌ No files provided. Example: kewti font add ${fontName} -f ./path.ttf:regular`);
  }

  // 1. Locate the packages/fonts directory inside the monorepo
  const fontsPackageDir = await getFontsPackageDir();
  
  if (!fontsPackageDir || !(await fileExists(fontsPackageDir))) {
    exitWithError(
      `❌ Could not find 'packages/fonts' directory.\n` + 
      `Note: The 'add' command is an internal tool for repo maintainers and must be run inside the Kewti monorepo.`
    );
  }

  // 2. Define Monorepo Root (fontsPackageDir is `<root>/packages/fonts`, so root is two levels up)
  const monorepoRoot = path.resolve(fontsPackageDir, "../..");

  // 3. Create target folder inside packages/fonts/<FontName>
  const targetFolder = path.join(fontsPackageDir, fontName);
  await fs.mkdir(targetFolder, { recursive: true });
  console.log(pc.gray(`Located Local Monorepo Root: ${monorepoRoot}`));
  console.log(pc.blue(`Created font directory: ${targetFolder}`));

  const fontFiles: any[] = [];
  let fontType = "truetype";

  // 4. Process and copy files provided in `--files`
  for (const fileStr of options.files) {
    const [sourcePath, variant = "regular"] = fileStr.split(":");
    const resolvedSource = path.resolve(cwd, sourcePath);

    if (!(await fileExists(resolvedSource))) {
      exitWithError(`Source file not found: ${resolvedSource}`);
    }

    const fileName = path.basename(resolvedSource);
    const targetFilePath = path.join(targetFolder, fileName);

    // Copy physical file to the Monorepo package
    await fs.copyFile(resolvedSource, targetFilePath);
    console.log(pc.green(`Copied ${fileName} -> packages/fonts/${fontName}/`));

    if (fileName.toLowerCase().endsWith(".otf")) fontType = "opentype";

    fontFiles.push({
      file: fileName,
      variant: variant,
    });
  }

  // Copy license.txt if provided
  let licenseFileName = "license.txt";
  if (options.licenseFile) {
    const resolvedLic = path.resolve(cwd, options.licenseFile);
    if (await fileExists(resolvedLic)) {
      licenseFileName = path.basename(resolvedLic);
      await fs.copyFile(resolvedLic, path.join(targetFolder, licenseFileName));
      console.log(pc.green(`Copied license file.`));
    }
  }

  // 5. Build Registry Object mapping options
  const newFont = {
    name: fontName,
    title: options.title || fontName,
    folder: fontName,
    license: options.license || "Unknown License",
    licenseFile: licenseFileName,
    createdBy: options.author || "Unknown Designer",
    fontType: fontType,
    files: fontFiles,
  };

  // 6. Update the Registry file in `apps/registry/registry-fonts.ts`
  const registryFilePath = path.resolve(monorepoRoot, options.registryFile);
  const spinner = ora(`Updating registry file at ${registryFilePath}...`).start();

  try {
    let content = "";
    if (await fileExists(registryFilePath)) {
      content = await fs.readFile(registryFilePath, "utf-8");
    } else {
      spinner.fail(`Registry file not found at: ${registryFilePath}`);
      exitWithError(`Please make sure the path apps/registry/registry-fonts.ts exists in your monorepo.`);
    }

    const jsonString = JSON.stringify(newFont, null, 2);

    if (registryFilePath.endsWith(".ts") && content.includes("export const fontsRegistry")) {
      const updatedContent = content.replace(/];?\s*$/, `,\n  ${jsonString.replace(/\n/g, "\n  ")}\n];\n`);
      await fs.writeFile(registryFilePath, updatedContent, "utf-8");
    } else if (registryFilePath.endsWith(".json")) {
      let parsed = content ? JSON.parse(content) : [];
      if (Array.isArray(parsed)) parsed.push(newFont);
      else if (parsed.items) parsed.items.push(newFont);
      await fs.writeFile(registryFilePath, JSON.stringify(parsed, null, 2), "utf-8");
    } else {
      await fs.writeFile(registryFilePath, content + `\n${jsonString}`, "utf-8");
    }

    spinner.succeed(pc.green(`Added '${fontName}' to ${path.basename(registryFilePath)}`));
    
    console.log(`\n${pc.cyan("Registry Entry Added:")}`);
    console.log(pc.gray(jsonString));
    console.log(`\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Font added & ready for commit!\n`);
  } catch (err: any) {
    spinner.fail("Failed to write to registry file");
    exitWithError(err.message);
  }
}

// Handlers for actual installations by user
async function handleFontInstall(fontNames: string[]) {
  console.log(pc.gray(`\nKewti-cli v1.0.0`));
  const fonts = await fetchRegistry("fonts-registry.json");

  if (!fontNames || fontNames.length === 0) {
    console.log(`\n💡 Please specify font name(s) to install:\n`);
    console.log(pc.bold("Available fonts:"));
    fonts.forEach((f: any) =>
      console.log(`  - ${pc.yellow(f.name)} ${pc.gray(`(${f.license || "OFL"})`)}`)
    );
    return;
  }

  const components = await fetchRegistry("registry.json");
  await installItem("fonts", components);

  for (const fontName of fontNames) {
    await installItem(fontName, fonts);
  }

  console.log(`\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Installed fonts!\n`);
}

async function handleComponentInstall(componentNames: string[]) {
  console.log(pc.gray(`\nKewti-cli v1.0.0 `));
  const components = await fetchRegistry("registry.json");

  if (!componentNames || componentNames.length === 0) {
    console.log(`\n💡 Please specify component name(s) to install:\n`);
    return;
  }

  for (const componentName of componentNames) {
    await installItem(componentName, components);
  }

  console.log(`\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Components ready!\n`);
}

const program = new Command();
program.name("kewti").description("UI components and fonts CLI").version("1.0.0");

async function runHandler(fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err: any) {
    if (process.exitCode === undefined) process.exitCode = 1;
  }
}

program
  .command("install [items...]")
  .alias("add")
  .alias("i")
  .action(async (items: string[]) => {
    await runHandler(async () => {
      if (!items || items.length === 0) return await handleComponentInstall([]);
      if (items[0] === "font") return await handleFontInstall(items.slice(1));
      await handleComponentInstall(items);
    });
  });

program
  .command("font [fontnames...]")
  .description("Install fonts (or use 'add' to register a font locally for maintainers)")
  .option("-t, --title <title>", "Font Title (e.g. 'Qal (ቃል)')")
  .option("-a, --author <author>", "Font creator", "Unknown Designer")
  .option("-l, --license <license>", "Font license", "Unknown License")
  .option("--license-file <licenseFile>", "Path to a local license.txt file")
  .option("-f, --files <files...>", "Files to copy in format 'sourcePath:variant' (e.g., ./myfont.ttf:regular)")
  .option("-r, --registry-file <file>", "Registry file to update (relative to monorepo root)", "apps/registry/registry-fonts.ts")
  .action(async (fontnames: string[], options: any) => {
    await runHandler(async () => {
      if (fontnames.length > 0 && fontnames[0].toLowerCase() === "add") {
        const fontNameToAdd = fontnames[1];
        if (!fontNameToAdd) {
          exitWithError("\n❌ Specify font name. Example: kewti font add Qal -f ./Qal.ttf:regular");
        }
        await handleAddFontToRegistry(fontNameToAdd, options);
      } else {
        await handleFontInstall(fontnames);
      }
    });
  });

program.parse();