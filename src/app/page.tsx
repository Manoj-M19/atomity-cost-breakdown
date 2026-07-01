import { FeatureSection } from "@/components/FeatureSection";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ThemeToggle />
      <FeatureSection />
    </main>
  );
} 