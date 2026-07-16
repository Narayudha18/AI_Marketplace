export default function Featured() {
  return (
    <section className="px-6 py-16 my-6 bg-surface-container-lowest border-y border-border-light">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 flex flex-col justify-center border border-border-light border-dashed rounded-xl p-8 bg-surface">
          <h2 className="text-[24px] font-semibold text-text-main mb-4">Featured AI Agents</h2>
          <p className="text-[15px] text-text-muted leading-relaxed mb-8">
            Every week, our team hand-picks the best new AI agents, tools, and automation workflows from our collection.
          </p>
          <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded text-xs font-semibold self-start hover:opacity-90 transition-opacity">
            View all featured items
          </button>
        </div>
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <img
            src="https://picsum.photos/seed/featured-ai/800/200"
            alt="Featured AI Agents"
            className="col-span-1 sm:col-span-2 h-48 object-cover rounded-xl border border-border-light"
          />
        </div>
      </div>
    </section>
  );
}
