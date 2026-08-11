"use client"

import React, { useState } from 'react';

export default function TargetAudienceSection() {
  const allCards = [
    {
      id: '01',
      title: 'Frontend Devs',
      fontClass: 'font-sans',
      text: 'Stop writing Ethiopian utility code from scratch Focus on what makes your product unique.',
      category: 'developer',
    },
    {
      id: '02',
      title: 'Statups & Saas',
      fontClass: 'font-sans',
      text: 'Ship localized MVPs faster . Kewti gives you the primitives so you can focus on your core product',
      category: 'startup',
    },
    {
      id: '03',
      title: 'Fintech Products',
      fontClass: 'font-mono',
      text: 'Date pickers , location selectors, and currency aware components built for Ethiopian financial workflows',
      category: 'fintech',
    },
    {
      id: '04',
      title: 'Enterprise tools',
      fontClass: 'font-mono',
      text: 'Internal tools , Dashboards , and admin panels that speak the language of your Ethiopian workforce',
      category: 'enterprise',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCardId, setSelectedCardId] = useState(null);

  const filteredCards = allCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || card.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCardClick = (cardId) => {
    setSelectedCardId(cardId);
    // alert(`Selected: ${allCards.find(c => c.id === cardId).title}`);
  };

  return (
    // Outer container: full width on mobile, w-3/4 on larger screens
    <div className="w-full md:w-3/4 min-h-screen bg-[#0A0A0A] relative overflow-hidden flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6 select-none">
      
      {/* ================= RESPONSIVE BACKGROUND GLOW ================= */}
      <div 
        className="absolute w-[500px] h-[400px] sm:w-[700px] sm:h-[600px] md:w-[900px] md:h-[700px] rounded-full pointer-events-none opacity-20 blur-[80px] sm:blur-[120px] md:blur-[150px] mix-blend-screen"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #E05320 0%, #241B17 60%, transparent 100%)',
        }}
      />
      
      {/* Left Pattern – responsive background size */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-[42%] pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url('/assets/patern_2.svg')`,
          backgroundSize: '80px auto',
          backgroundRepeat: 'repeat',
          WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to right, black 50%, transparent 100%)',
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 640px) {
          .absolute.w-\\[42\\%\\] {
            background-size: 120px auto !important;
          }
        }
        @media (min-width: 1024px) {
          .absolute.w-\\[42\\%\\] {
            background-size: 180px auto !important;
          }
        }
      `}} />

      {/* Right Pattern */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-[42%] pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url('/assets/patern_2.svg')`,
          backgroundSize: '80px auto',
          backgroundRepeat: 'repeat',
          WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to left, black 50%, transparent 100%)',
        }}
      />

      {/* ================= CONTENT GRID – responsive columns ================= */}
      <div className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-2 sm:px-0">
        {filteredCards.map((card) => (
          <div 
            key={card.id} 
            onClick={() => handleCardClick(card.id)}
            className={`w-full h-[380px] sm:h-[460px] bg-[#141414] border rounded-2xl relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-8 pt-0 shadow-2xl transition-all cursor-pointer
              ${selectedCardId === card.id ? 'border-[#E05320] border-2' : 'border-white/[0.02] hover:border-white/10'}`}
          >
            {/* Top Tab – responsive padding & text */}
            <div className="bg-[#0C0C0C] border-b border-x border-white/[0.03] rounded-b-xl px-5 sm:px-7 py-2 sm:py-3 flex items-center justify-center gap-1.5 min-w-[160px] sm:min-w-[190px]">
              <span className="text-[#FF6B35] font-mono text-[13px] sm:text-[15px] font-semibold">
                &lt;{card.id}&gt;
              </span>
              <span className={`text-neutral-200 text-[13px] sm:text-[15px] tracking-wide ${card.fontClass}`}>
                {card.title}
              </span>
            </div>

            {/* Graphic & Text Area – responsive inner layout */}
            <div className="w-full h-[250px] sm:h-[290px] relative mt-auto rounded-xl overflow-hidden">
              
              {/* Orange silhouette blocks – same proportions */}
              <div className="absolute inset-0 pointer-events-none opacity-90 mix-blend-normal">
                <div className="absolute top-[60px] sm:top-[75px] left-0 right-[40px] bottom-[30px] sm:bottom-[40px] bg-[#FF6B35]" />
                <div className="absolute top-0 left-[100px] sm:left-[130px] right-[40px] h-[60px] sm:h-[75px] bg-[#FF6B35]" />
                <div className="absolute bottom-0 left-0 right-[120px] sm:right-[150px] h-[30px] sm:h-[40px] bg-[#FF6B35]" />
              </div>

              {/* Text overlay – responsive font size and padding */}
              <div className="absolute inset-0 z-10 flex items-center justify-start pl-4 sm:pl-6 pr-8 sm:pr-16">
                <p className="text-[#0A0A0A] font-sans text-[14px] sm:text-[17px] font-medium leading-[1.35] sm:leading-[1.38] tracking-tight">
                  {card.text}
                </p>
              </div>
            </div>
          </div>
        ))}
        {filteredCards.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center text-neutral-500 py-12">
            No matching audience cards found.
          </div>
        )}
      </div>
    </div>
  );
}