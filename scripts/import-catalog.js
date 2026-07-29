// One-off script: pulls real furniture products from the training MongoDB
// catalog and replaces whatever is currently in our own Product table.
// Run with: npm run import-catalog

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { MongoClient } = require("mongodb");

const prisma = new PrismaClient();

function buildDescription(doc) {
  const parts = [doc.category];

  if (Array.isArray(doc.colours) && doc.colours.length) {
    parts.push(`Colour: ${doc.colours.join(", ")}`);
  }

  const dims = [doc.width, doc.height, doc.depth].filter(
    (value) => value != null
  );
  if (dims.length) {
    parts.push(`Size (W x H x D, cm): ${dims.join(" x ")}`);
  }

  return parts.filter(Boolean).join(". ");
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Set MONGODB_URI in your .env file before running this script."
    );
  }

  // Deleting products would break any existing orders that point at them,
  // so refuse instead of silently destroying order history.
  const existingOrders = await prisma.order.count();
  if (existingOrders > 0) {
    throw new Error(
      `Refusing to replace products: ${existingOrders} order(s) already ` +
        "reference the current catalog. Clear those orders first if you " +
        "really want to replace it."
    );
  }

  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  await mongoClient.connect();

  let docs;
  try {
    docs = await mongoClient.db().collection("catalog").find({}).toArray();
  } finally {
    await mongoClient.close();
  }

  console.log(`Fetched ${docs.length} products from MongoDB.`);

  const products = docs
    .filter((doc) => doc.product_name && doc.price != null)
    .map((doc) => ({
      name: doc.product_name,
      price: Number(doc.price),
      // image_url is actually raw base64 image bytes, not a link — turn it
      // into a data URI so <img src="..."> can render it directly.
      imageUrl:
        doc.image_url && doc.image_mime_type
          ? `data:${doc.image_mime_type};base64,${doc.image_url}`
          : "",
      description: buildDescription(doc),
    }));

  await prisma.product.deleteMany({});
  await prisma.product.createMany({ data: products });

  console.log(
    `Replaced placeholder products with ${products.length} real products from the catalog.`
  );
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
