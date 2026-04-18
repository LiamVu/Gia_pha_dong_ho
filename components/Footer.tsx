export interface FooterProps {
  className?: string;
  showDisclaimer?: boolean;
}

export default function Footer({
  className = "",
  showDisclaimer = false,
}: FooterProps) {
  if (!showDisclaimer) return null;

  return (
    <footer className={`py-5 text-center ${className}`}>
      <div className="max-w-[1160px] mx-auto px-5 sm:px-7">
        <p
          className="py-3 px-5 italic text-[13px] sm:text-[13.5px] border border-dashed inline-block"
          style={{
            fontFamily: "var(--font-lora), var(--font-playfair), serif",
            background: "rgba(255,250,240,0.4)",
            borderColor: "var(--l-line, rgba(94,58,23,0.22))",
            color: "var(--l-muted, #6b5a46)",
          }}
        >
          Nội dung có thể thiếu sót. Vui lòng đóng góp để gia phả chính xác hơn.
        </p>
      </div>
    </footer>
  );
}
