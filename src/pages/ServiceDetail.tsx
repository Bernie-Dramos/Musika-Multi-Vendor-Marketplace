import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Globe,
  Heart,
  MessageCircle,
  Share2,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  categories,
  getDeterministicLanguages,
  getDeterministicResponseTime,
  getVendorAvatarUrl,
  services,
} from '@/lib/data';
import { useCart } from '@/hooks/useCart';
import { formatINR } from '@/components/musika/ui-primitives';

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-[#f5a623]">
      {'★'.repeat(Math.round(rating))}
      {'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();

  const service = services.find((s) => s.id === Number(id));

  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'reviews'>('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);

  if (!service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-2xl font-bold text-[#111111]">Service not found</p>
        <p className="text-[#6b7280]">The service you are looking for does not exist.</p>
        <Button onClick={() => navigate('/services')} className="bg-[#111111] text-white hover:bg-black">
          Back to Services
        </Button>
      </div>
    );
  }

  // Generate thumbnail crop variants from the same base image
  const thumbParams = ['&q=80', '&q=75&brightness=-5', '&q=70&sat=-10', '&q=80&flip=h'];
  const thumbnails = thumbParams.map((p) =>
    service.image.replace('?w=800', `?w=200${p.replace('&q=80', '')}`)
  );
  thumbnails[0] = service.image;

  const similarServices = services
    .filter((s) => s.category === service.category && s.id !== service.id)
    .slice(0, 4);

  const categoryLabel =
    categories.find((c) => c.id === service.category)?.name ?? service.category;

  const responseTime = getDeterministicResponseTime(`${service.id}-${service.vendor}`);
  const langs = getDeterministicLanguages(`${service.id}-${service.vendor}`);

  const handleBookNow = () => {
    addItem({
      id: service.id,
      name: service.title,
      price: service.price,
      currency: '₹',
      image: service.image,
      vendor: service.vendor,
      category: categoryLabel,
      type: 'service',
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
            onClick={() => navigate('/services')}
          >
            Services
          </span>
          {' › '}
          <span
            className="cursor-pointer hover:text-[#111111]"
            onClick={() => navigate('/categories')}
          >
            {categoryLabel}
          </span>
          {' › '}
          <span className="text-[#374151]">{service.title}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Left — images */}
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl bg-[#f3f4f6]">
              <img
                src={service.image}
                alt={service.title}
                className="h-[380px] w-full object-cover sm:h-[460px]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {thumbnails.map((thumb, i) => (
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
                    alt={`${service.title} view ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — detail panel */}
          <div className="rounded-2xl bg-[#111111] p-6 text-white lg:sticky lg:top-6 lg:self-start">
            {/* Vendor row */}
            <div className="mb-4 flex items-center gap-2">
              <img
                src={getVendorAvatarUrl(service.vendor)}
                alt={service.vendor}
                className="h-8 w-8 rounded-full bg-[#374151] object-cover"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-white">{service.vendor}</span>
                  {service.vendorVerified ? (
                    <BadgeCheck className="h-4 w-4 text-[#60a5fa]" />
                  ) : null}
                </div>
                <span className="text-[10px] text-[#9ca3af]">⊙ Responds · {responseTime}</span>
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => setWishlisted((prev) => !prev)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1f2e] hover:bg-[#252d3d]"
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`h-4 w-4 ${wishlisted ? 'fill-[#f5a623] text-[#f5a623]' : 'text-[#9ca3af]'}`}
                  />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1f2e] hover:bg-[#252d3d]"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4 text-[#9ca3af]" />
                </button>
              </div>
            </div>

            <span className="inline-block rounded-full bg-[#1a1f2e] px-2.5 py-0.5 text-[10px] text-[#d1d5db]">
              {categoryLabel}
            </span>

            <h1 className="mt-2 text-xl font-bold leading-snug text-white">{service.title}</h1>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2 text-sm">
              <StarRow rating={service.rating} />
              <span className="font-medium text-white">{service.rating.toFixed(1)}</span>
              <span className="text-[#9ca3af]">({service.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 border-t border-[#374151] pt-4">
              <p className="text-3xl font-bold text-white">
                {formatINR(service.price)}
                <span className="ml-1 text-sm font-normal text-[#9ca3af]">/{service.priceUnit}</span>
              </p>
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#374151] px-2.5 py-0.5 text-[10px] text-[#d1d5db]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-3 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 shrink-0 text-[#9ca3af]" />
              {langs.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full bg-[#252d3d] px-2 py-0.5 text-[9px] text-[#d1d5db]"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-5 space-y-2.5">
              <Button
                onClick={handleBookNow}
                className="h-11 w-full rounded-xl bg-white text-[#111111] font-semibold hover:bg-[#f3f4f6]"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Book Now
              </Button>
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-[#374151] text-white hover:bg-[#1a1f2e] bg-transparent"
                onClick={() => navigate(`/messages?vendor=${encodeURIComponent(service.vendor)}`)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Vendor
              </Button>
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="flex gap-4 border-b border-[#374151]">
                {(['description', 'features', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-white text-white'
                        : 'text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {tab === 'features' ? 'Features' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm text-[#d1d5db]">
                {activeTab === 'description' && (
                  <p className="leading-relaxed">{service.description}</p>
                )}
                {activeTab === 'features' && (
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5a623]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-[#1a1f2e] p-3">
                      <div className="flex items-center gap-2">
                        <StarRow rating={5} />
                        <span className="text-xs text-[#9ca3af]">2 days ago</span>
                      </div>
                      <p className="mt-1 text-xs text-[#d1d5db]">
                        Excellent service! Highly recommend for all international students.
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#1a1f2e] p-3">
                      <div className="flex items-center gap-2">
                        <StarRow rating={4} />
                        <span className="text-xs text-[#9ca3af]">1 week ago</span>
                      </div>
                      <p className="mt-1 text-xs text-[#d1d5db]">
                        Very professional and prompt. Would use again.
                      </p>
                    </div>
                    <p className="text-center text-[10px] text-[#6b7280]">
                      Showing 2 of {service.reviews} reviews
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Services */}
        {similarServices.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-[#111111]">Similar Services</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similarServices.map((s) => (
                <article
                  key={s.id}
                  onClick={() => navigate(`/service/${s.id}`)}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-[160px] w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={getVendorAvatarUrl(s.vendor)}
                        alt={s.vendor}
                        className="h-5 w-5 rounded-full bg-[#f3f4f6] object-cover"
                      />
                      <span className="text-xs text-[#6b7280]">{s.vendor}</span>
                    </div>
                    <p className="font-semibold text-[#111111] text-sm line-clamp-2">{s.title}</p>
                    <p className="mt-1 text-sm font-bold text-[#111111]">
                      {formatINR(s.price)}
                      <span className="text-xs font-normal text-[#9ca3af]">/{s.priceUnit}</span>
                    </p>
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
