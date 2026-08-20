#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { execa } from "execa";
import ora from "ora";
import pc from "picocolors";

const REGISTRY_URL = "https://kewti-registry.vercel.app";

// Track installed items to prevent duplicate processing
const installedItems = new Set<string>();

// Helper to exit gracefully without triggering Libuv assertion errors on Windows
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

// Detect package manager (pnpm, bun, yarn, npm)
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
  const barrelPath = path.resolve(
    process.cwd(),
    "src",
    "kewti/ui/index.ts"
  );

  if (!item || !item.files || item.files.length === 0) {
    console.warn(
      pc.yellow(`⚠️  No files found for item '${item?.name}', skipping barrel export.`)
    );
    return;
  }

  // 1. Locate main file entry point inside item files list
  const mainFile =
    item.files.find((f: any) => /component\.(ts|tsx)$/i.test(f.target)) ||
    item.files.find((f: any) => /index\.(ts|tsx)$/i.test(f.target)) ||
    item.files.find((f: any) => /\.(ts|tsx)$/i.test(f.target)) ||
    item.files[0];

  if (!mainFile?.target) {
    console.warn(pc.yellow(`⚠️  Could not determine target path for ${item.name}`));
    return;
  }

  // 2. Resolve absolute paths to derive exact target directory
  const absoluteTarget = path.resolve(process.cwd(), mainFile.target);
  const barrelDir = path.dirname(barrelPath);
  const targetDir = path.dirname(absoluteTarget);

  // 3. Extract target folder relative to `src/kewti/ui/`
  let relativeFolder = path.relative(barrelDir, targetDir).replace(/\\/g, "/");

  if (!relativeFolder || relativeFolder === ".") {
    const fileNameWithoutExt = path.basename(
      absoluteTarget,
      path.extname(absoluteTarget)
    );
    relativeFolder = fileNameWithoutExt;
  }

  // 4. Construct clean export string
  const exportLine = `export * from "./${relativeFolder}/component";\n`;

  let currentContent = "";
  try {
    currentContent = await fs.readFile(barrelPath, "utf8");
  } catch {
    // Directory or file doesn't exist yet
  }

  // 5. Append line if not already exported
  if (!currentContent.includes(`./${relativeFolder}/component`)) {
    await fs.mkdir(barrelDir, { recursive: true });
    await fs.writeFile(barrelPath, currentContent + exportLine, "utf8");
    console.log(pc.green(`Updated barrel export in src/kewti/ui/index.ts`));
  }
}

// Generic file & dependency installer
async function installItem(itemName: string, registryItems: any[]) {
  if (installedItems.has(itemName)) return;

  const item = registryItems.find(
    (c) => c.name.toLowerCase() === itemName.toLowerCase()
  );

  if (!item) {
    exitWithError(`\n❌ Item '${itemName}' not found in registry.`);
  }

  const pkgManager = await detectPackageManager();

  // 1. Recursive internal registry dependencies
  if (item.registryDependencies?.length) {
    for (const dep of item.registryDependencies) {
      await installItem(dep, registryItems);
    }
  }

  const isFont = item.type === "registry:font" || item.type === "font";
  console.log(
    `\nInstalling ${isFont ? "font" : "component"}: ${pc.cyan(itemName)}...`
  );

  // 2. Download and save files
  for (const file of item.files) {
    const fileUrl = `${REGISTRY_URL}/${file.path}`;

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch ${fileUrl}`);

      // Read binary buffer safely
      const arrayBuffer = await response.arrayBuffer();
      const contentBuffer = Buffer.from(arrayBuffer);

      let relativeTarget = file.target;
      const targetPath = path.resolve(process.cwd(), relativeTarget);

      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, contentBuffer);
      console.log(`Created ${relativeTarget}`);
    } catch (error) {
      exitWithError(`Failed to download ${file.path}`);
    }
  }

  // 3. Update barrel file only for UI components
  if (!isFont) {
    await updateBarrelExport(item);
  }

  // 4. Install npm dependencies
  if (item.dependencies?.length) {
    const installCmd = pkgManager === "yarn" ? "add" : "install";
    console.log(
      `📦 Installing npm dependencies using ${pc.cyan(pkgManager)}: ${item.dependencies.join(", ")}`
    );

    try {
      await execa(pkgManager, [installCmd, ...item.dependencies], {
        stdio: "inherit",
      });
    } catch (error) {
      exitWithError(`\nFailed to install npm dependencies for ${itemName}`);
    }
  }

  installedItems.add(itemName);
}

// Fetch helper with loading indicator
async function fetchRegistry(endpoint: string) {
  const spinner = ora(`Fetching registry...`).start();
  try {
    const response = await fetch(`${REGISTRY_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`Could not reach ${endpoint}`);
    const data = await response.json();
    spinner.succeed(`Registry loaded`);
    return data.items || [];
  } catch (error: any) {
    spinner.fail(pc.red(`Registry fetch failed.`));
    exitWithError(`\n❌ ${error.message}\n`);
  }
}

