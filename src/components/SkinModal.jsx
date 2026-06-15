import { useState } from 'react'
import { RARITIES } from '../data/mockSkins'
import { insertReview } from '../lib/supabase'

const RARITY_MAP = Object.fromEntries(RARITIES.map(r => [r.value, r]))

const MOCK_REVIEWS = [
  { id: 1, player_name: 'br_sniper99', rating: 5, comment: 'Uma das melhores skins do jogo. Vale cada centavo!', created_at: '2024-11-20' },
  { id: 2, player_name: 'cs_legenda', rating: 4, comment: 'Visual incrível, mas poderia ter mais detalhes no cabo.', created_at: '2024-10-15' },
  { id: 3, player_name: 'headshot_master', rating: 5, comment: 'Perfeita. Já tenho faz 2 anos e nunca me arrependi.', created_at: '2024-09-03' },
]

export default function SkinModal({ skin, onClose }) {
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [form, setForm] = useState({ player_name: '', rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const rarityInfo = RARITY_MAP[skin.rarity] || { color: '#888', label: skin.rarity }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.player_name || !form.comment) return
    setSubmitting(true)

    try {
      // In production this calls Supabase:
      // const newReview = await insertReview({ skin_id: skin.id, ...form })
      const newReview = { id: Date.now(), ...form, created_at: new Date().toISOString().split('T')[0] }
      setReviews(prev => [newReview, ...prev])
      setForm({ player_name: '', rating: 5, comment: '' })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#111118] border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Rarity accent */}
        <div className="h-1 rounded-t-2xl sm:rounded-t-2xl" style={{ background: rarityInfo.color }} />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: rarityInfo.color }}>
              {rarityInfo.label}
            </p>
            <h2 className="text-white font-bold text-lg leading-tight">{skin.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Image + stats */}
          <div className="flex gap-4">
            <div className="bg-[#1a1a28] rounded-xl flex items-center justify-center p-3 w-32 h-28 shrink-0">
              <img src={skin.image} alt={skin.name} className="h-full object-contain drop-shadow-lg"
                onError={e => { e.target.style.display = 'none' }} />
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-6">
                <span className="text-gray-500">Preço</span>
                <span className="text-[#f0a500] font-bold">${skin.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-500">Categoria</span>
                <span className="text-gray-200">{skin.category}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-500">Desgaste</span>
                <span className="text-gray-200">{skin.wear}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-500">Float</span>
                <span className="text-gray-200">{skin.float}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-500">Avaliação</span>
                <span className="text-gray-200">⭐ {skin.rating} ({skin.reviews_count})</span>
              </div>
            </div>
          </div>

          {/* Review form */}
          <div className="border border-white/5 rounded-xl p-4 bg-[#0d0d14]">
            <h3 className="text-white text-sm font-semibold mb-3">Deixar avaliação</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Seu nick no CS2"
                value={form.player_name}
                onChange={e => setForm(f => ({ ...f, player_name: e.target.value }))}
                className="w-full bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f0a500]/50"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Nota:</span>
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i} type="button"
                    onClick={() => setForm(f => ({ ...f, rating: i }))}
                    className={`text-lg transition-transform hover:scale-110 ${i <= form.rating ? 'text-[#f0a500]' : 'text-gray-700'}`}
                  >★</button>
                ))}
              </div>
              <textarea
                placeholder="Conte sua experiência com essa skin..."
                value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                rows={2}
                className="w-full bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f0a500]/50 resize-none"
              />
              <button
                type="submit"
                disabled={submitting || !form.player_name || !form.comment}
                className="w-full py-2 rounded-lg text-sm font-semibold bg-[#f0a500] text-black hover:bg-[#f0a500]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Enviando...' : submitted ? '✓ Enviado!' : 'Enviar avaliação'}
              </button>
            </form>
          </div>

          {/* Reviews list */}
          <div className="space-y-2">
            <h3 className="text-white text-sm font-semibold">Avaliações ({reviews.length})</h3>
            {reviews.map(r => (
              <div key={r.id} className="bg-[#0d0d14] border border-white/5 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-300">{r.player_name}</span>
                  <span className="text-xs text-gray-600">{r.created_at}</span>
                </div>
                <div className="text-[#f0a500] text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p className="text-xs text-gray-400">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
