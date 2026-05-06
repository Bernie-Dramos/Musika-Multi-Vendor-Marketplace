import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageCircle, SendHorizontal } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useAvailablePartnersQuery,
  useConversationMessagesQuery,
  useMarkConversationReadMutation,
  useMessagingConversationsQuery,
  useSendMessageMutation,
  useStartConversationMutation,
  type ConversationWithParticipants,
} from '@/features/messaging/hooks/useMessaging';
import { PageContentCard, PageHeroHeader, PageSectionContainer } from '@/components/PageScaffold';
import { PageEmptyState, PageErrorState, PageLoadingState } from '@/components/QueryStates';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function toDisplayName(name: string | null | undefined, fallback: string) {
  return name?.trim() || fallback;
}

function formatMessageTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getOtherParticipant(conversation: ConversationWithParticipants, userId: string) {
  return conversation.student_id === userId ? conversation.vendor : conversation.student;
}

export function MessagesInbox() {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const conversationsQuery = useMessagingConversationsQuery(user?.id);
  const conversations = conversationsQuery.data ?? [];

  const messagesQuery = useConversationMessagesQuery(selectedConversationId ?? undefined);
  const messages = messagesQuery.data ?? [];

  const partnersQuery = useAvailablePartnersQuery(user?.id, profile?.role);
  const partners = partnersQuery.data ?? [];

  const startConversationMutation = useStartConversationMutation(user?.id);
  const sendMessageMutation = useSendMessageMutation(user?.id);
  const markReadMutation = useMarkConversationReadMutation(user?.id);
  const messagingRole = profile?.role === 'student' || profile?.role === 'vendor' ? profile.role : null;

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const vendorHint = searchParams.get('vendor');
  useEffect(() => {
    if (!vendorHint || !partners.length || !profile || profile.role !== 'student') {
      return;
    }

    const match = partners.find((partner) => {
      const candidate = `${partner.full_name ?? ''} ${partner.email ?? ''}`.toLowerCase();
      return candidate.includes(vendorHint.toLowerCase());
    });

    if (match) {
      setSelectedPartnerId(match.id);
    }
  }, [partners, profile, vendorHint]);

  useEffect(() => {
    if (!selectedConversationId || !messagingRole) {
      return;
    }

    void markReadMutation.mutateAsync({
      conversationId: selectedConversationId,
      role: messagingRole,
    }).catch(() => undefined);
  }, [selectedConversationId, messagingRole, markReadMutation]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const unreadTotal = useMemo(() => {
    if (!profile || (profile.role !== 'student' && profile.role !== 'vendor')) {
      return 0;
    }

    return conversations.reduce((total, conversation) => {
      const currentUnread = profile.role === 'student'
        ? conversation.student_unread_count
        : conversation.vendor_unread_count;
      return total + currentUnread;
    }, 0);
  }, [conversations, profile]);

  if (profile?.role === 'admin') {
    return (
      <PageSectionContainer>
        <PageHeroHeader
          title="Messaging Inbox"
          description="Admin users can review all messaging activity from the dedicated oversight view."
        />
        <PageEmptyState
          title="Admin inbox is read-only"
          description="Use the admin messaging overview to inspect all student-vendor conversations."
          action={
            <Link to="/admin-messages">
              <Button className="bg-[#0F172A] text-white hover:bg-[#1E293B]">Open Admin Messaging Overview</Button>
            </Link>
          }
        />
      </PageSectionContainer>
    );
  }

  const isMessagingRole = Boolean(messagingRole);

  const startConversation = async () => {
    if (!messagingRole || !selectedPartnerId) {
      return;
    }

    setStatusMessage(null);
    try {
      const conversation = await startConversationMutation.mutateAsync({
        partnerId: selectedPartnerId,
        role: messagingRole,
      });
      setSelectedConversationId(conversation.id);
      setSelectedPartnerId('');
      setStatusMessage('Conversation is ready. You can send your first message now.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to start conversation.');
    }
  };

  const sendMessage = async () => {
    if (!messagingRole || !selectedConversationId || !draftMessage.trim()) {
      return;
    }

    setStatusMessage(null);
    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedConversationId,
        message: draftMessage,
        role: messagingRole,
      });
      setDraftMessage('');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to send message.');
    }
  };

  return (
    <PageSectionContainer>
      <PageHeroHeader
        title={profile?.role === 'vendor' ? 'Vendor Message Inbox' : 'Student Message Inbox'}
        description="Chat directly with verified vendors and students in one organized inbox."
        action={
          <Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white" onClick={() => conversationsQuery.refetch()}>
            Refresh Inbox
          </Button>
        }
      />

      {statusMessage ? (
        <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {statusMessage}
        </div>
      ) : null}

      {conversationsQuery.isLoading ? <PageLoadingState title="Loading your inbox" /> : null}

      {conversationsQuery.isError ? (
        <PageErrorState
          title="Unable to load inbox"
          description="Please refresh to continue messaging."
          onRetry={() => conversationsQuery.refetch()}
        />
      ) : null}

      {!conversationsQuery.isLoading && !conversationsQuery.isError ? (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <PageContentCard className="space-y-4">
            <div className="rounded-xl bg-[#0F172A] p-4 text-white">
              <p className="text-sm text-slate-300">Unread messages</p>
              <p className="mt-1 text-3xl font-bold">{unreadTotal}</p>
              <p className="mt-1 text-xs text-slate-400">
                {profile?.role === 'vendor'
                  ? 'Your vendor inbox across all student conversations.'
                  : 'Your student inbox across all vendor conversations.'}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="partner" className="text-sm font-medium text-[#0F172A]">
                Start new chat
              </label>
              <select
                id="partner"
                value={selectedPartnerId}
                onChange={(event) => setSelectedPartnerId(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
              >
                <option value="">Select a {profile?.role === 'vendor' ? 'student' : 'vendor'}</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {toDisplayName(partner.full_name, partner.email)}
                  </option>
                ))}
              </select>
              <Button
                className="w-full bg-[#0F172A] text-white hover:bg-[#1E293B]"
                disabled={!selectedPartnerId || startConversationMutation.isPending || partnersQuery.isLoading}
                onClick={() => {
                  void startConversation();
                }}
              >
                {startConversationMutation.isPending ? 'Starting...' : 'Start Conversation'}
              </Button>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-[#0F172A]">Conversations</h2>
              {conversations.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
                  No conversations yet. Start your first chat above.
                </p>
              ) : (
                conversations.map((conversation) => {
                  const other = user ? getOtherParticipant(conversation, user.id) : null;
                  const unreadCount = profile?.role === 'student'
                    ? conversation.student_unread_count
                    : conversation.vendor_unread_count;

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        conversation.id === selectedConversationId
                          ? 'border-[#0F172A] bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-[#0F172A]">
                          {toDisplayName(other?.full_name, other?.email ?? 'Unknown user')}
                        </p>
                        {unreadCount > 0 ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            {unreadCount}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {conversation.last_message_preview ?? 'No messages yet'}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </PageContentCard>

          <PageContentCard className="flex min-h-[560px] flex-col">
            {!selectedConversation ? (
              <PageEmptyState
                title="Pick a conversation"
                description="Select an inbox thread to read messages and reply."
              />
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-lg font-semibold text-[#0F172A]">
                      {user
                        ? toDisplayName(getOtherParticipant(selectedConversation, user.id)?.full_name, getOtherParticipant(selectedConversation, user.id)?.email ?? 'Conversation')
                        : 'Conversation'}
                    </p>
                    <p className="text-xs text-slate-500">{selectedConversation.last_message_at ? `Last activity ${formatMessageTime(selectedConversation.last_message_at)}` : 'No activity yet'}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Active thread
                  </span>
                </div>

                <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
                  {messagesQuery.isLoading ? <PageLoadingState title="Loading messages" /> : null}

                  {messagesQuery.isError ? (
                    <PageErrorState
                      title="Unable to load messages"
                      description="Try refreshing this conversation."
                      onRetry={() => messagesQuery.refetch()}
                    />
                  ) : null}

                  {!messagesQuery.isLoading && !messagesQuery.isError && messages.length === 0 ? (
                    <PageEmptyState
                      title="No messages yet"
                      description="Send the first message to begin this conversation."
                    />
                  ) : null}

                  {!messagesQuery.isLoading && !messagesQuery.isError && messages.length > 0
                    ? messages.map((message) => {
                      const mine = message.sender_id === user?.id;
                      return (
                        <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${mine ? 'bg-[#0F172A] text-white' : 'bg-white text-[#0F172A] border border-slate-200'}`}>
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                            <p className={`mt-1 text-[11px] ${mine ? 'text-slate-300' : 'text-slate-500'}`}>
                              {toDisplayName(message.sender?.full_name, message.sender?.email ?? 'User')} • {formatMessageTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                    : null}
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <Textarea
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    placeholder="Write your message..."
                    className="min-h-20 resize-y bg-white"
                  />
                  <Button
                    className="h-11 bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => {
                      void sendMessage();
                    }}
                    disabled={!draftMessage.trim() || sendMessageMutation.isPending}
                  >
                    <SendHorizontal className="mr-1.5 h-4 w-4" />
                    {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </>
            )}
          </PageContentCard>
        </div>
      ) : null}
    </PageSectionContainer>
  );
}
