import React from 'react';
import patern from '../../assets/patern.svg';
import { cn } from '@/lib/utils';

export default function HeroBackground({ children, className = "" }) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-[#0A0A0A]", className)}>

      {/* Orange Glow – responsive with Tailwind */}
      <div
        className="absolute pointer-events-none
          w-[400px] h-[300px] md:w-[600px] md:h-[450px] lg:w-[800px] lg:h-[600px]
          top-[40%] md:top-[35%] lg:top-[35%]
          left-1/2
          -translate-x-1/2 md:-translate-x-[30%] lg:-translate-x-[30%]
          -translate-y-1/2 md:-translate-y-1/2 lg:-translate-y-1/2
          rounded-full
          opacity-20 md:opacity-20 lg:opacity-20
          blur-[80px] md:blur-[100px] lg:blur-[140px]
          bg-radial-glow
        "
        style={{
          // Keep the radial gradient as inline style (Tailwind doesn't have radial gradient utilities easily)
          background: 'radial-gradient(circle, #E05320 0%, #241B17 60%, transparent 100%)',
        }}
      />

      {/* Left Pattern – responsive pattern size */}
      <div
        className="absolute top-0 left-0 h-full w-[20%] bg-repeat opacity-100
          bg-pattern-left
        "
        style={{
          backgroundImage: `url(${patern.src})`,
          backgroundSize: '80px', // fallback for very small screens
        }}
      />

      {/* Right Pattern – responsive pattern size */}
      <div
        className="absolute top-0 right-0 h-full w-[20%] bg-repeat opacity-100
          bg-pattern-right
        "
        style={{
          backgroundImage: `url(${patern.src})`,
          backgroundSize: '80px',
        }}
      />

      {/* Content – unchanged */}
      <div className="relative z-10 mx-auto flex w-full flex-col items-center">
        {children}
      </div>

      {/* 
        To make pattern size responsive with pure Tailwind, we add a <style> block 
        because Tailwind cannot generate dynamic background-size per breakpoint 
        from inline styles. If you want 100% Tailwind without any <style>, 
        you would need to create custom utilities in tailwind.config.js.
        For simplicity, the following style block uses Tailwind's breakpoints.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .bg-pattern-left, .bg-pattern-right {
            background-size: 120px !important;
          }
        }
        @media (min-width: 1024px) {
          .bg-pattern-left, .bg-pattern-right {
            background-size: 180px !important;
          }
        }
      `}} />
    </div>
  );
}