import React from "react"
import { motion } from "framer-motion"

export default function Puagme() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* Gentle swaying motion for the stem & bud */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "50px", originY: "90px" }}
      >
        {/* Stem */}
        <path
          d="M 50,95 Q 48,78 50,62"
          fill="none"
          stroke="#16A34A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Stem Leaves */}
        <path d="M 49,82 Q 38,80 34,72 Q 44,74 49,80 Z" fill="#15803D" />
        <path d="M 51,76 Q 62,74 66,66 Q 56,68 51,74 Z" fill="#15803D" />

        {/* Bud Group with subtle breathing/pulsing bloom animation */}
        <motion.g
          animate={{ scale: [0.98, 1.04, 0.98], y: [0, -1.5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "50px", originY: "62px" }}
        >
          {/* Back Inner Petal */}
          <path
            d="M 50,62 C 40,48 42,22 50,15 C 58,22 60,48 50,62 Z"
            fill="#D97706"
          />

          {/* Left Inner Petal (Opening slightly) */}
          <motion.path
            d="M 50,62 C 36,48 38,25 46,18 C 50,30 50,50 50,62 Z"
            fill="#FBBF24"
            animate={{ rotate: [0, -2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "50px", originY: "62px" }}
          />

          {/* Right Inner Petal (Opening slightly) */}
          <motion.path
            d="M 50,62 C 64,48 62,25 54,18 C 50,30 50,50 50,62 Z"
            fill="#FBBF24"
            animate={{ rotate: [0, 2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "50px", originY: "62px" }}
          />

          {/* Outer Layer Front Petals */}
          <path
            d="M 50,62 C 34,52 38,32 48,22 C 46,38 48,52 50,62 Z"
            fill="#F59E0B"
          />
          <path
            d="M 50,62 C 66,52 62,32 52,22 C 54,38 52,52 50,62 Z"
            fill="#FCD34D"
          />

          {/* Green Sepals / Calyx (Holding the bud together) */}
          <path
            d="M 50,64 C 36,60 28,48 34,38 C 38,48 44,58 50,64 Z"
            fill="#15803D"
          />
          <path
            d="M 50,64 C 64,60 72,48 66,38 C 62,48 56,58 50,64 Z"
            fill="#15803D"
          />
          <path
            d="M 50,64 C 44,54 45,42 50,36 C 55,42 56,54 50,64 Z"
            fill="#16A34A"
          />
        </motion.g>
      </motion.g>
    </motion.svg>
  )
}
