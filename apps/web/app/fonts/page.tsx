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
const CREATORS_LIMIT = 6 // Maximum creators shown before showing the toggle

export default function BrowseFonts(): JSX.Element {
  const logotext = (
    <i>
      <h1 className="font-sans text-2xl font-bold text-orange-500">
        Fonts
      </h1>
    </i>
  )

  const [fonts, setFonts] = useState<FontItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [selectedCreator, setSelectedCreator] = useState<string>("All")
  const [showAllCreators, setShowAllCreators] = useState<boolean>(false)
  const [previewText, setPreviewText] = useState(
    "ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል"
  )
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
          throw new Error(
            `Failed to load font registry (${response.status})`
          )
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
          err instanceof Error
            ? err.message
            : "Failed to fetch font registry"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchFontRegistry()
  }, [])

  // Sync selected font with URL query parameters
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

  // Share Link Handler
  const handleShareFont = useCallback(
    (font: FontItem, e?: React.MouseEvent) => {
      if (e) e.stopPropagation()

      const url = new URL(
        `${window.location.origin}${window.location.pathname}`
      )

      url.searchParams.set("font", font.name)

      navigator.clipboard.writeText(url.toString())

      showToast(`Copied share link for "${font.title}" to clipboard!`)
    },
    []
  )

  // Inject @font-face rules dynamically into <head>
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
      const existingStyle = document.getElementById(
        "dynamic-fonts-registry"
      )

      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [fonts])

  // Extract unique creators for filter options
  const creators = useMemo(() => {
    const set = new Set<string>()

    fonts.forEach((f) => {
      if (f.createdBy) {
        set.add(f.createdBy)
      }
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
        selectedCreator === "All" ||
        font.createdBy === selectedCreator

      return matchesSearch && matchesCreator
    })
  }, [fonts, search, selectedCreator])

  // Generate CSS import snippet
  const getCssImportSnippet = (font: FontItem) => {
    const fontFiles = font.files.filter(
      (f) => f.type === "font"
    )

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
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-4 right-4 z-[100] flex items-center justify-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2 sm:left-auto sm:right-5 sm:w-auto">
          <svg
            className="h-4 w-4 shrink-0 text-orange-500"
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

          <span className="min-w-0 break-words text-center">
            {toastMessage}
          </span>
        </div>
      )}

      <HeroBackground>
        <Navbar logotext={logotext} />

        {/* ============================================================= */}
        {/* SINGLE FONT FULL PAGE VIEW                                    */}
        {/* ============================================================= */}

        {selectedFont ? (
          <main className="mx-auto w-full min-w-0 max-w-5xl px-4 py-6 pb-16 sm:px-6 sm:py-10 sm:pb-24">
            {/* Back Button & Share Bar */}
            <div className="mb-8 flex w-full min-w-0 flex-col items-stretch gap-3 border-b border-neutral-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => handleSelectFont(null)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-white sm:w-auto"
              >
                <svg
                  className="h-4 w-4 shrink-0 text-orange-500"
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-800/80 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 sm:w-auto"
              >
                <svg
                  className="h-4 w-4 shrink-0"
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
            <div className="mb-8 min-w-0 sm:mb-10">
              <h1 className="min-w-0 max-w-full break-words text-3xl font-extrabold text-white sm:text-5xl">
                {selectedFont.title}
              </h1>

              <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-400">
                {selectedFont.createdBy && (
                  <p className="min-w-0 max-w-full break-words">
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
            <div className="mb-10 w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 shadow-xl backdrop-blur-md sm:p-5">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Type custom preview text..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="min-w-0 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                />

                <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
                  <span className="shrink-0 font-mono text-xs text-neutral-400">
                    {fontSize}px
                  </span>

                  <input
                    type="range"
                    min="16"
                    max="96"
                    value={fontSize}
                    onChange={(e) =>
                      setFontSize(Number(e.target.value))
                    }
                    className="min-w-0 w-full cursor-pointer accent-orange-500 sm:w-36"
                  />
                </div>
              </div>
            </div>

            {/* Font Variants Section */}
            <section className="mb-12 min-w-0 space-y-6">
              <h2 className="border-b border-neutral-800 pb-3 text-xl font-bold tracking-tight text-white">
                Font Variants (
                {
                  selectedFont.files.filter(
                    (f) => f.type === "font"
                  ).length
                }
                )
              </h2>

              <div className="min-w-0 space-y-4">
                {selectedFont.files
                  .filter((f) => f.type === "font")
                  .map((file) => {
                    const variantName = file.variant || "regular"

                    return (
                      <div
                        key={file.path}
                        className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:border-neutral-700 sm:p-6"
                      >
                        <div className="mb-3 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="shrink-0 font-mono text-xs font-bold uppercase tracking-wider text-orange-500">
                            {variantName}
                          </span>

                          <span className="min-w-0 max-w-full break-all font-mono text-xs text-neutral-500">
                            {selectedFont.name}_{variantName}
                          </span>
                        </div>

                        <div className="min-w-0 max-w-full overflow-hidden py-2">
                          <p
                            style={{
                              fontFamily: `"${selectedFont.name}_${variantName}", sans-serif`,
                              fontSize: `clamp(20px, ${Math.min(
                                fontSize,
                                72
                              )}px, 10vw)`,
                              lineHeight: 1.25,
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                            }}
                            className="w-full min-w-0 max-w-full text-neutral-100"
                          >
                            {previewText ||
                              "ቀስ በ ቀስ እንቁላል በእግሩ ይሄዳል"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </section>

            {/* Installation & Code Snippets */}
            <section className="min-w-0 max-w-full space-y-8 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6 md:p-8">
              <h2 className="border-b border-neutral-800 pb-3 text-xl font-bold text-white">
                How to Install & Use
              </h2>

              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  1. Install via CLI
                </label>

                <div className="min-w-0 max-w-full overflow-x-auto">
                  <MyCodeBlock
                    code={`npx kewti-cli font ${selectedFont.name}`}
                    showLineNumbers={false}
                    language="bash"
                  />
                </div>
              </div>

              <div className="min-w-0 max-w-full overflow-hidden">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  2. Import CSS Declarations
                </label>

                <div className="min-w-0 max-w-full overflow-x-auto">
                  <MyCodeBlock
                    code={getCssImportSnippet(selectedFont)}
                    showLineNumbers={true}
                    language="css"
                  />
                </div>
              </div>
            </section>
          </main>
        ) : (
          <>
            {/* ============================================================= */}
            {/* MAIN FONTS BROWSER / GRID VIEW                               */}
            {/* ============================================================= */}

            <div className="mx-auto w-full max-w-7xl px-4 py-8 text-center sm:px-6 sm:py-12">
              <h1 className="mb-4 break-words text-3xl font-extrabold tracking-tight sm:text-6xl">
                Browse or Search Ethiopic Fonts
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-base text-neutral-400 sm:text-lg">
                Explore font registry, test individual font variants live,
                and copy CSS snippets for your project.
              </p>

              {/* Controls Bar */}
              <div className="mx-auto w-full min-w-0 max-w-4xl space-y-4 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 shadow-xl backdrop-blur-md sm:p-5">
                {/* Row 1: Search & Preview Inputs */}
                <div className="flex min-w-0 flex-col gap-3 md:flex-row">
                  {/* Search Input */}
                  <div className="relative min-w-0 flex-1">
                    <svg
                      className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
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
                      className="w-full min-w-0 rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Global Sample Preview Input */}
                  <div className="min-w-0 flex-1">
                    <input
                      type="text"
                      placeholder="Type custom preview text..."
                      value={previewText}
                      onChange={(e) =>
                        setPreviewText(e.target.value)
                      }
                      className="w-full min-w-0 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 2: Creator Filters with "Show more" */}
                <div className="border-t border-neutral-800/60 pt-3">
                  <div className="flex min-w-0 w-full flex-wrap items-center gap-1.5">
                    <span className="mr-1 self-center text-xs text-neutral-400">
                      Creator:
                    </span>

                    {(showAllCreators
                      ? creators
                      : creators.slice(0, CREATORS_LIMIT)
                    ).map((creator) => (
                      <button
                        key={creator}
                        onClick={() => setSelectedCreator(creator)}
                        className={`max-w-full rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedCreator === creator
                            ? "bg-orange-800 text-white"
                            : "border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <span className="break-words">{creator}</span>
                      </button>
                    ))}

                    {/* Show more / Show less toggle */}
                    {creators.length > CREATORS_LIMIT && (
                      <button
                        type="button"
                        onClick={() => setShowAllCreators((prev) => !prev)}
                        className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/60 px-2.5 py-1.5 text-xs font-medium text-orange-400 transition-colors hover:border-orange-500 hover:text-orange-300"
                      >
                        {showAllCreators
                          ? "Show less"
                          : `+${creators.length - CREATORS_LIMIT} more`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 3: Font Size Slider on a New Line */}
                <div className="flex flex-col gap-2 border-t border-neutral-800/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">
                      Preview Size:
                    </span>
                    <span className="font-mono text-xs font-semibold text-orange-400">
                      {fontSize}px
                    </span>
                  </div>

                  <div className="flex w-full items-center gap-3 sm:w-72">
                    <span className="font-mono text-[11px] text-neutral-500">
                      16px
                    </span>
                    <input
                      type="range"
                      min="16"
                      max="72"
                      value={fontSize}
                      onChange={(e) =>
                        setFontSize(Number(e.target.value))
                      }
                      className="w-full cursor-pointer accent-orange-500"
                    />
                    <span className="font-mono text-[11px] text-neutral-500">
                      72px
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main className="mx-auto w-full max-w-7xl min-w-0 px-4 pb-16 sm:px-6 sm:pb-20">
              {loading ? (
                <div className="py-20 text-center">
                  <p className="animate-pulse text-neutral-400">
                    Loading fonts...
                  </p>
                </div>
              ) : error ? (
                <div className="mx-auto w-full max-w-xl rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center sm:p-10 sm:py-12">
                  <p className="mb-1 text-sm font-semibold text-red-400">
                    Failed to connect to Font Registry
                  </p>

                  <p className="break-words text-xs text-neutral-400">
                    {error}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex min-w-0 items-center justify-between">
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
                    <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
                      {filteredFonts.map((font) => {
                        const fontFiles = font.files.filter(
                          (f) => f.type === "font"
                        )

                        return (
                          <div
                            key={font.name}
                            className="group flex min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-4 transition-all duration-200 hover:border-neutral-700 sm:p-6"
                          >
                            <div className="min-w-0">
                              {/* Card Header */}
                              <div className="mb-4 flex min-w-0 items-start justify-between gap-3 border-b border-neutral-800/60 pb-3">
                                <div className="min-w-0">
                                  <h3
                                    onClick={() =>
                                      handleSelectFont(font)
                                    }
                                    className="min-w-0 cursor-pointer break-words text-lg font-semibold text-white transition-colors hover:text-orange-500"
                                  >
                                    {font.title}
                                  </h3>

                                  {font.createdBy && (
                                    <p className="mt-1 break-words text-xs text-neutral-400">
                                      Created by:{" "}
                                      <span className="text-neutral-200">
                                        {font.createdBy}
                                      </span>
                                    </p>
                                  )}

                                  <p className="break-words text-xs text-neutral-500">
                                    License: {font.license}
                                  </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                  {/* Share Button */}
                                  <button
                                    onClick={(e) =>
                                      handleShareFont(font, e)
                                    }
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

                                  <span className="shrink-0 rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">
                                    {fontFiles.length}{" "}
                                    {fontFiles.length === 1
                                      ? "variant"
                                      : "variants"}
                                  </span>
                                </div>
                              </div>

                              {/* Variant Previews */}
                              <div className="flex min-w-0 flex-col gap-4 py-2">
                                {fontFiles.map((file) => {
                                  const variantName =
                                    file.variant || "regular"

                                  return (
                                    <div
                                      key={file.path}
                                      className="min-w-0 max-w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/60 p-3"
                                    >
                                      <div className="mb-1 flex min-w-0 flex-col gap-1 text-[11px] sm:flex-row sm:items-center sm:justify-between">
                                        <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-orange-400">
                                          {variantName}
                                        </span>

                                        <span className="min-w-0 max-w-full break-all font-mono text-neutral-500">
                                          {font.name}_{variantName}
                                        </span>
                                      </div>

                                      <div className="flex min-h-[60px] min-w-0 max-w-full items-center overflow-hidden pt-1">
                                        <p
                                          style={{
                                            fontFamily: `"${font.name}_${variantName}", sans-serif`,
                                            fontSize: `clamp(18px, ${Math.min(
                                              fontSize,
                                              72
                                            )}px, 8vw)`,
                                            lineHeight: 1.2,
                                            overflowWrap:
                                              "anywhere",
                                            wordBreak:
                                              "break-word",
                                          }}
                                          className="w-full min-w-0 max-w-full text-neutral-100"
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
                            <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-neutral-800/60 pt-4">
                              <span className="min-w-0 max-w-[60%] truncate font-mono text-xs text-neutral-500">
                                {font.folder}
                              </span>

                              <button
                                onClick={() =>
                                  handleSelectFont(font)
                                }
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-orange-500 hover:text-white"
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