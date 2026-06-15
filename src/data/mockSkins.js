export const RARITIES = [
  { label: 'Consumer Grade', value: 'consumer', color: '#b0b0b0', chance: 35.0 },
  { label: 'Industrial Grade', value: 'industrial', color: '#5e98d9', chance: 25.0 },
  { label: 'Mil-Spec', value: 'milspec', color: '#4b69ff', chance: 20.0 },
  { label: 'Restricted', value: 'restricted', color: '#8847ff', chance: 10.0 },
  { label: 'Classified', value: 'classified', color: '#d32ce6', chance: 7.0 },
  { label: 'Covert', value: 'covert', color: '#eb4b4b', chance: 2.5 },
  { label: 'Rare Special', value: 'gold', color: '#e4ae39', chance: 0.5 },
]

export const CATEGORIES = ['Rifle', 'Pistol', 'Sniper', 'SMG', 'Shotgun', 'Knife', 'Gloves']

export const MOCK_SKINS = [
  {
    id: 1, name: 'AK-47 | Redline', category: 'Rifle', rarity: 'classified',
    price: 18.50, wear: 'Field-Tested', float: 0.23,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYQABm57KxANo1fHYfSxQ7aTnk9TeNbyFqmJWuFRz2-2Z84yj3Abt-RI/360fx360f',
    rating: 4.7, reviews_count: 312,
  },
  {
    id: 2, name: 'AWP | Dragon Lore', category: 'Sniper', rarity: 'gold',
    price: 4200.00, wear: 'Factory New', float: 0.01,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYAEBn6StKgZj1efPfThA74vmkNSLkPLnIa_Vl2JccJNy2rnApt2miVGx_UdpZGmmIoSUeVQ5NuiE4A/360fx360f',
    rating: 5.0, reviews_count: 1048,
  },
  {
    id: 3, name: 'M4A4 | Howl', category: 'Rifle', rarity: 'covert',
    price: 1800.00, wear: 'Minimal Wear', float: 0.09,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYQEBn6StKgZ37P_BdjJB4YCJlIWZnObiNLKFl2oRv5Nw3bGTpNig3QfmrRBqNz37dtOce1g5NFTQ-A/360fx360f',
    rating: 4.9, reviews_count: 876,
  },
  {
    id: 4, name: 'Glock-18 | Fade', category: 'Pistol', rarity: 'restricted',
    price: 220.00, wear: 'Factory New', float: 0.02,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYAEBn6StKg9t1fXbdC9h7Y3ih9TZkfOiMrzUwGMJ6pYhiLrAp9-lilCy_Rdqa2unJdWOewJuYOqBrA/360fx360f',
    rating: 4.5, reviews_count: 198,
  },
  {
    id: 5, name: 'Karambit | Doppler', category: 'Knife', rarity: 'gold',
    price: 950.00, wear: 'Factory New', float: 0.03,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYBANmoStKgYv0fLIdQJO5OKxkdSJwfOjYbqFl2oRv5NwjrCC8I_x3QTp-EoqYGigdYfEdlRmMuuEqFU/360fx360f',
    rating: 4.8, reviews_count: 654,
  },
  {
    id: 6, name: 'Desert Eagle | Blaze', category: 'Pistol', rarity: 'classified',
    price: 380.00, wear: 'Factory New', float: 0.01,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYBANmoStKgYv1af3fzhQ6eGzk9nQwKKjY7KIZQMC6sR239-QpIr2j1Di_0M4MWmncoSOewRmNuvb/360fx360f',
    rating: 4.6, reviews_count: 422,
  },
  {
    id: 7, name: 'AK-47 | Fire Serpent', category: 'Rifle', rarity: 'covert',
    price: 750.00, wear: 'Field-Tested', float: 0.20,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYAIBn6StKgZj1efPfThA74vmkNSLkfyiMryAwGlRv5Ir2unQrd7xiAy3rklpN2j5cYLEdAE4N1g8/360fx360f',
    rating: 4.7, reviews_count: 534,
  },
  {
    id: 8, name: 'MP9 | Hot Rod', category: 'SMG', rarity: 'classified',
    price: 88.00, wear: 'Factory New', float: 0.04,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYAAInoStKgZj7fXHcTgQ6Y3vmYfbwqajNLiBxm8IvsJyi7uY84-t0Aa2rBosYjvyctKXe1I9aJaX/360fx360f',
    rating: 4.2, reviews_count: 143,
  },
  {
    id: 9, name: 'USP-S | Kill Confirmed', category: 'Pistol', rarity: 'covert',
    price: 95.00, wear: 'Minimal Wear', float: 0.11,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYAAInoStKgZ_7P_BdjJB0YSMlY-Jx6mqZbSAxz0FscJw3L_FpN2k21Gy-UprY2unI9OXaVQ4N1kB/360fx360f',
    rating: 4.4, reviews_count: 267,
  },
  {
    id: 10, name: 'AWP | Asiimov', category: 'Sniper', rarity: 'covert',
    price: 68.00, wear: 'Field-Tested', float: 0.25,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYQEBn6StKgZ_7P_BdjJB0YaJlIWZnOKjZr-AzjhT6cQk27CX89n0iw3irUFqMWj-cYeMegRqYg/360fx360f',
    rating: 4.3, reviews_count: 890,
  },
  {
    id: 11, name: 'M4A1-S | Hyper Beast', category: 'Rifle', rarity: 'covert',
    price: 45.00, wear: 'Field-Tested', float: 0.22,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYgABn6StKgZj1efPfThA74vmkNSLkPOuZ7-FxjhSvJMh2-jGoNz3ig3g_RolYGugcY-TdQQ4MvuGrA/360fx360f',
    rating: 4.1, reviews_count: 445,
  },
  {
    id: 12, name: 'P250 | Sand Dune', category: 'Pistol', rarity: 'consumer',
    price: 0.04, wear: 'Factory New', float: 0.05,
    image: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I4D0CgZFpniGfoeJRBjFdBuXU2w9GRZUCx3ZEv4SqiLumMZ3TIitiYAAInoStKgZ_7P_BdjJB0YeJl4OClY-JwqGFl2oRv5NwjLzAodmijFaz_EovZ2quJNWVcg4_aJSE/360fx360f',
    rating: 3.2, reviews_count: 45,
  },
]
