# Kewti 🕺💃🔥

> **Kewti** (**ቀውጢ**) is modern Amharic urban slang for *"awesome"*, *"lit"*, or *"fire"*. It describes something crafted with exceptional style, energy, and quality.

**Kewti** is a CLI tool built to bring polished, accessible, and localized UI components (Ethiopian calendars, Ge'ez/Amharic phonetic input, themes, and fonts) directly into your app in seconds.

---

## Quick Start

Add components directly to your project codebase via `npx`:

```bash
# Add the Ethiopian Calendar & DatePicker
npx kewti-cli add calendar

# Add Input with Amharic Transliteration
npx kewti-cli add input

```

---

## Why Kewti?

Building web applications for Ethiopian users usually requires solving complex, repetitive problems: converting between Gregorian and Ethiopian dates, implementing phonetic typing for the Ge'ez script, and configuring localized typography.

Kewti solves these problems at the component level:

* 🎨 **Ethiopian Design Aesthetic:** Tailored themes out of the box.
* 📦 **CLI-Driven & Copy-Paste Ready:** Run `npx kewti-cli` to inject component source code directly into your repository—giving you **100% ownership** of the code.
* ♿ **Themeable & Accessible:** Built with Tailwind CSS, supporting automatic light/dark modes and keyboard navigation.

---

## Example Usage

Once added to your codebase, import and use the components directly:

```tsx
import { KewtiCalendar, KewtiInput } from "@/kewti/ui";

export default function App() {
  return (
    <main className="p-8 space-y-6">
      <KewtiInput placeholder="ስምዎን ያስገቡ..."/>
      <KewtiCalendar calendarPref="ethiopian"/>
    </main>
  );
}

```

---

## Ecosystem Overview

| Module | Description |
| --- | --- |
| **Components** | Pre-built UI components like `KewtiCalendar`, `KewtiDatePicker`, and `KewtiInput`. |
| **Typography & Fonts** | Optimized Amharic and Ge'ez web fonts tuned for clean rendering across all devices. |

---

## Local CLI Development

If you're contributing to the `kewti` CLI core:

```bash
# 1. Clone the repository
git clone [https://github.com/coderade1905/kewti](https://github.com/coderade1905/kewti)
cd kewti

# 2. Install dependencies
npm install

# 3. Start dev mode with hot-reloading
npm run dev

# 4. Test the CLI locally
npx .

```

---

## License

[MIT](https://www.google.com/search?q=LICENSE)
