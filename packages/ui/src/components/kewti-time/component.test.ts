import { describe, it, expect } from "vitest"
import { stdToEth, ethToStd24, std24To12, std12To24 } from "./component"

describe("Ethiopian and Standard Time Conversions", () => {
  describe("stdToEth (24h -> Ethiopian 12h division)", () => {
    it("converts morning (ጠዋት / tewat) correctly", () => {
      expect(stdToEth(6)).toEqual({ ethHour: 12, period: "tewat" })
      expect(stdToEth(7)).toEqual({ ethHour: 1, period: "tewat" })
      expect(stdToEth(11)).toEqual({ ethHour: 5, period: "tewat" })
    })

    it("converts afternoon (ከሰዓት / keseat) correctly", () => {
      expect(stdToEth(12)).toEqual({ ethHour: 6, period: "keseat" })
      expect(stdToEth(13)).toEqual({ ethHour: 7, period: "keseat" })
      expect(stdToEth(17)).toEqual({ ethHour: 11, period: "keseat" })
    })

    it("converts evening (ምሽት / mishit) correctly", () => {
      expect(stdToEth(18)).toEqual({ ethHour: 12, period: "mishit" })
      expect(stdToEth(19)).toEqual({ ethHour: 1, period: "mishit" })
      expect(stdToEth(23)).toEqual({ ethHour: 5, period: "mishit" })
    })

    it("converts night (ሌሊት / lelit) correctly", () => {
      expect(stdToEth(0)).toEqual({ ethHour: 6, period: "lelit" })
      expect(stdToEth(1)).toEqual({ ethHour: 7, period: "lelit" })
      expect(stdToEth(5)).toEqual({ ethHour: 11, period: "lelit" })
    })
  })

  describe("ethToStd24 (Ethiopian 12h division -> 24h)", () => {
    it("converts tewat back to 24h", () => {
      expect(ethToStd24(12, "tewat")).toBe(6)
      expect(ethToStd24(1, "tewat")).toBe(7)
      expect(ethToStd24(5, "tewat")).toBe(11)
    })

    it("converts keseat back to 24h", () => {
      expect(ethToStd24(6, "keseat")).toBe(12)
      expect(ethToStd24(7, "keseat")).toBe(13)
      expect(ethToStd24(11, "keseat")).toBe(17)
    })

    it("converts mishit back to 24h", () => {
      expect(ethToStd24(12, "mishit")).toBe(18)
      expect(ethToStd24(1, "mishit")).toBe(19)
      expect(ethToStd24(5, "mishit")).toBe(23)
    })

    it("converts lelit back to 24h", () => {
      expect(ethToStd24(6, "lelit")).toBe(0)
      expect(ethToStd24(7, "lelit")).toBe(1)
      expect(ethToStd24(11, "lelit")).toBe(5)
    })
  })

  describe("std24To12 & std12To24 (Standard 12h/24h conversion)", () => {
    it("converts 24h to 12h with AM/PM", () => {
      expect(std24To12(0)).toEqual({ stdHour12: 12, period: "AM" })
      expect(std24To12(12)).toEqual({ stdHour12: 12, period: "PM" })
      expect(std24To12(13)).toEqual({ stdHour12: 1, period: "PM" })
      expect(std24To12(23)).toEqual({ stdHour12: 11, period: "PM" })
    })

    it("converts 12h with AM/PM back to 24h", () => {
      expect(std12To24(12, "AM")).toBe(0)
      expect(std12To24(12, "PM")).toBe(12)
      expect(std12To24(1, "PM")).toBe(13)
      expect(std12To24(11, "PM")).toBe(23)
    })
  })
})
