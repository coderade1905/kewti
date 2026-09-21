"use client"

import { useState, useMemo, useEffect, JSX, useCallback } from "react"
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
  createdBy?: string
  files: RegistryFile[]
  type: string
}

const BASE_URL = process.env.NEXT_PUBLIC_REGISTRY || "localhost:3333"

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
  const [selectedCreator, setSelectedCreator] = useState<string>("All")
  const [previewText, setPreviewText] = useState("ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል")
  const [fontSize, setFontSize] = useState<number>(32)
  const [selectedFont, setSelectedFont] = useState<FontItem | null>(null)

  // Toast alert state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Fetch Fonts Registry & check URL parameters
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
        const items: FontItem[] = data.items || []
        setFonts(items)

        // Check URL search parameters ONLY for the font parameter
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search)
          const sharedFontName = params.get("font")

          if (sharedFontName) {
            const found = items.find((f) => f.name === sharedFontName)
            if (found) {
              setSelectedFont(found)
            }
          }
        }
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

  // Sync selected font with URL query parameters (excluding preview text)
  const handleSelectFont = useCallback((font: FontItem | null) => {
    setSelectedFont(font)

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      if (font) {
        url.searchParams.set("font", font.name)
      } else {
        url.searchParams.delete("font")
      }

      // Always remove text from query params if present
      url.searchParams.delete("text")

      window.history.pushState({}, "", url.toString())
    }
  }, [])

  // Helper to show temporary toast message
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2500)
  }

  // Share Link Handler (only includes ?font=[fontname])
  const handleShareFont = useCallback((font: FontItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    const url = new URL(`${window.location.origin}${window.location.pathname}`)
    url.searchParams.set("font", font.name)

    navigator.clipboard.writeText(url.toString())
    showToast(`Copied share link for "${font.title}" to clipboard!`)
  }, [])

  // Inject @font-face rules dynamically into <head> for live previews
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
  font-family: "${font.name}_${file.variant || "regular"}";
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

  // Extract unique creators for filter options
  const creators = useMemo(() => {
    const set = new Set<string>()
    fonts.forEach((f) => {
      if (f.createdBy) set.add(f.createdBy)
    })
    return ["All", ...Array.from(set)]
  }, [fonts])

  // Filter fonts based on search query and creator selection
  const filteredFonts = useMemo(() => {
    return fonts.filter((font) => {
      const matchesSearch =
        font.name.toLowerCase().includes(search.toLowerCase()) ||
        font.title.toLowerCase().includes(search.toLowerCase()) ||
        font.license.toLowerCase().includes(search.toLowerCase()) ||
        (font.createdBy &&
          font.createdBy.toLowerCase().includes(search.toLowerCase()))

      const matchesCreator =
        selectedCreator === "All" || font.createdBy === selectedCreator

      return matchesSearch && matchesCreator
    })
  }, [fonts, search, selectedCreator])

  // Generate CSS import snippet for full page view
  const getCssImportSnippet = (font: FontItem) => {
    const fontFiles = font.files.filter((f) => f.type === "font")

    const fontFaceRules = fontFiles
      .map((file) => {
        const variant = file.variant || "regular"
        return `@font-face {
  font-family: '${font.name}_${variant}';
  src: url('/path/to/src/kewti/${file.path}') format('${font.fontType}');
  font-display: swap;
}`
      })
      .join("\n\n")

    return `/* @font-face Declarations */\n${fontFaceRules}\n`
  }

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2">
          <svg
            className="h-4 w-4 text-orange-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      <HeroBackground>
        <Navbar logotext={logotext} />

        {/* ------------------------------------------------------------- */}
        {/* SINGLE FONT FULL PAGE VIEW (?font=[fontname])                 */}
        {/* ------------------------------------------------------------- */}
        {selectedFont ? (
          <main className="mx-auto max-w-5xl px-6 py-10 pb-24">
            {/* Back Button & Share Bar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
              <button
                onClick={() => handleSelectFont(null)}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
              >
                <svg
                  className="h-4 w-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to All Fonts</span>
              </button>

              <button
                onClick={() => handleShareFont(selectedFont)}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-800/80 hover:bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-all shadow-lg"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span>Share Font Link</span>
              </button>
            </div>

            {/* Font Title & Info */}
            <div className="mb-10">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                {selectedFont.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-400">
                {selectedFont.createdBy && (
                  <p>
                    Created by:{" "}
                    <span className="font-semibold text-neutral-200">
                      {selectedFont.createdBy}
                    </span>
                  </p>
                )}
                <p>
                  License:{" "}
                  <span className="font-semibold text-neutral-200">
                    {selectedFont.license}
                  </span>
                </p>
                <p>
                  Format:{" "}
                  <span className="font-mono uppercase text-orange-400">
                    {selectedFont.fontType}
                  </span>
                </p>
              </div>
            </div>

            {/* Live Interactive Controls */}
            <div className="mb-10 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-xl backdrop-blur-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Type custom preview text..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                />

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-neutral-400">
                    {fontSize}px
                  </span>
                  <input
                    type="range"
                    min="16"
                    max="96"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-36 cursor-pointer accent-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Font Variants Section */}
            <section className="mb-12 space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-white border-b border-neutral-800 pb-3">
                Font Variants (
                {selectedFont.files.filter((f) => f.type === "font").length})
              </h2>

              <div className="space-y-4">
                {selectedFont.files
                  .filter((f) => f.type === "font")
                  .map((file) => {
                    const variantName = file.variant || "regular"
                    return (
                      <div
                        key={file.path}
                        className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:border-neutral-700"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-500">
                            {variantName}
                          </span>
                          <span className="font-mono text-xs text-neutral-500">
                            {selectedFont.name}_{variantName}
                          </span>
                        </div>

                        <div className="overflow-hidden py-2">
                          <p
                            style={{
                              fontFamily: `"${selectedFont.name}_${variantName}", sans-serif`,
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.25,
                            }}
                            className="break-words text-neutral-100"
                          >
                            {previewText || "ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </section>

            {/* Installation & Code Snippets */}
            <section className="space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 md:p-8">
              <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-3">
                How to Install & Use
              </h2>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  1. Install via CLI
                </label>
                <MyCodeBlock
                  code={`npx kewti-cli font ${selectedFont.name}`}
                  showLineNumbers={false}
                  language="bash"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  2. Import CSS Declarations
                </label>
                <MyCodeBlock
                  code={getCssImportSnippet(selectedFont)}
                  showLineNumbers={true}
                  language="css"
                />
              </div>
            </section>
          </main>
        ) : (
          /* ------------------------------------------------------------- */
          /* MAIN FONTS BROWSER / GRID VIEW                                */
          /* ------------------------------------------------------------- */
          <>
            <div className="mx-auto max-w-7xl px-6 py-12 text-center">
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
                Browse or Search Ethiopic Fonts
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-400">
                Explore font registry, test individual font variants live, and copy
                CSS snippets for your project.
              </p>

              {/* Controls Bar */}
              <div className="mx-auto max-w-4xl space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 shadow-xl backdrop-blur-md">
                <div className="flex flex-col gap-3 md:flex-row">
                  {/* Search Input */}
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
                      placeholder="Search fonts by name, creator, or license..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pr-4 pl-10 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Global Sample Preview Input */}
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

                {/* Sub-controls: Creator Filter Pills & Font Size Slider */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800/60 pt-2 sm:flex-row">
                  {/* Creator Filters */}
                  <div className="flex w-full flex-wrap gap-1.5 sm:w-auto">
                    <span className="self-center text-xs text-neutral-400 mr-1">
                      Creator:
                    </span>
                    {creators.map((creator) => (
                      <button
                        key={creator}
                        onClick={() => setSelectedCreator(creator)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedCreator === creator
                            ? "bg-orange-800 text-white"
                            : "border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {creator}
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
                  <p className="animate-pulse text-neutral-400">
                    Loading fonts...
                  </p>
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
                          setSelectedCreator("All")
                        }}
                        className="mt-3 text-sm text-orange-500 hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {filteredFonts.map((font) => {
                        const fontFiles = font.files.filter(
                          (f) => f.type === "font"
                        )

                        return (
                          <div
                            key={font.name}
                            className="group flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-6 transition-all duration-200 hover:border-neutral-700"
                          >
                            <div>
                              {/* Card Header */}
                              <div className="mb-4 flex items-start justify-between border-b border-neutral-800/60 pb-3">
                                <div>
                                  <h3
                                    onClick={() => handleSelectFont(font)}
                                    className="cursor-pointer text-lg font-semibold text-white transition-colors hover:text-orange-500"
                                  >
                                    {font.title}
                                  </h3>
                                  {font.createdBy && (
                                    <p className="text-xs text-neutral-400">
                                      Created by:{" "}
                                      <span className="text-neutral-200">
                                        {font.createdBy}
                                      </span>
                                    </p>
                                  )}
                                  <p className="text-xs text-neutral-500">
                                    License: {font.license}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Share Button */}
                                  <button
                                    onClick={(e) => handleShareFont(font, e)}
                                    title="Copy Share Link"
                                    className="rounded-md border border-neutral-800 bg-neutral-950 p-1.5 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                      />
                                    </svg>
                                  </button>

                                  <span className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">
                                    {fontFiles.length}{" "}
                                    {fontFiles.length === 1
                                      ? "variant"
                                      : "variants"}
                                  </span>
                                </div>
                              </div>

                              {/* Variant Previews */}
                              <div className="flex flex-col gap-4 py-2">
                                {fontFiles.map((file) => {
                                  const variantName = file.variant || "regular"
                                  return (
                                    <div
                                      key={file.path}
                                      className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3"
                                    >
                                      <div className="mb-1 flex items-center justify-between text-[11px]">
                                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-orange-400">
                                          {variantName}
                                        </span>
                                        <span className="font-mono text-neutral-500">
                                          {font.name}_{variantName}
                                        </span>
                                      </div>

                                      <div className="flex min-h-[60px] items-center overflow-hidden pt-1">
                                        <p
                                          style={{
                                            fontFamily: `"${font.name}_${variantName}", sans-serif`,
                                            fontSize: `${fontSize}px`,
                                            lineHeight: 1.2,
                                          }}
                                          className="w-full break-words text-neutral-100"
                                        >
                                          {previewText ||
                                            "ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል"}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Card Footer */}
                            <div className="mt-4 flex items-center justify-between border-t border-neutral-800/60 pt-4">
                              <span className="max-w-[200px] truncate font-mono text-xs text-neutral-500">
                                {font.folder}
                              </span>

                              <button
                                onClick={() => handleSelectFont(font)}
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
          </>
        )}
      </HeroBackground>
    </div>
  )
}