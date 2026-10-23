// skill-templates.ts
// Embedded templates for Kewti AI skills and agent instruction files

export const SKILL_MD = `---
name: kewti
description: >-
  Instructs the AI agent how to use kewti-cli to discover available components,
  fonts, and logos, install them, and access their official documentation from Kewti Docs.
---

# Kewti AI Agent Skill: CLI & Documentation Guide

When developing with Kewti (**ቀውጢ**), you MUST use **\`kewti-cli\`** to inspect available components, fonts, and logos, and access their official documentation from **Kewti Docs**.

---

## 1. Discovering Available Components, Fonts & Logos

Use \`kewti-cli\` to discover what components, fonts, and brand logos are available:

\`\`\`bash
# List all available components, fonts, and logos
npx kewti-cli list

# List all available items as machine-readable JSON (includes dependencies, files, and docs URLs)
npx kewti-cli list --json

# Filter by resource type
npx kewti-cli list --type components
npx kewti-cli list --type fonts
npx kewti-cli list --type logos
\`\`\`

The \`--json\` output provides:
- **\`components\`**: Name, dependencies, registry dependencies, target files, and \`docsUrl\`.
- **\`fonts\`**: Name, license, font files, and \`docsUrl\`.
- **\`logos\`**: Brand name, title, asset files, and \`docsUrl\`.

---

## 2. Accessing Documentation from Kewti Docs

Always consult official Kewti documentation for component specifications, props, calendar/time invariants, and usage examples:

### Access via CLI:
\`\`\`bash
# View documentation overview and all guide URLs
npx kewti-cli docs

# View documentation overview as JSON
npx kewti-cli docs --json

# Read full documentation for any specific component, font, or logo
npx kewti-cli docs calendar
npx kewti-cli docs time
npx kewti-cli docs input
npx kewti-cli docs numerals
npx kewti-cli docs location-selector
npx kewti-cli docs select
npx kewti-cli docs spell
npx kewti-cli docs gursha
npx kewti-cli docs fonts
npx kewti-cli docs logos

# Read documentation as JSON (includes markdown content & docsUrl)
npx kewti-cli docs calendar --json
npx kewti-cli docs time --json
\`\`\`

### Inspect Component Details & Usage Snippets:
\`\`\`bash
# Inspect description, dependencies, files created, and copy-paste React snippet
npx kewti-cli info <name>

# Inspect in machine-readable JSON format
npx kewti-cli info <name> --json
\`\`\`

### Direct Kewti Docs Endpoints:
- **Kewti Docs Portal:** \`https://kewti-docs.vercel.app/docs\`
- **AI Complete Documentation Index:** \`https://kewti-docs.vercel.app/llms.txt\`
- **AI Full Reference Text:** \`https://kewti-docs.vercel.app/llms-full.txt\`
- **Component Docs:** \`https://kewti-docs.vercel.app/docs/components/<component-name>\`
- **Font Docs:** \`https://kewti-docs.vercel.app/docs/fonts/installation\`
- **Logo Docs:** \`https://kewti-docs.vercel.app/docs/logos/installation\`

---

## 3. Installing Components, Fonts & Logos

Install items directly into the project repository using \`kewti-cli\`:

\`\`\`bash
# Add a UI component into src/kewti/ui/<component>/
npx kewti-cli add <component-name>
# Examples:
npx kewti-cli add calendar
npx kewti-cli add time
npx kewti-cli add input
npx kewti-cli add numerals
npx kewti-cli add location-selector
npx kewti-cli add select
npx kewti-cli add spell
npx kewti-cli add gursha
npx kewti-cli add logo

# Install Ethiopic fonts into src/kewti/fonts/<font-name>/
npx kewti-cli font <FontName>
# Examples:
npx kewti-cli font Balderasu
npx kewti-cli font Selam

# Download Ethiopian brand/bank logos into src/kewti/logos/<logo-name>/
npx kewti-cli logo <logo-name>
# Example:
npx kewti-cli logo commercial_bank_of_ethiopia

# Preview installation without modifying files
npx kewti-cli add calendar --dry-run
\`\`\`

---

## 4. Import & Usage Conventions

- **UI Components:**
  \`\`\`tsx
  // Import from shared barrel:
  import { KewtiCalendar, KewtiDatePicker, KewtiTime, KewtiInput, KewtiNumerals, KewtiLocationSelector, KewtiLogo, KewtiGursha } from "@/kewti/ui";
  \`\`\`
- **Fonts:** Copied to \`src/kewti/fonts/<font-name>/\`
- **Logos:** Copied to \`src/kewti/logos/<logo-name>/\`
- **Client Components:** Interactive components using React hooks, animation, or browser events must include \`"use client"\` at the top.
`;

