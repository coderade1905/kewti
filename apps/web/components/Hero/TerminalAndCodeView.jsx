"use client"

import React, { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

const codeSnippet = `import { KewtiInput } from "@/kewti/ui"

export default function App() {
  return (
    <KewtiInput 
      className="w-full" 
      variant="input" 
      placeholder="Type in Amharic or English" 
      value={text}
      showVoiceInput={true}
      onChange={(e) => setText(e.target.value)}
    />
}`;

export function CodeBlock({ code, language = 'tsx' }) {
  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} p-4 rounded-xl overflow-x-auto text-sm font-mono`} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

export default function TerminalAndCodeView() {
  const [command, setCommand] = useState('');
  const [commandOutput, setCommandOutput] = useState([]);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState(['button', 'card', 'input']);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      setCommandOutput(prev => [...prev, { cmd: command, result: `Command '${command}' executed (demo)` }]);
      setCommand('');
    }
  };

  const toggleComponent = (component) => {
    setSelectedComponents(prev =>
      prev.includes(component)
        ? prev.filter(c => c !== component)
        : [...prev, component]
    );
  };

  const variants = ['glow', 'default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] relative overflow-hidden flex flex-col items-center justify-start py-12 sm:py-16 px-4 sm:px-6 font-sans select-none">

      {/* Responsive background glow */}
      <div
        className="absolute w-[400px] h-[300px] sm:w-[600px] sm:h-[450px] lg:w-[800px] lg:h-[600px] rounded-full pointer-events-none opacity-20 blur-[80px] sm:blur-[100px] lg:blur-[140px] mix-blend-screen"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #E05320 0%, #241B17 60%, transparent 100%)',
        }}
      />

      {/* Left Pattern – responsive size */}
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
      <style dangerouslySetInnerHTML={{
        __html: `
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

      {/* Right Pattern – responsive size */}
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

      {/* Main content card – responsive padding and width */}
      <div className="relative z-10 w-full max-w-[660px] bg-[#111111]/90 border border-white/[0.03] backdrop-blur-md rounded-2xl p-4 sm:p-7 flex flex-col gap-6 shadow-2xl">

        {/* Terminal block – responsive text size */}
        <div className="w-full bg-[#141414] rounded-xl p-4 sm:p-6 font-mono text-[12px] sm:text-[14px] leading-relaxed relative border border-white/[0.01]">

          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-[#A855F7] font-semibold">$ npx</span>
            <span className="text-neutral-200">kewti add component input</span>
          </div>

          <div className="flex flex-col gap-1 mt-3 pl-1 text-neutral-300 text-[11px] sm:text-[13px]">
            <div className="flex items-center gap-3">
              <span className="text-neutral-400 text-xs">✓</span>
              <span>Installing dependencies</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-neutral-400 text-xs">✓</span>
              <span>Instaling Input Component</span>
            </div>
          </div>

          <div className="text-white font-medium mt-2 pl-1">Success!</div>

          <button
            className="absolute -bottom-3 right-4 sm:right-6 bg-[#181818] border border-neutral-800/80 rounded-xl px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-3 shadow-xl cursor-pointer hover:bg-[#202020] transition-colors"
          >
            <span className="text-xs sm:text-sm font-sans font-medium text-white tracking-wide whitespace-nowrap">
              Ready to build
            </span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#E05320]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4.5 1.5 5.5L9 12l2.5 2.5-5.5 5.5c1 0.5 3 1.5 5.5 1.5 5.5 0 10-4.5 10-10C21.5 5.5 18.5 2 12 2z" />
            </svg>
          </button>
        </div>

        {/* Code editor block – responsive text and layout */}
        <CodeBlock code={codeSnippet} />
      </div>
    </div>
  );
}