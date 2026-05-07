import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsSeries } from '@/lib/admin';
import { useAdminStats } from '@/features/admin/hooks/useAdminStats';

// Map a 0-1 ratio to a fixed Tailwind height class (avoids inline styles)
function ratioToHeightClass(ratio: number): string {
  if (ratio >= 0.9) return 'h-28';
  if (ratio >= 0.75) return 'h-24';
  if (ratio >= 0.6) return 'h-20';
  if (ratio >= 0.45) return 'h-16';
  if (ratio >= 0.3) return 'h-12';
  if (ratio >= 0.18) return 'h-8';
  if (ratio >= 0.08) return 'h-4';
  if (ratio >= 0.02) return 'h-2';
  return 'h-1';
}

export function AdminAnalytics() {
  const { data: stats } = useAdminStats();
  const { data: series = [], isLoading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: fetchAnalyticsSeries,
    staleTime: 60_000,
  });

  const maxVal = Math.max(1, ...series.map((s) => Math.max(s.registrations, s.submissions)));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#111111] sm:text-4xl">Analytics</h1>
        <p className="text-[#6b7280]">Platform trends over the last 8 weeks.</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Users', value: stats?.totalUsers ?? '—' },
          { label: 'Active Vendors', value: stats?.activeVendors ?? '—' },
          { label: 'Open Tickets', value: stats?.openTickets ?? '—' },
          { label: 'Forum Posts', value: stats?.forumPosts ?? '—' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
            <p className="text-sm text-[#6b7280]">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-[#111111] sm:text-4xl">{typeof c.value === 'number' ? c.value.toLocaleString() : c.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-6">
        <h2 className="mb-6 font-semibold text-[#111111]">Weekly Registrations &amp; Vendor Submissions</h2>
        {isLoading ? (
          <p className="py-12 text-center text-sm text-[#9ca3af]">Loading chart data…</p>
        ) : (
          <div className="flex items-end gap-3 overflow-x-auto pb-2 min-h-[160px]">
            {series.map((point) => (
              <div key={point.week} className="flex min-w-[56px] flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center gap-1 h-28">
                  <div
                    className={`w-5 self-end rounded-t bg-[#111111] transition-all ${ratioToHeightClass(point.registrations / maxVal)}`}
                    title={`Registrations: ${point.registrations}`}
                  />
                  <div
                    className={`w-5 self-end rounded-t bg-[#6b7280] transition-all ${ratioToHeightClass(point.submissions / maxVal)}`}
                    title={`Submissions: ${point.submissions}`}
                  />
                </div>
                <p className="text-[10px] text-[#9ca3af] whitespace-nowrap">{point.week}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center gap-4 text-xs text-[#6b7280]">
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-[#111111]" /> Registrations</span>
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-[#6b7280]" /> Vendor Submissions</span>
        </div>
      </div>
    </div>
  );
}

