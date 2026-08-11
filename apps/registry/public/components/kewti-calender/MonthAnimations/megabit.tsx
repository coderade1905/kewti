import React from "react"
import { motion } from "framer-motion"

export default function Megabit() {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
    >
      {/* Appetizing Warm Ambient Glow */}
      <motion.circle
        cx="50"
        cy="50"
        r="44"
        fill="#FBBF24"
        opacity="0.15"
        animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Smooth Floating Platter Group */}
      <motion.g
        animate={{ scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "50px", originY: "50px" }}
      >
        {/* White Circular Ceramic Plate */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="0.8"
        />

        {/* Injera Base Layer (Greyish-Tan Textured Flatbread) */}
        <circle cx="50" cy="50" r="41" fill="#D3C7B5" />
        {/* Porous Injera Eyes (Pores / Texture Ring) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#C3B5A2"
          strokeWidth="0.8"
          strokeDasharray="1.5 2"
        />
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="#B8A995"
          strokeWidth="0.8"
          strokeDasharray="1 2.5"
        />

        {/* --- Colorful Assortment of Wot / Dishes (Matching Photo) --- */}

        {/* 1. Center Lentil Stew (Miser Wot) */}
        <circle cx="50" cy="50" r="8.5" fill="#7C2D12" />
        <circle
          cx="50"
          cy="50"
          r="7.5"
          fill="#652308"
          stroke="#9A3412"
          strokeWidth="0.8"
          strokeDasharray="1 1"
        />

        {/* 2. Orange Shiro Pool (Right) */}
        <ellipse cx="78" cy="41" rx="7.5" ry="6" fill="#EA580C" />
        <ellipse cx="78" cy="41" rx="5.5" ry="4" fill="#F97316" opacity="0.8" />

        {/* 3. Orange Shiro Pool (Left) */}
        <ellipse cx="22" cy="59" rx="7.5" ry="6" fill="#EA580C" />
        <ellipse cx="22" cy="59" rx="5.5" ry="4" fill="#F97316" opacity="0.8" />

        {/* 4. Yellow Split Peas / Ater Kik (Top Right & Left) */}
        <path
          d="M 44,18 C 52,18 56,26 48,27 C 42,26 40,20 44,18 Z"
          fill="#FACC15"
        />
        <circle cx="34" cy="44" r="5.5" fill="#EAB308" />
        <circle cx="65" cy="56" r="5.5" fill="#FACC15" />

        {/* 5. Dark Greens / Gomen (Top Left) */}
        <path
          d="M 30,22 C 38,18 42,26 36,29 C 30,28 28,24 30,22 Z"
          fill="#14532D"
        />
        <circle cx="70" cy="73" r="4.5" fill="#166534" />

        {/* 6. Dark Purple Beets / Key Sir (Top Center & Bottom Center) */}
        <path d="M 44,30 L 56,30 L 53,38 L 47,38 Z" fill="#701A75" />
        <path d="M 43,62 L 57,62 L 53,71 L 47,71 Z" fill="#581C87" />
        {/* Beet slices */}
        <line
          x1="46"
          y1="31"
          x2="54"
          y2="37"
          stroke="#A21CAF"
          strokeWidth="1"
        />
        <line
          x1="45"
          y1="63"
          x2="55"
          y2="70"
          stroke="#C084FC"
          strokeWidth="1"
        />

        {/* 7. Green Salad with Tomatoes (Middle Left & Right) */}
        <g transform="translate(36, 61)">
          <ellipse cx="0" cy="0" rx="5" ry="4" fill="#15803D" />
          <circle cx="-1.5" cy="-1" r="1.2" fill="#EF4444" />
          <circle cx="2" cy="1" r="1" fill="#86EFAC" />
        </g>
        <g transform="translate(63, 39)">
          <ellipse cx="0" cy="0" rx="5" ry="4" fill="#15803D" />
          <circle cx="1" cy="-1" r="1.2" fill="#EF4444" />
          <circle cx="-2" cy="1" r="1" fill="#FEF08A" />
        </g>

        {/* 8. Green Beans & Carrots / Fosolia (Right & Left Edge) */}
        <g transform="translate(74, 58)">
          <path
            d="M 0,0 Q 8,6 4,12"
            stroke="#16A34A"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 2,-1 Q 8,2 6,8"
            stroke="#F97316"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(18, 34)">
          <path
            d="M 0,0 Q 8,6 4,12"
            stroke="#16A34A"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 2,-1 Q 8,2 6,8"
            stroke="#F97316"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* --- 4 Rolled Injera Cylinders Framing the Perimeter (As seen in photo) --- */}

        {/* Roll 1: Top-Left */}
        <g>
          <path
            d="M 12,28 C 16,16 30,11 37,13 C 33,18 24,24 16,31 Z"
            fill="#E5DAD0"
            stroke="#B8A898"
            strokeWidth="0.8"
          />
          <ellipse
            cx="14"
            cy="29.5"
            rx="2.5"
            ry="1.8"
            fill="#D3C7B5"
            stroke="#B8A898"
            strokeWidth="0.6"
          />
        </g>

        {/* Roll 2: Top-Right */}
        <g>
          <path
            d="M 63,13 C 70,11 84,16 88,28 C 84,31 75,24 67,18 Z"
            fill="#E5DAD0"
            stroke="#B8A898"
            strokeWidth="0.8"
          />
          <ellipse
            cx="86"
            cy="29.5"
            rx="2.5"
            ry="1.8"
            fill="#D3C7B5"
            stroke="#B8A898"
            strokeWidth="0.6"
          />
        </g>

        {/* Roll 3: Bottom-Left */}
        <g>
          <path
            d="M 20,86 C 30,90 44,90 51,88 C 45,83 33,81 22,81 Z"
            fill="#E5DAD0"
            stroke="#B8A898"
            strokeWidth="0.8"
          />
          <ellipse
            cx="21"
            cy="83.5"
            rx="1.8"
            ry="2.5"
            fill="#D3C7B5"
            stroke="#B8A898"
            strokeWidth="0.6"
          />
        </g>

        {/* Roll 4: Bottom-Right */}
        <g>
          <path
            d="M 80,86 C 70,90 56,90 49,88 C 55,83 67,81 78,81 Z"
            fill="#E5DAD0"
            stroke="#B8A898"
            strokeWidth="0.8"
          />
          <ellipse
            cx="79"
            cy="83.5"
            rx="1.8"
            ry="2.5"
            fill="#D3C7B5"
            stroke="#B8A898"
            strokeWidth="0.6"
          />
        </g>
      </motion.g>

      {/* Rising Delicate Steam Particles */}
      {[35, 50, 65].map((x, idx) => (
        <motion.circle
          key={idx}
          cx={x}
          cy="45"
          r="1.2"
          fill="#FEF08A"
          animate={{
            y: [0, -18],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: idx * 0.7,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.svg>
  )
}
