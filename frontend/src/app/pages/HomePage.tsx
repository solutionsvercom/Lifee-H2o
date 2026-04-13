import { lazy, Suspense } from "react";
import { Navbar } from "../components/Navbar";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";

const PurificationProcess = lazy(() =>
  import("../components/PurificationProcess").then((m) => ({ default: m.PurificationProcess })),
);
const ProductShowcase = lazy(() =>
  import("../components/ProductShowcase").then((m) => ({ default: m.ProductShowcase })),
);
const QualityCertification = lazy(() =>
  import("../components/QualityCertification").then((m) => ({ default: m.QualityCertification })),
);
const WhyChooseUs = lazy(() =>
  import("../components/WhyChooseUs").then((m) => ({ default: m.WhyChooseUs })),
);
const BottleCustomizer = lazy(() =>
  import("../components/BottleCustomizer").then((m) => ({ default: m.BottleCustomizer })),
);
const DistributionSection = lazy(() =>
  import("../components/DistributionSection").then((m) => ({ default: m.DistributionSection })),
);
const ContactSection = lazy(() =>
  import("../components/ContactSection").then((m) => ({ default: m.ContactSection })),
);
const Footer = lazy(() => import("../components/Footer").then((m) => ({ default: m.Footer })));

export default function HomePage() {
  useSectionNavigation();

  return (
    <div className="w-full max-md:min-h-0 md:min-h-[100svh] bg-slate-900 text-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <Suspense fallback={<div aria-hidden />}>
        <PurificationProcess />
      </Suspense>
      <Suspense fallback={<div aria-hidden />}>
        <ProductShowcase />
      </Suspense>
      <Suspense fallback={<div aria-hidden />}>
        <QualityCertification />
      </Suspense>
      <Suspense fallback={<div aria-hidden />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<div aria-hidden />}>
        <BottleCustomizer />
      </Suspense>
      <Suspense fallback={<div aria-hidden />}>
        <DistributionSection />
      </Suspense>
      <Suspense fallback={<div aria-hidden />}>
        <ContactSection />
      </Suspense>
      <Suspense fallback={<div aria-hidden />}>
        <Footer />
      </Suspense>
    </div>
  );
}
