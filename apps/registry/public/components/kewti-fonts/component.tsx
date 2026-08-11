import React from "react"
import { Volume2 } from "lucide-react"

interface KewtiFontsProps {
  font: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function KewtiFonts({
  font,
  className,
  style,
  children,
}: KewtiFontsProps) {
  return (
    <>
      <span
        className={className}
        style={{ fontFamily: font, ...style } as React.CSSProperties}
      >
        {children}
      </span>
      <br />
    </>
  )
}

interface KewtiPronounceProps {
  text: string
  lang?: string
  className?: string
  iconClassName?: string
  children?: React.ReactNode
}

export function KewtiPronounce({
  text,
  lang = "am-ET",
  className = "",
  iconClassName = "",
  children,
}: KewtiPronounceProps) {
  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      window.speechSynthesis.speak(utterance)
    } else {
      console.warn("Web Speech API is not supported in this browser.")
    }
  }

  return (
    <>
      <span
        className={`inline-flex items-center gap-1 align-middle ${className}`}
      >
        {children}
        <button
          type="button"
          onClick={handleSpeak}
          className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:outline-none"
          title={`Listen: ${text}`}
          aria-label={`Listen: ${text}`}
        >
          <Volume2 className={`h-3 w-3 md:h-4 md:w-4 ${iconClassName}`} />
        </button>
      </span>
      <br />
    </>
  )
}
