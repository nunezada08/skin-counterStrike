import { useState, useEffect, useCallback } from 'react'
import { MOCK_SKINS } from '../data/mockSkins'

// In production, swap MOCK_SKINS with fetchSkins() from supabase.js
// import { fetchSkins } from '../lib/supabase'

export function useSkins() {
  const [skins, setSkins] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [rarity, setRarity] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    // Simulates async fetch — replace body with: const data = await fetchSkins()
    const timer = setTimeout(() => {
      setSkins(MOCK_SKINS)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let result = [...skins]

    if (search) {
      result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (rarity) {
      result = result.filter(s => s.rarity === rarity)
    }
    if (category) {
      result = result.filter(s => s.category === category)
    }

    switch (sortBy) {
      case 'price_asc':  result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result.sort((a, b) => b.price - a.price); break
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break
      default:           result.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFiltered(result)
  }, [skins, search, rarity, category, sortBy])

  const resetFilters = useCallback(() => {
    setSearch(''); setRarity(''); setCategory(''); setSortBy('name')
  }, [])

  return { skins: filtered, loading, search, setSearch, rarity, setRarity, category, setCategory, sortBy, setSortBy, resetFilters }
}
