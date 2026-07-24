import { useState } from 'react'
import { useLanguage } from '../i18n/context'

const STEPS = [
  { num: 1, label: 'Account', icon: 'person' },
  { num: 2, label: 'Store', icon: 'store' },
  { num: 3, label: 'Verification', icon: 'verified' },
  { num: 4, label: 'Done', icon: 'check_circle' },
]

const CATEGORIES = [
  { value: 'templates', label: 'AI Template', desc: 'Ready-made prompts & AI workflows' },
  { value: 'integrations', label: 'Integration', desc: 'API connectors & plugins' },
  { value: 'chatbots', label: 'Chatbot', desc: 'AI assistants & conversational agents' },
  { value: 'automation', label: 'Automation', desc: 'Task automation & pipelines' },
  { value: 'aitools', label: 'AI Tools', desc: 'AI-powered tools & utilities' },
]

export default function SellerForm({ onSuccess }) {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const catKeys = { templates:'Templates', integrations:'Integrations', chatbots:'Chatbots', automation:'Automation', aitools:'AiTools' }
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    storeName: '',
    storeDescription: '',
    category: '',
    identityType: 'ktp',
    identityNumber: '',
    bankName: '',
    bankAccount: '',
    bankHolder: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const validateStep = () => {
    const err = {}
    if (step === 1) {
      if (!form.fullName.trim()) err.fullName = 'Full name is required'
      if (!form.email.trim()) err.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Invalid email format'
      if (!form.phone.trim()) err.phone = 'Phone number is required'
    }
    if (step === 2) {
      if (!form.storeName.trim()) err.storeName = 'Store name is required'
      if (!form.storeDescription.trim()) err.storeDescription = 'Store description is required'
      if (!form.category) err.category = 'Select a product category'
    }
    if (step === 3) {
      if (!form.identityNumber.trim()) err.identityNumber = 'Identity number is required'
      if (!form.bankName.trim()) err.bankName = 'Bank name is required'
      if (!form.bankAccount.trim()) err.bankAccount = 'Account number is required'
      if (!form.bankHolder.trim()) err.bankHolder = 'Account holder name is required'
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const next = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, 4))
  }

  const prev = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setStep(4)
      if (onSuccess) onSuccess(form)
    }, 1500)
  }

  const inputClass = (field) => `
    w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors
    ${errors[field] ? 'border-red-400 bg-red-50' : 'border-border-light bg-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container/30'}
    text-text-main placeholder:text-text-muted/60
  `

  const labelClass = 'block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide'

  return (
    <div className="w-full">

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${step > s.num ? 'bg-primary-container text-on-primary-container' : ''}
                ${step === s.num ? 'bg-primary text-on-primary' : ''}
                ${step < s.num ? 'bg-surface-container-high text-text-muted/50' : ''}
              `}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{s.icon}</span>
              </div>
              <span className={`
                text-[11px] font-semibold mt-1.5 transition-colors
                ${step >= s.num ? 'text-primary' : 'text-text-muted/50'}
              `}>{t('seller.steps.' + i + '.label')}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 mt-[-1.25rem] rounded transition-colors ${step > s.num ? 'bg-primary-container' : 'bg-surface-container-high'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Account */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>{t('seller.fullName')}</label>
            <input type="text" className={inputClass('fullName')} placeholder={t('seller.fullNamePlaceholder')} value={form.fullName} onChange={e => update('fullName', e.target.value)} />
            {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className={labelClass}>{t('seller.email')}</label>
            <input type="email" className={inputClass('email')} placeholder={t('seller.emailPlaceholder')} value={form.email} onChange={e => update('email', e.target.value)} />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass}>{t('seller.phone')}</label>
            <input type="tel" className={inputClass('phone')} placeholder={t('seller.phonePlaceholder')} value={form.phone} onChange={e => update('phone', e.target.value)} />
            {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
      )}

      {/* Step 2: Store */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>{t('seller.storeName')}</label>
            <input type="text" className={inputClass('storeName')} placeholder={t('seller.storeNamePlaceholder')} value={form.storeName} onChange={e => update('storeName', e.target.value)} />
            {errors.storeName && <p className="text-[11px] text-red-500 mt-1">{errors.storeName}</p>}
          </div>
          <div>
            <label className={labelClass}>{t('seller.storeDesc')}</label>
            <textarea className={`${inputClass('storeDescription')} min-h-[100px] resize-y`} placeholder={t('seller.storeDescPlaceholder')} value={form.storeDescription} onChange={e => update('storeDescription', e.target.value)} />
            {errors.storeDescription && <p className="text-[11px] text-red-500 mt-1">{errors.storeDescription}</p>}
          </div>
          <div>
            <label className={labelClass}>{t('seller.category')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button key={cat.value} type="button" onClick={() => update('category', cat.value)} className={`
                  text-left p-4 rounded-lg border transition-all
                  ${form.category === cat.value ? 'border-primary-container bg-primary-container/10 ring-1 ring-primary-container/30' : 'border-border-light bg-surface hover:border-primary-container/50'}
                `}>
                  <p className="text-sm font-semibold text-text-main">{t('seller.cat' + catKeys[cat.value])}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{t('seller.cat' + catKeys[cat.value] + 'Desc')}</p>
                </button>
              ))}
            </div>
            {errors.category && <p className="text-[11px] text-red-500 mt-1">{errors.category}</p>}
          </div>
        </div>
      )}

      {/* Step 3: Verification */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>{t('seller.identityType')}</label>
            <select className={inputClass()} value={form.identityType} onChange={e => update('identityType', e.target.value)}>
              <option value="ktp">KTP</option>
              <option value="sim">SIM</option>
              <option value="passport">Passport</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('seller.identityNumber')}</label>
            <input type="text" className={inputClass('identityNumber')} placeholder={t('seller.identityPlaceholder')} value={form.identityNumber} onChange={e => update('identityNumber', e.target.value)} />
            {errors.identityNumber && <p className="text-[11px] text-red-500 mt-1">{errors.identityNumber}</p>}
          </div>
          <hr className="border-border-light" />
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{t('seller.paymentAccount')}</p>
          <div>
            <label className={labelClass}>{t('seller.bankName')}</label>
            <input type="text" className={inputClass('bankName')} placeholder={t('seller.bankNamePlaceholder')} value={form.bankName} onChange={e => update('bankName', e.target.value)} />
            {errors.bankName && <p className="text-[11px] text-red-500 mt-1">{errors.bankName}</p>}
          </div>
          <div>
            <label className={labelClass}>{t('seller.accountNumber')}</label>
            <input type="text" className={inputClass('bankAccount')} placeholder={t('seller.accountPlaceholder')} value={form.bankAccount} onChange={e => update('bankAccount', e.target.value)} />
            {errors.bankAccount && <p className="text-[11px] text-red-500 mt-1">{errors.bankAccount}</p>}
          </div>
          <div>
            <label className={labelClass}>{t('seller.accountHolder')}</label>
            <input type="text" className={inputClass('bankHolder')} placeholder={t('seller.accountHolderPlaceholder')} value={form.bankHolder} onChange={e => update('bankHolder', e.target.value)} />
            {errors.bankHolder && <p className="text-[11px] text-red-500 mt-1">{errors.bankHolder}</p>}
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-primary-container/20 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 40 }}>check_circle</span>
          </div>
          <h3 className="text-[24px] font-bold text-text-main mb-2">{t('seller.registrationSuccess')}</h3>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            {t('seller.successMsg')} <strong className="text-text-main">{form.email}</strong> {t('seller.within')}
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-5 py-3 bg-surface-container-low rounded-lg border border-border-light">
            <span className="material-symbols-outlined text-primary-container" style={{ fontSize: 20 }}>info</span>
            <span className="text-xs text-text-muted">{t('seller.status')}: <strong className="text-primary">{t('seller.pendingVerification')}</strong></span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {step < 4 && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border-light">
          <button onClick={prev} disabled={step === 1} className={`
            px-6 py-3 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2
            ${step === 1 ? 'text-text-muted/40 cursor-not-allowed' : 'text-text-muted hover:bg-surface-container-high'}
          `}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            {t('seller.previous')}
          </button>
          {step < 3 ? (
            <button onClick={next} className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
              {t('seller.next')}
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-60">
              {submitting ? (
                <>{t('seller.sending')}</>
              ) : (
                <>
                  {t('seller.registerNow')}
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
