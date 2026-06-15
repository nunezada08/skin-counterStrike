import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, cases, caseSkins, skins, keys, inventory, aimTrainerScores } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Cases queries
export async function getAllCases() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cases);
}

export async function getCaseById(caseId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1);
  return result[0] || null;
}

// Skins queries
export async function getSkinsByCaseId(caseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: skins.id,
      name: skins.name,
      image: skins.image,
      rarity: skins.rarity,
      rarityColor: skins.rarityColor,
      rarityChance: skins.rarityChance,
      weight: caseSkins.weight,
    })
    .from(caseSkins)
    .innerJoin(skins, eq(caseSkins.skinId, skins.id))
    .where(eq(caseSkins.caseId, caseId));
}

export async function getSkinById(skinId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(skins).where(eq(skins.id, skinId)).limit(1);
  return result[0] || null;
}

// Keys queries
export async function getUserKeyBalance(userId: number, caseId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select()
    .from(keys)
    .where(and(eq(keys.userId, userId), eq(keys.caseId, caseId)))
    .limit(1);
  return result[0]?.balance || 0;
}

export async function getUserAllKeys(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(keys).where(eq(keys.userId, userId));
}

export async function addKeys(userId: number, caseId: number, amount: number) {
  const db = await getDb();
  if (!db) return;
  const currentBalance = await getUserKeyBalance(userId, caseId);
  await db
    .insert(keys)
    .values({ userId, caseId, balance: currentBalance + amount })
    .onDuplicateKeyUpdate({
      set: { balance: currentBalance + amount },
    });
}

export async function consumeKey(userId: number, caseId: number) {
  const db = await getDb();
  if (!db) return false;
  const currentBalance = await getUserKeyBalance(userId, caseId);
  if (currentBalance < 1) return false;
  await db
    .insert(keys)
    .values({ userId, caseId, balance: currentBalance - 1 })
    .onDuplicateKeyUpdate({
      set: { balance: currentBalance - 1 },
    });
  return true;
}

// Inventory queries
export async function getUserInventory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: inventory.id,
      userId: inventory.userId,
      skinId: inventory.skinId,
      caseId: inventory.caseId,
      quantity: inventory.quantity,
      obtainedAt: inventory.obtainedAt,
      skinName: skins.name,
      skinImage: skins.image,
      skinRarity: skins.rarity,
      skinRarityColor: skins.rarityColor,
      caseName: cases.name,
    })
    .from(inventory)
    .leftJoin(skins, eq(inventory.skinId, skins.id))
    .leftJoin(cases, eq(inventory.caseId, cases.id))
    .where(eq(inventory.userId, userId))
    .orderBy(inventory.obtainedAt);
}

export async function addToInventory(userId: number, skinId: number, caseId: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db
    .select()
    .from(inventory)
    .where(and(eq(inventory.userId, userId), eq(inventory.skinId, skinId), eq(inventory.caseId, caseId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(inventory)
      .set({ quantity: existing[0].quantity + 1 })
      .where(eq(inventory.id, existing[0].id));
  } else {
    await db.insert(inventory).values({ userId, skinId, caseId, quantity: 1 });
  }
}

// Aim Trainer queries
export async function saveAimTrainerScore(
  userId: number,
  score: number,
  targetsHit: number,
  totalTargets: number,
  accuracy: number,
  keysEarned: number,
  caseId?: number
) {
  const db = await getDb();
  if (!db) return;
  await db.insert(aimTrainerScores).values({
    userId,
    score,
    targetsHit,
    totalTargets,
    accuracy: accuracy.toString() as any,
    keysEarned,
    caseId,
  });
}

// Import necessary types and functions

