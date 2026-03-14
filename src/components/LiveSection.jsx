import { useEffect, useRef, useState } from 'react'

const CustomChart = () => {
  const [priceData, setPriceData] = useState([])
  const [stats, setStats] = useState({ price: 0, change24h: 0, volume: 0, marketCap: 0 })
  const [tokenIcon, setTokenIcon] = useState('')
  const cardRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/9AyLH5Puifc7v9MkTgA36JabS4wiVTEZ3aEPeNoTpump')
        const data = await response.json()
        
        if (data?.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0]
          setStats({
            price: parseFloat(pair.priceUsd) || 0,
            change24h: parseFloat(pair.priceChange.h24) || 0,
            volume: parseFloat(pair.volume.h24) || 0,
            marketCap: parseFloat(pair.fdv) || 0
          })
          
          if (pair.info?.imageUrl) {
            setTokenIcon(pair.info.imageUrl)
          }

          const history = []
          let basePrice = parseFloat(pair.priceUsd) || 0.001
          for (let i = 0; i < 25; i++) {
            const volatility = basePrice * 0.15
            const open = basePrice
            const close = basePrice + (Math.random() - 0.5) * volatility
            const high = Math.max(open, close) + Math.random() * volatility * 0.5
            const low = Math.min(open, close) - Math.random() * volatility * 0.5
            history.push({ open, close, high, low })
            basePrice = close
          }
          setPriceData(history)
        }
      } catch (e) {
        const fallback = Array.from({ length: 25 }, (_, i) => {
          const base = 0.00015
          return {
            open: base + i * 0.00001,
            close: base + (i + 1) * 0.00001 + (Math.random() - 0.5) * 0.00002,
            high: base + (i + 1) * 0.00001 + 0.00001,
            low: base + i * 0.00001 - 0.00001
          }
        })
        setPriceData(fallback)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    cardRef.current.style.boxShadow = '0 30px 60px -20px rgba(0, 0, 0, 0.7), 0 0 40px rgba(20, 184, 166, 0.2)'
    cardRef.current.style.borderColor = 'rgba(20, 184, 166, 0.4)'
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
      cardRef.current.style.boxShadow = '0 25px 50px -15px rgba(0, 0, 0, 0.6)'
      cardRef.current.style.borderColor = 'rgba(20, 184, 166, 0.15)'
    }
  }

  const maxPrice = Math.max(...priceData.map(c => c.high), 0.0001)
  const minPrice = Math.min(...priceData.map(c => c.low), 0.00001)
  const priceRange = maxPrice - minPrice || 1

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '$0.00'
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(2) + 'M'
    if (num >= 1000) return '$' + (num / 1000).toFixed(2) + 'K'
    return '$' + num.toFixed(6)
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full"
      style={{ 
        background: 'linear-gradient(145deg, rgba(18,18,22,0.95), rgba(8,8,12,0.98))',
        borderRadius: '24px',
        border: '1px solid rgba(20, 184, 166, 0.15)',
        boxShadow: '0 25px 50px -15px rgba(0, 0, 0, 0.6)',
        padding: '28px',
        height: '380px',
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      <a href="https://pump.fun/coin/9AyLH5Puifc7v9MkTgA36JabS4wiVTEZ3aEPeNoTpump" target="_blank" rel="noopener noreferrer" className="block h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {tokenIcon ? (
              <img 
                src={tokenIcon} 
                alt="$CORTISOL" 
                className="w-12 h-12 rounded-full"
                style={{ boxShadow: '0 0 20px rgba(13, 148, 136, 0.4)' }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', boxShadow: '0 0 20px rgba(13, 148, 136, 0.4)' }}>
                <span className="text-2xl font-bold" style={{ color: '#000' }}>$</span>
              </div>
            )}
            <div>
              <p className="text-white font-semibold text-lg">$CORTISOL</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Solana</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-xl">{stats.price > 0 ? formatNumber(stats.price) : '$0.0000'}</p>
            <p className={stats.change24h >= 0 ? 'text-green-400' : 'text-red-400'} style={{ fontSize: '14px', fontWeight: 500 }}>
              {stats.change24h >= 0 ? '+' : ''}{stats.change24h.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="flex-1 mb-6" style={{ minHeight: '100px' }}>
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
            {priceData.length > 0 && priceData.map((candle, i) => {
              const x = (i / (priceData.length - 1)) * 100
              const candleWidth = 100 / priceData.length * 0.6
              
              const allHighs = priceData.map(c => c.high)
              const allLows = priceData.map(c => c.low)
              const maxP = Math.max(...allHighs)
              const minP = Math.min(...allLows)
              const range = maxP - minP || 1
              
              const yHigh = 50 - ((candle.high - minP) / range * 50)
              const yLow = 50 - ((candle.low - minP) / range * 50)
              const yOpen = 50 - ((candle.open - minP) / range * 50)
              const yClose = 50 - ((candle.close - minP) / range * 50)
              
              const isGreen = candle.close >= candle.open
              const color = isGreen ? '#10b981' : '#ef4444'
              
              return (
                <g key={i}>
                  <line 
                    x1={x} y1={yHigh} x2={x} y2={yLow}
                    stroke={color} strokeWidth="0.3" opacity="0.6"
                  />
                  <rect 
                    x={x - candleWidth / 2} 
                    y={Math.min(yOpen, yClose)} 
                    width={candleWidth} 
                    height={Math.max(0.5, Math.abs(yClose - yOpen))}
                    fill={color} opacity="0.9"
                  />
                </g>
              )
            })}
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Market Cap</p>
            <p className="text-base font-semibold text-white">{formatNumber(stats.marketCap)}</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>24h Volume</p>
            <p className="text-base font-semibold text-white">{formatNumber(stats.volume)}</p>
          </div>
        </div>
      </a>
    </div>
  )
}

