import React from "react"
import { toWords } from "to-words"

type ToWordsOptions = NonNullable<Parameters<typeof toWords>[1]>

// Ge'ez numeral symbols
const ONES: Record<number, string> = {
  1: "፩",
  2: "፪",
  3: "፫",
  4: "፬",
  5: "፭",
  6: "፮",
  7: "፯",
  8: "፰",
  9: "፱",
}

const TENS: Record<number, string> = {
  10: "፲",
  20: "፳",
  30: "፴",
  40: "፵",
  50: "፶",
  60: "፷",
  70: "፸",
  80: "፹",
  90: "፺",
}

/**
 * Converts a positive integer into its Ge'ez numeral string representation.
 */
export function toGeez(num: number): string {
  if (num === 0) return "0" // Traditional Ge'ez numeral system has no zero symbol
  if (num < 0) return `-${toGeez(Math.abs(num))}`

  let result = ""
  // Split number into groups of 2 digits (powers of 100) from right to left
  const groups: number[] = []
  let temp = Math.floor(num)

  while (temp > 0) {
    groups.push(temp % 100)
    temp = Math.floor(temp / 100)
  }

  for (let i = groups.length - 1; i >= 0; i--) {
    const groupVal = groups[i] ?? 0
    const tens = Math.floor(groupVal / 10) * 10
    const ones = groupVal % 10

    let groupStr = ""
    if (tens > 0) groupStr += TENS[tens]
    if (ones > 0) groupStr += ONES[ones]

    // Omit '፩' (1) before ፻ (100) or ፼ (10,000) if it's the leading digit
    if (groupStr === "፩" && i > 0 && i === groups.length - 1) {
      groupStr = ""
    }

    if (groupVal > 0 || i === 0) {
      result += groupStr
    }

    // Append 100 (፻) or 10,000 (፼) separators for higher powers
    if (i > 0) {
      result += i % 2 === 1 ? "፻" : "፼"
    }
  }

  return result
}

/**
 * Converts a number to Amharic written words (letters) using to-words.
 * Supports Ethiopian Birr (ብር) and Santim (ሳንቲም) currency formatting.
 */
export function toAmharicWords(
  num: number,
  options?: Omit<ToWordsOptions, "localeCode">
): string {
  return toWords(num, {
    localeCode: "am-ET",
    ...options,
  })
}

export interface KewtiNumeralsProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The numerical value to display */
  value: number
  /**
   * The display system:
   * - "geez": Traditional Ge'ez numerals (፩, ፪, ፲, etc.)
   * - "arabic": Standard digits (1,234)
   * - "words": Spelled-out words in Amharic (አንድ ሺህ ሁለት መቶ...)
   */
  system?: "geez" | "arabic" | "words"
  /**
   * Whether to format as currency.
   * - In "words" mode: appends "ብር" and "ሳንቲም"
   * - In "arabic" mode: formats as currency (defaults to ETB)
   */
  currency?: boolean
  /**
   * ISO 4217 currency code when currency is enabled (default: "ETB").
   * Examples: "ETB", "USD", "EUR"
   */
  currencyCode?: string
  /**
   * How the currency is displayed in arabic mode.
   * - "code": "ETB 1,234.50" (default)
   * - "symbol": "ETB 1,234.50" / "$1,234.50"
   * - "narrowSymbol": "ETB 1,234.50" / "$1,234.50"
   * - "name": "1,234.50 Ethiopian birr"
   */
  currencyDisplay?: "code" | "symbol" | "narrowSymbol" | "name"
  /**
   * Optional locale code.
   * - Defaults to "am-ET" when system="words"
   * - Defaults to "en-US" when system="arabic"
   */
  locale?: ToWordsOptions["localeCode"]
  /** Additional options forwarded to to-words when system="words" */
  wordOptions?: Omit<ToWordsOptions, "localeCode" | "currency">
}

export const KewtiNumerals: React.FC<KewtiNumeralsProps> = ({
  value,
  system = "geez",
  currency = false,
  currencyCode = "ETB",
  currencyDisplay = "code",
  locale,
  wordOptions,
  className,
  ...rest
}) => {
  let formattedValue: string

  switch (system) {
    case "geez":
      formattedValue = toGeez(value)
      break

    case "words": {
      const activeLocale = locale ?? "am-ET"
      formattedValue = toWords(value, {
        localeCode: activeLocale,
        currency,
        ...wordOptions,
      })
      break
    }

    case "arabic":
    default: {
      const activeLocale = locale ?? "en-US"
      formattedValue = currency
        ? value.toLocaleString(activeLocale, {
            style: "currency",
            currency: currencyCode,
            currencyDisplay,
          })
        : value.toLocaleString(activeLocale)
      break
    }
  }

  return (
    <span className={className} {...rest}>
      {formattedValue}
    </span>
  )
}