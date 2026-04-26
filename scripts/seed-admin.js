/**
 * Crée ou met à jour un compte admin.
 * E-mail : ADMIN_EMAIL (défaut admin@gmail.com), mot de passe : ADMIN_PASSWORD (obligatoire).
 * Usage : ADMIN_PASSWORD="…" npm run seed:admin
 *         ADMIN_EMAIL=you@x.com ADMIN_PASSWORD="…" npm run seed:admin
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "admin@gmail.com").trim().toLowerCase();
const ROUNDS = 12;

const password = process.env.ADMIN_PASSWORD?.trim();
if (!password) {
  console.error("[seed-admin] Définissez la variable d’environnement ADMIN_PASSWORD.");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  await prisma.$connect();
  const passwordHash = await bcrypt.hash(password, ROUNDS);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    },
    update: {
      passwordHash,
      role: "admin",
    },
  });
  console.log("[seed-admin] Compte administrateur prêt (compte connu, mot de passe non affiché).");
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("[seed-admin] Échec :", msg);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
