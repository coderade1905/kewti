"use client"

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * @type {import('react').FC<{
 *   command?: string,
 *   logo?: any,
 *   arrowImage?: string,
 *   className?: string,
 *   text?: string
 * }>}
 */
const InstallationCard = ({ 
  command = "npx kewti add calendar", 
  logo, 
  arrowImage,
  className = "" ,
  text
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 ${className}`} >
      {/* Optional Decorative Top Arrow */}
      {arrowImage && (
        <div className="mb-4 py-15">
          <img src={arrowImage} alt="Feature arrow" className="h-12 w-auto object-contain" />
        </div>
      )}


{!text ? (<>


      {/* Main Terminal Card matching the layout and your custom theme variables */}
      <div className="w-full flex items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-kewti-center p-5 shadow-xl transition-all duration-300 hover:border-neutral-700 relative overflow-hidden group">
  
        {/* Optional background stripe pattern structure */}
        <div className="absolute inset-0 bg-kewti-stripes pointer-events-none mix-blend-overlay" />

        <div className="flex items-center gap-4 min-w-0 z-10">
          {/* Custom Prompt Icon / Logo utilizing your exact color variable */}
          <div className="flex-shrink-0 text-kewti-orange font-mono text-xl font-bold select-none">
            {logo ? (
              typeof logo === 'string' ? <img src={logo} alt="logo" className="h-5 w-5 object-contain" /> : logo
            ) : (
              ">"
            )}
          </div>

          {/* Code Text */}
          <code className="truncate font-mono text-sm sm:text-base md:text-lg text-neutral-200 selection:bg-kewti-orange/30">
            {command}
          </code>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="z-10 flex-shrink-0 rounded-lg p-2.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all active:scale-95 relative"
          aria-label="Copy installation command"
        >
          {copied ? (
            <Check className="h-5 w-5 text-green-500 transition-transform scale-110" />
          ) : (
            <Copy className="h-5 w-5 text-kewti-orange transition-transform" />
          )}
          
          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-200 group-hover:scale-100 transition-all shadow-md">
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </button>

      
      
      


      </div>
      </>):(<div className=" font-extrabold text-3xl text-neutral-200 ">{text}</div>)}
    </div>
  );
};

export default InstallationCard;