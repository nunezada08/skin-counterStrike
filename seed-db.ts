import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { cases, skins, caseSkins } from "./drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

// Fetch skins from CSGO-API
async function fetchSkinsFromAPI() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json"
    );
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch skins from API:", error);
    return [];
  }
}

const caseData = [
  {
    name: "Chroma Case",
    description: "Chroma Case contains a curated selection of weapons with Chroma finishes.",
    rarity: "rare",
    keyPrice: 1,
  },
  {
    name: "Gamma Case",
    description: "Gamma Case contains a curated selection of weapons with Gamma finishes.",
    rarity: "rare",
    keyPrice: 1,
  },
  {
    name: "Prisma Case",
    description: "Prisma Case contains a curated selection of weapons with Prisma finishes.",
    rarity: "rare",
    keyPrice: 1,
  },
];

// Manually curated skins - will match against API by weapon + pattern name
const skinData = [
  // Chroma skins
  { weapon: "AK-47", pattern: "AK-47 | Neon Rider", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 1, weight: 1 },
  { weapon: "M4A1-S", pattern: "M4A1-S | Atomic Alloy", rarity: "classified", rarityColor: "#8847FF", rarityChance: 1.5, caseId: 1, weight: 2 },
  { weapon: "AK-47", pattern: "AK-47 | Asiimov", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 1, weight: 1 },
  { weapon: "M4A4", pattern: "M4A4 | Howl", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 1, weight: 1 },
  { weapon: "Karambit", pattern: "Karambit | Fade", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 1, weight: 1 },
  { weapon: "USP-S", pattern: "USP-S | Orion", rarity: "classified", rarityColor: "#8847FF", rarityChance: 1.5, caseId: 1, weight: 2 },
  { weapon: "P250", pattern: "P250 | Dragon King", rarity: "restricted", rarityColor: "#4B69FF", rarityChance: 3.0, caseId: 1, weight: 3 },
  { weapon: "Glock-18", pattern: "Glock-18 | Dragon Tattoo", rarity: "mil-spec", rarityColor: "#4B7EC9", rarityChance: 5.0, caseId: 1, weight: 5 },
  { weapon: "AK-47", pattern: "AK-47 | Phantom Disruptor", rarity: "restricted", rarityColor: "#4B69FF", rarityChance: 3.0, caseId: 1, weight: 3 },
  { weapon: "M4A1-S", pattern: "M4A1-S | Nightmare", rarity: "mil-spec", rarityColor: "#4B7EC9", rarityChance: 5.0, caseId: 1, weight: 5 },
  { weapon: "Five-SeveN", pattern: "Five-SeveN | Neon Kimono", rarity: "restricted", rarityColor: "#4B69FF", rarityChance: 3.0, caseId: 1, weight: 3 },
  { weapon: "Desert Eagle", pattern: "Desert Eagle | Kumicho Dragon", rarity: "classified", rarityColor: "#8847FF", rarityChance: 1.5, caseId: 1, weight: 2 },

  // Gamma skins
  { weapon: "M4A1-S", pattern: "M4A1-S | Icarus Fell", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 2, weight: 1 },
  { weapon: "AWP", pattern: "AWP | Dragon Lore", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 2, weight: 1 },
  { weapon: "Bayonet", pattern: "Bayonet | Doppler", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 2, weight: 1 },
  { weapon: "M9 Bayonet", pattern: "M9 Bayonet | Doppler", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 2, weight: 1 },
  { weapon: "Huntsman Knife", pattern: "Huntsman Knife | Doppler", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 2, weight: 1 },
  { weapon: "AK-47", pattern: "AK-47 | Phantom Disruptor", rarity: "classified", rarityColor: "#8847FF", rarityChance: 1.5, caseId: 2, weight: 2 },
  { weapon: "USP-S", pattern: "USP-S | Orion", rarity: "classified", rarityColor: "#8847FF", rarityChance: 1.5, caseId: 2, weight: 2 },
  { weapon: "P250", pattern: "P250 | Mehndi", rarity: "restricted", rarityColor: "#4B69FF", rarityChance: 3.0, caseId: 2, weight: 3 },
  { weapon: "Glock-18", pattern: "Glock-18 | Weasel", rarity: "mil-spec", rarityColor: "#4B7EC9", rarityChance: 5.0, caseId: 2, weight: 5 },
  { weapon: "M4A4", pattern: "M4A4 | Desolate Space", rarity: "restricted", rarityColor: "#4B69FF", rarityChance: 3.0, caseId: 2, weight: 3 },
  { weapon: "AK-47", pattern: "AK-47 | Neon Rider", rarity: "mil-spec", rarityColor: "#4B7EC9", rarityChance: 5.0, caseId: 2, weight: 5 },
  { weapon: "AWP", pattern: "AWP | Corticera", rarity: "restricted", rarityColor: "#4B69FF", rarityChance: 3.0, caseId: 2, weight: 3 },

  // Prisma skins
  { weapon: "M4A1-S", pattern: "M4A1-S | Printstream", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 3, weight: 1 },
  { weapon: "AWP", pattern: "AWP | Dragon Lore", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 3, weight: 1 },
  { weapon: "Butterfly Knife", pattern: "Butterfly Knife | Doppler", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 3, weight: 1 },
  { weapon: "Karambit", pattern: "Karambit | Lore", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 3, weight: 1 },
  { weapon: "Talon Knife", pattern: "Talon Knife | Doppler", rarity: "covert", rarityColor: "#EB4B4B", rarityChance: 0.5, caseId: 3, weight: 1 },
  { weapon: "AK-47", pattern: "AK-47 | Neon Rider", rarity: "classified", rarityColor: "#8847FF", rarityChance: 1.5, caseId: 3, weight: 2 },
  { weapon: "M4A4", pattern: "M4A4 | Howl", rarity: "classified", rarityColor: "#8847FF", rarityChance: 1.5, caseId: 3, weight: 2 },
  { weapon: "AWP", pattern: "AWP | Asiimov", rarity: "restricted", rarityColor: "#4B69FF", rarityChance: 3.0, caseId: 3, weight: 3 },
  { weapon: "Desert Eagle", pattern: "Desert Eagle | Blaze", rarity: "mil-spec", rarityColor: "#4B7EC9", rarityChance: 5.0, caseId: 3, weight: 5 },
  { weapon: "USP-S", pattern: "USP-S | Kill Confirmed", rarity: "restricted", rarityColor: "#4B69FF", rarityChance: 3.0, caseId: 3, weight: 3 },
  { weapon: "P250", pattern: "P250 | Nuclear Threat", rarity: "mil-spec", rarityColor: "#4B7EC9", rarityChance: 5.0, caseId: 3, weight: 5 },
  { weapon: "Glock-18", pattern: "Glock-18 | Aquamarine Revenge", rarity: "restricted", rarityColor: "#4B69FF", rarityChance: 3.0, caseId: 3, weight: 3 },
];

