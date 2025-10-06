import { PrismaClient } from "../../generated/mongo";

const prisma = new PrismaClient();

async function main() {
  // Clear existing logs (optional)
  // await prisma.activityLog.deleteMany({});

  const now = new Date();

  const logs = [
    {
      action: "USER_REGISTERED",
      payload: { userId: "123", name: "Alice" },
      createdAt: now,
    },
    {
      action: "USER_LOGIN",
      payload: { userId: "123" },
      createdAt: now,
    },
    {
      action: "ITEM_CREATED",
      payload: { itemId: "456", itemName: "Sample" },
      createdAt: now,
    },
  ];

  for (const log of logs) {
    await prisma.activityLog.create({
      data: log,
    });
  }

  console.log("Seeded activity logs:", logs.length);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
