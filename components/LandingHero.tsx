"use client";

import DongSonDrum, { DongSonHaloMemo } from "@/components/DongSonDrum";
import { ArrowRight, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LandingHeroProps {
  siteName: string;
}

type Theme = "light" | "dark";
const THEME_KEY = "giapha-landing-theme";

const CornerOrnament = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    stroke="currentColor"
    strokeWidth={0.8}
    className={className}
    aria-hidden="true"
  >
    <g opacity={0.9}>
      <path
        d="M10 10 L60 10 L60 14 L14 14 L14 60 L10 60 Z"
        fill="currentColor"
      />
      <circle cx={80} cy={80} r={30} />
      <circle cx={80} cy={80} r={22} />
      <circle cx={80} cy={80} r={14} />
      <path
        d="M80 60 L82 78 L100 80 L82 82 L80 100 L78 82 L60 80 L78 78 Z"
        fill="currentColor"
        opacity={0.6}
      />
    </g>
  </svg>
);

const cards = [
  {
    idx: "I / III",
    title: "Quản lý thành viên",
    desc: "Lưu giữ tên tuổi, hình ảnh, câu chuyện và dấu ấn riêng của từng thành viên — trọn vẹn một kiếp người trong từng trang phả.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth={1.2}>
        <circle cx={28} cy={20} r={7} />
        <circle cx={14} cy={38} r={5} />
        <circle cx={42} cy={38} r={5} />
        <path d="M28 27 L28 36 M28 36 L14 43 M28 36 L42 43" />
        <path d="M6 52 L50 52" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    idx: "II / III",
    title: "Sơ đồ phả hệ",
    desc: "Xem trực quan sơ đồ phả hệ, thế hệ và mối quan hệ gia đình với giao diện cây hiện đại, dễ thao tác.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth={1.2}>
        <circle cx={28} cy={28} r={24} />
        <circle cx={28} cy={28} r={16} />
        <circle cx={28} cy={28} r={8} />
        <path
          d="M28 12 L30 26 L44 28 L30 30 L28 44 L26 30 L12 28 L26 26 Z"
          fill="currentColor"
          opacity={0.4}
        />
      </svg>
    ),
  },
  {
    idx: "III / III",
    title: "Bảo mật thông tin",
    desc: "Dữ liệu dòng họ được niêm phong bằng mã hoá thế hệ mới, phân quyền theo vai vế — chỉ người trong tộc mới được mở từng lớp ký ức thiêng liêng.",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth={1.2}>
        <path d="M28 6 L48 14 V28 C48 40 38 48 28 52 C18 48 8 40 8 28 V14 Z" />
        <path d="M28 14 L42 20 V30 C42 38 36 43 28 46 C20 43 14 38 14 30 V20 Z" />
        <path
          d="M24 28 L27 32 L34 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function readSavedTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_KEY);
  return saved === "dark" || saved === "light" ? (saved as Theme) : "light";
}

