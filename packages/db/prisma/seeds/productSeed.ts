import { productPrisma } from "../../src/index"; // adjust the path if needed

type CategoryType = {
  name: string;
  slug: string;
};

type ProductType = {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: Record<string, string>;
  categorySlug: string;
};

// 1️⃣ Categories
const categories: CategoryType[] = [
  { name: "T-Shirts", slug: "t-shirts" },
  { name: "Shoes", slug: "shoes" },
  { name: "Hoodies & Pullovers", slug: "hoodies" },
  { name: "Denim & Jeans", slug: "denim" },
  { name: "Jackets", slug: "jackets" },
  { name: "Sportswear", slug: "sportswear" },
];

// 2️⃣ Products
const products: ProductType[] = [
  {
    name: "Adidas CoreFit T-Shirt",
    shortDescription: "Comfortable Adidas T-Shirt for everyday wear.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lightweight, breathable, and perfect for workouts or casual wear.",
    price: 39,
    sizes: ["s", "m", "l", "xl", "xxl"],
    colors: ["gray", "purple", "green"],
    images: { gray: "/products/1g.png", purple: "/products/1p.png", green: "/products/1gr.png" },
    categorySlug: "t-shirts",
  },
  {
    name: "Puma Ultra Warm Zip Hoodie",
    shortDescription: "Warm hoodie for cooler weather.",
    description: "High-quality fleece hoodie designed for comfort and style. Perfect for jogging or casual wear.",
    price: 59,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "green", "black"],
    images: { gray: "/products/2g.png", green: "/products/2gr.png", black: "/products/2bl.png" },
    categorySlug: "hoodies",
  },
  {
    name: "Nike Air Essentials Pullover",
    shortDescription: "Classic Nike pullover with comfort fit.",
    description: "Made from premium cotton blend, lightweight yet warm. Ideal for workouts or casual outings.",
    price: 69,
    sizes: ["s", "m", "l", "xl"],
    colors: ["green", "blue", "black"],
    images: { green: "/products/3gr.png", blue: "/products/3b.png", black: "/products/3bl.png" },
    categorySlug: "hoodies",
  },
  {
    name: "Levi’s Classic Denim",
    shortDescription: "Timeless denim jeans by Levi’s.",
    description: "Durable and stylish, perfect for everyday wear. Comes in multiple washes and fits.",
    price: 59,
    sizes: ["s", "m", "l", "xl"],
    colors: ["blue", "green", "black"],
    images: { blue: "/products/8b.png", green: "/products/8gr.png", black: "/products/8bl.png" },
    categorySlug: "denim",
  },
  {
    name: "Nike Dri-Flex T-Shirt",
    shortDescription: "Lightweight sports T-shirt with moisture-wicking technology.",
    description: "Keeps you dry and comfortable during workouts. Ideal for running, training, or casual wear.",
    price: 29,
    sizes: ["s", "m", "l", "xl"],
    colors: ["white", "pink", "gray"],
    images: { white: "/products/4w.png", pink: "/products/4p.png", gray: "/products/4g.png" },
    categorySlug: "t-shirts",
  },
  {
    name: "Under Armour StormFleece",
    shortDescription: "Water-resistant hoodie for active lifestyle.",
    description: "Protects against wind and light rain. Comfortable and flexible for sports and outdoor activities.",
    price: 49,
    sizes: ["s", "m", "l", "xl"],
    colors: ["red", "orange", "black"],
    images: { red: "/products/5r.png", orange: "/products/5o.png", black: "/products/5bl.png" },
    categorySlug: "hoodies",
  },
  {
    name: "Nike Air Max 270",
    shortDescription: "Premium running shoes for maximum comfort.",
    description: "Stylish and lightweight, designed for daily runs or casual wear. Excellent cushioning and support.",
    price: 59,
    sizes: ["40", "42", "43", "44"],
    colors: ["gray", "white", "black"],
    images: { gray: "/products/6g.png", white: "/products/6w.png", black: "/products/6bl.png" },
    categorySlug: "shoes",
  },
  {
    name: "Nike Ultraboost Pulse",
    shortDescription: "High-performance running shoes.",
    description: "Breathable upper, responsive cushioning, and flexible sole for long-distance runs.",
    price: 69,
    sizes: ["40", "42", "43", "44"],
    colors: ["gray", "pink", "blue"],
    images: { gray: "/products/7g.png", pink: "/products/7p.png", blue: "/products/7b.png" },
    categorySlug: "shoes",
  },
  {
    name: "Adidas Sports Jacket",
    shortDescription: "Lightweight sports jacket for outdoor activities.",
    description: "Protects against wind and light rain. Stylish and comfortable for workouts or casual wear.",
    price: 79,
    sizes: ["s", "m", "l", "xl", "xxl"],
    colors: ["black", "blue"],
    images: { black: "/products/9bl.png", blue: "/products/9b.png" },
    categorySlug: "jackets",
  },
  {
    name: "Puma Training Shorts",
    shortDescription: "Comfortable shorts for gym or running.",
    description: "Breathable fabric, flexible and lightweight. Ideal for sports and casual wear.",
    price: 25,
    sizes: ["s", "m", "l", "xl"],
    colors: ["black", "gray"],
    images: { black: "/products/10bl.png", gray: "/products/10g.png" },
    categorySlug: "sportswear",
  },
  {
    name: "Reebok Running Tee",
    shortDescription: "Breathable running T-shirt.",
    description: "Lightweight, moisture-wicking fabric keeps you cool and comfortable.",
    price: 35,
    sizes: ["s", "m", "l"],
    colors: ["white", "blue", "green"],
    images: { white: "/products/11w.png", blue: "/products/11b.png", green: "/products/11gr.png" },
    categorySlug: "t-shirts",
  },
  {
    name: "Adidas Hoodie Essentials",
    shortDescription: "Classic hoodie for everyday wear.",
    description: "Soft and warm, perfect for casual outings or light sports.",
    price: 55,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "black", "white"],
    images: { gray: "/products/12g.png", black: "/products/12bl.png", white: "/products/12w.png" },
    categorySlug: "hoodies",
  },
  {
    name: "Levi’s Slim Fit Jeans",
    shortDescription: "Modern slim-fit denim jeans.",
    description: "Comfortable and stylish, perfect for casual or semi-formal occasions.",
    price: 65,
    sizes: ["s", "m", "l", "xl"],
    colors: ["blue", "black"],
    images: { blue: "/products/13b.png", black: "/products/13bl.png" },
    categorySlug: "denim",
  },
  {
    name: "Nike Sports Cap",
    shortDescription: "Adjustable sports cap for sun protection.",
    description: "Lightweight, breathable, and adjustable. Perfect for outdoor activities.",
    price: 15,
    sizes: ["one-size"],
    colors: ["black", "blue"],
    images: { black: "/products/14bl.png", blue: "/products/14b.png" },
    categorySlug: "sportswear",
  },
  {
    name: "Adidas Training Leggings",
    shortDescription: "High-performance leggings for workouts.",
    description: "Stretchable, breathable, and lightweight. Perfect for running, yoga, or gym.",
    price: 45,
    sizes: ["s", "m", "l", "xl"],
    colors: ["black", "gray", "navy"],
    images: { black: "/products/15bl.png", gray: "/products/15g.png", navy: "/products/15n.png" },
    categorySlug: "sportswear",
  },
];

async function main() {
  // 1️⃣ Seed categories
  for (const category of categories) {
    await productPrisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`Seeded ${categories.length} categories.`);

  // 2️⃣ Seed products
  for (const product of products) {
    await productPrisma.product.create({
      data: product,
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await productPrisma.$disconnect();
  });
