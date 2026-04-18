"use client";

import { createInviteLink, deleteInviteLink } from "@/app/actions/invite";
import { UserRole } from "@/types";
import { Check, Copy, Link2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface InviteLinkRow {
  id: string;
  code: string;
  role: UserRole;
  max_uses: number;
  used_count: number;
  created_at: string;
}

export default function InviteLinkManager({
  initialLinks,
}: {
  initialLinks: InviteLinkRow[];
}) {
  const [links, setLinks] = useState<InviteLinkRow[]>(initialLinks);
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState<UserRole>("member");
  const [maxUses, setMaxUses] = useState(1);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const shareOrigin =
    typeof window !== "undefined" ? window.location.origin : "";

  const handleCreate = async () => {
    setError(null);
    setCreating(true);
    const res = await createInviteLink(role, maxUses);
    setCreating(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setShowModal(false);
    setLinks((prev) => [
      {
        id: crypto.randomUUID(),
        code: res.code!,
        role,
        max_uses: maxUses,
        used_count: 0,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setMaxUses(1);
    setRole("member");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xoá link mời này?")) return;
    const res = await deleteInviteLink(id);
    if (res.error) {
      alert(res.error);
      return;
    }
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCopy = (code: string) => {
    const url = `${shareOrigin}/invite?code=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="mt-8 bg-white rounded-2xl border border-stone-200/70 shadow-sm">
      <header className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
        <div>
          <h2 className="font-semibold text-stone-900 flex items-center gap-2">
            <Link2 className="size-4 text-amber-700" />
            Link mời
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {links.length} link
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          <Plus className="size-4" />
          Tạo link mới
        </button>
      </header>

      {links.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-stone-500">
          Chưa có link mời nào.
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          <div className="hidden sm:grid grid-cols-[1fr_120px_130px_120px_90px] gap-3 px-6 py-2.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
            <span>Link</span>
            <span>Quyền</span>
            <span>Đã dùng / Tối đa</span>
            <span>Ngày tạo</span>
            <span />
          </div>
          {links.map((link) => (
            <div
              key={link.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_120px_130px_120px_90px] gap-3 px-6 py-3 items-center text-sm"
            >
              <code className="bg-stone-100 px-2 py-1 rounded text-xs text-stone-700 truncate">
                …?code={link.code.slice(0, 8)}…
              </code>
              <span className="inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 uppercase">
                {link.role}
              </span>
              <span className="text-stone-600">
                {link.used_count} / {link.max_uses}
              </span>
              <span className="text-stone-400 text-xs">
                {new Date(link.created_at).toLocaleDateString("vi-VN")}
              </span>
              <div className="flex items-center gap-1 justify-end">
                <button
                  onClick={() => handleCopy(link.code)}
                  title="Copy link"
                  className="p-1.5 rounded hover:bg-stone-100 text-stone-500 hover:text-amber-700 transition-colors"
                >
                  {copiedCode === link.code ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  title="Xoá"
                  className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold text-lg text-stone-900 mb-1">
              Tạo link mời thành viên
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Chọn quyền và tạo link mời cho thành viên mới
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Quyền
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2.5 border"
                >
                  <option value="member">Member — Xem và đề xuất chỉnh sửa</option>
                  <option value="editor">Editor — Chỉnh sửa trực tiếp</option>
                  <option value="admin">Admin — Toàn quyền</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Số lần dùng tối đa
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={maxUses}
                  onChange={(e) =>
                    setMaxUses(Number.parseInt(e.target.value, 10) || 1)
                  }
                  className="w-full text-sm rounded-lg border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2.5 border"
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-stone-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors"
                >
                  <Link2 className="size-4" />
                  {creating ? "Đang tạo..." : "Tạo link mời"}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
                  className="px-4 py-2.5 border border-stone-300 text-stone-700 rounded-lg text-sm hover:bg-stone-50 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
