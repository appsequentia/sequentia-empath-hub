
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedTherapists } from "@/components/home/FeaturedTherapists";
import { TherapyTypes } from "@/components/home/TherapyTypes";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaSection } from "@/components/home/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-teal-900 text-white">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedTherapists />
        <TherapyTypes />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