const TweetCard = () => {
  const cardRef = useRef(null)
  const previewRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (isHovering && previewRef.current && !previewRef.current.innerHTML) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.onload = () => {
        if (window.twttr) {
          window.twttr.widgets.createTweet(
            '2031475708653089024',
            previewRef.current,
            {
              theme: 'dark',
              width: '100%',
              align: 'center'
            }
          )
        }
      }
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }
  }, [isHovering])

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    cardRef.current.style.boxShadow = '0 30px 60px -20px rgba(0, 0, 0, 0.7), 0 0 40px rgba(20, 184, 166, 0.2)'
    cardRef.current.style.borderColor = 'rgba(20, 184, 166, 0.4)'

    if (previewRef.current) {
      previewRef.current.style.transform = `perspective(800px) rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg) scale(1)`
    }
  }

  const handleCardMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
      cardRef.current.style.boxShadow = '0 25px 50px -15px rgba(0, 0, 0, 0.6)'
      cardRef.current.style.borderColor = 'rgba(20, 184, 166, 0.15)'
    }
    if (previewRef.current) {
      previewRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
    }
    setIsHovering(false)
  }

  return (
    <div className="relative">
      <div 
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        onMouseEnter={() => setIsHovering(true)}
        className="w-full h-full"
        style={{ 
          background: 'linear-gradient(145deg, rgba(18,18,22,0.95), rgba(8,8,12,0.98))',
          borderRadius: '24px',
          border: '1px solid rgba(20, 184, 166, 0.15)',
          boxShadow: '0 25px 50px -15px rgba(0, 0, 0, 0.6)',
          padding: '28px',
          height: '380px',
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        <a 
          href="https://x.com/Cortisol_solana/status/2031475708653089024"
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full flex flex-col items-center justify-center text-center"
        >
          <img 
            src="/ChatGPT Image Mar 11, 2026, 03_05_43 PM.png" 
            alt="$CORTISOL" 
            className="w-20 h-20 mb-5 rounded-2xl"
            style={{ boxShadow: '0 0 30px rgba(20, 184, 166, 0.3)' }}
          />
          <p className="text-white font-semibold text-xl mb-2">$CORTISOL</p>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>@Cortisol_solana</p>
          <p className="text-xs px-5 py-2.5 inline-block" style={{ background: 'rgba(20, 184, 166, 0.15)', borderRadius: '24px', color: '#14b8a6' }}>
            View on X →
          </p>
        </a>
      </div>
      
      <div 
        ref={previewRef}
        className="absolute z-50"
        style={{
          bottom: '-100px',
          right: '50%',
          transform: isHovering ? 'translateX(50%) scale(1)' : 'translateX(50%) scale(0.85)',
          opacity: isHovering ? 1 : 0,
          width: '340px',
          height: '200px',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: isHovering ? '0 20px 50px -12px rgba(0,0,0,0.8), 0 0 35px rgba(20,184,166,0.1)' : '0 5px 15px -3px rgba(0,0,0,0.3)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease, box-shadow 0.3s ease',
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

const LiveSection = () => {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="live" className="py-16" style={{ backgroundColor: 'var(--color-terminal-surface)' }}>
      <div className="terminal-container" style={{ paddingTop: '3rem' }}>
        <div 
          className="transition-all duration-700 ease-out mb-10"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <p className="label">// LIVE</p>
        </div>

        <div className="grid md:grid-cols-2" style={{ gap: '56px' }}>
          <div 
            className="transition-all duration-1000 ease-out"
            style={{ 
              opacity: visible ? 1 : 0, 
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            }}
          >
            <CustomChart />
          </div>

          <div 
            className="transition-all duration-1000 ease-out"
            style={{ 
              opacity: visible ? 1 : 0, 
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
              transitionDelay: '200ms'
            }}
          >
            <TweetCard />
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveSection
