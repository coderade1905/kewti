import { useState, useEffect } from "react"
import { CodeBlock } from "react-code-block"
import { useCopyToClipboard } from "react-use"
import { JSX } from "react"

interface CodeBlockProps {
  code: string
  language: string
  showLineNumbers?: boolean
}

const normalizeLanguage = (lang: string) => {
  const l = lang.toLowerCase().trim()
  return ["bash", "sh", "zsh"].includes(l) ? "bash" : l
}

export default function MyCodeBlock({
  code,
  language,
  showLineNumbers = true,
}: CodeBlockProps): JSX.Element {
  const [, copyToClipboard] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  const formattedLanguage = normalizeLanguage(language)

  const handleCopy = () => {
    copyToClipboard(code)
    setCopied(true)
  }

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <div className="group relative my-4 rounded-lg border border-zinc-800 bg-zinc-950 text-left font-mono text-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-2 text-xs text-zinc-400">
        <span>{formattedLanguage}</span>

        <button
          onClick={handleCopy}
          type="button"
          className="transition-colors hover:text-zinc-100"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code Area - Flushed to the left edge */}
      <CodeBlock code={code.trim()} language={formattedLanguage}>
        <CodeBlock.Code className="block overflow-x-auto py-3 text-zinc-200">
          <div className="table w-full border-collapse">
            <div className="table-row">
              {showLineNumbers && (
                <CodeBlock.LineNumber className="table-cell w-1 pr-4 pl-4 text-right align-top text-zinc-600 select-none" />
              )}
              <CodeBlock.LineContent
                className={`table-cell align-top ${showLineNumbers ? "pr-4 pl-0" : "px-4"}`}
              >
                <CodeBlock.Token />
              </CodeBlock.LineContent>
            </div>
          </div>
        </CodeBlock.Code>
      </CodeBlock>
    </div>
  )
}
