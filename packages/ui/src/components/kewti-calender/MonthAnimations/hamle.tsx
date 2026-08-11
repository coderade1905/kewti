import React from "react"
import { motion } from "framer-motion"

export default function Hamle() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      <motion.path
        d="M30,40 Q40,30 50,40 T70,40"
        stroke="#9CA3AF"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        animate={{ x: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M20,50 Q35,40 50,50 T80,50"
        stroke="#D1D5DB"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
        animate={{ x: [5, -5, 5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  )
}
