"use client"

import * as React from "react"
import { useEffect, useMemo, useState, useRef } from "react"
import { Check, ChevronsUpDown, MapPin, Search } from "lucide-react"

interface Row {
  admin1_name: string
  admin2_name: string
  admin3name: string
}

interface KewtiLocationSelectorProps {
  apiUrl?: string
  setAddress?: React.Dispatch<React.SetStateAction<string[]>>
  className?: string
  style?: React.CSSProperties
}

export function KewtiLocationSelector({
  apiUrl,
  setAddress,
  className = "",
  style,
}: KewtiLocationSelectorProps) {
  const [data, setData] = useState<Row[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState({
    region: false,
    zone: false,
    woreda: false,
  })
  const [values, setValues] = useState({ region: "", zone: "", woreda: "" })

  // Fetch data using the dynamic prop, falling back to localhost if needed
  useEffect(() => {
    const baseUrl = apiUrl || "localhost:3001"

    setIsLoading(true)
    fetch(`${baseUrl}/api/locations`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch location data")
        return res.json()
      })
      .then((jsonData) => {
        setData(jsonData as Row[])
      })
      .catch((err) => console.error("Error loading location API:", err))
      .finally(() => setIsLoading(false))
  }, [apiUrl])

  // Update parent address state when selections change
  useEffect(() => {
    if (setAddress) {
      setAddress([values.region, values.zone, values.woreda].filter(Boolean))
    }
  }, [values, setAddress])

  // Performance optimizations via useMemo
  const regions = useMemo(() => {
    return Array.from(new Set(data.map((i) => i.admin1_name))).sort()
  }, [data])

  const zones = useMemo(() => {
    if (!values.region) return []
    return Array.from(
      new Set(
        data
          .filter((i) => i.admin1_name === values.region)
          .map((i) => i.admin2_name)
      )
    ).sort()
  }, [data, values.region])

  const woredas = useMemo(() => {
    if (!values.zone) return []
    return Array.from(
      new Set(
        data
          .filter(
            (i) =>
              i.admin1_name === values.region && i.admin2_name === values.zone
          )
          .map((i) => i.admin3name)
      )
    ).sort()
  }, [data, values.region, values.zone])

  const containerClasses = [
    "grid w-full grid-cols-1 items-center gap-3 md:grid-cols-3",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={containerClasses} style={style}>
      <Combobox
        open={open.region}
        setOpen={(val) => setOpen((prev) => ({ ...prev, region: val }))}
        value={values.region}
        setValue={(val) =>
          setValues({
            region: val,
            zone: "",
            woreda: "",
          })
        }
        options={regions}
        placeholder="Select Region"
        disabled={isLoading}
      />

      <Combobox
        open={open.zone}
        setOpen={(val) => setOpen((prev) => ({ ...prev, zone: val }))}
        value={values.zone}
        setValue={(val) =>
          setValues((prev) => ({ ...prev, zone: val, woreda: "" }))
        }
        options={zones}
        placeholder="Select Zone"
        disabled={isLoading || !values.region}
      />

      <Combobox
        open={open.woreda}
        setOpen={(val) => setOpen((prev) => ({ ...prev, woreda: val }))}
        value={values.woreda}
        setValue={(val) => setValues((prev) => ({ ...prev, woreda: val }))}
        options={woredas}
        placeholder="Select Woreda"
        disabled={isLoading || !values.zone}
      />
    </div>
  )
}

interface ComboboxProps {
  open: boolean
  setOpen: (open: boolean) => void
  value: string
  setValue: (value: string) => void
  options: string[]
  placeholder: string
  disabled?: boolean
}

function Combobox({
  open,
  setOpen,
  value,
  setValue,
  options,
  placeholder,
  disabled,
}: ComboboxProps) {
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter options based on search input
  const filteredOptions = useMemo(() => {
    if (!search) return options
    return options.filter((opt) =>
      opt.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search])

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, setOpen])

  // Reset search when dropdown closes
  useEffect(() => {
    if (!open) setSearch("")
  }, [open])

  const buttonClasses = [
    "flex h-10 w-full min-w-0 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
    !value ? "text-muted-foreground" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={buttonClasses}
      >
        <span className="flex min-w-0 items-center gap-2 truncate pr-2 text-left">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
          <span className="truncate">{value || placeholder}</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="absolute top-full z-50 mt-1 w-full animate-in overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md fade-in-0 zoom-in-95">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-[220px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-3 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredOptions.map((opt) => {
                  const checkClasses = [
                    "mr-2 h-4 w-4 shrink-0 text-primary",
                    value === opt ? "opacity-100" : "opacity-0",
                  ]
                    .filter(Boolean)
                    .join(" ")

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setValue(opt)
                        setOpen(false)
                      }}
                      className="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                    >
                      <Check className={checkClasses} />
                      <span className="truncate text-left">{opt}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}