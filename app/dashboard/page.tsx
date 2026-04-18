import { getTodayLunar } from "@/utils/dateHelpers";
import { computeEvents } from "@/utils/eventHelpers";
import { getIsAdmin, getSupabase } from "@/utils/supabase/queries";
import {
  ArrowRight,
  BarChart2,
  CalendarDays,
  Database,
  Dot,
  GitMerge,
  Network,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

type FeatIconColor = "bronze" | "rose" | "indigo" | "violet" | "patina";

const iconColors: Record<
  FeatIconColor,
  { bg: string; border: string; color: string }
> = {
  bronze: {
    bg: "rgba(194,138,61,0.14)",
    border: "rgba(194,138,61,0.3)",
    color: "var(--l-bronze-deep)",
  },
  rose: {
    bg: "rgba(184,95,95,0.12)",
    border: "rgba(184,95,95,0.28)",
    color: "#8a3a3a",
  },
  indigo: {
    bg: "rgba(88,90,150,0.12)",
    border: "rgba(88,90,150,0.28)",
    color: "#3f4276",
  },
  violet: {
    bg: "rgba(120,88,150,0.12)",
    border: "rgba(120,88,150,0.28)",
    color: "#5e3a76",
  },
  patina: {
    bg: "rgba(77,107,90,0.14)",
    border: "rgba(77,107,90,0.3)",
    color: "#2d4a3a",
  },
};

interface FeatItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  color: FeatIconColor;
}

const publicFeatures: FeatItem[] = [
  {
    title: "Cây gia phả",
    desc: "Xem và tương tác với sơ đồ dòng họ",
    href: "/dashboard/members",
    color: "bronze",
    icon: <Network className="size-5" />,
  },
  {
    title: "Tra cứu danh xưng",
    desc: "Hệ thống gọi tên họ hàng chuẩn xác",
    href: "/dashboard/kinship",
    color: "indigo",
    icon: <GitMerge className="size-5" />,
  },
  {
    title: "Thống kê gia phả",
    desc: "Tổng quan dữ liệu và biểu đồ phân tích",
    href: "/dashboard/stats",
    color: "violet",
    icon: <BarChart2 className="size-5" />,
  },
];

const adminFeatures: FeatItem[] = [
  {
    title: "Quản lý Người dùng",
    desc: "Phê duyệt tài khoản và phân quyền",
    href: "/dashboard/users",
    color: "rose",
    icon: <Users className="size-5" />,
  },
  {
    title: "Thứ tự gia phả",
    desc: "Sắp xếp và xem cấu trúc hệ thống",
    href: "/dashboard/lineage",
    color: "indigo",
    icon: <Network className="size-5" />,
  },
  {
    title: "Sao lưu & Phục hồi",
    desc: "Xuất/Nhập dữ liệu toàn hệ thống",
    href: "/dashboard/data",
    color: "patina",
    icon: <Database className="size-5" />,
  },
];

