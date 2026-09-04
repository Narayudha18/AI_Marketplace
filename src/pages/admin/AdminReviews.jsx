export default function AdminReviews({ allReviews, deleteReview }) {
  return (
    <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">All Reviews</h2>
        <span className="text-[11px] text-text-muted/70">{allReviews.length} total</span>
      </div>
      {allReviews.length === 0 ? (
        <div className="py-12 text-center text-text-muted/70 text-xs">No reviews from users yet.</div>
      ) : (
        <div className="divide-y divide-gray-800">
          {allReviews.map((r, i) => (
            <div key={i} className="px-5 py-4 hover:bg-surface-container-low transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-text-main">{r.name}</span>
                    <span className="text-[10px] text-text-muted/70">{r.date}</span>
                    <span className="text-[10px] bg-surface-container text-text-muted px-1.5 py-0.5 rounded-full">{r._category}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={`material-symbols-outlined ${s <= (r.rating || 0) ? 'text-amber-400' : 'text-text-muted'}`} style={{ fontSize: 12 }}>star</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-1.5">{r.text}</p>
                </div>
                <button onClick={() => { if (window.confirm('Delete this review? This cannot be undone.')) deleteReview(r._key, { name: r.name, date: r.date, text: r.text }) }}
                  className="text-[10px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-md transition-colors flex-shrink-0 cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
