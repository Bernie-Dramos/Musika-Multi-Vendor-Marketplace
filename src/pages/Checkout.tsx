import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/features/auth/context/AuthContext';
import { placeOrder, type DeliveryAddress, type BookingDetails, type OrderItem } from '@/lib/orders';

const COUNTRIES = [
  'South Africa', 'Zimbabwe', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia',
  'Tanzania', 'Uganda', 'Zambia', 'Botswana', 'Mozambique', 'Namibia',
  'India', 'United Kingdom', 'United States', 'Other',
];

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (8 AM – 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM – 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM – 9 PM)' },
];

const PRODUCT_SHIPPING = 49;

export function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const hasProducts = items.some((i) => !i.type || i.type === 'product');
  const hasServices = items.some((i) => i.type === 'service');
  const shipping = hasProducts ? PRODUCT_SHIPPING : 0;
  const total = totalPrice + shipping;

  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    postcode: '',
    country: 'South Africa',
  });

  const [booking, setBooking] = useState<BookingDetails>({
    date: '',
    timeSlot: 'morning',
    notes: '',
  });

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/marketplace', { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/signin', { state: { from: '/checkout' } });
      return;
    }

    setPlacing(true);
    setError(null);

    try {
      const orderItems: OrderItem[] = items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        currency: i.currency,
        image: i.image,
        vendor: i.vendor,
        category: i.category,
        quantity: i.quantity,
        type: i.type ?? 'product',
      }));

      const orderId = await placeOrder(
        user.id,
        orderItems,
        totalPrice,
        shipping,
        hasProducts ? address : undefined,
        hasServices ? booking : undefined,
      );

      clearCart();
      navigate('/order-confirmation', { state: { orderId } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111111]">Checkout</h1>
          <nav className="mt-1 flex items-center gap-1.5 text-sm text-[#9ca3af]">
            <span className="cursor-pointer hover:text-[#111111]" onClick={() => navigate('/marketplace')}>Marketplace</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#374151]">Checkout</span>
          </nav>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left — Forms */}
          <div className="space-y-6">
            {/* Delivery Address */}
            {hasProducts && (
              <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
                <div className="mb-5 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#111111]" />
                  <h2 className="text-lg font-semibold text-[#111111]">Delivery Address</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Full Name</label>
                    <input
                      required
                      title="Full Name"
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm outline-none focus:border-[#111111]"
                      value={address.fullName}
                      onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Phone Number</label>
                    <input
                      required
                      title="Phone Number"
                      placeholder="+27 000 000 0000"
                      type="tel"
                      className="w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm outline-none focus:border-[#111111]"
                      value={address.phone}
                      onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Address</label>
                    <input
                      required
                      title="Street Address"
                      placeholder="Street address, apartment, suite, etc."
                      className="w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm outline-none focus:border-[#111111]"
                      value={address.addressLine1}
                      onChange={(e) => setAddress((a) => ({ ...a, addressLine1: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">City</label>
                    <input
                      required
                      title="City"
                      placeholder="City"
                      className="w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm outline-none focus:border-[#111111]"
                      value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Postcode</label>
                    <input
                      required
                      title="Postcode"
                      placeholder="0000"
                      className="w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm outline-none focus:border-[#111111]"
                      value={address.postcode}
                      onChange={(e) => setAddress((a) => ({ ...a, postcode: e.target.value }))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Country</label>
                    <select
                      required
                      title="Country"
                      className="w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm outline-none focus:border-[#111111]"
                      value={address.country}
                      onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* Booking Details */}
            {hasServices && (
              <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
                <div className="mb-5 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#111111]" />
                  <h2 className="text-lg font-semibold text-[#111111]">Booking Details</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Preferred Date</label>
                    <input
                      required
                      type="date"
                      title="Preferred Date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm outline-none focus:border-[#111111]"
                      value={booking.date}
                      onChange={(e) => setBooking((b) => ({ ...b, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Preferred Time</label>
                    <select
                      title="Preferred Time Slot"
                      className="w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm outline-none focus:border-[#111111]"
                      value={booking.timeSlot}
                      onChange={(e) => setBooking((b) => ({ ...b, timeSlot: e.target.value }))}
                    >
                      {TIME_SLOTS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-[#374151]">Special Notes <span className="text-[#9ca3af]">(optional)</span></label>
                    <textarea
                      rows={3}
                      title="Special Notes"
                      placeholder="Any special requests or information for the vendor..."
                      className="w-full rounded-lg border border-[#d1d5db] px-3 py-2.5 text-sm outline-none focus:border-[#111111] resize-none"
                      value={booking.notes}
                      onChange={(e) => setBooking((b) => ({ ...b, notes: e.target.value }))}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Payment Notice */}
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
              <h2 className="mb-3 text-lg font-semibold text-[#111111]">Payment</h2>
              <div className="flex items-center gap-3 rounded-xl bg-[#f3f4f6] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111]">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111111]">Cash on Delivery / Pay on Arrival</p>
                  <p className="text-xs text-[#6b7280]">Payment is collected at delivery or service appointment</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right — Order Summary */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-[#e5e7eb] bg-white p-6">
              <h2 className="mb-5 text-lg font-semibold text-[#111111]">Order Summary</h2>

              {/* Items */}
              <ul className="mb-5 space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-[#f3f4f6]">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium text-[#111111]">{item.name}</p>
                      <p className="text-xs text-[#9ca3af]">
                        {item.type === 'service' ? 'Service' : 'Product'} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="flex-shrink-0 text-sm font-semibold text-[#111111]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="border-t border-[#f3f4f6] pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Subtotal</span>
                  <span className="font-medium text-[#111111]">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Shipping</span>
                  <span className={shipping === 0 ? 'font-medium text-emerald-600' : 'font-medium text-[#111111]'}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#f3f4f6] pt-3 text-base">
                  <span className="font-bold text-[#111111]">Total</span>
                  <span className="font-bold text-[#111111]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={placing}
                className="mt-6 w-full bg-[#111111] py-6 text-base font-semibold text-white hover:bg-black disabled:opacity-60"
              >
                {placing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order…
                  </span>
                ) : (
                  `Place Order · ₹${total.toLocaleString()}`
                )}
              </Button>

              <p className="mt-3 text-center text-[10px] text-[#9ca3af]">
                By placing your order you agree to our Terms of Service
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
