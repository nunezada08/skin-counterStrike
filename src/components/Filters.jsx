import { RARITIES } from '../data/mockSkins';

const CATEGORIES = [
    'Rifle',
    'Pistol',
    'Sniper',
    'SMG',
    'Shotgun',
    'Machine Gun',
    'Knife',
    'Gloves',
    'Other',
];

export default function Filters({
    search,
    setSearch,
    rarity,
    setRarity,
    category,
    setCategory,
    sortBy,
    setSortBy,
    resetFilters,
    totalCount,
}) {
    const hasFilters = search || rarity || category || sortBy !== 'name';

    return (
        <div className="space-y-3">
            <div className="relative">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar skin..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#111118] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f0a500]/50 transition-colors"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        ✕
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                <select
                    value={rarity}
                    onChange={(e) => setRarity(e.target.value)}
                    className="bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#f0a500]/50 flex-1 min-w-[130px]">
                    <option value="">Todas as raridades</option>
                    {RARITIES.map((r) => (
                        <option key={r.value} value={r.value}>
                            {r.label}
                        </option>
                    ))}
                </select>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#f0a500]/50 flex-1 min-w-[120px]">
                    <option value="">Todas as categorias</option>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#111118] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#f0a500]/50 flex-1 min-w-[130px]">
                    <option value="name">Nome (A-Z)</option>
                    <option value="price_asc">Menor preço</option>
                    <option value="price_desc">Maior preço</option>
                    <option value="rating">Melhor avaliação</option>
                </select>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                    {totalCount} skin{totalCount !== 1 ? 's' : ''} encontrada
                    {totalCount !== 1 ? 's' : ''}
                </span>
                {hasFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs text-[#f0a500] hover:text-[#f0a500]/70 transition-colors">
                        Limpar filtros
                    </button>
                )}
            </div>
        </div>
    );
}
