import bcrypt from "bcryptjs";
import { db, adminUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const DEFAULT_USERNAME = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
const USING_DEFAULT_PASSWORD = !process.env.ADMIN_PASSWORD;

export async function ensureDefaultAdmin(): Promise<void> {
  // In production, refuse to start without an explicit ADMIN_PASSWORD so a
  // known default credential can never reach a live environment.
  if (process.env.NODE_ENV === "production" && USING_DEFAULT_PASSWORD) {
    throw new Error(
      "ADMIN_PASSWORD must be set in production. Set it as a secret before deploying.",
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD ?? "Automystics@2026";

  try {
    const [existing] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, DEFAULT_USERNAME))
      .limit(1);
    if (existing) {
      logger.info({ username: DEFAULT_USERNAME }, "default admin already exists");
      return;
    }
    const hash = await bcrypt.hash(adminPassword, 10);
    await db.insert(adminUsersTable).values({
      username: DEFAULT_USERNAME,
      passwordHash: hash,
    });
    logger.info({ username: DEFAULT_USERNAME }, "default admin seeded");
    if (USING_DEFAULT_PASSWORD) {
      logger.warn(
        "ADMIN_PASSWORD env var not set — seeded admin with built-in default password. Set ADMIN_PASSWORD before deploying to production.",
      );
    }
  } catch (err) {
    logger.error({ err }, "failed to seed default admin");
    throw err;
  }
}
