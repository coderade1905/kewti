import React from "react"
import { motion } from "framer-motion"

export default function Hidar() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* Background Ambient Heavy Smoke */}
      <motion.circle
        cx="30"
        cy="40"
        r="25"
        fill="#9CA3AF"
        opacity="0.3"
        animate={{
          x: [-5, 10, -5],
          y: [-5, -15, -5],
          scale: [1, 1.6, 1],
          opacity: [0.1, 0.5, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="70"
        cy="30"
        r="30"
        fill="#6B7280"
        opacity="0.2"
        animate={{
          x: [5, -10, 5],
          y: [0, -10, 0],
          scale: [1, 1.8, 1],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rising Continuous Smoke Plumes */}
      {[...Array(6)].map((_, i) => (
        <motion.circle
          key={`smoke-${i}`}
          cx={50 + (i % 2 === 0 ? -3 : 3) * i} // Staggered starting X positions
          cy="75" // Start right above the fire
          r={8 + i * 1.5}
          fill={i % 2 === 0 ? "#4B5563" : "#6B7280"}
          animate={{
            y: [0, -80 - i * 10], // Float high up off the screen
            x: [0, i % 2 === 0 ? -25 : 25], // Drift outwards
            scale: [0.5, 3.5 + i * 0.5], // Grow massively as it rises
            opacity: [0.9, 0], // Fade out at the top
          }}
          transition={{
            duration: 3.5, // Faster rise
            repeat: Infinity,
            delay: i * 0.6, // Staggered for continuous flow
            ease: "easeOut",
          }}
        />
      ))}

      {/* Gentle ambient fire glow */}
      <motion.circle
        cx="50"
        cy="85"
        r="18"
        fill="#F97316"
        opacity="0.15"
        animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Crossed Wooden Logs */}
      <path
        d="M 35,92 L 65,78"
        stroke="#78350F"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 65,92 L 35,78"
        stroke="#451A03"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Red Base Flame */}
      <motion.path
        d="M 50,88 C 35,88 42,60 50,48 C 58,60 65,88 50,88 Z"
        fill="#EA580C"
        style={{ originX: "50px", originY: "88px" }}
        animate={{ scaleY: [1, 1.1, 0.9, 1], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Orange Mid Flame */}
      <motion.path
        d="M 50,88 C 40,88 45,68 50,58 C 55,68 60,88 50,88 Z"
        fill="#F59E0B"
        style={{ originX: "50px", originY: "88px" }}
        animate={{ scaleY: [1, 1.15, 0.85, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.1,
        }}
      />
      {/* Yellow Inner Flame */}
      <motion.path
        d="M 50,88 C 45,88 47,75 50,65 C 53,75 55,88 50,88 Z"
        fill="#FEF08A"
        style={{ originX: "50px", originY: "88px" }}
        animate={{ scaleY: [1, 1.2, 0.9, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
    </motion.svg>
  )
}
