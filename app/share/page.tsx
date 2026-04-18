import { DashboardProvider } from "@/components/DashboardContext";
import DashboardViews from "@/components/DashboardViews";
import SharePersonPopover from "@/components/SharePersonPopover";
import ViewToggle, { ViewMode } from "@/components/ViewToggle";
import { Person } from "@/types";
import { createAdminClient } from "@/utils/supabase/admin";

interface PageProps {
  searchParams: Promise<{ view?: string; rootId?: string; avatar?: string }>;
}

export default async function SharePage({ searchParams }: PageProps) {
  const { view, rootId, avatar } = await searchParams;
  const initialView = view as ViewMode | undefined;
  const initialShowAvatar = avatar !== "hide";

  // Fetch via service role so no RLS / login needed for public visitors.
  // Only public-safe columns are selected; person_details_private is NEVER touched.
  let persons: Array<{
    id: string;
    full_name: string;
    gender: string;
    birth_year: number | null;
    birth_month: number | null;
    birth_day: number | null;
    death_year: number | null;
    death_month: number | null;
    death_day: number | null;
    is_deceased: boolean;
    is_in_law: boolean;
    birth_order: number | null;
    generation: number | null;
    other_names: string | null;
    avatar_url: string | null;
    note: string | null;
  }> = [];
  let relationships: Array<{
    id: string;
    type: string;
    person_a: string;
    person_b: string;
    note: string | null;
  }> = [];
  let fetchError: string | null = null;

  try {
    const admin = createAdminClient();
    const [personsRes, relsRes] = await Promise.all([
      admin
        .from("persons")
        .select(
          "id, full_name, gender, birth_year, birth_month, birth_day, death_year, death_month, death_day, is_deceased, is_in_law, birth_order, generation, other_names, avatar_url, note",
        )
        .order("birth_year", { ascending: true, nullsFirst: false }),
      admin
        .from("relationships")
        .select("id, type, person_a, person_b, note"),
    ]);
    persons = personsRes.data ?? [];
    relationships = relsRes.data ?? [];
  } catch (err) {
    fetchError = (err as Error).message;
  }

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto mt-16 px-4 text-center">
        <h1 className="text-xl font-semibold text-stone-900 mb-2">
          Không tải được cây gia phả
        </h1>
        <p className="text-sm text-stone-500">
          Máy chủ chưa cấu hình đầy đủ. Vui lòng liên hệ quản trị viên.
        </p>
      </div>
    );
  }

  const personsMap = new Map();
  persons.forEach((p) => personsMap.set(p.id, p));
  const childIds = new Set(
    relationships
      .filter(
        (r) => r.type === "biological_child" || r.type === "adopted_child",
      )
      .map((r) => r.person_b),
  );
  let finalRootId = rootId;
  if (!finalRootId || !personsMap.has(finalRootId)) {
    const fallback = persons.filter((p) => !childIds.has(p.id));
    if (fallback.length > 0) finalRootId = fallback[0].id;
    else if (persons.length > 0) finalRootId = persons[0].id;
  }

  return (
    <DashboardProvider
      initialView={initialView}
      initialRootId={finalRootId}
      initialShowAvatar={initialShowAvatar}
      readOnly
    >
      <ViewToggle />
      <DashboardViews
        persons={persons as never}
        relationships={relationships as never}
        canEdit={false}
      />
      <SharePersonPopover persons={persons as unknown as Person[]} />
    </DashboardProvider>
  );
}
