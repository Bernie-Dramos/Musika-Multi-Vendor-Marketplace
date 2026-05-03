import { useMemo, useState } from 'react';
import { Heart, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedSection } from '@/components/AnimatedSection';
import { marketplaceProducts } from '@/lib/data';
import { useCart } from '@/hooks/useCart';
import {
  QuickAddButton,
  UnifiedSearchBar,
  VerifiedBadge,
  formatINR,
} from '@/components/musika/ui-primitives';

export function Marketplace() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCartAdded, setShowCartAdded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [activeFilters, setActiveFilters] = useState(['Accommodation', 'Near Campus']);
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem } = useCart();

  const mainProduct = marketplaceProducts[0];
  const relatedProducts = marketplaceProducts.slice(1);

  const productImages = useMemo(
    () => [
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571687949920-c4040f125f3d?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627308595189-7830a5c91f9f?w=500&auto=format&fit=crop',
    ],
    []
  );

  const handleAddToCart = () => {
    addItem({
      id: mainProduct.id,
      name: mainProduct.name,
      price: mainProduct.price,
      currency: '₹',
      image: productImages[selectedImage],
      vendor: mainProduct.vendor ?? 'Various Vendors',
      category: mainProduct.category ?? 'Marketplace',
    });

    setShowCartAdded(true);
    setTimeout(() => setShowCartAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
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
          {activeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilters((prev) => prev.filter((item) => item !== filter))}
              className="flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white"
            >
              {filter}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
          <section>
            <h2 className="mb-3 text-4xl font-bold text-[#111111]">High Quality Mazoe</h2>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#e5e7eb]" />
              <button className="text-xl font-semibold text-[#111111] hover:underline">{mainProduct.vendor}</button>
              <VerifiedBadge />
            </div>

            <div className="grid gap-4 md:grid-cols-[72px_1fr]">
              <div className="order-2 flex gap-2 md:order-1 md:flex-col">
                {productImages.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(index)}
                    className={`h-[72px] w-[72px] overflow-hidden rounded-xl border-2 ${
                      selectedImage === index ? 'border-[#f5a623]' : 'border-[#e5e7eb]'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="order-1 md:order-2">
                <div className="relative overflow-hidden rounded-xl bg-[#f3f4f6]">
                  <img src={productImages[selectedImage]} alt={mainProduct.name} className="h-[420px] w-full object-contain" />
                  <button
                    onClick={() => setIsWishlisted((prev) => !prev)}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white"
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-[#f5a623] text-[#f5a623]' : 'text-[#374151]'}`} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-2xl bg-[#1a1f2e] p-6 text-white">
            <h3 className="text-[22px] font-bold">{mainProduct.name}</h3>
            <p className="mt-2 text-sm text-[#9ca3af] line-through">{formatINR(200)}</p>
            <p className="text-[28px] font-extrabold">{formatINR(mainProduct.price)}</p>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <Button
                  onClick={handleAddToCart}
                  className="h-12 w-full rounded-lg bg-white font-semibold text-[#111111] transition-all duration-150 hover:scale-[1.01] hover:bg-white"
                >
                  Add to Cart
                </Button>
                {showCartAdded ? (
                  <span className="absolute -bottom-8 left-0 rounded bg-[#111111] px-2 py-1 text-xs text-white">Added to cart ✓</span>
                ) : null}
              </div>
              <Button
                variant="outline"
                className="h-12 w-full rounded-lg border-white bg-transparent font-semibold text-white transition-all duration-150 hover:bg-white/20"
              >
                Buy Now
              </Button>
            </div>

            <Tabs defaultValue="description" className="mt-6">
              <TabsList className="h-auto w-full justify-start gap-4 rounded-none bg-transparent px-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent px-0 pb-2 text-[#9ca3af] data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="additional"
                  className="rounded-none border-b-2 border-transparent px-0 pb-2 text-[#9ca3af] data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white"
                >
                  Additional Info
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent px-0 pb-2 text-[#9ca3af] data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-3 text-[#d1d5db]">
                <p className={!showReadMore ? 'line-clamp-3' : ''}>{mainProduct.description}</p>
                <button onClick={() => setShowReadMore((prev) => !prev)} className="mt-2 text-sm text-[#f5a623]">
                  {showReadMore ? 'Read less' : 'Read more'}
                </button>
              </TabsContent>
              <TabsContent value="additional" className="mt-3 text-[#d1d5db]">
                <ul className="space-y-1 text-sm">
                  <li>• Imported and quality tested</li>
                  <li>• Suitable for student hostels</li>
                  <li>• Secure packaging included</li>
                </ul>
              </TabsContent>
              <TabsContent value="reviews" className="mt-3 text-[#d1d5db]">
                <p>Rated 4.7 by 89 students for taste, value, and freshness.</p>
              </TabsContent>
            </Tabs>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-[#111111]">Customers Also Bought</h2>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {relatedProducts.slice(0, 5).map((product) => (
              <article key={product.id} className="group w-[180px] shrink-0 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="h-[180px] w-full object-cover" />
                  <div className="absolute bottom-2 right-2 opacity-0 transition-all duration-150 group-hover:opacity-100">
                    <QuickAddButton
                      onAdd={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          currency: '₹',
                          image: product.image as string,
                          vendor: 'Various Vendors',
                          category: 'Marketplace',
                        })
                      }
                    />
                  </div>
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-[#111111]">{product.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-[#111111]">{formatINR(product.price)}</span>
                    {product.originalPrice ? (
                      <span className="text-xs text-[#9ca3af] line-through">{formatINR(product.originalPrice)}</span>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
