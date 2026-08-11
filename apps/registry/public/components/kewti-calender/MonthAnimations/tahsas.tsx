import React from "react"
import { motion } from "framer-motion"

export default function Tahsas() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* Continuous Smooth Ambient Glow */}
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        fill="#FBBF24"
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Expanding Smooth Light Halo */}
      <motion.circle
        cx="50"
        cy="50"
        r="22"
        fill="none"
        stroke="#FDE047"
        strokeWidth="0.8"
        animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stationary (Non-Rotating), Smoothly Breathing Christmas Star */}
      <motion.g
        style={{ originX: "50px", originY: "50px" }}
        animate={{ scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Outer Golden Rays (Elongated Bethlehem Star Shape) */}
        <motion.path
          d="M 50,8 Q 50,45 80,50 Q 50,55 50,92 Q 50,55 20,50 Q 50,45 50,8 Z"
          fill="#FBBF24"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Middle Layer */}
        <path
          d="M 50,20 Q 50,46 70,50 Q 50,54 50,80 Q 50,54 30,50 Q 50,46 50,20 Z"
          fill="#F59E0B"
        />

        {/* Inner Bright Yellow Core Layer */}
        <path
          d="M 50,28 Q 50,48 62,50 Q 50,52 50,72 Q 50,52 38,50 Q 50,48 50,28 Z"
          fill="#FEF08A"
        />

        {/* Center Pure White Light Point */}
        <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
      </motion.g>

      {/* Smooth Cross-Ray Flares */}
      <motion.g
        animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "50px", originY: "50px" }}
      >
        <line
          x1="50"
          y1="2"
          x2="50"
          y2="98"
          stroke="#FFFFFF"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          x1="2"
          y1="50"
          x2="98"
          y2="50"
          stroke="#FFFFFF"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.6"
        />
      </motion.g>
    </motion.svg>
  )
}
