import { useEffect, useRef, useState } from 'react'

const CinematicTransition = () => {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight - windowHeight
      const scrollProgress = window.scrollY / docHeight

      const heroEnd = document.getElementById('home')?.offsetHeight || windowHeight
      const artStart = heroEnd
      const artEnd = artStart + (document.getElementById('art')?.offsetHeight || windowHeight)

      const scrollY = window.scrollY

      if (scrollY < heroEnd * 0.5) {
        setPhase('hero')
        setProgress(0)
      } else if (scrollY >= heroEnd * 0.5 && scrollY < artEnd - windowHeight * 0.8) {
        setPhase('inside')
        const entering = (scrollY - heroEnd * 0.5) / (windowHeight * 0.3)
        setProgress(Math.min(1, Math.max(0, entering)))
      } else if (scrollY >= artEnd - windowHeight * 0.8 && scrollY < artEnd - windowHeight * 0.2) {
        setPhase('exiting')
        const exiting = (scrollY - (artEnd - windowHeight * 0.8)) / (windowHeight * 0.6)
        setProgress(Math.min(1, Math.max(0, 1 - exiting)))
      } else {
        setPhase('after')
        setProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getOverlayStyle = () => {
    if (phase === 'hero') {
      return { opacity: 0, scale: 1.3 }
    }
    if (phase === 'inside') {
      const ease = 1 - Math.pow(1 - progress, 3)
      return {
        opacity: ease * 0.85,
        scale: 1.3 - ease * 0.3,
      }
    }
    if (phase === 'exiting') {
      const ease = 1 - Math.pow(1 - progress, 3)
      return {
        opacity: (1 - ease) * 0.85,
        scale: 1 + ease * 0.3,
      }
    }
    return { opacity: 0, scale: 1.3 }
  }

  const style = getOverlayStyle()

  return (
    <>
      <style>{`
        .cinematic-overlay {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background: radial-gradient(
            ellipse at 50% 50%,
            rgba(5, 5, 5, 0.3) 0%,
            rgba(5, 5, 5, 0.7) 50%,
            rgba(5, 5, 5, 0.95) 100%
          );
          mix-blend-mode: multiply;
          transition: opacity 0.1s ease-out;
        }
        .cinematic-vignette {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9998;
          background: radial-gradient(
            ellipse at 50% 50%,
            transparent 30%,
            rgba(0, 0, 0, 0.4) 70%,
            rgba(0, 0, 0, 0.9) 100%
          );
        }
        .cinematic-particles {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9997;
          overflow: hidden;
        }
        .cinematic-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(20, 184, 166, 0.6);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(20, 184, 166, 0.8);
        }
        .cinematic-flare {
          pointer-events: none;
          position: fixed;
          top: 50%;
          left: 50%;
          width: 150vmax;
          height: 150vmax;
          transform: translate(-50%, -50%);
          z-index: 9996;
          background: radial-gradient(
            circle at center,
            rgba(20, 184, 166, 0.08) 0%,
            rgba(20, 184, 166, 0.03) 30%,
            transparent 60%
          );
          opacity: 0;
          mix-blend-mode: screen;
        }
      `}</style>

      <div 
        className="cinematic-vignette"
        style={{
          opacity: phase === 'inside' ? 1 : phase === 'exiting' ? progress : 0,
          transition: 'opacity 0.3s ease'
        }}
      />

      <div 
        className="cinematic-flare"
        style={{
          opacity: phase === 'inside' ? progress * 0.8 : phase === 'exiting' ? (1 - progress) * 0.8 : 0,
          transform: `translate(-50%, -50%) scale(${1 + (phase === 'inside' ? progress * 0.2 : (1 - progress) * 0.2)})`,
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
      />

      <div 
        className="cinematic-overlay"
        style={{
          opacity: style.opacity,
          transform: `scale(${style.scale})`,
          transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
        }}
      />

      <div 
        className="cinematic-particles"
        style={{
          opacity: phase === 'inside' ? progress : phase === 'exiting' ? (1 - progress) : 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="cinematic-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `cinematicFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.7,
              transform: `scale(${0.5 + Math.random() * 1.5})`
            }}
          />
        ))}
        <style>{`
          @keyframes cinematicFloat {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            25% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
            50% { transform: translateY(-40px) translateX(-10px); opacity: 0.5; }
            75% { transform: translateY(-20px) translateX(15px); opacity: 0.9; }
          }
        `}</style>
      </div>
    </>
  )
}

export default CinematicTransition
