import { describe, it, expect } from "vitest"
import { transliterate } from "./transliterate"

describe("Amharic Phonetic Transliteration", () => {
  it("returns empty array for empty input", () => {
    expect(transliterate("")).toEqual([])
  })

  it("transliterates single consonants to 1st order Fidel", () => {
    const results = transliterate("s")
    expect(results).toContain("ሸ")
    expect(results).toContain("ሰ")
  })

  it("transliterates consonant + vowel combinations", () => {
    const sel = transliterate("sela")
    expect(
      sel.some(
        (w) => w.startsWith("ስላ") || w.startsWith("ስላ") || w.includes("ላ")
      )
    ).toBe(true)
  })

  it("handles non-latin / punctuation characters gracefully", () => {
    expect(transliterate(" ")).toEqual([" "])
    expect(transliterate("123")).toEqual(["123"])
  })
})
