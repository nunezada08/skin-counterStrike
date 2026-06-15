import { useState, useRef } from 'react'
import { RARITIES } from '../data/mockSkins'

const RARITY_MAP = Object.fromEntries(RARITIES.map(r => [r.value, r]))

const API_URL = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json'

const RARITY_NAME_MAP = {
  'Consumer Grade':   'consumer',
  'Industrial Grade': 'industrial',
  'Mil-Spec Grade':   'milspec',
  'Restricted':       'restricted',
  'Classified':       'classified',
  'Covert':           'covert',
  'Contraband':       'gold',
  'Rare Special':     'gold',
}

const WEAPON_TYPE_MAP = {
  'Rifle':          'Rifle',
  'Pistol':         'Pistol',
  'Sniper Rifle':   'Sniper',
  'Submachine Gun': 'SMG',
  'Shotgun':        'Shotgun',
  'Machine Gun':    'Machine Gun',
  'Knife':          'Knife',
  'Gloves':         'Gloves',
}

const CARD_W = 128
const CARD_GAP = 8

function pickWeightedSkin(skins) {
  const pool = []
  skins.forEach(skin => {
    const r = RARITIES.find(r => r.value === skin.rarity)
    const weight = r ? Math.round(r.chance * 10) : 10
    for (let i = 0; i < weight; i++) pool.push(skin)
  })
  return pool[Math.floor(Math.random() * pool.length)]
}

function buildReel(skins, winnerSkin, totalItems = 60) {
  const WINNER_IDX = totalItems - 8
  const items = []
  for (let i = 0; i < totalItems; i++) {
    items.push(i === WINNER_IDX ? winnerSkin : pickWeightedSkin(skins))
  }
  return { items, winnerIdx: WINNER_IDX }
}

export default function Roulette() {
  const [skins, setSkins] = useState([])
  const [loadingSkins, setLoadingSkins] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [reel, setReel] = useState(null)
  const [winner, setWinner] = useState(null)
  const [showWinner, setShowWinner] = useState(false)
  const trackRef = useRef(null)

  async function loadSkinsIfNeeded() {
    if (skins.length > 0) return skins
    setLoadingSkins(true)
    const res = await fetch(API_URL)
    const data = await res.json()
    const normalized = data.map((raw, index) => ({
      id: raw.id || index,
      name: raw.name || 'Unknown',
      category: WEAPON_TYPE_MAP[raw.weapon?.weapon_type] || 'Other',
      rarity: RARITY_NAME_MAP[raw.rarity?.name] || 'consumer',
      price: 0,
      wear: raw.wears?.[0]?.name || 'Factory New',
      image: raw.image || '',
    }))
    setSkins(normalized)
    setLoadingSkins(false)
    return normalized
  }

  async function spin() {
    if (spinning) return
    setWinner(null)
    setShowWinner(false)

    const loadedSkins = await loadSkinsIfNeeded()
    if (!loadedSkins.length) return

    const winnerSkin = pickWeightedSkin(loadedSkins)
    const { items, winnerIdx } = buildReel(loadedSkins, winnerSkin)
    setReel(items)
    setSpinning(true)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!trackRef.current) return
        const viewportCenter = 320
        const targetX = winnerIdx * (CARD_W + CARD_GAP) - viewportCenter + CARD_W / 2
        trackRef.current.style.transition = 'transform 5s cubic-bezier(0.1, 0.8, 0.2, 1)'
        trackRef.current.style.transform = `translateX(-${targetX}px)`

        setTimeout(() => {
          setSpinning(false)
          setWinner(winnerSkin)
          setTimeout(() => setShowWinner(true), 100)
        }, 5200)
      })
    })
  }

  function reset() {
    if (trackRef.current) {
      trackRef.current.style.transition = 'none'
      trackRef.current.style.transform = 'translateX(0)'
    }
    setReel(null)
    setWinner(null)
    setShowWinner(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Roleta de <span className="text-[#f0a500]">Skins</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Gire a roleta e veja qual skin você teria desbloqueado. Cada raridade tem uma chance diferente de aparecer.
        </p>
      </div>

      {/* Rarity odds */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {RARITIES.map(r => (
          <div key={r.value} className="bg-[#111118] border border-white/5 rounded-lg p-2.5 text-center">
            <div className="w-2 h-2 rounded-full mx-auto mb-1.5" style={{ background: r.color }} />
            <p className="text-[10px] text-gray-400 leading-tight">{r.label}</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: r.color }}>{r.chance}%</p>
          </div>
        ))}
      </div>

      {/* Reel */}
      <div className="space-y-4">
        <div className="relative bg-[#0d0d14] border border-white/10 rounded-xl h-40 overflow-hidden">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px z-20 pointer-events-none">
            <div className="w-0.5 h-full bg-[#f0a500]/80" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-[#f0a500]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-[#f0a500]" />
          </div>
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0d0d14] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0d0d14] to-transparent z-10 pointer-events-none" />

          {reel ? (
            <div className="absolute inset-y-0 flex items-center pl-4" style={{ left: '50%', translateX: '-50%' }}>
              <div ref={trackRef} className="flex gap-2" style={{ willChange: 'transform' }}>
                {reel.map((skin, i) => {
                  const ri = RARITY_MAP[skin.rarity] || { color: '#888' }
                  return (
                    <div
                      key={i}
                      className="shrink-0 w-32 h-32 bg-[#111118] rounded-lg border border-white/5 overflow-hidden flex flex-col items-center justify-center p-2"
                      style={{ borderTopColor: ri.color, borderTopWidth: 2 }}
                    >
                      <img src={skin.image} alt={skin.name} className="h-16 object-contain"
                        onError={e => { e.target.style.display = 'none' }} />
                      <p className="text-[9px] text-gray-400 text-center leading-tight mt-1 line-clamp-2">{skin.name}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600 text-sm">
                {loadingSkins ? 'Carregando skins...' : 'Pressione girar para começar'}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={spin}
            disabled={spinning || loadingSkins}
            className="px-10 py-3 bg-[#f0a500] text-black font-bold rounded-xl hover:bg-[#f0a500]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm tracking-wide shadow-lg shadow-[#f0a500]/20"
          >
            {loadingSkins ? 'Carregando...' : spinning ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Girando...
              </span>
            ) : 'Girar Roleta'}
          </button>
          {(winner || reel) && !spinning && (
            <button onClick={reset} className="px-6 py-3 border border-white/10 text-gray-400 font-semibold rounded-xl hover:border-white/30 hover:text-white transition-all text-sm">
              Resetar
            </button>
          )}
        </div>
      </div>

      {winner && showWinner && (
        <div
          className="bg-[#111118] border rounded-2xl p-6 text-center space-y-3 transition-all"
          style={{ borderColor: (RARITY_MAP[winner.rarity]?.color || '#888') + '66' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: RARITY_MAP[winner.rarity]?.color }}>
            🎉 Você desbloqueou
          </p>
          <div className="flex justify-center">
            <img src={winner.image} alt={winner.name} className="h-28 object-contain drop-shadow-xl"
              onError={e => { e.target.style.display = 'none' }} />
          </div>
          <h3 className="text-white font-bold text-xl">{winner.name}</h3>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="font-bold" style={{ color: RARITY_MAP[winner.rarity]?.color }}>
              {RARITY_MAP[winner.rarity]?.label}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400">{winner.wear}</span>
          </div>
        </div>
      )}
    </div>
  )
}
