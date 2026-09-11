"use client"

import * as React from "react"
import { useEffect, useMemo, useState, useRef } from "react"
import { Check, ChevronsUpDown, MapPin, Search } from "lucide-react"

export interface LocationRow {
  admin1_name: string
  admin2_name: string
  admin3name: string
}

export const DEFAULT_LOCATIONS: LocationRow[] = [
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Bole",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Kirkos",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Yeka",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Arada",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Nifas Silk-Lafto",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Kolfe Keranio",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Gullele",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Lideta",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Akaky Kaliti",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Addis Ketema",
  },
  {
    admin1_name: "Addis Ababa",
    admin2_name: "Addis Ababa",
    admin3name: "Lemi Kura",
  },
  { admin1_name: "Oromia", admin2_name: "East Shewa", admin3name: "Adama" },
  { admin1_name: "Oromia", admin2_name: "East Shewa", admin3name: "Bishoftu" },
  { admin1_name: "Oromia", admin2_name: "East Shewa", admin3name: "Mojo" },
  { admin1_name: "Oromia", admin2_name: "West Shewa", admin3name: "Ambo" },
  {
    admin1_name: "Oromia",
    admin2_name: "Finfinne Special",
    admin3name: "Burayu",
  },
  {
    admin1_name: "Oromia",
    admin2_name: "Finfinne Special",
    admin3name: "Dukam",
  },
  { admin1_name: "Oromia", admin2_name: "Jimma", admin3name: "Jimma Town" },
  { admin1_name: "Oromia", admin2_name: "Arsi", admin3name: "Asella" },
  {
    admin1_name: "Amhara",
    admin2_name: "West Gojjam",
    admin3name: "Bahir Dar",
  },
  {
    admin1_name: "Amhara",
    admin2_name: "Central Gondar",
    admin3name: "Gondar",
  },
  { admin1_name: "Amhara", admin2_name: "South Wollo", admin3name: "Dessie" },
  {
    admin1_name: "Amhara",
    admin2_name: "South Wollo",
    admin3name: "Kombolcha",
  },
  {
    admin1_name: "Amhara",
    admin2_name: "North Shewa",
    admin3name: "Debre Berhan",
  },
  { admin1_name: "Tigray", admin2_name: "Mekelle", admin3name: "Mekelle" },
  { admin1_name: "Tigray", admin2_name: "Central", admin3name: "Axum" },
  { admin1_name: "Tigray", admin2_name: "Central", admin3name: "Adwa" },
  {
    admin1_name: "Tigray",
    admin2_name: "North Western",
    admin3name: "Shire Endaslasie",
  },
  { admin1_name: "Sidama", admin2_name: "Hawassa City", admin3name: "Hawassa" },
  { admin1_name: "Sidama", admin2_name: "Dale", admin3name: "Yirgalem" },
  {
    admin1_name: "Dire Dawa",
    admin2_name: "Dire Dawa",
    admin3name: "Dire Dawa",
  },
  { admin1_name: "Harari", admin2_name: "Harar", admin3name: "Harar" },
  { admin1_name: "Somali", admin2_name: "Fafan", admin3name: "Jijiga" },
  { admin1_name: "Somali", admin2_name: "Sitti", admin3name: "Shinile" },
  {
    admin1_name: "Afar",
    admin2_name: "Awsi Rasu (Zone 1)",
    admin3name: "Semera",
  },
  {
    admin1_name: "Afar",
    admin2_name: "Awsi Rasu (Zone 1)",
    admin3name: "Asaita",
  },
  {
    admin1_name: "Benishangul-Gumuz",
    admin2_name: "Assosa",
    admin3name: "Assosa",
  },
  { admin1_name: "Gambela", admin2_name: "Anuak", admin3name: "Gambela" },
  {
    admin1_name: "Central Ethiopia",
    admin2_name: "Gurage",
    admin3name: "Wolkite",
  },
  {
    admin1_name: "Central Ethiopia",
    admin2_name: "Silte",
    admin3name: "Worabe",
  },
  {
    admin1_name: "South Ethiopia",
    admin2_name: "Gamo",
    admin3name: "Arba Minch",
  },
  {
    admin1_name: "South Ethiopia",
    admin2_name: "Wolayita",
    admin3name: "Sodo",
  },
  {
    admin1_name: "South West Ethiopia",
    admin2_name: "Keffa",
    admin3name: "Bonga",
  },
]

interface KewtiLocationSelectorProps {
  apiUrl?: string
  initialData?: LocationRow[]
  setAddress?: React.Dispatch<React.SetStateAction<string[]>>
  className?: string
  style?: React.CSSProperties
}

export function KewtiLocationSelector({
  apiUrl,
  initialData,
  setAddress,
  className = "",
  style,
}: KewtiLocationSelectorProps) {
  const [data, setData] = useState<LocationRow[]>(
    initialData || DEFAULT_LOCATIONS
  )
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState({
    region: false,
    zone: false,
    woreda: false,
  })
  const [values, setValues] = useState({ region: "", zone: "", woreda: "" })

  // Fetch remote location data if apiUrl is provided or fallback to hosted endpoint
  useEffect(() => {
    if (initialData && initialData.length > 0) return

    let isMounted = true
    let fetchUrl: string

    if (apiUrl) {
      fetchUrl =
        apiUrl.startsWith("http://") ||
        apiUrl.startsWith("https://") ||
        apiUrl.startsWith("/")
          ? apiUrl.endsWith("/api/locations")
            ? apiUrl
            : `${apiUrl.replace(/\/$/, "")}/api/locations`
          : `https://${apiUrl.replace(/\/$/, "")}/api/locations`
    } else {
      fetchUrl = "https://kewti.vercel.app/api/locations"
    }

    setIsLoading(true)
    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch location data")
        return res.json()
      })
      .then((jsonData) => {
        if (isMounted && Array.isArray(jsonData) && jsonData.length > 0) {
          setData(jsonData as LocationRow[])
        }
      })
      .catch((err) => {
        console.warn(
          "KewtiLocationSelector: Using embedded fallback dataset.",
          err
        )
        if (isMounted) {
          setData(DEFAULT_LOCATIONS)
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [apiUrl, initialData])

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
