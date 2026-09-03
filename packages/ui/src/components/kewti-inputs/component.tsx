"use client"

import * as React from "react"
import { transliterate } from "./transliterate"
import { Mic, StopCircle } from "lucide-react"
import KewtiSpell from "../kewti-spell/component"

export interface KewtiInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> {
  variant?: "input" | "textarea"
  value?: string
  /** Callback for value changes (string based) - Recommended for custom state */
  onValueChange?: (value: string) => void
  /** Standard React change event - Recommended for libraries like react-hook-form */
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
  /** Triggered on Enter (if input) or Enter without Shift (if textarea) */
  onSend?: (value: string) => void
  /** Styles applied to the outer container */
  className?: string
  /** Styles applied to the actual input/textarea element */
  inputClassName?: string
  defaultLanguage?: "am" | "en"
  showVoiceInput?: boolean
  /** When true, wraps the input with KewtiSpell */
  spellCheck?: boolean
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export const KewtiInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  KewtiInputProps
>(
  (
    {
      variant = "input",
      value,
      onValueChange,
      onChange,
      onSend,
      className = "",
      inputClassName = "",
      defaultLanguage = "am",
      style,
      disabled = false,
      onKeyDown,
      showVoiceInput = false,
      spellCheck = false,
      ...props
    },
    ref
  ) => {
    // Controlled vs Uncontrolled seamlessly handled
    const [internalValue, setInternalValue] = React.useState(value || "")
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const [options, setOptions] = React.useState<string[]>([])
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [language, setLanguage] = React.useState<"am" | "en">(defaultLanguage)
    const [speechSupported, setSpeechSupported] = React.useState(true)
    const [listening, setListening] = React.useState(false)

    const recognitionRef = React.useRef<any>(null)
    const inputRef = React.useRef<
      HTMLTextAreaElement | HTMLInputElement | null
    >(null)

    // Ref synchronization for external usage
    const setRefs = React.useCallback(
      (node: HTMLInputElement | HTMLTextAreaElement | null) => {
        inputRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const valueRef = React.useRef(currentValue)
    const textBeforeRecordingRef = React.useRef("")

    React.useEffect(() => {
      valueRef.current = currentValue
    }, [currentValue])

    const updateValue = (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    // --- Cursor helpers -------------------------------------------------
    const getSelectionStart = () => {
      const el = inputRef.current
      return el?.selectionStart ?? currentValue.length
    }

    const getTextBeforeCursor = () => currentValue.slice(0, getSelectionStart())
    const getTextAfterCursor = () => currentValue.slice(getSelectionStart())

    const suppressNextChangeRef = React.useRef(false)

    const setInputValue = (nextValue: string, cursorPos?: number) => {
      updateValue(nextValue)

      const el = inputRef.current
      if (!el) return

      const nativeSetter = Object.getOwnPropertyDescriptor(
        variant === "textarea"
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype,
        "value"
      )?.set

      nativeSetter?.call(el, nextValue)

      suppressNextChangeRef.current = true
      const nativeEvent = new Event("input", { bubbles: true })
      el.dispatchEvent(nativeEvent)
      onChange?.(
        nativeEvent as unknown as React.ChangeEvent<
          HTMLTextAreaElement | HTMLInputElement
        >
      )

      if (cursorPos !== undefined) {
        requestAnimationFrame(() => {
          el.setSelectionRange(cursorPos, cursorPos)
        })
      }
    }

    React.useEffect(() => {
      if (typeof window === "undefined") return

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        setSpeechSupported(false)
        return
      }

      const recognition = new SpeechRecognition()
      recognition.lang = "am-ET"
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onstart = () => {
        setListening(true)
        textBeforeRecordingRef.current = valueRef.current
      }

      recognition.onend = () => {
        setListening(false)
      }

      recognition.onerror = (e: any) => {
        console.error("Speech error:", e)
        setListening(false)
      }

      recognition.onresult = (event: any) => {
        let transcript = ""

        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }

        const prefix = textBeforeRecordingRef.current
        const newValue =
          prefix + (prefix && !prefix.endsWith(" ") ? " " : "") + transcript

        updateValue(newValue)
      }

      recognitionRef.current = recognition
    }, [isControlled, onValueChange])

    // Auto-expand logic for textarea
    React.useEffect(() => {
      if (variant === "textarea" && inputRef.current) {
        const el = inputRef.current as HTMLTextAreaElement
        el.style.height = "auto"
        const newHeight = Math.min(el.scrollHeight, 120)
        el.style.height = `${newHeight}px`
      }
    }, [currentValue, variant])

    const toggleRecording = () => {
      if (listening) {
        recognitionRef.current?.stop()
      } else {
        recognitionRef.current?.start()
      }
    }

    const getCurrentWord = (text: string) => text.match(/(\S+)$/)?.[0] || ""
    const replaceCurrentWord = (text: string, replacement: string) =>
      text.replace(/(\S+)$/, replacement)

    const applyOption = (opt: string) => {
      if (!opt) return
      const el = inputRef.current
      if (!el) return

      const textBeforeCursor = getTextBeforeCursor()
      const textAfterCursor = getTextAfterCursor()
      const currentWord = getCurrentWord(textBeforeCursor)
      const newWordWithSpace = opt + " "
      const newCursorPos =
        textBeforeCursor.length - currentWord.length + newWordWithSpace.length
      const nextValue =
        replaceCurrentWord(textBeforeCursor, newWordWithSpace) + textAfterCursor

      setInputValue(nextValue, newCursorPos)
      el.focus()

      setOptions([])
      setSelectedIndex(0)
    }

    const handleChange = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      if (suppressNextChangeRef.current) {
        suppressNextChangeRef.current = false
        return
      }

      const newValue = e.target.value
      const cursor = e.target.selectionStart ?? newValue.length
      const hasOptions = options.length > 0

      if (hasOptions && /^[1-9]$/.test(newValue.slice(cursor - 1, cursor))) {
        const digit = newValue.slice(cursor - 1, cursor)
        const nextIdx = Math.min(Number(digit) - 1, options.length - 1)
        setSelectedIndex(nextIdx)

        const nextOption = options[nextIdx]
        if (nextOption) {
          const textBeforeDigit = newValue.slice(0, cursor - 1)
          const textAfterDigit = newValue.slice(cursor)
          const currentWord = getCurrentWord(textBeforeDigit)

          const cursorPos =
            textBeforeDigit.length - currentWord.length + nextOption.length
          const nextValue =
            replaceCurrentWord(textBeforeDigit, nextOption) + textAfterDigit

          setInputValue(nextValue, cursorPos)
        }
        e.preventDefault()
        return
      }

      updateValue(newValue)
      onChange?.(e)

      if (language !== "am") {
        setOptions([])
        return
      }

      setSelectedIndex(0)
      const textBeforeCursor = newValue.slice(0, cursor)
      const currentWord = getCurrentWord(textBeforeCursor)
      if (!currentWord.trim()) {
        setOptions([])
        return
      }

      const list = transliterate(currentWord)
      const unique = Array.from(new Set([...list, currentWord]))

      if (unique.length > 1) {
        setOptions(unique)
      } else {
        setOptions([])
      }
    }

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      const hasOptions = options.length > 0

      if (language === "am" && hasOptions) {
        if (e.key === " ") {
          e.preventDefault()
          const option = options[selectedIndex]
          if (option) applyOption(option)
          return
        }

        const isNext = e.key === "ArrowRight" || e.key === "ArrowDown"
        const isPrev = e.key === "ArrowLeft" || e.key === "ArrowUp"

        if (isNext || isPrev) {
          e.preventDefault()
          const step = isNext ? 1 : -1
          const nextIdx =
            (selectedIndex + step + options.length) % options.length
          setSelectedIndex(nextIdx)

          const nextOption = options[nextIdx]
          if (nextOption) {
            const textBeforeCursor = getTextBeforeCursor()
            const textAfterCursor = getTextAfterCursor()
            const currentWord = getCurrentWord(textBeforeCursor)

            const cursorPos =
              textBeforeCursor.length - currentWord.length + nextOption.length
            const nextValue =
              replaceCurrentWord(textBeforeCursor, nextOption) + textAfterCursor

            setInputValue(nextValue, cursorPos)
          }
          return
        }

        if (e.key === "Enter") {
          e.preventDefault()
          const option = options[selectedIndex]
          if (option) applyOption(option)
          return
        }
      }

      if (e.key === "Enter" && !hasOptions) {
        if (onSend && (variant === "input" || !e.shiftKey)) {
          e.preventDefault()
          if (currentValue.trim()) {
            onSend(currentValue)
          }
        }
      }

      onKeyDown?.(e)
    }

    const toggleLanguage = () => {
      setLanguage((prev) => (prev === "am" ? "en" : "am"))
      setOptions([])
      inputRef.current?.focus()
    }

    const containerClasses = [
      "relative flex w-full items-end gap-2 rounded-md border border-input bg-background px-2 py-1 shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ]
      .filter(Boolean)
      .join(" ")

    const sharedClassNames = [
      "w-full flex-1 border-0 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-0 focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      variant === "textarea"
        ? "min-h-[40px] w-full resize-none overflow-y-auto"
        : "h-10",
      inputClassName,
    ]
      .filter(Boolean)
      .join(" ")

    const ghostButtonClassNames =
      "inline-flex h-8 w-8 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shrink-0"

    // Underlying input or textarea element
    const inputElement =
      variant === "textarea" ? (
        <textarea
          ref={setRefs as React.Ref<HTMLTextAreaElement>}
          className={sharedClassNames}
          value={currentValue}
          onChange={
            handleChange as React.ChangeEventHandler<HTMLTextAreaElement>
          }
          onKeyDown={
            handleKeyDown as React.KeyboardEventHandler<HTMLTextAreaElement>
          }
          disabled={disabled}
          rows={1}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={setRefs as React.Ref<HTMLInputElement>}
          className={sharedClassNames}
          type="text"
          value={currentValue}
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
          onKeyDown={
            handleKeyDown as React.KeyboardEventHandler<HTMLInputElement>
          }
          disabled={disabled}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )

    return (
      <div className={containerClasses} style={style}>
        {options.length > 0 && language === "am" && (
          <div
            className="absolute left-4 z-50 flex max-w-[calc(100%-2rem)] animate-in flex-wrap items-center gap-1 overflow-auto rounded-xl border bg-popover px-2 py-1.5 shadow-lg fade-in slide-in-from-bottom-2"
            style={{ bottom: "calc(100% + 8px)" }}
          >
            {options.map((opt, idx) => {
              const optionButtonClasses = [
                "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                idx === selectedIndex
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              ]
                .filter(Boolean)
                .join(" ")

              return (
                <div className="grid grid-rows-2" key={idx}>
                  <span className="flex justify-center text-xs text-zinc-400">
                    {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      applyOption(opt)
                      inputRef.current?.focus()
                    }}
                    className={optionButtonClasses}
                  >
                    <span>{opt}</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="mb-1 flex shrink-0 items-center justify-center">
          <button
            type="button"
            className={ghostButtonClassNames}
            onClick={toggleLanguage}
            disabled={disabled}
            title={
              language === "am" ? "Switch to English" : "Switch to Amharic"
            }
          >
            <span className="text-[10px] font-bold">
              {language === "am" ? "አማ" : "EN"}
            </span>
          </button>
        </div>

        {/* Conditionally wrap with KewtiSpell if spellCheck is enabled */}
        {spellCheck ? (
          <div className="flex-1 w-full relative">
            <KewtiSpell>{inputElement}</KewtiSpell>
          </div>
        ) : (
          inputElement
        )}

        {speechSupported && (
          <div className="mb-1 flex shrink-0 items-center justify-center">
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled}
              className={ghostButtonClassNames}
              style={{ display: showVoiceInput === true ? "flex" : "none" }}
            >
              {listening ? (
                <StopCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
      </div>
    )
  }
)

KewtiInput.displayName = "KewtiInput"