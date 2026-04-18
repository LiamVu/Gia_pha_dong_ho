"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/share`;
    try {
      if (navigator.share) {
        await navigator.share({ url: shareUrl, title: "Cây gia phả" });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // User dismissed share sheet or clipboard failed — no-op.
    }
  };

  return (
    <button
      onClick={handleShare}
      title="Chia sẻ cây gia phả"
      className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border backdrop-blur-sm text-[10px] sm:text-[11px] tracking-[0.18em] uppercase transition-all hover:-translate-y-px"
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        borderColor: "var(--l-line)",
        background: "rgba(255,250,240,0.65)",
        color: "var(--l-bronze-deep)",
      }}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-green-700" />
          <span className="hidden sm:inline">Đã copy</span>
        </>
      ) : (
        <>
          <Share2 className="size-3.5" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </>
      )}
    </button>
  );
}
