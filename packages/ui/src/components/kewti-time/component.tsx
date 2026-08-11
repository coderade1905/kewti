import React from "react"

export interface TimeValue {
  hour: number // 0 - 23 (Standard 24-hour time)
  minute: number // 0 - 59
}

export type TimePickerMode = "eth" | "std"

export interface EthiopianTimePickerProps {
  value: TimeValue
  onChange: (value: TimeValue) => void
  mode?: TimePickerMode // 'eth' or 'std' passed from your external tabs/toggle
  className?: string
  style?: React.CSSProperties
  selectClassName?: string
  selectStyle?: React.CSSProperties
  labelClassName?: string
  labelStyle?: React.CSSProperties
}

type AmharicPeriod = "tewat" | "keseat" | "mishit" | "lelit"
type StandardPeriod = "AM" | "PM"

const PERIODS: Record<
  AmharicPeriod,
  { label: string; validEthHours: number[] }
> = {
  tewat: { label: "ጠዋት", validEthHours: [12, 1, 2, 3, 4, 5] },
  keseat: { label: "ከሰዓት", validEthHours: [6, 7, 8, 9, 10, 11] },
  mishit: { label: "ምሽት", validEthHours: [12, 1, 2, 3, 4, 5] },
  lelit: { label: "ሌሊት", validEthHours: [6, 7, 8, 9, 10, 11] },
}

// Convert standard 24h -> Ethiopian hour + period
function stdToEth(std24: number): { ethHour: number; period: AmharicPeriod } {
  const ethHour = (std24 + 6) % 12 || 12

  let period: AmharicPeriod = "tewat"
  if (std24 >= 6 && std24 < 12) period = "tewat"
  else if (std24 >= 12 && std24 < 18) period = "keseat"
  else if (std24 >= 18 && std24 < 24) period = "mishit"
  else period = "lelit"

  return { ethHour, period }
}

// Convert Ethiopian hour + period -> standard 24h
function ethToStd24(ethHour: number, period: AmharicPeriod): number {
  if (period === "tewat") return ethHour === 12 ? 6 : ethHour + 6
  if (period === "keseat") return ethHour + 6
  if (period === "mishit") return ethHour === 12 ? 18 : ethHour + 18
  return ethHour === 12 ? 0 : ethHour - 6 // lelit
}

// Convert standard 24h -> 12h hour + AM/PM
function std24To12(std24: number): {
  stdHour12: number
  period: StandardPeriod
} {
  const stdHour12 = std24 % 12 || 12
  const period: StandardPeriod = std24 >= 12 ? "PM" : "AM"
  return { stdHour12, period }
}

// Convert 12h hour + AM/PM -> standard 24h
function std12To24(stdHour12: number, period: StandardPeriod): number {
  if (period === "AM") return stdHour12 === 12 ? 0 : stdHour12
  return stdHour12 === 12 ? 12 : stdHour12 + 12
}

export const KewtiTime: React.FC<EthiopianTimePickerProps> = ({
  value,
  onChange,
  mode = "eth",
  className = "",
  style,
  selectClassName = "",
  selectStyle,
  labelClassName = "",
  labelStyle,
}) => {
  // Ethiopian state derived from standard 24h value
  const { ethHour, period: ethPeriod } = stdToEth(value.hour)

  // Standard 12h state derived from standard 24h value
  const { stdHour12, period: stdPeriod } = std24To12(value.hour)

  // Handlers for Ethiopian Mode
  const handleEthPeriodChange = (newPeriod: AmharicPeriod) => {
    let nextEthHour = ethHour
    if (!PERIODS[newPeriod].validEthHours.includes(ethHour)) {
      nextEthHour = PERIODS[newPeriod].validEthHours[0] ?? 12
    }
    onChange({
      hour: ethToStd24(nextEthHour, newPeriod),
      minute: value.minute,
    })
  }

  const handleEthHourChange = (newEthHour: number) => {
    onChange({
      hour: ethToStd24(newEthHour, ethPeriod),
      minute: value.minute,
    })
  }

  // Handlers for Standard Mode
  const handleStdHourChange = (newStdHour12: number) => {
    onChange({
      hour: std12To24(newStdHour12, stdPeriod),
      minute: value.minute,
    })
  }

  const handleStdPeriodChange = (newStdPeriod: StandardPeriod) => {
    onChange({
      hour: std12To24(stdHour12, newStdPeriod),
      minute: value.minute,
    })
  }

  const handleMinuteChange = (newMinute: number) => {
    onChange({
      hour: value.hour,
      minute: newMinute,
    })
  }

  const baseSelectClass =
    "h-8 px-1.5 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded border-0 outline-none cursor-pointer focus:ring-1 focus:ring-ring"
  const periodSelectClass =
    "h-8 px-2 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded border-0 outline-none cursor-pointer hover:bg-secondary/80 focus:ring-1 focus:ring-ring"
  const baseLabelClass = "text-muted-foreground font-bold select-none text-xs"

  return (
    <div
      style={style}
      className={`inline-flex items-center gap-1.5 rounded-md border border-input bg-background p-1 pr-2 pl-2 text-foreground shadow-sm ${className}`.trim()}
    >
      {mode === "eth" ? (
        <>
          <select
            value={ethPeriod}
            onChange={(e) =>
              handleEthPeriodChange(e.target.value as AmharicPeriod)
            }
            style={selectStyle}
            className={`${periodSelectClass} ${selectClassName}`.trim()}
          >
            {Object.entries(PERIODS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={ethHour}
            onChange={(e) => handleEthHourChange(Number(e.target.value))}
            style={selectStyle}
            className={`${baseSelectClass} ${selectClassName}`.trim()}
          >
            {PERIODS[ethPeriod].validEthHours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <span
            style={labelStyle}
            className={`${baseLabelClass} ${labelClassName}`.trim()}
          >
            {" ሰአት ከ "}
          </span>
        </>
      ) : (
        <>
          <select
            value={stdHour12}
            onChange={(e) => handleStdHourChange(Number(e.target.value))}
            style={selectStyle}
            className={`${baseSelectClass} ${selectClassName}`.trim()}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <span
            style={labelStyle}
            className={`${baseLabelClass} ${labelClassName}`.trim()}
          >
            :
          </span>
        </>
      )}

      {/* MINUTE SELECTOR (Shared across both modes) */}
      <select
        value={value.minute}
        onChange={(e) => handleMinuteChange(Number(e.target.value))}
        style={selectStyle}
        className={`${baseSelectClass} ${selectClassName}`.trim()}
      >
        {Array.from({ length: 60 }, (_, i) => (
          <option key={i} value={i}>
            {i < 10 ? `0${i}` : i}
          </option>
        ))}
      </select>

      {mode === "eth" && (
        <span
          style={labelStyle}
          className={`${baseLabelClass} ${labelClassName}`.trim()}
        >
          {" ደቂቃ "}
        </span>
      )}

      {mode === "std" && (
        <select
          value={stdPeriod}
          onChange={(e) =>
            handleStdPeriodChange(e.target.value as StandardPeriod)
          }
          style={selectStyle}
          className={`${periodSelectClass} ${selectClassName}`.trim()}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      )}
    </div>
  )
}

export default KewtiTime
