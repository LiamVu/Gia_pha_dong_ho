"use server";

import { UserRole } from "@/types";
import { createAdminClient } from "@/utils/supabase/admin";
import { getIsAdmin, getSupabase } from "@/utils/supabase/queries";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

function generateInviteCode(): string {
  return randomBytes(16).toString("hex");
}

export async function createInviteLink(role: UserRole, maxUses: number) {
  if (!(await getIsAdmin())) return { error: "Access denied." };
  if (role !== "admin" && role !== "editor" && role !== "member") {
    return { error: "Vai trò không hợp lệ." };
  }
  if (!Number.isFinite(maxUses) || maxUses < 1 || maxUses > 10000) {
    return { error: "Số lần dùng tối đa phải trong khoảng 1–10000." };
  }

  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const code = generateInviteCode();
  const { data, error } = await supabase
    .from("invite_links")
    .insert({ code, role, max_uses: maxUses, created_by: user?.id })
    .select("id, code")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard/users");
  return { success: true, code: data.code };
}

export async function deleteInviteLink(id: string) {
  if (!(await getIsAdmin())) return { error: "Access denied." };
  const supabase = await getSupabase();
  const { error } = await supabase.from("invite_links").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function redeemInvite(
  code: string,
  email: string,
  password: string,
) {
  if (!code || !email || !password) {
    return { error: "Thiếu thông tin." };
  }
  if (password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự." };
  }

  const admin = createAdminClient();

  // Validate invite
  const { data: invite, error: inviteErr } = await admin
    .from("invite_links")
    .select("*")
    .eq("code", code)
    .single();
  if (inviteErr || !invite) {
    return { error: "Link mời không tồn tại hoặc đã bị xoá." };
  }
  if (invite.used_count >= invite.max_uses) {
    return { error: "Link mời đã hết lượt sử dụng." };
  }
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { error: "Link mời đã hết hạn." };
  }

  // Create auth user
  const { data: created, error: createErr } = await admin.auth.admin.createUser(
    { email, password, email_confirm: true },
  );
  if (createErr || !created.user) {
    return { error: createErr?.message ?? "Không tạo được tài khoản." };
  }

  // Upsert profile with correct role + active
  const { error: profileErr } = await admin.from("profiles").upsert(
    {
      id: created.user.id,
      role: invite.role,
      is_active: true,
    },
    { onConflict: "id" },
  );
  if (profileErr) {
    // Rollback: delete auth user so the invite stays usable
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: profileErr.message };
  }

  // Increment used_count (non-fatal if it fails — user is already created)
  await admin
    .from("invite_links")
    .update({ used_count: invite.used_count + 1 })
    .eq("id", invite.id);

  return { success: true, email };
}
