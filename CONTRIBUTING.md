# Contributing to Kewti

Thank you for contributing to **Kewti**! This guide covers monorepo setup, component authoring conventions, registry integration, font integration, and pull request workflows.

---

## Monorepo Architecture

Kewti is structured as a `pnpm` workspace powered by Turborepo:

| Path | Description |
| :--- | :--- |
| `packages/ui` | Core component library source (`packages/ui/src/components/`). |
| `packages/cli` | Kewti CLI package (`npx kewti-cli-cli add ...`). |
| `packages/fonts` | Optimized Ge'ez and Amharic web font assets. |
| `apps/registry` | Registry generator and JSON bundle builder for CLI distribution. |
| `apps/kewti-docs` | Documentation site built with Next.js and Fumadocs. |
| `apps/web` | Web app and visual showcase. |

---

## Prerequisites & Development Setup

- **Node.js**: `>= 20.0.0`
- **pnpm**: `>= 10.0.0`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/coderade1905/kewti.git
cd kewti-components
pnpm install
```

### 2. Run Development Mode

Start dev servers across workspace applications:

```bash
pnpm dev
```

### 3. Common Scripts

- `pnpm build`: Build all packages and apps via Turbo.
- `pnpm typecheck`: Run TypeScript compiler checks across all workspaces.
- `pnpm lint`: Run ESLint checks.
- `pnpm format`: Format files with Prettier.

---

## Component Authoring Workflow

When adding a new component or modifying an existing one:

### 1. Create the Component

Add your component implementation inside `packages/ui/src/components/kewti-<component-name>/`:

```
packages/ui/src/components/kewti-example/
├── component.tsx
├── types.ts (if needed)
└── utils.ts (if needed)
```

**Conventions:**
- Style exclusively with **Tailwind CSS**.
- Include `dark:` variants for theme support.

### 2. Register Component in Registry

Every UI component must be registered in `apps/registry/registry-ui.ts` so that the registry build script (`pnpm --filter registry build`) can process it into distribution JSON files (`registry.json` and `registry-combined.json`) used by the CLI.

#### Registry File Location
- File: `apps/registry/registry-ui.ts`

#### Registry Item Schema (`RegistryItem`)
Each item in the `uiRegistry` array must adhere to the `RegistryItem` type:

```typescript
export type RegistryItem = {
  name: string;                   // Component name (e.g., "kewti-example")
  type: "components:ui";          // Registry item type
  dependencies?: string[];        // Third-party npm dependencies
  registryDependencies?: string[];// Internal registry dependencies
  files: string[];                // Relative paths to component source files
};
```

#### Step-by-Step Registration Guide

1. **Add Entry to `uiRegistry`**:
   Open `apps/registry/registry-ui.ts` and add your component configuration to `uiRegistry`:

   ```typescript
   {
     name: "kewti-example",
     type: "components:ui",
     dependencies: ["lucide-react"],
     registryDependencies: ["kewti-fonts"],
     files: ["kewti-example/component.tsx"],
   }
   ```

2. **Configure Property Fields**:

   - **`name`** *(required)*: The unique component identifier (e.g., `"kewti-time"`, `"kewti-calender"`). Must match the component directory name in `packages/ui/src/components/`.
   - **`type`** *(required)*: Must be set to `"components:ui"`.
   - **`dependencies`** *(optional)*: Array of external **npm packages** required by this component (e.g., `["lucide-react", "kenat"]`). When installed via CLI (`npx kewti-cli-cli add <name>`), these npm packages are automatically installed in the user's project using their detected package manager (`pnpm`, `npm`, `yarn`, or `bun`).
   - **`registryDependencies`** *(optional)*: Array of internal **Kewti registry items** required by this component (e.g., `["kewti-fonts"]`). The CLI recursively fetches and installs these registry items prior to installing the component.
   - **`files`** *(required)*: Array of relative paths from `packages/ui/src/components/` for all source files comprising the component.
     - **Single-file component**:
       ```typescript
       files: ["kewti-example/component.tsx"]
       ```
     - **Multi-file component**:
       ```typescript
       files: [
         "kewti-calender/component.tsx",
         "kewti-calender/MonthAnimation.tsx",
         "kewti-calender/MonthAnimations/meskerem.tsx",
         // List all component source files...
       ]
       ```

   > [!NOTE]
   > The primary entry file for the component should be named `component.tsx` in the component root directory. This enables the CLI to automatically generate the barrel export in `src/kewti/ui/index.ts` upon installation.

### 3. Build & Test Registry Output

Run the registry build script to ensure JSON bundles build without errors:

```bash
pnpm --filter registry build
```

This generates distribution JSON outputs in `apps/registry/public/`.

### 4. Build CLI & Verify Fetching

Test CLI locally to confirm components resolve correctly:

```bash
pnpm --filter cli build
```

### 5. Document Component in Docs

Create an MDX file in `apps/kewti-docs/content/docs/components/kewti-<name>.mdx` containing:
- Live `<CodePlayground />` code example.
- Installation CLI command (`npx kewti-cli-cli add <name>`).
- Usage examples (Controlled, Uncontrolled, Amharic/English toggle, Props table).

---

## Font Authoring Workflow

To add a new Amharic / Ge'ez font to the Kewti registry and CLI:

### 1. Add Font Files

Create a directory inside `packages/fonts/<Font_Name>/` and place the font files and license:

```
packages/fonts/Balderasu/
├── Balderasu_Regular.ttf
└── license.txt
```

### 2. Register Font in Registry

Add an entry to `fontsRegistry` inside `apps/registry/registry-fonts.ts`:

```typescript
{
  name: "Balderasu",
  title: "Balderasu",
  folder: "Balderasu",
  license: "SIL Open Font License",
  licenseFile: "license.txt",
  fontType: "truetype", // "truetype" | "opentype" | "woff2"
  files: [
    {
      file: "Balderasu_Regular.ttf",
      variant: "regular",
    },
  ],
}
```

### 3. Build Registry Output

Run the registry build script to copy fonts into `apps/registry/public/fonts/` and generate `fonts-registry.json`:

```bash
pnpm --filter registry build
```

### 4. Test CLI Font Installation

Test installing the font locally via CLI:

```bash
npx kewti-cli-cli font <Font_Name>
```

---

## Pull Request Guidelines

1. **Branch Naming**: Use `feat/<name>`, `fix/<name>`, or `docs/<name>`.
2. **Pre-commit Checks**: Verify project builds and passes type checks before opening a PR:
   ```bash
   pnpm typecheck
   pnpm build
   ```
3. **Commit Messages**: Keep commit messages clear and imperative (e.g., `feat(ui): add kewti-datepicker component`).
4. **Scope**: Keep PRs focused. Avoid combining unrelated bug fixes with new component additions.
