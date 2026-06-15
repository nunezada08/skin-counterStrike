import { RARITIES } from '../data/mockSkins'

const RARITY_MAP = Object.fromEntries(RARITIES.map(r => [r.value, r]))

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-[#f0a500]' : 'text-gray-600'}`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function SkinCard({ skin, onClick }) {
  const rarityInfo = RARITY_MAP[skin.rarity] || { color: '#888', label: skin.rarity }
  const priceStr = skin.price >= 1000
    ? `$${(skin.price / 1000).toFixed(1)}k`
    : skin.price >= 1
    ? `$${skin.price.toFixed(2)}`
    : `$${skin.price.toFixed(2)}`

  return (
    <button
      onClick={() => onClick(skin)}
      className="group bg-[#111118] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 hover:bg-[#16161f] transition-all text-left w-full"
    >
      {/* Rarity bar */}
      <div className="h-0.5 w-full" style={{ background: rarityInfo.color }} />

      {/* Image */}
      <div className="relative h-36 bg-gradient-to-b from-[#1a1a28] to-[#111118] flex items-center justify-center p-4">
        <img
          src={skin.image}
          alt={skin.name}
          className="h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
          onError={e => { e.target.style.display = 'none' }}
        />
        <span
          className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: rarityInfo.color + '22', color: rarityInfo.color, border: `1px solid ${rarityInfo.color}44` }}
        >
          {rarityInfo.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="text-white text-sm font-semibold leading-tight line-clamp-1">{skin.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{skin.category} · {skin.wear}</span>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <StarRating rating={skin.rating} />
          <span className="text-[#f0a500] font-bold text-sm">{priceStr}</span>
        </div>
        <p className="text-xs text-gray-600">{skin.reviews_count} avaliações</p>
      </div>
    </button>
  )
}
