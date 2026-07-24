import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../i18n/context'

const methods = [
  { id: 'qris', label: 'QRIS', icon: 'qr_code', desc: 'Scan QRIS via DANA, GoPay, OVO, dll' },
  { id: 'dana', label: 'DANA', icon: 'account_balance_wallet', desc: 'Dompet digital DANA' },
  { id: 'gopay', label: 'GoPay', icon: 'account_balance_wallet', desc: 'Dompet digital GoPay' },
  { id: 'shopeepay', label: 'ShopeePay', icon: 'account_balance_wallet', desc: 'Dompet digital ShopeePay' },
  { id: 'ovo', label: 'OVO', icon: 'account_balance_wallet', desc: 'Dompet digital OVO' },
  { id: 'linkaja', label: 'LinkAja', icon: 'account_balance_wallet', desc: 'Dompet digital LinkAja' },
  { id: 'bca', label: 'BCA', icon: 'account_balance', desc: 'Transfer Bank BCA' },
  { id: 'mandiri', label: 'Mandiri', icon: 'account_balance', desc: 'Transfer Bank Mandiri' },
  { id: 'bni', label: 'BNI', icon: 'account_balance', desc: 'Transfer Bank BNI' },
  { id: 'bri', label: 'BRI', icon: 'account_balance', desc: 'Transfer Bank BRI' },
  { id: 'alfamart', label: 'Alfamart', icon: 'store', desc: 'Bayar di gerai Alfamart terdekat' },
  { id: 'indomaret', label: 'Indomaret', icon: 'store', desc: 'Bayar di gerai Indomaret terdekat' },
]

const appUrls = {
  dana: 'https://dana.id',
  gopay: 'https://gopay.co.id',
  shopeepay: 'https://shopee.co.id',
  ovo: 'https://ovo.id',
  linkaja: 'https://linkaja.id',
}

function generateQRPattern(seed) {
  const pattern = []
  for (let i = 0; i < 25; i++) {
    const row = []
    for (let j = 0; j < 25; j++) {
      const val = ((i * 31 + j * 17 + seed) * 13) % 100
      row.push(val > 45)
    }
    pattern.push(row)
  }
  return pattern
}

