import { useState } from 'react';
import {
  Search,
  Mic,
  Camera,
  SlidersHorizontal,
  X,
  Star,
  Heart,
  Shield,
  Plus,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedSection } from '@/components/AnimatedSection';
import { marketplaceProducts } from '@/lib/data';
import { useCart } from '@/hooks/useCart';

type Page = 'home' | 'services' | 'categories' | 'marketplace' | 'signin' | 'signup';

interface MarketplaceProps {
  navigateTo: (page: Page) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Marketplace({ navigateTo }: MarketplaceProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const mainProduct = marketplaceProducts[0];
  const relatedProducts = marketplaceProducts.slice(1);

  const productImages = [
    'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&auto=format&fit=crop',
  ];

  const handleAddToCart = () => {
    addItem({
      id: mainProduct.id,
      name: mainProduct.name,
      price: mainProduct.price,
      currency: mainProduct.currency || '₹',
      image: productImages[0],
      vendor: mainProduct.vendor || 'Various Vendors',
      category: mainProduct.category || 'Beverages',
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleAddRelatedToCart = (product: typeof relatedProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: (product.currency as string) || '₹',
      image: product.image as string,
      vendor: 'Various Vendors',
      category: 'Beverages',
    });
  };

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

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <AnimatedSection>
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                        ? 'border-emerald-500'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 relative">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={productImages[selectedImage]}
                    alt={mainProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'
                      }`}
                  />
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection delay={100}>
            <div className="bg-[#0F172A] rounded-2xl p-6 lg:p-8 text-white">
              {/* Vendor */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-lg">🇿🇼</span>
                </div>
                <div>
                  <p className="font-medium">{mainProduct.vendor}</p>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-400">Verified Vendor</span>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <h2 className="text-2xl font-bold mb-2">{mainProduct.name}</h2>

              {/* Price */}
              <p className="text-3xl font-bold text-emerald-400 mb-6">
                {mainProduct.currency}{mainProduct.price}
              </p>

              {/* Actions */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  className={`w-full py-6 text-base font-semibold transition-all ${addedToCart
                      ? 'bg-emerald-500 hover:bg-emerald-600'
                      : 'bg-white text-[#0F172A] hover:bg-slate-100'
                    }`}
                >
                  {addedToCart ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </span>
                  ) : (
                    'Add to Cart'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/10 py-6 text-base font-semibold"
                >
                  Buy Now
                </Button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full bg-transparent border-b border-slate-700 p-0 h-auto mb-4">
                  <TabsTrigger
                    value="description"
                    className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none pb-3 text-slate-400"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="additional"
                    className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none pb-3 text-slate-400"
                  >
                    Additional Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none pb-3 text-slate-400"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-0">
                  <p className="text-slate-300 leading-relaxed">
                    {mainProduct.description}
                  </p>
                </TabsContent>
                <TabsContent value="additional" className="mt-0">
                  <ul className="space-y-2 text-slate-300">
                    <li>• Brand: Mazoe</li>
                    <li>• Volume: 2 Liters</li>
                    <li>• Flavor: Orange Crush</li>
                    <li>• Origin: Zimbabwe</li>
                  </ul>
                </TabsContent>
                <TabsContent value="reviews" className="mt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{mainProduct.rating}</span>
                    <span className="text-slate-400">({mainProduct.reviews} reviews)</span>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Related Products */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-xl font-semibold text-[#0F172A] mb-6">
              Customers also bought these items
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {relatedProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="aspect-square relative bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleAddRelatedToCart(product)}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-medium text-[#0F172A] text-sm mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F172A]">
                      {product.currency}{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {product.currency}{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
