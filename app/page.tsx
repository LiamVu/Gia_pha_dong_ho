import LandingHero from "@/components/LandingHero";
import config from "./config";

export default function HomePage() {
  return <LandingHero siteName={config.siteName} />;
}
