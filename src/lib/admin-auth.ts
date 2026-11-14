import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";

export interface AdminSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CUSTOMER";
  };
}

/**
 * Server-side helper to verify that the active user is an authenticated administrator.
 * Throws or returns null if unauthorized.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      // In development, also check if an admin user exists or dev bypass is configured
      // Fallback check against User table if Better Auth cookie is set
      return null;
    }

    if (session.user.role !== "ADMIN") {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as "ADMIN",
      },
    };
  } catch (error) {
    console.error("Admin auth verification error:", error);
    return null;
  }
}

/**
 * Emergency/Dev helper to verify if an admin account exists
 */
export async function hasAdminAccount(): Promise<boolean> {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });
  return Boolean(admin);
}
