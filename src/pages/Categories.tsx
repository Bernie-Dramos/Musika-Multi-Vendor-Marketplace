import {
  Search,
  Mic,
  Camera,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Heart,
  Check,
  Building,
  Car,
  Scale,
  HeartPulse,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection } from '@/components/AnimatedSection';
import { categories, locations, featuredVendors, popularServices } from '@/lib/data';

type Page = 'home' | 'services' | 'categories' | 'marketplace' | 'signin' | 'signup';

interface CategoriesProps {
  navigateTo: (page: Page) => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Accommodation: Building,
  Transportation: Car,
  'Legal Offices': Scale,
  'Health & Wellness': HeartPulse,
  Marketplace: ShoppingBag,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Categories({ navigateTo }: CategoriesProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full">
              Accommodation
              <X className="w-3 h-3 cursor-pointer" />
            </span>
            <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full">
              Near Campus
              <X className="w-3 h-3 cursor-pointer" />
            </span>
            <button className="text-sm text-emerald-600 hover:text-emerald-700">
              Clear All
            </button>
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
                <button className="text-sm text-emerald-400 hover:text-emerald-300">
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
                  {categories.slice(0, 6).map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={category.id === 'accommodation'}
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
              <div>
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
                          checked={location.id === 'near-campus'}
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
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 space-y-8">
            {/* Featured Vendors */}
            <AnimatedSection>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#0F172A]">Featured Vendors</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredVendors.map((vendor, index) => (
                  <div
                    key={vendor.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="h-32 overflow-hidden">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#0F172A] mb-1">{vendor.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{vendor.rating}</span>
                        <span className="text-sm text-slate-500">({vendor.reviews})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Browse Categories */}
            <AnimatedSection delay={100}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#0F172A]">Browse Categories</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {['Accommodation', 'Transportation', 'Legal Offices', 'Health & Wellness', 'Marketplace'].map(
                  (category, index) => {
                    const IconComponent = categoryIcons[category] || Building;
                    return (
                      <button
                        key={category}
                        className="bg-[#0F172A] rounded-xl p-6 text-center hover:bg-[#1E293B] transition-all hover:-translate-y-1"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <IconComponent className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-white text-sm font-medium">{category}</span>
                      </button>
                    );
                  }
                )}
              </div>
            </AnimatedSection>

            {/* Most Popular Services */}
            <AnimatedSection delay={200}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#0F172A]">Most Popular Services</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {popularServices.map((service, index) => (
                  <div
                    key={service.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 relative">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                          <Heart className="w-4 h-4 text-slate-600" />
                        </button>
                        <Badge className="absolute top-3 left-3 bg-[#0F172A] text-white text-xs">
                          {service.category}
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
                            <Button
                              variant="outline"
                              className="border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
