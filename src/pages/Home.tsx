import {
  ShieldCheck,
  Award,
  MessageCircle,
  Lock,
  Play,
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
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-6">
                Connect with Verified Vendors on Musika
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Discover, trade, and thrive in the trusted global marketplace designed for international students who turn passion into profit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-8 py-6 text-base rounded-lg"
                  onClick={() => navigateTo('services')}
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-300 text-[#0F172A] hover:bg-slate-50 px-8 py-6 text-base rounded-lg flex items-center gap-2"
                >
                  <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  </span>
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-scale-in">
              <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                <img
                  src="/images/hero-student.png"
                  alt="Happy student with shopping bags"
                  className="w-full h-full object-contain"
                />
                {/* Floating Badge */}
                <div className="absolute bottom-20 right-0 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Verified</p>
                    <p className="text-xs text-slate-500">Student Vendor</p>
                  </div>
                </div>
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
                  <div 
                    className="bg-[#0F172A] rounded-2xl p-6 h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
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
                <div className="text-center" style={{ animationDelay: `${index * 150}ms` }}>
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
                  <li
                    key={index}
                    className="flex items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
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
