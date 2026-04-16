import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'
import Studio from './components/Studio'

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
    { name: 'X', url: 'https://x.com/bronchaco' },
    { name: 'Telegram', url: 'https://t.me/bronchaco' },
  ]

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
          SOMEBOBY WILL DO IT AGAIN
        </motion.div>
      </motion.div>

      {/* Show home content only on / */}
      {location.pathname === '/' && (
        <>
        <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-8">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <a href="/" className="text-sm font-mono tracking-widest text-white/60">$BRONCHACO</a>
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
              <h1 className="text-3xl md:text-4xl font-light leading-relaxed text-white/80 font-['Inter']">
                "Somebody has done it before,<br/>somebody will do it again"
              </h1>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-center mb-12">
              <a href="https://x.com/bronchaco/status/2044730931982766395?s=20" target="_blank" rel="noopener noreferrer" className="text-xs text-white/30 hover:text-white/50 transition-colors font-mono underline">
                View original post →
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="grid grid-cols-2 gap-8 max-w-sm mx-auto mb-12">
              <div className="text-center">
                <p className="text-xs text-white/30 font-mono tracking-widest mb-1">TOKEN</p>
                <p className="text-lg font-mono">$BRONCHACO</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/30 font-mono tracking-widest mb-1">CHAIN</p>
                <p className="text-lg font-mono">SOLANA</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-white/30 font-mono tracking-widest mb-2">CONTRACT ADDRESS</p>
              <p className="text-xs font-mono text-white/50 break-all">Coming soon...</p>
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
            <p className="text-white/50 mb-8 font-mono text-sm">Create your own Brochacho meme. Upload an image and add the iconic text.</p>
            <a href="/studio" className="inline-block px-8 py-3 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors font-mono text-sm">Open Studio →</a>
          </div>
        </section>

        <section className="py-24 px-8" style={{ background: 'rgba(255,255,255,0.02)' }}>
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
            <p className="text-xs text-white/20 font-mono">Not financial advice. Just vibes.</p>
          </div>
        </footer>
        </>
      )}

      {location.pathname === '/studio' && <Studio />}
    </div>
  )
}

export default App