export default function PaymentModal({ open, onClose, total, onSuccess }) {
  const { t } = useLanguage()
  const [step, setStep] = useState('select')
  const [selected, setSelected] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const method = methods.find(m => m.id === selected)
  const qrSeed = total.length * 100 + total.charCodeAt(total.length - 1) || 42

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={() => { setStep('select'); setSelected(null); onClose() }} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
          {step === 'select' && (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
                <h2 className="text-sm font-semibold text-text-main">{t('payment.title')}</h2>
                <button onClick={() => { setSelected(null); onClose() }} className="p-1 hover:bg-surface-container-low rounded transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 20 }}>close</span>
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <div className="px-6 pb-2 pt-4">
                  <p className="text-lg font-bold text-text-main mb-3">{t('payment.total')}: {total}</p>
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">{t('payment.eWallet')}</p>
                </div>
                <div className="px-6 pb-6 space-y-2">
                  {methods.filter(m => m.icon === 'qr_code' || m.icon === 'account_balance_wallet').map(m => (
                    <button key={m.id} onClick={() => { setSelected(m.id); setStep('pay') }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer border-border-light hover:border-primary hover:bg-surface-container-low`}>
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>{m.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-text-main">{m.label}</p>
                        <p className="text-[11px] text-text-muted">{m.desc}</p>
                      </div>
                      <span className="material-symbols-outlined text-text-muted ml-auto" style={{ fontSize: 18 }}>chevron_right</span>
                    </button>
                  ))}
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 mt-4">{t('payment.bankTransfer')}</p>
                  {methods.filter(m => m.icon === 'account_balance').map(m => (
                    <button key={m.id} onClick={() => { setSelected(m.id); setStep('pay') }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer border-border-light hover:border-primary hover:bg-surface-container-low`}>
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>{m.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-text-main">{m.label}</p>
                        <p className="text-[11px] text-text-muted">{m.desc}</p>
                      </div>
                      <span className="material-symbols-outlined text-text-muted ml-auto" style={{ fontSize: 18 }}>chevron_right</span>
                    </button>
                  ))}
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 mt-4">{t('payment.convenienceStore')}</p>
                  {methods.filter(m => m.icon === 'store').map(m => (
                    <button key={m.id} onClick={() => { setSelected(m.id); setStep('pay') }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer border-border-light hover:border-primary hover:bg-surface-container-low`}>
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>{m.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-text-main">{m.label}</p>
                        <p className="text-[11px] text-text-muted">{m.desc}</p>
                      </div>
                      <span className="material-symbols-outlined text-text-muted ml-auto" style={{ fontSize: 18 }}>chevron_right</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'pay' && method && (
            <>
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border-light">
                <button onClick={() => setStep('select')} className="p-1 hover:bg-surface-container-low rounded transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 20 }}>arrow_back</span>
                </button>
                <h2 className="text-sm font-semibold text-text-main">{method.label}</h2>
              </div>
              <div className="overflow-y-auto flex-1 p-6">
                {method.id === 'qris' && (
                  <QRISView total={total} seed={qrSeed} onSuccess={() => { setStep('success'); setTimeout(() => { onSuccess() }, 1500) }} canvasRef={canvasRef} />
                )}
                {['dana', 'gopay', 'shopeepay', 'ovo', 'linkaja'].includes(method.id) && (
                  <EwalletView method={method} total={total} onSuccess={() => { setStep('success'); setTimeout(() => { onSuccess() }, 1500) }} />
                )}
                {['bca', 'mandiri', 'bni', 'bri'].includes(method.id) && (
                  <BankView method={method} total={total} onSuccess={() => { setStep('success'); setTimeout(() => { onSuccess() }, 1500) }} />
                )}
                {['alfamart', 'indomaret'].includes(method.id) && (
                  <StoreView method={method} total={total} onSuccess={() => { setStep('success'); setTimeout(() => { onSuccess() }, 1500) }} />
                )}
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="p-10 text-center">
              <span className="material-symbols-outlined text-green-500 text-6xl mb-4 block">check_circle</span>
              <h2 className="text-lg font-bold text-text-main mb-2">{t('payment.success')}</h2>
              <p className="text-xs text-text-muted">{t('payment.successMsg')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function QRISView({ total, seed, onSuccess, canvasRef }) {
  const { t } = useLanguage()
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = 240
    const block = size / 25
    canvas.width = size
    canvas.height = size

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    const pattern = generateQRPattern(seed)
    ctx.fillStyle = '#000000'
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if (pattern[i][j]) {
          ctx.fillRect(j * block, i * block, block, block)
        }
      }
    }

    ctx.fillStyle = '#000000'
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          ctx.fillRect(c * block, r * block, block, block)
        }
      }
    }
    const offset = 25 - 7
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          ctx.fillRect((c + offset) * block, r * block, block, block)
        }
      }
    }
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          ctx.fillRect(c * block, (r + offset) * block, block, block)
        }
      }
    }
  }, [seed, canvasRef])

  const downloadQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qris-payment.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="text-center">
      <p className="text-xs text-text-muted mb-4">{t('payment.qrisDetail')}</p>
      <div className="inline-flex items-center justify-center w-60 h-60 bg-white rounded-2xl border-2 border-dashed border-border-light mb-4">
        <canvas ref={canvasRef} className="w-56 h-56" />
      </div>
      <p className="text-xs font-semibold text-text-main mb-1">{t('payment.paymentTotal')}</p>
      <p className="text-xl font-bold text-text-main mb-5">{total}</p>
      <div className="flex gap-3">
        <button onClick={downloadQR}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary py-3 rounded-lg text-xs font-semibold hover:bg-primary hover:text-surface transition-all cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
          {t('payment.downloadQR')}
        </button>
        <button onClick={onSuccess}
          className="flex-1 bg-primary text-surface py-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
          {t('payment.paid')}
        </button>
      </div>
    </div>
  )
}

function EwalletView({ method, total, onSuccess }) {
  const { t } = useLanguage()
  const appUrl = appUrls[method.id]
  return (
    <div className="text-center">
      <span className="material-symbols-outlined text-primary text-6xl mb-4 block">account_balance_wallet</span>
      <p className="text-xs text-text-muted mb-2">{t('payment.payVia')} {method.label}</p>
      <p className="text-xs font-semibold text-text-main mb-1">{t('payment.paymentTotal')}</p>
      <p className="text-xl font-bold text-text-main mb-6">{total}</p>
      <a href={appUrl} target="_blank" rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-primary text-surface py-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity mb-3 cursor-pointer">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
        {t('payment.open')} {method.label}
      </a>
      <button onClick={onSuccess}
        className="w-full border-2 border-primary text-primary py-3 rounded-lg text-xs font-semibold hover:bg-primary hover:text-surface transition-all cursor-pointer">
        {t('payment.confirmPayment')}
      </button>
    </div>
  )
}

function BankView({ method, total, onSuccess }) {
  const { t } = useLanguage()
  return (
    <div className="text-center">
      <span className="material-symbols-outlined text-primary text-6xl mb-4 block">account_balance</span>
      <p className="text-xs text-text-muted mb-2">{t('payment.transferTo')}</p>
      <div className="bg-surface-container-low rounded-xl p-5 mb-6 text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-xs text-text-muted">{t('payment.bank')}</span>
          <span className="text-xs font-semibold text-text-main">{method.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-text-muted">{t('payment.accountNo')}</span>
          <span className="text-xs font-semibold text-text-main">
            {method.id === 'bca' ? '1234567890' : method.id === 'mandiri' ? '0987654321' : method.id === 'bni' ? '1122334455' : '5544332211'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-text-muted">{t('payment.accountName')}</span>
          <span className="text-xs font-semibold text-text-main">{t('payment.companyName')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-text-muted">{t('payment.total')}</span>
          <span className="text-xs font-bold text-text-main">{total}</span>
        </div>
      </div>
      <button onClick={onSuccess}
        className="w-full bg-primary text-surface py-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
        {t('payment.confirmPayment')}
      </button>
    </div>
  )
}

function StoreView({ method, total, onSuccess }) {
  const { t } = useLanguage()
  const barcodeRef = useRef(null)

  useEffect(() => {
    const canvas = barcodeRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = 280, h = 80
    canvas.width = w
    canvas.height = h

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    const code = method.id === 'alfamart' ? '8991234567890' : '8990987654321'
    ctx.fillStyle = '#000000'
    for (let i = 0; i < code.length * 4; i++) {
      if (i % 3 !== 0) {
        ctx.fillRect(i * 6 + 8, 10, 4, h - 20)
      }
    }
    ctx.fillStyle = '#000000'
    ctx.font = '12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(code, w / 2, h - 6)
  }, [barcodeRef, method.id])

  const downloadBarcode = () => {
    const canvas = barcodeRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${method.id}-barcode.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="text-center">
      <span className="material-symbols-outlined text-primary text-6xl mb-4 block">store</span>
      <p className="text-xs text-text-muted mb-4">{t('payment.showBarcode')} {method.label}</p>
      <div className="inline-flex items-center justify-center bg-white rounded-2xl border-2 border-dashed border-border-light p-4 mb-4">
        <canvas ref={barcodeRef} className="w-[280px] h-20" />
      </div>
      <p className="text-xs font-semibold text-text-main mb-1">{t('payment.paymentTotal')}</p>
      <p className="text-xl font-bold text-text-main mb-5">{total}</p>
      <div className="flex gap-3">
        <button onClick={downloadBarcode}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary py-3 rounded-lg text-xs font-semibold hover:bg-primary hover:text-surface transition-all cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
          {t('payment.downloadBarcode')}
        </button>
        <button onClick={onSuccess}
          className="flex-1 bg-primary text-surface py-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer">
          {t('payment.paid')}
        </button>
      </div>
    </div>
  )
}
