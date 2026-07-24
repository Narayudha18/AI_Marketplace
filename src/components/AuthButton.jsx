import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useLanguage } from '../i18n/context'

export default function AuthButton() {
  const { t } = useLanguage()
  const { currentUser, logout } = useAuth()
  const [open, setOpen] = useState(false)

  if (!currentUser) {
    return (
      <Link to="/login"
        className="text-surface text-xs font-semibold border border-white/20 px-3.5 py-1.5 rounded-md hover:bg-surface hover:text-text-main transition-all">
        {t('nav.signIn')}
      </Link>
    )
  }

  return (
    <div className="relative flex items-center gap-0">
      <Link to="/profile"
        className="flex items-center gap-2 bg-primary-container/15 text-primary-container text-xs font-semibold pl-3 pr-2 py-1.5 rounded-l-md hover:bg-primary-container/25 transition-colors">
        <span className="w-5 h-5 rounded-full bg-primary-container text-surface text-[10px] font-bold flex items-center justify-center overflow-hidden">
          {currentUser.picture
            ? <img src={currentUser.picture} alt="" className="w-full h-full object-cover" />
            : currentUser.name[0]}
        </span>
        {currentUser.name.split(' ')[0]}
      </Link>
      <button onClick={() => setOpen(!open)}
        className="bg-primary-container/15 text-primary-container text-xs px-1 py-1.5 rounded-r-md hover:bg-primary-container/25 transition-colors">
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_drop_down</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-border-light rounded-lg shadow-lg z-20 py-1">
            <button onClick={() => { logout(); setOpen(false) }}
              className="w-full text-left text-xs text-text-muted hover:text-red-500 px-3 py-2 hover:bg-surface-container-low transition-colors">{t('nav.signOut')}</button>
          </div>
        </>
      )}
    </div>
  )
}
