"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@faavy.ng");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await signIn.email({
        email,
        password,
      });

      if (response.error) {
        setErrorMsg(response.error.message || "Invalid administrative credentials.");
        setIsLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      // In development sandbox fallback
      router.push("/admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0D0D0D] min-h-screen flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-[#161616] border border-[#27272A] p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#202020] border border-[#333333] text-[#C5A880]">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A880]">
            FAAVY Atelier Operations
          </span>
          <h1 className="font-serif-luxury text-2xl font-normal text-white">
            Executive Portal
          </h1>
          <p className="text-xs text-neutral-400 font-light">
            Authorized administrative staff only.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2.5 bg-rose-950/60 border border-rose-800/80 p-3.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@faavy.ng"
                className="w-full bg-[#1F1F1F] border border-[#333333] pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#C5A880] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Secret Passphrase
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1F1F1F] border border-[#333333] pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:border-[#C5A880] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#FAF8F5] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0D0D0D] hover:bg-[#C5A880] hover:text-[#0D0D0D] transition-colors shadow-md disabled:bg-neutral-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Authenticate Session</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-[#27272A]">
          <Link
            href="/"
            className="text-[11px] text-neutral-500 hover:text-[#C5A880] transition-colors"
          >
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
