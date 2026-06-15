import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { cases, skins, caseSkins } from "./drizzle/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

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

const skinData = [
  // Chroma skins
  {
    name: "AK-47 | Neon Rider",
    rarity: "covert",
    rarityColor: "#EB4B4B",
    rarityChance: 0.5,
    caseId: 1,
    weight: 1,
  },
  {
    name: "M4A1-S | Atomic Alloy",
    rarity: "classified",
    rarityColor: "#8847FF",
    rarityChance: 1.5,
    caseId: 1,
    weight: 2,
  },
  {
    name: "AWP Dragon Lore",
    rarity: "covert",
    rarityColor: "#EB4B4B",
    rarityChance: 0.3,
    caseId: 1,
    weight: 1,
  },
  {
    name: "P250 | Mehndi",
    rarity: "restricted",
    rarityColor: "#4B69FF",
    rarityChance: 3.2,
    caseId: 1,
    weight: 3,
  },
  {
    name: "Glock-18 | Catacombs",
    rarity: "milspec",
    rarityColor: "#4B69FF",
    rarityChance: 5.0,
    caseId: 1,
    weight: 5,
  },
  {
    name: "USP-S | Orion",
    rarity: "classified",
    rarityColor: "#8847FF",
    rarityChance: 1.5,
    caseId: 1,
    weight: 2,
  },

  // Gamma skins
  {
    name: "Karambit | Gamma Doppler",
    rarity: "covert",
    rarityColor: "#EB4B4B",
    rarityChance: 0.5,
    caseId: 2,
    weight: 1,
  },
  {
    name: "M9 Bayonet | Gamma Case",
    rarity: "covert",
    rarityColor: "#EB4B4B",
    rarityChance: 0.5,
    caseId: 2,
    weight: 1,
  },
  {
    name: "AK-47 | Phantom Disruptor",
    rarity: "classified",
    rarityColor: "#8847FF",
    rarityChance: 1.5,
    caseId: 2,
    weight: 2,
  },
  {
    name: "M4A4 | Asiimov",
    rarity: "classified",
    rarityColor: "#8847FF",
    rarityChance: 1.5,
    caseId: 2,
    weight: 2,
  },
  {
    name: "AWP Asiimov",
    rarity: "covert",
    rarityColor: "#EB4B4B",
    rarityChance: 0.3,
    caseId: 2,
    weight: 1,
  },
  {
    name: "Five-SeveN | Neon Kimono",
    rarity: "restricted",
    rarityColor: "#4B69FF",
    rarityChance: 3.2,
    caseId: 2,
    weight: 3,
  },

  // Prisma skins
  {
    name: "Butterfly Knife | Fade",
    rarity: "covert",
    rarityColor: "#EB4B4B",
    rarityChance: 0.5,
    caseId: 3,
    weight: 1,
  },
  {
    name: "Huntsman Knife | Marble Fade",
    rarity: "covert",
    rarityColor: "#EB4B4B",
    rarityChance: 0.5,
    caseId: 3,
    weight: 1,
  },
  {
    name: "AK-47 | Neon Rider",
    rarity: "classified",
    rarityColor: "#8847FF",
    rarityChance: 1.5,
    caseId: 3,
    weight: 2,
  },
  {
    name: "M4A1-S | Printstream",
    rarity: "classified",
    rarityColor: "#8847FF",
    rarityChance: 1.5,
    caseId: 3,
    weight: 2,
  },
  {
    name: "AWP Skin",
    rarity: "covert",
    rarityColor: "#EB4B4B",
    rarityChance: 0.3,
    caseId: 3,
    weight: 1,
  },
  {
    name: "Desert Eagle | Printstream",
    rarity: "restricted",
    rarityColor: "#4B69FF",
    rarityChance: 3.2,
    caseId: 3,
    weight: 3,
  },
];

try {
  console.log("🌱 Starting database seed...");

  // Insert cases
  console.log("📦 Inserting cases...");
  const insertedCases = await db.insert(cases).values(caseData);
  console.log(`✅ Inserted ${caseData.length} cases`);

  // Insert skins
  console.log("🎨 Inserting skins...");
  const skinsToInsert = skinData.map(({ caseId, weight, ...skin }) => skin);
  const insertedSkins = await db.insert(skins).values(skinsToInsert);
  console.log(`✅ Inserted ${skinsToInsert.length} skins`);

  // Get all inserted skins
  const allSkins = await db.select().from(skins);
  const allCases = await db.select().from(cases);

  // Insert case-skin relationships
  console.log("🔗 Linking skins to cases...");
  const caseSkinRelations = [];
  let skinIndex = 0;

  for (const skin of skinData) {
    const caseItem = allCases.find((c) => c.name === caseData[skin.caseId - 1]?.name);
    const skinItem = allSkins[skinIndex];

    if (caseItem && skinItem) {
      caseSkinRelations.push({
        caseId: caseItem.id,
        skinId: skinItem.id,
        weight: skin.weight,
      });
    }
    skinIndex++;
  }

  await db.insert(caseSkins).values(caseSkinRelations);
  console.log(`✅ Linked ${caseSkinRelations.length} skin-case relationships`);

  console.log("\n✨ Database seed completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("❌ Seed failed:", error);
  process.exit(1);
} finally {
  await connection.end();
}
