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
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  UnifiedSearchBar,
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
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Guest';
  const displayEmail = user?.email ?? '';

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
          <div className="flex items-center gap-3">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt={displayName} className="h-8 w-8 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#374151] text-sm font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              <p className="truncate text-xs text-[#9ca3af]">{displayEmail}</p>
            </div>
          </div>
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
                  <article key={vendor.id} className="flex items-center gap-3 rounded-2xl bg-[#1a1f2e] p-3">
                    <img src={vendor.image} alt={vendor.name} className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                    <div>
                      <p className="text-sm font-bold text-white">{vendor.name}</p>
                      <p className="mt-1 text-xs">
                        <span className="text-[#f5a623]">{'★'.repeat(Math.round(vendor.rating))}{'☆'.repeat(5 - Math.round(vendor.rating))}</span>
                        <span className="text-[#9ca3af]"> ({vendor.rating.toFixed(1)})</span>
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
                  <article key={service.id} className="flex min-h-[200px] overflow-hidden rounded-2xl bg-[#1a1f2e]">
                    <div className="relative w-[42%] shrink-0">
                      <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                      <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                        {service.category}
                      </span>
                      <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm" aria-label="Save listing">
                        <Heart className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {service.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded-full bg-[#374151] px-2.5 py-0.5 text-[10px] text-[#d1d5db]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-sm font-bold leading-snug text-white">{service.title}</h3>
                      <p className="line-clamp-3 text-[11px] text-[#9ca3af]">{service.description}</p>
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-[#f5a623]">★</span>
                        <span className="font-medium text-white">{service.rating.toFixed(1)}</span>
                        <span className="text-[#6b7280]">({service.reviews} Reviews)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 text-[10px] text-[#9ca3af]">
                        {service.features.slice(0, 4).map((feature) => (
                          <span key={feature}>• {feature}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 shrink-0 rounded-full bg-[#374151]" />
                        {['English', 'Mandarin', 'Arabic'].map((lang) => (
                          <span key={lang} className="rounded-full bg-[#252d3d] px-2 py-0.5 text-[9px] text-[#d1d5db]">
                            {lang}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 w-5 shrink-0 rounded-full bg-[#374151]" />
                        <span className="text-[11px] font-medium text-white">{service.vendor}</span>
                        <span className="text-[9px] text-[#6b7280]">⊙ Responds · 15 mins</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-1">
                        <p className="text-sm font-bold text-white">
                          {formatINR(service.price)}
                          <span className="text-[10px] font-normal text-[#9ca3af]">/{service.priceUnit}</span>
                        </p>
                        <button className="rounded-full border border-[#4b5563] px-3 py-1.5 text-[11px] text-[#d1d5db] transition-colors hover:border-white hover:text-white">
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
