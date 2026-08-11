import React from "react"
import { motion } from "framer-motion"

export default function Yekatit() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* Slow float for the entire emblem */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Left Spear (Tor) */}
        <motion.g
          style={{ originX: "50px", originY: "50px" }}
          animate={{ rotate: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Wooden Shaft */}
          <line
            x1="15"
            y1="85"
            x2="75"
            y2="25"
            stroke="#522504"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Authentic Leaf-Blade Spearhead */}
          <g transform="translate(75, 25) rotate(45)">
            {/* Iron Socket & Brass Binding Collar */}
            <path d="M-1.8,2 L1.8,2 L1.3,-3 L-1.3,-3 Z" fill="#374151" />
            <line
              x1="-1.8"
              y1="0"
              x2="1.8"
              y2="0"
              stroke="#D97706"
              strokeWidth="0.8"
            />

            {/* Left Bevel Face (Shadow) */}
            <path
              d="M 0,-3 C -4.5,-7 -4.5,-13 0,-23 L 0,-3 Z"
              fill="#9CA3AF"
              stroke="#4B5563"
              strokeWidth="0.3"
            />

            {/* Right Bevel Face (Highlight) */}
            <path
              d="M 0,-3 C 4.5,-7 4.5,-13 0,-23 L 0,-3 Z"
              fill="#F3F4F6"
              stroke="#4B5563"
              strokeWidth="0.3"
            />

            {/* Center Spine / Ridge */}
            <line
              x1="0"
              y1="-3"
              x2="0"
              y2="-23"
              stroke="#4B5563"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
          </g>
        </motion.g>

        {/* Right Spear (Tor) */}
        <motion.g
          style={{ originX: "50px", originY: "50px" }}
          animate={{ rotate: [0, 3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Wooden Shaft */}
          <line
            x1="85"
            y1="85"
            x2="25"
            y2="25"
            stroke="#522504"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Authentic Leaf-Blade Spearhead */}
          <g transform="translate(25, 25) rotate(-45)">
            {/* Iron Socket & Brass Binding Collar */}
            <path d="M-1.8,2 L1.8,2 L1.3,-3 L-1.3,-3 Z" fill="#374151" />
            <line
              x1="-1.8"
              y1="0"
              x2="1.8"
              y2="0"
              stroke="#D97706"
              strokeWidth="0.8"
            />

            {/* Left Bevel Face (Shadow) */}
            <path
              d="M 0,-3 C -4.5,-7 -4.5,-13 0,-23 L 0,-3 Z"
              fill="#9CA3AF"
              stroke="#4B5563"
              strokeWidth="0.3"
            />

            {/* Right Bevel Face (Highlight) */}
            <path
              d="M 0,-3 C 4.5,-7 4.5,-13 0,-23 L 0,-3 Z"
              fill="#F3F4F6"
              stroke="#4B5563"
              strokeWidth="0.3"
            />

            {/* Center Spine / Ridge */}
            <line
              x1="0"
              y1="-3"
              x2="0"
              y2="-23"
              stroke="#4B5563"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
          </g>
        </motion.g>

        {/* Traditional Ethiopian Shield (Gascha) */}
        <motion.g
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Base Layer - Dark Buffalo/Hippo Hide Leather */}
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="#18181B"
            stroke="#B45309"
            strokeWidth="1.5"
          />

          {/* Outer Segmented Metal Rim Pattern */}
          <circle
            cx="50"
            cy="50"
            r="27.5"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeDasharray="1.5, 1.5"
          />

          {/* 16 Radiating Gold Filigree Panels / Spokes */}
          {[...Array(16)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 22.5} 50 50)`}>
              {/* Outer Filigree Teardrop */}
              <path
                d="M48.5,23 C46.5,30 47,38 50,40 C53,38 53.5,30 51.5,23 Z"
                fill="#D97706"
                opacity="0.95"
              />
              {/* Inner Filigree Highlight */}
              <path
                d="M49.2,24 C48,29 48.5,36 50,38 C51.5,36 52,29 50.8,24 Z"
                fill="#FBBF24"
              />
            </g>
          ))}

          {/* Middle Stamped Brass Ring */}
          <circle
            cx="50"
            cy="50"
            r="16.5"
            fill="none"
            stroke="#D97706"
            strokeWidth="2.5"
          />
          <circle
            cx="50"
            cy="50"
            r="16.5"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="0.8"
            strokeDasharray="1, 1.2"
          />

          {/* Inner Leather Ring Base */}
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="#27272A"
            stroke="#B45309"
            strokeWidth="1"
          />

          {/* 6 Raised Golden Bosses (Studs) Ringing the Center */}
          {[...Array(6)].map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180
            const radius = 11.5
            const cx = 50 + radius * Math.cos(angle)
            const cy = 50 + radius * Math.sin(angle)
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="2.2" fill="#B45309" />
                <circle cx={cx - 0.3} cy={cy - 0.3} r="1.6" fill="#FBBF24" />
                <circle cx={cx - 0.6} cy={cy - 0.6} r="0.6" fill="#FEF08A" />
              </g>
            )
          })}

          {/* Inner Boss Border */}
          <circle
            cx="50"
            cy="50"
            r="7.5"
            fill="none"
            stroke="#D97706"
            strokeWidth="1"
          />
          <circle cx="50" cy="50" r="7" fill="#18181B" />

          {/* Prominent Center Golden Boss (Umbo Dome) */}
          <circle cx="50" cy="50" r="5" fill="#B45309" />
          <circle cx="49.2" cy="49.2" r="4.2" fill="#F59E0B" />
          <circle cx="48.5" cy="48.5" r="2.8" fill="#FDE047" />
          <circle cx="47.8" cy="47.8" r="1" fill="#FFFFFF" opacity="0.8" />
        </motion.g>
      </motion.g>
    </motion.svg>
  )
}
