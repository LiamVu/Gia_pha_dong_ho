import HeaderMenu from "@/components/HeaderMenu";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="relative z-30">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-7 pt-5 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="group flex items-center gap-3">
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
            <span
              className="font-serif font-semibold text-[18px] sm:text-[22px] tracking-wide leading-none group-hover:text-[var(--l-bronze-deep)] transition-colors"
              style={{
                fontFamily: "var(--font-lora), var(--font-playfair), serif",
                color: "var(--l-ink)",
              }}
            >
              YOUR TREE
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ShareButton />
            <HeaderMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
