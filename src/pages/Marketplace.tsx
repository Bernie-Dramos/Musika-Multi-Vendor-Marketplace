import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/AnimatedSection';
import { getVendorAvatarUrl, marketplaceProducts } from '@/lib/data';
import { useCart } from '@/hooks/useCart';
import {
  QuickAddButton,
  UnifiedSearchBar,
  formatINR,
} from '@/components/musika/ui-primitives';

const grocerySubcategories = ['All', 'Fruits', 'Vegetables', 'Juices', 'Drinks', 'Snacks', 'Cereals'];
const ITEMS_PER_PAGE = 4;

export function Marketplace() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [wishlisted, setWishlisted] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { addItem } = useCart();

  const filteredProducts = useMemo(() => {
    return marketplaceProducts.filter((product) => {
      const subcategoryMatch = selectedSubcategory === 'All' || product.subcategory === selectedSubcategory;
      const textMatch =
        searchTerm.trim().length === 0 ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.subcategory ?? '').toLowerCase().includes(searchTerm.toLowerCase());

      return subcategoryMatch && textMatch;
    });
  }, [searchTerm, selectedSubcategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddToCart = (product: (typeof marketplaceProducts)[number]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: '₹',
      image: product.image,
      vendor: product.vendor ?? 'Various Vendors',
      category: product.subcategory ?? 'Marketplace',
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedSubcategory('All');
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#111111]">Marketplace Grocery Essentials</h1>
          <p className="mt-2 text-[#6b7280]">Browse fruits, vegetables, juices, drinks, snacks, cereals and more from trusted vendors</p>
        </AnimatedSection>

        <UnifiedSearchBar
          placeholder="Search grocery items, brands, or categories..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-[#6b7280]">Quick Filters</span>
          <button className="flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white">
            <SlidersHorizontal className="h-3 w-3" />
            All Filters
          </button>
          {selectedSubcategory !== 'All' ? (
            <button
              onClick={() => setSelectedSubcategory('All')}
              className="flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white"
            >
              {selectedSubcategory}
              <X className="h-3 w-3" />
            </button>
          ) : null}
          {searchTerm.trim() ? (
            <button onClick={() => setSearchTerm('')} className="flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white">
              Search
              <X className="h-3 w-3" />
            </button>
          ) : null}
          {(selectedSubcategory !== 'All' || searchTerm.trim()) ? (
            <button onClick={clearAllFilters} className="text-sm text-[#6b7280] hover:text-[#111111]">Clear All</button>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#111111]">Browse Grocery Categories</h2>
            <Button onClick={clearAllFilters} className="rounded-full bg-[#111111] px-4 py-2 text-xs text-white hover:bg-black">View All</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {grocerySubcategories.map((subcategory) => (
              <button
                key={subcategory}
                onClick={() => handleSubcategoryChange(subcategory)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  selectedSubcategory === subcategory
                    ? 'bg-[#111111] text-white'
                    : 'border border-[#d1d5db] bg-white text-[#374151] hover:border-[#111111]'
                }`}
              >
                {subcategory}
              </button>
            ))}
          </div>
        </section>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#111111]">
            {selectedSubcategory === 'All' ? 'All Grocery Items' : `${selectedSubcategory} Items`}
          </h3>
          <p className="text-sm text-[#6b7280]">{new Intl.NumberFormat('en-IN').format(filteredProducts.length)} items</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 py-10 text-center">
            <p className="text-lg font-semibold text-[#111111]">No grocery items found</p>
            <p className="mt-1 text-sm text-[#6b7280]">Try another search or clear filters to see all products.</p>
            <Button onClick={clearAllFilters} className="mt-4 bg-[#111111] text-white hover:bg-black">Clear Filters</Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.map((product) => {
              const isFavorited = wishlisted.includes(product.id);
              return (
                <article key={product.id} className="group overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
                  <div className="relative cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    <img src={product.image} alt={product.name} className="h-[210px] w-full object-cover" />
                    <button
                      onClick={() =>
                        setWishlisted((prev) =>
                          prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
                        )
                      }
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
                      aria-label="Toggle wishlist"
                    >
                      <Heart className={`h-4 w-4 ${isFavorited ? 'fill-[#f5a623] text-[#f5a623]' : 'text-[#374151]'}`} />
                    </button>
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
                      {product.subcategory ?? 'Grocery'}
                    </span>
                    <div className="absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <QuickAddButton onAdd={() => handleAddToCart(product)} />
                    </div>
                  </div>

                  <div className="space-y-2 p-4">
                    <p
                      className="line-clamp-2 text-sm font-semibold text-[#111111] cursor-pointer hover:text-[#374151]"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <img
                        src={getVendorAvatarUrl(product.vendor ?? 'Various Vendors')}
                        alt={product.vendor ?? 'Various Vendors'}
                        className="h-5 w-5 shrink-0 rounded-full bg-[#f3f4f6] object-cover"
                      />
                      <p className="text-xs text-[#6b7280]">{product.vendor ?? 'Various Vendors'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#111111]">{formatINR(product.price)}</span>
                      {product.originalPrice ? (
                        <span className="text-xs text-[#9ca3af] line-through">{formatINR(product.originalPrice)}</span>
                      ) : null}
                    </div>
                    <Button onClick={() => handleAddToCart(product)} className="h-9 w-full bg-[#111111] text-xs text-white hover:bg-black">
                      Add to Cart
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-[#e5e7eb] px-3 py-1.5 text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
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
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-[#e5e7eb] px-3 py-1.5 text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
