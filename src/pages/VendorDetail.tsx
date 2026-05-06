import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/components/musika/ui-primitives';
import { getVendorAvatarUrl, getVendorBySlug } from '@/lib/data';

const mockReviews = [
  {
    id: 1,
    name: 'Mei Ling',
    university: 'University of London',
    seed: 'MeiLing',
    stars: 4,
    text: '"Great service, helped me set up my room! The laptop stand is high quality and the vendor gave some tips on the best local tech shops. Highly recommend for any new international student."',
  },
  {
    id: 2,
    name: 'David Okoro',
    university: 'Manchester Metropolitan',
    seed: 'DavidOkoro',
    stars: 4,
    text: '"The noise cancelling headphones were a lifesaver for studying in the busy library. Delivery was super fast and very helpful with my questions about warranty. Solid 4.5/5!"',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    university: 'Delhi University',
    seed: 'PriyaSharma',
    stars: 5,
    text: '"Excellent vendor! Product arrived well-packaged and exactly as described. Will definitely order again."',
  },
  {
    id: 4,
    name: 'Carlos Mendes',
    university: 'Pune University',
    seed: 'CarlosMendes',
    stars: 4,
    text: '"Very responsive, answered all my questions promptly. Quality is great and price is fair compared to other vendors on the platform."',
  },
];

export function VendorDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const vendor = useMemo(() => getVendorBySlug(name ?? ''), [name]);

  const allItems = useMemo(() => {
    if (!vendor) return [];
    const svcItems = vendor.services.map((s) => ({
      id: `svc-${s.id}`,
      title: s.title,
      description: s.description,
      price: s.price,
      image: (s as { image?: string }).image ?? 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
      path: `/service/${s.id}`,
    }));
    const prodItems = vendor.products.map((p) => ({
      id: `prd-${p.id}`,
      title: (p as { name?: string }).name ?? (p as { title?: string }).title ?? '',
      description: p.description,
      price: p.price,
      image: (p as { image?: string }).image ?? 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
      path: `/product/${p.id}`,
    }));
    return [...svcItems, ...prodItems];
  }, [vendor]);

  if (!vendor) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-2xl font-bold text-[#111111]">Vendor not found</p>
        <p className="text-[#6b7280]">The vendor page you are looking for does not exist.</p>
        <Button onClick={() => navigate('/services')} className="bg-[#111111] text-white hover:bg-black">
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Top bar */}
      <div className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-bold text-[#111111]">Vendor Profile</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
              <input
                placeholder="Search services..."
                className="h-9 w-52 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] pl-9 pr-4 text-sm text-[#111111] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                readOnly
              />
            </div>
            <button className="rounded-full p-2 text-[#374151] hover:bg-[#f3f4f6]" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {/* Vendor hero card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="relative shrink-0">
                <img
                  src={getVendorAvatarUrl(vendor.name)}
                  alt={vendor.name}
                  className="h-28 w-28 rounded-full border-4 border-white bg-[#f3f4f6] object-cover shadow-md"
                />
                <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold italic text-[#111111]">{vendor.name}</h2>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    ⭐ {vendor.rating.toFixed(1)}/5 Rating
                  </span>
                </div>
                <p className="mt-2 max-w-prose text-sm text-[#6b7280]">
                  Specializing in essential {vendor.categories.slice(0, 2).join(' and ').toLowerCase()} services tailored for
                  international students. Providing student-verified quality with localized support and fast campus-wide delivery.
                </p>
                <Button
                  onClick={() => navigate(`/messages?vendor=${encodeURIComponent(vendor.name)}`)}
                  variant="outline"
                  className="mt-4 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Vendor in Inbox
                </Button>
              </div>
            </div>
          </div>

          {/* Vendor Services */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#111111]">Vendor Services</h3>
              <span className="text-sm text-[#6b7280]">Showing {allItems.length} results</span>
            </div>
            {allItems.length === 0 ? (
              <p className="text-sm text-[#6b7280]">No listings yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {allItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white text-left transition-all hover:border-[#111111] hover:shadow-sm"
                  >
                    <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                          ACTIVE
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-[#6b7280]">{item.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm font-bold text-[#111111]">{formatINR(item.price)}</p>
                        <span className="rounded-full p-1.5 text-[#6b7280]">
                          <ShoppingCart className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

        {/* Student Reviews */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#111111]">Student Reviews</h3>
              <button className="flex items-center gap-1 text-sm font-medium text-[#111111] hover:underline">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {mockReviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-[#e5e7eb] p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${review.seed}`}
                      alt={review.name}
                      className="h-10 w-10 rounded-full bg-[#f3f4f6]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{review.name}</p>
                      <p className="text-xs text-[#9ca3af]">{review.university}</p>
                    </div>
                    <div className="ml-auto flex text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.stars ? 'text-[#f5a623]' : 'text-[#e5e7eb]'}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[#6b7280]">{review.text}</p>
                </div>
              ))}
            </div>
        </section>
      </div>
    </div>
  );
}
