"use client"

import React, { useState } from 'react';
import Link from 'next/link';

export default function Calnder () {
  const amharicDays = ['ሰ', 'ማ', 'ረ', 'ሐ', 'አ', 'ቅ', 'እ'];
  const row1 = [1, '', '', '', '', '', ''];
  const row2 = [2, 3, 4, 5, 6, 7, 8];
  const row3 = [9, 10, 11, 12, 13, 14, 15];
  const row4 = [16, 17, 18, 19, 20, 21, 22];
  const row5 = [23, 24, 25, 26, 27, 28, 29];
  const row6 = [30, 31, '', '', '', '', ''];
  
  const DOCS_PAGE = process.env.NEXT_PUBLIC_DOCS_PAGE || "localhost:3001";

  const [selectedDay, setSelectedDay] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');

  const countries = [
    { name: 'Ethiopia', region: 'East Africa', code: 'et' },
    { name: 'Argentina', region: 'South America', code: 'ar' },
    { name: 'Australia', region: 'Oceania', code: 'au' },
    { name: 'Canada', region: 'North America', code: 'ca' },
    { name: 'China', region: 'Asia', code: 'cn' },
    { name: 'Kenya', region: 'East Africa', code: 'ke' }
  ];

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDayCell = (day, idx) => {
    if (day === '') {
      return <div key={idx} className="h-8 flex items-center justify-center"></div>;
    }
    const isSelected = day === selectedDay;
    return (
      <div 
        key={idx} 
        className="h-8 flex items-center justify-center cursor-pointer"
        onClick={() => setSelectedDay(day)}
      >
        {isSelected ? (
          <span className="w-7 h-7 bg-[#E05320] text-white flex items-center justify-center rounded-[3px] font-medium">
            {day}
          </span>
        ) : (
          <span className="hover:text-white/80 transition-colors">{day}</span>
        )}
      </div>
    );
  };

  return (
    // Main container: column on mobile, row on md+
    <div className="  w-full bg-[#241B17] flex flex-col md:flex-row justify-center relative overflow-hidden font-sans md:py-20 m-0 select-none ">
      
      {/* ================= LEFT COLUMN: CALENDAR BLOCK ================= */}
      <div className="w-full md:w-[32%] h-full bg-[#1C1C1C]/40 flex items-center justify-center py-10 md:py-0 md:pl-6">
        <div className="w-full max-w-[360px] bg-[#141414] rounded-xl p-6 border border-white/[0.02] mx-4 md:mx-0">
          
          {/* Header Month/Year Section */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-4xl font-bold text-white tracking-tight">3</div>
              <div className="text-3xl font-bold text-white mt-1">መስከረም</div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-white tracking-tight">2018</span>
              <span className="text-sm font-medium text-white/70">ዓ.ም</span>
            </div>
          </div>

          {/* Accent Line Divider Track */}
          <div className="w-full h-1 bg-[#222222] rounded-full mb-6 relative">
            <div className="absolute top-0 left-0 h-full w-[15%] bg-gradient-to-r from-[#E05320] via-[#E05320] to-[#E05320]/40 rounded-full" />
          </div>

          {/* Day Names Grid Header */}
          <div className="grid grid-cols-7 text-center text-xl font-medium text-neutral-400 mb-4">
            {amharicDays.map((day, idx) => (
              <div key={idx}>{day}</div>
            ))}
          </div>

          {/* Calendar Numbers Grid Stack */}
          <div className="grid grid-cols-7 gap-y-4 text-center text-base font-normal text-white">
            {row1.map((d, i) => renderDayCell(d, i))}
            {row2.map((d, i) => renderDayCell(d, i))}
            {row3.map((d, i) => renderDayCell(d, i))}
            {row4.map((d, i) => renderDayCell(d, i))}
            {row5.map((d, i) => renderDayCell(d, i))}
            {row6.map((d, i) => renderDayCell(d, i))}
          </div>

        </div>
      </div>


      {/* Bottom Right Action Panel - now responsive: becomes static on mobile, absolute on md+ */}
        <div className="bg-[#1C1C1C] rounded-none px-6 py-4 mt-10 flex items-center gap-4 border-l border-t border-neutral-800/30 cursor-pointer hover:bg-[#2a2220] transition-colors md:max-w-1/5 md:w-full md:absolute md:bottom-0 md:right-0 md:rounded-none">
          <Link target='_blank' rel="noopener noreferrer" href={`${DOCS_PAGE}/docs`}>
            <span className="text-sm font-normal text-neutral-300 tracking-wide">
              More to Explore
            </span>
          </Link>
          <div className="text-[#E05320] flex items-center justify-center">
            <svg className="w-4 h-4 transform stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>

    </div>
  );
}










// import React, { useState } from 'react';

// export default function Calnder () {
//   const amharicDays = ['ሰ', 'ማ', 'ረ', 'ሐ', 'አ', 'ቅ', 'እ'];
//   const row1 = [1, '', '', '', '', '', ''];
//   const row2 = [2, 3, 4, 5, 6, 7, 8];
//   const row3 = [9, 10, 11, 12, 13, 14, 15];
//   const row4 = [16, 17, 18, 19, 20, 21, 22];
//   const row5 = [23, 24, 25, 26, 27, 28, 29];
//   const row6 = [30, 31, '', '', '', '', ''];

//   // Calendar state
//   const [selectedDay, setSelectedDay] = useState(3);

//   // Input states for middle column
//   const [defaultInputValue, setDefaultInputValue] = useState('');
//   const [invalidInputValue, setInvalidInputValue] = useState('');
//   const [emailInputValue, setEmailInputValue] = useState('Hello@Kewti.com');

//   // Country selector states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState({
//     name: 'Ethiopia',
//     region: 'East Africa',
//     code: 'et'
//   });

//   const countries = [
//     { name: 'Ethiopia', region: 'East Africa', code: 'et' },
//     { name: 'Argentina', region: 'South America', code: 'ar' },
//     { name: 'Australia', region: 'Oceania', code: 'au' },
//     { name: 'Canada', region: 'North America', code: 'ca' },
//     { name: 'China', region: 'Asia', code: 'cn' },
//     { name: 'Kenya', region: 'East Africa', code: 'ke' }
//   ];

//   const filteredCountries = countries.filter(country =>
//     country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     country.region.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Helper to render calendar cell
//   const renderDayCell = (day, idx) => {
//     if (day === '') {
//       return <div key={idx} className="h-8 flex items-center justify-center"></div>;
//     }
//     const isSelected = day === selectedDay;
//     return (
//       <div 
//         key={idx} 
//         className="h-8 flex items-center justify-center cursor-pointer"
//         onClick={() => setSelectedDay(day)}
//       >
//         {isSelected ? (
//           <span className="w-7 h-7 bg-[#E05320] text-white flex items-center justify-center rounded-[3px] font-medium">
//             {day}
//           </span>
//         ) : (
//           <span className="hover:text-white/80 transition-colors">{day}</span>
//         )}
//       </div>
//     );
//   };

//   return (
//     // Main Container Canvas matching the specific tri-pane column layout background
//     <div className="w-full min-h-screen bg-[#241B17] flex justify-between relative overflow-hidden font-sans p-0 m-0 select-none">
      
//       {/* ================= LEFT COLUMN: CALENDAR BLOCK ================= */}
//       <div className="w-[32%] h-screen bg-[#1C1C1C]/40 flex items-center justify-center pl-6">
//         <div className="w-[360px] bg-[#141414] rounded-xl p-6 border border-white/[0.02]">
          
//           {/* Header Month/Year Section */}
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <div className="text-4xl font-bold text-white tracking-tight">3</div>
//               <div className="text-3xl font-bold text-white mt-1">መስከረም</div>
//             </div>
//             <div className="flex items-baseline gap-1 mt-1">
//               <span className="text-3xl font-bold text-white tracking-tight">2018</span>
//               <span className="text-sm font-medium text-white/70">ዓ.ም</span>
//             </div>
//           </div>

//           {/* Accent Line Divider Track */}
//           <div className="w-full h-1 bg-[#222222] rounded-full mb-6 relative">
//             <div className="absolute top-0 left-0 h-full w-[15%] bg-gradient-to-r from-[#E05320] via-[#E05320] to-[#E05320]/40 rounded-full" />
//           </div>

//           {/* Day Names Grid Header */}
//           <div className="grid grid-cols-7 text-center text-xl font-medium text-neutral-400 mb-4">
//             {amharicDays.map((day, idx) => (
//               <div key={idx}>{day}</div>
//             ))}
//           </div>

//           {/* Calendar Numbers Grid Stack */}
//           <div className="grid grid-cols-7 gap-y-4 text-center text-base font-normal text-white">
//             {/* Row 1 */}
//             {row1.map((d, i) => renderDayCell(d, i))}
//             {/* Row 2 */}
//             {row2.map((d, i) => renderDayCell(d, i))}
//             {/* Rows 3-6 */}
//             {row3.map((d, i) => renderDayCell(d, i))}
//             {row4.map((d, i) => renderDayCell(d, i))}
//             {row5.map((d, i) => renderDayCell(d, i))}
//             {row6.map((d, i) => renderDayCell(d, i))}
//           </div>

//         </div>
//       </div>

//       {/* ================= MIDDLE COLUMN: INPUT FIELDS STACK ================= */}
//       <div className="w-[34%] h-screen bg-[#211814] flex flex-col justify-center items-center px-4">
//         <div className="w-[380px] flex flex-col gap-3 relative">
          
//           {/* Transparent container frame backing */}
//           <div className="absolute -inset-4 bg-black/[0.08] rounded-2xl pointer-events-none" />

//           {/* Field 1: Default State */}
//           <div className="w-full flex flex-col gap-1 relative z-10">
//             <span className="text-xs text-neutral-500 pl-1">Default Input</span>
//             <input
//               type="text"
//               value={defaultInputValue}
//               onChange={(e) => setDefaultInputValue(e.target.value)}
//               className="w-full h-11 bg-[#1C1C1C] border border-neutral-800 rounded-lg text-white px-4 focus:outline-none focus:border-neutral-600"
//             />
//           </div>

//           {/* Field 2: Invalid Highlight Focus State */}
//           <div className="relative z-10">
//             <input
//               type="text"
//               value={invalidInputValue}
//               onChange={(e) => setInvalidInputValue(e.target.value)}
//               className="w-full h-[52px] bg-[#141414] border-2 border-[#E05320] rounded-xl text-neutral-400 px-4 focus:outline-none"
//             />
//           </div>

//           {/* Field 3: Text Input Block State */}
//           <div className="relative z-10">
//             <input
//               type="text"
//               value={emailInputValue}
//               onChange={(e) => setEmailInputValue(e.target.value)}
//               className="w-full h-12 bg-[#1C1C1C] border border-neutral-800 rounded-lg text-neutral-500 font-mono px-4 focus:outline-none focus:border-neutral-600"
//             />
//           </div>

//         </div>
//       </div>

//       {/* ================= RIGHT COLUMN: SEARCH DROPDOWN & FOOTER ================= */}
//       <div className="w-[34%] h-screen bg-[#1C1C1C]/10 flex flex-col justify-between items-end p-8 relative">
        
//         {/* Country Selector Component Deck */}
//         <div className="w-[380px] bg-[#141414] rounded-xl border border-neutral-800/60 mt-32 overflow-hidden flex flex-col">
          
//           {/* Header Search Filter Bar Row Input Component */}
//           <div className="p-3.5 border-b border-neutral-900/60 flex items-center justify-between px-4">
//             <div className="flex items-center gap-3 flex-1">
//               <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                 <circle cx="11" cy="11" r="8" />
//                 <line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search Countries....."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent text-white/80 text-xs flex-1 focus:outline-none placeholder:text-neutral-500"
//               />
//             </div>
//             <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <polyline points="6 9 12 15 18 9" />
//             </svg>
//           </div>

//           {/* Core Custom Item Grid List Content Element */}
//           <div className="flex relative">
//             <div className="flex-1 flex flex-col">
//               {filteredCountries.map((country, idx) => {
//                 const isSelected = selectedCountry.name === country.name;
//                 return (
//                   <div
//                     key={idx}
//                     onClick={() => setSelectedCountry(country)}
//                     className={`px-5 py-3 flex flex-col gap-0.5 cursor-pointer transition-colors ${
//                       isSelected ? 'bg-[#241B17]/40' : 'hover:bg-white/5'
//                     }`}
//                   >
//                     <span className={`text-sm ${isSelected ? 'font-semibold text-neutral-200' : 'text-neutral-300'}`}>
//                       {country.name}
//                     </span>
//                     <span className="text-xs text-neutral-500">
//                       {country.region}({country.code})
//                     </span>
//                   </div>
//                 );
//               })}
//               {filteredCountries.length === 0 && (
//                 <div className="px-5 py-6 text-center text-neutral-500 text-sm">
//                   No countries found
//                 </div>
//               )}
//             </div>

//             {/* Custom Orange Vertical Scrollbar bar thumb representation matching image */}
//             <div className="w-1.5 bg-black/10 self-stretch my-3 mr-2 relative rounded-full">
//               <div className="absolute top-0 right-0 w-full h-[52px] bg-[#E05320] rounded-full" />
//             </div>
//           </div>

//         </div>

//         {/* Absolute Bottom Right Action Panel Trigger Box Module */}
//         <div className="bg-[#1C1C1C] rounded-none px-6 py-4 flex items-center gap-4 border-l border-t border-neutral-800/30 absolute bottom-0 right-0 cursor-pointer hover:bg-[#2a2220] transition-colors">
//           <span className="text-sm font-normal text-neutral-300 tracking-wide">
//             More to Explore
//           </span>
//           {/* Arrow Glyph Accent Container Block */}
//           <div className="text-[#E05320] flex items-center justify-center">
//             <svg className="w-4 h-4 transform stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <line x1="7" y1="17" x2="17" y2="7" />
//               <polyline points="7 7 17 7 17 17" />
//             </svg>
//           </div>
//         </div>

//       </div>

//     </div>
//   );
// }