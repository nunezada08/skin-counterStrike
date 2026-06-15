import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set. Using mock mode.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// ─── Skins ────────────────────────────────────────────────────────────────────

export async function fetchSkins({ search = '', rarity = '', category = '', sortBy = 'name' } = {}) {
  let query = supabase
    .from('skins')
    .select('*')
    .order(sortBy === 'price_asc' ? 'price' : sortBy === 'price_desc' ? 'price' : 'name', {
      ascending: sortBy !== 'price_desc',
    })

  if (search) query = query.ilike('name', `%${search}%`)
  if (rarity) query = query.eq('rarity', rarity)
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchSkinById(id) {
  const { data, error } = await supabase.from('skins').select('*, reviews(*)').eq('id', id).single()
  if (error) throw error
  return data
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function insertReview({ skin_id, player_name, rating, comment }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ skin_id, player_name, rating, comment }])
    .select()
  if (error) throw error
  return data[0]
}

export async function fetchReviews(skin_id) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('skin_id', skin_id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ─── Ideias (conforme solicitado) ─────────────────────────────────────────────

export async function insertIdeia({ titulo, descricao, autor }) {
  const { data, error } = await supabase
    .from('ideias')
    .insert([{ titulo, descricao, autor }])
    .select()
  if (error) throw error
  return data[0]
}

export async function fetchIdeias() {
  const { data, error } = await supabase
    .from('ideias')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
