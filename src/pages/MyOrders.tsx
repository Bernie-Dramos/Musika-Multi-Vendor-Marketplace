import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingBag, ChevronDown, ChevronUp, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchMyOrders, type PlacedOrder } from '@/lib/orders';

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-red-100 text-red-700',
};

function OrderCard({ order }: { order: PlacedOrder }) {
  const [expanded, setExpanded] = useState(false);
  const items = order.items ?? [];
  const shortId = order.id.slice(0, 8).toUpperCase();
  const date = new Date(order.created_at).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const statusStyle = STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white overflow-hidden">
      {/* Card header */}
      <button
        title={`Toggle order ${shortId} details`}
        className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-[#f9fafb] transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#f3f4f6]">
            <Package className="h-5 w-5 text-[#374151]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111111]">Order #{shortId}</p>
            <p className="text-xs text-[#9ca3af]">{date} · {items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyle}`}>
            {order.status}
          </span>
          <p className="text-sm font-bold text-[#111111] hidden sm:block">
            ₹{(Number(order.subtotal) + Number(order.shipping)).toLocaleString()}
          </p>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#f3f4f6] px-5 pb-5 pt-4 space-y-5">
          {/* Items list */}
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#f3f4f6]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-[#111111]">{item.name}</p>
                  <p className="text-xs text-[#9ca3af]">
                    {item.type === 'service' ? 'Service' : 'Product'} · Qty {item.quantity} · {item.vendor}
                  </p>
                </div>
                <p className="flex-shrink-0 text-sm font-semibold text-[#111111]">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="rounded-xl bg-[#f9fafb] p-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Subtotal</span>
              <span className="font-medium">₹{Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Shipping</span>
              <span className={Number(order.shipping) === 0 ? 'font-medium text-emerald-600' : 'font-medium'}>
                {Number(order.shipping) === 0 ? 'Free' : `₹${Number(order.shipping)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#e5e7eb] pt-2 text-base font-bold text-[#111111]">
              <span>Total</span>
              <span>₹{(Number(order.subtotal) + Number(order.shipping)).toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery Address */}
          {order.delivery_address && (
            <div className="rounded-xl border border-[#e5e7eb] p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#374151]" />
                <p className="text-xs font-semibold uppercase tracking-[0.5px] text-[#9ca3af]">Delivery Address</p>
              </div>
              <p className="text-sm text-[#374151]">{order.delivery_address.fullName}</p>
              <p className="text-sm text-[#6b7280]">{order.delivery_address.addressLine1}</p>
              <p className="text-sm text-[#6b7280]">
                {order.delivery_address.city}, {order.delivery_address.postcode}
              </p>
              <p className="text-sm text-[#6b7280]">{order.delivery_address.country}</p>
              <p className="mt-1 text-sm text-[#6b7280]">{order.delivery_address.phone}</p>
            </div>
          )}

          {/* Booking Details */}
          {order.booking_details && (
            <div className="rounded-xl border border-[#e5e7eb] p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#374151]" />
                <p className="text-xs font-semibold uppercase tracking-[0.5px] text-[#9ca3af]">Booking Details</p>
              </div>
              <p className="text-sm text-[#374151]">
                Date: {new Date(order.booking_details.date).toLocaleDateString('en-ZA', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
              <p className="text-sm text-[#6b7280] capitalize">Time: {order.booking_details.timeSlot}</p>
              {order.booking_details.notes && (
                <p className="mt-1 text-sm text-[#6b7280]">Notes: {order.booking_details.notes}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MyOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['myOrders', user?.id],
    queryFn: () => fetchMyOrders(user!.id),
    enabled: Boolean(user?.id),
    staleTime: 30_000,
  });

  const orders = data?.data ?? [];

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111111]">My Orders</h1>
            <p className="mt-1 text-sm text-[#6b7280]">Track and review your past purchases</p>
          </div>
          <Button
            variant="outline"
            className="hidden border-[#d1d5db] sm:flex"
            onClick={() => navigate('/marketplace')}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Shop More
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 animate-pulse rounded-2xl bg-[#e5e7eb]" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load orders. Please refresh the page.
          </div>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f3f4f6]">
              <Package className="h-10 w-10 text-[#9ca3af]" />
            </div>
            <h2 className="text-xl font-semibold text-[#111111]">No orders yet</h2>
            <p className="mt-2 text-sm text-[#6b7280]">Browse the marketplace and place your first order.</p>
            <Button
              className="mt-6 bg-[#111111] text-white hover:bg-black"
              onClick={() => navigate('/marketplace')}
            >
              Browse Marketplace
            </Button>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
