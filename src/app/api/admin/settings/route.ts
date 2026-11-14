import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  storeName: z.string().min(1),
  whatsappNumber: z.string().min(5),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(5),
  storeAddress: z.string().min(5),
  announcementBanner: z.string().optional().nullable(),
  standardShippingFeeInKobo: z.number().int().min(0),
  freeShippingThresholdInKobo: z.number().int().min(0),
  instagramHandle: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid settings payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { instagramHandle, announcementBanner, ...rest } = parsed.data;

    const dataToSave = {
      ...rest,
      announcementBanner: announcementBanner || null,
      instagramHandle: instagramHandle || "faavyofficial",
    };

    const updated = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: dataToSave,
      create: {
        id: "default",
        ...dataToSave,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Store settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update store settings." },
      { status: 500 }
    );
  }
}
