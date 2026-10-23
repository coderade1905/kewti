#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";
import ora from "ora";
import pc from "picocolors";
import {
  SKILL_MD,
  CURSOR_RULES,
  COPILOT_INSTRUCTIONS,
  AGENTS_MD,
  CODEX_MD,
} from "./skill-templates";

const REGISTRY_URL = "https://kewti-registry.vercel.app";
const DOCS_BASE_URL = process.env.KEWTI_DOCS_URL || "https://kewti-docs.vercel.app";

const DOCS_MAP: Record<string, { path: string; localPath: string; title: string }> = {
  calendar: {
    path: "/docs/components/kewti-calender",
    localPath: "apps/kewti-docs/content/docs/components/kewti-calender.mdx",
    title: "Kewti Calendar & DatePicker",
  },
  time: {
    path: "/docs/components/kewti-time",
    localPath: "apps/kewti-docs/content/docs/components/kewti-time.mdx",
    title: "Kewti Time",
  },
  input: {
    path: "/docs/components/kewti-input",
    localPath: "apps/kewti-docs/content/docs/components/kewti-input.mdx",
    title: "Kewti Input & Transliteration",
  },
  numerals: {
    path: "/docs/components/kewti-numerals",
    localPath: "apps/kewti-docs/content/docs/components/kewti-numerals.mdx",
    title: "Kewti Numerals & Words",
  },
  "location-selector": {
    path: "/docs/components/kewti-location-selector",
    localPath: "apps/kewti-docs/content/docs/components/kewti-location-selector.mdx",
    title: "Kewti Location Selector",
  },
  select: {
    path: "/docs/components/kewti-select",
    localPath: "apps/kewti-docs/content/docs/components/kewti-select.mdx",
    title: "Kewti Select",
  },
  spell: {
    path: "/docs/components/kewti-spell",
    localPath: "apps/kewti-docs/content/docs/components/kewti-spell.mdx",
    title: "Kewti Spell",
  },
  gursha: {
    path: "/docs/components/kewti-gursha",
    localPath: "apps/kewti-docs/content/docs/components/kewti-gursha.mdx",
    title: "Kewti Gursha (Creator Tipping)",
  },
  fonts: {
    path: "/docs/fonts/installation",
    localPath: "apps/kewti-docs/content/docs/fonts/installation.mdx",
    title: "Ethiopic Fonts",
  },
  logo: {
    path: "/docs/logos/installation",
    localPath: "apps/kewti-docs/content/docs/logos/installation.mdx",
    title: "Kewti Logos",
  },
  logos: {
    path: "/docs/logos/installation",
    localPath: "apps/kewti-docs/content/docs/logos/installation.mdx",
    title: "Kewti Logos",
  },
  installation: {
    path: "/docs/installation",
    localPath: "apps/kewti-docs/content/docs/installation.mdx",
    title: "Installation & Setup",
  },
  skill: {
    path: "/docs/ai-skills",
    localPath: "apps/kewti-docs/content/docs/ai-skills.mdx",
    title: "AI Agent Skills",
  },
};

function getDocsInfo(name: string) {
  const cleanName = name.toLowerCase().replace(/^kewti-/, "");
  const entry = DOCS_MAP[cleanName] || DOCS_MAP[name.toLowerCase()];
  if (entry) {
    return {
      name: cleanName,
      title: entry.title,
      docsUrl: `${DOCS_BASE_URL}${entry.path}`,
      markdownUrl: `${DOCS_BASE_URL}/llms.mdx${entry.path}/content.md`,
      localPath: entry.localPath,
    };
  }
  return {
    name: cleanName,
    title: name,
    docsUrl: `${DOCS_BASE_URL}/docs`,
    markdownUrl: `${DOCS_BASE_URL}/llms.txt`,
    localPath: "apps/kewti-docs/content/docs/index.mdx",
  };
}

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

    let contentBuffer: Buffer | null = null;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(fileUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        contentBuffer = Buffer.from(arrayBuffer);
      }
    } catch {}

    // Fallback: Check local monorepo paths if remote fetch failed or offline
    if (!contentBuffer) {
      const localCandidates = [
        path.resolve(process.cwd(), "apps/registry/public", remotePath),
        path.resolve(process.cwd(), "../../apps/registry/public", remotePath),
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../apps/registry/public", remotePath),
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../packages/ui/src", remotePath.replace(/^components\//, "components/")),
      ];
      for (const candidate of localCandidates) {
        if (await fileExists(candidate)) {
          try {
            contentBuffer = await fs.readFile(candidate);
            break;
          } catch {}
        }
      }
    }

    if (!contentBuffer) {
      exitWithError(`Failed to download ${remotePath}`);
    }

    let relativeTarget = file.target || `src/kewti/fonts/${item.folder}/${file.file}`;
    const targetPath = path.resolve(process.cwd(), relativeTarget);

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, contentBuffer);
    console.log(pc.green(`  └ Created ${relativeTarget}`));
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