export const CURSOR_RULES = `# Kewti Cursor AI Rules

You are an expert pair programmer working with Kewti (ቀውጢ).

## How to Work with Kewti:

1. **Use kewti-cli to Discover Available Items**:
   - Run \`npx kewti-cli list\` or \`npx kewti-cli list --json\` to see available UI components, fonts, and logos.
   - Run \`npx kewti-cli list --type <components|fonts|logos>\` to filter.

2. **Access Documentation from Kewti Docs**:
   - Access component docs: \`npx kewti-cli docs <name>\` or \`npx kewti-cli docs <name> --json\`.
   - Inspect props and usage snippet: \`npx kewti-cli info <name> --json\`.
   - Online documentation: \`https://kewti-docs.vercel.app/docs\` and \`https://kewti-docs.vercel.app/llms.txt\`.

3. **Install Components & Assets via CLI**:
   - Add UI components: \`npx kewti-cli add <name>\` (e.g. \`calendar\`, \`time\`, \`input\`, \`numerals\`, \`location-selector\`, \`select\`, \`spell\`, \`gursha\`, \`logo\`).
   - Add fonts: \`npx kewti-cli font <name>\`.
   - Add brand logos: \`npx kewti-cli logo <name>\`.

4. **Code & Import Conventions**:
   - Barrel import: \`import { ... } from "@/kewti/ui";\`.
   - Add \`"use client"\` at the top of any interactive React component.
`;

export const COPILOT_INSTRUCTIONS = `# GitHub Copilot Instructions for Kewti

When working with Kewti in this workspace:
- Use \`npx kewti-cli list --json\` to discover available components, fonts, and logos.
- Use \`npx kewti-cli docs <name>\` and \`npx kewti-cli info <name> --json\` to access official Kewti documentation and props.
- Install components using \`npx kewti-cli add <component>\`.
- Install fonts using \`npx kewti-cli font <name>\`.
- Download logo assets using \`npx kewti-cli logo <name>\`.
- Import components from \`@/kewti/ui\`.
- Ensure all interactive components have \`"use client"\` at the top.
- Refer to Kewti Docs at https://kewti-docs.vercel.app/docs or /llms.txt.
`;

export const AGENTS_MD = `# Kewti AI Guidelines & Constraints

When implementing, modifying, or testing code in this workspace, follow these rules:

## 1. Discover Components, Fonts & Logos via kewti-cli
- Run \`npx kewti-cli list\` (or \`npx kewti-cli list --json\`) to view available components, fonts, and brand logos.
- Filter by type: \`npx kewti-cli list --type <components|fonts|logos>\`.

## 2. Access Documentation from Kewti Docs
- Access documentation for any component or resource: \`npx kewti-cli docs <name>\` (or \`--json\`).
- Inspect component dependencies and snippets: \`npx kewti-cli info <name> --json\`.
- Complete documentation & LLM indexes:
  - Portal: \`https://kewti-docs.vercel.app/docs\`
  - LLM Summary: \`https://kewti-docs.vercel.app/llms.txt\`
  - LLM Full Reference: \`https://kewti-docs.vercel.app/llms-full.txt\`

## 3. Installation Commands
- Components: \`npx kewti-cli add <component-name>\`
- Fonts: \`npx kewti-cli font <font-name>\`
- Logos: \`npx kewti-cli logo <logo-name>\`

## 4. Conventions
- Components are installed in \`src/kewti/ui/<component>/\` with barrel \`src/kewti/ui/index.ts\`.
- Import components via \`import { ... } from "@/kewti/ui"\`.
- Interactive client components must include \`"use client"\` at the top.
`;

export const CODEX_MD = `# Kewti – OpenAI Codex Guidelines

When generating code for Kewti, use \`kewti-cli\` and official documentation from Kewti Docs:

## 1. CLI Discovery
\`\`\`bash
# List all available components, fonts, and logos
npx kewti-cli list --json
\`\`\`

## 2. Access Documentation from Kewti Docs
\`\`\`bash
# Read documentation for a component
npx kewti-cli docs <name>
npx kewti-cli docs <name> --json

# Inspect component details and code snippet
npx kewti-cli info <name> --json

# Official docs: https://kewti-docs.vercel.app/docs (/llms.txt)
\`\`\`

## 3. Installation
\`\`\`bash
npx kewti-cli add <component>
npx kewti-cli font <font>
npx kewti-cli logo <logo>
\`\`\`

## 4. Import Conventions
\`\`\`tsx
import { KewtiCalendar, KewtiDatePicker, KewtiTime, KewtiInput, KewtiNumerals, KewtiLocationSelector, KewtiLogo, KewtiGursha } from "@/kewti/ui";
\`\`\`
Always ensure interactive React components include \`"use client"\`.
`;
