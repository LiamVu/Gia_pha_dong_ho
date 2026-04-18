"use server";

import { UserRole } from "@/types";
import { createAdminClient } from "@/utils/supabase/admin";
import { getSupabase, getIsAdmin } from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";

export async function changeUserRole(userId: string, newRole: UserRole) {
  const supabase = await getSupabase();
  const { error } = await supabase.rpc("set_user_role", {
    target_user_id: userId,
    new_role: newRole,
  });

  if (error) {
    console.error("Failed to change user role:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  if (!(await getIsAdmin())) return { error: "Access denied." };

  const supabase = await getSupabase();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (currentUser?.id === userId) {
    return { error: "Cannot delete yourself." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) {
      console.error("Failed to delete user:", error);
      return { error: error.message };
    }
  } catch (err) {
    const e = err as Error;
    return { error: e.message };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function adminCreateUser(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString() || "member";

  if (role !== "admin" && role !== "editor" && role !== "member") {
    return { error: "Vai trò không hợp lệ." };
  }

  const isActiveStr = formData.get("is_active")?.toString();
  const isActive = isActiveStr === "false" ? false : true;

  if (!email || !password) {
    return { error: "Email và mật khẩu là bắt buộc." };
  }

  if (!(await getIsAdmin())) return { error: "Access denied." };

  try {
    const admin = createAdminClient();
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr || !created.user) {
      console.error("Failed to create auth user:", createErr);
      return { error: createErr?.message ?? "Không tạo được user." };
    }

    // Upsert profile: on_auth_user_created trigger may have already created it as 'member'
    const { error: profileErr } = await admin
      .from("profiles")
      .upsert(
        {
          id: created.user.id,
          role,
          is_active: isActive,
        },
        { onConflict: "id" },
      );
    if (profileErr) {
      console.error("Failed to set profile:", profileErr);
      return { error: profileErr.message };
    }
  } catch (err) {
    const e = err as Error;
    return { error: e.message };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function toggleUserStatus(userId: string, newStatus: boolean) {
  const supabase = await getSupabase();
  const { error } = await supabase.rpc("set_user_active_status", {
    target_user_id: userId,
    new_status: newStatus,
  });

  if (error) {
    console.error("Failed to change user status:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}
