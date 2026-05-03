import { useMemo, useState } from 'react';
import { ChevronDown, Heart, Search, Settings, SlidersHorizontal, HelpCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/AnimatedSection';
import { categories, locations, services } from '@/lib/data';
import {
  EmptyState,
  LanguageBadge,
  RatingStars,
  UnifiedSearchBar,
  VerifiedBadge,
  formatINR,
} from '@/components/musika/ui-primitives';

type Page = 'home' | 'services' | 'categories' | 'marketplace' | 'signin' | 'signup';

interface ServicesProps {
  navigateTo: (page: Page) => void;
}

const languagePreset: Record<string, string[]> = {
  accommodation: ['English', 'Hindi', 'Mandarin'],
  transportation: ['English', 'Hindi', 'Arabic'],
  legal: ['English', 'Hindi', 'Arabic'],
  healthcare: ['English', 'Hindi'],
};

function TagPill({ label }: { label: string }) {
  const tones: Record<string, string> = {
    'High Recommended': 'bg-[#dcfce7] text-[#15803d]',
    Trusted: 'bg-[#dbeafe] text-[#1d4ed8]',
    'Popular Choice': 'bg-[#f3e8ff] text-[#7e22ce]',
    'Budget Friendly': 'bg-[#fef3c7] text-[#b45309]',
    'Cultural Immersion': 'bg-[#ccfbf1] text-[#0f766e]',
    Modern: 'bg-[#f3f4f6] text-[#374151]',
    Professional: 'bg-[#e0e7ff] text-[#3730a3]',
    Experienced: 'bg-[#f3f4f6] text-[#374151]',
    Campus: 'bg-[#fef3c7] text-[#b45309]',
    'On-Campus': 'bg-[#e0f2fe] text-[#0369a1]',
  };

  return <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${tones[label] ?? 'bg-[#f3f4f6] text-[#374151]'}`}>{label}</span>;
}

export function Services({ navigateTo }: ServicesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['accommodation']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['near-campus']);
  const [wishlisted, setWishlisted] = useState<number[]>([]);

  const selectedChips = useMemo(
    () => [
      ...selectedCategories.map((id) => ({ id, type: 'category' as const, label: categories.find((item) => item.id === id)?.name ?? id })),
      ...selectedLocations.map((id) => ({ id, type: 'location' as const, label: locations.find((item) => item.id === id)?.name ?? id })),
    ],
    [selectedCategories, selectedLocations]
  );

  const filtered = useMemo(() => {
    return services.filter((service) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(service.category);
      const locationMatch = selectedLocations.length === 0 || true;
      const textMatch =
        searchTerm.trim().length === 0 ||
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && locationMatch && textMatch;
    });
  }, [searchTerm, selectedCategories, selectedLocations]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleLocation = (id: string) => {
    setSelectedLocations((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
  };

  const sidebar = (
    <div className="flex h-full flex-col rounded-2xl bg-[#1a1f2e] p-5 text-[#d1d5db]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filter</h3>
        <button onClick={clearAllFilters} className="text-sm text-[#9ca3af] hover:text-white">
          Clear All
        </button>
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
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
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
                  checked={selectedLocations.includes(location.id)}
                  onChange={() => toggleLocation(location.id)}
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
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#6b7280]">
          <button onClick={() => navigateTo('home')} className="hover:text-[#111111]">
            Home
          </button>
          <span>&gt;</span>
          <span className="text-[#111111]">Services</span>
        </nav>

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
          {selectedChips.map((chip) => (
            <button
              key={`${chip.type}-${chip.id}`}
              onClick={() => (chip.type === 'category' ? toggleCategory(chip.id) : toggleLocation(chip.id))}
              className="rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white"
            >
              {chip.label} ×
            </button>
          ))}
          {selectedChips.length > 0 ? (
            <button onClick={clearAllFilters} className="text-sm text-[#6b7280] hover:text-[#111111]">
              Clear All
            </button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-[#111111] text-[#111111]">Filters</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[290px] border-none bg-transparent p-0">
                {sidebar}
              </SheetContent>
            </Sheet>
          </div>

          <div className="ml-auto flex items-center gap-3 text-sm text-[#6b7280]">
            <span>{new Intl.NumberFormat('en-IN').format(filtered.length)} Results</span>
            <button className="flex items-center gap-2 rounded-full border border-[#e5e7eb] px-3 py-2 text-[#374151]">
              Most Relevant
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">{sidebar}</aside>

          <div>
            {filtered.length === 0 ? (
              <EmptyState onClear={clearAllFilters} />
            ) : (
              <div className="grid gap-6 xl:grid-cols-2">
                {filtered.map((service) => {
                  const favorite = wishlisted.includes(service.id);
                  return (
                    <article
                      key={service.id}
                      className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
                    >
                      <div className="relative">
                        <img src={service.image} alt={service.title} className="h-[180px] w-full object-cover" />
                        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] text-[#111111]">
                          {categories.find((item) => item.id === service.category)?.name ?? service.category}
                        </span>
                        <button
                          onClick={() =>
                            setWishlisted((prev) =>
                              prev.includes(service.id) ? prev.filter((id) => id !== service.id) : [...prev, service.id]
                            )
                          }
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white"
                          aria-label="Toggle wishlist"
                        >
                          <Heart className={`h-4 w-4 ${favorite ? 'fill-[#f5a623] text-[#f5a623]' : 'text-[#374151]'}`} />
                        </button>
                      </div>

                      <div className="space-y-3 p-4">
                        <div className="flex flex-wrap gap-2">
                          {service.tags.slice(0, 3).map((tag) => (
                            <TagPill key={tag} label={tag} />
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
                          {(languagePreset[service.category] ?? ['English', 'Hindi']).map((language) => (
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
                            <p className="text-xs text-[#9ca3af]">In business 5 yrs</p>
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
                  );
                })}
              </div>
            )}

            <section className="mt-10">
              <h2 className="text-lg font-bold text-[#111111]">Recommended For You</h2>
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {['Food Delivery', 'Transportation', 'Barbershop', 'Health & Wellness', 'Electrical Gadgets'].map((item) => (
                  <button
                    key={item}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-sm text-white"
                  >
                    {item}
                    <Search className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </section>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
              <button className="font-medium text-[#111111]">Musika &gt;</button>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
                <button
                  key={page}
                  className={`h-8 min-w-8 rounded-full px-2 ${page === 1 ? 'bg-[#111111] text-white' : 'border border-[#e5e7eb] text-[#374151]'}`}
                >
                  {page}
                </button>
              ))}
              <button className="text-[#374151]">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
