import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import NumbersSection from '@/components/home/NumbersSection';
import GrowthSimulator from '@/components/home/GrowthSimulator';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import NewsletterForm from '@/components/home/NewsletterForm';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <WhyChooseSection />
      <NumbersSection />
      <GrowthSimulator />
      <FAQSection />
      <CTASection />
      <NewsletterForm />
      <Footer />
    </>
  );
}
