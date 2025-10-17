import { orderPrisma } from "../../src/index"; // adjust path if needed

async function main() {
  // Optional: clear existing entries
  await orderPrisma.product.deleteMany({});
  await orderPrisma.order.deleteMany({});

  const now = new Date();

  // Seed orders with products
  const orders = [
    {
      userId: "user1",
      email: "user1@example.com",
      amount: 139.8,
      status: "success",
      products: [
        { name: "Adidas CoreFit T-Shirt", quantity: 2, price: 39.9 },
        { name: "Nike Dri-Flex T-Shirt", quantity: 1, price: 29.9 },
      ],
    },
    {
      userId: "user2",
      email: "user2@example.com",
      amount: 129.9,
      status: "failed",
      products: [
        { name: "Puma Ultra Warm Zip", quantity: 1, price: 59.9 },
        { name: "Nike Air Essentials Pullover", quantity: 1, price: 69.9 },
      ],
    },
    {
      userId: "user3",
      email: "user3@example.com",
      amount: 59.9,
      status: "success",
      products: [
        { name: "Levi’s Classic Denim", quantity: 1, price: 59.9 },
      ],
    },
  ];

  for (const order of orders) {
    await orderPrisma.order.create({
      data: {
        userId: order.userId,
        email: order.email,
        amount: order.amount,
        status: order.status as "success" | "failed" ,
        products: {
          create: order.products, // nested create for products
        },
      },
    });
  }

  console.log(`Seeded ${orders.length} orders with products.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await orderPrisma.$disconnect();
  });
