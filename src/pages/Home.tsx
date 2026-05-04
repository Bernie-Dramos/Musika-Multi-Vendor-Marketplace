import {
  ShieldCheck,
  Award,
  MessageCircle,
  Lock,
  PlayCircle,
  Check,
  Building,
  UtensilsCrossed,
  Car,
  Scale,
  Heart,
  Sparkles,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { features, howItWorks } from '@/lib/data';

type Page = 'home' | 'services' | 'categories' | 'marketplace' | 'signin' | 'signup' | 'become-vendor';

interface HomeProps {
  navigateTo: (page: Page) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Award,
  MessageCircle,
  Lock,
  Building,
  UtensilsCrossed,
  Car,
  Scale,
  Heart,
  Sparkles,
  ShoppingBag,
  Smartphone,
};

export function Home({ navigateTo }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0 lg:pt-6 lg:pb-0">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-end">
            {/* Hero Content */}
            <div className="text-center lg:text-left animate-fade-in-up py-8 lg:py-12 mt-[80px]">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-6">
                Connect with Verified Vendors on Musika
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600 lg:mx-0">
                Musika brings student-friendly shopping, verified services, and a community marketplace into one modern platform designed to help you settle in faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
                <Button
                  className="bg-[#10131C] hover:bg-[#1E293B] text-white px-6 py-5 text-sm rounded-full font-medium"
                  onClick={() => navigateTo('services')}
                >
                  Explore Marketplace
                </Button>
                <button
                  className="group flex items-center gap-2 text-[#10131C] hover:opacity-70 font-medium text-sm transition-all"
                >
                  <PlayCircle className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Hero Image — full column width, no cap */}
            <div className="relative animate-scale-in flex items-end -mt-10 lg:mt-0">
              <img
                src="/images/hero-student.png"
                alt="Happy student with shopping bags"
                className="w-full object-contain object-bottom min-h-[600px] lg:min-h-full transform scale-[1.15] origin-bottom-right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Musika Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-[60px]">
          <AnimatedSection className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#10131C] mb-4">
              Why Choose Musika?
            </h2>
            <p className="text-lg text-[#555555] font-normal max-w-2xl mx-auto">
              Built Specifically for International Students, Our platform ensures safe, reliable and authentic peer-to-peer commerce
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || ShieldCheck;
              return (
                <StaggerItem key={feature.id}>
                  <div 
                    className="bg-[#10131C] rounded-2xl p-8 h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-center"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-full border border-slate-700/50 bg-[#1A1D27] flex items-center justify-center mb-2">
                      <IconComponent className="w-5 h-5 text-slate-300 stroke-[1.5]" />
                    </div>
                    <h3 className="text-[18px] font-bold text-white text-center mt-[20px]">
                      {feature.title}
                    </h3>
                    <p className="text-[14px] font-normal text-white/80 text-center mt-[12px] leading-[1.6]">
                      {feature.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="pt-16 pb-24 lg:pt-24 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#10131C] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple, secure, and student-friendly process
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 lg:gap-12 mt-8">
            {howItWorks.map((step, index) => (
              <StaggerItem key={step.step}>
                <div className="text-center" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="w-8 h-8 bg-[#10131C] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[12px] font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-[#10131C] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[#888888] leading-[1.6] max-w-[260px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-14 bg-[#08090A] relative overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* CTA Content */}
            <AnimatedSection>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to join the community?
              </h2>
              <p className="text-sm sm:text-[14px] text-[#D1D5DB] mb-8 font-light max-w-md leading-relaxed">
                Whether you're looking to buy quality products at student-friendly prices or start your own student business, Musika Multivendor Marketplace is the perfect platform for you.
              </p>
              <ul className="space-y-4">
                {[
                  'Connect with verified vendors',
                  'Access exclusive student discounts and deals',
                  'Secure transactions with buyer protection',
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex items-center justify-center flex-shrink-0">
                      <Check className="w-[14px] h-[14px] text-white stroke-[2]" />
                    </span>
                    <span className="text-[13px] text-[#D1D5DB] font-light">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  onClick={() => navigateTo('signin')}
                  className="bg-white text-[#08090A] px-8 py-3 rounded-full text-[14px] font-medium hover:bg-gray-100 transition-all text-center"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigateTo('become-vendor')}
                  className="bg-transparent text-white border border-white/20 px-8 py-3 rounded-full text-[14px] font-medium hover:bg-white/10 transition-all text-center"
                >
                  Become a Vendor
                </button>
              </div>
            </AnimatedSection>

            {/* Empty space for image */}
            <div className="hidden lg:block h-[300px]"></div>
          </div>
        </div>

        {/* Absolute CTA Image */}
        <div className="absolute bottom-0 right-0 w-full lg:w-1/2 flex justify-center lg:justify-end pointer-events-none z-30 lg:pr-[15%]">
          <img
            src="/images/cta-student.png"
            alt="Student with Musika bag"
            className="w-[85%] max-w-[340px] lg:max-w-[440px] h-auto object-contain object-bottom drop-shadow-2xl"
          />
        </div>
      </section>
    </div>
  );
}
