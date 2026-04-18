import DongSonDrum, { DongSonHaloMemo } from "@/components/DongSonDrum";

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

export default function ParchmentBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ color: "var(--l-stroke)" }}
    >
      <div className="absolute inset-0 landing-paper" />
      <div className="drum-halo w-[min(130vmin,1500px)] aspect-square opacity-[0.18]">
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
  );
}
