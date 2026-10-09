"use client"

import { useEffect, useId, useMemo, useState } from "react"
import type { JSX, ChangeEvent, FormEvent } from "react"
import HeroBackground from "../../../components/Hero/HeroBackground"
import Navbar from "@/components/Navbar/Navbar"
import MyCodeBlock from "../../fonts/codeblock"

interface FontVariantItem {
  id: string
  name: string // e.g. "regular", "italic", "semi-bold", "bold"
  file: File | null
  previewUrl: string | null
  fontFamilyName: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const COMMON_VARIANTS = [
  "regular",
  "italic",
  "bold",
  "semi-bold",
  "semi-bold italic",
  "bold italic",
  "light",
  "light italic",
]

export default function SubmitFont(): JSX.Element {
  const formId = useId()

  const logotext = (
    <i>
      <h1 className="font-sans text-2xl font-bold text-orange-500">Fonts</h1>
    </i>
  )

  // Form Fields
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")
  const [isSlugManual, setIsSlugManual] = useState(false)
  const [creator, setCreator] = useState("")
  const [license, setLicense] = useState("SIL Open Font License (OFL)")
  const [format, setFormat] = useState<"truetype" | "opentype" | "woff2">("truetype")
  const [website, setWebsite] = useState("")

  // Live Preview Controls
  const [sampleText, setSampleText] = useState("ቀስ በቀስ እንቁላል በእግሩ ይሄዳል")
  const [fontSize, setFontSize] = useState<number>(32)

  // Font Variants & File States
  const [variants, setVariants] = useState<FontVariantItem[]>([
    {
      id: "var-1",
      name: "regular",
      file: null,
      previewUrl: null,
      fontFamilyName: "CustomFont_regular",
    },
  ])

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      variants.forEach((v) => {
        if (v.previewUrl) URL.revokeObjectURL(v.previewUrl)
      })
    }
  }, [variants])

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

  // Handle uploading and live-registering a font file to the browser
  const handleVariantFileChange = async (
    variantId: string,
    file: File | undefined
  ) => {
    if (!file) return

    const ext = file.name.split(".").pop()?.toLowerCase()
    if (!["ttf", "otf", "woff", "woff2"].includes(ext || "")) {
      setStatus({
        type: "error",
        message: "Please upload a valid font file (.ttf, .otf, or .woff2).",
      })
      return
    }

    const previewUrl = URL.createObjectURL(file)
    const customFontFamily = `preview_${variantId}_${Date.now()}`

    // Dynamically inject @font-face to allow live browser rendering
    try {
      const buffer = await file.arrayBuffer()
      const fontFace = new FontFace(customFontFamily, buffer)
      await fontFace.load()
      document.fonts.add(fontFace)
    } catch (err) {
      console.warn("Failed to dynamically register preview font:", err)
    }

    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v
        if (v.previewUrl) URL.revokeObjectURL(v.previewUrl)
        return {
          ...v,
          file,
          previewUrl,
          fontFamilyName: customFontFamily,
        }
      })
    )
    setStatus(null)
  }

  const handleAddVariant = () => {
    const existingNames = new Set(variants.map((v) => v.name))
    const nextAvailable =
      COMMON_VARIANTS.find((v) => !existingNames.has(v)) || "extra-bold"

    const newId = `var-${Date.now()}`
    setVariants((prev) => [
      ...prev,
      {
        id: newId,
        name: nextAvailable,
        file: null,
        previewUrl: null,
        fontFamilyName: `CustomFont_${nextAvailable}`,
      },
    ])
  }

  const handleRemoveVariant = (variantId: string) => {
    if (variants.length === 1) {
      setStatus({
        type: "error",
        message: "At least one font variant is required.",
      })
      return
    }
    setVariants((prev) => {
      const target = prev.find((v) => v.id === variantId)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((v) => v.id !== variantId)
    })
  }

  const handleVariantNameChange = (variantId: string, newName: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, name: newName } : v))
    )
  }

  // Draft Registry JSON snippet
  const registryPayload = useMemo(() => {
    const validVariants = variants
      .filter((v) => v.file !== null)
      .map((v) => {
        const fileExt = v.file?.name.split(".").pop() || "ttf"
        const fileName = `${name || "example-font"}_${v.name}.${fileExt}`
        return {
          name: v.name,
          file: fileName,
          path: `assets/fonts/${name || "example-font"}/${fileName}`,
          target: `src/fonts/${name || "example-font"}/${fileName}`,
        }
      })

    return {
      name: name || "example-font",
      title: title || "Example Font",
      creator: creator || "Designer / Type Foundry",
      license,
      format,
      ...(website ? { website } : {}),
      variants: validVariants,
    }
  }, [name, title, creator, license, format, website, variants])

  const hasAtLeastOneFile = variants.some((v) => v.file !== null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (!title.trim() || !name.trim()) {
      setStatus({
        type: "error",
        message: "Please enter both the font title and the CLI identifier.",
      })
      return
    }

    if (!hasAtLeastOneFile) {
      setStatus({
        type: "error",
        message: "Please upload at least one font variant file (.ttf, .otf, or .woff2).",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("name", name)
      formData.append("creator", creator)
      formData.append("license", license)
      formData.append("format", format)
      formData.append("website", website)

      variants.forEach((v) => {
        if (v.file) {
          formData.append(`files`, v.file)
          formData.append(`variantNames`, v.name)
        }
      })

      const response = await fetch("/api/fonts/submit", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`)
      }

      setStatus({
        type: "success",
        message: "Font submitted successfully! Maintainers will review it shortly.",
      })

      // Reset Form
      setTitle("")
      setName("")
      setCreator("")
      setWebsite("")
      setIsSlugManual(false)
      setVariants([
        {
          id: `var-${Date.now()}`,
          name: "regular",
          file: null,
          previewUrl: null,
          fontFamilyName: "CustomFont_regular",
        },
      ])
    } catch (err: unknown) {
      setStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "Submission failed. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      <HeroBackground>
        <Navbar logotext={logotext} />

        <main className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 sm:px-6 sm:py-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Submit a Font
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-neutral-400 sm:text-lg">
              Submit Ge&apos;ez / Ethiopic fonts directly to the community registry.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md sm:p-8"
            >
              <h2 className="border-b border-neutral-800 pb-3 text-lg font-bold text-white">
                Font Metadata
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

              {/* Title & CLI Slug */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor={`${formId}-title`}
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    Font Title (English & Fidel) *
                  </label>
                  <input
                    id={`${formId}-title`}
                    type="text"
                    required
                    placeholder="e.g. Abyssinica SIL (አቢሲኒካ) or Nyala"
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
                      kewti-cli font
                    </span>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      required
                      placeholder="abyssinica-sil"
                      value={name}
                      onChange={handleSlugChange}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-3 pl-32 pr-4 font-mono text-sm text-orange-300 transition-colors focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Creator & License */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${formId}-creator`}
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    Created By / Foundry *
                  </label>
                  <input
                    id={`${formId}-creator`}
                    type="text"
                    required
                    placeholder="e.g. Designer Name / Type Foundry"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-license`}
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    License
                  </label>
                  <select
                    id={`${formId}-license`}
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-neutral-200 transition-colors focus:border-orange-500 focus:outline-none"
                  >
                    <option value="SIL Open Font License (OFL)">
                      SIL Open Font License (OFL)
                    </option>
                    <option value="MIT License">MIT License</option>
                    <option value="Apache 2.0">Apache 2.0</option>
                    <option value="Creative Commons (CC-BY)">Creative Commons (CC-BY)</option>
                    <option value="Proprietary / Free for Personal Use">
                      Proprietary / Free for Personal Use
                    </option>
                    <option value="Unknown License">Unknown License</option>
                  </select>
                </div>
              </div>

              {/* Format & Website */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${formId}-format`}
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    Primary Format
                  </label>
                  <select
                    id={`${formId}-format`}
                    value={format}
                    onChange={(e) =>
                      setFormat(e.target.value as "truetype" | "opentype" | "woff2")
                    }
                    className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-neutral-200 transition-colors focus:border-orange-500 focus:outline-none"
                  >
                    <option value="truetype">TrueType (.ttf)</option>
                    <option value="opentype">OpenType (.otf)</option>
                    <option value="woff2">Web Open Font Format 2 (.woff2)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-website`}
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    Website / Repository URL
                  </label>
                  <input
                    id={`${formId}-website`}
                    type="url"
                    placeholder="https://example.com/font-repo"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Font Variants Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Font Variants ({variants.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-xs font-medium text-orange-400 hover:text-orange-300"
                  >
                    + Add Variant
                  </button>
                </div>

                <div className="space-y-3">
                  {variants.map((v, idx) => (
                    <div
                      key={v.id}
                      className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <span className="font-mono text-xs text-neutral-500">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) =>
                            handleVariantNameChange(v.id, e.target.value)
                          }
                          placeholder="e.g. regular, italic, semi-bold"
                          className="w-40 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-mono text-xs text-orange-300 placeholder-neutral-600 focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        {v.file ? (
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[150px] font-mono text-xs text-emerald-400">
                              ✓ {v.file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setVariants((prev) =>
                                  prev.map((item) =>
                                    item.id === v.id
                                      ? {
                                          ...item,
                                          file: null,
                                          previewUrl: null,
                                        }
                                      : item
                                  )
                                )
                              }
                              className="text-[11px] text-neutral-500 hover:text-red-400"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer rounded-lg border border-dashed border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:border-orange-500">
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept=".ttf,.otf,.woff,.woff2"
                              className="hidden"
                              onChange={(e) =>
                                handleVariantFileChange(
                                  v.id,
                                  e.target.files?.[0]
                                )
                              }
                            />
                          </label>
                        )}

                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(v.id)}
                            className="text-xs text-red-400 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !hasAtLeastOneFile}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending Font...
                  </>
                ) : (
                  <span>Send to Maintainers</span>
                )}
              </button>
            </form>

            {/* Right Side: Live Font Specimen Card & Registry JSON */}
            <div className="space-y-6">
              {/* Font Specimen Preview Card */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                    Live Font Preview
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-neutral-400">
                      {fontSize}px
                    </span>
                    <input
                      type="range"
                      min={18}
                      max={64}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="h-1.5 w-24 accent-orange-500"
                    />
                  </div>
                </div>

                {/* Font Metadata Summary */}
                <div className="mb-6 space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {title || "Example Font (ምሳሌ ቅርጸ-ቁምፊ)"}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-300">Created by: </span>
                    {creator || "Designer / Type Foundry"}
                  </p>
                  <p className="text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-300">License: </span>
                    {license}
                  </p>
                  <p className="text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-300">Format: </span>
                    {format}
                  </p>
                </div>

                {/* Sample Text Editor */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={sampleText}
                    onChange={(e) => setSampleText(e.target.value)}
                    placeholder="Type sample Ge'ez / English text..."
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300 placeholder-neutral-600 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {/* Variants Preview List */}
                <div className="space-y-4 rounded-xl border border-neutral-800/80 bg-neutral-950/80 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Font Variants ({variants.length})
                  </div>

                  <div className="space-y-4 divide-y divide-neutral-800">
                    {variants.map((v) => (
                      <div key={v.id} className="pt-3 first:pt-0">
                        <div className="flex items-baseline justify-between text-xs font-mono">
                          <span className="text-orange-400">{v.name}</span>
                          <span className="text-neutral-500">
                            {name || "example-font"}_{v.name}
                          </span>
                        </div>

                        <div
                          style={{
                            fontFamily: v.file ? v.fontFamilyName : "inherit",
                            fontSize: `${fontSize}px`,
                          }}
                          className="mt-2 min-h-[48px] overflow-x-auto text-neutral-100 leading-normal"
                        >
                          {sampleText || "ቀስ በቀስ እንቁላል በእግሩ ይሄዳል"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generated Registry JSON */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Draft fonts-registry.json
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