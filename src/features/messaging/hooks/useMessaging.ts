import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProfileRow, VendorConversationRow, VendorMessageRow } from '@/lib/database.types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export interface ConversationWithParticipants extends VendorConversationRow {
  student: Pick<ProfileRow, 'id' | 'full_name' | 'email' | 'avatar_url' | 'role'> | null;
  vendor: Pick<ProfileRow, 'id' | 'full_name' | 'email' | 'avatar_url' | 'role'> | null;
}

export interface MessageWithSender extends VendorMessageRow {
  sender: Pick<ProfileRow, 'id' | 'full_name' | 'email' | 'avatar_url' | 'role'> | null;
}

export function useMessagingConversationsQuery(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !isSupabaseConfigured || !supabase) return;
    const channel = supabase
      .channel(`vendor-convs-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_conversations', filter: `student_id=eq.${userId}` }, () => {
        void queryClient.invalidateQueries({ queryKey: ['vendor-conversations', userId] });
        void queryClient.invalidateQueries({ queryKey: ['unread-message-count', userId] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_conversations', filter: `vendor_id=eq.${userId}` }, () => {
        void queryClient.invalidateQueries({ queryKey: ['vendor-conversations', userId] });
        void queryClient.invalidateQueries({ queryKey: ['unread-message-count', userId] });
      })
      .subscribe();
    return () => { void supabase!.removeChannel(channel); };
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ['vendor-conversations', userId],
    queryFn: async () => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        return [] as ConversationWithParticipants[];
      }

      const { data, error } = await supabase
        .from('vendor_conversations')
        .select(`
          *,
          student:profiles!vendor_conversations_student_id_fkey(id, full_name, email, avatar_url, role),
          vendor:profiles!vendor_conversations_vendor_id_fkey(id, full_name, email, avatar_url, role)
        `)
        .or(`student_id.eq.${userId},vendor_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to load conversations.');
      }

      return (data ?? []) as ConversationWithParticipants[];
    },
    enabled: Boolean(userId),
  });
}

export function useConversationMessagesQuery(conversationId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId || !isSupabaseConfigured || !supabase) return;
    const channel = supabase
      .channel(`vendor-msgs-${conversationId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_messages', filter: `conversation_id=eq.${conversationId}` }, () => {
        void queryClient.invalidateQueries({ queryKey: ['vendor-messages', conversationId] });
      })
      .subscribe();
    return () => { void supabase!.removeChannel(channel); };
  }, [conversationId, queryClient]);

  return useQuery({
    queryKey: ['vendor-messages', conversationId],
    queryFn: async () => {
      if (!conversationId || !isSupabaseConfigured || !supabase) {
        return [] as MessageWithSender[];
      }

      const { data, error } = await supabase
        .from('vendor_messages')
        .select(`
          *,
          sender:profiles!vendor_messages_sender_id_fkey(id, full_name, email, avatar_url, role)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message || 'Failed to load messages.');
      }

      return (data ?? []) as MessageWithSender[];
    },
    enabled: Boolean(conversationId),
  });
}

export function useAvailablePartnersQuery(userId: string | undefined, role: ProfileRow['role'] | undefined) {
  return useQuery({
    queryKey: ['available-chat-partners', userId, role],
    queryFn: async () => {
      if (!userId || !role || !isSupabaseConfigured || !supabase || role === 'admin') {
        return [] as Pick<ProfileRow, 'id' | 'full_name' | 'email' | 'avatar_url' | 'role' | 'university' | 'country'>[];
      }

      const targetRole = role === 'student' ? 'vendor' : 'student';

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, role, university, country')
        .eq('role', targetRole)
        .neq('id', userId)
        .order('full_name', { ascending: true });

      if (error) {
        throw new Error(error.message || 'Failed to load chat partners.');
      }

      return data ?? [];
    },
    enabled: Boolean(userId && role),
  });
}

interface StartConversationInput {
  partnerId: string;
  role: Extract<ProfileRow['role'], 'student' | 'vendor'>;
}

export function useStartConversationMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ partnerId, role }: StartConversationInput) => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        throw new Error('Messaging is unavailable without Supabase configuration.');
      }

      const studentId = role === 'student' ? userId : partnerId;
      const vendorId = role === 'vendor' ? userId : partnerId;

      const { data: existing, error: existingError } = await supabase
        .from('vendor_conversations')
        .select('*')
        .eq('student_id', studentId)
        .eq('vendor_id', vendorId)
        .maybeSingle();

      if (existingError) {
        throw new Error(existingError.message || 'Failed to check existing conversation.');
      }

      if (existing) {
        return existing;
      }

      const { data, error } = await supabase
        .from('vendor_conversations')
        .insert({
          student_id: studentId,
          vendor_id: vendorId,
        })
        .select('*')
        .single();

      if (error) {
        if (error.code === '42501' || /row-level security|policy/i.test(error.message)) {
          throw new Error('Only approved vendors can start new conversations right now.');
        }
        throw new Error(error.message || 'Failed to create conversation.');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-conversations', userId] });
    },
  });
}

