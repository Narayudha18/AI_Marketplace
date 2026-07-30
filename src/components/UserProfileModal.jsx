export default function UserProfileModal({ user, productCount = 0, onClose }) {
  const memberSince = user.id
    ? new Date(Number.isFinite(user.id) ? user.id : Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown'

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface border border-border-light rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
          <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 18 }}>{user.isSeller ? 'storefront' : 'person'}</span>
              </div>
              <h2 className="text-sm font-bold text-on-surface">{user.isSeller ? 'Seller Profile' : 'User Profile'}</h2>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors cursor-pointer p-1">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 overflow-hidden ring-2 ring-blue-500/30">
                {user.picture ? (
                  <img src={user.picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-blue-400 flex items-center justify-center w-full h-full">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-on-surface">{user.name}</p>
                <p className="text-xs text-text-muted/70">{user.email}</p>
              </div>
              <div className="flex gap-1.5">
                {user.isAdmin && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">Admin</span>}
                {user.isSeller && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Seller</span>}
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 16 }}>badge</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted font-semibold">Full Name</p>
                  <p className="text-xs text-text-main font-medium truncate">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 16 }}>email</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted font-semibold">Email</p>
                  <p className="text-xs text-text-main font-medium truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 16 }}>article</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-text-muted font-semibold">Bio</p>
                  <p className="text-xs text-text-main font-medium">{user.bio || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: 16 }}>inventory_2</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted font-semibold">Products</p>
                    <p className="text-xs text-text-main font-bold">{productCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 16 }}>calendar_month</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted font-semibold">Member Since</p>
                    <p className="text-xs text-text-main font-bold">{memberSince}</p>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={onClose}
              className="w-full mt-6 text-xs font-bold text-text-muted bg-surface-container-low hover:bg-surface-container-high border border-border-light px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
