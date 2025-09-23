import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { TrendingDomains } from "@/components/trending-domains";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#2b2b2b] text-[#A259FF]">
      <HeroSection />
      <div className="container px-4 mx-auto max-w-7xl">
        <TrendingDomains
          className="mt-12"
          showThreeSectionLayout={true}
          limit={4}
          title="Featured Domains"
        />
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
}
