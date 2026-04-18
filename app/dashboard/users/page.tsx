import AdminUserList from "@/components/AdminUserList";
import InviteLinkManager, {
  InviteLinkRow,
} from "@/components/InviteLinkManager";
import { AdminUserData } from "@/types";
import { getProfile, getSupabase } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === "admin";

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const supabase = await getSupabase();

  const [{ data: users, error }, { data: invites }] = await Promise.all([
    supabase.rpc("get_admin_users"),
    supabase
      .from("invite_links")
      .select("id, code, role, max_uses, used_count, created_at")
      .order("created_at", { ascending: false }),
  ]);

  if (error) {
    console.error("Error fetching users:", error);
  }

  const typedUsers = (users as AdminUserData[]) || [];
  const typedInvites = (invites as InviteLinkRow[]) || [];

  return (
    <main className="flex-1 overflow-auto bg-stone-50/50 flex flex-col pt-8 relative w-full">
      <div className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="title">Quản lý Người dùng</h1>
            <p className="text-stone-500 mt-2 text-sm sm:text-base">
              Danh sách các tài khoản đang tham gia vào hệ thống.
            </p>
          </div>
        </div>
        <AdminUserList initialUsers={typedUsers} currentUserId={profile.id} />
        <InviteLinkManager initialLinks={typedInvites} />
      </div>
    </main>
  );
}
