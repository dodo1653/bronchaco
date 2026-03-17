import { useState, useEffect } from 'react'

const Navbar = ({ isPlaying, onPlay, onPause }) => {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [marketCap, setMarketCap] = useState('$0')
  const [isHovering, setIsHovering] = useState(false)
  const [musicHover, setMusicHover] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      const sections = ['home', 'token', 'about', 'community']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchMarketCap = async () => {
      try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/9AyLH5Puifc7v9MkTgA36JabS4wiVTEZ3aEPeNoTpump')
        const data = await response.json()
        if (data?.pairs && data.pairs.length > 0) {
          const mc = data.pairs[0].fdv
          if (mc >= 1000000) {
            setMarketCap('$' + (mc / 1000000).toFixed(2) + 'M')
          } else if (mc >= 1000) {
            setMarketCap('$' + (mc / 1000).toFixed(1) + 'K')
          } else {
            setMarketCap('$' + mc.toFixed(0))
          }
        }
      } catch (e) {
        setMarketCap('$0')
      }
    }
    fetchMarketCap()
    const interval = setInterval(fetchMarketCap, 15000)
    return () => clearInterval(interval)
  }, [])

  const navLinks = [
    { href: '#token', label: 'Token' },
    { href: '#about', label: 'About' },
    { href: '#community', label: 'Community' },
  ]

  const handleClick = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition
      const duration = 1800
      let start = null

      const step = (timestamp) => {
        if (!start) start = timestamp
        const progress = timestamp - start
        const progressRatio = Math.min(progress / duration, 1)
        const bounce = Math.sin(progressRatio * Math.PI * 2) * (1 - progressRatio) * 0.15
        const easeOut = 1 - Math.pow(1 - progressRatio, 3)
        
        window.scrollTo(0, startPosition + distance * easeOut + distance * bounce)
        
        if (progress < duration) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
    setMenuOpen(false)
  }

  const handleMusicEnter = () => {
    setMusicHover(true)
    if (!isPlaying) {
      onPlay()
    }
  }

  const handleMusicLeave = () => {
    setMusicHover(false)
    if (isPlaying) {
      onPause()
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-3xl px-5 pt-5">
        <div 
          className="flex items-center justify-between px-6 py-2.5"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
          }}
        >
          <a 
            href="#home" 
            onClick={(e) => handleClick(e, '#home')} 
            className="group relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative h-5 w-24">
              <span 
                className="absolute inset-0 text-sm font-medium block transition-all duration-700"
                style={{ 
                  color: '#fafafa',
                  fontFamily: '"Space Mono", monospace',
                  letterSpacing: '0.05em',
                  transform: isHovering ? 'translateY(-120%)' : 'translateY(0)',
                  opacity: isHovering ? 0 : 1,
                }}
              >
                CORTISOL
              </span>
              <span 
                className="absolute inset-0 text-sm font-medium block transition-all duration-700"
                style={{ 
                  color: '#14b8a6',
                  fontFamily: '"Space Mono", monospace',
                  letterSpacing: '0.05em',
                  transform: isHovering ? 'translateY(0)' : 'translateY(120%)',
                  opacity: isHovering ? 1 : 0,
                }}
              >
                {marketCap}
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="relative px-4 py-1.5 text-xs rounded-lg overflow-hidden"
                style={{ 
                  color: activeSection === link.href.slice(1) ? '#ffffff' : 'rgba(255,255,255,0.4)',
                  fontFamily: '"Space Mono", monospace',
                }}
              >
                <span 
                  className="absolute inset-0 rounded-lg transition-all duration-700 ease-out"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    opacity: activeSection === link.href.slice(1) ? 1 : 0,
                  }}
                />
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          <div 
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
            onMouseEnter={handleMusicEnter}
            onMouseLeave={handleMusicLeave}
            style={{
              background: isPlaying ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${isPlaying ? 'rgba(20, 184, 166, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
            }}
          >
            {isPlaying ? (
              <div className="flex gap-[2px] items-end h-3.5">
                <span className="w-[1.5px] bg-teal-400 rounded-full" style={{ height: '40%', animation: 'equalizer 0.6s ease-in-out infinite', animationDelay: '0ms' }} />
                <span className="w-[1.5px] bg-teal-400 rounded-full" style={{ height: '70%', animation: 'equalizer 0.6s ease-in-out infinite', animationDelay: '100ms' }} />
                <span className="w-[1.5px] bg-teal-400 rounded-full" style={{ height: '50%', animation: 'equalizer 0.6s ease-in-out infinite', animationDelay: '200ms' }} />
                <span className="w-[1.5px] bg-teal-400 rounded-full" style={{ height: '80%', animation: 'equalizer 0.6s ease-in-out infinite', animationDelay: '300ms' }} />
              </div>
            ) : (
              <svg 
                className="w-3.5 h-3.5 transition-all duration-300" 
                style={{ color: 'rgba(255,255,255,0.5)' }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            )}
            <span 
              className="text-xs overflow-hidden transition-all duration-300"
              style={{ 
                fontFamily: '"Space Mono", monospace',
                color: isPlaying ? '#2dd4bf' : 'rgba(255,255,255,0.5)',
                width: musicHover || isPlaying ? '36px' : '0',
                opacity: musicHover || isPlaying ? 1 : 0,
              }}
            >
              vibe
            </span>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="mx-4 mt-2 px-4 py-3 md:hidden" style={{ background: 'rgba(10,10,10,0.95)', borderRadius: '12px' }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="block py-3 text-xs"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Space Mono", monospace' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
