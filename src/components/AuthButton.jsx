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
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors">
        <span className="w-5 h-5 rounded-full bg-primary text-surface text-[10px] font-bold flex items-center justify-center">{currentUser.name[0]}</span>
        {currentUser.name.split(' ')[0]}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border-light rounded-lg shadow-lg z-20 py-1">
            <button onClick={() => { logout(); setOpen(false) }}
              className="w-full text-left text-xs text-text-muted hover:text-red-500 px-3 py-2 hover:bg-surface-container-low transition-colors">Sign Out</button>
          </div>
        </>
      )}
    </div>
  )
}
