import { decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cases table: represents available loot boxes (Chroma, Gamma, Prisma, etc.)
 */
export const cases = mysqlTable("cases", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  image: varchar("image", { length: 512 }),
  rarity: varchar("rarity", { length: 64 }).notNull(), // e.g., "rare", "legendary"
  keyPrice: int("keyPrice").default(1).notNull(), // number of keys required to open
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Case = typeof cases.$inferSelect;
export type InsertCase = typeof cases.$inferInsert;

/**
 * Skins table: individual items that can be obtained from cases
 */
export const skins = mysqlTable("skins", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  image: varchar("image", { length: 512 }),
  rarity: varchar("rarity", { length: 64 }).notNull(), // "consumer", "industrial", "milspec", etc.
  rarityColor: varchar("rarityColor", { length: 7 }).default("#888888"), // hex color for rarity
  rarityChance: decimal("rarityChance", { precision: 5, scale: 2 }).default("1.00"), // percentage chance
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Skin = typeof skins.$inferSelect;
export type InsertSkin = typeof skins.$inferInsert;

/**
 * CaseSkins junction table: maps skins to cases (many-to-many)
 */
export const caseSkins = mysqlTable("caseSkins", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  skinId: int("skinId").notNull(),
  weight: int("weight").default(1).notNull(), // for weighted random selection
});

export type CaseSkin = typeof caseSkins.$inferSelect;
export type InsertCaseSkin = typeof caseSkins.$inferInsert;

/**
 * Keys table: tracks key balance per user per case type
 */
export const keys = mysqlTable("keys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  caseId: int("caseId").notNull(),
  balance: int("balance").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Key = typeof keys.$inferSelect;
export type InsertKey = typeof keys.$inferInsert;

/**
 * Inventory table: tracks skins owned by users
 */
export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  skinId: int("skinId").notNull(),
  caseId: int("caseId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  obtainedAt: timestamp("obtainedAt").defaultNow().notNull(),
});

export type InventoryItem = typeof inventory.$inferSelect;
export type InsertInventoryItem = typeof inventory.$inferInsert;

/**
 * AimTrainerScores table: tracks scores from the aim trainer minigame
 */
export const aimTrainerScores = mysqlTable("aimTrainerScores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  score: int("score").notNull(),
  targetsHit: int("targetsHit").notNull(),
  totalTargets: int("totalTargets").notNull(),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }).notNull(),
  keysEarned: int("keysEarned").default(0).notNull(),
  caseId: int("caseId"), // which case type the keys are for
  playedAt: timestamp("playedAt").defaultNow().notNull(),
});

export type AimTrainerScore = typeof aimTrainerScores.$inferSelect;
export type InsertAimTrainerScore = typeof aimTrainerScores.$inferInsert;

/**
 * Relations for Drizzle ORM
 */
export const usersRelations = relations(users, ({ many }) => ({
  keys: many(keys),
  inventory: many(inventory),
  aimTrainerScores: many(aimTrainerScores),
}));

export const casesRelations = relations(cases, ({ many }) => ({
  skins: many(caseSkins),
  keys: many(keys),
  inventory: many(inventory),
}));

export const skinsRelations = relations(skins, ({ many }) => ({
  cases: many(caseSkins),
  inventory: many(inventory),
}));

export const caseSkinRelations = relations(caseSkins, ({ one }) => ({
  case: one(cases, { fields: [caseSkins.caseId], references: [cases.id] }),
  skin: one(skins, { fields: [caseSkins.skinId], references: [skins.id] }),
}));

export const keysRelations = relations(keys, ({ one }) => ({
  user: one(users, { fields: [keys.userId], references: [users.id] }),
  case: one(cases, { fields: [keys.caseId], references: [cases.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  user: one(users, { fields: [inventory.userId], references: [users.id] }),
  skin: one(skins, { fields: [inventory.skinId], references: [skins.id] }),
  case: one(cases, { fields: [inventory.caseId], references: [cases.id] }),
}));

export const aimTrainerScoresRelations = relations(aimTrainerScores, ({ one }) => ({
  user: one(users, { fields: [aimTrainerScores.userId], references: [users.id] }),
  case: one(cases, { fields: [aimTrainerScores.caseId], references: [cases.id] }),
}));