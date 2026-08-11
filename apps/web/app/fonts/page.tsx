"use client"

import { useState, useMemo, useEffect, JSX } from "react"
import HeroBackground from "../../components/Hero/HeroBackground"
import Navbar from "@/components/Navbar/Navbar"
import MyCodeBlock from "./codeblock"

interface RegistryFile {
  path: string
  target: string
  type: "font" | "license" | string
  variant?: string
}

interface FontItem {
  name: string
  title: string
  fontType: string
  folder: string
  license: string
  licenseFile: string
  files: RegistryFile[]
  type: string
}

const BASE_URL = "http://localhost:3333"

export default function BrowseFonts(): JSX.Element {
  const logotext = (
    <i>
      <h1 className="font-sans text-2xl font-bold text-orange-500">Fonts</h1>
    </i>
  )

  const [fonts, setFonts] = useState<FontItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [previewText, setPreviewText] = useState("ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል")
  const [fontSize, setFontSize] = useState<number>(32)
  const [selectedFont, setSelectedFont] = useState<FontItem | null>(null)

  useEffect(() => {
    async function fetchFontRegistry() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${BASE_URL}/fonts-registry.json`)
        if (!response.ok) {
          throw new Error(`Failed to load font registry (${response.status})`)
        }
        const data = await response.json()
        setFonts(data.items || [])
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch font registry"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchFontRegistry()
  }, [])

  // Dynamically inject @font-face rules into document head for live previews
  useEffect(() => {
    if (fonts.length === 0) return

    const styleElement = document.createElement("style")
    styleElement.id = "dynamic-fonts-registry"

    const fontFaceRules = fonts
      .flatMap((font) =>
        font.files
          .filter((file) => file.type === "font")
          .map(
            (file) => `
@font-face {
  font-family: "${font.name}_${file.variant}";
  src: url("${BASE_URL}/${file.path}") format("${font.fontType}");
  font-display: swap;
}`
          )
      )
      .join("\n")

    styleElement.appendChild(document.createTextNode(fontFaceRules))
    document.head.appendChild(styleElement)

    return () => {
      const existingStyle = document.getElementById("dynamic-fonts-registry")
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [fonts])

  // Extract dynamic licenses/categories for filter options
  const categories = useMemo(() => {
    const uniqueLicenses = Array.from(new Set(fonts.map((f) => f.license)))
    return ["All", ...uniqueLicenses]
  }, [fonts])

  // Filter fonts based on search query & selected license category
  const filteredFonts = useMemo(() => {
    return fonts.filter((font) => {
      const matchesSearch =
        font.name.toLowerCase().includes(search.toLowerCase()) ||
        font.title.toLowerCase().includes(search.toLowerCase()) ||
        font.license.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        selectedCategory === "All" || font.license === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [fonts, search, selectedCategory])

  // Generate @import snippet for CSS
  const getCssImportSnippet = () => {
    if (!selectedFont) return ""
    const fontFiles = selectedFont.files.filter((f) => f.type === "font")

    const fontFaceRules = fontFiles
      .map((file) => {
        const format = selectedFont.fontType

        return `@font-face {
    font-family: '${selectedFont.name}_${file.variant}';
    src: url('/path/to/src/kewti/${file.path}') format('${format}');
    font-display: swap;
}
    
/* Usage in your CSS */\nfont-family: '${selectedFont.name}_${file.variant}'`
      })
      .join("\n\n")

    return `/* @font-face Declarations */\n${fontFaceRules}\n`
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      {/* Header & Hero */}
      <HeroBackground>
        <Navbar logotext={logotext} />

        <div className="mx-auto max-w-7xl px-6 py-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Browse or Search Ethiopic Fonts
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-400">
            Explore font registry, customize live preview text, and copy CSS
            snippets for your project.
          </p>

          {/* Controls Bar */}
          <div className="mx-auto max-w-4xl space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-3 md:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <svg
                  className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search fonts by name or license..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pr-4 pl-10 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Sample Preview Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Type custom preview text..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Sub-controls: Category Pills & Font Size Slider */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800/60 pt-2 sm:flex-row">
              {/* Category Filters */}
              <div className="flex w-full flex-wrap gap-1.5 sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-orange-800 text-white"
                        : "border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Font Size Slider */}
              <div className="flex w-full items-center gap-3 sm:w-auto">
                <span className="shrink-0 font-mono text-xs text-neutral-400">
                  {fontSize}px
                </span>
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full cursor-pointer accent-orange-500 sm:w-32"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-6 pb-20">
          {loading ? (
            <div className="py-20 text-center">
              <p className="animate-pulse text-neutral-400">Loading fonts...</p>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-red-900/50 bg-red-950/20 p-10 py-12 text-center">
              <p className="mb-1 text-sm font-semibold text-red-400">
                Failed to connect to Font Registry
              </p>
              <p className="text-xs text-neutral-400">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-neutral-400">
                  Showing{" "}
                  <span className="font-semibold text-white">
                    {filteredFonts.length}
                  </span>{" "}
                  fonts
                </p>
              </div>

              {filteredFonts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-800 p-7 py-20 text-center">
                  <p className="text-neutral-400">
                    No fonts found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("")
                      setSelectedCategory("All")
                    }}
                    className="mt-3 text-sm text-orange-500 hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filteredFonts.map((font) => {
                    const fontFilesCount = font.files.filter(
                      (f) => f.type === "font"
                    ).length

                    return (
                      <div
                        key={font.name}
                        className="group flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-6 transition-all duration-200 hover:border-neutral-700"
                      >
                        <div>
                          {/* Card Header */}
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-orange-500">
                                {font.title}
                              </h3>
                              <p className="text-xs text-neutral-500">
                                License: {font.license}
                              </p>
                            </div>

                            <div className="flex gap-1">
                              <span className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">
                                {fontFilesCount}{" "}
                                {fontFilesCount === 1 ? "file" : "files"}
                              </span>
                            </div>
                          </div>

                          {/* Font Dynamic Live Preview */}
                          <div className="flex min-h-[120px] items-center overflow-hidden py-6">
                            <p
                              style={{
                                fontFamily: `"${font.name}_regular", sans-serif`,
                                fontSize: `${fontSize}px`,
                                lineHeight: 1.2,
                              }}
                              className="w-full break-words text-neutral-100"
                            >
                              {previewText || "ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል"}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between border-t border-neutral-800/60 pt-4">
                          <span className="max-w-[200px] truncate font-mono text-xs text-neutral-500">
                            {font.folder}
                          </span>

                          <button
                            onClick={() => setSelectedFont(font)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-orange-500 hover:text-white"
                          >
                            <span>Get Font</span>
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </HeroBackground>

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
          selectedFont
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          onClick={() => setSelectedFont(null)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div
            className={`flex w-screen max-w-md transform flex-col justify-between overflow-y-auto border-l border-neutral-800 bg-neutral-900 p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
              selectedFont ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedFont?.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    License: {selectedFont?.license}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedFont(null)}
                  className="rounded-lg bg-neutral-800 p-1.5 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Install CLI Command */}
              <div className="mt-6 mb-2">
                <label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                  Install the font
                </label>
              </div>

              <MyCodeBlock
                code={`npx kewti font ${selectedFont?.name || ""}`}
                showLineNumbers={false}
                language="bash"
              />

              {/* CSS Import Snippet */}
              <div className="mt-6 mb-2">
                <label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                  Import the font to your css
                </label>
              </div>

              <MyCodeBlock
                code={getCssImportSnippet()}
                showLineNumbers={true}
                language="css"
              />
            </div>

            {/* Sidebar Footer */}
            <div className="flex justify-end border-t border-neutral-800 pt-4">
              <button
                onClick={() => setSelectedFont(null)}
                className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
