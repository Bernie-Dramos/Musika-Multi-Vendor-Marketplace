import { Users, Store, ShoppingBag, BookOpen, BarChart2, Ticket } from 'lucide-react';
import { useAdminStats } from '@/features/admin/hooks/useAdminStats';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  growth?: string;
}

function StatCard({ title, value, icon, growth }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-[#374151]">
          {icon}
        </div>
        {growth && (
          <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-xs text-[#16a34a]">{growth}</span>
        )}
      </div>
      <p className="text-sm text-[#6b7280]">{title}</p>
      <p className="text-4xl font-bold text-[#111111]">{value.toLocaleString()}</p>
    </div>
  );
}

export function AdminOverview() {
  const { data: stats, isLoading } = useAdminStats();

  const display = isLoading
    ? { totalListings: '—', pendingReview: '—', activeVendors: '—', rejectedFlagged: '—', totalUsers: '—', openTickets: '—', forumPosts: '—', totalResources: '—' }
    : stats ?? { totalListings: 0, pendingReview: 0, activeVendors: 0, rejectedFlagged: 0, totalUsers: 0, openTickets: 0, forumPosts: 0, totalResources: 0 };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#111111]">Overview</h1>
        <p className="text-[#6b7280]">Platform-wide statistics and activity summary.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Listings" value={display.totalListings} icon={<Store className="h-5 w-5" />} growth="+12%" />
        <StatCard title="Pending Review" value={display.pendingReview} icon={<ShoppingBag className="h-5 w-5" />} />
        <StatCard title="Active Vendors" value={display.activeVendors} icon={<Store className="h-5 w-5" />} />
        <StatCard title="Rejected/Flagged" value={display.rejectedFlagged} icon={<BarChart2 className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={display.totalUsers} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Open Tickets" value={display.openTickets} icon={<Ticket className="h-5 w-5" />} />
        <StatCard title="Forum Posts" value={display.forumPosts} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Resources" value={display.totalResources} icon={<BookOpen className="h-5 w-5" />} />
      </section>
    </div>
  );
}
