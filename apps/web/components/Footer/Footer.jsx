"use client"

import React, { useState } from 'react';
import patern from '../../assets/patern.svg';
import small_logo from '../../assets/small_logo.png';
import Link from 'next/link';

export default function Footer() {
  // State for email input and language selector
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const DOCS_PAGE = process.env.NEXT_PUBLIC_DOCS_PAGE || "localhost:3001";
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribeMessage(`Subscribed with ${email}`);
      alert(`Thanks for subscribing! (${email})`);
      setEmail('');
      setTimeout(() => setSubscribeMessage(''), 3000);
    } else {
      alert('Please enter an email address');
    }
  };


  const handleSocialClick = (platform) => {
    alert(`Opening ${platform} profile`);
  };

  const handleLinkClick = (link) => {
    alert(`Navigate to ${link}`);
  };

  return (
    <div className="w-full bg-[#E85D23] relative overflow-hidden flex flex-col font-sans select-none text-[#0C0C0C]">

      {/* Grid layout: 2 rows, 3 columns, middle column spans both rows */}
      {/* <div className="grid grid-cols-3 grid-rows-2 auto-rows-min"> */}
      <div className="grid md:grid-cols-3 md:grid-rows-2   ">

        {/* ================= CELL 1 (Top Left) ================= */}
        <div className="relative bg-[#E85D23] border-b border-r border-[#0C0C0C]/10 ">
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url(${patern.src})`,
              backgroundSize: '160px auto',
              backgroundRepeat: 'repeat',
            }}
          />
          {/* Content: social icons + links + language selector */}
          <div className="relative z-10 p-8 flex flex-col justify-between h-full">
            {/* <div className="flex items-center gap-5 text-neutral-800">
              <span onClick={() => handleSocialClick('Folder')} className="cursor-pointer hover:text-black transition-colors text-lg">📁</span>
              <span onClick={() => handleSocialClick('Plane')} className="cursor-pointer hover:text-black transition-colors text-base">✈</span>
              <span onClick={() => handleSocialClick('X')} className="cursor-pointer hover:text-black transition-colors font-mono text-sm font-bold">X</span>
            </div> */}
            <div className="mt-6">
              {/* <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#0C0C0C]/30 text-[#0C0C0C] text-xs font-mono border border-[#0C0C0C]/20 rounded-sm px-2 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
                <option value="om">Oromiffa</option>
              </select> */}
            </div>

          </div>
        </div>

        {/* ================= CELL 2 (Middle, spans both rows) ================= */}
        <div className="row-span-2 bg-[#E85D23] border-r border-[#0C0C0C]/10 flex flex-col justify-center px-10 py-12">
          {/* Main CTA content */}
          <h2 className="text-[40px] md:text-[46px] font-bold leading-[1.1] tracking-tight mb-4 text-[#0C0C0C]">
            The standard for <br />
            Ethiopian web development
          </h2>
          <p className="text-[#0C0C0C]/70 text-[14px] leading-relaxed max-w-[440px] tracking-wide mb-8">
            Join the community building the components , standards, and design patterns that will define the next generation of Ethiopian digital products
          </p>

          {/* Buttons */}
          <div className="flex flex-row items-center gap-6">
            <Link
              href="https://github.com/coderade1905/kewti-components"
              target='_blank'
              rel="noopener noreferrer"
              className="bg-[#141414] text-white font-mono text-[11px] font-bold uppercase tracking-wider px-6 py-3.5 flex items-center gap-2 rounded-sm relative cursor-pointer hover:bg-[#1f1f1f] transition-colors"
            >
              <span>Star on Github</span>
              <span className="text-[#FF6B35] text-xs">★</span>
              <div className="absolute top-0 bottom-0 -left-[1px] w-[2px] bg-white/20" />
              <div className="absolute top-0 bottom-0 -right-[1px] w-[2px] bg-white/20" />
            </Link>

            <Link
              target='_blank'
              rel="noopener noreferrer"
              href={DOCS_PAGE}
              className="bg-white text-[#0C0C0C] font-mono text-[11px] font-bold uppercase tracking-wider px-6 py-3.5 flex items-center gap-3 rounded-sm relative border border-[#0C0C0C]/5 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <span>Read the docs</span>
              <svg className="w-3.5 h-3.5 text-[#E85D23]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
              <div className="absolute top-0 bottom-0 -left-[1px] w-[2px] bg-[#0C0C0C]/10" />
              <div className="absolute top-0 bottom-0 -right-[1px] w-[2px] bg-[#0C0C0C]/10" />
            </Link>
          </div>

          {/* Email signup form */}
          <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-[440px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email for updates"
              className="flex-1 bg-[#141414] border border-[#0C0C0C]/20 rounded-sm px-4 py-2 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#0C0C0C]/40"
            />
            <button
              type="submit"
              className="bg-[#141414] text-white font-mono text-[11px] font-bold uppercase tracking-wider px-5 py-2 rounded-sm hover:bg-[#1f1f1f] transition-colors"
            >
              Subscribe
            </button>
          </form>
          {subscribeMessage && (
            <p className="text-[10px] text-[#0C0C0C]/80 mt-2 font-mono">{subscribeMessage}</p>
          )}

          {/* Bottom credit line */}
          <div className="mt-8">
            <span className="text-[17px] font-medium tracking-tight text-[#0C0C0C]/90">
              Open source . Built for Ethiopia
            </span>
          </div>
        </div>

        {/* ================= CELL 3 (Top Right) ================= */}
        <div className="bg-[#141414] flex items-center justify-center py-16 min-h-[460px] border-b border-[#0C0C0C]/10">
          <div className="flex items-center gap-3 text-white">
            <div className="flex flex-col gap-1.5 items-end">
              {/* <div className="w-8 h-2.5 bg-white rounded-sm transform -skew-x-[25deg]" />
              <div className="w-11 h-2.5 bg-white rounded-sm transform -skew-x-[25deg] -mr-1" />
              <div className="w-5 h-2.5 bg-white rounded-sm transform -skew-x-[25deg]" /> */}
              <img src={small_logo.src} alt="logo" width="100" height="400" />

            </div>
            <span className="text-[44px] font-black tracking-tight lowercase pt-5 px-2">Kewti</span>
          </div>
        </div>

        {/* ================= CELL 4 (Bottom Left) ================= */}
        <div className="min-h-[460px] flex flex-col justify-end p-8 bg-[#141414] border-t border-r border-[#1F1F1F]">
          <div className="flex flex-col gap-3 font-mono text-xs text-white/60">
            <p className="leading-relaxed">
              Huge thanks to{' '}
              <Link
                href="https://t.me/pereztech"
                target='_blank'
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 my-0.5 rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                @pereztech <span className="text-white/40 text-[10px]">(For the landing)</span>
              </Link>
              {' '}&{' '}
              <Link
                href="https://t.me/rahwanmakes"
                target='_blank'
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 my-0.5 rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                @rahwanmakes <span className="text-white/40 text-[10px]">(For the graphic design)</span>
              </Link>
            </p>
          </div>
        </div>

        {/* ================= CELL 5 (Bottom Right) ================= */}
        <div className="relative w-full  bg-[#E85D23] overflow-hidden border-l border-t border-[#0C0C0C]/10">
          {/* Background Pattern Layer */}
          <div
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url(${patern.src})`,
              backgroundSize: '160px auto',
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Right-aligned Vertical Text Container */}
          <div className="absolute  right-15 origin-bottom-right -rotate-90 translate-x-[5px] translate-y-[-20px] whitespace-nowrap select-none pointer-events-none">
            <div className="text-[65px] font-bold tracking-tight text-white select-none leading-none">
              Components
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}