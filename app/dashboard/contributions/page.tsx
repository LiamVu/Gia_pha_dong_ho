import ContributionReviewList, {
  ContributionRow,
} from "@/components/ContributionReviewList";
import { getProfile, getSupabase } from "@/utils/supabase/queries";
import { redirect } from "next/navigation";

type Status = "pending" | "approved" | "rejected" | "all";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function ContributionsPage({ searchParams }: PageProps) {
  const profile = await getProfile();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { status } = await searchParams;
  const activeStatus: Status =
    status === "approved" || status === "rejected" || status === "all"
      ? status
      : "pending";

  const supabase = await getSupabase();
  let query = supabase
    .from("contributions")
    .select(
      "id, person_id, field, new_value, note, status, contributor_user_id, contributor_name, contributor_email, reviewed_at, review_note, created_at, persons(full_name)",
    )
    .order("created_at", { ascending: false });
  if (activeStatus !== "all") query = query.eq("status", activeStatus);

  const { data } = await query;
  const rows = (data ?? []) as unknown as ContributionRow[];

  const [{ count: pendingCount }, { count: approvedCount }, { count: rejectedCount }] =
    await Promise.all([
      supabase
        .from("contributions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("contributions")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved"),
      supabase
        .from("contributions")
        .select("id", { count: "exact", head: true })
        .eq("status", "rejected"),
    ]);

  return (
    <main className="flex-1 overflow-auto bg-stone-50/50 pt-8">
      <div className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="title">Đóng góp từ thành viên</h1>
          <p className="text-stone-500 mt-1 text-sm">
            Xét duyệt các đề xuất thay đổi thông tin từ thành viên và khách
            vãng lai.
          </p>
        </div>
        <ContributionReviewList
          initialRows={rows}
          activeStatus={activeStatus}
          counts={{
            pending: pendingCount ?? 0,
            approved: approvedCount ?? 0,
            rejected: rejectedCount ?? 0,
          }}
        />
      </div>
    </main>
  );
}