export default function LandingHero({ siteName }: LandingHeroProps) {
  const [theme, setTheme] = useState<Theme>(readSavedTheme);

  useEffect(() => {
    // keep other tabs/windows in sync if user toggles elsewhere
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue as Theme);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  return (
    <div
      className="landing-root relative min-h-screen w-full overflow-hidden"
      data-theme={theme}
      style={{
        background: "var(--l-bg)",
        color: "var(--l-ink)",
        fontFamily: "var(--font-lora), var(--font-playfair), serif",
      }}
    >
      {/* ===== Background layers ===== */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{ color: "var(--l-stroke)" }}
      >
        <div className="absolute inset-0 landing-paper" />

        <div
          className="drum-halo w-[min(130vmin,1500px)] aspect-square opacity-[0.18]"
        >
          <DongSonHaloMemo />
        </div>

        <div
          className="drum-center w-[min(95vmin,1100px)] aspect-square"
          style={{
            opacity: "var(--l-drum-opacity)",
            filter: "drop-shadow(0 0 40px rgba(94,58,23,0.15))",
          }}
        >
          <DongSonDrum />
        </div>

        <CornerOrnament className="absolute -top-8 -left-8 size-[220px] opacity-[0.28]" />
        <CornerOrnament className="absolute -top-8 -right-8 size-[220px] opacity-[0.28] scale-x-[-1]" />
        <CornerOrnament className="absolute -bottom-8 -left-8 size-[220px] opacity-[0.28] scale-y-[-1]" />
        <CornerOrnament className="absolute -bottom-8 -right-8 size-[220px] opacity-[0.28] scale-x-[-1] scale-y-[-1]" />

        <div
          className="absolute inset-0 landing-grain"
          style={{ opacity: "var(--l-grain-opacity)" }}
        />
      </div>

      {/* ===== Page content ===== */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-10 lg:px-12 pt-6 sm:pt-8 pb-10 sm:pb-16">
        {/* Top bar: brand left, theme toggle right */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              className="grid place-items-center size-8 sm:size-9"
              style={{ color: "var(--l-bronze-deep)" }}
            >
              <svg viewBox="-20 -20 40 40" fill="none" stroke="currentColor">
                <circle r={18} strokeWidth={1} />
                <circle r={14} strokeWidth={1} />
                <circle r={9} strokeWidth={1} />
                <path
                  d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <div
                className="font-serif font-semibold text-[16px] sm:text-[22px] tracking-wide leading-tight"
                style={{ color: "var(--l-ink)" }}
              >
                {siteName}
              </div>
              <div
                className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase mt-0.5 hidden sm:block"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--l-muted)",
                }}
              >
                Nguồn cội · Mạch chảy · Lưu truyền
              </div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Chuyển sang tối" : "Chuyển sang sáng"}
            title={theme === "light" ? "Chuyển sang tối" : "Chuyển sang sáng"}
            className="size-9 sm:size-10 grid place-items-center rounded-full border backdrop-blur-sm transition-all hover:-translate-y-px"
            style={{
              borderColor: "var(--l-line)",
              background:
                theme === "light"
                  ? "rgba(255,250,240,0.6)"
                  : "rgba(60,44,30,0.55)",
              color: "var(--l-bronze-deep)",
            }}
          >
            {theme === "light" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </button>
        </div>

        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-10">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border backdrop-blur-sm mb-6 font-bold uppercase text-[10px] sm:text-[11px] tracking-[0.2em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              borderColor: "var(--l-line)",
              background:
                theme === "light"
                  ? "rgba(255,250,240,0.55)"
                  : "rgba(60,44,30,0.55)",
              color: "var(--l-bronze-deep)",
            }}
          >
            <span
              className="size-1.5 rounded-full"
              style={{
                background: "var(--l-bronze)",
                boxShadow: "0 0 0 3px rgba(194,138,61,0.25)",
              }}
            />
            {siteName} · Nền tảng phả hệ số
          </div>

          <div
            className="relative w-[60px] sm:w-[120px] h-[2px] mb-5"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--l-bronze), transparent)",
            }}
          >
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 size-2 border rotate-45"
              style={{ borderColor: "var(--l-bronze)" }}
            />
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 size-2 border rotate-45"
              style={{ borderColor: "var(--l-bronze)" }}
            />
          </div>

          <h1
            className="font-serif font-semibold leading-[0.95] tracking-tight"
            style={{
              fontSize: "clamp(56px, 10vw, 128px)",
              fontFamily: "var(--font-lora), var(--font-playfair), serif",
              color: "var(--l-ink)",
            }}
          >
            Dòng Họ
          </h1>

          <p
            className="text-[15px] sm:text-[18px] leading-relaxed max-w-xs sm:max-w-[640px] mt-5 mb-8 px-2"
            style={{
              fontFamily: "var(--font-lora), var(--font-playfair), serif",
              color: "var(--l-ink-soft)",
            }}
          >
            Nơi{" "}
            <em
              className="not-italic font-semibold"
              style={{ color: "var(--l-bronze-deep)" }}
            >
              dòng máu Lạc Hồng
            </em>{" "}
            chảy qua từng thế hệ, nơi mỗi cái tên là một nhịp trống đồng vọng
            lại từ bốn nghìn năm. Gìn giữ, khắc ghi và truyền lại cội rễ cho
            con cháu mai sau.
          </p>

          <Link
            href="/login"
            className="group relative inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-[2px] text-[13px] sm:text-[14px] font-bold uppercase tracking-[0.08em] overflow-hidden transition-all hover:-translate-y-px"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              background: "var(--l-btn-bg)",
              color: "var(--l-btn-fg)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--l-btn-bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--l-btn-bg)")
            }
          >
            <span
              className="absolute inset-1 border pointer-events-none"
              style={{ borderColor: "var(--l-btn-border)" }}
            />
            <span className="relative">Đăng nhập để trải nghiệm</span>
            <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Meta row — single line on mobile too */}
          <div
            className="mt-8 sm:mt-10 w-full max-w-[640px] grid grid-cols-3 gap-3 sm:gap-12 justify-items-center items-center text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em] uppercase"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--l-bronze-deep)",
            }}
          >
            {[
              { num: "18", label: "Đời Hùng Vương" },
              { num: "4.000+", label: "Năm văn hiến" },
              { num: "∞", label: "Thế hệ mai sau" },
            ].map((m) => (
              <div
                key={m.label}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 font-bold text-center"
              >
                <span
                  className="text-[18px] sm:text-[22px] font-medium tracking-normal leading-none"
                  style={{
                    fontFamily: "var(--font-lora), var(--font-playfair), serif",
                    color: "var(--l-bronze-deep)",
                  }}
                >
                  {m.num}
                </span>
                <span
                  className="text-[9px] sm:text-[11px] leading-tight"
                  style={{ color: "var(--l-ink-soft)" }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature cards */}
        <section className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-0 mt-8 sm:mt-10 relative">
          <span
            className="hidden md:block absolute left-1/2 -top-6 w-px h-[18px] opacity-40"
            style={{ background: "var(--l-bronze)" }}
          />
          {cards.map((c, i) => (
            <article
              key={c.title}
              className={`relative p-7 sm:p-10 backdrop-blur-md border transition-all hover:-translate-y-0.5 group
              ${i < cards.length - 1 ? "md:border-r-0" : ""}`}
              style={{
                background: "var(--l-card)",
                borderColor: "var(--l-card-border)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--l-card-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--l-card)")
              }
            >
              <span
                className="absolute top-4 right-4 text-[10px] tracking-[0.15em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--l-muted)",
                }}
              >
                {c.idx}
              </span>
              <div
                className="size-14 mb-5 transition-transform group-hover:rotate-[15deg]"
                style={{ color: "var(--l-bronze)" }}
              >
                {c.icon}
              </div>
              <h3
                className="text-2xl font-semibold mb-1.5"
                style={{
                  fontFamily: "var(--font-lora), var(--font-playfair), serif",
                  color: "var(--l-ink)",
                }}
              >
                {c.title}
              </h3>
              <p
                className="text-[14px] sm:text-[14.5px] leading-relaxed"
                style={{
                  fontFamily: "var(--font-lora), var(--font-playfair), serif",
                  color: "var(--l-ink-soft)",
                }}
              >
                {c.desc}
              </p>
            </article>
          ))}
        </section>

        <div
          className="mt-12 sm:mt-16 pt-4 border-t flex flex-wrap gap-3 justify-between text-[10px] uppercase tracking-[0.2em]"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            borderColor: "var(--l-line)",
            color: "var(--l-muted)",
          }}
        >
          <span>© {siteName} · MMXXVI</span>
          <span className="hidden sm:inline">
            Họa tiết lấy cảm hứng từ trống đồng Đông Sơn
          </span>
          <span>Bản khắc số · v1.0</span>
        </div>
      </div>
    </div>
  );
}
