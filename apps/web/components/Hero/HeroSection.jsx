import React from 'react';
import Button from '../Button/Button';
import Link from 'next/link';

export default function HeroSection() {
  const DOCS_PAGE = process.env.NEXT_PUBLIC_DOCS_PAGE || "localhost:3001";
  return (
    <div className="flex flex-col items-center gap-6 text-center pt-20">
      <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
        Build beautiful interfaces <span className="text-kewti-orange">faster</span>
      </h1>
      <p className="max-w-xl text-lg text-neutral-400 p-10">
        Production-ready React components crafted for modern apps. Copy, customize, and ship stunning UI in minutes.
      </p>
      <div className="flex gap-4">
        <Link target='_blank' rel="noopener noreferrer" href={`${DOCS_PAGE}/docs`}>
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
}