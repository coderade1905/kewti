import React from "react"
import { motion } from "framer-motion"

export default function Sene() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* Vitality Ambient Glow */}
      <motion.circle
        cx="50"
        cy="50"
        r="28"
        fill="#4ADE80"
        opacity="0.18"
        animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sene Raindrops Nourishing the Seed */}
      {[28, 50, 72].map((x, i) => (
        <motion.path
          key={i}
          d={`M ${x},10 Q ${x - 2},18 ${x},22 Q ${x + 2},18 ${x},10 Z`}
          fill="#60A5FA"
          opacity="0.7"
          animate={{
            y: [0, 38],
            opacity: [0, 0.8, 0],
            scale: [0.6, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Fertile Soil Bed */}
      <path d="M 10,95 Q 50,80 90,95 Z" fill="#522504" />
      <path d="M 20,95 Q 50,85 80,95 Z" fill="#3B1A03" />

      {/* Seed Shell in Soil */}
      <ellipse cx="50" cy="86" rx="7" ry="4.5" fill="#78350F" />
      <path
        d="M 45,86 Q 50,83 55,86"
        stroke="#D97706"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Root Pushing Down into Soil */}
      <path
        d="M 50,88 Q 47,94 51,98"
        fill="none"
        stroke="#FEF08A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Sprouting Shoot & Leaves */}
      <motion.g
        animate={{ rotate: [-2, 2, -2], scaleY: [0.97, 1.03, 0.97] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "50px", originY: "86px" }}
      >
        {/* Green Stem */}
        <path
          d="M 50,86 Q 48,65 50,46"
          fill="none"
          stroke="#22C55E"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left Fresh Leaf */}
        <motion.path
          d="M 50,46 C 32,44 26,28 48,32 C 46,39 48,44 50,46 Z"
          fill="#16A34A"
          animate={{ rotate: [-1, 2, -1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "50px", originY: "46px" }}
        />
        <path d="M 49,45 C 38,42 34,33 46,34 Z" fill="#4ADE80" opacity="0.6" />

        {/* Right Fresh Leaf */}
        <motion.path
          d="M 50,46 C 68,44 74,28 52,32 C 54,39 52,44 50,46 Z"
          fill="#4ADE80"
          animate={{ rotate: [1, -2, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "50px", originY: "46px" }}
        />
        <path d="M 51,45 C 62,42 66,33 54,34 Z" fill="#86EFAC" opacity="0.7" />

        {/* Top Center Baby Leaf Bud */}
        <path d="M 50,46 Q 47,38 50,34 Q 53,38 50,46 Z" fill="#BBF7D0" />
      </motion.g>
    </motion.svg>
  )
}
