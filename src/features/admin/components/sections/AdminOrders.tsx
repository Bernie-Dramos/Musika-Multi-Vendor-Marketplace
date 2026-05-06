import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivityFeed, fetchSupportTickets, updateTicketStatus } from '@/lib/admin';
import type { Database } from '@/lib/database.types';

type TicketStatus = Database['public']['Enums']['support_ticket_status'];

const STATUS_OPTIONS: TicketStatus[] = ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'];

const statusColor: Record<TicketStatus, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  waiting_customer: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

function formatLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdminOrders() {
  const [ticketFilter, setTicketFilter] = useState<string>('all');
  const [ticketPage, setTicketPage] = useState(1);
  const [view, setView] = useState<'feed' | 'tickets'>('feed');

  const { data: feed, isLoading: feedLoading } = useQuery({
    queryKey: ['adminActivityFeed'],
    queryFn: () => fetchActivityFeed(1, 30),
    staleTime: 30_000,
  });

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['adminTickets', ticketFilter, ticketPage],
    queryFn: () => fetchSupportTickets(ticketFilter === 'all' ? undefined : ticketFilter, ticketPage),
    staleTime: 30_000,
  });

  const handleTicketStatus = async (id: string, status: TicketStatus) => {
    await updateTicketStatus(id, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#111111]">Orders & Activity</h1>
          <p className="text-[#6b7280]">Combined feed of vendor submissions and support tickets.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('feed')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === 'feed' ? 'bg-[#111111] text-white' : 'border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6]'}`}
          >
            Activity Feed
          </button>
          <button
            onClick={() => setView('tickets')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === 'tickets' ? 'bg-[#111111] text-white' : 'border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6]'}`}
          >
            Support Tickets
          </button>
        </div>
      </div>

      {view === 'feed' ? (
        <div className="rounded-xl border border-[#e5e7eb] bg-white">
          <div className="border-b border-[#f3f4f6] px-6 py-4">
            <h2 className="font-semibold text-[#111111]">Recent Activity</h2>
          </div>
          {feedLoading ? (
            <p className="px-6 py-8 text-center text-sm text-[#9ca3af]">Loading…</p>
          ) : (
            <ul className="divide-y divide-[#f3f4f6]">
              {(feed?.items ?? []).map((item, idx) => {
                if (item.kind === 'vendor') {
                  return (
                    <li key={idx} className="flex items-start gap-4 px-6 py-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e5e7eb] text-xs font-bold uppercase">
                        {item.data.business_name.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#111111]">
                          Vendor application: <span className="font-semibold">{item.data.business_name}</span>
                        </p>
                        <p className="text-xs text-[#9ca3af]">
                          {item.data.owner_name} · {item.data.category} ·{' '}
                          <span className="capitalize">{item.data.status.replace(/_/g, ' ')}</span>
                        </p>
                      </div>
                      <span className="text-xs text-[#9ca3af]">
                        {new Date(item.data.created_at).toLocaleDateString()}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={idx} className="flex items-start gap-4 px-6 py-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-xs font-bold text-blue-600">
                      #
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#111111]">
                        Support ticket: <span className="font-semibold">{item.data.subject}</span>
                      </p>
                      <p className="text-xs text-[#9ca3af]">
                        {item.data.category} · Priority: {item.data.priority} ·{' '}
                        <span className="capitalize">{item.data.status.replace(/_/g, ' ')}</span>
                      </p>
                    </div>
                    <span className="text-xs text-[#9ca3af]">
                      {new Date(item.data.created_at).toLocaleDateString()}
                    </span>
                  </li>
                );
              })}
              {(feed?.items ?? []).length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-[#9ca3af]">No activity yet.</li>
              )}
            </ul>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-[#e5e7eb] bg-white">
          <div className="flex flex-wrap items-center justify-between border-b border-[#f3f4f6] px-4 py-3 gap-3">
            <h2 className="font-semibold text-[#111111]">Support Tickets</h2>
            <select
              title="Filter by status"
              value={ticketFilter}
              onChange={(e) => { setTicketFilter(e.target.value); setTicketPage(1); }}
              className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm outline-none"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{formatLabel(s)}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#f3f4f6] text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9ca3af]">
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ticketsLoading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#9ca3af]">Loading…</td></tr>
                ) : (ticketsData?.data ?? []).length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#9ca3af]">No tickets found.</td></tr>
                ) : (
                  (ticketsData?.data ?? []).map((ticket) => (
                    <tr key={ticket.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="px-4 py-3 text-sm font-medium text-[#111111]">{ticket.subject}</td>
                      <td className="px-4 py-3 text-sm text-[#6b7280] capitalize">{ticket.category}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs capitalize font-medium ${
                          ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{ticket.priority}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[ticket.status]}`}>
                          {formatLabel(ticket.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          title="Update ticket status"
                          value={ticket.status}
                          onChange={(e) => handleTicketStatus(ticket.id, e.target.value as TicketStatus)}
                          className="rounded-lg border border-[#d1d5db] px-2 py-1 text-xs outline-none"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{formatLabel(s)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
