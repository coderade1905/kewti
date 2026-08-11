export default function Testimonials() {
  const users = ["Loremipsum", "Loremipsum", "Loremipsum"];

  return (
    <section className="py-20 bg-kewti-dark">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-white text-3xl font-bold font-mono">Who Uses Kewti ?</h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <div key={index} className="bg-kewti-surface border border-neutral-800 rounded-xl p-6 h-72 flex flex-col justify-between group hover:border-kewti-orange transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-neutral-400 text-sm">{user}</span>
                <span className="text-kewti-orange">↗</span>
              </div>
              
              {/* Placeholder for Profile Icon */}
              <div className="flex justify-center items-center opacity-20">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-4xl">😎</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}