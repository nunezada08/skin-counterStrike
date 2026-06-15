import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json';

const RARITY_NAME_MAP = {
    'Consumer Grade': 'consumer',
    'Industrial Grade': 'industrial',
    'Mil-Spec Grade': 'milspec',
    Restricted: 'restricted',
    Classified: 'classified',
    Covert: 'covert',
    Contraband: 'gold',
    'Rare Special': 'gold',
};

const WEAPON_TYPE_MAP = {
    Rifle: 'Rifle',
    Pistol: 'Pistol',
    'Sniper Rifle': 'Sniper',
    'Submachine Gun': 'SMG',
    Shotgun: 'Shotgun',
    'Machine Gun': 'Machine Gun',
    Knife: 'Knife',
    Gloves: 'Gloves',
};

function normalizeApiSkin(raw, index) {
    const rarityName = raw.rarity?.name || '';
    const weaponType = raw.weapon?.weapon_type || raw.category?.name || '';

    return {
        id: raw.id || index,
        name: raw.name || 'Unknown',
        category: WEAPON_TYPE_MAP[weaponType] || weaponType || 'Other',
        rarity: RARITY_NAME_MAP[rarityName] || 'consumer',
        price: 0,
        wear: raw.wears?.[0]?.name || 'Factory New',
        float: raw.min_float ?? 0,
        image: raw.image || '',
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        reviews_count: Math.floor(Math.random() * 500),
        description: raw.description || '',
        stattrak: raw.stattrak || false,
        souvenir: raw.souvenir || false,
    };
}

export function useSkins() {
    const [allSkins, setAllSkins] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [rarity, setRarity] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error('Falha ao buscar skins');
                return res.json();
            })
            .then((data) => {
                if (cancelled) return;
                const normalized = data.map(normalizeApiSkin);
                setAllSkins(normalized);
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err.message);
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let result = [...allSkins];

        if (search)
            result = result.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
        if (rarity) result = result.filter((s) => s.rarity === rarity);
        if (category) result = result.filter((s) => s.category === category);

        switch (sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                result.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFiltered(result);
    }, [allSkins, search, rarity, category, sortBy]);

    const resetFilters = useCallback(() => {
        setSearch('');
        setRarity('');
        setCategory('');
        setSortBy('name');
    }, []);

    return {
        skins: filtered,
        loading,
        error,
        search,
        setSearch,
        rarity,
        setRarity,
        category,
        setCategory,
        sortBy,
        setSortBy,
        resetFilters,
    };
}
