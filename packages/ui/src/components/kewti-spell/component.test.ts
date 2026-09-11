import { describe, it, expect } from "vitest"
import { parseDictionary, buildCorrectorIndex, KewtiSpell } from "./component"

describe("KewtiSpell Dictionary Parsing & Indexing", () => {
  it("exports KewtiSpell as a named function", () => {
    expect(typeof KewtiSpell).toBe("function")
  })

  it("handles empty or undefined dictionary text", () => {
    expect(parseDictionary()).toEqual([])
    expect(parseDictionary("")).toEqual([])
  })

  it("parses word frequency lines correctly and ignores empty lines", () => {
    const rawData = `
    ሰላም 950000
    ኢትዮጵያ 850000
    invalid_line_without_freq
    አዲስ 500000
    `
    const entries = parseDictionary(rawData)
    expect(entries).toHaveLength(3)
    expect(entries[0]).toEqual({ word: "ሰላም", freq: 950000 })
    expect(entries[1]).toEqual({ word: "ኢትዮጵያ", freq: 850000 })
    expect(entries[2]).toEqual({ word: "አዲስ", freq: 500000 })
  })

  it("builds a search index with wordSet, freqMap, and Fuse", () => {
    const sampleEntries = [
      { word: "ሰላም", freq: 950000 },
      { word: "ሰላማዊ", freq: 200000 },
    ]
    const index = buildCorrectorIndex(sampleEntries)

    expect(index.wordSet.has("ሰላም")).toBe(true)
    expect(index.wordSet.has("ሰላማዊ")).toBe(true)
    expect(index.wordSet.has("ያልታወቀ")).toBe(false)
    expect(index.freqMap.get("ሰላም")).toBe(950000)
    expect(index.maxFreq).toBe(950000)
  })
})
