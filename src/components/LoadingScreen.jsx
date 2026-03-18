import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LoadingScreen = ({ progress }) => {
  const [displayProgress, setDisplayProgress] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const rotation = (displayProgress / 100) * 180 - 90
  const isHigh = displayProgress > 75
  const isMed = displayProgress > 40

  const getColor = () => {
    if (displayProgress > 75) return '#ef4444'
    if (displayProgress > 40) return '#f97316'
    return '#22c55e'
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
      }}
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ background: '#050505' }}
    >
      <div className="flex flex-col items-center">
        {/* Minimal Cortisol Meter */}
        <div className="relative w-64 h-32 flex items-end justify-center">
          {/* Arc */}
          <svg className="absolute bottom-0 w-full" viewBox="0 0 200 100">
            <defs>
              <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            
            {/* Track */}
            <path
              d="M20,100 A80,80 0 0,1 180,100"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Progress */}
            <motion.path
              d="M20,100 A80,80 0 0,1 180,100"
              fill="none"
              stroke="url(#meterGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 251.32 }}
              animate={{ 
                strokeDashoffset: 251.32 - (displayProgress / 100) * 251.32 
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 8px ${getColor()})` }}
            />
          </svg>

          {/* Needle */}
          <motion.div
            className="absolute bottom-[-2px] left-1/2 origin-bottom"
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', damping: 20, stiffness: 50 }}
          >
            <div 
              className="w-[2px] h-[70px]"
              style={{
                background: 'linear-gradient(to top, #fff, rgba(255,255,255,0.4))',
              }}
            />
            <div 
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                background: '#fff',
                boxShadow: `0 0 15px #fff, 0 0 30px ${getColor()}`,
              }}
            />
          </motion.div>
        </div>

        {/* Percentage */}
        <motion.div 
          className="mt-6"
          key={displayProgress}
        >
          <span 
            className="text-3xl font-bold tabular-nums"
            style={{ 
              fontFamily: '"Space Mono", monospace',
              color: getColor(),
              textShadow: `0 0 20px ${getColor()}40`,
            }}
          >
            {Math.round(displayProgress)}
          </span>
          <span className="text-sm text-white/30 ml-1">%</span>
        </motion.div>

        {/* Minimal status */}
        {displayProgress < 100 && (
          <motion.div 
            className="mt-4"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div 
              className="w-1 h-1 rounded-full"
              style={{ background: getColor() }}
            />
          </motion.div>
        )}
      </div>

      {/* Ambient glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${getColor()}08 0%, transparent 50%)`,
        }}
      />
    </motion.div>
  )
}

export default LoadingScreen
