import { useState, useMemo } from 'react';
import {
  Search,
  Mic,
  Camera,
  SlidersHorizontal,
  X,
  Star,
  Heart,
  ChevronDown,
  Check,
  Settings,
  HelpCircle,
  User,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection } from '@/components/AnimatedSection';
import { categories, locations, services } from '@/lib/data';
import { useCart } from '@/hooks/useCart';

type Page = 'home' | 'services' | 'categories' | 'marketplace' | 'signin' | 'signup';

interface ServicesProps {
  navigateTo: (page: Page) => void;
}

export function Services({ navigateTo }: ServicesProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const { addItem } = useCart();

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleLocation = (id: string) => {
    setSelectedLocations((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
  };

  // Filter services based on selected categories and locations
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(service.category);
      // For demo purposes, location filtering is simplified
      const locationMatch = selectedLocations.length === 0 || true;
      return categoryMatch && locationMatch;
    });
  }, [selectedCategories, selectedLocations]);

  const handleAddToCart = (service: typeof services[0]) => {
    addItem({
      id: service.id,
      name: service.title,
      price: service.price,
      currency: '$',
      image: service.image,
      vendor: service.vendor,
      category: service.category,
    });
    
    // Show added feedback
    setAddedItems((prev) => [...prev, service.id]);
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== service.id));
    }, 1500);
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'accommodation': 'Accommodation',
      'electronics': 'Electronics & Gadgets',
      'beauty': 'Beauty',
      'healthcare': 'Healthcare & Wellness',
      'dining': 'Dining',
      'transportation': 'Transportation',
      'legal': 'Legal & Documentation',
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <button onClick={() => navigateTo('home')} className="hover:text-[#0F172A]">Home</button>
            <span>&gt;</span>
            <span className="text-[#0F172A]">Services</span>
          </nav>

          <AnimatedSection className="text-center mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-2">
              Your Gateway to Reliable Services
            </h1>
            <p className="text-slate-600">
              Discover trusted services from verified providers tailored for International Students
            </p>
          </AnimatedSection>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for Accommodation, Transportation..."
                className="w-full h-12 pl-12 pr-24 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Mic className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Camera className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-sm text-slate-500">Quick Filters:</span>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-[#0F172A] text-white text-sm rounded-full">
              <SlidersHorizontal className="w-3 h-3" />
              All Filters
            </button>
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full"
              >
                {categories.find((c) => c.id === cat)?.name}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
              </span>
            ))}
            {selectedLocations.map((loc) => (
              <span
                key={loc}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full"
              >
                {locations.find((l) => l.id === loc)?.name}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleLocation(loc)} />
              </span>
            ))}
            {(selectedCategories.length > 0 || selectedLocations.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-[#0F172A] rounded-xl p-6 lg:sticky lg:top-24">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Filter</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-4 flex items-center justify-between">
                  Categories
                  <ChevronDown className="w-4 h-4" />
                </h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                          className="border-slate-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <span className="text-slate-300 group-hover:text-white transition-colors text-sm">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-slate-500 text-sm">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-4 flex items-center justify-between">
                  Location
                  <ChevronDown className="w-4 h-4" />
                </h4>
                <div className="space-y-3">
                  {locations.map((location) => (
                    <label
                      key={location.id}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedLocations.includes(location.id)}
                          onCheckedChange={() => toggleLocation(location.id)}
                          className="border-slate-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <span className="text-slate-300 group-hover:text-white transition-colors text-sm">
                          {location.name}
                        </span>
                      </div>
                      <span className="text-slate-500 text-sm">({location.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* User Actions */}
              <div className="border-t border-slate-700 pt-4 space-y-3">
                <button className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors w-full">
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-sm">Help & Support</span>
                </button>
                <button className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors w-full">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm">Settings</span>
                </button>
              </div>

              {/* User Profile */}
              <div className="border-t border-slate-700 pt-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Lennox Galanje</p>
                    <p className="text-slate-500 text-xs">lennoxgalanje@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Service Listings */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                <span className="font-semibold text-[#0F172A]">{filteredServices.length}</span> Results
              </p>
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
                  Most Relevant
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Service Cards */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No results found</h3>
                <p className="text-slate-500 mb-4">Try adjusting your filters to see more results</p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredServices.map((service) => (
                  <div 
                    key={service.id} 
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-48 md:w-64 h-48 sm:h-auto flex-shrink-0 relative">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                          <Heart className="w-4 h-4 text-slate-600" />
                        </button>
                        <Badge className="absolute top-3 left-3 bg-[#0F172A] text-white text-xs">
                          {getCategoryDisplayName(service.category)}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {service.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-emerald-100 text-emerald-700 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                          {service.title}
                        </h3>

                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                          {service.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.features.map((feature) => (
                            <span
                              key={feature}
                              className="flex items-center gap-1 text-xs text-slate-500"
                            >
                              <Check className="w-3 h-3 text-emerald-500" />
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-medium text-[#0F172A]">
                                {service.rating}
                              </span>
                              <span className="text-sm text-slate-500">
                                ({service.reviews} Reviews)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-slate-200 rounded-full" />
                              <span className="text-sm text-slate-600">{service.vendor}</span>
                              {service.vendorVerified && (
                                <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-[#0F172A]">
                              ${service.price}
                              <span className="text-sm font-normal text-slate-500">/{service.priceUnit}</span>
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white"
                              >
                                View Details
                              </Button>
                              <Button
                                onClick={() => handleAddToCart(service)}
                                className={`transition-all ${
                                  addedItems.includes(service.id)
                                    ? 'bg-emerald-500 hover:bg-emerald-600'
                                    : 'bg-[#0F172A] hover:bg-[#1E293B]'
                                } text-white`}
                              >
                                {addedItems.includes(service.id) ? (
                                  <span className="flex items-center gap-1">
                                    <Check className="w-4 h-4" />
                                    Added
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Plus className="w-4 h-4" />
                                    Add
                                  </span>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredServices.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <span className="text-lg font-semibold text-[#0F172A]">Musika</span>
                <span className="text-slate-400">&gt;</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-8 h-8 rounded-lg text-sm ${
                        page === 1
                          ? 'bg-[#0F172A] text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button className="text-sm text-slate-600 hover:text-[#0F172A]">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Recommended For You</h2>
            <div className="flex flex-wrap gap-3">
              {['Food Delivery', 'Transportation', 'Barbershop', 'Health & Wellness', 'Electrical Gadgets'].map(
                (item) => (
                  <button
                    key={item}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-full text-sm hover:bg-[#1E293B] transition-colors"
                  >
                    {item}
                    <Search className="w-3 h-3" />
                  </button>
                )
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
