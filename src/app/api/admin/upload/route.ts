import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Administrative privileges required." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "faavy/products";

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided for upload." },
        { status: 400 }
      );
    }

    // Validate mime type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload an image file (JPEG, PNG, WebP, or AVIF).",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowed size of 10MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImageToCloudinary(buffer, file.name, { folder });

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error: any) {
    console.error("Cloudinary upload API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image to Cloudinary." },
      { status: 500 }
    );
  }
}
