import { describe, it, expect } from "vitest"
import React from "react"
import { render, screen } from "@testing-library/react"
import { KewtiLocationSelector, DEFAULT_LOCATIONS } from "./component"

describe("KewtiLocationSelector Component", () => {
  it("provides non-empty default location boundaries fallback", () => {
    expect(DEFAULT_LOCATIONS.length).toBeGreaterThan(0)
    const regions = Array.from(
      new Set(DEFAULT_LOCATIONS.map((l) => l.admin1_name))
    )
    expect(regions).toContain("Addis Ababa")
    expect(regions).toContain("Oromia")
    expect(regions).toContain("Amhara")
    expect(regions).toContain("Tigray")
  })

  it("renders with embedded location fallback without throwing", () => {
    const { container } = render(
      <KewtiLocationSelector initialData={DEFAULT_LOCATIONS} />
    )
    expect(container).toBeTruthy()
    expect(screen.getByText("Select Region")).toBeTruthy()
  })
})
