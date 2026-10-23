"use client"

import React from "react"
import { ExternalLink } from "lucide-react"

// Modern minimalist Ethiopian Sini (Coffee Cup)
function SiniIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M7 2c0 1.2-.8 1.8-.8 2.8" className="opacity-70" />
            <path d="M12 1.5c0 1.2-.8 1.8-.8 2.8" className="opacity-90" />
            <path d="M17 2c0 1.2-.8 1.8-.8 2.8" className="opacity-70" />
            <path d="M4 8h13.5a.5.5 0 0 1 .5.5v3.5a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8.5a.5.5 0 0 1 .5-.5Z" />
            <path d="M18 9.5h1.25a2.75 2.75 0 0 1 2.75 2.75v0a2.75 2.75 0 0 1-2.75 2.75H18" />
            <path d="M2.5 20h17" />
        </svg>
    )
}

export type KewtiGurshaVariant =
    | "gursha"
    | "default"
    | "outline"
    | "ghost"
    | "coffee"

export type KewtiGurshaSize = "sm" | "md" | "lg"
export type KewtiGurshaRadius = "full" | "xl" | "lg" | "md"

export interface KewtiGurshaProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * Your Gursha Plus handle (required, e.g. "kaleab" or "@kaleab")
     */
    handle: string
    /**
     * Alias for `handle`
     */
    username?: string
    /**
     * Direct URL override
     */
    href?: string
    /**
     * Custom label text
     * @default "Buy me a Coffee"
     */
    text?: string
    /**
     * Language preset
     * @default "en"
     */
    lang?: "en" | "am"
    /**
     * Built-in visual variant
     * @default "gursha"
     */
    variant?: KewtiGurshaVariant
    /**
     * Custom background color (hex, rgb, or css variable)
     */
    bgColor?: string
    /**
     * Custom text & icon color (hex, rgb, or css variable)
     */
    textColor?: string
    /**
     * Button size
     * @default "md"
     */
    size?: KewtiGurshaSize
    /**
     * Corner radius
     * @default "full"
     */
    radius?: KewtiGurshaRadius
    /**
     * Custom icon element
     */
    icon?: React.ReactNode
    /**
     * Show or hide the icon
     * @default true
     */
    showIcon?: boolean
    /**
     * Show external link arrow icon
     * @default false
     */
    showExternalIcon?: boolean
}

const VARIANTS: Record<KewtiGurshaVariant, string> = {
    gursha:
        "bg-amber-400 text-neutral-950 font-semibold shadow-xs hover:bg-amber-300 active:bg-amber-500 border border-amber-300/60 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300",
    default:
        "bg-neutral-900 text-white font-medium hover:bg-neutral-800 active:bg-neutral-950 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200",
    outline:
        "bg-transparent text-neutral-900 font-medium border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900",
    ghost:
        "bg-transparent text-neutral-700 font-medium hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-100",
    coffee:
        "bg-[#2d1810] text-[#f7eee7] font-medium shadow-xs hover:bg-[#3d2218] active:bg-[#20100a] border border-[#442519]/50 dark:bg-[#23120b] dark:text-[#f7eee7] dark:hover:bg-[#2d1810]",
}

const RADII: Record<KewtiGurshaRadius, string> = {
    full: "rounded-full",
    xl: "rounded-2xl",
    lg: "rounded-xl",
    md: "rounded-lg",
}

const SIZES: Record<KewtiGurshaSize, { btn: string; icon: string }> = {
    sm: {
        btn: "h-8 px-3 text-xs gap-1.5",
        icon: "w-3.5 h-3.5",
    },
    md: {
        btn: "h-9.5 px-4 text-sm gap-2",
        icon: "w-4 h-4",
    },
    lg: {
        btn: "h-11 px-5 text-base gap-2.5",
        icon: "w-5 h-5",
    },
}

export function KewtiGursha({
    handle,
    username,
    href,
    text,
    lang = "en",
    variant = "gursha",
    bgColor,
    textColor,
    size = "md",
    radius = "full",
    icon,
    showIcon = true,
    showExternalIcon = false,
    target = "_blank",
    rel = "noopener noreferrer",
    className = "",
    style,
    ...props
}: KewtiGurshaProps) {
    const rawHandle = handle || username || ""
    const cleanHandle = rawHandle.replace(/^@/, "").trim()

    const resolvedHref =
        href || (cleanHandle ? `https://www.gurshaplus.com/${cleanHandle}` : "#")

    const defaultText = lang === "am" ? "ጉርሻ ስጠኝ" : "Buy me a Coffee"
    const labelText = text || defaultText

    const sizeConfig = SIZES[size] || SIZES.md
    const radiusClass = RADII[radius] || RADII.full
    const variantClass = bgColor ? "" : VARIANTS[variant] || VARIANTS.gursha

    const customStyle: React.CSSProperties = {
        ...(bgColor ? { backgroundColor: bgColor } : {}),
        ...(textColor ? { color: textColor } : {}),
        ...style,
    }

    return (
        <a
            href={resolvedHref}
            target={target}
            rel={rel}
            spellCheck={false}
            style={customStyle}
            className={`group relative inline-flex shrink-0 cursor-pointer items-center justify-center font-sans tracking-tight no-underline select-none transition-all duration-200 hover:-translate-y-0.5 hover:no-underline focus:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 active:translate-y-0 active:no-underline ${sizeConfig.btn} ${radiusClass} ${variantClass} ${className}`.trim()}
            {...props}
        >
            {showIcon && (
                <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                    {icon || <SiniIcon className={sizeConfig.icon} />}
                </span>
            )}

            <span className="leading-none no-underline">{labelText}</span>

            {showExternalIcon && (
                <ExternalLink
                    size={13}
                    className="opacity-50 transition-opacity group-hover:opacity-100"
                />
            )}
        </a>
    )
}