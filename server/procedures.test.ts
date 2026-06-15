import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("tRPC Procedures", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("cases.list", () => {
    it("should return a list of cases", async () => {
      const cases = await caller.cases.list();
      expect(Array.isArray(cases)).toBe(true);
      expect(cases.length).toBeGreaterThan(0);
      expect(cases[0]).toHaveProperty("id");
      expect(cases[0]).toHaveProperty("name");
    });
  });

  describe("cases.getSkins", () => {
    it("should return skins for a specific case", async () => {
      const skins = await caller.cases.getSkins({ caseId: 1 });
      expect(Array.isArray(skins)).toBe(true);
      expect(skins.length).toBeGreaterThan(0);
      expect(skins[0]).toHaveProperty("name");
      expect(skins[0]).toHaveProperty("rarity");
    });

    it("should return empty array for non-existent case", async () => {
      const skins = await caller.cases.getSkins({ caseId: 9999 });
      expect(Array.isArray(skins)).toBe(true);
      expect(skins.length).toBe(0);
    });
  });

  describe("keys.getBalance", () => {
    it("should return balance for user", async () => {
      const result = await caller.keys.getBalance({ caseId: 1 });
      expect(typeof result.balance).toBe("number");
      expect(result.balance).toBeGreaterThanOrEqual(0);
    });
  });

  describe("keys.getAllBalances", () => {
    it("should return array of key balances", async () => {
      const balances = await caller.keys.getAllBalances();
      expect(Array.isArray(balances)).toBe(true);
      // After aimTrainer tests, user should have some keys
      if (balances.length > 0) {
        expect(balances[0]).toHaveProperty("balance");
        expect(balances[0]).toHaveProperty("caseId");
      }
    });
  });

  describe("inventory.getInventory", () => {
    it("should return inventory for user", async () => {
      const inventory = await caller.inventory.getInventory();
      expect(Array.isArray(inventory)).toBe(true);
      // Inventory may be empty or contain items
    });
  });

  describe("aimTrainer.submitScore", () => {
    it("should save score and award keys", async () => {
      const result = await caller.aimTrainer.submitScore({
        score: 50,
        targetsHit: 5,
        totalTargets: 10,
        accuracy: 50,
        caseId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.keysEarned).toBe(5); // 50 / 10 = 5 keys
    });

    it("should award 0 keys for low score", async () => {
      const result = await caller.aimTrainer.submitScore({
        score: 5,
        targetsHit: 0,
        totalTargets: 10,
        accuracy: 0,
        caseId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.keysEarned).toBe(0);
    });

    it("should calculate keys correctly", async () => {
      const result = await caller.aimTrainer.submitScore({
        score: 100,
        targetsHit: 10,
        totalTargets: 10,
        accuracy: 100,
        caseId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.keysEarned).toBe(10); // 100 / 10 = 10 keys
    });
  });

  describe("caseOpening.openCase", () => {
    it("should fail when user has no keys", async () => {
      const ctx = createAuthContext(999);
      const userCaller = appRouter.createCaller(ctx);

      try {
        await userCaller.caseOpening.openCase({ caseId: 1 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should fail for non-existent case", async () => {
      try {
        await caller.caseOpening.openCase({ caseId: 9999 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        // Non-existent case has no skins, so it fails with FORBIDDEN (no keys consumed yet)
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
