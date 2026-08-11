
"use client"

import React, { useState } from 'react';

export default function FeaturesSection() {
  // State for search input and select dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('react');

  // Handle box clicks - shows alert with the clicked feature name
  const handleBoxClick = (featureName) => {
    // alert(`You selected: ${featureName}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] relative overflow-hidden flex flex-col items-center justify-center py-16 px-6 font-mono select-none">
      
      {/* ================= BACKGROUND LAYOUT (patern_2.svg / image_a43ea2.jpg) ================= */}
      {/* Ambient Orange Background Glow */}
      <div 
        className="absolute w-[800px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[140px] mix-blend-screen"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #E05320 0%, #241B17 60%, transparent 100%)',
        }}
      />
      
      {/* Left Margin Pattern Cover */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-[42%] pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url('/assets/patern_2.svg')`,
          backgroundSize: '180px auto',
          backgroundRepeat: 'repeat',
          WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
        }}
      />

      {/* Right Margin Pattern Cover */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-[42%] pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url('/assets/patern_2.svg')`,
          backgroundSize: '180px auto',
          backgroundRepeat: 'repeat',
          WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
        }}
      />

      {/* ================= CONTENT CONTAINER (image_968b7d.png) ================= */}
      <div className="relative z-10 w-full max-w-[640px] flex flex-col text-left">
        
        {/* Section Heading Titles */}
        <h2 className="text-white text-[44px] font-medium leading-[1.15] tracking-tight mb-4">
          Plug in <br />
          Ship Faster
        </h2>

        {/* Section Paragraph Text Description */}
        <p className="text-neutral-400 font-sans text-[15px] leading-relaxed tracking-normal max-w-[620px] mb-6">
          Composable , typed and modular .Built React and Next.js with full Typescript definitions out of the box . Tailwind-compatible with no style conflicts
        </p>

        {/* ALTERNATING 2x2 GRID BLOCK */}
        <div className="grid grid-cols-2 grid-rows-2 w-full h-[190px] font-sans text-lg font-medium">
          
          {/* 1. React Box (Top Left - Orange) - Clickable */}
          <div 
            onClick={() => handleBoxClick('React')}
            className="bg-[#FF6B35] text-[#0C0C0C] flex items-center gap-4 px-8 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <svg className="w-6 h-6 animate-[spin_20s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <span className="text-[21px] font-medium tracking-tight">React</span>
          </div>

          {/* 2. Typescript Box (Top Right - Dark) - Clickable */}
       <div 
  onClick={() => handleBoxClick('TypeScript')}
  className="
    group 
    flex items-center gap-4 
    w-full h-20 sm:h-auto 
    px-6 py-4 
    bg-[#141414] border-b border-l border-neutral-900/40 
    cursor-pointer 
    hover:bg-[#1a1a1a] 
    transition-colors
  "
>
  {/* Icon Container */}
  <div className="flex-shrink-0 w-6 h-6 sm:w-[22px] sm:h-[22px] bg-[#007ACC] text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center rounded-[2px] font-sans relative">
    <span className="absolute bottom-0 right-0.5 translate-y-[1px]">TS</span>
  </div>

  {/* Text Label */}
  <span className="text-lg sm:text-[21px] font-normal tracking-tight text-neutral-200 truncate">
    Typescript
  </span>
</div>

          {/* 3. Next.js Box (Bottom Left - Dark) - Clickable */}
          <div 
            onClick={() => handleBoxClick('Next.js')}
            className="bg-[#141414] text-white flex items-center gap-4 px-8 border-t border-r border-neutral-900/40 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          >
            <div className="w-[24px] h-[24px] bg-white text-black font-black text-xs rounded-full flex items-center justify-center tracking-tighter">
              N
            </div>
            <span className="text-[21px] font-normal tracking-tight text-neutral-200">Next . js</span>
          </div>

          {/* 4. Tailwind Box (Bottom Right - Orange) - Clickable */}
          <div 
            onClick={() => handleBoxClick('Tailwind')}
            className="bg-[#FF6B35] text-[#0C0C0C] flex items-center gap-4 px-8 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.5c-2.3 0-3.9 1.15-4.8 3.45 1.15-1.15 2.53-1.61 4.14-1.38.92.13 1.58.8 2.31 1.54 1.18 1.2 2.55 2.59 5.35 2.59 2.3 0 3.9-1.15 4.8-3.45-1.15 1.15-2.53 1.61-4.14 1.38-.92-.13-1.58-.8-2.31-1.54C16.17 7.9 14.8 6.5 12 6.5zm-7.2 6.9c-2.3 0-3.9 1.15-4.8 3.45 1.15-1.15 2.53-1.61 4.14-1.38.92.13 1.58.8 2.31 1.54 1.18 1.2 2.55 2.59 5.35 2.59 2.3 0 3.9-1.15 4.8-3.45-1.15 1.15-2.53 1.61-4.14 1.38-.92-.13-1.58-.8-2.31-1.54-1.18-1.2-2.55-2.59-5.35-2.59z" />
            </svg>
            <span className="text-[21px] font-medium tracking-tight">Tailwind</span>
          </div>

        </div>

      </div>

    </div>
  );
}