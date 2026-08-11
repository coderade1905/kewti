export const abugida: Record<string, string[]> = {
  ሀ: ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  ለ: ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"],
  ሐ: ["ሐ", "ሑ", "ሒ", "ሓ", "ሔ", "ሕ", "ሖ"],
  መ: ["መ", "ሙ", "ሚ", "ማ", "ሜ", "ም", "ሞ"],
  ሠ: ["ሠ", "ሡ", "ሢ", "ሣ", "ሤ", "ሥ", "ሦ"],
  ረ: ["ረ", "ሩ", "ሪ", "ራ", "ሬ", "ር", "ሮ"],
  ሰ: ["ሰ", "ሱ", "ሲ", "ሳ", "ሴ", "ስ", "ሶ"],
  ሸ: ["ሸ", "ሹ", "ሺ", "ሻ", "ሼ", "ሽ", "ሾ"],
  ቀ: ["ቀ", "ቁ", "ቂ", "ቃ", "ቄ", "ቅ", "ቆ"],
  በ: ["በ", "ቡ", "ቢ", "ባ", "ቤ", "ብ", "ቦ"],
  ተ: ["ተ", "ቱ", "ቲ", "ታ", "ቴ", "ት", "ቶ"],
  ቸ: ["ቸ", "ቹ", "ቺ", "ቻ", "ቼ", "ች", "ቾ"],
  ኅ: ["ኅ", "ኁ", "ኂ", "ኃ", "ኄ", "ኅ", "ኆ"],
  ነ: ["ነ", "ኑ", "ኒ", "ና", "ኔ", "ን", "ኖ"],
  ኘ: ["ኘ", "ኙ", "ኚ", "ኛ", "ኜ", "ኝ", "ኞ"],
  አ: ["አ", "ኡ", "ኢ", "ኣ", "ኤ", "እ", "ኦ"],
  ከ: ["ከ", "ኩ", "ኪ", "ካ", "ኬ", "ክ", "ኮ"],
  ኸ: ["ኸ", "ኹ", "ኺ", "ኻ", "ኼ", "ኽ", "ኾ"],
  ወ: ["ወ", "ዉ", "ዊ", "ዋ", "ዌ", "ው", "ዎ"],
  ዐ: ["ዐ", "ዑ", "ዒ", "ዓ", "ዔ", "ዕ", "ዖ"],
  ዘ: ["ዘ", "ዙ", "ዚ", "ዛ", "ዜ", "ዝ", "ዞ"],
  ዠ: ["ዠ", "ዡ", "ዢ", "ዣ", "ዤ", "ዥ", "ዦ"],
  የ: ["የ", "ዩ", "ዪ", "ያ", "ዬ", "ይ", "ዮ"],
  ደ: ["ደ", "ዱ", "ዲ", "ዳ", "ዴ", "ድ", "ዶ"],
  ጀ: ["ጀ", "ጁ", "ጂ", "ጃ", "ጄ", "ጅ", "ጆ"],
  ገ: ["ገ", "ጉ", "ጊ", "ጋ", "ጌ", "ግ", "ጐ"],
  ጠ: ["ጠ", "ጡ", "ጢ", "ጣ", "ጤ", "ጥ", "ጦ"],
  ጨ: ["ጨ", "ጩ", "ጪ", "ጫ", "ጬ", "ጭ", "ጮ"],
  ጰ: ["ጰ", "ጱ", "ጲ", "ጳ", "ጴ", "ጵ", "ጶ"],
  ጸ: ["ጸ", "ጹ", "ጺ", "ጻ", "ጼ", "ጽ", "ጾ"],
  ፀ: ["ፀ", "ፁ", "ፂ", "ፃ", "ፄ", "ፅ", "ፆ"],
  ፈ: ["ፈ", "ፉ", "ፊ", "ፋ", "ፌ", "ፍ", "ፎ"],
  ፐ: ["ፐ", "ፑ", "ፒ", "ፓ", "ፔ", "ፕ", "ፖ"],
  ቨ: ["ቨ", "ቩ", "ቪ", "ቫ", "ቬ", "ቭ", "ቮ"],
  "።": ["።"],
  "፣": ["፣"],
  "፤": ["፤"],
  "፥": ["፥"],
  "፧": ["፧"],
}

