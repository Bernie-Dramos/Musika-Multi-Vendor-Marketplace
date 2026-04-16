import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export interface UpsertVendorApplicationInput {
  business_name: string;
  business_type: 'individual' | 'business' | 'non_profit';
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  business_description: string;
  category: string;
  payment_method: 'bank_transfer' | 'stripe' | 'paypal';
}

export function useVendorApplicationQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['vendor-application', userId],
    queryFn: async () => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        return null;
      }

      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('vendor_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new Error(error.message || 'Failed to load vendor application');
      }

      return data;
    },
    enabled: Boolean(userId),
  });
}

export function useUpsertVendorApplicationMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpsertVendorApplicationInput) => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        throw new Error('Vendor onboarding is unavailable without Supabase configuration.');
      }

      const now = new Date().toISOString();
      const { data: activeApplication, error: activeApplicationError } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('vendor_id', userId)
        .not('status', 'eq', 'rejected')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activeApplicationError) {
        throw new Error(activeApplicationError.message || 'Failed to load existing vendor application.');
      }

      if (activeApplication?.status === 'submitted' || activeApplication?.status === 'review') {
        throw new Error('Your vendor application is already under review.');
      }

      if (activeApplication?.status === 'approved') {
        throw new Error('Your vendor account is already approved.');
      }

      const upsertPayload = {
        ...payload,
        status: 'submitted' as const,
        submitted_at: now,
      };

      const { data, error } = activeApplication
        ? await supabase
            .from('vendor_applications')
            .update(upsertPayload)
            .eq('id', activeApplication.id)
            .select('*')
            .single()
        : await supabase
            .from('vendor_applications')
            .insert({
              vendor_id: userId,
              ...upsertPayload,
            })
            .select('*')
            .single();

      if (error) {
        throw new Error(error.message || 'Failed to submit vendor application');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-application', userId] });
    },
  });
}

export function formatVendorStatus(status: string): string {
  return status
    .replace('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
