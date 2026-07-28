import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

export default function AvatarCropModal({ image, onCancel, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const createCroppedImage = async () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = image
    await new Promise((resolve) => { img.onload = resolve })

    const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height)
    canvas.width = 256
    canvas.height = 256

    ctx.beginPath()
    ctx.arc(128, 128, 128, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(
      img,
      croppedAreaPixels.x, croppedAreaPixels.y,
      size, size,
      0, 0, 256, 256
    )

    canvas.toBlob((blob) => {
      const reader = new FileReader()
      reader.onload = () => onSave(reader.result)
      reader.readAsDataURL(blob)
    }, 'image/jpeg', 0.9)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-surface rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-main">Crop Avatar</h3>
          <button onClick={onCancel} className="text-text-muted hover:text-text-main cursor-pointer">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="relative w-full" style={{ height: 320 }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-text-muted text-base">zoom_out</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary h-1 cursor-pointer"
          />
          <span className="material-symbols-outlined text-text-muted text-base">zoom_in</span>
        </div>

        <div className="px-5 py-4 border-t border-border-light flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2 text-xs font-bold text-text-muted hover:text-text-main rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">Cancel</button>
          <button onClick={createCroppedImage} className="px-5 py-2 text-xs font-bold text-surface bg-primary rounded-lg hover:opacity-90 transition-opacity cursor-pointer">Save</button>
        </div>
      </div>
    </div>
  )
}
