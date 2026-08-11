import React from "react"
import { motion } from "framer-motion"

export default function Meskerem() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* The entire flower is grouped here, rotating and scaling as one solid piece */}
      <motion.g
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ originX: "50px", originY: "50px" }}
      >
        {/* 12 Distinct Petals, physically drawn from the exact center point (50,50) */}
        {[...Array(12)].map((_, i) => {
          const deg = i * 30 // 360 / 12 = 30 degrees spacing
          return (
            <g key={deg} transform={`rotate(${deg} 50 50)`}>
              {/* Outer Petal */}
              <path
                d="M 50,50 C 40,35 42,10 50,5 C 58,10 60,35 50,50 Z"
                fill="#FBBF24"
              />
              {/* Inner Petal Highlight */}
              <path
                d="M 50,50 C 44,38 46,18 50,12 C 54,18 56,38 50,50 Z"
                fill="#F59E0B"
              />
            </g>
          )
        })}

        {/* Solid Center Disk */}
        <circle cx="50" cy="50" r="14" fill="#D97706" />

        {/* Textured Inner Core (counter-rotating for visual depth) */}
        <motion.circle
          cx="50"
          cy="50"
          r="10"
          fill="#92400E"
          strokeDasharray="4 4"
          stroke="#FCD34D"
          strokeWidth="4"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ originX: "50px", originY: "50px" }}
        />
        <circle cx="50" cy="50" r="5" fill="#78350F" />
      </motion.g>
    </motion.svg>
  )
}
