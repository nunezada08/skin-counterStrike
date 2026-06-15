import { useState } from 'react'
import { useSkins } from '../hooks/useSkins'
import SkinCard from '../components/SkinCard'
import Filters from '../components/Filters'
import SkinModal from '../components/SkinModal'

function SkeletonCard() {
  return (
    <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden animate-pulse">
      <div className="h-0.5 bg-gray-800" />
      <div className="h-36 bg-[#1a1a28]" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
        <div className="h-3 bg-gray-800 rounded w-1/3" />
      </div>
    </div>
  )
}

export default function SkinsPage() {
  const { skins, loading, ...filterProps } = useSkins()
  const [selectedSkin, setSelectedSkin] = useState(null)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Hero headline */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Mercado de <span className="text-[#f0a500]">Skins CS2</span>
        </h1>
        <p className="text-gray-500 text-sm">Explore, filtre e avalie as skins do Counter-Strike 2.</p>
      </div>

      {/* Filters */}
      <Filters {...filterProps} totalCount={skins.length} />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : skins.length === 0 ? (
        <div className="text-center py-20 space-y-2">
          <p className="text-4xl">🔍</p>
          <p className="text-gray-400 font-medium">Nenhuma skin encontrada</p>
          <p className="text-gray-600 text-sm">Tente ajustar os filtros de busca.</p>
          <button onClick={filterProps.resetFilters} className="mt-2 text-sm text-[#f0a500] hover:underline">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {skins.map(skin => (
            <SkinCard key={skin.id} skin={skin} onClick={setSelectedSkin} />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedSkin && <SkinModal skin={selectedSkin} onClose={() => setSelectedSkin(null)} />}
    </div>
  )
}
