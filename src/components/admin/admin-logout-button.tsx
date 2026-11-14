"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      router.push("/admin/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#333333] bg-[#1A1A1A] hover:bg-rose-950/40 hover:border-rose-800/80 text-neutral-300 hover:text-rose-300 text-xs transition-colors disabled:opacity-50"
      title="Terminate administrative session"
    >
      {isLoggingOut ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      <span>Sign Out</span>
    </button>
  );
}
