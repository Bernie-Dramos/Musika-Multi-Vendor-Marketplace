import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, Package, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/components/musika/ui-primitives';
import { getVendorAvatarUrl, getVendorBySlug } from '@/lib/data';

export function VendorDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const vendor = useMemo(() => getVendorBySlug(name ?? ''), [name]);

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

  const avgServicePrice = vendor.services.length > 0
    ? vendor.services.reduce((sum, item) => sum + item.price, 0) / vendor.services.length
    : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <nav className="mt-1 text-xs text-[#9ca3af]">
          <span className="cursor-pointer hover:text-[#111111]" onClick={() => navigate('/services')}>
            Services
          </span>
          {' › '}
          <span className="text-[#374151]">{vendor.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl bg-[#f3f4f6]">
              <img
                src={vendor.image}
                alt={vendor.name}
                className="h-[300px] w-full object-cover sm:h-[420px]"
              />
            </div>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <h2 className="text-lg font-bold text-[#111111]">Services by {vendor.name}</h2>
              {vendor.services.length === 0 ? (
                <p className="mt-3 text-sm text-[#6b7280]">No services listed yet.</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {vendor.services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => navigate(`/service/${service.id}`)}
                      className="rounded-xl border border-[#e5e7eb] bg-white p-4 text-left transition-colors hover:border-[#111111]"
                    >
                      <p className="text-sm font-semibold text-[#111111]">{service.title}</p>
                      <p className="mt-1 text-xs text-[#6b7280]">{service.category}</p>
                      <p className="mt-2 text-sm font-bold text-[#111111]">
                        {formatINR(service.price)}
                        <span className="text-xs font-normal text-[#6b7280]">/{service.priceUnit}</span>
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <h2 className="text-lg font-bold text-[#111111]">Products by {vendor.name}</h2>
              {vendor.products.length === 0 ? (
                <p className="mt-3 text-sm text-[#6b7280]">No products listed yet.</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {vendor.products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="rounded-xl border border-[#e5e7eb] bg-white p-4 text-left transition-colors hover:border-[#111111]"
                    >
                      <p className="text-sm font-semibold text-[#111111]">{product.name}</p>
                      <p className="mt-1 text-xs text-[#6b7280]">{product.subcategory ?? 'Marketplace'}</p>
                      <p className="mt-2 text-sm font-bold text-[#111111]">{formatINR(product.price)}</p>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="rounded-2xl bg-[#111111] p-6 text-white lg:sticky lg:top-6 lg:self-start">
            <div className="mb-3 flex items-center gap-3">
              <img
                src={getVendorAvatarUrl(vendor.name)}
                alt={vendor.name}
                className="h-10 w-10 rounded-full bg-[#374151] object-cover"
              />
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-base font-semibold">{vendor.name}</p>
                  <BadgeCheck className="h-4 w-4 text-[#60a5fa]" />
                </div>
                <p className="text-xs text-[#9ca3af]">Verified Marketplace Vendor</p>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-1.5 text-sm">
              <Star className="h-4 w-4 fill-[#f5a623] text-[#f5a623]" />
              <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
              <span className="text-[#9ca3af]">({vendor.reviews} reviews)</span>
            </div>

            <div className="grid gap-2 rounded-xl bg-[#1a1f2e] p-3 text-sm">
              <p className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-[#9ca3af]" />
                Services: {vendor.servicesCount}
              </p>
              <p className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#9ca3af]" />
                Products: {vendor.productsCount}
              </p>
              {avgServicePrice ? (
                <p className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#9ca3af]" />
                  Avg service price: {formatINR(Math.round(avgServicePrice))}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {vendor.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-[#252d3d] px-2.5 py-0.5 text-[10px] text-[#d1d5db]"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              <Button
                onClick={() => navigate('/services')}
                className="h-11 w-full rounded-xl bg-white font-semibold text-[#111111] hover:bg-[#f3f4f6]"
              >
                Browse Services
              </Button>
              <Button
                onClick={() => navigate('/marketplace')}
                variant="outline"
                className="h-11 w-full rounded-xl border-[#374151] bg-transparent text-white hover:bg-[#1a1f2e]"
              >
                Browse Products
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
