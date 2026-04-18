"use client";

import {
  approveContribution,
  rejectContribution,
} from "@/app/actions/contribution";
import { Check, Clock, Inbox, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface ContributionRow {
  id: string;
  person_id: string;
  field: string;
  new_value: string | null;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  contributor_user_id: string | null;
  contributor_name: string | null;
  contributor_email: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
  persons: { full_name: string } | null;
}

type Status = "pending" | "approved" | "rejected" | "all";

const FIELD_LABELS: Record<string, string> = {
  full_name: "Họ và tên",
  other_names: "Tên thường gọi",
  gender: "Giới tính",
  birth_year: "Năm sinh",
  birth_month: "Tháng sinh",
  birth_day: "Ngày sinh",
  death_year: "Năm mất",
  death_month: "Tháng mất",
  death_day: "Ngày mất",
  is_deceased: "Còn sống / Đã mất",
  generation: "Đời",
  is_in_law: "Chính tộc / Ngoại tộc",
  note: "Ghi chú",
  avatar_url: "Ảnh đại diện",
};

export default function ContributionReviewList({
  initialRows,
  activeStatus,
  counts,
}: {
  initialRows: ContributionRow[];
  activeStatus: Status;
  counts: { pending: number; approved: number; rejected: number };
}) {
  const [rows, setRows] = useState(initialRows);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<Record<string, string>>({});
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const tabs: { key: Status; label: string; count?: number }[] = [
    { key: "pending", label: "Chờ duyệt", count: counts.pending },
    { key: "approved", label: "Đã duyệt", count: counts.approved },
    { key: "rejected", label: "Từ chối", count: counts.rejected },
    { key: "all", label: "Tất cả" },
  ];

  const handleApprove = async (row: ContributionRow) => {
    setError(null);
    setBusyId(row.id);
    const finalValue = editingValue[row.id] ?? row.new_value ?? "";
    const res = await approveContribution(
      row.id,
      finalValue,
      reviewNote[row.id],
    );
    setBusyId(null);
    if (res.error) {
      setError(res.error);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleReject = async (row: ContributionRow) => {
    setError(null);
    setBusyId(row.id);
    const res = await rejectContribution(row.id, reviewNote[row.id]);
    setBusyId(null);
    if (res.error) {
      setError(res.error);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  return (
    <div>
      <div className="flex gap-1 p-1 bg-stone-100 rounded-full w-fit mb-6 text-sm">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`?status=${t.key}`}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
              activeStatus === t.key
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="ml-1.5 text-xs opacity-70">({t.count})</span>
            )}
          </Link>
        ))}
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/70 p-10 text-center text-stone-500">
          <Inbox className="size-10 mx-auto mb-3 text-stone-300" />
          Không có đóng góp nào ({tabs.find((t) => t.key === activeStatus)?.label}).
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-2xl border border-stone-200/70 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/dashboard/members/${row.person_id}`}
                      className="font-semibold text-stone-900 hover:text-amber-700"
                    >
                      {row.persons?.full_name ?? "(không rõ)"}
                    </Link>
                    <StatusBadge status={row.status} />
                  </div>
                  <p className="text-xs text-stone-500">
                    Đề xuất chỉnh{" "}
                    <span className="font-semibold text-stone-700">
                      {FIELD_LABELS[row.field] ?? row.field}
                    </span>{" "}
                    · {new Date(row.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="text-right text-xs text-stone-400">
                  {row.contributor_user_id ? (
                    <span className="text-stone-600 font-medium">
                      Thành viên đã đăng nhập
                    </span>
                  ) : row.contributor_name || row.contributor_email ? (
                    <>
                      <div className="text-stone-600 font-medium">
                        {row.contributor_name || "Khách"}
                      </div>
                      {row.contributor_email && (
                        <div>{row.contributor_email}</div>
                      )}
                    </>
                  ) : (
                    <span>Khách ẩn danh</span>
                  )}
                </div>
              </div>

              <div className="bg-stone-50 rounded-lg p-3 mb-3">
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Giá trị đề xuất (có thể chỉnh trước khi duyệt)
                </label>
                <input
                  type="text"
                  value={editingValue[row.id] ?? row.new_value ?? ""}
                  onChange={(e) =>
                    setEditingValue((p) => ({
                      ...p,
                      [row.id]: e.target.value,
                    }))
                  }
                  disabled={row.status !== "pending"}
                  className="w-full text-sm rounded-md border-stone-300 p-2 border bg-white disabled:bg-stone-100 disabled:text-stone-500"
                />
                {row.note && (
                  <p className="text-xs text-stone-500 mt-2">
                    <span className="font-semibold">Ghi chú:</span> {row.note}
                  </p>
                )}
              </div>

              {row.status === "pending" ? (
                <>
                  <input
                    type="text"
                    value={reviewNote[row.id] ?? ""}
                    onChange={(e) =>
                      setReviewNote((p) => ({
                        ...p,
                        [row.id]: e.target.value,
                      }))
                    }
                    placeholder="Ghi chú xét duyệt (tuỳ chọn)"
                    className="w-full text-sm rounded-md border-stone-300 p-2 border mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(row)}
                      disabled={busyId === row.id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <Check className="size-4" />
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleReject(row)}
                      disabled={busyId === row.id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-stone-300 text-stone-700 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 disabled:opacity-50 transition-colors"
                    >
                      <X className="size-4" />
                      Từ chối
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-xs text-stone-500 flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Đã xử lý{" "}
                  {row.reviewed_at
                    ? new Date(row.reviewed_at).toLocaleString("vi-VN")
                    : ""}
                  {row.review_note && (
                    <span className="ml-2">— {row.review_note}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ContributionRow["status"] }) {
  const map = {
    pending: { label: "Chờ duyệt", cls: "bg-amber-100 text-amber-800" },
    approved: { label: "Đã duyệt", cls: "bg-green-100 text-green-800" },
    rejected: { label: "Từ chối", cls: "bg-stone-100 text-stone-600" },
  };
  const c = map[status];
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.cls}`}>
      {c.label}
    </span>
  );
}
