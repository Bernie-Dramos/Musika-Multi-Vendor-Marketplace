import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  currency: string;
  image: string;
  vendor: string;
  category: string;
  quantity: number;
  type: 'product' | 'service';
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  postcode: string;
  country: string;
}

export interface BookingDetails {
  date: string;       // ISO date string YYYY-MM-DD
  timeSlot: string;   // 'morning' | 'afternoon' | 'evening'
  notes: string;
}

export interface PlacedOrder {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  delivery_address: DeliveryAddress | null;
  booking_details: BookingDetails | null;
  created_at: string;
  updated_at: string;
}

export async function placeOrder(
  userId: string,
  items: OrderItem[],
  subtotal: number,
  shipping: number,
  deliveryAddress?: DeliveryAddress,
  bookingDetails?: BookingDetails,
): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      items: items as unknown as Record<string, unknown>[],
      subtotal,
      shipping,
      delivery_address: deliveryAddress ?? null,
      booking_details: bookingDetails ?? null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function fetchMyOrders(
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<{ data: PlacedOrder[]; count: number }> {
  if (!isSupabaseConfigured || !supabase) return { data: [], count: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: (data ?? []) as PlacedOrder[], count: count ?? 0 };
}

export async function fetchOrderById(id: string): Promise<PlacedOrder | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as PlacedOrder;
}
