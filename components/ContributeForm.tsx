"use client";

import {
  submitContribution,
  type ContributionField,
} from "@/app/actions/contribution";
import { MessageSquarePlus, Send, X } from "lucide-react";
import { useState } from "react";

const FIELD_OPTIONS: {
  value: ContributionField;
  label: string;
  placeholder: string;
  inputType?: "text" | "number" | "textarea" | "select";
  options?: { value: string; label: string }[];
}[] = [
  { value: "full_name", label: "Họ và tên", placeholder: "Ví dụ: Vũ Minh Tâm" },
  { value: "other_names", label: "Tên thường gọi", placeholder: "Ví dụ: Bẹp" },
  {
    value: "gender",
    label: "Giới tính",
    placeholder: "",
    inputType: "select",
    options: [
      { value: "male", label: "Nam" },
      { value: "female", label: "Nữ" },
      { value: "other", label: "Khác" },
    ],
  },
  { value: "birth_year", label: "Năm sinh", placeholder: "VD: 1950", inputType: "number" },
  { value: "birth_month", label: "Tháng sinh", placeholder: "1-12", inputType: "number" },
  { value: "birth_day", label: "Ngày sinh", placeholder: "1-31", inputType: "number" },
  { value: "death_year", label: "Năm mất", placeholder: "VD: 2020", inputType: "number" },
  { value: "death_month", label: "Tháng mất", placeholder: "1-12", inputType: "number" },
  { value: "death_day", label: "Ngày mất", placeholder: "1-31", inputType: "number" },
  {
    value: "is_deceased",
    label: "Còn sống / Đã mất",
    placeholder: "",
    inputType: "select",
    options: [
      { value: "false", label: "Còn sống" },
      { value: "true", label: "Đã mất" },
    ],
  },
  { value: "generation", label: "Đời (thế hệ)", placeholder: "VD: 3", inputType: "number" },
  {
    value: "is_in_law",
    label: "Chính tộc / Ngoại tộc",
    placeholder: "",
    inputType: "select",
    options: [
      { value: "false", label: "Chính tộc" },
      { value: "true", label: "Ngoại tộc" },
    ],
  },
  { value: "note", label: "Ghi chú / tiểu sử", placeholder: "Mô tả...", inputType: "textarea" },
  { value: "avatar_url", label: "Ảnh đại diện (URL)", placeholder: "https://…" },
];

interface Props {
  personId: string;
  personName: string;
  anonymous?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ContributeForm({
  personId,
  personName,
  anonymous = false,
  onClose,
  onSuccess,
}: Props) {
  const [field, setField] = useState<ContributionField>("birth_year");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = FIELD_OPTIONS.find((f) => f.value === field)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await submitContribution({
      person_id: personId,
      field,
      new_value: value,
      note,
      contributor_name: anonymous ? contributorName : undefined,
      contributor_email: anonymous ? contributorEmail : undefined,
    });
    setSubmitting(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setDone(true);
    onSuccess?.();
    setTimeout(onClose, 1500);
  };

  if (done) {
    return (
      <div className="p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 mx-auto mb-3 flex items-center justify-center">
          <Send className="size-5 text-green-700" />
        </div>
        <h3 className="font-semibold text-stone-900 mb-1">Đã gửi đóng góp</h3>
        <p className="text-sm text-stone-500">
          Cảm ơn bạn! Quản trị viên sẽ xem xét sớm.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="size-5 text-amber-700" />
          <div>
            <h3 className="font-semibold text-stone-900 text-sm">
              Đóng góp thông tin
            </h3>
            <p className="text-xs text-stone-500 truncate max-w-[200px]">
              {personName}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 p-1"
        >
          <X className="size-4" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1">
          Loại thông tin
        </label>
        <select
          value={field}
          onChange={(e) => {
            setField(e.target.value as ContributionField);
            setValue("");
          }}
          className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
        >
          {FIELD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1">
          {current.label}
        </label>
        {current.inputType === "select" ? (
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
          >
            <option value="">-- Chọn --</option>
            {current.options!.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : current.inputType === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={current.placeholder}
            required
            rows={3}
            className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
          />
        ) : (
          <input
            type={current.inputType ?? "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={current.placeholder}
            required
            className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
          />
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1">
          Ghi chú (tuỳ chọn)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="VD: Theo lời kể của bác Hai..."
          className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
        />
      </div>

      {anonymous && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Tên bạn (tuỳ chọn)
            </label>
            <input
              type="text"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              placeholder="Để admin biết ai đóng góp"
              className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Email (tuỳ chọn)
            </label>
            <input
              type="email"
              value={contributorEmail}
              onChange={(e) => setContributorEmail(e.target.value)}
              placeholder="email@..."
              className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-1.5 bg-amber-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800 disabled:opacity-50 transition-colors"
      >
        <Send className="size-4" />
        {submitting ? "Đang gửi..." : "Gửi đóng góp"}
      </button>
      <p className="text-[11px] text-stone-400 text-center">
        Đóng góp sẽ được quản trị viên xét duyệt trước khi áp dụng.
      </p>
    </form>
  );
}