export default async function DashboardLaunchpad() {
  const isAdmin = await getIsAdmin();
  const supabase = await getSupabase();

  const { data: persons } = await supabase
    .from("persons")
    .select(
      "id, full_name, birth_year, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased",
    );

  const { data: customEvents } = await supabase
    .from("custom_events")
    .select("id, name, content, event_date, location, created_by");

  const allEvents = computeEvents(persons ?? [], customEvents ?? []);
  const upcomingEvents = allEvents
    .filter((e) => e.daysUntil >= 0 && e.daysUntil <= 30)
    .slice(0, 3);

  const lunar = getTodayLunar();

  return (
    <main className="relative max-w-[1160px] mx-auto w-full px-5 sm:px-7 pb-14 pt-6 sm:pt-8">
      {/* ===== Hero card (date + upcoming events) ===== */}
      <section
        className="relative backdrop-blur-md border p-6 sm:p-8 mb-6 grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1fr_auto] lg:items-center"
        style={{
          background: "var(--l-card)",
          borderColor: "var(--l-card-border)",
        }}
      >
        <CardCorners />

        {/* Date block */}
        <div className="flex gap-4 sm:gap-5 items-start">
          <div
            className="size-12 sm:size-[52px] shrink-0 grid place-items-center border"
            style={{
              borderColor: "var(--l-line)",
              background: "rgba(255,250,240,0.9)",
              color: "var(--l-bronze-deep)",
            }}
          >
            <CalendarDays className="size-6" />
          </div>
          <div className="min-w-0">
            <div
              className="text-[10px] tracking-[0.22em] uppercase mb-1.5"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--l-muted)",
              }}
            >
              Hôm nay · Dương lịch
            </div>
            <h2
              className="font-semibold text-[22px] sm:text-[28px] lg:text-[30px] leading-tight tracking-tight mb-2"
              style={{
                fontFamily: "var(--font-lora), var(--font-playfair), serif",
                color: "var(--l-ink)",
              }}
            >
              {lunar.solarStr}
            </h2>
            <div
              className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--l-muted)",
              }}
            >
              Âm lịch ·{" "}
              <b
                className="font-semibold text-[13px] tracking-normal normal-case"
                style={{
                  fontFamily: "var(--font-lora), var(--font-playfair), serif",
                  color: "var(--l-bronze-deep)",
                }}
              >
                {lunar.lunarDayStr}
              </b>
            </div>
            <div
              className="italic text-[13px] sm:text-[14px] mt-2"
              style={{
                fontFamily: "var(--font-lora), var(--font-playfair), serif",
                color: "var(--l-ink-soft)",
              }}
            >
              Năm {lunar.lunarYear}
            </div>
          </div>
        </div>

        {/* Upcoming events */}
        <div
          className="lg:border-l lg:pl-7 lg:border-dashed border-t pt-5 lg:pt-0 lg:border-t-0 lg:border-dashed-0"
          style={{ borderColor: "var(--l-line)" }}
        >
          <div
            className="flex items-center gap-2.5 mb-3 text-[11px] tracking-[0.22em] uppercase font-medium"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--l-bronze-deep)",
            }}
          >
            <span
              className="size-1.5 rounded-full"
              style={{
                background: "var(--l-bronze-glow)",
                boxShadow: "0 0 0 3px rgba(194,138,61,0.25)",
              }}
            />
            Sự kiện 30 ngày tới ·{" "}
            <span
              className="normal-case font-normal"
              style={{ color: "var(--l-muted)" }}
            >
              ({upcomingEvents.length})
            </span>
          </div>
          {upcomingEvents.length === 0 ? (
            <div
              className="flex items-center gap-2 px-3.5 py-3 border text-[13px]"
              style={{
                background: "rgba(255,250,240,0.55)",
                borderColor: "var(--l-line)",
                color: "var(--l-muted)",
                fontFamily: "var(--font-lora), var(--font-playfair), serif",
              }}
            >
              <Dot className="size-4" />
              Không có sự kiện nào trong 30 ngày tới.
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingEvents.map((evt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 px-3.5 py-2.5 border"
                  style={{
                    background: "rgba(255,250,240,0.75)",
                    borderColor: "var(--l-line)",
                  }}
                >
                  <div
                    className="size-9 shrink-0 grid place-items-center border"
                    style={{
                      background: "rgba(194,138,61,0.18)",
                      borderColor: "rgba(194,138,61,0.35)",
                      color: "var(--l-bronze-deep)",
                    }}
                  >
                    <Star className="size-4" fill="currentColor" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="font-semibold text-[14px] sm:text-[15px] truncate"
                      style={{
                        fontFamily:
                          "var(--font-lora), var(--font-playfair), serif",
                        color: "var(--l-ink)",
                      }}
                    >
                      {evt.personName}
                    </div>
                    <div
                      className="mt-0.5 text-[10px] tracking-[0.14em] uppercase"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        color: "var(--l-muted)",
                      }}
                    >
                      {evt.daysUntil === 0
                        ? "Hôm nay"
                        : evt.daysUntil === 1
                          ? "Ngày mai"
                          : `${evt.daysUntil} ngày nữa`}{" "}
                      · {evt.eventDateLabel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Arrow to /events */}
        <Link
          href="/dashboard/events"
          aria-label="Xem tất cả sự kiện"
          className="hidden lg:grid place-items-center size-10 border transition-all hover:-translate-y-px self-start"
          style={{
            borderColor: "var(--l-line)",
            background: "rgba(255,250,240,0.6)",
            color: "var(--l-bronze-deep)",
          }}
        >
          <ArrowRight className="size-4" />
        </Link>
      </section>

      {/* ===== Public features ===== */}
      <FeatureGrid items={publicFeatures} />

      {/* ===== Admin section ===== */}
      {isAdmin && (
        <>
          <div className="flex items-center gap-3.5 mt-10 mb-4">
            <span
              className="w-7 h-px"
              style={{ background: "var(--l-bronze)" }}
            />
            <h3
              className="italic font-medium text-[20px] sm:text-[22px] tracking-wide m-0"
              style={{
                fontFamily: "var(--font-lora), var(--font-playfair), serif",
                color: "var(--l-bronze-deep)",
              }}
            >
              Quản trị viên
            </h3>
          </div>
          <FeatureGrid items={adminFeatures} />
        </>
      )}

    </main>
  );
}

function CardCorners() {
  return (
    <>
      <span
        className="absolute -top-px -left-px size-[14px] border"
        style={{
          borderColor: "var(--l-bronze)",
          borderRight: "none",
          borderBottom: "none",
        }}
      />
      <span
        className="absolute -bottom-px -right-px size-[14px] border"
        style={{
          borderColor: "var(--l-bronze)",
          borderLeft: "none",
          borderTop: "none",
        }}
      />
    </>
  );
}

function FeatureGrid({ items }: { items: FeatItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {items.map((f) => {
        const c = iconColors[f.color];
        return (
          <Link
            key={f.href}
            href={f.href}
            className="relative group block backdrop-blur-md border p-6 sm:p-7 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(94,58,23,0.08)]"
            style={{
              background: "var(--l-card)",
              borderColor: "var(--l-card-border)",
            }}
          >
            <CardCorners />
            <div
              className="size-11 grid place-items-center border mb-5"
              style={{
                background: c.bg,
                borderColor: c.border,
                color: c.color,
              }}
            >
              {f.icon}
            </div>
            <h3
              className="font-semibold text-[18px] sm:text-[20px] mb-1.5 tracking-tight group-hover:text-[var(--l-bronze-deep)] transition-colors"
              style={{
                fontFamily: "var(--font-lora), var(--font-playfair), serif",
                color: "var(--l-ink)",
              }}
            >
              {f.title}
            </h3>
            <p
              className="text-[13px] sm:text-[13.5px] leading-[1.55] m-0"
              style={{
                fontFamily: "var(--font-lora), var(--font-playfair), serif",
                color: "var(--l-ink-soft)",
              }}
            >
              {f.desc}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
