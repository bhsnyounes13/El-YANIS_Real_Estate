import type { PrismaClient } from "@prisma/client";

const REQUIRED = ["User", "Property", "Agent"] as const;

export type RequiredTableKey = (typeof REQUIRED)[number];

export type RequiredTableMap = Record<RequiredTableKey, boolean>;

export async function getRequiredTableStatus(prisma: PrismaClient): Promise<{
  ok: boolean;
  tables: RequiredTableMap;
  missing: string[];
}> {
  const rows = await prisma.$queryRaw<{ table_name: string }[]>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('User', 'Property', 'Agent')
  `;
  const present = new Set(rows.map((r) => r.table_name));
  const tables: RequiredTableMap = {
    User: present.has("User"),
    Property: present.has("Property"),
    Agent: present.has("Agent"),
  };
  const missing = REQUIRED.filter((t) => !tables[t]);
  return { ok: missing.length === 0, tables, missing };
}
