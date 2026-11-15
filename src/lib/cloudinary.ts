import crypto from "node:crypto";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  tags?: string[];
}

/**
 * Generates a SHA-1 cryptographic signature for Cloudinary signed requests.
 * Cloudinary requires parameter keys sorted in alphabetical order,
 * formatted as key=value&key2=value2, concatenated with the API secret.
 */
export function generateCloudinarySignature(
  params: Record<string, string | number>,
  apiSecret: string
): string {
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(serialized + apiSecret)
    .digest("hex");
}

/**
 * Uploads an image buffer or blob directly to Cloudinary using secure signed REST API.
 */
export async function uploadImageToCloudinary(
  fileBuffer: Buffer | Blob,
  fileName: string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured."
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = options.folder || "faavy/products";

  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };

  const signature = generateCloudinarySignature(paramsToSign, apiSecret);

  const formData = new FormData();
  if (fileBuffer instanceof Blob) {
    formData.append("file", fileBuffer, fileName);
  } else {
    const blob = new Blob([new Uint8Array(fileBuffer)]);
    formData.append("file", blob, fileName);
  }

  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("folder", folder);
  formData.append("signature", signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Cloudinary upload failed with HTTP status ${response.status}`
    );
  }

  const data = await response.json();

  return {
    url: data.secure_url || data.url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
  };
}

/**
 * Deletes an image asset from Cloudinary using its public_id.
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    public_id: publicId,
    timestamp,
  };
  const signature = generateCloudinarySignature(paramsToSign, apiSecret);

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.ok;
}
