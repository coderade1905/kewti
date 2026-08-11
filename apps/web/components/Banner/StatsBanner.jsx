import React, { Children } from "react";

export default function StatsBanner({ on = false, Children }) {
  const stats = [
    {
      value: "10+",
      label: "Components",
    },
    {
      value: "100%",
      label: "Open Source and Free",
    },
    {
      value: "Typscript",
      label: "Typscript Native",
    },
    {
      value: (
        <svg
          className="h-6 w-auto text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
        </svg>
      ),
      label: "Community Driven",
    },
  ];

  return (
    /* Outer container – responsive padding */
    <div className="w-full bg-neutral-900 py-2 sm:py-4">
      
      {/* Main banner strip – responsive padding */}
      <section className="relative w-full bg-kewti-center py-8 sm:py-12 overflow-hidden">
        
        {/* Top & Bottom Stripes – unchanged */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-kewti-stripes pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-kewti-stripes pointer-events-none" />

        {/* Stats container – wraps on mobile, no horizontal scroll */}
        {on && (
          <div className="mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-center md:flex-nowrap md:justify-between gap-6 relative z-10 bg-neutral-900 py-6 sm:py-10 w-full">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-center text-center flex-1 min-w-[120px] sm:min-w-[140px]">
                <div className="h-8 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 whitespace-nowrap">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {/* Children – responsive (passed as prop) */}
        <div className="px-4 sm:px-6 md:px-8">
          {Children}
        </div>
      </section>
    </div>
  );
}
// import { Children } from "react";

// export default function StatsBanner({on = false, Children }) {
//   const stats = [
//     {
//       value: "10+",
//       label: "Components",
//     },
//     {
//       value: "100%",
//       label: "Open Source and Free",
//     },
//     {
//       value: "Typscript",
//       label: "Typscript Native",
//     },
//     {
//       value: (
//         <svg
//           className="h-6 w-auto text-white"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
//         </svg>
//       ),
//       label: "Community Driven",
//     },
//   ];

//   return (
//     /* Outer container using your dark background color */
//     <div className="w-full bg-neutral-900 py-4">
      
//       {/* Main banner strip using your center background color */}
//       <section className="relative w-full bg-kewti-center py-12 overflow-hidden">
        
//         {/* Top Stripe Accent */}
//         <div className="absolute top-0 left-0 right-0 h-3 bg-kewti-stripes pointer-events-none" />
        
//         {/* Bottom Stripe Accent */}
//         <div className="absolute bottom-0 left-0 right-0 h-3 bg-kewti-stripes pointer-events-none" />

//         {/* Strict linear layout container */}
//         { on && <div className=" mx-auto px-8 flex flex-row items-center justify-between gap-6 overflow-x-auto md:overflow-x-visible relative z-10 no-scrollbar bg-neutral-900  py-10 w-full">
//           {stats.map((stat, index) => (
//             <div key={index} className="flex flex-col items-center justify-center text-center flex-1 min-w-[140px]">
//               <div className="h-8 flex items-center justify-center text-xl sm:text-2xl font-bold text-white tracking-tight">
//                 {stat.value}
//               </div>
//               <p className="mt-2 text-xs sm:text-sm text-neutral-400 whitespace-nowrap">
//                 {stat.label}
//               </p>
//             </div>
//           ))}
//         </div>}
//         {Children}
//       </section>
      
//     </div>
//   );
// }