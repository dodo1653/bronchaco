import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 800)
  }, [])

  const uncsImages = [
    '/uncs/Screenshot 2026-04-16 124019.png',
    '/uncs/Gemini_Generated_Image_e9kkuce9kkuce9kk.png',
    '/uncs/Gemini_Generated_Image_2bray82bray82bra.png',
    '/uncs/Gemini_Generated_Image_7uyhwo7uyhwo7uyh.png',
    '/uncs/Gemini_Generated_Image_yq7m4ryq7m4ryq7m.png',
  ]

  const socialLinks = [
    { name: 'X', url: 'https://x.com/shitcoineronSOL' },
    { name: 'Telegram', url: 'https://t.me/shitcoineronSOL' },
  ]

  const ShitcoinerStudio = () => {
    const [image, setImage] = useState(null)
    const [text, setText] = useState("Somebody has done it before,\nsomebody will do it again")
    const [textSize, setTextSize] = useState(24)
    const [textPos, setTextPos] = useState(50)
    const canvasRef = useRef(null)

    const handleImageUpload = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => setImage(ev.target.result)
        reader.readAsDataURL(file)
      }
    }

    const selectUncsImage = (imgPath) => {
      setImage(imgPath)
    }

    const downloadMeme = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const link = document.createElement('a')
      link.download = 'shitcoiner-meme.png'
      link.href = canvas.toDataURL()
      link.click()
    }

    return (
      <div className="min-h-screen bg-black text-white font-['Inter']">
        <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-8 flex items-center justify-between">
          <a href="/" className="text-sm font-mono tracking-widest text-white/60">$SHITCOINER</a>
          <a href="/" className="text-xs text-white/30 hover:text-white/50 font-mono">← Back</a>
        </nav>

        <div className="pt-24 px-8 pb-12 max-w-2xl mx-auto">
          <h1 className="text-2xl font-light text-white/80 mb-2">$SHITCOINER Studio</h1>
          <p className="text-sm text-white/40 mb-8">Create your own Brochacho meme</p>

          <div className="space-y-6">
            <div>
              <label className="block text-xs text-white/40 font-mono mb-2">UPLOAD IMAGE</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-mono file:bg-white/10 file:text-white/70 file:cursor-pointer file:transition-colors file:hover:bg-white/20" />
            </div>

            <div>
              <label className="block text-xs text-white/40 font-mono mb-2">OR USE TEMPLATE</label>
              <div className="grid grid-cols-5 gap-2">
                {uncsImages.map((img, i) => (
                  <button key={i} onClick={() => selectUncsImage(img)} className={`aspect-square rounded-lg overflow-hidden border ${image === img ? 'border-white ring-2 ring-white' : 'border-white/10 hover:border-white/30'} transition-colors`}>
                    <img src={img} alt={`Template ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {image && (
              <div className="relative">
                <canvas ref={canvasRef} width={800} height={800} className="w-full hidden" />
                <div className="relative rounded-lg overflow-hidden border border-white/10">
                  <img src={image} alt="Preview" className="w-full" />
                  <div 
                    className="absolute left-0 right-0 text-center text-white font-['Space_Mono'] font-bold px-4"
                    style={{ 
                      fontSize: `${textSize}px`, 
                      top: `${textPos}%`,
                      textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 4px rgba(0,0,0,0.8)'
                    }}
                  >
                    <pre className="whitespace-pre-wrap">{text}</pre>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-white/40 font-mono mb-2">TEXT</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white/70 font-mono focus:outline-none focus:border-white/30" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 font-mono mb-2">SIZE: {textSize}px</label>
                <input type="range" min="12" max="48" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full accent-white" />
              </div>
              <div>
                <label className="block text-xs text-white/40 font-mono mb-2">POSITION: {textPos}%</label>
                <input type="range" min="10" max="90" value={textPos} onChange={(e) => setTextPos(Number(e.target.value))} className="w-full accent-white" />
              </div>
            </div>

            <button onClick={downloadMeme} disabled={!image} className="w-full py-3 rounded-lg bg-white text-black font-mono text-sm hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              Download Meme
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Inter']">
      {/* Loading */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[2000] bg-black flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm font-mono tracking-widest"
        >
          ALL-OUT WAR
        </motion.div>
      </motion.div>

      {/* Show home content only on / */}
      {location.pathname === '/' && (
        <>
        <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-8">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <a href="/" className="text-sm font-mono tracking-widest text-white/60">$SHITCOINER</a>
            <div className="flex gap-6 text-sm">
              {socialLinks.map(link => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors font-mono"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <section className="min-h-screen flex items-center justify-center px-8">
          <div className="absolute inset-0 z-0">
            <img src={uncsImages[0]} alt="" className="w-full h-full object-cover opacity-40 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
              <h1 className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 font-['Inter']">
                "I am declaring an ALL-OUT WAR<br/>against the shitcoiner crypto bros."
              </h1>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-center mb-12">
              <a href="https://x.com/AdamBLiv/status/2044846661990486072?s=20" target="_blank" rel="noopener noreferrer" className="text-xs text-white/30 hover:text-white/50 transition-colors font-mono underline">
                View original post →
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="grid grid-cols-2 gap-8 max-w-sm mx-auto mb-12">
              <div className="text-center">
                <p className="text-xs text-white/30 font-mono tracking-widest mb-1">TOKEN</p>
                <p className="text-lg font-mono">$SHITCOINER</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/30 font-mono tracking-widest mb-1">CHAIN</p>
                <p className="text-lg font-mono">SOLANA</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-white/30 font-mono tracking-widest mb-2">CONTRACT ADDRESS</p>
              <p className="text-xs font-mono text-white/50 break-all select-all">FSXznRGdxco6TyyRaqnrC7xnLTsjwq4kwMx4ewk1pump</p>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-white/30 font-mono tracking-widest mb-8 text-center">GALLERY</p>
            <div className="grid gap-4">
              <div className="rounded-lg overflow-hidden border border-white/10">
                <img src={uncsImages[1]} alt="Art 1" className="w-full opacity-60 hover:opacity-100 transition-opacity grayscale" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden border border-white/10 aspect-square">
                  <img src={uncsImages[2]} alt="Art 2" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity grayscale" />
                </div>
                <div className="rounded-lg overflow-hidden border border-white/10 aspect-square">
                  <img src={uncsImages[3]} alt="Art 3" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity grayscale" />
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-white/10">
                <img src={uncsImages[4]} alt="Art 4" className="w-full h-[90%] object-cover opacity-60 hover:opacity-100 transition-opacity grayscale" style={{ objectPosition: 'center top' }} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-white/30 font-mono tracking-widest mb-8">STUDIO</p>
            <p className="text-white/50 mb-8 font-mono text-sm">Create your own anti-shitcoin propaganda. Expose the degenerate court jesters.</p>
            <a href="/studio" className="inline-block px-8 py-3 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors font-mono text-sm">Open Studio →</a>
          </div>
        </section>

        <section className="py-24 px-8" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-white/30 font-mono tracking-widest mb-8">THE MANIFESTO</p>
            <div className="text-left space-y-4 text-sm text-white/50 font-mono">
              <p>• Shitcoiners are the degenerate court jesters of capital markets</p>
              <p>• They stand in front of digital scarcity and say, "Very impressive, but what if we added a dog?"</p>
              <p>• Bitcoin solved the monetary problem with brutal elegance</p>
              <p>• Their response was to open a digital flea market full of vapor, lies, unlock schedules, and inflationary sludge</p>
              <p>• They inherit the language of freedom while rebuilding the exact disease Bitcoin was designed to escape</p>
              <p>• Trusted insiders. Premines. Foundations. Treasury unlocks. "Community."</p>
              <p>• The shitcoin sewer has anime branding and a whitepaper written by a sociopath in a blazer</p>
            </div>
          </div>
        </section>

        <section className="py-24 px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-white/30 font-mono tracking-widest mb-8">OFFICIAL LINKS</p>
            <div className="flex justify-center gap-8">
              {socialLinks.map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors font-mono">{link.name}</a>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-12 px-8 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-white/20 font-mono">A shame to Bitcoin. Lunatics must be addressed accordingly.</p>
          </div>
        </footer>
        </>
      )}

      {location.pathname === '/studio' && <ShitcoinerStudio />}
    </div>
  )
}

export default App