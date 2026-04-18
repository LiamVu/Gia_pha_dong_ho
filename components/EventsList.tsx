"use client";

import { ganZhiToVietnamese, getZodiacSign } from "@/utils/dateHelpers";
import {
  computeEvents,
  CustomEventRecord,
  FamilyEvent,
} from "@/utils/eventHelpers";
import { CalendarDays, Cake, Check, Clock, Flower, Plus, Star } from "lucide-react";
import { Solar } from "lunar-javascript";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CustomEventModal from "./CustomEventModal";
import { useDashboard } from "./DashboardContext";

interface EventsListProps {
  persons: {
    id: string;
    full_name: string;
    birth_year: number | null;
    birth_month: number | null;
    birth_day: number | null;
    death_year: number | null;
    death_month: number | null;
    death_day: number | null;
    death_lunar_year: number | null;
    death_lunar_month: number | null;
    death_lunar_day: number | null;
    is_deceased: boolean;
  }[];
  customEvents?: CustomEventRecord[];
}

const WEEKDAYS = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

const DAY_LABELS: Record<string, string> = {
  "-1": "Hôm qua",
  "0": "Hôm nay",
  "1": "Ngày mai",
};

function daysUntilLabel(days: number): string {
  if (days.toString() in DAY_LABELS) return DAY_LABELS[days.toString()];
  if (days < 0) {
    const abs = Math.abs(days);
    if (abs <= 30) return `${abs} ngày trước`;
    if (abs <= 60) return `${Math.ceil(abs / 7)} tuần trước`;
    return `${Math.ceil(abs / 30)} tháng trước`;
  }
  if (days <= 30) return `${days} ngày nữa`;
  if (days <= 60) return `${Math.ceil(days / 7)} tuần nữa`;
  return `${Math.ceil(days / 30)} tháng nữa`;
}

type EventIconKind = "birth" | "death" | "custom";
const iconStyles: Record<
  EventIconKind,
  { bg: string; border: string; color: string }
> = {
  birth: {
    bg: "rgba(88,90,150,0.12)",
    border: "rgba(88,90,150,0.32)",
    color: "#3f4276",
  },
  death: {
    bg: "rgba(194,138,61,0.14)",
    border: "rgba(194,138,61,0.35)",
    color: "var(--l-bronze-deep)",
  },
  custom: {
    bg: "rgba(120,88,150,0.12)",
    border: "rgba(120,88,150,0.3)",
    color: "#5e3a76",
  },
};

const zodiacHues: { bg: string; border: string; color: string }[] = [
  {
    bg: "rgba(88,90,150,0.10)",
    border: "rgba(88,90,150,0.35)",
    color: "#3f4276",
  },
  {
    bg: "rgba(77,107,90,0.12)",
    border: "rgba(77,107,90,0.35)",
    color: "#2d4a3a",
  },
  {
    bg: "rgba(194,138,61,0.14)",
    border: "rgba(194,138,61,0.4)",
    color: "var(--l-bronze-deep)",
  },
  {
    bg: "rgba(120,88,150,0.12)",
    border: "rgba(120,88,150,0.35)",
    color: "#5e3a76",
  },
  {
    bg: "rgba(184,95,95,0.12)",
    border: "rgba(184,95,95,0.35)",
    color: "#8a3a3a",
  },
];

function zodiacStyle(sign: string) {
  let hash = 0;
  for (let i = 0; i < sign.length; i++)
    hash = (hash * 31 + sign.charCodeAt(i)) | 0;
  return zodiacHues[Math.abs(hash) % zodiacHues.length];
}

function CardCorners() {
  return (
    <>
      <span
        className="absolute -top-px -left-px size-[14px] border pointer-events-none"
        style={{
          borderColor: "var(--l-bronze)",
          borderRight: "none",
          borderBottom: "none",
        }}
      />
      <span
        className="absolute -bottom-px -right-px size-[14px] border pointer-events-none"
        style={{
          borderColor: "var(--l-bronze)",
          borderLeft: "none",
          borderTop: "none",
        }}
      />
    </>
  );
}

