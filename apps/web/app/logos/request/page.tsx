"use client"

import Image from "next/image"
import { useEffect, useId, useMemo, useState } from "react"
import type { JSX, ChangeEvent, FormEvent } from "react"
import HeroBackground from "../../../components/Hero/HeroBackground"
import Navbar from "@/components/Navbar/Navbar"
import MyCodeBlock from "../../fonts/codeblock"

interface SelectedFile {
  file: File
  previewUrl: string
  name: string
  size: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function SubmitLogo(): JSX.Element {
  const formId = useId()

  const logotext = (
    <i>
      <h1 className="font-sans text-2xl font-bold text-orange-500">Logos</h1>
    </i>
  )

  // Form Fields
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")
  const [isSlugManual, setIsSlugManual] = useState(false)
  const [category, setCategory] = useState("Banking & Finance")
  const [website, setWebsite] = useState("")

  // Local File States
  const [svgAsset, setSvgAsset] = useState<SelectedFile | null>(null)
  const [pngAsset, setPngAsset] = useState<SelectedFile | null>(null)
  const [previewTab, setPreviewTab] = useState<"svg" | "png">("svg")

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  // Revoke Object URLs on cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      if (svgAsset) URL.revokeObjectURL(svgAsset.previewUrl)
      if (pngAsset) URL.revokeObjectURL(pngAsset.previewUrl)
    }
  }, [svgAsset, pngAsset])

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!isSlugManual) {
      setName(slugify(val))
    }
  }

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSlugManual(true)
    setName(slugify(e.target.value))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: "svg" | "png") => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === "svg" && !file.name.toLowerCase().endsWith(".svg")) {
      setStatus({ type: "error", message: "Please select a valid .svg vector file." })
      return
    }

    if (type === "png" && !file.name.toLowerCase().endsWith(".png")) {
      setStatus({ type: "error", message: "Please select a valid .png image file." })
      return
    }

    const previewUrl = URL.createObjectURL(file)
    const fileObj: SelectedFile = {
      file,
      previewUrl,
      name: file.name,
      size: file.size,
    }

    if (type === "svg") {
      setSvgAsset(fileObj)
      setPreviewTab("svg")
    } else {
      setPngAsset(fileObj)
      setPreviewTab("png")
    }

    setStatus(null)
  }

  // Live registry JSON snippet preview
  const registryPayload = useMemo(() => {
    const files = []
    if (svgAsset) {
      files.push({
        path: `assets/logos/${name || "logo"}.svg`,
        target: `src/logos/${name || "logo"}.svg`,
        type: "image/svg+xml",
      })
    }
    if (pngAsset) {
      files.push({
        path: `assets/logos/${name || "logo"}.png`,
        target: `src/logos/${name || "logo"}.png`,
        type: "image/png",
      })
    }

    return {
      name: name || "logo-identifier",
      title: title || "Organization Title",
      category,
      ...(website ? { website } : {}),
      files,
    }
  }, [name, title, category, website, svgAsset, pngAsset])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (!title.trim() || !name.trim()) {
      setStatus({
        type: "error",
        message: "Please enter both the title and CLI identifier.",
      })
      return
    }

    if (!svgAsset && !pngAsset) {
      setStatus({
        type: "error",
        message: "Please choose at least one logo file (SVG or PNG).",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("name", name)
      formData.append("category", category)
      formData.append("website", website)
      if (svgAsset) formData.append("svg", svgAsset.file)
      if (pngAsset) formData.append("png", pngAsset.file)

      const response = await fetch("/api/logos/submit", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`)
      }

      setStatus({
        type: "success",
        message: "Logo delivered directly! We'll review and add it shortly.",
      })

      // Reset
      setTitle("")
      setName("")
      setWebsite("")
      setSvgAsset(null)
      setPngAsset(null)
      setIsSlugManual(false)
    } catch (err: unknown) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Submission failed. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const activePreviewUrl =
    previewTab === "svg" ? svgAsset?.previewUrl : pngAsset?.previewUrl

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      <HeroBackground>
        <Navbar logotext={logotext} />

        <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 sm:px-6 sm:py-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Submit a Logo
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-neutral-400 sm:text-lg">
              Submit Ethiopian logos directly to the maintainers .
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md sm:p-8"
            >
              <h2 className="border-b border-neutral-800 pb-3 text-lg font-bold text-white">
                Logo Information
              </h2>

              {status && (
                <div
                  className={`rounded-xl border p-4 text-sm ${
                    status.type === "success"
                      ? "border-emerald-800/80 bg-emerald-950/40 text-emerald-300"
                      : "border-red-800/80 bg-red-950/40 text-red-300"
                  }`}
                >
                  {status.message}
                </div>
              )}

              {/* Title & Slug */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor={`${formId}-title`}
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    Logo Title *
                  </label>
                  <input
                    id={`${formId}-title`}
                    type="text"
                    required
                    placeholder="e.g. Commercial Bank of Ethiopia"
                    value={title}
                    onChange={handleTitleChange}
                    className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-name`}
                    className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    <span>CLI Identifier / Slug *</span>
                    {isSlugManual && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsSlugManual(false)
                          setName(slugify(title))
                        }}
                        className="text-[10px] text-orange-400 hover:underline"
                      >
                        Reset to auto
                      </button>
                    )}
                  </label>
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-neutral-600">
                      kewti-cli logo
                    </span>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      required
                      placeholder="cbe"
                      value={name}
                      onChange={handleSlugChange}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-3 pl-32 pr-4 font-mono text-sm text-orange-300 transition-colors focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Website */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${formId}-category`}
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    Category
                  </label>
                  <select
                    id={`${formId}-category`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-neutral-200 transition-colors focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Banking & Finance">Banking & Finance</option>
                    <option value="Telecom & Technology">Telecom & Technology</option>
                    <option value="Aviation & Transport">Aviation & Transport</option>
                    <option value="Government & Public">Government & Public</option>
                    <option value="Universities & Education">Universities & Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-website`}
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    Official Website
                  </label>
                  <input
                    id={`${formId}-website`}
                    type="url"
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Native File Upload Slots */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Logo Files
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* SVG File Slot */}
                  <div className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase text-orange-400">
                        Vector (SVG)
                      </span>
                      {svgAsset && (
                        <button
                          type="button"
                          onClick={() => setSvgAsset(null)}
                          className="text-[11px] text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {svgAsset ? (
                      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-center">
                        <p className="truncate text-xs font-medium text-emerald-400">
                          ✓ {svgAsset.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] text-neutral-500">
                          {(svgAsset.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-6 text-center transition-colors hover:border-orange-500/60 hover:bg-neutral-900/50">
                        <span className="text-xs font-medium text-neutral-300">
                          Choose SVG File
                        </span>
                        <span className="mt-1 text-[10px] text-neutral-500">
                          Scalable vector graphics
                        </span>
                        <input
                          type="file"
                          accept=".svg,image/svg+xml"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "svg")}
                        />
                      </label>
                    )}
                  </div>

                  {/* PNG File Slot */}
                  <div className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase text-orange-400">
                        Raster (PNG)
                      </span>
                      {pngAsset && (
                        <button
                          type="button"
                          onClick={() => setPngAsset(null)}
                          className="text-[11px] text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {pngAsset ? (
                      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-center">
                        <p className="truncate text-xs font-medium text-emerald-400">
                          ✓ {pngAsset.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] text-neutral-500">
                          {(pngAsset.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-6 text-center transition-colors hover:border-neutral-700 hover:bg-neutral-900/50">
                        <span className="text-xs font-medium text-neutral-300">
                          Choose PNG File
                        </span>
                        <span className="mt-1 text-[10px] text-neutral-500">
                          Transparent high-res image
                        </span>
                        <input
                          type="file"
                          accept=".png,image/png"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "png")}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || (!svgAsset && !pngAsset)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <span>Send to Maintainers</span>
                  </>
                )}
              </button>
            </form>

            {/* Right Side: Live Card & Registry JSON Preview */}
            <div className="space-y-6">
              {/* Preview Card */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                    Registry Card Preview
                  </h3>
                  <div className="flex gap-1.5">
                    {(["svg", "png"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setPreviewTab(fmt)}
                        className={`rounded px-2.5 py-1 font-mono text-[11px] font-semibold uppercase ${
                          previewTab === fmt
                            ? "bg-orange-600 text-white"
                            : "border border-neutral-800 bg-neutral-950 text-neutral-500"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                  <div className="flex h-36 items-center justify-center rounded-xl bg-white p-4">
                    {activePreviewUrl ? (
                      <Image
                        src={activePreviewUrl}
                        alt="Logo Preview"
                        width={200}
                        height={120}
                        unoptimized
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="font-mono text-xs text-neutral-400">
                        Choose {previewTab.toUpperCase()} to preview
                      </span>
                    )}
                  </div>
                  <span className="mt-3 block truncate text-sm font-semibold text-neutral-100">
                    {title || "Logo Title"}
                  </span>
                  <span className="mt-1 block truncate font-mono text-xs text-neutral-500">
                    {name || "logo-identifier"}
                  </span>
                </div>
              </div>

              {/* Generated Registry JSON */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Draft logos-registry.json
                  </h3>
                  <span className="font-mono text-[10px] text-neutral-500">
                    Kewti Schema
                  </span>
                </div>
                <MyCodeBlock
                  code={JSON.stringify(registryPayload, null, 2)}
                  language="json"
                  showLineNumbers={false}
                />
              </div>
            </div>
          </div>
        </main>
      </HeroBackground>
    </div>
  )
}