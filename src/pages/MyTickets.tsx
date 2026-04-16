import { useAuth } from '@/features/auth/context/AuthContext';
import { formatSupportStatus, useMySupportTicketsQuery } from '@/features/support/hooks/useSupport';
import { Badge } from '@/components/ui/badge';
import { PageSectionContainer, PageHeroHeader, PageContentCard } from '@/components/PageScaffold';
import { PageEmptyState, PageErrorState, PageLoadingState } from '@/components/QueryStates';

export function MyTickets() {
  const { user } = useAuth();
  const ticketsQuery = useMySupportTicketsQuery(user?.id);
  const tickets = ticketsQuery.data ?? [];

  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="My Tickets"
        description="Track support requests and status updates from the support team."
      />

      {ticketsQuery.isLoading ? <PageLoadingState title="Loading tickets" /> : null}

      {ticketsQuery.isError ? (
        <PageErrorState
          title="Unable to load tickets"
          description="Please try again shortly."
          onRetry={() => ticketsQuery.refetch()}
        />
      ) : null}

      {!ticketsQuery.isLoading && !ticketsQuery.isError && tickets.length === 0 ? (
        <PageEmptyState
          title="No support tickets yet"
          description="When you submit a support request, it will appear here with real-time status updates."
        />
      ) : null}

      {!ticketsQuery.isLoading && !ticketsQuery.isError && tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <PageContentCard key={ticket.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#0F172A]">{ticket.subject}</h3>
                  <p className="text-xs text-slate-500">Ticket #{ticket.id}</p>
                </div>
                <Badge className="capitalize">{formatSupportStatus(ticket.status)}</Badge>
              </div>
              <p className="text-sm text-slate-600">{ticket.description}</p>
              <div className="flex gap-4 text-xs text-slate-500">
                <span>Category: {ticket.category}</span>
                <span>Priority: {ticket.priority}</span>
                <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
            </PageContentCard>
          ))}
        </div>
      ) : null}
    </PageSectionContainer>
  );
}
