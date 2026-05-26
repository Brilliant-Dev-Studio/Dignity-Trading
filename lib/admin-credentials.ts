import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

const SINGLETON_ID = "default";
const KEY_LEN = 64;
const SALT_LEN = 16;

function getDefaultEmail() {
  return process.env.ADMIN_EMAIL ?? "admin@dignity.local";
}

function getDefaultPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? "" : "admin12345";
}

function hashPassword(password: string) {
  const salt = randomBytes(SALT_LEN);
  const derived = scryptSync(password, salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

function verifyHash(password: string, stored: string) {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (salt.length !== SALT_LEN || expected.length !== KEY_LEN) return false;
  const derived = scryptSync(password, salt, KEY_LEN);
  return timingSafeEqual(derived, expected);
}

export async function ensureAdminCredentialSeed() {
  const existing = await prisma.adminCredential.findUnique({
    where: { id: SINGLETON_ID },
  });
  if (existing) return existing;

  const seedPassword = getDefaultPassword();
  if (!seedPassword) return null;

  return prisma.adminCredential.create({
    data: {
      id: SINGLETON_ID,
      email: getDefaultEmail().toLowerCase(),
      passwordHash: hashPassword(seedPassword),
    },
  });
}

export async function verifyAdminLogin(email: string, password: string) {
  const row = await ensureAdminCredentialSeed();
  if (!row) return false;
  if (row.email !== email.trim().toLowerCase()) return false;
  return verifyHash(password, row.passwordHash);
}

export async function setAdminPassword(newPassword: string) {
  await prisma.adminCredential.upsert({
    where: { id: SINGLETON_ID },
    update: { passwordHash: hashPassword(newPassword) },
    create: {
      id: SINGLETON_ID,
      email: getDefaultEmail().toLowerCase(),
      passwordHash: hashPassword(newPassword),
    },
  });
}

export async function getAdminEmail() {
  const row = await ensureAdminCredentialSeed();
  return row?.email ?? getDefaultEmail().toLowerCase();
}
