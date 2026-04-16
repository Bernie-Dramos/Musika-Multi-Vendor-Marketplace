import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export interface EditableProfile {
  full_name: string | null;
  university: string | null;
  country: string | null;
}

export function useProfileQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message || 'Failed to load profile');
      }

      return data;
    },
    enabled: Boolean(userId),
  });
}

export function useUpdateProfileMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EditableProfile) => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        throw new Error('Profile updates are unavailable without Supabase configuration.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update profile');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}
