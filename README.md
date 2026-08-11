# Kewti

Monorepo for Kewti UI components, Ethiopian/Ge'ez font distribution, CLI tool, registry, and documentation.

## Architecture

Managed with pnpm workspaces and Turborepo.

| Path | Description |
| :--- | :--- |
| `apps/kewti-docs` | Documentation site built with Next.js and Fumadocs. |
| `apps/registry` | Component and font JSON bundle generator for CLI distribution. |
| `apps/web` | Next.js web application and component showcase. |
| `packages/cli` | Kewti CLI tool package. |
| `packages/fonts` | Ethiopic font assets and font metadata. |
| `packages/ui` | Core React UI component implementations. |
| `packages/eslint-config` | Shared ESLint configurations. |
| `packages/typescript-config` | Shared TypeScript configurations. |

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/coderade1905/kewti-components.git
cd kewti-components
pnpm install
```

2. Run development servers:

```bash
pnpm dev
```

- Web Showcase: `http://localhost:3000`
- Documentation: `http://localhost:3001`
- Registry Server: `http://localhost:3333`

## Scripts

- `pnpm dev`: Start development servers across applications.
- `pnpm build`: Build all packages and applications via Turborepo.
- `pnpm lint`: Run ESLint across all packages and apps.
- `pnpm typecheck`: Run TypeScript compiler checks.
- `pnpm format`: Format files using Prettier.

## CLI Usage

### Add Components

```bash
npx kewti add kewti-calender
```

Components in `packages/ui`:
- `kewti-calender`: Ethiopian calendar, date pickers, and month animations.
- `kewti-time`: Ethiopic time displays and pickers.
- `kewti-inputs`: Ethiopian phone, TIN, and identity input fields.
- `kewti-location-selector`: Region, zone, and woreda dropdown selectors.
- `kewti-fonts`: Font loader utilities and typography wrappers.

### Add Fonts

```bash
npx kewti font Balderasu
```

Fonts in `packages/fonts`:
- `Balderasu`
- `Bela_Bereka`
- `Loga_Comic`
- `Selam`

## Contributing

Refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for workflow details, component authoring guidelines, and pull request procedures.

## License

MIT