function EventRow({
  event,
  onEditCustomEvent,
}: {
  event: FamilyEvent;
  onEditCustomEvent: (e: FamilyEvent) => void;
}) {
  const isBirthday = event.type === "birthday";
  const isCustom = event.type === "custom_event";
  const isDeath = event.type === "death_anniversary";
  const kind: EventIconKind = isBirthday ? "birth" : isDeath ? "death" : "custom";
  const style = iconStyles[kind];

  const { setMemberModalId } = useDashboard();

  const handleClick = () => {
    if (isCustom) onEditCustomEvent(event);
    else if (event.personId) setMemberModalId(event.personId);
  };

  const yearsInfo = (() => {
    if (!event.originYear) return null;
    const now = new Date().getFullYear();
    const diff = now - event.originYear;
    if (diff <= 0) return null;
    if (isBirthday) return `${diff} tuổi`;
    if (isDeath) return `${diff} năm`;
    return null;
  })();

  const dateLabel = (() => {
    const d = event.nextOccurrence;
    const dayOfWeek = WEEKDAYS[d.getDay()];
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    let label = `${dayOfWeek}, ngày ${day}/${month}`;
    if (isCustom) label += `/${year}`;
    if (isDeath)
      label += ` (Âm lịch: ${event.eventDateLabel.replace(" ÂL", "")})`;
    return label;
  })();

  const zodiac =
    isBirthday && event.originDay && event.originMonth
      ? getZodiacSign(event.originDay, event.originMonth)
      : null;
  const zStyle = zodiac ? zodiacStyle(zodiac) : null;

  const Icon = isBirthday ? Cake : isDeath ? Flower : Star;

  return (
    <div
      onClick={handleClick}
      className="relative grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-5 backdrop-blur-md border px-4 sm:px-6 py-4 sm:py-[18px] transition-all cursor-pointer hover:translate-x-0.5"
      style={{
        background: "var(--l-card)",
        borderColor: "var(--l-card-border)",
      }}
    >
      <CardCorners />

      {/* Icon */}
      <div
        className="size-11 shrink-0 grid place-items-center border"
        style={{
          background: style.bg,
          borderColor: style.border,
          color: style.color,
        }}
      >
        <Icon className="size-5" fill={isCustom ? "currentColor" : "none"} />
      </div>

      {/* Main info */}
      <div className="min-w-0">
        <h3
          className="font-semibold text-[15px] sm:text-[17px] m-0 mb-1 inline-flex items-center gap-2.5 flex-wrap"
          style={{
            fontFamily: "var(--font-lora), var(--font-playfair), serif",
            color: "var(--l-ink)",
          }}
        >
          <span className="truncate">{event.personName}</span>
          {zodiac && zStyle && (
            <span
              className="inline-flex items-center px-2 py-0.5 text-[9.5px] tracking-[0.18em] uppercase font-medium border"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                background: zStyle.bg,
                borderColor: zStyle.border,
                color: zStyle.color,
              }}
            >
              {zodiac}
            </span>
          )}
        </h3>
        <div
          className="flex items-center gap-4 text-[10px] sm:text-[10.5px] tracking-[0.14em] uppercase flex-wrap"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: "var(--l-muted)",
          }}
        >
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3" />
            <b
              className="font-medium"
              style={{ color: "var(--l-ink-soft)" }}
            >
              {dateLabel}
            </b>
          </span>
          {yearsInfo && <span>{yearsInfo}</span>}
        </div>
      </div>

      {/* Right badge */}
      <div
        className="col-span-2 md:col-span-1 md:col-start-3 md:text-right flex items-center gap-2 text-[10px] sm:text-[10.5px] tracking-[0.2em] uppercase md:justify-end"
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "var(--l-muted)",
        }}
      >
        <span
          className="size-1.5 rounded-full shrink-0"
          style={{
            background: "var(--l-bronze-glow)",
            boxShadow: "0 0 0 3px rgba(194,138,61,0.25)",
          }}
        />
        <b
          className="font-semibold"
          style={{ color: "var(--l-bronze-deep)" }}
        >
          {daysUntilLabel(event.daysUntil)}
        </b>
      </div>
    </div>
  );
}