async function seed() {
  try {
    console.log("Fetching skins from CSGO-API...");
    const apiSkins = await fetchSkinsFromAPI();
    console.log(`Fetched ${apiSkins.length} skins from API`);

    // Create a map of weapon + pattern to API data
    // API format: { weapon: { name: "AK-47" }, name: "AK-47 | Asiimov", image: "url" }
    const skinMap = new Map();
    apiSkins.forEach((skin: any) => {
      if (skin.weapon?.name && skin.name && skin.image) {
        // Extract the pattern part (everything after the first weapon name)
        // API returns: "AK-47 | AK-47 | Neon Rider" -> we want "Neon Rider"
        const parts = skin.name.split(' | ');
        const pattern = parts.length > 2 ? parts.slice(2).join(' | ') : parts[parts.length - 1];
        const key = `${skin.weapon.name}|${skin.weapon.name} | ${pattern}`;
        skinMap.set(key, skin);
      }
    });

    console.log(`Created map with ${skinMap.size} skins from API`);

    // Insert cases
    console.log("Inserting cases...");
    for (const caseItem of caseData) {
      await db.insert(cases).values({
        name: caseItem.name,
        description: caseItem.description,
        rarity: caseItem.rarity,
        keyPrice: caseItem.keyPrice,
      });
    }
    console.log("Cases inserted successfully");

    // Insert skins with images from API
    console.log("Inserting skins with images from API...");
    for (const skinItem of skinData) {
      const key = `${skinItem.weapon}|${skinItem.pattern}`;
      const apiSkin = skinMap.get(key);
      const imageUrl = apiSkin?.image || null;

      if (!imageUrl) {
        console.warn(`No image found for: ${skinItem.pattern}`);
      } else {
        console.log(`✓ Found image for: ${skinItem.pattern}`);
      }

      await db.insert(skins).values({
        name: skinItem.pattern,
        rarity: skinItem.rarity,
        rarityColor: skinItem.rarityColor,
        rarityChance: skinItem.rarityChance.toString(),
        image: imageUrl,
      });
    }
    console.log("Skins inserted successfully");

    // Insert case-skin relationships
    console.log("Inserting case-skin relationships...");
    for (let i = 0; i < skinData.length; i++) {
      const skinItem = skinData[i];
      await db.insert(caseSkins).values({
        caseId: skinItem.caseId,
        skinId: i + 1,
        weight: skinItem.weight,
      });
    }
    console.log("Case-skin relationships inserted successfully");

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
