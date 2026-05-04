import {
  ShieldCheck,
  Award,
  MessageCircle,
  Lock,
  Check,
  Search,
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

type Page = 'home' | 'services' | 'categories' | 'marketplace' | 'signin' | 'signup';

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
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(245,194,66,0.16),_transparent_35%),radial-gradient(circle_at_right,_rgba(31,107,120,0.10),_transparent_30%)]" />
        <div className="relative mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4">
            <div className="animate-fade-in-up text-center lg:text-left">
              <span className="inline-flex rounded-full border border-[#d8dee8] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6b78] shadow-sm">
                Built for international students
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-[#0F172A] sm:text-5xl lg:text-[62px] lg:leading-[1.02]">
                Discover trusted vendors, products, and services around your campus.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600 lg:mx-0">
                Musika brings student-friendly shopping, verified services, and a community marketplace into one modern platform designed to help you settle in faster.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  className="h-14 rounded-full bg-[#0F172A] px-8 text-base font-semibold text-white hover:bg-[#1E293B]"
                  onClick={() => navigateTo('marketplace')}
                >
                  Explore Marketplace
                </Button>
                <Button
                  variant="outline"
                  className="h-14 rounded-full border-slate-300 px-8 text-base font-semibold text-[#0F172A] hover:bg-slate-50"
                  onClick={() => navigateTo('services')}
                >
                  Browse Services
                </Button>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="relative mx-auto aspect-[1.08/1] max-w-[680px]">
                <div className="absolute inset-x-[10%] top-[7%] h-[72%] rounded-[45%] bg-[#ebb14a]" />

                <div className="absolute left-[7%] top-[42%] z-20 flex items-center gap-3 rounded-xl bg-white/92 px-4 py-2 text-sm text-[#111827] shadow-[0_20px_35px_rgba(15,23,42,0.14)] backdrop-blur sm:left-[9%]">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </div>

                <div className="absolute right-[15%] top-[69%] z-20 rounded-full bg-[#111827] px-5 py-2 text-sm text-white shadow-xl">
                  Musika Marketplace
                </div>

                <div className="absolute left-[12%] top-[72%] z-10 h-10 w-14 rounded-md bg-[#5a7a44] shadow-lg sm:h-12 sm:w-16" />
                <div className="absolute left-[21%] top-[84%] z-10 h-12 w-10 rounded-md bg-[#d9dedf] shadow-md" />
                <div className="absolute left-[28%] top-[83%] z-10 h-11 w-10 rounded-md bg-[#9aa7b9] shadow-md" />
                <div className="absolute right-[22%] top-[83%] z-10 h-11 w-8 rounded-md bg-[#d99d2f] shadow-md" />
                <div className="absolute right-[17%] top-[80%] z-10 h-14 w-10 rounded-md bg-[#0f6b7b] shadow-md" />
                <div className="absolute right-[11%] top-[79%] z-10 h-16 w-9 rounded-md bg-[#f5a623] shadow-md" />
                <div className="absolute right-[8%] top-[67%] z-10 h-8 w-12 -rotate-[18deg] rounded-sm bg-[#1f2937] shadow-lg" />

                <img
                  src="/images/hero-image.png"
                  alt="Student exploring the Musika marketplace"
                  className="absolute bottom-30 left-1/2 z-10 h-[92%] w-auto -translate-x-1/2 object-contain"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/images/hero-student.png';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Musika Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
              Why Choose Musika?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built Specifically for International Students, Our platform ensures safe, reliable and authentic peer-to-peer commerce
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || ShieldCheck;
              return (
                <StaggerItem key={feature.id}>
                  <div className="bg-[#0F172A] rounded-2xl p-6 h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
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
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple, secure, and student-friendly process
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.map((step, index) => (
              <StaggerItem key={step.step}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F172A] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* CTA Content */}
            <AnimatedSection>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
                Ready to join the community?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Whether you're looking to buy quality products at student-friendly prices or start your own student business, Musika Multivendor Marketplace is the perfect platform for you.
              </p>
              <ul className="space-y-4">
                {[
                  'Connect with verified vendors',
                  'Access exclusive student discounts and deals',
                  'Secure transactions with buyer protection',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 animate-fade-in-up">
                    <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* CTA Image */}
            <AnimatedSection delay={200} className="relative">
              <div className="relative aspect-[4/5] max-w-md mx-auto">
                <img
                  src="/images/cta-student.png"
                  alt="Student with Musika bag"
                  className="w-full h-full object-contain"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
