import { authPrisma } from '../../src/index';

async function main() {
  // Optional: clear existing data
  await authPrisma.verification.deleteMany({});
  await authPrisma.account.deleteMany({});
  await authPrisma.session.deleteMany({});
  await authPrisma.user.deleteMany({});

  const now = new Date();

  // 1️⃣ Seed users
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
    await authPrisma.user.create({
      data: {
        ...u,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // 2️⃣ Seed sessions
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
    await authPrisma.session.create({
      data: {
        ...s,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // 3️⃣ Seed accounts
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
      password: "password123", // for dev only
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
    await authPrisma.account.create({
      data: {
        ...a,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // 4️⃣ Seed verification entries
  const verifications = [
    {
      id: "ver1",
      identifier: "bob@example.com",
      value: "verif-token-bob",
      expiresAt: new Date(now.getTime() + 1000 * 60 * 15), // +15 mins
    },
  ];

  for (const v of verifications) {
    await authPrisma.verification.create({
      data: {
        ...v,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  console.log("Auth module seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await authPrisma.$disconnect();
  });
