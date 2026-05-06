import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building,
  Car,
  ChevronDown,
  Globe,
  Heart,
  HeartPulse,
  Scale,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  HelpCircle,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/AnimatedSection';
import {
  allVendors,
  categories,
  featuredVendors,
  getDeterministicLanguages,
  getDeterministicResponseTime,
  getVendorSlug,
  getVendorAvatarUrl,
  locations,
  popularServices,
  services,
} from '@/lib/data';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  EmptyState,
  UnifiedSearchBar,
  formatINR,
} from '@/components/musika/ui-primitives';

type Page = 'home' | 'services' | 'categories' | 'marketplace' | 'signin' | 'signup';

interface ServicesProps {
  navigateTo: (page: Page) => void;
}

const ITEMS_PER_PAGE = 4;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Accommodation: Building,
  Transportation: Car,
  'Legal Offices': Scale,
  'Health & Wellness': HeartPulse,
  Marketplace: ShoppingBag,
};

const sectionCategories = ['Accommodation', 'Transportation', 'Legal Offices', 'Health & Wellness', 'Marketplace'];

const sectionCategoryToDataCategory: Record<string, string> = {
  Accommodation: 'accommodation',
  Transportation: 'transportation',
  'Legal Offices': 'legal',
  'Health & Wellness': 'healthcare',
};

