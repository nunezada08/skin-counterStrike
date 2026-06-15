import { useState } from 'react'
import Header from './components/Header'
import SkinsPage from './pages/SkinsPage'
import Roulette from './pages/Roulette'

export default function App() {
  const [activePage, setActivePage] = useState('skins')

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header activePage={activePage} setActivePage={setActivePage} />
      <main>
        {activePage === 'skins' && <SkinsPage />}
        {activePage === 'roulette' && <Roulette />}
      </main>

      <footer className="mt-20 border-t border-white/5 py-8 text-center text-xs text-gray-700">
        <p>SkinsCS — Projeto demonstrativo. Não afiliado à Valve Corporation.</p>
        <p className="mt-1">Counter-Strike® é marca registrada da Valve Corporation.</p>
      </footer>
    </div>
  )
}
