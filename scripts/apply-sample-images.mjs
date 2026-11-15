import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Universal Cloudinary demo cloud hosts the verified official sample assets
const CLOUD_NAME = "demo";

const SAMPLE_ASSIGNMENTS = [
  {
    slug: "sovereign-double-breasted-suit",
    primary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/samples/people/smiling-man.jpg`,
    publicId: "samples/people/smiling-man",
    secondary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample.jpg`,
  },
  {
    slug: "victoria-emerald-sheath-gown",
    primary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample-5.jpg`,
    publicId: "cld-sample-5",
    secondary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample.jpg`,
  },
  {
    slug: "monarch-egyptian-cotton-oxford-shirt",
    primary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample.jpg`,
    publicId: "cld-sample",
    secondary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/samples/people/smiling-man.jpg`,
  },
  {
    slug: "royal-duchess-peplum-blazer",
    primary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample-5.jpg`,
    publicId: "cld-sample-5",
    secondary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample.jpg`,
  },
  {
    slug: "mayfair-silk-chiffon-blouse",
    primary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample.jpg`,
    publicId: "cld-sample",
    secondary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample-5.jpg`,
  },
  {
    slug: "westminster-wool-flannel-trousers",
    primary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/samples/people/smiling-man.jpg`,
    publicId: "samples/people/smiling-man",
    secondary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample.jpg`,
  },
  {
    slug: "oxford-brogue-leather-belt",
    primary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/samples/ecommerce/accessories-bag.jpg`,
    publicId: "samples/ecommerce/accessories-bag",
    secondary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/samples/ecommerce/leather-bag-gray.jpg`,
  },
  {
    slug: "kensington-silk-pocket-square-set",
    primary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/samples/ecommerce/leather-bag-gray.jpg`,
    publicId: "samples/ecommerce/leather-bag-gray",
    secondary: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/samples/ecommerce/accessories-bag.jpg`,
  },
];

async function main() {
  console.log(`Assigning Cloudinary sample images for cloud: ${CLOUD_NAME}...`);

  for (const item of SAMPLE_ASSIGNMENTS) {
    const product = await prisma.product.findUnique({
      where: { slug: item.slug },
      include: { images: true },
    });

    if (!product) {
      console.log(`Skipped: Product with slug "${item.slug}" not found.`);
      continue;
    }

    // Clear existing images
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    // Create primary image
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: item.primary,
        publicId: item.publicId,
        altText: product.name,
        isPrimary: true,
        displayOrder: 0,
      },
    });

    // Create secondary image
    if (item.secondary) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: item.secondary,
          altText: `${product.name} Detail`,
          isPrimary: false,
          displayOrder: 1,
        },
      });
    }

    console.log(`✓ Updated images for: ${product.name}`);
  }

  console.log("\nAll sample images successfully assigned!");
}

main()
  .catch((err) => {
    console.error("Error applying sample images:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
