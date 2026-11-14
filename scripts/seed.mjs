import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting FAAVY database seed...");

  // 1. Store Settings
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "FAAVY",
      currency: "NGN",
      whatsappNumber: "2348140000000",
      contactEmail: "favourohieku@gmail.com",
      contactPhone: "+234 814 000 0000",
      storeAddress: "Oye-Ekiti, Ekiti State, Nigeria",
      announcementBanner: "Complimentary nationwide courier delivery on orders over ₦100,000",
      standardShippingFeeInKobo: 350000, // ₦3,500
      freeShippingThresholdInKobo: 10000000, // ₦100,000
      instagramHandle: "faavyofficial",
    },
  });
  console.log("✓ Store settings initialized");

  // 2. Initial Admin User
  const adminEmail = "favourohieku@gmail.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const adminUser = await prisma.user.create({
      data: {
        name: "FAAVY Administrator",
        email: adminEmail,
        emailVerified: true,
        role: "ADMIN",
      },
    });

    const hashedPassword = await hashPassword("Admin@Faavy2026!");
    await prisma.account.create({
      data: {
        userId: adminUser.id,
        accountId: adminUser.id,
        providerId: "credential",
        password: hashedPassword,
      },
    });
    console.log("✓ Admin user created: favourohieku@gmail.com");
  }

  // 3. Categories
  const categoriesData = [
    {
      name: "Jackets & Suits",
      slug: "jackets-suits",
      description: "Bespoke two-piece suits and handcrafted corporate power blazers tailored for executive distinction.",
      imageUrl: null,
      displayOrder: 1,
    },
    {
      name: "Corporate Gowns",
      slug: "corporate-gowns",
      description: "Structured silhouette dresses and executive midi gowns designed for modern boardrooms.",
      imageUrl: null,
      displayOrder: 2,
    },
    {
      name: "Shirts",
      slug: "shirts",
      description: "Impeccably tailored Egyptian cotton oxford and pinpoint corporate shirts.",
      imageUrl: null,
      displayOrder: 3,
    },
    {
      name: "Trousers",
      slug: "trousers",
      description: "Cleanly pressed wool-blend and pleated executive trousers with custom waistbands.",
      imageUrl: null,
      displayOrder: 4,
    },
    {
      name: "Skirts",
      slug: "skirts",
      description: "High-waisted tailored pencil and A-line corporate skirts in breathable fabrics.",
      imageUrl: null,
      displayOrder: 5,
    },
    {
      name: "Shoes",
      slug: "shoes",
      description: "Handcrafted calfskin leather Oxfords, double monk straps, and corporate block heels.",
      imageUrl: null,
      displayOrder: 6,
    },
    {
      name: "Ties & Accessories",
      slug: "ties-accessories",
      description: "Pure jacquard silk neckties, pocket squares, and gold-plated cufflinks.",
      imageUrl: null,
      displayOrder: 7,
    },
    {
      name: "Perfume Oils",
      slug: "perfume-oils",
      description: "Long-lasting artisanal corporate fragrance oils crafted from agarwood, amber, and bergamot.",
      imageUrl: null,
      displayOrder: 8,
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = created;
  }
  console.log("✓ Categories seeded:", Object.keys(categories).length);

  // 4. Products & Variants
  const productsData = [
    {
      name: "The Sovereign Double-Breasted Suit",
      slug: "sovereign-double-breasted-suit",
      description: "Meticulously crafted from Italian Super 140s wool, The Sovereign Double-Breasted Suit embodies timeless corporate authority. Features hand-finished peak lapels, horn buttons, and full canvas construction.",
      details: "100% Super 140s Wool. Peak lapels. Double-breasted closure. Dual back vents. Hand-basted canvas chest piece.",
      careInstructions: "Specialist dry clean only. Steam gently. Store on wide wooden hanger with breathable dust bag.",
      categoryId: categories["jackets-suits"].id,
      isFeatured: true,
      isActive: true,
      isMadeToOrder: true,
      leadTimeDays: 10,
      basePriceInKobo: 18500000, // ₦185,000
      images: [],
      variants: [
        { name: "Charcoal Grey / 38R", sku: "SOV-DB-CH-38R", size: "38R", color: "Charcoal Grey", colorHex: "#2C2C2C", stockQuantity: 3, additionalPriceInKobo: 0 },
        { name: "Charcoal Grey / 40R", sku: "SOV-DB-CH-40R", size: "40R", color: "Charcoal Grey", colorHex: "#2C2C2C", stockQuantity: 5, additionalPriceInKobo: 0 },
        { name: "Charcoal Grey / 42R", sku: "SOV-DB-CH-42R", size: "42R", color: "Charcoal Grey", colorHex: "#2C2C2C", stockQuantity: 4, additionalPriceInKobo: 0 },
        { name: "Charcoal Grey / 44R", sku: "SOV-DB-CH-44R", size: "44R", color: "Charcoal Grey", colorHex: "#2C2C2C", stockQuantity: 2, additionalPriceInKobo: 500000 },
        { name: "Midnight Black / 40R", sku: "SOV-DB-BK-40R", size: "40R", color: "Midnight Black", colorHex: "#111111", stockQuantity: 4, additionalPriceInKobo: 0 },
        { name: "Midnight Black / 42R", sku: "SOV-DB-BK-42R", size: "42R", color: "Midnight Black", colorHex: "#111111", stockQuantity: 3, additionalPriceInKobo: 0 },
      ],
    },
    {
      name: "The Victoria Emerald Executive Sheath Gown",
      slug: "victoria-emerald-sheath-gown",
      description: "An architectural masterpiece in jewel-toned emerald. Tailored with contouring waist darts, asymmetrical neckline, and midi-length hem designed to command room attention with understated grace.",
      details: "Mid-weight stretch crepe (68% Polyester, 28% Rayon, 4% Spandex). Fully lined in silk-touch acetate. Concealed back zip.",
      careInstructions: "Delicate dry clean or hand wash cold. Lay flat to dry. Cool iron on reverse.",
      categoryId: categories["corporate-gowns"].id,
      isFeatured: true,
      isActive: true,
      isMadeToOrder: false,
      leadTimeDays: 0,
      basePriceInKobo: 7800000, // ₦78,000
      images: [],
      variants: [
        { name: "Emerald / Small (UK 8)", sku: "VIC-GWN-EM-S", size: "UK 8", color: "Emerald Green", colorHex: "#0D4D3A", stockQuantity: 6, additionalPriceInKobo: 0 },
        { name: "Emerald / Medium (UK 10)", sku: "VIC-GWN-EM-M", size: "UK 10", color: "Emerald Green", colorHex: "#0D4D3A", stockQuantity: 8, additionalPriceInKobo: 0 },
        { name: "Emerald / Large (UK 12)", sku: "VIC-GWN-EM-L", size: "UK 12", color: "Emerald Green", colorHex: "#0D4D3A", stockQuantity: 5, additionalPriceInKobo: 0 },
        { name: "Emerald / XL (UK 14)", sku: "VIC-GWN-EM-XL", size: "UK 14", color: "Emerald Green", colorHex: "#0D4D3A", stockQuantity: 3, additionalPriceInKobo: 0 },
        { name: "Ivory Cream / Medium (UK 10)", sku: "VIC-GWN-IV-M", size: "UK 10", color: "Ivory Cream", colorHex: "#F5F2EB", stockQuantity: 4, additionalPriceInKobo: 0 },
      ],
    },
    {
      name: "The Monarch Egyptian Cotton Oxford Shirt",
      slug: "monarch-egyptian-cotton-oxford-shirt",
      description: "Woven from long-staple Giza Egyptian cotton with a fine 120/2 yarn count. Features genuine mother-of-pearl buttons, semi-spread collar, and reinforced single cuffs.",
      details: "100% Egyptian Giza Cotton. Removable brass collar stays. French seams. Mother-of-pearl buttons.",
      careInstructions: "Machine wash 30°C. Warm iron while slightly damp. Do not bleach.",
      categoryId: categories["shirts"].id,
      isFeatured: true,
      isActive: true,
      isMadeToOrder: false,
      leadTimeDays: 0,
      basePriceInKobo: 4200000, // ₦42,000
      images: [],
      variants: [
        { name: "Crisp White / 15.5 (39cm)", sku: "MON-SH-WH-155", size: "15.5", color: "Crisp White", colorHex: "#FFFFFF", stockQuantity: 12, additionalPriceInKobo: 0 },
        { name: "Crisp White / 16.0 (41cm)", sku: "MON-SH-WH-160", size: "16.0", color: "Crisp White", colorHex: "#FFFFFF", stockQuantity: 15, additionalPriceInKobo: 0 },
        { name: "Crisp White / 16.5 (42cm)", sku: "MON-SH-WH-165", size: "16.5", color: "Crisp White", colorHex: "#FFFFFF", stockQuantity: 8, additionalPriceInKobo: 0 },
        { name: "Sky Blue / 16.0 (41cm)", sku: "MON-SH-BL-160", size: "16.0", color: "Sky Blue", colorHex: "#D0E4F5", stockQuantity: 10, additionalPriceInKobo: 0 },
        { name: "Sky Blue / 16.5 (42cm)", sku: "MON-SH-BL-165", size: "16.5", color: "Sky Blue", colorHex: "#D0E4F5", stockQuantity: 7, additionalPriceInKobo: 0 },
      ],
    },
    {
      name: "The Mayfair Pleated Wool Trousers",
      slug: "mayfair-pleated-wool-trousers",
      description: "High-rise single pleat trousers designed for exceptional drape and movement. Crafted with side adjusters, extended waistband tab, and a gentle taper.",
      details: "98% Virgin Wool, 2% Elastane for natural give. Horn side tab buckles. Unfinished hem for custom tailoring.",
      careInstructions: "Dry clean only. Press with a damp cloth on medium heat.",
      categoryId: categories["trousers"].id,
      isFeatured: false,
      isActive: true,
      isMadeToOrder: false,
      leadTimeDays: 0,
      basePriceInKobo: 5200000, // ₦52,000
      images: [],
      variants: [
        { name: "Dark Navy / 32", sku: "MAY-TR-NV-32", size: "32", color: "Dark Navy", colorHex: "#121A2C", stockQuantity: 6, additionalPriceInKobo: 0 },
        { name: "Dark Navy / 34", sku: "MAY-TR-NV-34", size: "34", color: "Dark Navy", colorHex: "#121A2C", stockQuantity: 8, additionalPriceInKobo: 0 },
        { name: "Dark Navy / 36", sku: "MAY-TR-NV-36", size: "36", color: "Dark Navy", colorHex: "#121A2C", stockQuantity: 5, additionalPriceInKobo: 0 },
        { name: "Charcoal / 34", sku: "MAY-TR-CH-34", size: "34", color: "Charcoal", colorHex: "#2A2A2A", stockQuantity: 7, additionalPriceInKobo: 0 },
      ],
    },
    {
      name: "The Kensington Wholecut Oxford Shoes",
      slug: "kensington-wholecut-oxford-shoes",
      description: "Formed from a single piece of full-grain French calf leather, hand-burnished to a rich patina. Goodyear welted on a bevelled leather sole with brass-tipped toe plates.",
      details: "Full grain French calfskin. Goodyear welted construction. Leather sole and stacked heel with non-slip rubber insert.",
      careInstructions: "Condition regularly with beeswax shoe cream. Polish with soft cloth. Always store with cedar shoe trees.",
      categoryId: categories["shoes"].id,
      isFeatured: true,
      isActive: true,
      isMadeToOrder: true,
      leadTimeDays: 14,
      basePriceInKobo: 11500000, // ₦115,000
      images: [],
      variants: [
        { name: "Chestnut Brown / EU 42", sku: "KEN-SH-BR-42", size: "EU 42", color: "Chestnut Brown", colorHex: "#4A2711", stockQuantity: 4, additionalPriceInKobo: 0 },
        { name: "Chestnut Brown / EU 43", sku: "KEN-SH-BR-43", size: "EU 43", color: "Chestnut Brown", colorHex: "#4A2711", stockQuantity: 5, additionalPriceInKobo: 0 },
        { name: "Chestnut Brown / EU 44", sku: "KEN-SH-BR-44", size: "EU 44", color: "Chestnut Brown", colorHex: "#4A2711", stockQuantity: 3, additionalPriceInKobo: 0 },
        { name: "Onyx Black / EU 43", sku: "KEN-SH-BK-43", size: "EU 43", color: "Onyx Black", colorHex: "#0D0D0D", stockQuantity: 4, additionalPriceInKobo: 0 },
      ],
    },
    {
      name: "Nirvana Royale Artisanal Perfume Oil",
      slug: "nirvana-royale-perfume-oil",
      description: "An intoxicating alcohol-free pure perfume oil designed for all-day executive presence. Top notes of Italian bergamot and pink pepper melt into Cambodian oud, aged leather, and golden amber.",
      details: "12ml crystal dropper bottle. 100% pure undiluted perfume oil. Concentrated formulation lasting 14+ hours on pulse points.",
      careInstructions: "Store in a cool dry place away from direct sunlight. Dab lightly onto wrists and collarbones.",
      categoryId: categories["perfume-oils"].id,
      isFeatured: true,
      isActive: true,
      isMadeToOrder: false,
      leadTimeDays: 0,
      basePriceInKobo: 2400000, // ₦24,000
      images: [],
      variants: [
        { name: "12ml Crystal Dropper", sku: "NIR-OIL-12ML", size: "12ml", color: "Amber Gold", colorHex: "#D4AF37", stockQuantity: 25, additionalPriceInKobo: 0 },
        { name: "25ml Executive Flacon", sku: "NIR-OIL-25ML", size: "25ml", color: "Amber Gold", colorHex: "#D4AF37", stockQuantity: 14, additionalPriceInKobo: 1600000 },
      ],
    },
    {
      name: "The Regency 7-Fold Silk Necktie",
      slug: "regency-7-fold-silk-necktie",
      description: "The pinnacle of neckwear craftsmanship. Cut from heavy Como mulberry silk, folded entirely seven times without synthetic lining for an inimitable substantial knot.",
      details: "100% Mulberry Silk. 7-fold traditional unlined construction. 8.5cm blade width. Hand-rolled hand-sewn edges.",
      careInstructions: "Do not machine wash or steam. Untie carefully after each wear and hang to relax fibers.",
      categoryId: categories["ties-accessories"].id,
      isFeatured: false,
      isActive: true,
      isMadeToOrder: false,
      leadTimeDays: 0,
      basePriceInKobo: 1650000, // ₦16,500
      images: [],
      variants: [
        { name: "Champagne Gold Foulard", sku: "REG-TIE-GD", size: "One Size", color: "Champagne Gold", colorHex: "#C5A880", stockQuantity: 18, additionalPriceInKobo: 0 },
        { name: "Burgundy Pin-Dot", sku: "REG-TIE-BG", size: "One Size", color: "Burgundy", colorHex: "#6B1D2F", stockQuantity: 15, additionalPriceInKobo: 0 },
        { name: "Midnight Navy Herringbone", sku: "REG-TIE-NV", size: "One Size", color: "Midnight Navy", colorHex: "#141C3A", stockQuantity: 20, additionalPriceInKobo: 0 },
      ],
    },
    {
      name: "The Milanese High-Waist Pencil Skirt",
      slug: "milanese-high-waist-pencil-skirt",
      description: "Clean architectural lines in structured double-weave crepe. Sits securely at the natural high waist, tapering through the hips to an elegant knee-skimming length with an overlap kick pleat.",
      details: "72% Polyester, 23% Viscose, 5% Elastane. Blind-stitched hem. YKK invisible back zipper. Full satin lining.",
      careInstructions: "Machine wash cold on gentle cycle or dry clean. Hang dry.",
      categoryId: categories["skirts"].id,
      isFeatured: false,
      isActive: true,
      isMadeToOrder: false,
      leadTimeDays: 0,
      basePriceInKobo: 3800000, // ₦38,000
      images: [],
      variants: [
        { name: "Black / UK 8", sku: "MIL-SK-BK-8", size: "UK 8", color: "Pitch Black", colorHex: "#0D0D0D", stockQuantity: 7, additionalPriceInKobo: 0 },
        { name: "Black / UK 10", sku: "MIL-SK-BK-10", size: "UK 10", color: "Pitch Black", colorHex: "#0D0D0D", stockQuantity: 9, additionalPriceInKobo: 0 },
        { name: "Black / UK 12", sku: "MIL-SK-BK-12", size: "UK 12", color: "Pitch Black", colorHex: "#0D0D0D", stockQuantity: 6, additionalPriceInKobo: 0 },
        { name: "Taupe / UK 10", sku: "MIL-SK-TP-10", size: "UK 10", color: "Taupe", colorHex: "#998877", stockQuantity: 5, additionalPriceInKobo: 0 },
      ],
    },
  ];

  for (const prod of productsData) {
    const { images, variants, ...prodFields } = prod;
    const existing = await prisma.product.findUnique({
      where: { slug: prodFields.slug },
    });

    let productId = existing?.id;
    if (!existing) {
      const created = await prisma.product.create({
        data: prodFields,
      });
      productId = created.id;
    } else {
      await prisma.product.update({
        where: { id: productId },
        data: prodFields,
      });
    }

    // Insert Images
    await prisma.productImage.deleteMany({ where: { productId } });
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId,
          url: images[i].url,
          altText: images[i].altText,
          isPrimary: images[i].isPrimary,
          displayOrder: i,
        },
      });
    }

    // Insert Variants
    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          ...v,
          productId,
        },
        create: {
          ...v,
          productId,
        },
      });
    }
  }
  console.log("✓ Products and variants seeded:", productsData.length);

  // 5. Initial Discount Code
  await prisma.discount.upsert({
    where: { code: "FAAVYFIRST" },
    update: {},
    create: {
      code: "FAAVYFIRST",
      description: "Welcome 10% off your initial bespoke luxury corporate order",
      discountPercent: 10,
      minSpendInKobo: 5000000, // Min spend ₦50,000
      maxUses: 500,
      isActive: true,
    },
  });
  console.log("✓ Initial discount code FAAVYFIRST seeded");

  console.log("FAAVY database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
