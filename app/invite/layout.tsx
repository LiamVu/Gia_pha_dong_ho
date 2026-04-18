import siteConfig from "@/app/config";
import { Sprout } from "lucide-react";

export const metadata = {
  title: `Tham gia ${siteConfig.siteName}`,
};

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 to-stone-50 flex flex-col">
      <header className="py-5 flex items-center justify-center gap-2">
        <Sprout className="size-5 text-amber-700" />
        <span className="font-serif font-bold text-stone-800 text-lg">
          {siteConfig.siteName}
        </span>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-10">
        {children}
      </main>
    </div>
  );
}
