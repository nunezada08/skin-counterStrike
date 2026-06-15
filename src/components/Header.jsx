import { useState } from 'react'

export default function Header({ activePage, setActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { id: 'skins', label: 'Skins' },
    { id: 'roulette', label: 'Roleta' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActivePage('skins')}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded bg-gradient-to-br from-[#f0a500] to-[#e05a00] flex items-center justify-center">
            <span className="text-[11px] font-black text-black">CS</span>
          </div>
          <span className="font-bold text-white tracking-tight text-[15px] group-hover:text-[#f0a500] transition-colors">
            Skins<span className="text-[#f0a500]">CS</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => setActivePage(l.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activePage === l.id
                  ? 'bg-[#f0a500]/10 text-[#f0a500]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Mobile burger */}
        <button
          className="sm:hidden text-gray-400 hover:text-white p-1"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <div className="space-y-1">
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/5 bg-[#0a0a0f] px-4 py-2">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => { setActivePage(l.id); setMenuOpen(false) }}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium mb-1 ${
                activePage === l.id
                  ? 'bg-[#f0a500]/10 text-[#f0a500]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
