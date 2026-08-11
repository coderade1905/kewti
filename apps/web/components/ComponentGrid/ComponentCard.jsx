export default function ComponentCard({ title, children }) {
  return (
    <div className="bg-kewti-surface border border-neutral-800 rounded-xl p-6 flex flex-col gap-4">
      <h3 className="text-neutral-400 font-mono text-sm">{title}</h3>
      <div className="flex-grow">
        {children}
      </div>
      <div className="mt-4 border-t border-neutral-800 pt-4 flex justify-end">
        <a href="#" className="text-kewti-orange text-sm flex items-center gap-1 hover:underline">
          More to Explore ↗
        </a>
      </div>
    </div>
  );
}