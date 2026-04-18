import { DashboardProvider } from "@/components/DashboardContext";
import EventsList from "@/components/EventsList";
import MemberDetailModal from "@/components/MemberDetailModal";
import { getSupabase } from "@/utils/supabase/queries";

export const metadata = {
  title: "Sự kiện gia phả",
};

export default async function EventsPage() {
  const supabase = await getSupabase();

  const [personsRes, customEventsRes] = await Promise.all([
    supabase
      .from("persons")
      .select(
        "id, full_name, birth_year, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased, avatar_url",
      ),
    supabase
      .from("custom_events")
      .select("id, name, content, event_date, location, created_by"),
  ]);

  const persons = personsRes.data || [];
  const customEvents = customEventsRes.data || [];

  return (
    <DashboardProvider>
      <main className="relative max-w-[1060px] mx-auto w-full px-5 sm:px-7 pt-6 sm:pt-8 pb-14">
        <header className="mb-6 sm:mb-7">
          <h1
            className="font-semibold text-[32px] sm:text-[42px] leading-[1.1] tracking-tight m-0"
            style={{
              fontFamily: "var(--font-lora), var(--font-playfair), serif",
              color: "var(--l-ink)",
            }}
          >
            Sự kiện gia phả
          </h1>
          <p
            className="italic text-[14px] sm:text-[15px] mt-2 m-0"
            style={{
              fontFamily: "var(--font-lora), var(--font-playfair), serif",
              color: "var(--l-ink-soft)",
            }}
          >
            Sinh nhật, ngày giỗ, âm lịch và các sự kiện tự chỉnh
          </p>
        </header>

        <EventsList persons={persons} customEvents={customEvents} />
      </main>

      <MemberDetailModal />
    </DashboardProvider>
  );
}
