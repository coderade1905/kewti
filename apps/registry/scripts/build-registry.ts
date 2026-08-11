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
const OUT_DIR = path.resolve(__dirname, "../public");

// Type definitions for registry items
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

async function buildRegistry() {
  console.log("⏳ Building registry...");

  // 1. Clean and recreate output directories
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(path.join(OUT_DIR, "components"), { recursive: true });
  await fs.mkdir(path.join(OUT_DIR, "fonts"), { recursive: true });

  const componentRegistryItems = [];
  const fontRegistryItems = [];

  // 2. Build Components Registry
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
        console.error(`Failed to read/write UI component: ${file}`);
        console.error(error);
        process.exit(1);
      }
    }

    componentRegistryItems.push({
      ...item,
      files: filesWithTarget,
    });
  }

  // 3. Build Fonts Registry
  for (const item of fontsRegistry) {
    const fontFolder = item.folder || item.name; // Dedicated folder per font
    const filesWithTarget: FontFileTarget[] = [];

    // Normalize item.files to extract filename and optional variant
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

    // Handle separate license file if specified
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
        // Read without encoding parameter to handle binary font files properly
        const content = await fs.readFile(sourcePath);

        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.writeFile(destPath, content);

        const isLicense = fileName.toLowerCase().includes("license");

        const fileMetadata: FontFileTarget = {
          path: `fonts/${fontFolder}/${fileName}`,
          target: `src/kewti/fonts/${fontFolder}/${fileName}`,
          type: isLicense ? "license" : "font",
        };

        if (variant) {
          fileMetadata.variant = variant;
        }

        filesWithTarget.push(fileMetadata);
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

  // 4. Output JSON Registry Files
  // Output individual UI components registry
  await fs.writeFile(
    path.join(OUT_DIR, "registry.json"),
    JSON.stringify({ items: componentRegistryItems }, null, 2)
  );

  // Output dedicated fonts registry JSON
  await fs.writeFile(
    path.join(OUT_DIR, "fonts-registry.json"),
    JSON.stringify({ items: fontRegistryItems }, null, 2)
  );

  // Output unified master registry (UI + Fonts combined)
  await fs.writeFile(
    path.join(OUT_DIR, "registry-combined.json"),
    JSON.stringify({ items: [...componentRegistryItems, ...fontRegistryItems] }, null, 2)
  );

  console.log("Registry built successfully!");
  console.log(`Output located in: ${OUT_DIR}`);
}

buildRegistry();