import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function AuthButton() {
  const { currentUser, logout } = useAuth()
  const [open, setOpen] = useState(false)

  if (!currentUser) {
    return (
      <Link to="/login"
        className="text-surface text-xs font-semibold border border-white/20 px-3.5 py-1.5 rounded-md hover:bg-surface hover:text-text-main transition-all">
        Sign In
      </Link>
    )
  }

  return (
    <div className="relative flex items-center gap-0">
      <div className="flex bg-primary-container/15 rounded-md hover:bg-primary-container/25 transition-colors">
        <Link to="/profile"
          className="flex items-center gap-2 text-primary-container text-xs font-semibold pl-2.5 py-1.5">
          <span className="w-5 h-5 rounded-full bg-primary-container text-surface text-[10px] font-bold flex items-center justify-center overflow-hidden">
            {currentUser.picture
              ? <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
              : currentUser.name[0]}
          </span>
          {currentUser.name.split(' ')[0]}
        </Link>
        <button onClick={() => setOpen(!open)}
          className="text-primary-container px-1.5 py-1.5 flex items-center justify-center cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_drop_down</span>
        </button>
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border-light rounded-lg shadow-lg z-20 py-1">
            {currentUser.isAdmin && (
              <Link to="/admin/dashboard" onClick={() => setOpen(false)}
                className="block text-xs text-text-muted hover:text-text-main px-3 py-2 hover:bg-surface-container-low transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-xs" style={{ fontSize: 14 }}>admin_panel_settings</span> Admin Dashboard
              </Link>
            )}
            {currentUser.isSeller && (
              <Link to="/seller/dashboard" onClick={() => setOpen(false)}
                className="block text-xs text-text-muted hover:text-text-main px-3 py-2 hover:bg-surface-container-low transition-colors">Seller Dashboard</Link>
            )}
            <button onClick={() => { logout(); setOpen(false) }}
              className="w-full text-left text-xs text-text-muted hover:text-red-500 px-3 py-2 hover:bg-surface-container-low transition-colors">Sign Out</button>
          </div>
        </>
      )}
    </div>
  )
}
