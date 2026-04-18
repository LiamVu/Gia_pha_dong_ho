export default function LoadingComponent() {
  return (
    <main className="relative flex-1 flex items-center justify-center px-4">
      <div
        className="relative text-center pointer-events-none"
        aria-live="polite"
      >
        <div
          className="size-[72px] mx-auto mb-5 relative"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 72 72"
            className="absolute inset-0 animate-spin"
            style={{ color: "var(--l-bronze-deep, #5e3a17)" }}
          >
            <circle
              cx={36}
              cy={36}
              r={28}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeDasharray="44 132"
              opacity={0.85}
            />
          </svg>
        </div>
        <p
          className="italic text-[16px] sm:text-[18px] font-medium tracking-wide m-0"
          style={{
            fontFamily: "var(--font-lora), var(--font-playfair), serif",
            color: "var(--l-ink-soft, #3a2d20)",
            textShadow: "0 0 10px rgba(246,236,212,0.9)",
          }}
        >
          Đang tải dữ liệu gia phả…
        </p>
      </div>
    </main>
  );
}
