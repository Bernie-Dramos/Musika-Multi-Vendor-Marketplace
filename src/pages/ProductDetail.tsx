import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  MessageCircle,
  Share2,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getVendorAvatarUrl, marketplaceProducts } from '@/lib/data';
import { useCart } from '@/hooks/useCart';
import { formatINR, QuickAddButton } from '@/components/musika/ui-primitives';

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-[#f5a623]">
      {'★'.repeat(Math.round(rating))}
      {'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();

  const product = marketplaceProducts.find((p) => p.id === Number(id));

  const [activeTab, setActiveTab] = useState<'description' | 'info' | 'reviews'>('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-2xl font-bold text-[#111111]">Product not found</p>
        <p className="text-[#6b7280]">The product you are looking for does not exist.</p>
        <Button onClick={() => navigate('/marketplace')} className="bg-[#111111] text-white hover:bg-black">
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const vendor = product.vendor ?? 'Various Vendors';
  const vendorVerified = (product as { vendorVerified?: boolean }).vendorVerified ?? false;
  const rating = (product as { rating?: number }).rating ?? 4.5;
  const reviews = (product as { reviews?: number }).reviews ?? 0;
  const description =
    (product as { description?: string }).description ??
    `${product.name} is a quality product from ${vendor}. Available fresh and ready to deliver directly to you.`;

  // Build thumbnail strip (crop variations of the same image)
  const baseImage = product.image.split('?')[0];
  const thumbCrops = [
    `${baseImage}?w=200&auto=format&fit=crop`,
    `${baseImage}?w=200&auto=format&fit=crop&sat=-10`,
    `${baseImage}?w=200&auto=format&fit=crop&q=75`,
    `${baseImage}?w=200&auto=format&fit=crop&flip=h`,
  ];
  const largeImages = [
    product.image,
    `${baseImage}?w=800&auto=format&fit=crop&sat=-10`,
    `${baseImage}?w=800&auto=format&fit=crop&q=75`,
    `${baseImage}?w=800&auto=format&fit=crop&flip=h`,
  ];

  const alsobought = marketplaceProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 5);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: '₹',
      image: product.image,
      vendor,
      category: product.subcategory ?? 'Marketplace',
      type: 'product',
    });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <nav className="mt-1 text-xs text-[#9ca3af]">
          <span
            className="cursor-pointer hover:text-[#111111]"
            onClick={() => navigate('/marketplace')}
          >
            Marketplace
          </span>
          {' › '}
          <span
            className="cursor-pointer hover:text-[#111111]"
            onClick={() => navigate('/marketplace')}
          >
            {product.subcategory ?? 'Grocery'}
          </span>
          {' › '}
          <span className="text-[#374151]">{product.name}</span>
        </nav>
      </div>

      {/* Main layout */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Left — image gallery */}
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl bg-[#f3f4f6] relative">
              <img
                src={largeImages[selectedThumb]}
                alt={product.name}
                className="h-[380px] w-full object-cover sm:h-[460px]"
              />
              <button
                onClick={() => setWishlisted((prev) => !prev)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`h-4 w-4 ${wishlisted ? 'fill-[#f5a623] text-[#f5a623]' : 'text-[#374151]'}`}
                />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {thumbCrops.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  className={`h-[72px] w-[96px] shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedThumb === i
                      ? 'border-[#111111]'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`${product.name} view ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — detail panel (dark, matches reference) */}
          <div className="rounded-2xl bg-[#111111] p-6 text-white lg:sticky lg:top-6 lg:self-start">
            {/* Vendor */}
            <div className="mb-4 flex items-center gap-2">
              <img
                src={getVendorAvatarUrl(vendor)}
                alt={vendor}
                className="h-8 w-8 rounded-full bg-[#374151] object-cover"
              />
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-white">{vendor}</span>
                {vendorVerified ? (
                  <BadgeCheck className="h-4 w-4 text-[#60a5fa]" />
                ) : null}
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1f2e] hover:bg-[#252d3d]"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4 text-[#9ca3af]" />
                </button>
              </div>
            </div>

            <span className="inline-block rounded-full bg-[#1a1f2e] px-2.5 py-0.5 text-[10px] text-[#d1d5db]">
              {product.subcategory ?? 'Grocery'}
            </span>

            <h1 className="mt-2 text-xl font-bold leading-snug text-white">{product.name}</h1>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2 text-sm">
              <StarRow rating={rating} />
              <span className="font-medium text-white">{rating.toFixed(1)}</span>
              {reviews > 0 ? (
                <span className="text-[#9ca3af]">({reviews} reviews)</span>
              ) : null}
            </div>

            {/* Price */}
            <div className="mt-4 border-t border-[#374151] pt-4">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-white">{formatINR(product.price)}</p>
                {product.originalPrice ? (
                  <p className="text-sm text-[#9ca3af] line-through">
                    {formatINR(product.originalPrice)}
                  </p>
                ) : null}
              </div>
              {product.originalPrice ? (
                <p className="mt-0.5 text-xs text-[#22c55e]">
                  Save {formatINR(product.originalPrice - product.price)} (
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                </p>
              ) : null}
            </div>

            {/* CTA buttons */}
            <div className="mt-5 space-y-2.5">
              <Button
                onClick={handleAddToCart}
                className="h-11 w-full rounded-xl bg-white text-[#111111] font-semibold hover:bg-[#f3f4f6]"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to cart
              </Button>
              <Button
                className="h-11 w-full rounded-xl bg-[#f5a623] text-[#111111] font-semibold hover:bg-[#e09500]"
              >
                Buy Now
              </Button>
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="flex gap-4 border-b border-[#374151]">
                {(['description', 'info', 'reviews'] as const).map((tab) => {
                  const label =
                    tab === 'info' ? 'Additional Info' : tab.charAt(0).toUpperCase() + tab.slice(1);
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-xs font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-b-2 border-white text-white'
                          : 'text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 text-sm text-[#d1d5db]">
                {activeTab === 'description' && (
                  <p className="leading-relaxed">{description}</p>
                )}
                {activeTab === 'info' && (
                  <table className="w-full text-xs">
                    <tbody className="space-y-2">
                      <tr className="border-b border-[#374151]">
                        <td className="py-1.5 text-[#9ca3af]">Vendor</td>
                        <td className="py-1.5 text-right">{vendor}</td>
                      </tr>
                      <tr className="border-b border-[#374151]">
                        <td className="py-1.5 text-[#9ca3af]">Category</td>
                        <td className="py-1.5 text-right">{product.subcategory ?? 'Grocery'}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 text-[#9ca3af]">Currency</td>
                        <td className="py-1.5 text-right">{product.currency ?? '₹'} (INR)</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-[#1a1f2e] p-3">
                      <div className="flex items-center gap-2">
                        <StarRow rating={5} />
                        <span className="text-xs text-[#9ca3af]">3 days ago</span>
                      </div>
                      <p className="mt-1 text-xs text-[#d1d5db]">
                        Great quality and fast delivery. Will definitely order again!
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#1a1f2e] p-3">
                      <div className="flex items-center gap-2">
                        <StarRow rating={4} />
                        <span className="text-xs text-[#9ca3af]">1 week ago</span>
                      </div>
                      <p className="mt-1 text-xs text-[#d1d5db]">
                        Good value for money. Packaging was excellent.
                      </p>
                    </div>
                    {reviews > 0 ? (
                      <p className="text-center text-[10px] text-[#6b7280]">
                        Showing 2 of {reviews} reviews
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Contact vendor */}
            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#374151] py-2.5 text-sm text-[#9ca3af] hover:border-white hover:text-white transition-colors"
              onClick={() => navigate(`/messages?vendor=${encodeURIComponent(vendor)}`)}
            >
              <MessageCircle className="h-4 w-4" />
              Contact Vendor
            </button>
          </div>
        </div>

        {/* Customers also bought */}
        {alsobought.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-[#111111]">Customers also bought these items</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {alsobought.map((p) => (
                <article
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-[#e5e7eb] bg-white"
                >
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-[140px] w-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <QuickAddButton
                        onAdd={() => {
                          addItem({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            currency: '₹',
                            image: p.image,
                            vendor: p.vendor ?? 'Various Vendors',
                            category: p.subcategory ?? 'Marketplace',
                            type: 'product',
                          });
                          setIsCartOpen(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-xs font-semibold text-[#111111]">{p.name}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#111111]">{formatINR(p.price)}</span>
                      {p.originalPrice ? (
                        <span className="text-[10px] text-[#9ca3af] line-through">
                          {formatINR(p.originalPrice)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
