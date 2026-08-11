# Contributing to Kewti

Thank you for contributing to **Kewti**! This guide covers monorepo setup, component authoring conventions, registry integration, font integration, and pull request workflows.

---

## Monorepo Architecture

Kewti is structured as a `pnpm` workspace powered by Turborepo:

| Path | Description |
| :--- | :--- |
| `packages/ui` | Core component library source (`packages/ui/src/components/`). |
| `packages/cli` | Kewti CLI package (`npx kewti-cli add ...`). |
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

Add an entry to `apps/registry/registry-ui.ts`:

```typescript
{
  name: "kewti-example",
  type: "components:ui",
  dependencies: ["lucide-react"],
  registryDependencies: ["kewti-fonts"],
  files: ["kewti-example/component.tsx"],
}
```

#### Understanding Registry Dependency Fields:

- `dependencies`: External **npm packages** required by this component (e.g., `["lucide-react", "kenat"]`). When installed via CLI, `npx kewti-cli` automatically installs these npm packages in the user's project using `pnpm`, `npm`, `yarn`, or `bun`.
- `registryDependencies`: Internal **Kewti registry items** that this component relies on (e.g., `["kewti-fonts"]`). The CLI recursively resolves and downloads these internal dependencies from the registry before installing the component.

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
- Installation CLI command (`npx kewti-cli add <name>`).
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
npx kewti-cli font <Font_Name>
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
