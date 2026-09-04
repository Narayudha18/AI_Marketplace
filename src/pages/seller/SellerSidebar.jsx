import { Link } from 'react-router-dom'

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'products', label: 'Products', icon: 'inventory_2' },
  { key: 'orders', label: 'Orders', icon: 'receipt_long' },
]

export default function SellerSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, accountOpen, setAccountOpen, currentUser, products, handleLogout }) {
  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed md:sticky top-0 left-0 z-30 h-screen w-60 bg-surface border-r border-border-light flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-border-light">
          <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: 16 }}>store</span>
          </div>
          <span className="text-sm font-bold text-on-surface">Seller Panel</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => (
            <button key={item.key} onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-2.5 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === item.key ? 'bg-emerald-500/10 text-emerald-400' : 'text-text-muted hover:text-text-main hover:bg-surface-container-low'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              {item.key === 'products' && products.length > 0 && (
                <span className="ml-auto bg-surface-container text-text-muted text-[9px] font-bold px-1.5 py-0.5 rounded-full">{products.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border-light">
          <div className="relative">
            <button onClick={() => setAccountOpen(!accountOpen)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center overflow-hidden flex-shrink-0">
                {currentUser.picture
                  ? <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
                  : currentUser.name[0].toUpperCase()}
              </span>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold text-text-main truncate">{currentUser.name}</p>
                <p className="text-[10px] text-text-muted/70 truncate">{currentUser.email}</p>
              </div>
              <span className="material-symbols-outlined text-text-muted/70" style={{ fontSize: 16 }}>more_vert</span>
            </button>

            {accountOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-surface-container border border-border-light rounded-xl shadow-2xl z-20 py-1.5">
                  <Link to="/" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 text-xs text-text-main/90 hover:text-on-surface hover:bg-surface-container-low px-3 py-2 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>storefront</span>
                    Back to Store
                  </Link>
                  {currentUser?.isSeller && (
                    <Link to={`/seller/${currentUser.id}`} onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 text-xs text-text-main/90 hover:text-on-surface hover:bg-surface-container-low px-3 py-2 transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>public</span>
                      View My Store
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-surface-container-low px-3 py-2 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>logout</span>
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
