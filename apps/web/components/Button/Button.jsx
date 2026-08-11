import React from 'react';

export default function Button({ children, className = "" }) {
  return (
    <div className={`relative inline-block group ${className}`}>
      {/* The Glow Layer Beneath the Button */}
      <div className="absolute -inset-1 bg-kewti-orange/40 rounded-xl blur-md opacity-80 group-hover:opacity-100 transition duration-200"></div>
      
      {/* The Main Interactive Button Layer */}
      <button className="relative px-7 py-3 bg-kewti-orange text-amber-100 font-semibold text-sm rounded-xl tracking-wide transition-transform active:scale-98">
        {children}
      </button>
    </div>
  );
}