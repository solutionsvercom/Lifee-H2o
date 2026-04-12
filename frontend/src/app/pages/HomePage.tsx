import { Navbar } from "../components/Navbar";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { PurificationProcess } from "../components/PurificationProcess";
import { ProductShowcase } from "../components/ProductShowcase";
import { QualityCertification } from "../components/QualityCertification";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { DistributionSection } from "../components/DistributionSection";
import { BottleCustomizer } from "../components/BottleCustomizer";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export default function HomePage() {
  useSectionNavigation();

  return (
    <div className="w-full max-md:min-h-0 md:min-h-[100svh] bg-slate-900 text-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PurificationProcess />
      <ProductShowcase />
      <QualityCertification />
      <WhyChooseUs />
      <BottleCustomizer />
      <DistributionSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
