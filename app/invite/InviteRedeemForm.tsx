"use client";

import { redeemInvite } from "@/app/actions/invite";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InviteRedeemForm({ code }: { code: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await redeemInvite(code, email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Auto-login after successful redeem
    const supabase = createClient();
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInErr) {
      // Fallback: redirect to login with hint
      router.push(`/login?email=${encodeURIComponent(email)}`);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2.5 border"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1">
          Mật khẩu
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2.5 border"
          placeholder="Ít nhất 6 ký tự"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Đang tạo..." : "Tạo tài khoản & Đăng nhập"}
      </button>
    </form>
  );
}
