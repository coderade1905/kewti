"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { JSX } from "react"
import HeroBackground from "../../components/Hero/HeroBackground"
import Navbar from "@/components/Navbar/Navbar"
import MyCodeBlock from "../fonts/codeblock"

interface LogoFile {
  path: string
  target: string
  type: string
}

interface LogoItem {
  name: string
  title: string
  files: LogoFile[]
}

type LogoFormat = "svg" | "png"

const REGISTRY_URL =
  process.env.NEXT_PUBLIC_REGISTRY || "http://localhost:3333"
const PUBLIC_REGISTRY_URL = "https://kewti-registry.vercel.app"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseLogoRegistry(value: unknown): LogoItem[] {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error("The logo registry response has an invalid format.")
  }

  return value.items.map((item, index) => {
    if (
      !isRecord(item) ||
      typeof item.name !== "string" ||
      typeof item.title !== "string" ||
      !Array.isArray(item.files)
    ) {
      throw new Error(`Logo registry item ${index + 1} is invalid.`)
    }

    const files = item.files.map((file, fileIndex) => {
      if (
        !isRecord(file) ||
        typeof file.path !== "string" ||
        typeof file.target !== "string" ||
        typeof file.type !== "string"
      ) {
        throw new Error(
          `A file in logo registry item "${item.name}" is invalid at position ${fileIndex + 1}.`
        )
      }

      return {
        path: file.path,
        target: file.target,
        type: file.type,
      }
    })

    return {
      name: item.name,
      title: item.title,
      files,
    }
  })
}

function getLogoFile(logo: LogoItem, format: LogoFormat): LogoFile | undefined {
  return logo.files.find((file) =>
    file.path.toLowerCase().endsWith(`.${format}`)
  )
}

function getLogoUrl(file: LogoFile): string {
  return `${REGISTRY_URL.replace(/\/+$/, "")}/${file.path}`
}

