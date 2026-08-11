import React from "react"
import { motion } from "framer-motion"

export default function Nehase() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      <motion.path
        d="M20,40 Q40,20 60,40 T90,30"
        stroke="#6B7280"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {[25, 50, 75].map((x, i) => (
        <motion.line
          key={x}
          x1={x}
          y1="45"
          x2={x - 5}
          y2="80"
          stroke="#60A5FA"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ y: [0, 20], opacity: [0, 1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.2,
          }}
        />
      ))}
      <motion.path
        d="M50,30 L40,60 L55,60 L45,95 L70,50 L55,50 Z"
        fill="#FBBF24"
        animate={{ opacity: [0, 1, 0, 0.8, 0, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.1, 0.2, 0.3, 0.4, 1],
        }}
      />
    </motion.svg>
  )
}