export default function EventsList({
  persons,
  customEvents = [],
}: EventsListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<
    "all" | "birthday" | "death_anniversary" | "custom_event" | "past"
  >("all");
  const [showCount, setShowCount] = useState(20);
  const [showDeceasedBirthdays, setShowDeceasedBirthdays] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomEvent, setEditingCustomEvent] =
    useState<CustomEventRecord | null>(null);

  const handleOpenEditModal = (event: FamilyEvent) => {
    const rawEvent = customEvents.find((ce) => ce.id === event.personId);
    if (rawEvent) {
      setEditingCustomEvent(rawEvent);
      setIsModalOpen(true);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCustomEvent(null);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    router.refresh();
  };

  const todayDate = useMemo(() => {
    const today = new Date();
    const dayOfWeek = WEEKDAYS[today.getDay()];
    const solarStr = `${dayOfWeek}, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
    let lunarShort = "";
    let lunarYear = "";
    try {
      const solar = Solar.fromYmd(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
      );
      const lunar = solar.getLunar();
      const lMonthRaw = lunar.getMonth();
      const isLeap = lMonthRaw < 0;
      const lMonth = Math.abs(lMonthRaw).toString().padStart(2, "0");
      const lDay = lunar.getDay().toString().padStart(2, "0");
      lunarShort = `${lDay}/${lMonth}${isLeap ? " nhuận" : ""}`;
      const raw = lunar.getYearInGanZhi?.() ?? "";
      lunarYear = raw ? ganZhiToVietnamese(raw) : "";
    } catch (e) {
      console.error(e);
    }
    return { solar: solarStr, lunar: lunarShort, lunarYear };
  }, []);

  const allEvents = useMemo(
    () => computeEvents(persons, customEvents),
    [persons, customEvents],
  );

  const counts = useMemo(() => {
    const base = showDeceasedBirthdays
      ? allEvents
      : allEvents.filter((e) => !(e.type === "birthday" && e.isDeceased));
    const upcoming = base.filter((e) => e.daysUntil >= 0 && e.daysUntil <= 365);
    return {
      all: upcoming.length,
      birthday: upcoming.filter((e) => e.type === "birthday").length,
      death: upcoming.filter((e) => e.type === "death_anniversary").length,
      custom: upcoming.filter((e) => e.type === "custom_event").length,
      past: allEvents.filter((e) => e.daysUntil < 0 && e.daysUntil >= -365)
        .length,
    };
  }, [allEvents, showDeceasedBirthdays]);

  const filtered = useMemo(() => {
    let result = allEvents;
    if (filter === "past") {
      return result
        .filter((e) => e.daysUntil < 0 && e.daysUntil >= -365)
        .sort((a, b) => b.daysUntil - a.daysUntil);
    }
    if (filter !== "all") result = result.filter((e) => e.type === filter);
    if (!showDeceasedBirthdays)
      result = result.filter((e) => !(e.type === "birthday" && e.isDeceased));
    return result.filter((e) => e.daysUntil >= 0 && e.daysUntil <= 365);
  }, [allEvents, filter, showDeceasedBirthdays]);

  const visible = filtered.slice(0, showCount);

  const chips: {
    key: typeof filter;
    label: string;
    count: number;
  }[] = [
    { key: "all", label: "Tất cả", count: counts.all },
    { key: "birthday", label: "Sinh nhật", count: counts.birthday },
    { key: "death_anniversary", label: "Ngày giỗ", count: counts.death },
    { key: "custom_event", label: "Tuỳ chỉnh", count: counts.custom },
    { key: "past", label: "Đã qua", count: counts.past },
  ];

  return (
    <div>
      {/* ===== Date + Add CTA ===== */}
      <div
        className="relative backdrop-blur-md border p-5 sm:p-6 mb-6 grid gap-4 sm:gap-5 items-center sm:grid-cols-[auto_1fr_auto]"
        style={{
          background: "var(--l-card)",
          borderColor: "var(--l-card-border)",
        }}
      >
        <CardCorners />
        <div
          className="size-[54px] shrink-0 grid place-items-center border"
          style={{
            borderColor: "var(--l-line)",
            background: "rgba(255,250,240,0.95)",
            color: "var(--l-bronze-deep)",
          }}
        >
          <CalendarDays className="size-6" />
        </div>
        <div className="min-w-0">
          <h2
            className="font-semibold text-[18px] sm:text-[24px] leading-tight m-0 mb-1.5 tracking-tight"
            style={{
              fontFamily: "var(--font-lora), var(--font-playfair), serif",
              color: "var(--l-ink)",
            }}
          >
            {todayDate.solar}
          </h2>
          {todayDate.lunar && (
            <div
              className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase flex-wrap"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--l-muted)",
              }}
            >
              Âm lịch ·{" "}
              <b
                className="font-semibold"
                style={{ color: "var(--l-bronze-deep)" }}
              >
                {todayDate.lunar}
              </b>
              {todayDate.lunarYear && (
                <>
                  <span>·</span>
                  <span>{todayDate.lunarYear}</span>
                </>
              )}
            </div>
          )}
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="group relative flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 uppercase tracking-[0.2em] text-[10.5px] font-medium transition-all hover:-translate-y-px whitespace-nowrap"
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
            className="absolute inset-[3px] border pointer-events-none"
            style={{ borderColor: "var(--l-btn-border)" }}
          />
          <Plus className="relative size-3.5" />
          <span className="relative">Thêm sự kiện</span>
        </button>
      </div>

      {/* ===== Filter chips + deceased toggle in one compact row ===== */}
      <div className="no-scrollbar overflow-x-auto mb-5 -mx-5 sm:mx-0 px-5 sm:px-0">
        <div className="inline-flex items-center gap-2 flex-nowrap w-max">
          {chips.map((chip) => {
            const active = filter === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => {
                  setFilter(chip.key);
                  setShowCount(20);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border text-[12.5px] sm:text-[13px] transition-all hover:-translate-y-px whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-lora), var(--font-playfair), serif",
                  borderColor: active
                    ? "var(--l-bronze-deep)"
                    : "var(--l-line)",
                  background: active
                    ? "var(--l-bronze-glow)"
                    : "rgba(255,250,240,0.7)",
                  color: active ? "#1c1410" : "var(--l-ink-soft)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {chip.label}
                <span
                  className="text-[10px] opacity-70 tracking-[0.1em]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                  }}
                >
                  · {chip.count}
                </span>
              </button>
            );
          })}

          {filter !== "past" && (
            <>
              <span
                aria-hidden="true"
                className="shrink-0 w-px h-5 mx-1"
                style={{ background: "var(--l-line)" }}
              />
              <button
                type="button"
                onClick={() => setShowDeceasedBirthdays((v) => !v)}
                aria-pressed={showDeceasedBirthdays}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border text-[12.5px] sm:text-[13px] transition-all hover:-translate-y-px whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-lora), var(--font-playfair), serif",
                  borderColor: showDeceasedBirthdays
                    ? "var(--l-bronze-deep)"
                    : "var(--l-line)",
                  background: showDeceasedBirthdays
                    ? "var(--l-bronze-glow)"
                    : "rgba(255,250,240,0.7)",
                  color: showDeceasedBirthdays ? "#1c1410" : "var(--l-ink-soft)",
                  fontWeight: showDeceasedBirthdays ? 600 : 400,
                }}
              >
                <span
                  className="size-[11px] grid place-items-center border transition-all shrink-0"
                  style={{
                    background: showDeceasedBirthdays
                      ? "#1c1410"
                      : "rgba(255,250,240,0.6)",
                    borderColor: showDeceasedBirthdays
                      ? "#1c1410"
                      : "var(--l-line)",
                    color: showDeceasedBirthdays ? "#f3e9d0" : "transparent",
                  }}
                >
                  <Check className="size-[9px]" strokeWidth={3} />
                </span>
                Gồm người đã mất
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===== Event list ===== */}
      {visible.length === 0 ? (
        <div
          className="text-center py-16 border"
          style={{
            borderColor: "var(--l-line)",
            background: "rgba(255,250,240,0.5)",
            color: "var(--l-muted)",
            fontFamily: "var(--font-lora), var(--font-playfair), serif",
          }}
        >
          <Clock className="size-10 mx-auto mb-3 opacity-60" />
          <p className="font-medium m-0">Không có sự kiện nào</p>
          <p className="text-[13px] mt-1 italic">
            Hãy bổ sung ngày sinh hoặc ngày mất cho thành viên
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((event) => (
            <EventRow
              key={`${event.personId}-${event.type}-${event.eventDateLabel}`}
              event={event}
              onEditCustomEvent={handleOpenEditModal}
            />
          ))}
        </div>
      )}

      {filtered.length > showCount && (
        <button
          onClick={() => setShowCount((n) => n + 20)}
          className="mt-4 w-full py-3 text-[13px] tracking-[0.18em] uppercase transition-colors"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: "var(--l-muted)",
          }}
        >
          Xem thêm {filtered.length - showCount} sự kiện…
        </button>
      )}

      <CustomEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        eventToEdit={editingCustomEvent}
      />
    </div>
  );
}
