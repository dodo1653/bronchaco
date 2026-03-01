import { useEffect, useState } from 'react'

const Footer = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <footer className="py-8 border-t relative overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-900/30 to-transparent" />
      </div>
      <div className="terminal-container relative">
        <div 
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(15px)' }}
        >
          <p className="text-lg font-medium">$KRABS</p>
          <div className="flex items-center gap-4">
            <a href="https://pump.fun/coin/CA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white" style={{ color: 'var(--color-text-muted)' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7.5v-5l4.5 2.5-4.5 2.5z"/></svg>
              Pump.fun
            </a>
            <a href="https://dexscreener.com/solana/CA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white" style={{ color: 'var(--color-text-muted)' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
              Chart
            </a>
            <a href="https://x.com/i/communities/2027349547975057746" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white" style={{ color: 'var(--color-text-muted)' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Community
            </a>
          </div>
        </div>
        <p 
          className="text-center text-xs transition-all duration-700 delay-200"
          style={{ color: 'var(--color-text-muted)', opacity: visible ? 1 : 0 }}
        >
          Not financial advice. DYOR. Fan-made parody project.
        </p>
      </div>
    </footer>
  )
}

export default Footer
