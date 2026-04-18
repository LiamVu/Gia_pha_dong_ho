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
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-stone-200 bg-white/60 text-stone-600 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50 transition-colors"
    >
      {copied ? (
        <>
          <Check className="size-4 text-green-600" />
          <span className="hidden sm:inline">Đã copy link</span>
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </>
      )}
    </button>
  );
}
