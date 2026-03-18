import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const Studio = () => {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const containerRef = useRef(null)
  
  const [watermark, setWatermark] = useState({
    opacity: 0.9,
    size: 120,
    x: 85,
    y: 85,
    text: 'CORTISOL'
  })
  const [isDraggingWatermark, setIsDraggingWatermark] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)

  const assets = [
    { id: 'none', name: 'None', icon: '○' },
    { id: 'gauge', name: 'Gauge', icon: '◠' },
    { id: 'frame', name: 'Frame', icon: '□' },
    { id: 'corner', name: 'Corner', icon: 'L' },
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) loadFile(file)
  }

  const loadFile = (file) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      loadFile(file)
    }
  }

  const handleImageUrl = () => {
    if (imageUrl) {
      setImage(imageUrl)
    }
  }

  useEffect(() => {
    if (image && canvasRef.current) {
      drawCanvas()
    }
  }, [image, watermark, selectedAsset])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const container = containerRef.current
    if (!container) return
    
    if (image.startsWith('data:image') || image.startsWith('blob:')) {
      const img = new Image()
      img.onload = () => {
        const maxW = Math.min(img.width, container.clientWidth - 48)
        const maxH = Math.min(img.height, 500)
        const scale = Math.min(maxW / img.width, maxH / img.height, 1)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawWatermark(ctx, canvas)
      }
      img.src = image
    } else {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const maxW = Math.min(img.width, container.clientWidth - 48)
        const maxH = Math.min(img.height, 500)
        const scale = Math.min(maxW / img.width, maxH / img.height, 1)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawWatermark(ctx, canvas)
      }
      img.src = image
    }
  }

  const drawWatermark = (ctx, canvas) => {
    const x = (watermark.x / 100) * canvas.width
    const y = (watermark.y / 100) * canvas.height
    const size = watermark.size
    
    ctx.save()
    ctx.globalAlpha = watermark.opacity
    
    if (selectedAsset === 'none' || !selectedAsset) {
      ctx.font = `bold ${size * 0.25}px "Space Mono", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = size * 0.06
      ctx.strokeText(watermark.text, x, y)
      ctx.fillStyle = '#14b8a6'
      ctx.fillText(watermark.text, x, y)
    } else if (selectedAsset === 'gauge') {
      ctx.beginPath()
      ctx.arc(x, y, size / 2, Math.PI, 0)
      ctx.strokeStyle = '#14b8a6'
      ctx.lineWidth = 6
      ctx.stroke()
      ctx.rotate(-Math.PI / 4)
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y - size / 2 + 8)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.rotate(Math.PI / 4)
      ctx.font = `bold ${size * 0.15}px "Space Mono"`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#14b8a6'
      ctx.fillText(watermark.text, x, y + size * 0.35)
    } else if (selectedAsset === 'frame') {
      const frameSize = size * 0.8
      ctx.strokeStyle = '#14b8a6'
      ctx.lineWidth = 3
      ctx.strokeRect(x - frameSize/2, y - frameSize/2, frameSize, frameSize)
      ctx.font = `bold ${size * 0.18}px "Space Mono"`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#14b8a6'
      ctx.fillText(watermark.text, x, y)
    } else if (selectedAsset === 'corner') {
      const cornerSize = size * 0.6
      ctx.strokeStyle = '#14b8a6'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x, y + cornerSize)
      ctx.lineTo(x, y)
      ctx.lineTo(x + cornerSize, y)
      ctx.stroke()
      ctx.font = `bold ${size * 0.2}px "Space Mono"`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillStyle = '#14b8a6'
      ctx.fillText(watermark.text, x + cornerSize + 8, y + cornerSize/2)
    }
    
    ctx.restore()
  }

  const exportImage = () => {
    setIsExporting(true)
    setTimeout(() => {
      const link = document.createElement('a')
      link.download = 'cortisol-asset.png'
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
      setIsExporting(false)
    }, 500)
  }

  const handleCanvasMouseDown = (e) => {
    if (!canvasRef.current) return
    setIsDraggingWatermark(true)
    updateWatermarkPosition(e)
  }

  const handleCanvasMouseMove = (e) => {
    if (!isDraggingWatermark) return
    updateWatermarkPosition(e)
  }

  const handleCanvasMouseUp = () => {
    setIsDraggingWatermark(false)
  }

  const updateWatermarkPosition = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100))
    setWatermark(prev => ({ ...prev, x, y }))
  }

  const resetImage = () => {
    setImage(null)
    setImageUrl('')
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-['Space_Mono']">
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                <span className="text-[10px] font-bold text-teal-500">C</span>
              </div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">Cortisol Studio</span>
            </a>
            <a href="/" className="text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </a>
          </div>
          <span className="text-[10px] text-white/20 uppercase tracking-widest">Asset Generator</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full p-6 gap-6">
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 sticky top-6">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/40 mb-6">Customize</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/40 block">Assets</label>
                <div className="grid grid-cols-4 gap-2">
                  {assets.map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset.id)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedAsset === asset.id
                          ? 'bg-teal-500/20 border border-teal-500/50 text-teal-500'
                          : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
                      }`}
                    >
                      <span className="text-sm">{asset.icon}</span>
                      <span className="text-[7px] uppercase tracking-wider">{asset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/40 block">Watermark Text</label>
                <input 
                  type="text" 
                  value={watermark.text}
                  onChange={(e) => setWatermark(prev => ({ ...prev, text: e.target.value.toUpperCase() }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-teal-500/50 transition-colors"
                  placeholder="CORTISOL"
                  maxLength={12}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Size</label>
                  <span className="text-[10px] font-mono text-teal-500">{watermark.size}px</span>
                </div>
                <input 
                  type="range" min="40" max="300" value={watermark.size}
                  onChange={(e) => setWatermark(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                  className="w-full accent-teal-500 bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Opacity</label>
                  <span className="text-[10px] font-mono text-teal-500">{Math.round(watermark.opacity * 100)}%</span>
                </div>
                <input 
                  type="range" min="10" max="100" value={watermark.opacity * 100}
                  onChange={(e) => setWatermark(prev => ({ ...prev, opacity: parseInt(e.target.value) / 100 }))}
                  className="w-full accent-teal-500 bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/40 block">Position</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { x: 15, y: 15, label: 'TL' },
                    { x: 50, y: 15, label: 'TC' },
                    { x: 85, y: 15, label: 'TR' },
                    { x: 15, y: 50, label: 'ML' },
                    { x: 50, y: 50, label: 'MC' },
                    { x: 85, y: 50, label: 'MR' },
                    { x: 15, y: 85, label: 'BL' },
                    { x: 50, y: 85, label: 'BC' },
                    { x: 85, y: 85, label: 'BR' },
                  ].map(pos => (
                    <button
                      key={pos.label}
                      onClick={() => setWatermark(prev => ({ ...prev, x: pos.x, y: pos.y }))}
                      className={`w-8 h-8 rounded-lg text-[8px] font-bold transition-all ${
                        Math.abs(watermark.x - pos.x) < 5 && Math.abs(watermark.y - pos.y) < 5
                          ? 'bg-teal-500 text-black' 
                          : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <button 
                onClick={exportImage}
                disabled={!image || isExporting}
                className="w-full py-3.5 rounded-xl bg-teal-500 text-black font-bold text-[10px] uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-teal-400 transition-colors"
              >
                {isExporting ? 'Generating...' : 'Download PNG'}
              </button>
              {image && (
                <button 
                  onClick={resetImage}
                  className="w-full mt-2 py-3 rounded-xl bg-white/5 text-white/40 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                >
                  Start Over
                </button>
              )}
            </div>

            <p className="text-[9px] text-white/20 mt-6 leading-relaxed">
              Images are processed locally. Nothing is uploaded or stored.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-[500px]">
          {!image ? (
            <div 
              className={`flex-1 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-12 transition-all duration-300 ${
                isDragging ? 'border-teal-500 bg-teal-500/5' : 'border-white/10 bg-white/[0.02]'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9m0 0l3-3m-3 3l-3-3M8 17H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold tracking-tight mb-2">Drop your image here</h3>
              <p className="text-xs text-white/30 mb-8">PNG, JPG, WEBP, GIF supported</p>
              
              <button 
                onClick={() => fileInputRef.current.click()}
                className="px-8 py-3 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Select File
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              
              <div className="flex items-center gap-4 my-6">
                <div className="h-px w-16 bg-white/10" />
                <span className="text-[10px] text-white/30 uppercase">or</span>
                <div className="h-px w-16 bg-white/10" />
              </div>
              
              <div className="flex gap-2 w-full max-w-sm">
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL"
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-xs outline-none focus:border-teal-500/50 transition-colors"
                />
                <button 
                  onClick={handleImageUrl}
                  disabled={!imageUrl}
                  className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-white/10 transition-colors"
                >
                  Load
                </button>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col"
            >
              <div ref={containerRef} className="flex-1 rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden flex items-center justify-center relative p-6">
                <canvas 
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain cursor-crosshair"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-[9px] text-white/40 uppercase tracking-widest">
                  Click to position watermark
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 px-2">
                <span className="text-[10px] text-white/20 uppercase tracking-widest">Ready for export</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Live Preview</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <p className="text-[10px] text-white/20 uppercase tracking-widest">Cortisol Protocol Studio</p>
          <p className="text-[10px] text-white/10 uppercase tracking-widest">Not financial advice</p>
        </div>
      </footer>
    </div>
  )
}

export default Studio
