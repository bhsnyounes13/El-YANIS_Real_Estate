import type { Role } from "@prisma/client";
import { prisma } from "../prisma.js";

// Development mode: in-memory user store for testing without database
const devUsers = new Map<
  string,
  { id: string; email: string; passwordHash: string; role: Role; createdAt: Date; updatedAt: Date }
>();

function isDevMode(): boolean {
  return process.env.NODE_ENV !== "production";
}

// Bootstrap admin from env for dev mode
function getDevBootstrapAdmin(): { id: string; email: string; role: "admin" } | null {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim();
  if (!email || !password) return null;
  return {
    id: "dev-admin-bootstrap",
    email,
    role: "admin",
  };
}

export async function countUsers(): Promise<number> {
  if (isDevMode() && devUsers.size === 0) {
    const bootstrap = getDevBootstrapAdmin();
    return bootstrap ? 1 : 0;
  }
  return prisma.user.count();
}

export async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();

  // Dev mode: check in-memory store first
  if (isDevMode()) {
    for (const user of devUsers.values()) {
      if (user.email === normalized) return user;
    }
    // Check bootstrap admin
    const bootstrap = getDevBootstrapAdmin();
    if (bootstrap && bootstrap.email === normalized) {
      // Return a mock user object for bootstrap admin
      return {
        id: bootstrap.id,
        email: bootstrap.email,
        role: bootstrap.role,
        passwordHash: "", // will be handled in auth controller
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  return prisma.user.findUnique({
    where: { email: normalized },
  });
}

export async function findUserById(id: string) {
  if (isDevMode()) {
    const user = devUsers.get(id);
    if (user) return user;
    if (id === "dev-admin-bootstrap") {
      const bootstrap = getDevBootstrapAdmin();
      if (bootstrap) {
        return {
          id: bootstrap.id,
          email: bootstrap.email,
          role: bootstrap.role,
          passwordHash: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }
  }
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(email: string, passwordHash: string, role: Role) {
  if (isDevMode()) {
    const id = `dev-user-${Date.now()}`;
    const user = {
      id,
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    devUsers.set(id, user);
    return user;
  }
  return prisma.user.create({
    data: {
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
    },
  });
}

const userPublicSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function listUsersForAdmin(take = 100) {
  if (isDevMode()) {
    const users = Array.from(devUsers.values()).slice(0, take);
    const bootstrap = getDevBootstrapAdmin();
    if (bootstrap && !users.some((u) => u.id === bootstrap.id)) {
      users.unshift({
        id: bootstrap.id,
        email: bootstrap.email,
        role: bootstrap.role,
        passwordHash: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return users.slice(0, take);
  }

  const n = Math.min(Math.max(take, 1), 200);
  return prisma.user.findMany({
    select: userPublicSelect,
    orderBy: { createdAt: "desc" },
    take: n,
  });
}

export async function countUsersWithRole(role: Role): Promise<number> {
  if (isDevMode()) {
    let count = 0;
    for (const user of devUsers.values()) {
      if (user.role === role) count++;
    }
    const bootstrap = getDevBootstrapAdmin();
    if (bootstrap && bootstrap.role === role) count++;
    return count;
  }
  return prisma.user.count({ where: { role } });
}

export async function updateUserRole(userId: string, role: Role) {
  if (isDevMode()) {
    const user = devUsers.get(userId);
    if (user) {
      user.role = role;
      user.updatedAt = new Date();
      return user;
    }
  }
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: userPublicSelect,
  });
}

export async function deleteUserCascade(userId: string): Promise<void> {
  if (isDevMode()) {
    devUsers.delete(userId);
    return;
  }
  await prisma.user.delete({ where: { id: userId } });
}
