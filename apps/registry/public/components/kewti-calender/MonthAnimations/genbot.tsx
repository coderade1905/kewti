import React from "react"
import { motion } from "framer-motion"

export default function Genbot() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* Sun Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line
          key={i}
          x1="50"
          y1="20"
          x2="50"
          y2="10"
          stroke="#EAB308"
          strokeWidth="3.5"
          strokeLinecap="round"
          transform={`rotate(${angle} 50 50)`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Core Sun Circle */}
      <circle cx="50" cy="50" r="18" fill="#F59E0B" />
      <circle cx="50" cy="50" r="15" fill="#FACC15" />
    </motion.svg>
  )
}
