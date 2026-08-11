import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Kewti Components
      </h1>
      <p className="mt-4 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
        Ethiopian-first React component library. Native calendar conversions, Ge'ez typography, and phonetic Amharic transliteration.
      </p>
      <div className="mt-6 flex gap-4">
        <Link
          href="/docs"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Documentation
        </Link>
      </div>
    </main>
  );
}