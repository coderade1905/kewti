"use client"

import { useEffect, useState, JSX } from "react"

type DownloadStatus = "idle" | "loading" | "done" | "error"

interface FontDownloadButtonProps {
  onDownload: () => Promise<void>
  label?: string
  title: string
  showLabel?: boolean
  className?: string
  disabled?: boolean
}

export default function FontDownloadButton({
  onDownload,
  label = "Download",
  title,
  showLabel = false,
  className = "",
  disabled = false,
}: FontDownloadButtonProps): JSX.Element {
  const [status, setStatus] = useState<DownloadStatus>("idle")

  useEffect(() => {
    if (status === "idle" || status === "loading") return

    const timer = setTimeout(() => setStatus("idle"), 2000)

    return () => clearTimeout(timer)
  }, [status])

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setStatus("loading")

    try {
      await onDownload()
      setStatus("done")
    } catch (error: unknown) {
      console.error("Download failed:", error)
      setStatus("error")
    }
  }

  const text =
    status === "done" ? "Downloaded" : status === "error" ? "Failed" : label

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      disabled={disabled || status === "loading"}
      className={`inline-flex items-center justify-center gap-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {status === "loading" ? (
        <svg
          className="h-4 w-4 shrink-0 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : status === "done" ? (
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
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : status === "error" ? (
        <svg
          className="h-4 w-4 shrink-0 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      )}

      {showLabel && <span>{text}</span>}
    </button>
  )
}
