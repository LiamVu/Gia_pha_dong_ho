"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, ChevronDown, Database, GitMerge, Inbox, Network, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "./LogoutButton";
import { useUser } from "./UserProvider";

export default function HeaderMenu() {
  const { user, isAdmin, supabase } = useUser();
  const userEmail = user?.email;
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      const { count } = await supabase
        .from("contributions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      if (!cancelled) setPendingCount(count ?? 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border backdrop-blur-sm transition-all hover:-translate-y-px"
        style={{
          borderColor: "var(--l-line)",
          background: "rgba(255,250,240,0.65)",
          color: "var(--l-bronze-deep)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
        }}
      >
        <div
          className="size-7 rounded-full grid place-items-center font-bold text-[14px]"
          style={{
            background: "var(--l-bronze-glow)",
            color: "#1c1410",
            fontFamily: "var(--font-lora), var(--font-playfair), serif",
          }}
        >
          {userEmail ? (
            userEmail.charAt(0).toUpperCase()
          ) : (
            <UserCircle className="size-4" />
          )}
        </div>
        <ChevronDown
          className={`size-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/60 py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-0.5">
                Tài khoản
              </p>
              <p className="text-sm font-medium text-stone-900 truncate">
                {userEmail}
              </p>
            </div>

            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Network className="size-4" />
                Trang chủ
              </Link>

              <Link
                href="/dashboard/members"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Network className="size-4" />
                Cây gia phả
              </Link>
              
              <Link
                href="/dashboard/kinship"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <GitMerge className="size-4" />
                Tra cứu danh xưng
              </Link>

              <Link
                href="/dashboard/stats"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              >
                <BarChart2 className="size-4" />
                Thống kê
              </Link>

              {isAdmin && (
                <>
                  <div className="px-4 py-2 mt-1">
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                      Quản trị viên
                    </p>
                  </div>
                  
                  <Link
                    href="/dashboard/users"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    <Users className="size-4" />
                    Quản lý Người dùng
                  </Link>

                  <Link
                    href="/dashboard/contributions"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Inbox className="size-4" />
                      Kiểm duyệt
                    </span>
                    {pendingCount !== null && pendingCount > 0 && (
                      <span className="text-[11px] font-bold bg-amber-600 text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {pendingCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/dashboard/lineage"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                  >
                    <Network className="size-4" />
                    Thứ tự gia phả
                  </Link>

                  <Link
                    href="/dashboard/data"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                  >
                    <Database className="size-4" />
                    Sao lưu & Phục hồi
                  </Link>
                </>
              )}

              <div className="h-px bg-stone-100 my-1 mx-4" />

              <LogoutButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
