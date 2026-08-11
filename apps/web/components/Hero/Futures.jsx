"use client"

import React, { useState } from 'react';

export default function Futures() {
  const amharicWeekdays = ['ሰ', 'ማ', 'ረ', 'ሐ', 'አ', 'ቅ', 'እ'];
  
  const [selectedDay, setSelectedDay] = useState(3);
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const [defaultInput, setDefaultInput] = useState('');
  const [invalidInput, setInvalidInput] = useState('');
  const [emailInput, setEmailInput] = useState('Hello@Kewti.com');

  const datePickerRowsInit = [
    { day: '1', month: 'መስከረም', year: '2009', active: false },
    { day: '2', month: 'ጥቅምት', year: '2010', active: false },
    { day: '3', month: 'ህዳር', year: '2011', active: false },
    { day: '4', month: 'ታህሳስ', year: '2012', active: true },
    { day: '5', month: 'ጥር', year: '2013', active: false },
    { day: '6', month: 'የካቲት', year: '2014', active: false },
    { day: '7', month: 'መጋቢት', year: '2015', active: false },
  ];
  const [datePickerRows, setDatePickerRows] = useState(datePickerRowsInit);

  const countriesList = [
    { name: 'Ethiopia', region: 'East Africa', code: 'et' },
    { name: 'Argentina', region: 'South America', code: 'ar' },
    { name: 'Australia', region: 'Oceania', code: 'au' },
    { name: 'Canada', region: 'North America', code: 'ca' },
    { name: 'China', region: 'Asia', code: 'cn' },
    { name: 'Kenya', region: 'East Africa', code: 'ke' }
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countriesList[0]);

  const filteredCountries = countriesList.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDateRowClick = (index) => {
    const updatedRows = datePickerRows.map((row, i) => ({
      ...row,
      active: i === index
    }));
    setDatePickerRows(updatedRows);
  };

  return (
    // Outer container: responsive padding, full width
    <div className="w-full min-h-screen bg-[#0C0C0C] text-white p-4 sm:p-6 flex items-center justify-center font-mono select-none">
      
      {/* Responsive grid: 1 column on mobile, 2 columns on medium screens and up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-[1200px]">
        
        {/* ================= CARD 1: ETHIOPIAN CALENDAR ================= */}
        <div className="bg-[#111111] border border-white/[0.02] rounded-none relative flex flex-col p-4 sm:p-8 h-auto min-h-[400px]">
          <div className="absolute top-0 left-0 bg-[#1A1A1A] text-neutral-300 text-[10px] sm:text-xs tracking-wider px-3 sm:px-5 py-2 sm:py-2.5 border-r border-b border-neutral-800/40">
            Ethiopian Calender
          </div>

          <div className="flex-1 flex items-center justify-center mt-8 sm:mt-6">
            <div className="w-full max-w-[280px] bg-[#161616] rounded-xl p-4 border border-white/[0.01]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">3</div>
                  <div className="text-base sm:text-lg font-bold text-white mt-0.5">መስከረም</div>
                </div>
                <div className="text-base sm:text-lg font-bold text-white tracking-tight">2018</div>
              </div>

              <div className="w-full h-[2px] bg-neutral-800 rounded-full mb-3">
                <div className="h-full w-1/4 bg-[#E05320] rounded-full" />
              </div>

              <div className="grid grid-cols-7 text-center text-[8px] sm:text-[10px] font-semibold text-neutral-500 mb-2">
                {amharicWeekdays.map((d, i) => <div key={i}>{d}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-y-1.5 text-center text-[10px] sm:text-[11px] text-neutral-300 font-sans">
                {daysInMonth.map(day => (
                  <div 
                    key={day} 
                    className="py-0.5 cursor-pointer hover:text-white transition-colors"
                    onClick={() => setSelectedDay(day)}
                  >
                    {day === selectedDay ? (
                      <span className="w-4 h-4 bg-[#E05320] text-white flex items-center justify-center rounded-[2px] font-bold text-[8px] sm:text-[10px] mx-auto">
                        {day}
                      </span>
                    ) : (
                      <span>{day}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-[#E05320]">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>

        {/* ================= CARD 2: KEWTI INPUT ================= */}
        <div className="bg-[#111111] border border-white/[0.02] rounded-none relative flex flex-col p-4 sm:p-8 h-auto min-h-[400px]">
          <div className="absolute top-0 left-0 bg-[#1A1A1A] text-neutral-300 text-[10px] sm:text-xs tracking-wider px-3 sm:px-5 py-2 sm:py-2.5 border-r border-b border-neutral-800/40">
            Kewti Input
          </div>

          <div className="flex-1 flex items-center justify-center mt-8 sm:mt-6">
            <div className="w-full max-w-[300px] flex flex-col gap-3 font-sans">
              <input
                type="text"
                value={defaultInput}
                onChange={(e) => setDefaultInput(e.target.value)}
                placeholder="Default Input"
                className="w-full bg-[#161616] border border-neutral-800/80 rounded-lg h-10 flex items-center px-4 text-xs text-neutral-500 focus:outline-none focus:border-neutral-600"
              />
              <input
                type="text"
                value={invalidInput}
                onChange={(e) => setInvalidInput(e.target.value)}
                placeholder="Invalid Input"
                className="w-full bg-[#141414] border-2 border-[#E05320] rounded-xl h-11 flex items-center px-4 text-xs text-neutral-300 focus:outline-none"
              />
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800/80 rounded-lg h-10 flex items-center px-4 text-[11px] font-mono text-neutral-500 focus:outline-none focus:border-neutral-600"
              />
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-[#E05320]">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>

        {/* ================= CARD 3: ETHIOPIAN DATE PICKER ================= */}
        <div className="bg-[#111111] border border-white/[0.02] rounded-none relative flex flex-col p-4 sm:p-8 h-auto min-h-[400px]">
          <div className="absolute top-0 left-0 bg-[#1A1A1A] text-neutral-300 text-[10px] sm:text-xs tracking-wider px-3 sm:px-5 py-2 sm:py-2.5 border-r border-b border-neutral-800/40">
            Ethiopian Date picker
          </div>

          <div className="flex-1 flex items-center justify-center mt-8 sm:mt-6">
            <div className="w-full max-w-[300px] bg-[#161616] rounded-2xl p-3 flex flex-col gap-0.5 border border-white/[0.01]">
              {datePickerRows.map((row, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleDateRowClick(idx)}
                  className={`grid grid-cols-3 text-center py-2 px-3 rounded-xl items-center text-[11px] sm:text-[13px] cursor-pointer transition-colors
                    ${row.active 
                      ? 'bg-[#241B17] text-white font-bold border border-[#E05320]/20' 
                      : 'text-neutral-500 font-medium hover:bg-white/5'
                    }`}
                >
                  <span className="text-left pl-2 font-mono">{row.day}</span>
                  <span className="text-center font-serif">{row.month}</span>
                  <span className="text-right pr-2 font-mono">{row.year}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-[#E05320]">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>

        {/* ================= CARD 4: KEWTI LOCATION SELECTOR ================= */}
        <div className="bg-[#111111] border border-white/[0.02] rounded-none relative flex flex-col p-4 sm:p-8 h-auto min-h-[400px]">
          <div className="absolute top-0 left-0 bg-[#1A1A1A] text-neutral-300 text-[10px] sm:text-xs tracking-wider px-3 sm:px-5 py-2 sm:py-2.5 border-r border-b border-neutral-800/40">
            Kewti Location Selector
          </div>

          <div className="flex-1 flex items-center justify-center mt-8 sm:mt-6">
            <div className="w-full max-w-[280px] bg-[#141414] rounded-xl border border-neutral-800/60 overflow-hidden flex flex-col font-sans">
              <div className="p-2.5 border-b border-neutral-900/80 flex items-center justify-between px-3 bg-black/10">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded-full border-2 border-neutral-500 flex items-center justify-center relative">
                    <div className="w-1 h-[2px] bg-neutral-500 absolute -bottom-0.5 -right-0.5 rotate-45" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Countries....."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-[10px] text-neutral-500 flex-1 focus:outline-none placeholder:text-neutral-500"
                  />
                </div>
                <div className="w-2 h-2 border-b-2 border-r-2 border-neutral-500 transform rotate-45 -translate-y-0.5" />
              </div>

              <div className="flex p-1 relative">
                <div className="flex-1 flex flex-col text-left">
                  {filteredCountries.map((country, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedCountry(country)}
                      className={`px-3 py-1.5 mt-0.5 cursor-pointer transition-colors
                        ${selectedCountry.name === country.name 
                          ? 'bg-[#241B17]/50 border-l-2 border-[#E05320]' 
                          : 'hover:bg-white/5'
                        }`}
                    >
                      <div className={`text-[10px] sm:text-[11px] ${selectedCountry.name === country.name ? 'font-semibold text-neutral-200' : 'text-neutral-300'}`}>
                        {country.name}
                      </div>
                      <div className="text-[8px] sm:text-[9px] text-neutral-500">
                        {country.region}({country.code})
                      </div>
                    </div>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="px-3 py-4 text-center text-[10px] text-neutral-500">
                      No countries found
                    </div>
                  )}
                </div>

                <div className="w-1 bg-black/20 my-1 mr-1 relative rounded-full self-stretch">
                  <div className="absolute top-0 right-0 w-full h-[28px] bg-[#E05320] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-[#E05320]">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
// import React, { useState } from 'react';

// export default function Futures() {
//   const amharicWeekdays = ['ሰ', 'ማ', 'ረ', 'ሐ', 'አ', 'ቅ', 'እ'];
  
//   // Calendar state
//   const [selectedDay, setSelectedDay] = useState(3);
//   const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); // 1..31

//   // Input states for Card 2
//   const [defaultInput, setDefaultInput] = useState('');
//   const [invalidInput, setInvalidInput] = useState('');
//   const [emailInput, setEmailInput] = useState('Hello@Kewti.com');

//   // Date picker state
//   const datePickerRowsInit = [
//     { day: '1', month: 'መስከረም', year: '2009', active: false },
//     { day: '2', month: 'ጥቅምት', year: '2010', active: false },
//     { day: '3', month: 'ህዳር', year: '2011', active: false },
//     { day: '4', month: 'ታህሳስ', year: '2012', active: true },
//     { day: '5', month: 'ጥር', year: '2013', active: false },
//     { day: '6', month: 'የካቲት', year: '2014', active: false },
//     { day: '7', month: 'መጋቢት', year: '2015', active: false },
//   ];
//   const [datePickerRows, setDatePickerRows] = useState(datePickerRowsInit);

//   // Location selector state
//   const countriesList = [
//     { name: 'Ethiopia', region: 'East Africa', code: 'et' },
//     { name: 'Argentina', region: 'South America', code: 'ar' },
//     { name: 'Australia', region: 'Oceania', code: 'au' },
//     { name: 'Canada', region: 'North America', code: 'ca' },
//     { name: 'China', region: 'Asia', code: 'cn' },
//     { name: 'Kenya', region: 'East Africa', code: 'ke' }
//   ];
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState(countriesList[0]);

//   const filteredCountries = countriesList.filter(country =>
//     country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     country.region.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle date picker row selection
//   const handleDateRowClick = (index) => {
//     const updatedRows = datePickerRows.map((row, i) => ({
//       ...row,
//       active: i === index
//     }));
//     setDatePickerRows(updatedRows);
//   };

//   return (
//     // Fixed strict outer layout envelope mimicking the full canvas screen space
//     <div className="w-full min-h-screen bg-[#0C0C0C] text-white p-6 flex items-center justify-center font-mono select-none">
      
//       {/* FORCE STRICT 2x2 GRID BY REMOVING RESPONSIVE BREAKPOINTS */}
//       <div className="grid grid-cols-2 grid-rows-2 gap-6 w-full max-w-[1200px] aspect-square">
        
//         {/* ================= CARD 1: ETHIOPIAN CALENDAR (TOP LEFT) ================= */}
//         <div className="bg-[#111111] border border-white/[0.02] rounded-none relative flex flex-col p-8 h-full">
//           <div className="absolute top-0 left-0 bg-[#1A1A1A] text-neutral-300 text-xs tracking-wider px-5 py-2.5 border-r border-b border-neutral-800/40">
//             Ethiopian Calender
//           </div>

//           <div className="flex-1 flex items-center justify-center mt-6">
//             <div className="w-[280px] bg-[#161616] rounded-xl p-4 border border-white/[0.01]">
//               <div className="flex justify-between items-start mb-2">
//                 <div>
//                   <div className="text-xl font-bold text-white tracking-tight">3</div>
//                   <div className="text-lg font-bold text-white mt-0.5">መስከረም</div>
//                 </div>
//                 <div className="text-lg font-bold text-white tracking-tight">2018</div>
//               </div>

//               <div className="w-full h-[2px] bg-neutral-800 rounded-full mb-3">
//                 <div className="h-full w-1/4 bg-[#E05320] rounded-full" />
//               </div>

//               <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-neutral-500 mb-2">
//                 {amharicWeekdays.map((d, i) => <div key={i}>{d}</div>)}
//               </div>

//               <div className="grid grid-cols-7 gap-y-1.5 text-center text-[11px] text-neutral-300 font-sans">
//                 {daysInMonth.map(day => (
//                   <div 
//                     key={day} 
//                     className="py-0.5 cursor-pointer hover:text-white transition-colors"
//                     onClick={() => setSelectedDay(day)}
//                   >
//                     {day === selectedDay ? (
//                       <span className="w-4 h-4 bg-[#E05320] text-white flex items-center justify-center rounded-[2px] font-bold text-[10px] mx-auto">
//                         {day}
//                       </span>
//                     ) : (
//                       <span>{day}</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="absolute bottom-4 right-4 text-[#E05320]">
//             <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
//             </svg>
//           </div>
//         </div>


//         {/* ================= CARD 2: KEWTI INPUT (TOP RIGHT) ================= */}
//         <div className="bg-[#111111] border border-white/[0.02] rounded-none relative flex flex-col p-8 h-full">
//           <div className="absolute top-0 left-0 bg-[#1A1A1A] text-neutral-300 text-xs tracking-wider px-5 py-2.5 border-r border-b border-neutral-800/40">
//             Kewti Input
//           </div>

//           <div className="flex-1 flex items-center justify-center mt-6">
//             <div className="w-[300px] flex flex-col gap-3 font-sans">
//               <input
//                 type="text"
//                 value={defaultInput}
//                 onChange={(e) => setDefaultInput(e.target.value)}
//                 placeholder="Default Input"
//                 className="w-full bg-[#161616] border border-neutral-800/80 rounded-lg h-10 flex items-center px-4 text-xs text-neutral-500 focus:outline-none focus:border-neutral-600"
//               />
//               <input
//                 type="text"
//                 value={invalidInput}
//                 onChange={(e) => setInvalidInput(e.target.value)}
//                 placeholder="Invalid Input"
//                 className="w-full bg-[#141414] border-2 border-[#E05320] rounded-xl h-11 flex items-center px-4 text-xs text-neutral-300 focus:outline-none"
//               />
//               <input
//                 type="text"
//                 value={emailInput}
//                 onChange={(e) => setEmailInput(e.target.value)}
//                 className="w-full bg-[#161616] border border-neutral-800/80 rounded-lg h-10 flex items-center px-4 text-[11px] font-mono text-neutral-500 focus:outline-none focus:border-neutral-600"
//               />
//             </div>
//           </div>

//           <div className="absolute bottom-4 right-4 text-[#E05320]">
//             <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
//             </svg>
//           </div>
//         </div>


//         {/* ================= CARD 3: ETHIOPIAN DATE PICKER (BOTTOM LEFT) ================= */}
//         <div className="bg-[#111111] border border-white/[0.02] rounded-none relative flex flex-col p-8 h-full">
//           <div className="absolute top-0 left-0 bg-[#1A1A1A] text-neutral-300 text-xs tracking-wider px-5 py-2.5 border-r border-b border-neutral-800/40">
//             Ethiopian Date picker
//           </div>

//           <div className="flex-1 flex items-center justify-center mt-6">
//             <div className="w-[300px] bg-[#161616] rounded-2xl p-3 flex flex-col gap-0.5 border border-white/[0.01]">
//               {datePickerRows.map((row, idx) => (
//                 <div 
//                   key={idx} 
//                   onClick={() => handleDateRowClick(idx)}
//                   className={`grid grid-cols-3 text-center py-2 px-3 rounded-xl items-center text-[13px] cursor-pointer transition-colors
//                     ${row.active 
//                       ? 'bg-[#241B17] text-white font-bold border border-[#E05320]/20' 
//                       : 'text-neutral-500 font-medium hover:bg-white/5'
//                     }`}
//                 >
//                   <span className="text-left pl-2 font-mono">{row.day}</span>
//                   <span className="text-center font-serif">{row.month}</span>
//                   <span className="text-right pr-2 font-mono">{row.year}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="absolute bottom-4 right-4 text-[#E05320]">
//             <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
//             </svg>
//           </div>
//         </div>


//         {/* ================= CARD 4: KEWTI LOCATION SELECTOR (BOTTOM RIGHT) ================= */}
//         <div className="bg-[#111111] border border-white/[0.02] rounded-none relative flex flex-col p-8 h-full">
//           <div className="absolute top-0 left-0 bg-[#1A1A1A] text-neutral-300 text-xs tracking-wider px-5 py-2.5 border-r border-b border-neutral-800/40">
//             Kewti Location Selector
//           </div>

//           <div className="flex-1 flex items-center justify-center mt-6">
//             <div className="w-[280px] bg-[#141414] rounded-xl border border-neutral-800/60 overflow-hidden flex flex-col font-sans">
//               <div className="p-2.5 border-b border-neutral-900/80 flex items-center justify-between px-3 bg-black/10">
//                 <div className="flex items-center gap-2 flex-1">
//                   <div className="w-3 h-3 rounded-full border-2 border-neutral-500 flex items-center justify-center relative">
//                     <div className="w-1 h-[2px] bg-neutral-500 absolute -bottom-0.5 -right-0.5 rotate-45" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search Countries....."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="bg-transparent text-[10px] text-neutral-500 flex-1 focus:outline-none placeholder:text-neutral-500"
//                   />
//                 </div>
//                 <div className="w-2 h-2 border-b-2 border-r-2 border-neutral-500 transform rotate-45 -translate-y-0.5" />
//               </div>

//               <div className="flex p-1 relative">
//                 <div className="flex-1 flex flex-col text-left">
//                   {filteredCountries.map((country, idx) => (
//                     <div 
//                       key={idx}
//                       onClick={() => setSelectedCountry(country)}
//                       className={`px-3 py-1.5 mt-0.5 cursor-pointer transition-colors
//                         ${selectedCountry.name === country.name 
//                           ? 'bg-[#241B17]/50 border-l-2 border-[#E05320]' 
//                           : 'hover:bg-white/5'
//                         }`}
//                     >
//                       <div className={`text-[11px] ${selectedCountry.name === country.name ? 'font-semibold text-neutral-200' : 'text-neutral-300'}`}>
//                         {country.name}
//                       </div>
//                       <div className="text-[9px] text-neutral-500">
//                         {country.region}({country.code})
//                       </div>
//                     </div>
//                   ))}
//                   {filteredCountries.length === 0 && (
//                     <div className="px-3 py-4 text-center text-[10px] text-neutral-500">
//                       No countries found
//                     </div>
//                   )}
//                 </div>

//                 <div className="w-1 bg-black/20 my-1 mr-1 relative rounded-full self-stretch">
//                   <div className="absolute top-0 right-0 w-full h-[28px] bg-[#E05320] rounded-full" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="absolute bottom-4 right-4 text-[#E05320]">
//             <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
//             </svg>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }