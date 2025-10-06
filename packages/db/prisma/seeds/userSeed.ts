import { PrismaClient } from '../../generated/postgres';
const prisma = new PrismaClient();

async function main() {
  // Optional: clear existing data (careful in production)
  await prisma.verification.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  const now = new Date();

  // Seed users
  const users = [
    {
      id: "user1",
      name: "Alice",
      email: "alice@example.com",
      emailVerified: true,
      image: null,
      role: "admin",
    },
    {
      id: "user2",
      name: "Bob",
      email: "bob@example.com",
      emailVerified: false,
      image: null,
      role: "user",
    },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        ...u,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // Seed sessions (for users)
  const sessions = [
    {
      id: "sess1",
      token: "token-abc",
      userId: "user1",
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60), // +1h
      ipAddress: "127.0.0.1",
      userAgent: "seedAgent",
    },
    {
      id: "sess2",
      token: "token-xyz",
      userId: "user2",
      expiresAt: new Date(now.getTime() + 1000 * 60 * 30), // +30m
      ipAddress: "127.0.0.1",
      userAgent: "seedAgent2",
    },
  ];

  for (const s of sessions) {
    await prisma.session.create({
      data: {
        ...s,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // Seed accounts (credential / OAuth / password accounts)
  const accounts = [
    {
      id: "acct1",
      accountId: "credential1",
      providerId: "credentials",
      userId: "user1",
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: "password123",  // if you're handling plain passwords for seed (for dev only)
    },
    {
      id: "acct2",
      accountId: "credential2",
      providerId: "credentials",
      userId: "user2",
      password: "password456",
    },
  ];

  for (const a of accounts) {
    await prisma.account.create({
      data: {
        ...a,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // Seed verification entries (if you use them)
  const verifications = [
    {
      id: "ver1",
      identifier: "bob@example.com",
      value: "verif-token-bob",
      expiresAt: new Date(now.getTime() + 1000 * 60 * 15), // +15m
    },
  ];

  for (const v of verifications) {
    await prisma.verification.create({
      data: {
        ...v,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  console.log("Postgres seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
