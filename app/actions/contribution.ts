"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { getIsAdmin, getSupabase } from "@/utils/supabase/queries";
import { revalidatePath } from "next/cache";

export type ContributionField =
  | "full_name"
  | "other_names"
  | "gender"
  | "birth_year"
  | "birth_month"
  | "birth_day"
  | "death_year"
  | "death_month"
  | "death_day"
  | "is_deceased"
  | "generation"
  | "is_in_law"
  | "note"
  | "avatar_url";

const ALLOWED_FIELDS: ContributionField[] = [
  "full_name",
  "other_names",
  "gender",
  "birth_year",
  "birth_month",
  "birth_day",
  "death_year",
  "death_month",
  "death_day",
  "is_deceased",
  "generation",
  "is_in_law",
  "note",
  "avatar_url",
];

interface SubmitInput {
  person_id: string;
  field: ContributionField;
  new_value: string;
  note?: string;
  contributor_name?: string;
  contributor_email?: string;
}

export async function submitContribution(input: SubmitInput) {
  if (!input.person_id) return { error: "Thiếu person_id." };
  if (!ALLOWED_FIELDS.includes(input.field))
    return { error: "Loại thông tin không hợp lệ." };
  if (!input.new_value?.trim()) return { error: "Giá trị không được trống." };

  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload = {
    person_id: input.person_id,
    field: input.field,
    new_value: input.new_value.trim().slice(0, 2000),
    note: input.note?.trim().slice(0, 2000) || null,
    contributor_user_id: user?.id ?? null,
    contributor_name: input.contributor_name?.trim().slice(0, 200) || null,
    contributor_email: input.contributor_email?.trim().slice(0, 200) || null,
  };

  if (user) {
    // Logged-in: use regular client, RLS allows own row insert
    const { error } = await supabase.from("contributions").insert(payload);
    if (error) return { error: error.message };
  } else {
    // Anonymous: use admin client to bypass RLS
    try {
      const admin = createAdminClient();
      const { error } = await admin.from("contributions").insert(payload);
      if (error) return { error: error.message };
    } catch (err) {
      return { error: (err as Error).message };
    }
  }

  return { success: true };
}

function parseValue(
  field: ContributionField,
  raw: string,
): { ok: true; value: unknown } | { ok: false; error: string } {
  const s = raw.trim();
  switch (field) {
    case "full_name":
    case "other_names":
    case "note":
    case "avatar_url":
      return { ok: true, value: s };
    case "gender": {
      const v = s.toLowerCase();
      if (v === "male" || v === "female" || v === "other")
        return { ok: true, value: v };
      return { ok: false, error: "gender phải là male/female/other" };
    }
    case "is_deceased":
    case "is_in_law": {
      const v = s.toLowerCase();
      if (["true", "1", "yes", "có"].includes(v))
        return { ok: true, value: true };
      if (["false", "0", "no", "không"].includes(v))
        return { ok: true, value: false };
      return { ok: false, error: "Giá trị boolean không hợp lệ" };
    }
    default: {
      // numeric fields: birth_* / death_* / generation
      const n = Number.parseInt(s, 10);
      if (!Number.isFinite(n))
        return { ok: false, error: "Giá trị phải là số" };
      return { ok: true, value: n };
    }
  }
}

export async function approveContribution(
  id: string,
  finalValue: string,
  reviewNote?: string,
) {
  if (!(await getIsAdmin())) return { error: "Access denied." };

  const supabase = await getSupabase();
  const { data: user } = await supabase.auth.getUser();

  const { data: contribution, error: fetchErr } = await supabase
    .from("contributions")
    .select("id, person_id, field, status")
    .eq("id", id)
    .single();
  if (fetchErr || !contribution) return { error: "Không tìm thấy đóng góp." };
  if (contribution.status !== "pending")
    return { error: "Đóng góp này đã được xử lý." };

  const parsed = parseValue(
    contribution.field as ContributionField,
    finalValue,
  );
  if (!parsed.ok) return { error: parsed.error };

  const { error: updatePersonErr } = await supabase
    .from("persons")
    .update({ [contribution.field]: parsed.value })
    .eq("id", contribution.person_id);
  if (updatePersonErr) return { error: updatePersonErr.message };

  const { error: markErr } = await supabase
    .from("contributions")
    .update({
      status: "approved",
      reviewed_by: user.user?.id ?? null,
      reviewed_at: new Date().toISOString(),
      review_note: reviewNote?.trim() || null,
      new_value: finalValue, // store what actually applied
    })
    .eq("id", id);
  if (markErr) return { error: markErr.message };

  revalidatePath("/dashboard/contributions");
  revalidatePath("/dashboard/members");
  return { success: true };
}

export async function rejectContribution(id: string, reviewNote?: string) {
  if (!(await getIsAdmin())) return { error: "Access denied." };

  const supabase = await getSupabase();
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("contributions")
    .update({
      status: "rejected",
      reviewed_by: user.user?.id ?? null,
      reviewed_at: new Date().toISOString(),
      review_note: reviewNote?.trim() || null,
    })
    .eq("id", id)
    .eq("status", "pending");
  if (error) return { error: error.message };

  revalidatePath("/dashboard/contributions");
  return { success: true };
}
