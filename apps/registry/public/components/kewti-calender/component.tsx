import React, { useState, useEffect, useRef, useMemo } from "react"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react"
import { motion } from "framer-motion"
import Kenat, { getHoliday, getHolidaysForYear, monthNames } from "kenat"
import MonthAnimation from "./MonthAnimation"

// --- Multi‑Asset & Multi‑Theme Configuration ---
const MONTH_THEMES: Record<
  number,
  { bgClass: string; selectedAccent: string }
> = {
  1: {
    bgClass: "from-amber-500/10 via-amber-500/2 to-transparent",
    selectedAccent:
      "bg-amber-500 text-neutral-950 font-semibold shadow-sm shadow-amber-500/20",
  },
  2: {
    bgClass: "from-cyan-500/10 via-cyan-500/2 to-transparent",
    selectedAccent:
      "bg-cyan-600 text-white font-semibold shadow-sm shadow-cyan-500/20",
  },
  3: {
    bgClass: "from-orange-500/10 via-orange-500/2 to-transparent",
    selectedAccent:
      "bg-orange-600 text-white font-semibold shadow-sm shadow-orange-500/20",
  },
  4: {
    bgClass: "from-red-500/10 via-red-500/2 to-transparent",
    selectedAccent:
      "bg-red-600 text-white font-semibold shadow-sm shadow-red-500/20",
  },
  5: {
    bgClass: "from-pink-300/10 via-pink-300/2 to-transparent",
    selectedAccent:
      "bg-pink-600 text-white font-semibold shadow-sm shadow-pink-500/20",
  },
  6: {
    bgClass: "from-green-700/10 via-green-700/2 to-transparent",
    selectedAccent:
      "bg-green-800 text-white font-semibold shadow-sm shadow-green-700/20",
  },
  7: {
    bgClass: "from-yellow-300/10 via-yellow-300/2 to-transparent",
    selectedAccent:
      "bg-yellow-600 text-neutral-950 font-semibold shadow-sm shadow-yellow-500/20",
  },
  8: {
    bgClass: "from-purple-400/10 via-purple-400/2 to-transparent",
    selectedAccent:
      "bg-purple-600 text-white font-semibold shadow-sm shadow-purple-500/20",
  },
  9: {
    bgClass: "from-red-400/10 via-red-400/2 to-transparent",
    selectedAccent:
      "bg-red-500 text-white font-semibold shadow-sm shadow-red-400/20",
  },
  10: {
    bgClass: "from-blue-300/10 via-blue-300/2 to-transparent",
    selectedAccent:
      "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20",
  },
  11: {
    bgClass: "from-sky-600/10 via-sky-600/2 to-transparent",
    selectedAccent:
      "bg-sky-700 text-white font-semibold shadow-sm shadow-sky-600/20",
  },
  12: {
    bgClass: "from-indigo-500/10 via-indigo-500/2 to-transparent",
    selectedAccent:
      "bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/20",
  },
  13: {
    bgClass: "from-green-400/10 via-green-400/2 to-transparent",
    selectedAccent:
      "bg-green-600 text-white font-semibold shadow-sm shadow-green-500/20",
  },
}

// --- Helper ---
const pad2 = (n: number) => String(n).padStart(2, "0")

// --- Types ---
interface CalendarProps {
  value?: Kenat
  onChange?: (date: Kenat) => void
  calendarPref?: "ethiopian" | "gregorian"
  showAnimations?: boolean
  showHolidays?: boolean
  className?: string
  style?: React.CSSProperties
}

interface DatePickerProps {
  value?: Kenat
  onChange?: (date: Kenat) => void
  calendarPref?: "ethiopian" | "gregorian"
  placeholder?: string
  showAnimations?: boolean
  showHolidays?: boolean
  className?: string
  style?: React.CSSProperties
}

const WEEKDAYS_ETHIOPIAN = ["እሑ", "ሰኞ", "ማክ", "ረቡ", "ሐሙ", "ዓር", "ቅዳ"]
const WEEKDAYS_GREGORIAN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

const MONTH_NAMES_ETHIOPIAN = [
  "መስከረም",
  "ጥቅምት",
  "ኅዳር",
  "ታኅሣሥ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሐሴ",
  "ጳጉሜ",
]

