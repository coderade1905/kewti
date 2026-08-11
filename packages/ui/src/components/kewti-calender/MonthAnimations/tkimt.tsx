import React from "react"
import { motion } from "framer-motion"

export default function Tikimt() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* Gentle Ambient Warm Glow */}
      <motion.circle
        cx="50"
        cy="50"
        r="35"
        fill="#FEF08A"
        opacity="0.25"
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Background Secondary Wheat Stalk (Swaying out-of-phase for visual depth) */}
      <motion.g
        animate={{ rotate: [-6, 10, -6], scaleY: [0.97, 1.02, 0.97] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        style={{ originX: "35px", originY: "92px" }}
        opacity={0.65}
      >
        {/* Secondary Stem */}
        <path
          d="M 35,92 Q 38,55 30,22"
          fill="none"
          stroke="#D97706"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Secondary Grains */}
        {[...Array(6)].map((_, i) => {
          const y = 68 - i * 8
          return (
            <g key={i} transform={`translate(32, ${y})`}>
              <path
                d="M 0,0 C -8,-2 -8,-7 0,-9 C 2,-5 2,-2 0,0 Z"
                fill="#F59E0B"
              />
              <path
                d="M 0,0 C 8,-2 8,-7 0,-9 C -2,-5 -2,-2 0,0 Z"
                fill="#D97706"
              />
            </g>
          )
        })}
      </motion.g>

      {/* Main Foreground Wheat Stalk */}
      <motion.g
        animate={{ rotate: [-9, 7, -9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "50px", originY: "92px" }}
      >
        {/* Main Stem */}
        <path
          d="M 50,92 Q 50,55 50,15"
          fill="none"
          stroke="#D97706"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Base Leaves */}
        <path d="M 50,82 Q 30,76 22,64 Q 34,70 50,78 Z" fill="#F59E0B" />
        <path d="M 50,84 Q 70,78 78,66 Q 66,72 50,81 Z" fill="#D97706" />

        {/* 7 Pairs of Golden Grains with Awns/Bristles */}
        {[...Array(7)].map((_, i) => {
          const y = 72 - i * 7.5
          const scale = 1 - i * 0.04 // Gradually tapers off toward top
          return (
            <g key={i} transform={`translate(50, ${y}) scale(${scale})`}>
              {/* Thin Golden Awns (Bristles) */}
              <path
                d="M 0,0 C -8,-8 -12,-18 -15,-23"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
              <path
                d="M 0,0 C 8,-8 12,-18 15,-23"
                fill="none"
                stroke="#FCD34D"
                strokeWidth="0.8"
                strokeLinecap="round"
              />

              {/* Left Grain */}
              <path
                d="M 0,2 C -11,-2 -11,-10 0,-12 C 3,-7 2,-2 0,2 Z"
                fill="#FBBF24"
                stroke="#D97706"
                strokeWidth="0.5"
              />
              <path
                d="M 0,2 C -7,-2 -7,-8 0,-12 Z"
                fill="#FEF08A"
                opacity="0.6"
              />

              {/* Right Grain */}
              <path
                d="M 0,2 C 11,-2 11,-10 0,-12 C -3,-7 -2,-2 0,2 Z"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="0.5"
              />
              <path
                d="M 0,2 C 7,-2 7,-8 0,-12 Z"
                fill="#FBBF24"
                opacity="0.6"
              />
            </g>
          )
        })}

        {/* Topmost Grain & Central Spike */}
        <path
          d="M 50,15 L 50,-2"
          stroke="#FCD34D"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 50,18 C 46,12 46,7 50,3 C 54,7 54,12 50,18 Z"
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth="0.5"
        />
      </motion.g>
    </motion.svg>
  )
}
