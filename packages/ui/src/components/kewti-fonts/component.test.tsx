import { describe, it, expect } from "vitest"
import React from "react"
import { render } from "@testing-library/react"
import { KewtiFonts, KewtiPronounce } from "./component"

describe("KewtiFonts and KewtiPronounce Components", () => {
  it("renders KewtiFonts without inserting line break (<br />) tags", () => {
    const { container } = render(
      <KewtiFonts font="Selam">
        <span>ሰላም</span>
      </KewtiFonts>
    )
    expect(container.querySelector("br")).toBeNull()
    const span = container.querySelector("span")
    expect(span).toBeTruthy()
    expect(span?.style.fontFamily).toBe("Selam")
    expect(span?.textContent).toBe("ሰላም")
  })

  it("renders KewtiPronounce without inserting line break (<br />) tags", () => {
    const { container } = render(
      <KewtiPronounce text="ሰላም">
        <span>ሰላም</span>
      </KewtiPronounce>
    )
    expect(container.querySelector("br")).toBeNull()
    const button = container.querySelector("button")
    expect(button).toBeTruthy()
    expect(button?.getAttribute("aria-label")).toBe("Listen: ሰላም")
  })
})
