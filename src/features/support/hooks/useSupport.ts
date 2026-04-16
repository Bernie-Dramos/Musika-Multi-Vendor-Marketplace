import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export interface CreateSupportTicketInput {
  subject: string;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function useMySupportTicketsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['support-tickets', userId],
    queryFn: async () => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        return [];
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to load support tickets');
      }

      return data ?? [];
    },
    enabled: Boolean(userId),
  });
}

export function useCreateSupportTicketMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSupportTicketInput) => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        throw new Error('Support is unavailable without Supabase configuration.');
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userId,
          subject: payload.subject,
          category: payload.category,
          description: payload.description,
          priority: payload.priority,
        })
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to create support ticket');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets', userId] });
    },
  });
}

export function formatSupportStatus(status: string): string {
  return status
    .replace('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