export const chars: Record<string, string[]> = {
  b: ["በ"],
  c: ["ሰ", "ጨ", "ቸ", "ከ"],
  d: ["ደ"],
  f: ["ፈ"],
  g: ["ገ", "ጀ"],
  h: ["ሀ", "ሐ", "ኅ", "ኸ"],
  j: ["ጀ"],
  k: ["ከ", "ቀ"],
  l: ["ለ"],
  m: ["መ"],
  n: ["ነ", "ኘ"],
  p: ["ፐ", "ጰ"],
  q: ["ቀ"],
  r: ["ረ"],
  s: ["ሸ", "ሰ", "ሠ"],
  t: ["ተ", "ጠ", "ፀ", "ጸ"],
  v: ["ቨ"],
  w: ["ወ"],
  x: ["አ", "ዐ", "ዠ"],
  y: ["የ"],
  z: ["ዘ", "ዠ"],
  ".": ["።"],
  ",": ["፣"],
  ";": ["፤"],
  ":": ["፥"],
}

export const same: Record<string, string[]> = {
  ሀ: ["ሐ", "ኅ"],
  ሐ: ["ኅ", "ሀ"],
  ኅ: ["ሐ", "ሀ"],
  ሰ: ["ሠ"],
  ሠ: ["ሰ"],
  ፀ: ["ጸ"],
  ጸ: ["ፀ"],
  አ: ["ዐ"],
  ዐ: ["አ"],
}

const reverseLookup = new Map<string, { root: string; index: number }>()
Object.entries(abugida).forEach(([root, forms]) => {
  forms.forEach((char, index) => reverseLookup.set(char, { root, index }))
})

const vowelMap: Record<string, number> = { a: 3, e: 5, i: 2, o: 6, u: 1 }

function getBaseTransliteration(text: string): string {
  let result = ""
  let lastRoot: string | null = null

  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i).toLowerCase()
    const next = text.charAt(i + 1).toLowerCase()

    if (char in chars) {
      const roots = chars[char]
      if (!roots || roots.length === 0) {
        result += text[i]
        lastRoot = null
      } else {
        const root = roots[0]!
        const forms = abugida[root]
        result += forms?.[0] ?? text[i]
        lastRoot = root
      }
    } else if (char === "i" && next === "e" && lastRoot) {
      const forms = abugida[lastRoot]
      result = result.slice(0, -1) + (forms?.[4] ?? lastRoot)
      i++
    } else if (char in vowelMap && lastRoot) {
      const forms = abugida[lastRoot]
      const vowelIndex = vowelMap[char as keyof typeof vowelMap]!
      result = result.slice(0, -1) + (forms?.[vowelIndex] ?? lastRoot)
    } else {
      const existing = reverseLookup.get(text.charAt(i))
      result += text.charAt(i)
      lastRoot = existing ? existing.root : (null as any)
    }
  }
  return result
}
const base = getBaseTransliteration("qalxc2.a")
console.log(base, 111)

export function transliterate(text: string): string[] {
  if (!text) return []
  // 1. Get the 1-to-1 default word
  const base = getBaseTransliteration(text)
  const lastChar = base.charAt(base.length - 1)
  const lookup = reverseLookup.get(lastChar)

  // If the last character isn't Amharic, just return base
  if (!lookup) return [base]

  const { root, index } = lookup
  const lastInputChar = text.charAt(text.length - 1).toLowerCase()

  // 2. Identify alternatives ONLY for the root of the very last character
  const phoneticSame = same[root] || []
  const charVariants = chars[lastInputChar] || []

  const allPossibleRoots = Array.from(
    new Set([root, ...phoneticSame, ...charVariants])
  )

  // 3. Rebuild the word: Prefix (all except last char) + alternative last char
  const prefix = base.slice(0, -1)
  return allPossibleRoots
    .map((r) => abugida[r]?.[index])
    .filter((char): char is string => char !== undefined)
    .map((char) => prefix + char)
}
