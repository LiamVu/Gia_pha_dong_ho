import siteConfig from "@/app/config";
import { Sprout } from "lucide-react";
import { Noto_Serif, Roboto } from "next/font/google";

const notoSerif = Noto_Serif({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700"],
});
const roboto = Roboto({
  subsets: ["vietnamese"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: `${siteConfig.siteName} — Chia sẻ cây gia phả`,
  description: "Xem cây gia phả",
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${roboto.className} min-h-screen bg-stone-50/50 flex flex-col`}
    >
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="size-5 text-amber-700" />
            <span
              className={`${notoSerif.className} font-bold text-stone-900 text-lg`}
            >
              {siteConfig.siteName}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
            Chế độ xem
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
