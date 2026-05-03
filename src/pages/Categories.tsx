import { useState } from 'react';
import {
  Building,
  Car,
  ChevronDown,
  Heart,
  HeartPulse,
  Scale,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AnimatedSection } from '@/components/AnimatedSection';
import { categories, featuredVendors, locations, popularServices } from '@/lib/data';
import {
  LanguageBadge,
  RatingStars,
  UnifiedSearchBar,
  VerifiedBadge,
  formatINR,
} from '@/components/musika/ui-primitives';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Accommodation: Building,
  Transportation: Car,
  'Legal Offices': Scale,
  'Health & Wellness': HeartPulse,
  Marketplace: ShoppingBag,
};

const sectionCategories = ['Accommodation', 'Transportation', 'Legal Offices', 'Health & Wellness', 'Marketplace'];

export function Categories() {
  const [searchTerm, setSearchTerm] = useState('');

  const sidebar = (
    <div className="flex h-full flex-col rounded-2xl bg-[#1a1f2e] p-5 text-[#d1d5db]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filter</h3>
        <button className="text-sm text-[#9ca3af] hover:text-white">Clear All</button>
      </div>

      <section className="mb-6">
        <h4 className="mb-3 flex items-center justify-between font-medium text-white">
          Categories
          <ChevronDown className="h-4 w-4" />
        </h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex cursor-pointer items-center justify-between text-sm">
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={category.id === 'accommodation'}
                  className="h-4 w-4 rounded border border-white bg-transparent accent-[#f5a623]"
                />
                <span>{category.name}</span>
              </span>
              <span className="text-[#9ca3af]">({category.count})</span>
            </label>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h4 className="mb-3 flex items-center justify-between font-medium text-white">
          Location
          <ChevronDown className="h-4 w-4" />
        </h4>
        <div className="space-y-2">
          {locations.map((location) => (
            <label key={location.id} className="flex cursor-pointer items-center justify-between text-sm">
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={location.id === 'near-campus'}
                  className="h-4 w-4 rounded border border-white bg-transparent accent-[#f5a623]"
                />
                <span>{location.name}</span>
              </span>
              <span className="text-[#9ca3af]">({location.count})</span>
            </label>
          ))}
        </div>
      </section>

      <div className="mt-auto border-t border-[#374151] pt-4">
        <button className="mb-2 flex items-center gap-2 text-sm hover:text-white">
          <HelpCircle className="h-4 w-4" />
          Help & Support
        </button>
        <button className="mb-3 flex items-center gap-2 text-sm hover:text-white">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <div className="rounded-xl bg-[#252d3d] p-3">
          <p className="text-sm font-medium text-white">Lennox Galanje</p>
          <p className="text-xs text-[#9ca3af]">lennox@example.com</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-6 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#111111]">Your Gateway to Reliable Services</h1>
          <p className="mt-2 text-[#6b7280]">Discover trusted services from verified providers tailored for International Students</p>
        </AnimatedSection>

        <UnifiedSearchBar
          placeholder="Search for accommodation, transportation..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-[#6b7280]">Quick Filters</span>
          <button className="flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white">
            <SlidersHorizontal className="h-3 w-3" />
            All Filters
          </button>
          <button className="rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white">Accommodation ×</button>
          <button className="rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white">Near Campus ×</button>
          <button className="text-sm text-[#6b7280] hover:text-[#111111]">Clear All</button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-[#111111] text-[#111111]">Filters</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[290px] border-none bg-transparent p-0">
              {sidebar}
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">{sidebar}</aside>

          <main className="space-y-8">
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#111111]">Featured Vendors</h2>
                <button className="rounded-full bg-[#111111] px-4 py-2 text-xs text-white">View All</button>
              </div>
              <div className="grid gap-4 xl:grid-cols-3">
                {featuredVendors.map((vendor) => (
                  <article key={vendor.id} className="relative h-[100px] overflow-hidden rounded-xl">
                    <img src={vendor.image} alt={vendor.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-white">
                      <p className="mt-6 text-sm font-bold">{vendor.name}</p>
                      <p className="text-xs text-[#d1d5db]">
                        {'★★★★☆'} {vendor.rating.toFixed(1)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#111111]">Browse Categories</h2>
                <button className="rounded-full bg-[#111111] px-4 py-2 text-xs text-white">View All</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {sectionCategories.map((category) => {
                  const Icon = iconMap[category] ?? Building;
                  return (
                    <button
                      key={category}
                      className="rounded-xl border border-transparent bg-[#111827] p-4 text-center text-white transition-all duration-150 hover:scale-[1.01] hover:border-[#f5a623]"
                    >
                      <Icon className="mx-auto mb-2 h-6 w-6" />
                      <p className="text-sm">{category}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#111111]">Most Popular Services</h2>
                <button className="rounded-full bg-[#111111] px-4 py-2 text-xs text-white">View All</button>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {popularServices.map((service) => (
                  <article key={service.id} className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
                    <div className="relative">
                      <img src={service.image} alt={service.title} className="h-[180px] w-full object-cover" />
                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px]">{service.category}</span>
                      <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white" aria-label="Save listing">
                        <Heart className="h-4 w-4 text-[#374151]" />
                      </button>
                    </div>

                    <div className="space-y-3 p-4">
                      <div className="flex flex-wrap gap-2">
                        {service.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-[#f3f4f6] px-2 py-1 text-[11px] text-[#374151]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-base font-bold text-[#111111]">{service.title}</h3>
                      <p className="line-clamp-2 text-[13px] text-[#6b7280]">{service.description}</p>

                      <ul className="space-y-1 text-xs text-[#374151]">
                        {service.features.slice(0, 3).map((feature) => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5">
                        {['English', 'Mandarin', 'Arabic'].map((language) => (
                          <LanguageBadge key={language} label={language} />
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-[#e5e7eb]" />
                            <span className="text-sm font-medium text-[#111111]">{service.vendor}</span>
                            {service.vendorVerified ? <VerifiedBadge /> : null}
                          </div>
                          <p className="text-xs text-[#9ca3af]">In business 6 yrs</p>
                        </div>
                        <RatingStars rating={service.rating} reviews={service.reviews} />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-[#111111]">
                          {formatINR(service.price)}
                          <span className="text-sm font-normal text-[#6b7280]">/{service.priceUnit}</span>
                        </p>
                        <button className="rounded-full border border-[#111111] px-4 py-2 text-[13px] text-[#111111] transition-all duration-150 hover:bg-[#111111] hover:text-white">
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
