export default function ViewToggle({ viewMode, setViewMode }) {
  const base = 'p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center'
  const active = 'bg-primary-container text-on-primary-container'
  const inactive = 'bg-surface border border-border-light text-text-muted hover:bg-surface-container-low'

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setViewMode('grid')}
        aria-label="Grid view"
        aria-pressed={viewMode === 'grid'}
        className={`${base} ${viewMode === 'grid' ? active : inactive}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>grid_view</span>
      </button>
      <button
        type="button"
        onClick={() => setViewMode('list')}
        aria-label="List view"
        aria-pressed={viewMode === 'list'}
        className={`${base} ${viewMode === 'list' ? active : inactive}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>view_list</span>
      </button>
    </div>
  )
}
