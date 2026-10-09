import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { uiRegistry } from "../registry-ui";
import { fontsRegistry } from "../registry-fonts";

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories setup
const UI_DIR = path.resolve(__dirname, "../../../packages/ui/src/components");
const FONTS_DIR = path.resolve(__dirname, "../../../packages/fonts");
const LOGOS_DIR = path.resolve(__dirname, "../../../packages/logos");
const OUT_DIR = path.resolve(__dirname, "../public");

function toTitleCase(str: string): string {
  return str
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

interface ComponentFileTarget {
  path: string;
  target: string;
}

interface FontFileTarget {
  path: string;
  target: string;
  type: "font" | "license" | string;
  variant?: string;
}

interface FontRegistryInputFile {
  file: string;
  variant?: string;
}

interface LogoRegistryItem {
  name: string;
  title: string;
  type: "registry:asset";
  files: {
    path: string;
    target: string;
    type: "asset";
  }[];
}

async function buildRegistry() {
  console.log("⏳ Building registry...");

  // Clean and prepare output directories
  await fs.rm(path.join(OUT_DIR, "components"), { recursive: true, force: true });
  await fs.rm(path.join(OUT_DIR, "fonts"), { recursive: true, force: true });
  await fs.rm(path.join(OUT_DIR, "logos"), { recursive: true, force: true });

  await fs.mkdir(path.join(OUT_DIR, "components"), { recursive: true });
  await fs.mkdir(path.join(OUT_DIR, "fonts"), { recursive: true });
  await fs.mkdir(path.join(OUT_DIR, "logos"), { recursive: true });

  const componentRegistryItems = [];
  const fontRegistryItems = [];
  const logoRegistryItems: LogoRegistryItem[] = [];

  // ==========================================
  // 1. Build Components Registry
  // ==========================================
  for (const item of uiRegistry) {
    const filesWithTarget: ComponentFileTarget[] = [];

    for (const file of item.files) {
      const sourcePath = path.join(UI_DIR, file);
      const destPath = path.join(OUT_DIR, "components", file);

      try {
        const content = await fs.readFile(sourcePath, "utf8");
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.writeFile(destPath, content);

        filesWithTarget.push({
          path: `components/${file}`,
          target: `src/kewti/ui/${file}`,
        });
      } catch (error) {
        console.error(`❌ Failed to read/write UI component: ${file}`);
        console.error(error);
        process.exit(1);
      }
    }

    componentRegistryItems.push({
      ...item,
      files: filesWithTarget,
    });
  }

  // ==========================================
  // 2. Build Fonts Registry
  // ==========================================
  for (const item of fontsRegistry) {
    const fontFolder = item.folder || item.name;
    const filesWithTarget: FontFileTarget[] = [];

    const fontFilesList: { fileName: string; variant?: string }[] = (
      item.files || []
    ).map((fileEntry: string | FontRegistryInputFile) => {
      if (typeof fileEntry === "string") {
        return { fileName: fileEntry, variant: "regular" };
      }
      return {
        fileName: fileEntry.file,
        variant: fileEntry.variant || "regular",
      };
    });

    if (
      item.licenseFile &&
      !fontFilesList.some((f) => f.fileName === item.licenseFile)
    ) {
      fontFilesList.push({ fileName: item.licenseFile, variant: undefined });
    }

    for (const { fileName, variant } of fontFilesList) {
      const sourcePath = path.join(FONTS_DIR, fontFolder, fileName);
      const destPath = path.join(OUT_DIR, "fonts", fontFolder, fileName);

      try {
        const content = await fs.readFile(sourcePath);
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.writeFile(destPath, content);

        const isLicense = fileName.toLowerCase().includes("license");
        filesWithTarget.push({
          path: `fonts/${fontFolder}/${fileName}`,
          target: `src/kewti/fonts/${fontFolder}/${fileName}`,
          type: isLicense ? "license" : "font",
          variant: variant || undefined,
        });
      } catch (error) {
        console.error(`❌ Failed to read/write font file: ${fontFolder}/${fileName}`);
        console.error(error);
        process.exit(1);
      }
    }

    fontRegistryItems.push({
      ...item,
      type: "registry:font",
      files: filesWithTarget,
    });
  }

  // ==========================================
  // 3. Build Logos Registry Directly From Folder
  // ==========================================
  try {
    const logoDirectories = await fs.readdir(LOGOS_DIR, { withFileTypes: true });

    for (const dirent of logoDirectories) {
      if (!dirent.isDirectory()) continue;

      const folderName = dirent.name;
      const folderPath = path.join(LOGOS_DIR, folderName);
      const filesInFolder = await fs.readdir(folderPath);

      // Support svg, png or both
      const validFiles = filesInFolder.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ext === ".svg" || ext === ".png";
      });

      if (validFiles.length === 0) continue;

      const filesMetadata = [];

      for (const fileName of validFiles) {
        const sourcePath = path.join(folderPath, fileName);
        const relativeDestPath = `logos/${folderName}/${fileName}`;
        const destPath = path.join(OUT_DIR, relativeDestPath);

        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(sourcePath, destPath);

        filesMetadata.push({
          path: relativeDestPath,
          target: `src/kewti/logos/${folderName}/${fileName}`,
          type: "asset" as const,
        });
      }

      logoRegistryItems.push({
        name: folderName,
        title: toTitleCase(folderName),
        type: "registry:asset",
        files: filesMetadata,
      });
    }
  } catch (error) {
    console.error(`❌ Failed to read logos directory: ${LOGOS_DIR}`);
    console.error(error);
    process.exit(1);
  }

  // ==========================================
  // 4. Output JSON Registry Files
  // ==========================================
  await fs.writeFile(
    path.join(OUT_DIR, "registry.json"),
    JSON.stringify({ items: componentRegistryItems }, null, 2)
  );

  await fs.writeFile(
    path.join(OUT_DIR, "fonts-registry.json"),
    JSON.stringify({ items: fontRegistryItems }, null, 2)
  );

  await fs.writeFile(
    path.join(OUT_DIR, "logos-registry.json"),
    JSON.stringify({ items: logoRegistryItems }, null, 2)
  );

  await fs.writeFile(
    path.join(OUT_DIR, "registry-combined.json"),
    JSON.stringify(
      { items: [...componentRegistryItems, ...fontRegistryItems, ...logoRegistryItems] },
      null,
      2
    )
  );

  console.log(`Registry built successfully! Total Logos: ${logoRegistryItems.length}`);
}

buildRegistry();