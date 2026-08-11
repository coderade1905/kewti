"use client"
import { useState, JSX } from "react"
import Button from "../Button/Button"
import logo from "../../assets/logo.png"
import Link from "next/link"

export default function Navbar({
  logotext,
}: {
  logotext?: React.JSX.Element
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const DOCS_PAGE = process.env.NEXT_PUBLIC_DOCS_PAGE
  const navLinks = [
    ["Npm", "https://www.npmjs.com/package/kewti"],
    ["Github", "https://github.com/coderade1905/kewti"],
    ["Docs", `${DOCS_PAGE}/docs`],
  ]

  // Handles static imports vs Next.js image object imports safely
  const logoSrc = typeof logo === "string" ? logo : logo.src

  return (
    <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <img
            src={logoSrc}
            alt="kewti"
            className="h-5 w-auto object-contain"
          />
          {logotext}
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link[0]}
              href={`${link[1]}`}
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              {link[0]}
            </a>
          ))}
        </div>

        {/* Desktop Action Button */}
        <div className="hidden md:block">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`${DOCS_PAGE}/docs`}
          >
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800/60 hover:text-white focus:outline-none"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              {isOpen ? (
                /* Close Icon (X) */
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                /* Hamburger Icon */
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="space-y-4 rounded-b-xl border-t border-neutral-800/60 bg-neutral-950/90 px-2 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link[0]}
                href={`${link[1]}`}
                className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
              >
                {link[0]}
              </a>
            ))}
          </div>

          <div className="border-t border-neutral-800/40 px-3 pt-2">
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
