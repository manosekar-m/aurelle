import Preloader from "@/components/layout/Preloader";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import BrandIntro from "@/components/sections/BrandIntro";
import NightJourney from "@/components/sections/NightJourney";
import RunwayLineup from "@/components/sections/RunwayLineup";
import AurelleWomanAndPhilosophy from "@/components/sections/AurelleWomanAndPhilosophy";
import MaterialShowcase from "@/components/sections/MaterialShowcase";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="bg-onyx text-ivory min-h-screen relative">
      <Preloader />
      <Navigation />
      
      <Hero />
      <BrandIntro />
      
      {/* The cinematic horizontal scroll story */}
      <NightJourney />
      
      <MaterialShowcase />
      <RunwayLineup />
      
      <AurelleWomanAndPhilosophy />
      
      <FinalCTA />
      
      <Footer />
    </main>
  );
}