export function Services({ navigateTo }: ServicesProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') ?? '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [wishlisted, setWishlisted] = useState<number[]>([]);
  const [showAllVendors, setShowAllVendors] = useState(false);
  const [vendorPage, setVendorPage] = useState(1);
  const [forceServiceResults, setForceServiceResults] = useState(() => Boolean(searchParams.get('q')));
  const [featuredPage, setFeaturedPage] = useState(1);
  const [resultsPage, setResultsPage] = useState(1);

  // Sync URL ?q= param into local state when navigating from global search
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setSearchTerm(q);
    if (q) setForceServiceResults(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Guest';
  const displayEmail = user?.email ?? '';

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
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
          searchTerm.toLowerCase().includes(tag.toLowerCase())
        );
      return categoryMatch && locationMatch && textMatch;
    });
  }, [searchTerm, selectedCategories, selectedLocations]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    setResultsPage(1);
  };

  const toggleLocation = (id: string) => {
    setSelectedLocations((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    setResultsPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setResultsPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedLocations([]);
    setForceServiceResults(false);
    setFeaturedPage(1);
    setResultsPage(1);
  };

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    selectedCategories.length > 0 ||
    selectedLocations.length > 0;

  const showServiceResults = hasActiveFilters || forceServiceResults;

  const featuredServicePages = Math.ceil(popularServices.length / ITEMS_PER_PAGE);
  const featuredServices = popularServices.slice(
    (featuredPage - 1) * ITEMS_PER_PAGE,
    featuredPage * ITEMS_PER_PAGE
  );

  const resultsPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedFiltered = filtered.slice(
    (resultsPage - 1) * ITEMS_PER_PAGE,
    resultsPage * ITEMS_PER_PAGE
  );

  const handleViewAllServices = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedLocations([]);
    setForceServiceResults(true);
    setResultsPage(1);
  };

  const handleSectionCategorySelect = (category: string) => {
    if (category === 'Marketplace') {
      navigateTo('marketplace');
      return;
    }

    const mapped = sectionCategoryToDataCategory[category];
    if (!mapped) return;

    setSearchTerm('');
    setSelectedLocations([]);
    setSelectedCategories([mapped]);
    setForceServiceResults(true);
    setResultsPage(1);
  };

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ) => {
    if (totalPages <= 1) {
      return null;
    }

    return (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-full border border-[#e5e7eb] px-3 py-1.5 text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-8 min-w-8 rounded-full px-2 ${
              page === currentPage
                ? 'bg-[#111111] text-white'
                : 'border border-[#e5e7eb] text-[#374151]'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-full border border-[#e5e7eb] px-3 py-1.5 text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
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
          onChange={handleSearchChange}
          showSubmitButton={false}
          enableVoiceSearch
          enableImageSearch
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

          {showServiceResults ? (
            <div className="ml-auto flex items-center gap-3 text-sm text-[#6b7280]">
              <span>{new Intl.NumberFormat('en-IN').format(filtered.length)} Results</span>
              <button className="flex items-center gap-2 rounded-full border border-[#e5e7eb] px-3 py-2 text-[#374151]">
                Most Relevant
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">{sidebar}</aside>

          <div>
            {!showServiceResults ? (
              <main className="space-y-8">
                <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#111111]">Featured Vendors</h2>
                  <button
                      onClick={() => {
                        if (showAllVendors) {
                          setShowAllVendors(false);
                          setVendorPage(1);
                        } else {
                          setShowAllVendors(true);
                          setVendorPage(1);
                        }
                      }}
                      className="rounded-full bg-[#111111] px-4 py-2 text-xs text-white"
                    >
                      {showAllVendors ? 'Show Less' : 'View All'}
                    </button>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-3">
                    {(showAllVendors
                      ? allVendors.slice((vendorPage - 1) * 15, vendorPage * 15)
                      : featuredVendors
                    ).map((vendor) => (
                      <article
                        key={vendor.id}
                        onClick={() => navigate(`/vendor/${getVendorSlug(vendor.name)}`)}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[#1a1f2e] p-3 transition-colors hover:bg-[#252d3d]"
                      >
                        <img src={vendor.image} alt={vendor.name} className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white">{vendor.name}</p>
                          </div>
                          <p className="mt-1 text-xs">
                            <span className="text-[#f5a623]">{'★'.repeat(Math.round(vendor.rating))}{'☆'.repeat(5 - Math.round(vendor.rating))}</span>
                            <span className="text-[#9ca3af]"> ({vendor.rating.toFixed(1)})</span>
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                  {showAllVendors && renderPagination(vendorPage, Math.ceil(allVendors.length / 15), (page) => setVendorPage(page))}
                </section>

                <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#111111]">Browse Categories</h2>
                    <button onClick={clearAllFilters} className="rounded-full bg-[#111111] px-4 py-2 text-xs text-white">View All</button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {sectionCategories.map((category) => {
                      const Icon = iconMap[category] ?? Building;
                      return (
                        <button
                          key={category}
                          onClick={() => handleSectionCategorySelect(category)}
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
                    <button
                      onClick={handleViewAllServices}
                      className="rounded-full bg-[#111111] px-4 py-2 text-xs text-white"
                    >
                      View All
                    </button>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    {featuredServices.map((service) => (
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
                            <Globe className="h-3.5 w-3.5 shrink-0 text-[#9ca3af]" />
                            {getDeterministicLanguages(`${service.id}-${service.vendor}`).map((lang) => (
                              <span key={lang} className="rounded-full bg-[#252d3d] px-2 py-0.5 text-[9px] text-[#d1d5db]">
                                {lang}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <img
                              src={getVendorAvatarUrl(service.vendor)}
                              alt={service.vendor}
                              className="h-5 w-5 shrink-0 rounded-full bg-[#374151] object-cover"
                            />
                            <span className="text-[11px] font-medium text-white">{service.vendor}</span>
                            <span className="text-[9px] text-[#6b7280]">⊙ Responds · {getDeterministicResponseTime(`${service.id}-${service.vendor}`)}</span>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-1">
                            <p className="text-sm font-bold text-white">
                              {formatINR(service.price)}
                              <span className="text-[10px] font-normal text-[#9ca3af]">/{service.priceUnit}</span>
                            </p>
                            <button
                              onClick={() => navigate(`/service/${service.id}`)}
                              className="rounded-full border border-[#4b5563] px-3 py-1.5 text-[11px] text-[#d1d5db] transition-colors hover:border-white hover:text-white"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {renderPagination(featuredPage, featuredServicePages, setFeaturedPage)}
                </section>
              </main>
            ) : filtered.length === 0 ? (
              <EmptyState onClear={clearAllFilters} />
            ) : (
              <>
                <div className="grid gap-6 xl:grid-cols-2">
                  {paginatedFiltered.map((service) => {
                    const favorite = wishlisted.includes(service.id);
                    return (
                      <article
                        key={service.id}
                        className="flex min-h-[200px] overflow-hidden rounded-2xl bg-[#1a1f2e] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                      >
                        <div className="relative w-[42%] shrink-0">
                          <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                          <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                            {categories.find((item) => item.id === service.category)?.name ?? service.category}
                          </span>
                          <button
                            onClick={() =>
                              setWishlisted((prev) =>
                                prev.includes(service.id) ? prev.filter((id) => id !== service.id) : [...prev, service.id]
                              )
                            }
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                            aria-label="Toggle wishlist"
                          >
                            <Heart className={`h-3.5 w-3.5 ${favorite ? 'fill-[#f5a623] text-[#f5a623]' : 'text-white'}`} />
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
                            <Globe className="h-3.5 w-3.5 shrink-0 text-[#9ca3af]" />
                            {getDeterministicLanguages(`${service.id}-${service.vendor}`).map((lang) => (
                              <span key={lang} className="rounded-full bg-[#252d3d] px-2 py-0.5 text-[9px] text-[#d1d5db]">
                                {lang}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <img
                              src={getVendorAvatarUrl(service.vendor)}
                              alt={service.vendor}
                              className="h-5 w-5 shrink-0 rounded-full bg-[#374151] object-cover"
                            />
                            <span className="text-[11px] font-medium text-white">{service.vendor}</span>
                            <span className="text-[9px] text-[#6b7280]">⊙ Responds · {getDeterministicResponseTime(`${service.id}-${service.vendor}`)}</span>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-1">
                            <p className="text-sm font-bold text-white">
                              {formatINR(service.price)}
                              <span className="text-[10px] font-normal text-[#9ca3af]">/{service.priceUnit}</span>
                            </p>
                            <button
                              onClick={() => navigate(`/service/${service.id}`)}
                              className="rounded-full border border-[#4b5563] px-3 py-1.5 text-[11px] text-[#d1d5db] transition-colors hover:border-white hover:text-white"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <section className="mt-10">
                  <h2 className="text-lg font-bold text-[#111111]">Recommended For You</h2>
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {['Food Delivery', 'Transportation', 'Barbershop', 'Health & Wellness', 'Electrical Gadgets'].map((item) => {
                      const isActive = searchTerm === item;
                      return (
                        <button
                          key={item}
                          onClick={() => {
                            if (isActive) {
                              handleSearchChange('');
                            } else {
                              handleSearchChange(item);
                            }
                          }}
                          className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-[#f5a623] text-white shadow-md'
                              : 'bg-[#111111] text-white hover:bg-[#222222]'
                          }`}
                        >
                          {item}
                          <Search className={`h-3 w-3 ${isActive ? 'text-white' : 'text-[#9ca3af]'}`} />
                        </button>
                      );
                    })}
                  </div>
                </section>

                {renderPagination(resultsPage, resultsPages, setResultsPage)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
