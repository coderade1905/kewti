import { describe, it, expect } from "vitest"
import { toGeez } from "./component"

describe("toGeez numeral conversion", () => {
  it("converts single digit numbers correctly (1 to 9)", () => {
    expect(toGeez(1)).toBe("፩")
    expect(toGeez(2)).toBe("፪")
    expect(toGeez(3)).toBe("፫")
    expect(toGeez(4)).toBe("፬")
    expect(toGeez(5)).toBe("፭")
    expect(toGeez(6)).toBe("፮")
    expect(toGeez(7)).toBe("፯")
    expect(toGeez(8)).toBe("፰")
    expect(toGeez(9)).toBe("፱")
  })

  it("converts tens correctly (10 to 90)", () => {
    expect(toGeez(10)).toBe("፲")
    expect(toGeez(20)).toBe("፳")
    expect(toGeez(30)).toBe("፴")
    expect(toGeez(40)).toBe("፵")
    expect(toGeez(50)).toBe("፶")
    expect(toGeez(60)).toBe("፷")
    expect(toGeez(70)).toBe("፸")
    expect(toGeez(80)).toBe("፹")
    expect(toGeez(90)).toBe("፺")
  })

  it("converts composite numbers (11 to 99)", () => {
    expect(toGeez(11)).toBe("፲፩")
    expect(toGeez(25)).toBe("፳፭")
    expect(toGeez(77)).toBe("፸፯")
    expect(toGeez(99)).toBe("፺፱")
  })

  it("handles hundreds (omitting leading ፩ before ፻ when applicable)", () => {
    expect(toGeez(100)).toBe("፻")
    expect(toGeez(105)).toBe("፻፭")
    expect(toGeez(125)).toBe("፻፳፭")
    expect(toGeez(200)).toBe("፪፻")
    expect(toGeez(550)).toBe("፭፻፶")
  })

  it("handles zero and negative integers", () => {
    expect(toGeez(0)).toBe("0")
    expect(toGeez(-1)).toBe("-፩")
    expect(toGeez(-25)).toBe("-፳፭")
  })
})
