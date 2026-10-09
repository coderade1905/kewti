#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";
import ora from "ora";
import pc from "picocolors";

const REGISTRY_URL = "https://kewti-registry.vercel.app";

const installedItems = new Set<string>();

function exitWithError(message: string, code = 1): never {
  console.error(pc.red(message));
  process.exitCode = code;
  throw new Error(message);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

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

// Automatically manage index.ts barrel exports for React UI components ONLY
async function updateBarrelExport(item: any) {
  const barrelPath = path.resolve(process.cwd(), "src", "kewti/ui/index.ts");

  if (!item || !item.files || item.files.length === 0) return;

  const mainFile =
    item.files.find((f: any) => /component\.(ts|tsx)$/i.test(f.target)) ||
    item.files.find((f: any) => /index\.(ts|tsx)$/i.test(f.target)) ||
    item.files.find((f: any) => /\.(ts|tsx)$/i.test(f.target));

  // If no TS/TSX file was found, do NOT update the UI barrel
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
    console.log(pc.green(`✔ Updated barrel export in src/kewti/ui/index.ts`));
  }
}

// Generic file & dependency installer
async function installItem(itemName: string, registryItems: any[]) {
  if (installedItems.has(itemName)) return;

  const cleanName = itemName.toLowerCase().replace(/^kewti-/, "");
  const item = registryItems.find(
    (c) =>
      c.name.toLowerCase() === itemName.toLowerCase() ||
      c.name.toLowerCase() === cleanName
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

  // Type identification
  const isFont =
    item.folder !== undefined ||
    item.type === "registry:font" ||
    item.type === "font";

  const isAsset =
    item.type === "registry:asset" ||
    item.files?.every((f: any) => /\.(svg|png|webp|jpe?g)$/i.test(f.path));

  const itemType = isFont ? "font" : isAsset ? "logo asset" : "component";
  console.log(`\nInstalling ${itemType}: ${pc.cyan(itemName)}...`);

  // Download files (handles text SVGs as well as binary PNGs cleanly)
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
      console.log(pc.green(`  └ Created ${relativeTarget}`));
    } catch (error) {
      exitWithError(`Failed to download ${remotePath}`);
    }
  }

  // ONLY update barrel exports if it is an actual UI component
  if (!isFont && !isAsset) {
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
  const spinner = ora(`Fetching registry (${endpoint})...`).start();
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

// Handlers
async function handleComponentInstall(componentNames: string[]) {
  console.log(pc.gray(`\nKewti-cli v1.0.0`));
  const components = await fetchRegistry("registry.json");

  if (!componentNames || componentNames.length === 0) {
    console.log(`\n💡 Please specify component name(s) to install.\n`);
    return;
  }

  for (const componentName of componentNames) {
    await installItem(componentName, components);
  }

  console.log(`\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Components ready!\n`);
}

async function handleFontInstall(fontNames: string[]) {
  console.log(pc.gray(`\nKewti-cli v1.0.0`));
  const fonts = await fetchRegistry("fonts-registry.json");

  if (!fontNames || fontNames.length === 0) {
    console.log(`\n💡 Available fonts:`);
    fonts.forEach((f: any) =>
      console.log(`  - ${pc.yellow(f.name)} ${pc.gray(`(${f.license || "OFL"})`)}`)
    );
    return;
  }

  for (const fontName of fontNames) {
    await installItem(fontName, fonts);
  }

  console.log(`\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Installed fonts!\n`);
}

async function handleLogoInstall(logoNames: string[]) {
  console.log(pc.gray(`\nKewti-cli v1.0.0`));
  const logos = await fetchRegistry("logos-registry.json");

  if (!logoNames || logoNames.length === 0) {
    console.log(`\n💡 Available logos:`);
    logos.forEach((logo: any) => console.log(`  - ${pc.yellow(logo.name)}`));
    return;
  }

  for (const logoName of logoNames) {
    await installItem(logoName, logos);
  }

  console.log(`\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Installed logo assets into src/kewti/logos/!\n`);
}

const program = new Command();
program.name("kewti").description("UI components, fonts and logo assets CLI").version("1.0.0");

async function runHandler(fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err: any) {
    if (process.exitCode === undefined) process.exitCode = 1;
  }
}

// Support Option 1 and general installs
program
  .command("install [items...]")
  .alias("add")
  .alias("i")
  .action(async (items: string[]) => {
    await runHandler(async () => {
      if (!items || items.length === 0) return await handleComponentInstall([]);

      // Option 1: "kewti add logo" installs the UI component KewtiLogo
      const first = items[0].toLowerCase();
      if (first === "logo" && items.length === 1) {
        return await handleComponentInstall(["logo"]);
      }

      // Font shortcut: "kewti add font <name>"
      if (first === "font") {
        return await handleFontInstall(items.slice(1));
      }

      // Logo download shortcut: "kewti add logos <name>"
      if (first === "logos") {
        return await handleLogoInstall(items.slice(1));
      }

      // Fallback: Check if item is in components registry; if not, check logos
      const components = await fetchRegistry("registry.json");
      const foundInComponents = components.some(
        (c: any) => c.name.toLowerCase() === items[0].toLowerCase()
      );

      if (foundInComponents) {
        await handleComponentInstall(items);
      } else {
        await handleLogoInstall(items);
      }
    });
  });

// Option 2: "npx kewti-cli logo <name>"
program
  .command("logo [logonames...]")
  .description("Download logo SVG/PNG assets locally into src/kewti/logos/")
  .action(async (logonames: string[]) => {
    await runHandler(async () => handleLogoInstall(logonames));
  });

program
  .command("font [fontnames...]")
  .description("Install fonts")
  .action(async (fontnames: string[]) => {
    await runHandler(async () => handleFontInstall(fontnames));
  });

program.parse();