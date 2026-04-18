"use client";

import ContributeForm from "@/components/ContributeForm";
import { useDashboard } from "@/components/DashboardContext";
import { Person } from "@/types";
import { MessageSquarePlus, X } from "lucide-react";
import { useState } from "react";

export default function SharePersonPopover({
  persons,
}: {
  persons: Person[];
}) {
  const { memberModalId, setMemberModalId } = useDashboard();
  const [showForm, setShowForm] = useState(false);

  const person = persons.find((p) => p.id === memberModalId);
  if (!person) return null;

  const handleClose = () => {
    setShowForm(false);
    setMemberModalId(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/30 backdrop-blur-[2px]"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {showForm ? (
          <ContributeForm
            personId={person.id}
            personName={person.full_name}
            anonymous
            onClose={handleClose}
          />
        ) : (
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-0.5">
                  Thành viên
                </p>
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  {person.full_name}
                </h3>
                {person.birth_year && (
                  <p className="text-xs text-stone-500 mt-0.5">
                    Sinh {person.birth_year}
                    {person.is_deceased &&
                      person.death_year &&
                      ` — Mất ${person.death_year}`}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="size-4" />
              </button>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-1.5 bg-amber-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
            >
              <MessageSquarePlus className="size-4" />
              Đóng góp thông tin
            </button>
            <p className="text-[11px] text-stone-400 text-center mt-2">
              Thông tin chi tiết chỉ hiển thị cho thành viên đã đăng nhập.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
