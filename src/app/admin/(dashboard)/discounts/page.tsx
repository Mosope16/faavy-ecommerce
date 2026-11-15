import React from "react";
import { prisma, withDbRetry } from "@/lib/prisma";
import { DiscountManager } from "@/components/admin/discount-manager";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  let discounts: Awaited<ReturnType<typeof prisma.discount.findMany>> = [];
  try {
    discounts = await withDbRetry(() =>
      prisma.discount.findMany({
        orderBy: { createdAt: "desc" },
      })
    );
  } catch (error) {
    console.error("[AdminDiscountsPage] Failed to fetch discounts:", error);
  }

  return <DiscountManager initialDiscounts={discounts} />;
}