// Handler for font installation
async function handleFontInstall(fontNames: string[]) {
  console.log(pc.gray(`\nKewti-cli v1.0.0`));
  const fonts = await fetchRegistry("fonts-registry.json");

  if (!fontNames || fontNames.length === 0) {
    console.log(`\n💡 Please specify font name(s) to install:\n`);
    console.log(pc.bold("Available fonts:"));
    fonts.forEach((f: any) =>
      console.log(`  - ${pc.yellow(f.name)} ${pc.gray(`(${f.license || "OFL"})`)}`)
    );
    console.log(`\nRun: ${pc.cyan("npx kewti-cli install font <fontname>")}\n`);
    return;
  }

  // Auto-install fonts UI component first when installing fonts
  const components = await fetchRegistry("registry.json");
  await installItem("fonts", components);

  // Install all requested fonts sequentially
  for (const fontName of fontNames) {
    await installItem(fontName, fonts);
  }

  console.log(
    `\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Installed font(s): ${pc.bold(fontNames.join(", "))}! Component ${pc.cyan("fonts")} is ready.\n`
  );
}

// Handler for component installation
async function handleComponentInstall(componentNames: string[]) {
  console.log(pc.gray(`\nKewti-cli v1.0.0 `));
  const components = await fetchRegistry("registry.json");

  if (!componentNames || componentNames.length === 0) {
    console.log(`\n💡 Please specify component name(s) to install:\n`);
    console.log(pc.bold("Available components:"));
    components.forEach((c: any) => console.log(`  - ${pc.yellow(c.name)}`));
    console.log(`\nRun: ${pc.cyan("npx kewti-cli install <component>")}\n`);
    return;
  }

  // Install all requested components sequentially
  for (const componentName of componentNames) {
    await installItem(componentName, components);
  }

  console.log(
    `\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Component(s) ready to use: ${pc.bold(componentNames.join(", "))}\n`
  );
}

// CLI Commands Setup
const program = new Command();

program
  .name("kewti")
  .description("Add UI components and fonts to your project")
  .version("1.0.0");

// Main action runner wrapped in top-level catch to guarantee clean termination
async function runHandler(fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err: any) {
    if (process.exitCode === undefined) {
      process.exitCode = 1;
    }
  }
}

program
  .command("install [items...]")
  .alias("add")
  .alias("i")
  .description("Install components or fonts (e.g., kewti add comp1 comp2)")
  .action(async (items: string[]) => {
    await runHandler(async () => {
      if (!items || items.length === 0) {
        await handleComponentInstall([]);
        return;
      }

      if (items[0] === "font") {
        const fontArgs = items.slice(1);
        await handleFontInstall(fontArgs);
      } else {
        await handleComponentInstall(items);
      }
    });
  });

program
  .command("font [fontnames...]")
  .description("Install one or more fonts")
  .action(async (fontnames: string[]) => {
    await runHandler(async () => {
      await handleFontInstall(fontnames);
    });
  });

program.parse();