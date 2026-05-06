import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = (location.state as { orderId?: string } | null)?.orderId;

  // Redirect if arrived without a valid order
  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true });
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  const shortId = orderId.slice(0, 8).toUpperCase();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm">
        {/* Animated checkmark */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-bold text-[#111111]">Order Placed!</h1>
        <p className="mt-2 text-[#6b7280]">
          Your order has been successfully placed and is being processed.
        </p>

        {/* Order ID badge */}
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-2 text-sm font-medium text-[#374151]">
          <Package className="h-4 w-4" />
          Order #{shortId}
        </div>

        {/* Timeline */}
        <div className="mt-8 rounded-xl bg-[#f9fafb] p-4 text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.5px] text-[#9ca3af]">What happens next</p>
          <ul className="space-y-3 text-sm text-[#374151]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-emerald-500 text-[9px] font-bold text-white flex items-center justify-center">1</span>
              <span>The vendor will review and confirm your order within 1–2 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-[#d1d5db] text-[9px] font-bold text-white flex items-center justify-center">2</span>
              <span>For deliveries: your items will be dispatched within 1 business day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-[#d1d5db] text-[9px] font-bold text-white flex items-center justify-center">3</span>
              <span>For services: the vendor will contact you to confirm your booking time</span>
            </li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            className="w-full bg-[#111111] py-6 text-base font-semibold text-white hover:bg-black"
            onClick={() => navigate('/my-orders')}
          >
            <Package className="mr-2 h-4 w-4" />
            View My Orders
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#d1d5db] py-6 text-base"
            onClick={() => navigate('/marketplace')}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