async function fetchRegistry(endpoint: string, silent = false) {
  const spinner = silent ? null : ora(`Fetching registry (${endpoint})...`).start();

  // 1. Try remote fetch
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(`${REGISTRY_URL}/${endpoint}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (response.ok) {
      const data = await response.json();
      if (spinner) spinner.succeed(`Registry loaded`);
      return data.items || data || [];
    }
  } catch (error: any) {
    // Network failed or timed out, gracefully check local registry fallback
  }

  // 2. Check local fallback paths
  const possiblePaths = [
    path.resolve(process.cwd(), "apps/registry/public", endpoint),
    path.resolve(process.cwd(), "../apps/registry/public", endpoint),
    path.resolve(process.cwd(), "../../apps/registry/public", endpoint),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../apps/registry/public", endpoint),
  ];

  for (const localPath of possiblePaths) {
    if (await fileExists(localPath)) {
      try {
        const raw = await fs.readFile(localPath, "utf8");
        const data = JSON.parse(raw);
        if (spinner) spinner.succeed(`Loaded registry from local cache`);
        return data.items || data || [];
      } catch {}
    }
  }

  if (spinner) spinner.fail(pc.red(`Registry fetch failed.`));
  exitWithError(`\n❌ Could not reach ${endpoint} and no local fallback found.\n`);
}

// Handlers
async function handleComponentInstall(componentNames: string[], options: { dryRun?: boolean } = {}) {
  console.log(pc.gray(`\nKewti-cli v1.1.0`));
  const components = await fetchRegistry("registry.json");

  if (!componentNames || componentNames.length === 0) {
    console.log(`\n💡 Please specify component name(s) to install.\n`);
    return;
  }

  if (options.dryRun) {
    console.log(pc.yellow(`[DRY RUN] Previewing installation:`));
    for (const name of componentNames) {
      const cleanName = name.toLowerCase().replace(/^kewti-/, "");
      const item = components.find(
        (c: any) => c.name.toLowerCase() === name.toLowerCase() || c.name.toLowerCase() === cleanName
      );
      if (!item) {
        console.log(pc.red(`  ❌ '${name}' not found in registry.`));
      } else {
        console.log(pc.cyan(`  ✔ Component: ${item.name}`));
        console.log(`    Files: ${item.files.map((f: any) => f.target || f.path).join(", ")}`);
        if (item.dependencies?.length) {
          console.log(`    Dependencies: ${item.dependencies.join(", ")}`);
        }
      }
    }
    return;
  }

  for (const componentName of componentNames) {
    await installItem(componentName, components);
  }

  console.log(`\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Components ready!\n`);
}

async function handleFontInstall(fontNames: string[]) {
  console.log(pc.gray(`\nKewti-cli v1.1.0`));
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
  console.log(pc.gray(`\nKewti-cli v1.1.0`));
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

async function handleDocs(name?: string, options: { json?: boolean } = {}) {
  const isJson = options.json ?? false;

  if (!name) {
    const docsOverview = {
      docsUrl: `${DOCS_BASE_URL}/docs`,
      llmsTxt: `${DOCS_BASE_URL}/llms.txt`,
      llmsFullTxt: `${DOCS_BASE_URL}/llms-full.txt`,
      topics: Object.entries(DOCS_MAP).map(([key, val]) => ({
        topic: key,
        title: val.title,
        docsUrl: `${DOCS_BASE_URL}${val.path}`,
      })),
    };

    if (isJson) {
      console.log(JSON.stringify(docsOverview, null, 2));
      return;
    }

    console.log(pc.bold(pc.cyan(`\n📖 Kewti Documentation & Guides:`)));
    console.log(`Documentation Hub: ${pc.green(`${DOCS_BASE_URL}/docs`)}`);
    console.log(`AI llms.txt:       ${pc.yellow(`${DOCS_BASE_URL}/llms.txt`)}`);
    console.log(`AI llms-full.txt:  ${pc.yellow(`${DOCS_BASE_URL}/llms-full.txt`)}`);
    console.log(pc.bold(`\nComponent & Topic Documentation:`));
    for (const [key, val] of Object.entries(DOCS_MAP)) {
      console.log(`  - ${pc.cyan(key.padEnd(20))} ${pc.gray(`${DOCS_BASE_URL}${val.path}`)}`);
    }
    console.log(`\n💡 To view component documentation directly in your terminal:`);
    console.log(`  ${pc.green("npx kewti-cli docs <name>")}`);
    console.log(`  ${pc.green("npx kewti-cli docs <name> --json")}\n`);
    return;
  }

  const docInfo = getDocsInfo(name);
  let content = "";

  const possibleLocalPaths = [
    path.resolve(process.cwd(), docInfo.localPath),
    path.resolve(process.cwd(), "..", docInfo.localPath),
    path.resolve(process.cwd(), "../..", docInfo.localPath),
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..", docInfo.localPath),
  ];

  for (const lp of possibleLocalPaths) {
    if (await fileExists(lp)) {
      try {
        content = await fs.readFile(lp, "utf8");
        break;
      } catch {}
    }
  }

  if (!content) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(docInfo.markdownUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        content = await res.text();
      }
    } catch {}
  }

  if (isJson) {
    console.log(
      JSON.stringify(
        {
          name: docInfo.name,
          title: docInfo.title,
          docsUrl: docInfo.docsUrl,
          markdownUrl: docInfo.markdownUrl,
          content: content || `See online documentation at ${docInfo.docsUrl}`,
        },
        null,
        2
      )
    );
    return;
  }

  console.log(pc.bold(pc.cyan(`\n📖 Kewti Docs: ${docInfo.title}`)));
  console.log(`Documentation URL: ${pc.green(docInfo.docsUrl)}`);
  console.log(`Markdown URL:      ${pc.gray(docInfo.markdownUrl)}`);
  if (content) {
    console.log(pc.bold(`\n--- Documentation Content ---\n`));
    console.log(content.trim());
    console.log(pc.bold(`\n--- End of Documentation ---\n`));
  } else {
    console.log(`\nAccess full documentation and examples at: ${pc.green(docInfo.docsUrl)}\n`);
  }
}

async function handleSkillInstall(agent = "all", options: { dryRun?: boolean } = {}) {
  console.log(pc.gray(`\nKewti-cli v1.1.0`));
  console.log(pc.bold(pc.cyan(`🤖 Adding Kewti Skill to AI Agent (${agent})...\n`)));

  const cwd = process.cwd();
  const normalized = agent.toLowerCase();

  const filesToWrite: { path: string; content: string; desc: string }[] = [];

  const shouldInstallAntigravity = normalized === "all" || normalized === "antigravity" || normalized === "agy";
  const shouldInstallCursor = normalized === "all" || normalized === "cursor";
  const shouldInstallCopilot = normalized === "all" || normalized === "copilot" || normalized === "github";
  const shouldInstallClaude = normalized === "all" || normalized === "claude" || normalized === "agents";
  const shouldInstallCodex = normalized === "all" || normalized === "codex" || normalized === "openai";

  if (shouldInstallAntigravity) {
    filesToWrite.push(
      { path: ".agents/skills/kewti/SKILL.md", content: SKILL_MD, desc: "Antigravity Kewti Skill" }
    );
  }

  if (shouldInstallCursor) {
    filesToWrite.push(
      { path: ".cursorrules", content: CURSOR_RULES, desc: "Cursor Rules (.cursorrules)" },
      { path: ".cursor/rules/kewti.mdc", content: CURSOR_RULES, desc: "Cursor Rules Directory (.cursor/rules/kewti.mdc)" }
    );
  }

  if (shouldInstallCopilot) {
    filesToWrite.push(
      { path: ".github/copilot-instructions.md", content: COPILOT_INSTRUCTIONS, desc: "GitHub Copilot Instructions" }
    );
  }

  if (shouldInstallClaude) {
    filesToWrite.push(
      { path: "CLAUDE.md", content: AGENTS_MD, desc: "Claude Project Guide (CLAUDE.md)" },
      { path: "AGENTS.md", content: AGENTS_MD, desc: "Universal Agent Guidelines (AGENTS.md)" }
    );
  }

  if (shouldInstallCodex) {
    filesToWrite.push(
      { path: "CODEX.md", content: CODEX_MD, desc: "OpenAI Codex / Codex CLI Guidelines (CODEX.md)" }
    );
  }

  if (options.dryRun) {
    console.log(pc.yellow(`[DRY RUN] Would create the following skill files:`));
    for (const f of filesToWrite) {
      console.log(`  - ${pc.green(f.path)} (${f.desc})`);
    }
    return;
  }

  for (const f of filesToWrite) {
    const fullPath = path.resolve(cwd, f.path);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, f.content.trim() + "\n", "utf8");
    console.log(pc.green(`  ✔ Created ${f.path}`) + pc.gray(` (${f.desc})`));
  }

  console.log(`\n🎉 ${pc.bgGreen(pc.black(" SUCCESS "))} Kewti skill installed successfully!`);
  console.log(pc.bold(`\n💡 How to use with your AI Agent:`));
  console.log(`  • The agent will use 'npx kewti-cli list' to see available components, fonts, and logos.`);
  console.log(`  • The agent will use 'npx kewti-cli docs <name>' to access official documentation from Kewti Docs.`);
  console.log(`  • The agent will use 'npx kewti-cli add <component>' to install components into your project.\n`);
}

const program = new Command();
program.name("kewti").description("UI components, fonts and logo assets CLI").version("1.1.0");

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
  .option("-d, --dry-run", "Preview installation without modifying files or dependencies")
  .action(async (items: string[], cmdOptions: { dryRun?: boolean }) => {
    await runHandler(async () => {
      if (!items || items.length === 0) return await handleComponentInstall([], cmdOptions);

      // Option 1: "kewti add logo" installs the UI component KewtiLogo
      const first = items[0].toLowerCase();
      if (first === "logo" && items.length === 1) {
        return await handleComponentInstall(["logo"], cmdOptions);
      }

      // Skill shortcut: "kewti add skill [agent]"
      if (first === "skill" || first === "agent") {
        const agentTarget = items[1] || "all";
        return await handleSkillInstall(agentTarget, cmdOptions);
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
      const components = await fetchRegistry("registry.json", false);
      const foundInComponents = components.some(
        (c: any) => c.name.toLowerCase() === items[0].toLowerCase()
      );

      if (foundInComponents) {
        await handleComponentInstall(items, cmdOptions);
      } else {
        await handleLogoInstall(items);
      }
    });
  });

// Dedicated skill command: "npx kewti-cli skill"
program
  .command("skill [agent]")
  .alias("agent")
  .description("Add Kewti AI skill to your project (for Antigravity, Cursor, Copilot, Claude, Codex, or all)")
  .option("-a, --agent <type>", "Target AI agent: 'antigravity', 'cursor', 'copilot', 'claude', 'codex', or 'all'", "all")
  .option("-d, --dry-run", "Preview files that would be created without writing")
  .action(async (agentParam: string | undefined, cmdOptions: { agent?: string; dryRun?: boolean }) => {
    await runHandler(async () => {
      const selectedAgent = agentParam || cmdOptions.agent || "all";
      await handleSkillInstall(selectedAgent, cmdOptions);
    });
  });

// List command optimized for AI agents & CLI exploration
program
  .command("list")
  .alias("ls")
  .description("List available UI components, fonts, and brand logos")
  .option("-j, --json", "Output results as machine-readable JSON for AI agents")
  .option("-t, --type <type>", "Filter by 'components', 'fonts', or 'logos'")
  .action(async (options: { json?: boolean; type?: string }) => {
    await runHandler(async () => {
      const isJson = options.json ?? false;
      const filterType = options.type?.toLowerCase();

      const [components, fonts, logos] = await Promise.all([
        filterType && filterType !== "components" ? [] : fetchRegistry("registry.json", isJson),
        filterType && filterType !== "fonts" ? [] : fetchRegistry("fonts-registry.json", isJson),
        filterType && filterType !== "logos" ? [] : fetchRegistry("logos-registry.json", isJson),
      ]);

      if (isJson) {
        console.log(
          JSON.stringify(
            {
              components: components.map((c: any) => ({
                name: c.name,
                type: "component",
                dependencies: c.dependencies || [],
                registryDependencies: c.registryDependencies || [],
                files: c.files?.map((f: any) => f.target || f.path) || [],
                docsUrl: `${DOCS_BASE_URL}${DOCS_MAP[c.name.toLowerCase()]?.path || `/docs/components/kewti-${c.name.toLowerCase()}`}`,
              })),
              fonts: fonts.map((f: any) => ({
                name: f.name,
                type: "font",
                license: f.license || "OFL",
                files: f.files?.map((file: any) => file.target || file.path) || [],
                docsUrl: `${DOCS_BASE_URL}/docs/fonts/installation`,
              })),
              skills: [
                {
                  name: "skill",
                  type: "skill",
                  description: "Kewti AI agent skill instructing the agent to use kewti-cli and access Kewti docs.",
                  command: "npx kewti-cli skill",
                  docsUrl: `${DOCS_BASE_URL}/docs/ai-skills`,
                  files: [
                    ".agents/skills/kewti/SKILL.md",
                    ".cursorrules",
                    ".github/copilot-instructions.md",
                    "AGENTS.md",
                    "CODEX.md"
                  ]
                }
              ],
              logos: logos.map((l: any) => ({
                name: l.name,
                title: l.title,
                type: "logo",
                files: l.files?.map((f: any) => f.target || f.path) || [],
                docsUrl: `${DOCS_BASE_URL}/docs/logos/installation`,
              })),
            },
            null,
            2
          )
        );
        return;
      }

      console.log(pc.bold(pc.cyan(`\nKewti Available Items:`)));
      console.log(pc.bold(`\n🤖 AI Skills:`));
      console.log(`  - ${pc.magenta("skill")} ${pc.gray("(install AI skill via: npx kewti-cli skill)")}`);
      if (components.length > 0) {
        console.log(pc.bold(`\n📦 UI Components:`));
        components.forEach((c: any) => {
          const deps = c.dependencies?.length ? pc.gray(` [deps: ${c.dependencies.join(", ")}]`) : "";
          console.log(`  - ${pc.green(c.name)}${deps}`);
        });
      }
      if (fonts.length > 0) {
        console.log(pc.bold(`\n🔤 Fonts:`));
        fonts.forEach((f: any) => {
          console.log(`  - ${pc.yellow(f.name)} ${pc.gray(`(${f.license || "OFL"})`)}`);
        });
      }
      if (logos.length > 0) {
        console.log(pc.bold(`\n🎨 Brand Logos (${logos.length}):`));
        logos.slice(0, 15).forEach((l: any) => console.log(`  - ${pc.magenta(l.name)}`));
        if (logos.length > 15) {
          console.log(pc.gray(`  ... and ${logos.length - 15} more (use --json to view all)`));
        }
      }
      console.log(pc.bold(`\n📖 Documentation:`));
      console.log(`  Read docs via CLI:  ${pc.green("npx kewti-cli docs <name>")}`);
      console.log(`  Browse online docs: ${pc.cyan(`${DOCS_BASE_URL}/docs`)}\n`);
    });
  });

// Info command for inspectable component documentation & snippets
program
  .command("info <name>")
  .description("Inspect component/font/logo details and copy-paste usage snippet")
  .option("-j, --json", "Output details as machine-readable JSON for AI agents")
  .action(async (name: string, options: { json?: boolean }) => {
    await runHandler(async () => {
      const isJson = options.json ?? false;
      const cleanName = name.toLowerCase().replace(/^kewti-/, "");

      if (cleanName === "skill" || cleanName === "agent") {
        const skillInfo = {
          name: "skill",
          type: "skill",
          description: "Kewti AI agent skill instructing the agent to use kewti-cli and access Kewti docs.",
          docsUrl: `${DOCS_BASE_URL}/docs/ai-skills`,
          dependencies: [],
          registryDependencies: [],
          files: [
            ".agents/skills/kewti/SKILL.md",
            ".cursorrules",
            ".cursor/rules/kewti.mdc",
            ".github/copilot-instructions.md",
            "AGENTS.md",
            "CLAUDE.md",
            "CODEX.md"
          ],
          snippet: "# Add Kewti skill to your AI agent:\nnpx kewti-cli skill\n# Or add for a specific agent:\nnpx kewti-cli skill cursor\nnpx kewti-cli skill antigravity\nnpx kewti-cli skill codex",
        };

        if (isJson) {
          console.log(JSON.stringify(skillInfo, null, 2));
          return;
        }

        console.log(pc.bold(pc.cyan(`\nKewti Item Info: skill`)));
        console.log(`Type: AI Agent Skill`);
        console.log(`Documentation: ${pc.cyan(skillInfo.docsUrl)}`);
        console.log(`Description: ${pc.white(skillInfo.description)}`);
        console.log(`Files created:\n  - ${skillInfo.files.join("\n  - ")}`);
        console.log(pc.bold(`\nCLI Command:`));
        console.log(pc.green(`npx kewti-cli skill`));
        console.log("");
        return;
      }

      const [components, fonts, logos] = await Promise.all([
        fetchRegistry("registry.json", isJson),
        fetchRegistry("fonts-registry.json", isJson),
        fetchRegistry("logos-registry.json", isJson),
      ]);

      const comp = components.find(
        (c: any) => c.name.toLowerCase() === name.toLowerCase() || c.name.toLowerCase() === cleanName
      );
      const font = fonts.find(
        (f: any) => f.name.toLowerCase() === name.toLowerCase() || f.name.toLowerCase() === cleanName
      );
      const logo = logos.find(
        (l: any) => l.name.toLowerCase() === name.toLowerCase() || l.name.toLowerCase() === cleanName
      );

      const item = comp || font || logo;
      if (!item) {
        exitWithError(`Item '${name}' not found in registry.`);
      }

      const itemType = comp ? "component" : font ? "font" : "logo";

      const snippetMap: Record<string, string> = {
        calendar: `import { KewtiCalendar, KewtiDatePicker } from "@/kewti/ui";\n\n<KewtiDatePicker calendarPref="ethiopian" />`,
        time: `import { KewtiTime } from "@/kewti/ui";\n\n<KewtiTime value={{ hour: 9, minute: 0 }} onChange={console.log} mode="eth" />`,
        input: `import { KewtiInput } from "@/kewti/ui";\n\n<KewtiInput placeholder="ስምዎን ያስገቡ..." defaultLanguage="am" showVoiceInput={true} />`,
        numerals: `import { KewtiNumerals, toGeez, toAmharicWords } from "@/kewti/ui";\n\n<KewtiNumerals value={1250} system="geez" />`,
        "location-selector": `import { KewtiLocationSelector } from "@/kewti/ui";\n\n<KewtiLocationSelector onLocationChange={console.log} />`,
        select: `import { KewtiSelect } from "@/kewti/ui";\n\n<KewtiSelect placeholder="ይምረጡ..." />`,
        logo: `import { KewtiLogo } from "@/kewti/ui";\n\n<KewtiLogo name="commercial_bank_of_ethiopia" className="h-8" />`,
        spell: `import { KewtiSpell } from "@/kewti/ui/kewti-spell/component";\n\n<KewtiSpell><input /></KewtiSpell>`,
        fonts: `import { KewtiFonts, KewtiPronounce } from "@/kewti/ui";\n\n<KewtiPronounce text="ሰላም">ሰላም</KewtiPronounce>`,
        gursha: `import { KewtiGursha } from "@/kewti/ui";\n\n<KewtiGursha handle="kewti" text="ቡና ግዙ" variant="gursha" />`,
      };

      const snippet = snippetMap[item.name.toLowerCase()] || `import { KewtiLogo } from "@/kewti/ui";\n\n<KewtiLogo name="${item.name}" />`;

      const defaultDescriptions: Record<string, string> = {
        calendar: "Complete Ethiopian calendar & date picker with 13 months, Kenat date arithmetic, holiday badges, and animated month artwork.",
        time: "Ethiopian 12-hour cyclical time picker (ጠዋት, ከሰዓት, ምሽት, ሌሊት) with standard 24-hour time conversion.",
        input: "Phonetic Amharic input with real-time Latin-to-Ge'ez transliteration, voice dictation, Kebele/TIN formatting, and fuzzy spellchecking.",
        numerals: "Ge'ez numeral converter and spelled-out Amharic word translator with Birr and Santim currency support.",
        "location-selector": "Ethiopian administrative location selector with cascading Region, Zone/Subcity, and Woreda dropdowns.",
        select: "Searchable dropdown select component with support for remote API data sources and icons.",
        spell: "Fuzzy dictionary spellchecker for Ge'ez/Amharic words with autocorrection dropdown.",
        logo: "Vector brand logo component for Ethiopian commercial banks, telecom, government agencies, and tech brands.",
        fonts: "Ethiopic font preview wrappers and audio pronunciation component using Web Speech API.",
        gursha: "Ethiopian tipping and 'Buy Me a Coffee' button integrated with Gursha Plus profiles.",
      };

      const resolvedDescription =
        item.description ||
        defaultDescriptions[item.name.toLowerCase()] ||
        (itemType === "component" ? "Ethiopian localized UI component" : itemType === "logo" ? "Ethiopian brand logo asset" : "Ethiopic typography font");

      const itemDocs = getDocsInfo(item.name);

      if (isJson) {
        console.log(
          JSON.stringify(
            {
              name: item.name,
              type: itemType,
              description: resolvedDescription,
              docsUrl: itemDocs.docsUrl,
              dependencies: item.dependencies || [],
              registryDependencies: item.registryDependencies || [],
              files: item.files?.map((f: any) => f.target || f.path) || [],
              snippet,
            },
            null,
            2
          )
        );
        return;
      }

      console.log(pc.bold(pc.cyan(`\nKewti Item Info: ${item.name}`)));
      console.log(`Type: ${itemType}`);
      console.log(`Documentation: ${pc.cyan(itemDocs.docsUrl)}`);
      if (item.description) {
        console.log(`Description: ${pc.white(item.description)}`);
      }
      if (item.dependencies?.length) {
        console.log(`NPM Dependencies: ${pc.yellow(item.dependencies.join(", "))}`);
      }
      if (item.registryDependencies?.length) {
        console.log(`Registry Dependencies: ${pc.yellow(item.registryDependencies.join(", "))}`);
      }
      console.log(`Files created:\n  - ${item.files.map((f: any) => f.target || f.path).join("\n  - ")}`);
      console.log(pc.bold(`\nUsage Snippet:`));
      console.log(pc.green(snippet));
      console.log("");
    });
  });

// Dedicated docs command: "npx kewti-cli docs [name]"
program
  .command("docs [name]")
  .alias("doc")
  .description("Access official Kewti documentation and guides from Kewti Docs")
  .option("-j, --json", "Output documentation details as machine-readable JSON for AI agents")
  .action(async (name?: string, options?: { json?: boolean }) => {
    await runHandler(async () => {
      await handleDocs(name, options);
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