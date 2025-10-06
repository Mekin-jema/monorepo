import { PrismaClient } from "../../generated/sqlite";

const prisma = new PrismaClient();

async function main() {
  // Optional: clear existing entries
  await prisma.cache.deleteMany({});

  const now = new Date();
  const future = new Date(now.getTime() + 1000 * 60 * 60); // +1 hour

  const seeds = [
    {
      key: "hello",
      value: "world",
      expiresAt: future,
    },
    {
      key: "foo",
      value: "bar",
      expiresAt: null,
    },
    {
      key: "sample",
      value: "data",
      expiresAt: new Date(now.getTime() + 1000 * 60 * 5), // +5 mins
    },
  ];

  for (const s of seeds) {
    await prisma.cache.create({
      data: {
        key: s.key,
        value: s.value,
        expiresAt: s.expiresAt ?? undefined,
        // createdAt will default
      },
    });
  }

  console.log(`Seeded ${seeds.length} cache entries.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
