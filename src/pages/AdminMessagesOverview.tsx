import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useAdminConversationOverviewQuery,
  useConversationMessagesQuery,
  type ConversationWithParticipants,
} from '@/features/messaging/hooks/useMessaging';
import { PageContentCard, PageHeroHeader, PageSectionContainer } from '@/components/PageScaffold';
import { PageEmptyState, PageErrorState, PageLoadingState } from '@/components/QueryStates';
import { Button } from '@/components/ui/button';

function formatMessageTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function displayName(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export function AdminMessagesOverview() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const conversationsQuery = useAdminConversationOverviewQuery(isAdmin);
  const conversations = conversationsQuery.data ?? [];

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const selectedConversation = useMemo<ConversationWithParticipants | null>(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const messagesQuery = useConversationMessagesQuery(selectedConversationId ?? undefined);
  const messages = messagesQuery.data ?? [];

  if (!isAdmin) {
    return (
      <PageSectionContainer>
        <PageHeroHeader
          title="Messaging Oversight"
          description="This area is available to administrators only."
        />
        <PageEmptyState
          title="Administrator access required"
          description="Sign in with an admin account to view conversation oversight."
        />
      </PageSectionContainer>
    );
  }

  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="Admin Messaging Oversight"
        description="Read-only visibility into all student and vendor conversations."
        action={
          <Button className="bg-[#0F172A] text-white hover:bg-[#1E293B]" onClick={() => conversationsQuery.refetch()}>
            Refresh Overview
          </Button>
        }
      />

      {conversationsQuery.isLoading ? <PageLoadingState title="Loading conversation overview" /> : null}

      {conversationsQuery.isError ? (
        <PageErrorState
          title="Unable to load conversation overview"
          description="Please retry in a few moments."
          onRetry={() => conversationsQuery.refetch()}
        />
      ) : null}

      {!conversationsQuery.isLoading && !conversationsQuery.isError ? (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <PageContentCard className="space-y-3">
            <div className="rounded-xl bg-[#0F172A] p-4 text-white">
              <p className="text-sm text-slate-300">Total active conversations</p>
              <p className="mt-1 text-3xl font-bold">{conversations.length}</p>
              <p className="mt-1 text-xs text-slate-400">Oversight access without message intervention.</p>
            </div>

            {conversations.length === 0 ? (
              <PageEmptyState
                title="No conversations yet"
                description="Conversations will appear here once students and vendors start messaging."
              />
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    conversation.id === selectedConversationId
                      ? 'border-[#0F172A] bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {displayName(conversation.student?.full_name, conversation.student?.email ?? 'Student')} • {displayName(conversation.vendor?.full_name, conversation.vendor?.email ?? 'Vendor')}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{conversation.last_message_preview ?? 'No messages yet'}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {conversation.last_message_at ? formatMessageTime(conversation.last_message_at) : 'No activity'}
                  </p>
                </button>
              ))
            )}
          </PageContentCard>

          <PageContentCard className="flex min-h-[560px] flex-col">
            {!selectedConversation ? (
              <PageEmptyState
                title="Select a conversation"
                description="Pick a conversation from the overview list to inspect its messages."
              />
            ) : (
              <>
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-lg font-semibold text-[#0F172A]">
                      {displayName(selectedConversation.student?.full_name, selectedConversation.student?.email ?? 'Student')} → {displayName(selectedConversation.vendor?.full_name, selectedConversation.vendor?.email ?? 'Vendor')}
                    </p>
                    <p className="text-xs text-slate-500">Read-only moderation view</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin visibility
                  </span>
                </div>

                <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
                  {messagesQuery.isLoading ? <PageLoadingState title="Loading message stream" /> : null}

                  {messagesQuery.isError ? (
                    <PageErrorState
                      title="Unable to load messages"
                      description="Refresh to retry this conversation view."
                      onRetry={() => messagesQuery.refetch()}
                    />
                  ) : null}

                  {!messagesQuery.isLoading && !messagesQuery.isError && messages.length === 0 ? (
                    <PageEmptyState
                      title="No messages in this conversation"
                      description="Messages will appear here once either participant sends one."
                    />
                  ) : null}

                  {!messagesQuery.isLoading && !messagesQuery.isError && messages.length > 0
                    ? messages.map((message) => (
                      <div key={message.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                          <span>
                            {displayName(message.sender?.full_name, message.sender?.email ?? 'Unknown user')} • {message.sender_role}
                          </span>
                          <span>{formatMessageTime(message.created_at)}</span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-[#0F172A]">{message.message}</p>
                      </div>
                    ))
                    : null}
                </div>
              </>
            )}
          </PageContentCard>
        </div>
      ) : null}
    </PageSectionContainer>
  );
}
