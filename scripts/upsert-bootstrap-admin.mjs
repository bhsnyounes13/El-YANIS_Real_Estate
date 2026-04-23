/**
 * Crée ou met à jour l’utilisateur défini par BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PASSWORD (voir .env).
 * Usage : node scripts/upsert-bootstrap-admin.mjs
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim();
const rounds = Number(process.env.BCRYPT_ROUNDS ?? "12");

if (!email || !password) {
  console.error("Missing BOOTSTRAP_ADMIN_EMAIL or BOOTSTRAP_ADMIN_PASSWORD in .env");
  process.exit(1);
}

const prisma = new PrismaClient();
const hash = await bcrypt.hash(password, rounds);
const existing = await prisma.user.findUnique({ where: { email } });

if (existing) {
  await prisma.user.update({
    where: { email },
    data: { passwordHash: hash, role: "admin" },
  });
  console.log(`[admin] Updated admin user: ${email}`);
} else {
  await prisma.user.create({
    data: { email, passwordHash: hash, role: "admin" },
  });
  console.log(`[admin] Created admin user: ${email}`);
}

await prisma.$disconnect();