interface SendMessageInput {
  conversationId: string;
  message: string;
  role: Extract<ProfileRow['role'], 'student' | 'vendor'>;
}

export function useSendMessageMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, message, role }: SendMessageInput) => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        throw new Error('Messaging is unavailable without Supabase configuration.');
      }

      const payload = message.trim();
      if (!payload) {
        throw new Error('Message cannot be empty.');
      }

      const { data, error } = await supabase
        .from('vendor_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          sender_role: role,
          message: payload,
        })
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to send message.');
      }

      return data;
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['vendor-messages', message.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ['vendor-conversations', userId] });
    },
  });
}

interface MarkConversationReadInput {
  conversationId: string;
  role: Extract<ProfileRow['role'], 'student' | 'vendor'>;
}

export function useMarkConversationReadMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, role }: MarkConversationReadInput) => {
      if (!userId || !isSupabaseConfigured || !supabase) {
        return;
      }

      const nowIso = new Date().toISOString();

      const { error: readError } = await supabase
        .from('vendor_messages')
        .update({ read_at: nowIso })
        .eq('conversation_id', conversationId)
        .is('read_at', null)
        .neq('sender_id', userId);

      if (readError) {
        throw new Error(readError.message || 'Failed to mark messages as read.');
      }

      const updatePayload = role === 'student'
        ? { student_unread_count: 0 }
        : { vendor_unread_count: 0 };

      const { error: conversationError } = await supabase
        .from('vendor_conversations')
        .update(updatePayload)
        .eq('id', conversationId);

      if (conversationError) {
        throw new Error(conversationError.message || 'Failed to update unread count.');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendor-messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['vendor-conversations', userId] });
    },
  });
}

export function useAdminConversationOverviewQuery(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !isSupabaseConfigured || !supabase) return;
    const channel = supabase
      .channel('admin-vendor-convs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_conversations' }, () => {
        void queryClient.invalidateQueries({ queryKey: ['admin-vendor-conversations'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_messages' }, () => {
        void queryClient.invalidateQueries({ queryKey: ['admin-vendor-conversations'] });
      })
      .subscribe();
    return () => { void supabase!.removeChannel(channel); };
  }, [enabled, queryClient]);

  return useQuery({
    queryKey: ['admin-vendor-conversations'],
    queryFn: async () => {
      if (!enabled || !isSupabaseConfigured || !supabase) {
        return [] as ConversationWithParticipants[];
      }

      const { data, error } = await supabase
        .from('vendor_conversations')
        .select(`
          *,
          student:profiles!vendor_conversations_student_id_fkey(id, full_name, email, avatar_url, role),
          vendor:profiles!vendor_conversations_vendor_id_fkey(id, full_name, email, avatar_url, role)
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to load admin conversation overview.');
      }

      return (data ?? []) as ConversationWithParticipants[];
    },
    enabled,
  });
}

export function useUnreadMessageCountQuery(
  userId: string | undefined,
  role: ProfileRow['role'] | undefined,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !role || !isSupabaseConfigured || !supabase || role === 'admin') return;
    const channel = supabase
      .channel(`unread-count-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_conversations', filter: `student_id=eq.${userId}` }, () => {
        void queryClient.invalidateQueries({ queryKey: ['unread-message-count', userId] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_conversations', filter: `vendor_id=eq.${userId}` }, () => {
        void queryClient.invalidateQueries({ queryKey: ['unread-message-count', userId] });
      })
      .subscribe();
    return () => { void supabase!.removeChannel(channel); };
  }, [userId, role, queryClient]);

  return useQuery({
    queryKey: ['unread-message-count', userId],
    queryFn: async () => {
      if (!userId || !role || !isSupabaseConfigured || !supabase || role === 'admin') {
        return 0;
      }

      const unreadField = role === 'student' ? 'student_unread_count' : 'vendor_unread_count';
      const filterField = role === 'student' ? 'student_id' : 'vendor_id';

      const { data, error } = await supabase
        .from('vendor_conversations')
        .select(unreadField)
        .eq(filterField, userId)
        .gt(unreadField, 0);

      if (error) return 0;

      return (data ?? []).reduce(
        (sum: number, row: Record<string, unknown>) => sum + ((row[unreadField] as number) ?? 0),
        0,
      );
    },
    enabled: Boolean(userId && role && role !== 'admin'),
    staleTime: 30_000,
  });
}
