import React from "react"
import { motion } from "framer-motion"

export default function Tir() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* Shadow on the ground (shrinks as lime goes up) */}
      <motion.ellipse
        cx="50"
        cy="88"
        rx="16"
        ry="4"
        fill="#1F2937"
        opacity="0.15"
        animate={{ scale: [1, 0.4, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The Tossing Lime (Lomi) */}
      <motion.g
        animate={{
          y: [0, -35, 0], // Tosses up into the air and falls back down
          rotate: [-8, 12, -8], // Slight natural spin while in the air
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "50px", originY: "70px" }}
      >
        {/* Darker Green Base / Shadow */}
        <ellipse cx="50" cy="70" rx="18" ry="20" fill="#65A30D" />

        {/* Main Bright Lime Body */}
        <ellipse cx="48" cy="68" rx="16" ry="18" fill="#84CC16" />

        {/* Lime Highlight (Gives a 3D spherical shine) */}
        <ellipse cx="43" cy="61" rx="7" ry="10" fill="#BEF264" opacity="0.7" />

        {/* Citrus Pores / Skin Texture */}
        <circle cx="55" cy="65" r="0.8" fill="#4D7C0F" opacity="0.4" />
        <circle cx="49" cy="76" r="1.2" fill="#4D7C0F" opacity="0.3" />
        <circle cx="44" cy="72" r="0.7" fill="#4D7C0F" opacity="0.4" />
        <circle cx="58" cy="73" r="1" fill="#4D7C0F" opacity="0.3" />
        <circle cx="52" cy="82" r="0.9" fill="#4D7C0F" opacity="0.4" />
        <circle cx="39" cy="68" r="0.8" fill="#4D7C0F" opacity="0.4" />

        {/* Bottom Citrus Nub */}
        <path
          d="M 48,90 Q 50,92 52,90"
          fill="none"
          stroke="#4D7C0F"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Top Stem */}
        <path
          d="M 50,50 L 51,45"
          stroke="#78350F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Little Green Leaf */}
        <path
          d="M 51,47 C 58,40 68,44 63,52 C 59,54 53,52 51,47 Z"
          fill="#16A34A"
        />
        <path
          d="M 51,47 C 56,46 60,48 62,51"
          stroke="#15803D"
          strokeWidth="1"
          fill="none"
        />
      </motion.g>

      {/* Popping Hearts (Representing the Romantic Timkat Proposal) */}
      <motion.path
        d="M 70,40 C 70,37 75,35 78,38 C 81,35 86,37 86,40 C 86,45 78,50 78,50 C 78,50 70,45 70,40 Z"
        fill="#EF4444"
        animate={{
          y: [0, -15],
          x: [0, 8],
          opacity: [0, 1, 0],
          scale: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.7,
        }}
        style={{ originX: "78px", originY: "45px" }}
      />

      <motion.path
        d="M 25,50 C 25,47 30,45 33,48 C 36,45 41,47 41,50 C 41,55 33,60 33,60 C 33,60 25,55 25,50 Z"
        fill="#F43F5E"
        animate={{
          y: [0, -12],
          x: [0, -6],
          opacity: [0, 0.9, 0],
          scale: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.9,
        }}
        style={{ originX: "33px", originY: "55px" }}
      />
    </motion.svg>
  )
}
