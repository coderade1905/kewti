export default function ComponentGrid({ children }) {
  return (
    <section className="py-16 bg-kewti-dark">
      <div className="max-w-6xl mx-auto px-4">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </div>
      </div>
    </section>
  );
}