const MONTH_NAMES_GREGORIAN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function KewtiCalendar({
  value,
  onChange,
  calendarPref = "ethiopian",
  showAnimations = true,
  showHolidays = true,
  className = "",
  style,
}: CalendarProps) {
  const isGreg = calendarPref === "gregorian"
  const displayAnimations = showAnimations && !isGreg

  const today = useMemo(() => new Kenat(), [])
  const activeDate = value || today

  const [viewDate, setViewDate] = useState<Kenat>(activeDate)
  const [viewMonth, setViewMonth] = useState(
    isGreg ? activeDate.getGregorian().month : activeDate.getEthiopian().month
  )
  const [viewYear, setViewYear] = useState(
    isGreg ? activeDate.getGregorian().year : activeDate.getEthiopian().year
  )
  const [viewDay, setViewDay] = useState(
    isGreg ? activeDate.getGregorian().day : activeDate.getEthiopian().day
  )

  useEffect(() => {
    const parts = isGreg ? activeDate.getGregorian() : activeDate.getEthiopian()
    setViewMonth(parts.month)
    setViewYear(parts.year)
    setViewDay(parts.day)
    setViewDate(activeDate)
  }, [activeDate, isGreg])

  const activeParts = isGreg
    ? activeDate.getGregorian()
    : activeDate.getEthiopian()
  const todayParts = isGreg ? today.getGregorian() : today.getEthiopian()

  const holiDays = useMemo(() => {
    let m: Record<string, any> = {}
    if (!showHolidays) return m

    if (isGreg) {
      const ethStart = new Kenat(new Date(viewYear, 0, 1)).getEthiopian().year
      const h1 = getHolidaysForYear(ethStart)
      const h2 = getHolidaysForYear(ethStart + 1)
      ;[...h1, ...h2].forEach((holiday) => {
        const hDate = new Kenat({
          year: holiday.ethiopian.year,
          month: holiday.ethiopian.month,
          day: holiday.ethiopian.day,
        })
        const gc = hDate.getGregorian()
        if (gc.year === viewYear) {
          let id = `${gc.year}${pad2(gc.month)}${pad2(gc.day)}`
          m[id] = holiday
        }
      })
    } else {
      let holiDay = getHolidaysForYear(viewYear)
      holiDay.forEach((holiday) => {
        let id = `${holiday.ethiopian.year}${pad2(holiday.ethiopian.month)}${pad2(holiday.ethiopian.day)}`
        m[id] = holiday
      })
    }
    return m
  }, [viewYear, isGreg, showHolidays])

  const [infoOpen, setInfoOpen] = useState(false)

  const [selectedHoliday, SetselectedHoliday] = useState(
    holiDays[
      `${activeParts.year}${pad2(activeParts.month)}${pad2(activeParts.day)}`
    ] || null
  )

  const activeTheme = MONTH_THEMES[viewMonth] || {
    bgClass: "from-transparent to-transparent",
    selectedAccent:
      "bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950 font-medium",
  }

  const daysGrid = useMemo(() => {
    if (isGreg) {
      const cells = []
      const firstDay = new Date(viewYear, viewMonth - 1, 1)
      const lastDay = new Date(viewYear, viewMonth, 0)
      const startWeekday = firstDay.getDay()

      const prevMonthLastDay = new Date(viewYear, viewMonth - 1, 0).getDate()
      for (let i = startWeekday - 1; i >= 0; i--) {
        const dayNum = prevMonthLastDay - i
        const prevM = viewMonth === 1 ? 12 : viewMonth - 1
        const prevY = viewMonth === 1 ? viewYear - 1 : viewYear
        cells.push({
          dayNum,
          month: prevM,
          year: prevY,
          isCurrentMonth: false,
          instance: new Kenat(new Date(prevY, prevM - 1, dayNum)),
        })
      }

      for (let d = 1; d <= lastDay.getDate(); d++) {
        cells.push({
          dayNum: d,
          month: viewMonth,
          year: viewYear,
          isCurrentMonth: true,
          instance: new Kenat(new Date(viewYear, viewMonth - 1, d)),
        })
      }

      const totalSlots = cells.length > 35 ? 42 : 35
      const remaining = totalSlots - cells.length
      for (let d = 1; d <= remaining; d++) {
        const nextM = viewMonth === 12 ? 1 : viewMonth + 1
        const nextY = viewMonth === 12 ? viewYear + 1 : viewYear
        cells.push({
          dayNum: d,
          month: nextM,
          year: nextY,
          isCurrentMonth: false,
          instance: new Kenat(new Date(nextY, nextM - 1, d)),
        })
      }
      return cells
    }

    const start = viewDate.startOfMonth()
    const end = viewDate.endOfMonth()
    const startEC = start.getEthiopian()
    const endEC = end.getEthiopian()
    const startWeekday = start.weekday()

    const cells = []
    const prevMonth = start.addDays(-1)
    const prevMonthEC = prevMonth.getEthiopian()
    for (let i = startWeekday - 1; i >= 0; i--) {
      const dayNum = prevMonthEC.day - i
      cells.push({
        dayNum,
        month: prevMonthEC.month,
        year: prevMonthEC.year,
        isCurrentMonth: false,
        instance: new Kenat({
          year: prevMonthEC.year,
          month: prevMonthEC.month,
          day: dayNum,
        }),
      })
    }

    for (let d = 1; d <= endEC.day; d++) {
      cells.push({
        dayNum: d,
        month: startEC.month,
        year: startEC.year,
        isCurrentMonth: true,
        instance: new Kenat({
          year: startEC.year,
          month: startEC.month,
          day: d,
        }),
      })
    }

    const totalSlots = cells.length > 35 ? 42 : 35
    const remaining = totalSlots - cells.length
    const nextMonth = end.addDays(1)
    const nextMonthEC = nextMonth.getEthiopian()
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        dayNum: d,
        month: nextMonthEC.month,
        year: nextMonthEC.year,
        isCurrentMonth: false,
        instance: new Kenat({
          year: nextMonthEC.year,
          month: nextMonthEC.month,
          day: d,
        }),
      })
    }

    return cells
  }, [viewDate, viewMonth, viewYear, isGreg])

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isGreg) {
      let m = viewMonth - 1
      let y = viewYear
      if (m < 1) {
        m = 12
        y--
      }
      setViewMonth(m)
      setViewYear(y)
      setViewDate(new Kenat(new Date(y, m - 1, 1)))
      setInfoOpen(false)
      const holiday =
        holiDays[
          `${activeParts.year}${pad2(activeParts.month)}${pad2(activeParts.day)}`
        ]
      if (holiday && activeParts.month === m) {
        setInfoOpen(true)
      }
    } else {
      let newDate = viewDate.addMonths(-1)
      setViewDate(newDate)
      setViewMonth(newDate.getEthiopian().month)
      setViewYear(newDate.getEthiopian().year)
      setInfoOpen(false)
      const holiday =
        holiDays[
          `${activeParts.year}${pad2(activeParts.month)}${pad2(activeParts.day)}`
        ]
      if (holiday && activeParts.month === newDate.getEthiopian().month) {
        setInfoOpen(true)
      }
    }
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isGreg) {
      let m = viewMonth + 1
      let y = viewYear
      if (m > 12) {
        m = 1
        y++
      }
      setViewMonth(m)
      setViewYear(y)
      setViewDate(new Kenat(new Date(y, m - 1, 1)))
      setInfoOpen(false)
      const holiday =
        holiDays[
          `${activeParts.year}${pad2(activeParts.month)}${pad2(activeParts.day)}`
        ]
      if (holiday && activeParts.month === m) {
        setInfoOpen(true)
      }
    } else {
      let newDate = viewDate.addMonths(1)
      setViewDate(newDate)
      setViewMonth(newDate.getEthiopian().month)
      setViewYear(newDate.getEthiopian().year)
      setInfoOpen(false)
      const holiday =
        holiDays[
          `${activeParts.year}${pad2(activeParts.month)}${pad2(activeParts.day)}`
        ]
      if (holiday && activeParts.month === newDate.getEthiopian().month) {
        setInfoOpen(true)
      }
    }
  }

  const ET_YEAR_RANGE = Array.from({ length: 151 }, (_, i) => 1900 + i)

  return (
    <div
      style={style}
      className={`relative box-border w-[276px] overflow-hidden rounded-lg bg-white p-4 select-none dark:bg-neutral-950 ${className}`.trim()}
    >
      {/* Background gradient layers with smooth transitions */}
      {displayAnimations &&
        Object.entries(MONTH_THEMES).map(([monthKey, theme]) => {
          const monthNum = parseInt(monthKey, 10)
          const isActive = monthNum === viewMonth
          return (
            <div
              key={`bg-${monthNum}`}
              className={`absolute inset-0 bg-gradient-to-br ${theme.bgClass} pointer-events-none transition-opacity duration-700 ease-in-out`}
              style={{ opacity: isActive ? 1 : 0 }}
            />
          )
        })}

      {/* Animated month representations */}
      {displayAnimations &&
        Object.keys(MONTH_THEMES).map((monthKey) => {
          const monthNum = parseInt(monthKey, 10)
          const isActive = monthNum === viewMonth
          return (
            <div
              key={`anim-${monthNum}`}
              className="cubic-bezier(0.34, 1.56, 0.64, 1) pointer-events-none absolute top-[0px] right-[0px] h-24 w-24 origin-top-right transition-all duration-[600ms] will-change-transform"
              style={{
                opacity: isActive ? 0.35 : 0,
                transform: isActive
                  ? "scale(1) rotate(0deg) translate3d(0, 0, 0)"
                  : "scale(0.7) rotate(15deg) translate3d(10px, -10px, 0)",
                zIndex: isActive ? 1 : 0,
              }}
            >
              <MonthAnimation month={monthNum} />
            </div>
          )
        })}

      {/* Header controls */}
      <div className="relative z-10 flex h-8 items-center justify-between pb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="m-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-neutral-900 transition-colors outline-none hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1">
          <select
            value={viewMonth - 1}
            onChange={(e) => {
              let indx = Number(e.target.value) + 1
              if (isGreg) {
                setViewMonth(indx)
                setViewDate(new Kenat(new Date(viewYear, indx - 1, 1)))
              } else {
                let newd = new Kenat({ year: viewYear, month: indx, day: 1 })
                setViewDate(newd)
                setViewMonth(indx)
              }
              setInfoOpen(false)
              const holiday =
                holiDays[
                  `${activeParts.year}${pad2(activeParts.month)}${pad2(activeParts.day)}`
                ]
              if (holiday && activeParts.month === indx) {
                setInfoOpen(true)
              }
            }}
            className="cursor-pointer appearance-none rounded border-0 bg-transparent px-1 py-0.5 text-center text-sm leading-none font-medium text-neutral-900 outline-none hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-neutral-900"
          >
            {(isGreg ? MONTH_NAMES_GREGORIAN : MONTH_NAMES_ETHIOPIAN).map(
              (month, idx) => (
                <option
                  className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50"
                  key={idx}
                  value={idx}
                >
                  {month}
                </option>
              )
            )}
          </select>
          <select
            value={viewYear}
            onChange={(e) => {
              let indx = Number(e.target.value)
              if (isGreg) {
                setViewYear(indx)
                setViewDate(new Kenat(new Date(indx, viewMonth - 1, 1)))
              } else {
                let newd = new Kenat({ year: indx, month: viewMonth, day: 1 })
                setViewDate(newd)
                setViewYear(indx)
              }
              setInfoOpen(false)
              const holiday =
                holiDays[
                  `${activeParts.year}${pad2(activeParts.month)}${pad2(activeParts.day)}`
                ]
              if (holiday && activeParts.year === indx) {
                setInfoOpen(true)
              }
            }}
            className="cursor-pointer appearance-none rounded border-0 bg-transparent px-1 py-0.5 text-center text-sm leading-none font-medium text-neutral-900 outline-none hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-neutral-900"
          >
            {(isGreg
              ? Array.from({ length: 201 }, (_, i) => 1900 + i)
              : ET_YEAR_RANGE
            ).map((year) => (
              <option
                className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50"
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleNextMonth}
          className="m-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-neutral-900 transition-colors outline-none hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Holiday Info Panel */}
      <div
        className={`relative z-10 mb-3 w-full rounded-lg border border-red-100 bg-red-50/80 p-2.5 backdrop-blur-sm dark:border-red-900/30 dark:bg-red-950/30 ${
          infoOpen && showHolidays && selectedHoliday ? "block" : "hidden"
        }`}
      >
        <div className="mb-1 flex items-baseline gap-1.5">
          <span className="text-xs leading-none font-semibold text-red-800 dark:text-red-200">
            {selectedHoliday?.name}
          </span>
          <span className="text-[10px] leading-none font-medium text-red-500 dark:text-red-400/80">
            {
              (isGreg ? MONTH_NAMES_GREGORIAN : MONTH_NAMES_ETHIOPIAN)[
                viewMonth - 1
              ]
            }{" "}
            {viewDay}, {viewYear}
          </span>
        </div>
        {selectedHoliday?.description && (
          <p className="text-[11px] leading-snug text-red-700/80 dark:text-red-300/80">
            {selectedHoliday.description}
          </p>
        )}
      </div>

      {/* Calendar Numbers Grid */}
      <div className="relative z-10 backdrop-blur-[0.5px]">
        <div className="mb-1 grid grid-cols-7 gap-1 text-center">
          {(isGreg ? WEEKDAYS_GREGORIAN : WEEKDAYS_ETHIOPIAN).map(
            (day, idx) => (
              <span
                key={idx}
                className="flex h-8 w-8 items-center justify-center text-[0.75rem] leading-none font-normal text-neutral-400 mix-blend-color dark:text-neutral-500"
              >
                {day}
              </span>
            )
          )}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysGrid.map((cell, idx) => {
            const isSelected =
              cell.year === activeParts.year &&
              cell.month === activeParts.month &&
              cell.dayNum === activeParts.day

            const isToday =
              cell.year === todayParts.year &&
              cell.month === todayParts.month &&
              cell.dayNum === todayParts.day

            // Retrieve holiday object if it exists
            const holiday =
              holiDays[`${cell.year}${pad2(cell.month)}${pad2(cell.dayNum)}`]

            return (
              <button
                key={idx}
                type="button"
                title={
                  holiday
                    ? `${holiday.name}: ${holiday.description}`
                    : undefined
                }
                onClick={(e) => {
                  e.preventDefault()
                  onChange?.(cell.instance)
                  setViewDay(
                    isGreg
                      ? cell.instance.getGregorian().day
                      : cell.instance.getEthiopian().day
                  )
                  if (holiday) {
                    SetselectedHoliday(holiday || null)
                    setInfoOpen(true)
                  } else {
                    setInfoOpen(false)
                  }
                }}
                className={`group relative m-0 flex aspect-square h-8 w-8 shrink-0 cursor-pointer flex-col items-center justify-center rounded-md border-0 p-0 text-center text-sm transition-all duration-200 outline-none select-none ${
                  !cell.isCurrentMonth
                    ? "cursor-default text-neutral-300 hover:bg-transparent dark:text-neutral-700"
                    : isSelected
                      ? activeTheme.selectedAccent
                      : isToday
                        ? "border border-neutral-950 bg-transparent font-semibold text-neutral-900 dark:border-neutral-50 dark:text-neutral-50"
                        : holiday
                          ? "font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                          : "text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
                }`}
              >
                <span className="leading-none">{cell.dayNum}</span>
                {holiday && cell.isCurrentMonth && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full transition-transform group-hover:scale-125 ${
                      isSelected ? "bg-white" : "bg-red-500 dark:bg-red-400"
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// --- Main Popover Input ---
export function KewtiDatePicker({
  value,
  onChange,
  calendarPref = "ethiopian",
  placeholder = "ቀን ይምረጡ",
  showAnimations = true,
  showHolidays = true,
  className = "",
  style,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formattedValue = useMemo(() => {
    if (!value) return ""
    return value.format({
      calendar: calendarPref,
      lang: calendarPref === "ethiopian" ? "amharic" : "english",
      showWeekday: true,
    })
  }, [value, calendarPref])

  return (
    <div
      ref={containerRef}
      style={style}
      className={`relative box-border inline-block w-64 text-left ${className}`.trim()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(!isOpen)
        }}
        className="m-0 box-border flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-normal shadow-sm hover:bg-neutral-50 focus:ring-1 focus:ring-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900 dark:focus:ring-neutral-300"
      >
        <div className="flex items-center gap-2 truncate overflow-hidden">
          <CalendarIcon
            size={16}
            className="shrink-0 text-neutral-400 dark:text-neutral-500"
          />
          <span
            className={`truncate leading-none ${value ? "font-medium text-neutral-900 dark:text-neutral-50" : "text-neutral-400 dark:text-neutral-500"}`}
          >
            {value ? formattedValue : placeholder}
          </span>
        </div>
        <ChevronsUpDown
          size={16}
          className="shrink-0 text-neutral-400 dark:text-neutral-500"
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 origin-top-left animate-in rounded-lg border border-neutral-200 bg-white shadow-md duration-150 fade-in-0 zoom-in-95 dark:border-neutral-800 dark:bg-neutral-950">
          <KewtiCalendar
            value={value}
            calendarPref={calendarPref}
            showAnimations={showAnimations}
            showHolidays={showHolidays}
            onChange={(date) => {
              onChange?.(date)
            }}
          />
        </div>
      )}
    </div>
  )
}
