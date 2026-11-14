import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

// Use direct URL for standalone node test script so interactive transactions run directly on Postgres
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✓ PASSED: ${message}`);
}

async function runTests() {
  console.log("==================================================");
  console.log("FAAVY AUTOMATED COMMERCE & INTEGRITY TEST SUITE");
  console.log("==================================================");

  // 1. Integer Kobo & Currency Precision
  console.log("\n[Test 1] Monetary Precision & Currency Integrity");
  const priceInKobo = 18500000; // ₦185,000
  const formattedNaira = `₦${new Intl.NumberFormat("en-NG").format(priceInKobo / 100)}`;
  assert(formattedNaira === "₦185,000", `Formatted Naira string matches: ${formattedNaira}`);
  assert(Number.isInteger(priceInKobo), "Price is strictly an integer in Kobo");

  // 2. Shipping Rate Logic & Free Shipping Threshold
  console.log("\n[Test 2] Shipping Rules & Nigerian State Zones");
  function calculateShipping(state, subtotalKobo) {
    if (subtotalKobo >= 10000000) return 0; // Free over ₦100k
    const s = state.toLowerCase();
    if (s.includes("ekiti")) return 250000;
    if (["lagos", "oyo", "ogun", "osun", "ondo"].some(x => s.includes(x))) return 350000;
    if (["abuja", "fct", "rivers", "edo", "delta"].some(x => s.includes(x))) return 450000;
    return 550000;
  }

  assert(calculateShipping("Ekiti", 5000000) === 250000, "Ekiti local rate is ₦2,500");
  assert(calculateShipping("Lagos", 5000000) === 350000, "Lagos regional rate is ₦3,500");
  assert(calculateShipping("Abuja (FCT)", 5000000) === 450000, "Abuja rate is ₦4,500");
  assert(calculateShipping("Kano", 5000000) === 550000, "Nationwide standard rate is ₦5,500");
  assert(calculateShipping("Lagos", 10000000) === 0, "Orders >= ₦100,000 receive complimentary shipping");

  // 3. Discount Voucher Logic
  console.log("\n[Test 3] Discount Calculations & Spend Criteria");
  const testSubtotal = 7800000; // ₦78,000
  const discount10Percent = Math.round((testSubtotal * 10) / 100);
  assert(discount10Percent === 780000, "10% discount on ₦78,000 is ₦7,800");

  // 4. Paystack Webhook Cryptographic HMAC SHA512 Verification
  console.log("\n[Test 4] Paystack HMAC SHA512 Webhook Signature Validation");
  const webhookSecret = "sk_test_faavy_demo_secret_key_corporate";
  const samplePayload = JSON.stringify({
    event: "charge.success",
    data: { reference: "FAV-TEST-REF-001", amount: 7800000, status: "success" },
  });

  const validSignature = crypto
    .createHmac("sha512", webhookSecret)
    .update(samplePayload)
    .digest("hex");

  const invalidSignature = "invalid_hash_signature_attempt";

  function verifyWebhook(signature, payload) {
    const hash = crypto.createHmac("sha512", webhookSecret).update(payload).digest("hex");
    return hash === signature;
  }

  assert(verifyWebhook(validSignature, samplePayload) === true, "Valid cryptographic HMAC signature accepted");
  assert(verifyWebhook(invalidSignature, samplePayload) === false, "Forged or corrupted signature strictly rejected");

  // 5. Database Integrity Checks
  console.log("\n[Test 5] Database Schema & Records Verification");
  const categoriesCount = await prisma.category.count();
  assert(categoriesCount >= 8, `Categories seeded in database: ${categoriesCount}`);

  const productsCount = await prisma.product.count();
  assert(productsCount >= 8, `Products seeded in database: ${productsCount}`);

  const variantsCount = await prisma.productVariant.count();
  assert(variantsCount >= 20, `Variants matrix seeded in database: ${variantsCount}`);

  const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  assert(adminUser !== null, `Admin account present: ${adminUser?.email}`);

  // 6. Test Atomic Order Creation & Inventory Deduct & Snapshot Preservation
  console.log("\n[Test 6] End-to-End Atomic Order Creation & Inventory Snapshot Test");
  const testProduct = await prisma.product.findFirst({
    where: { isActive: true, isMadeToOrder: false },
    include: { variants: true },
  });

  const testVariant = testProduct.variants[0];
  const initialStock = testVariant.stockQuantity;

  const testOrderNumber = `FAV-TEST-${Date.now().toString().slice(-6)}`;
  const testOrder = await prisma.$transaction(async (tx) => {
    // 1. Deduct stock
    const updatedVar = await tx.productVariant.update({
      where: { id: testVariant.id },
      data: { stockQuantity: { decrement: 1 } },
    });

    // 2. Create Order
    const order = await tx.order.create({
      data: {
        orderNumber: testOrderNumber,
        customerEmail: "test.patron@faavy.ng",
        customerName: "Bar. Femi Oladipo",
        customerPhone: "+2348031112233",
        status: "CONFIRMED",
        subtotalInKobo: testProduct.basePriceInKobo,
        shippingFeeInKobo: 350000,
        totalInKobo: testProduct.basePriceInKobo + 350000,
        items: {
          create: [
            {
              productId: testProduct.id,
              variantId: testVariant.id,
              productName: testProduct.name,
              variantName: testVariant.name,
              sku: testVariant.sku,
              unitPriceInKobo: testProduct.basePriceInKobo,
              quantity: 1,
              totalInKobo: testProduct.basePriceInKobo,
            },
          ],
        },
        payments: {
          create: {
            reference: `PAY-TEST-${testOrderNumber}`,
            provider: "PAYSTACK",
            status: "PAID",
            amountInKobo: testProduct.basePriceInKobo + 350000,
            currency: "NGN",
          },
        },
      },
      include: { items: true, payments: true },
    });

    // 3. Record inventory movement
    await tx.inventoryMovement.create({
      data: {
        variantId: testVariant.id,
        quantityChange: -1,
        reason: "SALE",
        orderNumber: testOrderNumber,
        notes: "Automated test sale order",
      },
    });

    return order;
  });

  assert(testOrder.orderNumber === testOrderNumber, `Order created with number: ${testOrder.orderNumber}`);
  assert(testOrder.items[0].productName === testProduct.name, "Order item snapshot preserved product name");
  assert(testOrder.items[0].sku === testVariant.sku, "Order item snapshot preserved SKU");
  assert(testOrder.items[0].unitPriceInKobo === testProduct.basePriceInKobo, "Order item snapshot preserved unit price");

  // Verify stock was decremented
  const recheckedVariant = await prisma.productVariant.findUnique({
    where: { id: testVariant.id },
  });
  assert(recheckedVariant.stockQuantity === initialStock - 1, `Variant stock decremented from ${initialStock} to ${recheckedVariant.stockQuantity}`);

  // Re-increment stock to restore clean state
  await prisma.productVariant.update({
    where: { id: testVariant.id },
    data: { stockQuantity: initialStock },
  });
  console.log("✓ Stock state restored to original level after test.");

  // Clean up test order
  await prisma.order.delete({ where: { id: testOrder.id } });
  console.log("✓ Test order cleaned up successfully.");

  console.log("\n==================================================");
  console.log("ALL COMMERCE & INTEGRITY TESTS PASSED SUCCESSFULLY");
  console.log("==================================================");
}

runTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
