import { createAdminClient } from "@/utils/supabase/admin";
import Link from "next/link";
import InviteRedeemForm from "./InviteRedeemForm";

interface PageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function InvitePage({ searchParams }: PageProps) {
  const { code } = await searchParams;

  if (!code) {
    return <InviteError message="Link mời không hợp lệ (thiếu mã)." />;
  }

  let invite:
    | { role: string; max_uses: number; used_count: number; expires_at: string | null }
    | null = null;
  let envError = false;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("invite_links")
      .select("role, max_uses, used_count, expires_at")
      .eq("code", code)
      .single();
    invite = data;
  } catch {
    envError = true;
  }

  if (envError) {
    return (
      <InviteError message="Máy chủ chưa cấu hình. Vui lòng liên hệ quản trị viên." />
    );
  }
  if (!invite) {
    return <InviteError message="Link mời không tồn tại hoặc đã bị xoá." />;
  }
  if (invite.used_count >= invite.max_uses) {
    return <InviteError message="Link mời đã hết lượt sử dụng." />;
  }
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return <InviteError message="Link mời đã hết hạn." />;
  }

  const roleLabel =
    invite.role === "admin"
      ? "Quản trị viên"
      : invite.role === "editor"
        ? "Biên tập viên"
        : "Thành viên";

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
      <h1 className="font-serif font-bold text-2xl text-stone-900 mb-1">
        Tạo tài khoản
      </h1>
      <p className="text-sm text-stone-500 mb-6">
        Bạn được mời tham gia với quyền{" "}
        <span className="font-semibold text-amber-700">{roleLabel}</span>.
      </p>
      <InviteRedeemForm code={code} />
    </div>
  );
}

function InviteError({ message }: { message: string }) {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-rose-200 shadow-sm p-6 sm:p-8 text-center">
      <p className="text-stone-900 font-semibold mb-2">Không dùng được link</p>
      <p className="text-sm text-stone-500 mb-6">{message}</p>
      <Link
        href="/"
        className="inline-block text-sm font-medium text-amber-700 hover:underline"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