export default function BrowseLogos(): JSX.Element {
  const logotext = (
    <i>
      <h1 className="font-sans text-2xl font-bold text-orange-500">Logos</h1>
    </i>
  )

  const [logos, setLogos] = useState<LogoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [format, setFormat] = useState<LogoFormat>("svg")
  const [selectedLogo, setSelectedLogo] = useState<LogoItem | null>(null)

  useEffect(() => {
    async function loadLogos() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `${REGISTRY_URL.replace(/\/+$/, "")}/logos-registry.json`
        )

        if (!response.ok) {
          throw new Error(`Failed to load logo registry (${response.status}).`)
        }

        const items = parseLogoRegistry(await response.json())
        setLogos(items)

        const sharedLogoName = new URLSearchParams(window.location.search).get(
          "logo"
        )
        if (sharedLogoName) {
          setSelectedLogo(
            items.find((logo) => logo.name === sharedLogoName) ?? null
          )
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load the logo registry."
        )
      } finally {
        setLoading(false)
      }
    }

    void loadLogos()
  }, [])

  const filteredLogos = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return logos

    return logos.filter(
      (logo) =>
        logo.title.toLowerCase().includes(query) ||
        logo.name.toLowerCase().includes(query)
    )
  }, [logos, search])

  const handleSelectLogo = useCallback((logo: LogoItem | null) => {
    setSelectedLogo(logo)

    const url = new URL(window.location.href)
    if (logo) {
      url.searchParams.set("logo", logo.name)
    } else {
      url.searchParams.delete("logo")
    }
    window.history.pushState({}, "", url.toString())
  }, [])

  const selectedFile = selectedLogo ? getLogoFile(selectedLogo, format) : null
  const localPngFile = selectedLogo ? getLogoFile(selectedLogo, "png") : null

  const logoUsage = selectedLogo
    ? `import { KewtiLogo } from "@/kewti/ui"\n\n<KewtiLogo\n  name="${selectedLogo.name}"\n  registryUrl="${PUBLIC_REGISTRY_URL}"\n  size={96}\n  format="${format}"\n/>`
    : ""
  const localLogoUsage =
    selectedLogo && localPngFile
      ? `import logoAsset from "@/${localPngFile.target.slice("src/".length)}"\n\n<img\n  src={logoAsset.src}\n  alt="${selectedLogo.title} logo"\n  width={96}\n  height={96}\n/>`
      : ""

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      <HeroBackground>
        <Navbar logotext={logotext} />

        {selectedLogo ? (
          <main className="mx-auto w-full max-w-5xl px-4 py-6 pb-16 sm:px-6 sm:py-10 sm:pb-24">
            <div className="mb-8 flex flex-col gap-3 border-b border-neutral-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => handleSelectLogo(null)}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
              >
                <span aria-hidden="true">←</span>
                Back to all logos
              </button>

              <a
                href={selectedFile ? getLogoUrl(selectedFile) : undefined}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-white ${selectedFile ? "" : "pointer-events-none opacity-50"}`}
                aria-disabled={!selectedFile}
              >
                Open {format.toUpperCase()} asset
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="mb-8">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-orange-400">
                Kewti logo library
              </p>
              <h2 className="break-words text-3xl font-extrabold text-white sm:text-5xl">
                {selectedLogo.title}
              </h2>
              <p className="mt-3 font-mono text-sm text-neutral-500">
                {selectedLogo.name}
              </p>
            </div>

            <section className="mb-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-white p-8">
                {selectedFile ? (
                  <Image
                    src={getLogoUrl(selectedFile)}
                    alt={`${selectedLogo.title} logo`}
                    width={320}
                    height={240}
                    unoptimized
                    className="h-52 w-full object-contain"
                  />
                ) : (
                  <p className="text-center text-sm text-neutral-500">
                    No {format.toUpperCase()} asset is available for this logo.
                  </p>
                )}
                <span className="mt-4 rounded-full bg-neutral-100 px-3 py-1 font-mono text-xs uppercase text-neutral-600">
                  {format}
                </span>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-7">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-white">
                    Choose an asset format
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    SVG stays crisp at any size. PNG is useful where SVG isn’t
                    supported.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(["svg", "png"] as const).map((option) => {
                    const hasFile = Boolean(getLogoFile(selectedLogo, option))

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={!hasFile}
                        onClick={() => setFormat(option)}
                        className={`rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          format === option
                            ? "border-orange-500 bg-orange-950/40 text-white"
                            : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-600"
                        }`}
                      >
                        <span className="block font-mono text-sm font-semibold uppercase">
                          {option}
                        </span>
                        <span className="mt-1 block text-xs text-neutral-500">
                          {hasFile ? "Available" : "Not available"}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6 md:p-8">
              <h3 className="border-b border-neutral-800 pb-3 text-xl font-bold text-white">
                Choose how to use this logo
              </h3>

              <div className="mt-5 space-y-4">
                <div className="min-w-0 rounded-xl border border-orange-800/70 bg-orange-950/20 p-4 sm:p-5">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-800 text-xs font-bold text-white">
                      1
                    </span>
                    <div>
                      <h4 className="font-semibold text-white">
                        Option 1: Use KewtiLogo
                      </h4>
                      <p className="mt-1 text-sm text-neutral-400">
                        First install KewtiLogo, then render this logo from the
                        hosted registry.
                      </p>
                    </div>
                  </div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Install KewtiLogo
                  </p>
                  <MyCodeBlock
                    code="npx kewti-cli add logo"
                    language="bash"
                    showLineNumbers={false}
                  />
                  <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Use the selected logo
                  </p>
                  <MyCodeBlock code={logoUsage} language="tsx" />
                </div>

                <div className="min-w-0 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 sm:p-5">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-xs font-bold text-neutral-300">
                      2
                    </span>
                    <div>
                      <h4 className="font-semibold text-white">
                        Option 2: Download and use the logo locally
                      </h4>
                      <p className="mt-1 text-sm text-neutral-400">
                        The CLI downloads the logo assets into your project.
                      </p>
                    </div>
                  </div>
                  <MyCodeBlock
                    code={`npx kewti-cli logo ${selectedLogo.name}`}
                    language="bash"
                    showLineNumbers={false}
                  />
                  <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Import the downloaded PNG
                  </p>
                  {localLogoUsage ? (
                    <MyCodeBlock
                      code={localLogoUsage}
                      language="tsx"
                      showLineNumbers={false}
                    />
                  ) : (
                    <p className="text-sm text-neutral-500">
                      A PNG asset is not available for this logo.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </main>
        ) : (
          <>
            <section className="mx-auto w-full max-w-7xl px-4 py-8 text-center sm:px-6 sm:py-12">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-6xl">
                Browse Ethiopian Logos
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-base text-neutral-400 sm:text-lg">
                Find logos for banks, universities, public institutions, and
                local brands. Preview SVG and PNG assets, then copy the code to
                use them in your app.
              </p>

              <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:p-5">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Search logos</span>
                  <svg
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search logos by name..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                  />
                </label>

                <div
                  className="flex shrink-0 items-center gap-2"
                  aria-label="Preview format"
                >
                  {(["svg", "png"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormat(option)}
                      aria-pressed={format === option}
                      className={`rounded-lg px-4 py-3 font-mono text-xs font-semibold uppercase transition-colors ${
                        format === option
                          ? "bg-orange-800 text-white"
                          : "border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
              {loading ? (
                <div className="py-20 text-center">
                  <p className="animate-pulse text-neutral-400">
                    Loading logos...
                  </p>
                </div>
              ) : error ? (
                <div className="mx-auto max-w-xl rounded-2xl border border-red-900/50 bg-red-950/20 p-8 text-center">
                  <p className="mb-2 text-sm font-semibold text-red-400">
                    Failed to connect to the Logo Registry
                  </p>
                  <p className="break-words text-xs text-neutral-400">{error}</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-neutral-400">
                      Showing{" "}
                      <span className="font-semibold text-white">
                        {filteredLogos.length}
                      </span>{" "}
                      {filteredLogos.length === 1 ? "logo" : "logos"}
                    </p>
                    <span className="font-mono text-xs uppercase text-neutral-500">
                      {format} preview
                    </span>
                  </div>

                  {filteredLogos.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-neutral-800 px-6 py-20 text-center">
                      <p className="text-neutral-400">
                        No logos found matching “{search}”.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-3 text-sm text-orange-400 hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                      {filteredLogos.map((logo) => {
                        const file = getLogoFile(logo, format)

                        return (
                          <button
                            key={logo.name}
                            type="button"
                            onClick={() => handleSelectLogo(logo)}
                            className="group min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-orange-700 hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:p-4"
                          >
                            <span className="flex h-28 items-center justify-center rounded-xl bg-white p-4 sm:h-36">
                              {file ? (
                                <Image
                                  src={getLogoUrl(file)}
                                  alt=""
                                  width={200}
                                  height={120}
                                  unoptimized
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <span className="text-xs text-neutral-500">
                                  {format.toUpperCase()} unavailable
                                </span>
                              )}
                            </span>
                            <span className="mt-3 block truncate text-sm font-semibold text-neutral-100 group-hover:text-orange-300">
                              {logo.title}
                            </span>
                            <span className="mt-1 block truncate font-mono text-[10px] text-neutral-500 sm:text-xs">
                              {logo.name}
                            </span>
                          </button>
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
