"use client"

import * as React from "react"
import { useEffect, useMemo, useState, useRef } from "react"
import { Check, ChevronsUpDown, Loader2, Search, Building2 } from "lucide-react"

export interface ApiSelectItem {
  name: string
  favicon?: string | null
  [key: string]: any
}

export interface ApiSelectProps {
  /** Base API endpoint URL */
  apiUrl?: string
  options?: ApiSelectItem[]
  value?: string
  onValueChange?: (value: string, item?: ApiSelectItem) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  /** Default fallback icon when favicon is missing or fails to load */
  defaultIcon?: React.ReactNode
}

export function KewtiSelect({
  apiUrl,
  options: initialOptions,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  disabled = false,
  className = "",
  style,
  defaultIcon = <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />,
}: ApiSelectProps) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<ApiSelectItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch JSON array from dynamic API endpoint
  useEffect(() => {
    if (initialOptions) {
      setData(initialOptions)
      return
    }

    if (!apiUrl) {
      setData([])
      return
    }

    let isMounted = true
    setIsLoading(true)

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data")
        return res.json()
      })
      .then((jsonData) => {
        if (!isMounted) return
        setData(Array.isArray(jsonData) ? jsonData : [])
      })
      .catch((err) => console.error("ApiSelect Fetch Error:", err))
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [apiUrl, initialOptions])

  // Resolve favicon paths relative to the host/origin of apiUrl
  const resolveFaviconUrl = (faviconPath?: string | null): string | null => {
    if (!faviconPath) return null

    // Absolute URLs pass through unchanged
    if (faviconPath.startsWith("http://") || faviconPath.startsWith("https://")) {
      return faviconPath
    }

    // Resolve relative path against the origin of apiUrl
    if (apiUrl) {
      try {
        const baseOrigin = new URL(apiUrl).origin
        const cleanPath = faviconPath.startsWith("/") ? faviconPath : `/${faviconPath}`
        return `${baseOrigin}${cleanPath}`
      } catch (err) {
        // Fallback if apiUrl is a path fragment
        return faviconPath
      }
    }

    return faviconPath
  }

  // Get currently selected item matched by name
  const selectedOption = useMemo(() => {
    return data.find((item) => item.name === value)
  }, [data, value])

  // Sort data alphabetically and filter options by search input
  const filteredOptions = useMemo(() => {
    const sortedData = [...data].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    )

    if (!search.trim()) return sortedData
    const query = search.toLowerCase()
    return sortedData.filter((item) => item.name.toLowerCase().includes(query))
  }, [data, search])

  // Dropdown dismissal and autofocus handling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  useEffect(() => {
    if (!open) setSearch("")
  }, [open])

  const handleImageError = (name: string) => {
    setImageErrors((prev) => ({ ...prev, [name]: true }))
  }

  const selectedFaviconUrl = resolveFaviconUrl(selectedOption?.favicon)

  return (
    <div className={`relative w-full ${className}`} style={style} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          !selectedOption ? "text-muted-foreground" : ""
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5 truncate pr-2 text-left">
          {isLoading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : selectedFaviconUrl && !imageErrors[selectedOption?.name || ""] ? (
            <img
              src={selectedFaviconUrl}
              alt=""
              className="my-auto block h-4 w-4 shrink-0 rounded-full object-contain p-0 m-0 leading-none align-middle"
              onError={() => handleImageError(selectedOption?.name || "")}
            />
          ) : (
            defaultIcon
          )}
          <span className="truncate leading-none">{selectedOption?.name || placeholder}</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {/* Popover Menu */}
      {open && (
        <div className="absolute top-full z-50 mt-1 w-full animate-in fade-in-0 zoom-in-95 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
          {/* Search Box */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List Displaying Name + Resolved Favicon Only */}
          <div className="max-h-[220px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-3 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredOptions.map((item) => {
                  const isSelected = value === item.name
                  const resolvedUrl = resolveFaviconUrl(item.favicon)
                  const hasValidFavicon = resolvedUrl && !imageErrors[item.name]

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onValueChange?.(item.name, item)
                        setOpen(false)
                      }}
                      className="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                    >
                      <Check
                        className={`mr-2 h-4 w-4 shrink-0 text-primary ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />

                      {hasValidFavicon ? (
                        <img
                          src={resolvedUrl}
                          alt=""
                          className="mt-2 mb-2 mr-2.5 block h-4 w-4 shrink-0 rounded-full object-contain p-0 m-0 leading-none align-middle"
                          onError={() => handleImageError(item.name)}
                        />
                      ) : (
                        <span className="mr-2.5 shrink-0">{defaultIcon}</span>
                      )}

                      <span className="truncate text-left leading-none">{item.name}</span>
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