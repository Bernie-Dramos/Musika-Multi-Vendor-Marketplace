import { useState } from 'react';
import {
  ArrowRight,
  Bell,
  BookMarked,
  Camera,
  Check,
  ChevronDown,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Package,
  Plus,
  Settings,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/context/AuthContext';

// ── Shared sidebar user card ─────────────────────────────────────────────────

function SidebarUser({
  displayName,
  avatarUrl,
  badge,
}: {
  displayName: string;
  avatarUrl?: string;
  badge: React.ReactNode;
}) {
  return (
    <div className="mt-auto rounded-xl bg-[#1a1f2e] p-3">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="h-8 w-8 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#374151] text-sm font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{displayName}</p>
          {badge}
        </div>
      </div>
    </div>
  );
}

// ── Student Dashboard ────────────────────────────────────────────────────────

const studentNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Orders', icon: Package },
  { label: 'Saved Resources', icon: BookMarked },
  { label: 'Community', icon: Users },
  { label: 'My Tickets', icon: LifeBuoy },
];

const studentStats = [
  { label: 'Orders', value: '3', icon: Package, color: 'text-[#f5a623]' },
  { label: 'Saved Items', value: '12', icon: BookMarked, color: 'text-[#22c55e]' },
  { label: 'Forum Posts', value: '7', icon: MessageSquare, color: 'text-[#60a5fa]' },
  { label: 'Open Tickets', value: '1', icon: LifeBuoy, color: 'text-[#f87171]' },
];

const recentActivity = [
  { label: 'Order #1042 — Airport Pickup', time: '2 hours ago', status: 'Confirmed' },
  { label: 'Saved "Legal Consultation"', time: 'Yesterday', status: 'Saved' },
  { label: 'Posted in Community: "Best Areas to Live"', time: '3 days ago', status: 'Post' },
  { label: 'Ticket #88 — Housing inquiry', time: '5 days ago', status: 'Open' },
];

function StudentView({ displayName, avatarUrl }: { displayName: string; avatarUrl?: string }) {
  const [activeNav, setActiveNav] = useState('Dashboard');

  return (
    <div className="flex min-h-screen">
      <aside className="hidden min-h-screen w-[260px] shrink-0 flex-col bg-[#0f1523] px-5 py-6 text-white lg:flex">
        <h1 className="text-[30px] font-bold">Musika</h1>
        <p className="mt-1 text-[10px] uppercase tracking-[1px] text-[#6b7280]">International Student Multivendor Marketplace</p>

        <nav className="mt-10 flex-1 space-y-2 text-sm">
          {studentNavItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-150 ${
                activeNav === label ? 'bg-[#1a1f2e] text-white' : 'text-[#9ca3af] hover:bg-[#1a1f2e] hover:text-[#e5e7eb]'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <SidebarUser displayName={displayName} avatarUrl={avatarUrl} badge={<p className="text-xs text-[#60a5fa]">Student</p>} />
      </aside>

      <div className="flex-1 bg-[#f9fafb]">
        <header className="border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <button className="font-semibold text-[#111111]">Musika</button>
              <button className="border-b-2 border-[#111111] pb-1 font-semibold text-[#111111]">Dashboard</button>
              <button className="text-[#6b7280]">Help Center</button>
            </div>
            <div className="flex items-center gap-3 text-[#374151]">
              <Bell className="h-4 w-4" />
              <Settings className="h-4 w-4" />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-8">
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#0f1523] to-[#1a1f2e] p-6 text-white">
            <p className="text-sm text-[#9ca3af]">Welcome back,</p>
            <h1 className="mt-1 text-2xl font-bold">{displayName}</h1>
            <p className="mt-1 text-sm text-[#6b7280]">Your international student hub — explore services, manage orders, and connect.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button className="rounded-full bg-[#f5a623] text-[#111111] hover:bg-[#e09500]">Browse Services</Button>
              <Button variant="outline" className="rounded-full border-[#374151] text-white hover:bg-[#1a1f2e]">
                Community Forum
              </Button>
            </div>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {studentStats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#6b7280]">{label}</p>
                    <p className="mt-1 text-3xl font-bold text-[#111111]">{value}</p>
                  </div>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-[#111111]">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map(({ label, time, status }) => (
                  <div key={label} className="flex items-start justify-between gap-4 rounded-xl bg-[#f9fafb] px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#111111]">{label}</p>
                      <p className="mt-0.5 text-xs text-[#9ca3af]">{time}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        status === 'Confirmed'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : status === 'Open'
                            ? 'bg-[#fee2e2] text-[#b91c1c]'
                            : status === 'Saved'
                              ? 'bg-[#dbeafe] text-[#1d4ed8]'
                              : 'bg-[#f3f4f6] text-[#374151]'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-[#111111]">Quick Access</h2>
              <div className="space-y-3">
                {[
                  { label: 'Browse Services', sub: 'Find accommodation, transport and more', icon: Package },
                  { label: 'Community Forum', sub: 'Ask questions, share experiences', icon: Users },
                  { label: 'Help & Support', sub: 'Open a ticket or contact support', icon: LifeBuoy },
                  { label: 'Saved Resources', sub: 'View your bookmarked listings', icon: BookMarked },
                ].map(({ label, sub, icon: Icon }) => (
                  <button
                    key={label}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#e5e7eb] px-4 py-3 text-left transition-all hover:border-[#111111] hover:bg-[#f9fafb]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6]">
                      <Icon className="h-4 w-4 text-[#374151]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111111]">{label}</p>
                      <p className="truncate text-[11px] text-[#9ca3af]">{sub}</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#9ca3af]" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#e5e7eb] bg-white py-2 lg:hidden">
        <button className="flex flex-col items-center text-xs text-[#111111]">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </button>
        <button className="flex flex-col items-center text-xs text-[#6b7280]">
          <Package className="h-4 w-4" />
          Orders
        </button>
        <button className="flex flex-col items-center text-xs text-[#6b7280]">
          <BookMarked className="h-4 w-4" />
          Saved
        </button>
        <button className="flex flex-col items-center text-xs text-[#6b7280]">
          <Users className="h-4 w-4" />
          Community
        </button>
      </nav>
    </div>
  );
}

// ── Vendor Dashboard ─────────────────────────────────────────────────────────

const vendorNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Listings', icon: ClipboardList },
  { label: 'Orders', icon: Package },
  { label: 'Messages', icon: MessageSquare },
  { label: 'Analytics', icon: TrendingUp },
  { label: 'Earnings', icon: DollarSign },
  { label: 'Settings', icon: Settings },
];

// ── Vendor Dashboard — Overview tab ──────────────────────────────────────────

const vendorStats = [
  { label: 'Total Revenue', value: '₹4,82,190', change: '+12.4% vs last month', positive: true, icon: DollarSign },
  { label: 'Active Listings', value: '24', change: '+2 this week', positive: true, icon: ClipboardList },
  { label: 'Orders This Month', value: '128', change: '+8.1% vs last month', positive: true, icon: Package },
  { label: 'Avg. Rating', value: '4.92', change: 'Stable performance', positive: true, icon: Star },
];

const recentVendorOrders = [
  { id: '#ORD-88219', customer: 'Aditi Kapoor', service: 'Academic Consulting (Full-term)', price: '₹45,000', status: 'PENDING', paid: true },
  { id: '#ORD-88215', customer: 'Rohan Mehta', service: 'Thesis Review & Editing', price: '₹12,800', status: 'COMPLETED', paid: true },
  { id: '#ORD-88204', customer: 'Sana Patel', service: 'Curated Resource Access', price: '₹5,500', status: 'PENDING', paid: false },
  { id: '#ORD-88198', customer: 'Vikram Jha', service: 'Workshop Admission (Premium)', price: '₹22,000', status: 'COMPLETED', paid: true },
];

const initialTags = ['Shona', 'Vegan', 'Cultural'];

function VendorDashboardOverview({
  displayName,
  setActiveNav,
}: {
  displayName: string;
  setActiveNav: (nav: string) => void;
}) {
  return (
    <main className="px-4 py-6 sm:px-8">
      {/* Header */}
      <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-[#dcfce7] px-3 py-1">
        <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-[#15803d]">Real-Time Performance</span>
      </div>
      <h1 className="mt-3 text-3xl font-bold text-[#111111]">Analytics Panel</h1>
      <p className="mt-1 text-sm text-[#6b7280]">
        Comprehensive breakdown of your curatorial performance. Track your growth, identify top-performing collections, and optimise your revenue streams.
      </p>

      {/* Stat Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {vendorStats.map(({ label, value, change, positive, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
            <p className="text-sm text-[#6b7280]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-[#111111]">{value}</p>
            <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${positive ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
              {positive ? '▲' : '▼'} {change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <section className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">Recent Orders</h2>
            <p className="text-sm text-[#6b7280]">Manage and track your active service bookings</p>
          </div>
          <Button
            onClick={() => setActiveNav('Orders')}
            className="rounded-full bg-[#111111] text-sm text-white hover:bg-black"
          >
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-left text-[10px] font-semibold uppercase tracking-[0.5px] text-[#9ca3af]">
                <th className="pb-3 pr-4">Order ID</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Service Booked</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {recentVendorOrders.map(({ id, customer, service, price, status, paid }) => (
                <tr key={id} className="group">
                  <td className="py-3 pr-4 font-medium text-[#111111]">{id}</td>
                  <td className="py-3 pr-4 text-[#374151]">{customer}</td>
                  <td className="py-3 pr-4 text-[#374151]">{service}</td>
                  <td className="py-3 pr-4 font-medium text-[#111111]">{price}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        status === 'COMPLETED'
                          ? 'bg-[#f3f4f6] text-[#374151]'
                          : 'bg-[#dcfce7] text-[#15803d]'
                      }`}
                    >
                      {status === 'PENDING' ? '● PENDING' : 'COMPLETED'}
                    </span>
                  </td>
                  <td className="py-3">
                    {paid ? (
                      <span className="flex items-center gap-1 text-[#16a34a]">
                        <span className="h-4 w-4 rounded-full bg-[#dcfce7] text-center text-[10px] leading-4">✓</span>
                        Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#dc2626]">
                        <span className="h-4 w-4 rounded-full bg-[#fee2e2] text-center text-[10px] leading-4">⊗</span>
                        Awaiting
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-[#9ca3af]">Showing 4 of 128 orders</p>
      </section>

      {/* Quick links */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'My Listings', sub: 'Manage your product catalogue', icon: ClipboardList },
          { label: 'Analytics', sub: 'View performance insights', icon: TrendingUp },
          { label: 'Earnings', sub: 'Track revenue & payouts', icon: DollarSign },
          { label: 'Settings', sub: 'Profile & preferences', icon: Settings },
        ].map(({ label, sub, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveNav(label)}
            className="flex items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 text-left transition-all hover:border-[#111111] hover:bg-[#f9fafb]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6]">
              <Icon className="h-4 w-4 text-[#374151]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#111111]">{label}</p>
              <p className="truncate text-[11px] text-[#9ca3af]">{sub}</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#9ca3af]" />
          </button>
        ))}
      </div>
    </main>
  );
}

// ── Vendor Dashboard — Create Listing tab ─────────────────────────────────────

function VendorCreateListing() {
  const [active, setActive] = useState(true);
  const [tags, setTags] = useState(initialTags);

  return (
    <main className="px-4 py-6 sm:px-8">
      <nav className="mb-4 text-sm text-[#6b7280]">Marketplace &gt; My Listings &gt; New Listing</nav>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="rounded-2xl border border-[#e5e7eb] bg-white p-7">
          <h1 className="text-3xl font-bold text-[#111111]">Listing Details</h1>
          <p className="mt-1 text-[#6b7280]">Define your product and its global appeal.</p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">Listing Title</label>
              <input
                className="mt-2 h-12 w-full rounded-lg border border-[#e5e7eb] px-4 text-[#111111] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                placeholder="e.g. Handcrafted Moroccan Ceramic Vase"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">Description</label>
              <textarea
                className="mt-2 min-h-[160px] w-full rounded-lg border border-[#e5e7eb] px-4 py-3 text-[#111111] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                placeholder="Describe the origin, craftsmanship, and unique value..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">Category</label>
                <button className="mt-2 flex h-12 w-full items-center justify-between rounded-lg border border-[#e5e7eb] px-4 text-left text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#111111]/10">
                  Select a category
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#374151]">Price (INR)</label>
                <div className="mt-2 flex h-12 items-center rounded-lg border border-[#e5e7eb] px-4 focus-within:ring-2 focus-within:ring-[#111111]/10">
                  <span className="mr-2 text-[#374151]">₹</span>
                  <input className="w-full text-[#111111] outline-none" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
            <h2 className="text-2xl font-bold text-[#111111]">Media Gallery</h2>
            <p className="text-sm text-[#6b7280]">High-resolution editorial photography (Max 10MB)</p>

            <div className="mt-4 space-y-4">
              <button className="flex h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d1d5db] text-[#9ca3af] transition-all duration-150 hover:border-[#111111] hover:bg-[#f9fafb]">
                <Camera className="mb-2 h-7 w-7" />
                Upload Main Image
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-[#d1d5db] text-[#6b7280]" aria-label="Upload additional image 1">
                  <Plus className="h-5 w-5" />
                </button>
                <button className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-[#d1d5db] text-[#6b7280]" aria-label="Upload additional image 2">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <Button className="h-13 w-full rounded-xl bg-[#111111] py-6 text-base text-white hover:bg-black">
            Post New Listing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="secondary" className="h-13 w-full rounded-xl bg-[#f3f4f6] py-6 text-base text-[#111111] hover:bg-[#e5e7eb]">
            Save as Draft
          </Button>
          <p className="text-center text-[11px] uppercase tracking-[0.5px] text-[#9ca3af]">By posting, you agree to the vendor terms</p>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-7">
        <h2 className="text-2xl font-bold text-[#111111]">Attributes & Cultural Tags</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1.5 text-sm text-white">
              <Check className="h-3 w-3" />
              {tag}
            </button>
          ))}
          <button
            onClick={() => setTags((prev) => [...prev, `Tag ${prev.length + 1}`])}
            className="rounded-full border border-dashed border-[#9ca3af] px-3 py-1.5 text-sm text-[#6b7280]"
          >
            + Add Tag
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f9fafb] px-4 py-3">
          <div className="flex items-start gap-3">
            <LayoutDashboard className="mt-0.5 h-5 w-5 text-[#22c55e]" />
            <div>
              <p className="font-medium text-[#111111]">Active & Available</p>
              <p className="text-sm text-[#6b7280]">Listing will be visible to all international students immediately.</p>
            </div>
          </div>

          <button
            onClick={() => setActive((prev) => !prev)}
            className={`relative h-7 w-12 rounded-full transition-all duration-150 ${active ? 'bg-[#111111]' : 'bg-[#d1d5db]'}`}
            aria-label="Active and available"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-150 ${active ? 'left-6' : 'left-1'}`}
            />
          </button>
        </div>
      </section>
    </main>
  );
}

// ── VendorView root ───────────────────────────────────────────────────────────

function VendorView({ displayName, avatarUrl }: { displayName: string; avatarUrl?: string }) {
  const [activeNav, setActiveNav] = useState('Dashboard');

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="flex">
        <aside className="hidden min-h-screen w-[260px] shrink-0 flex-col bg-[#0f1523] px-5 py-6 text-white lg:flex">
          <h1 className="text-[30px] font-bold">Musika</h1>
          <p className="mt-1 text-[10px] uppercase tracking-[1px] text-[#6b7280]">International Student Multivendor Marketplace</p>

          <nav className="mt-10 flex-1 space-y-2 text-sm">
            {vendorNavItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-150 ${
                  activeNav === label ? 'bg-[#1a1f2e] text-white' : 'text-[#9ca3af] hover:bg-[#1a1f2e] hover:text-[#e5e7eb]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          <button className="mb-3 flex w-full items-center gap-2 px-2 py-2 text-sm text-[#6b7280] transition-colors hover:text-[#9ca3af]">
            <LifeBuoy className="h-4 w-4 shrink-0" />
            Support
          </button>

          <SidebarUser
            displayName={displayName}
            avatarUrl={avatarUrl}
            badge={<p className="text-xs text-[#22c55e]">● Verified Vendor</p>}
          />
        </aside>

        <div className="flex-1">
          <header className="border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  className="h-10 w-full rounded-full border border-[#e5e7eb] bg-[#f9fafb] pl-4 pr-10 text-sm text-[#111111] placeholder:text-[#9ca3af] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                  placeholder={activeNav === 'Dashboard' ? 'Search analytics, listings, or orders...' : `Search ${activeNav.toLowerCase()}...`}
                />
              </div>
              <div className="flex items-center gap-3 text-[#374151]">
                <Bell className="h-4 w-4" />
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6]">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-[#374151]">{displayName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
            </div>
          </header>

          {activeNav === 'Dashboard' && (
            <VendorDashboardOverview displayName={displayName} setActiveNav={setActiveNav} />
          )}
          {activeNav === 'My Listings' && <VendorCreateListing />}
          {!['Dashboard', 'My Listings'].includes(activeNav) && (
            <main className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-4 py-20 text-center">
              <p className="text-lg font-semibold text-[#111111]">{activeNav}</p>
              <p className="text-sm text-[#9ca3af]">This section is coming soon.</p>
            </main>
          )}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[#e5e7eb] bg-white py-2 lg:hidden">
        <button onClick={() => setActiveNav('Dashboard')} className={`flex flex-col items-center text-xs ${activeNav === 'Dashboard' ? 'text-[#111111]' : 'text-[#6b7280]'}`}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </button>
        <button onClick={() => setActiveNav('My Listings')} className={`flex flex-col items-center text-xs ${activeNav === 'My Listings' ? 'text-[#111111]' : 'text-[#6b7280]'}`}>
          <ClipboardList className="h-4 w-4" />
          Listings
        </button>
        <button onClick={() => setActiveNav('Orders')} className={`flex flex-col items-center text-xs ${activeNav === 'Orders' ? 'text-[#111111]' : 'text-[#6b7280]'}`}>
          <Package className="h-4 w-4" />
          Orders
        </button>
        <button onClick={() => setActiveNav('Messages')} className={`flex flex-col items-center text-xs ${activeNav === 'Messages' ? 'text-[#111111]' : 'text-[#6b7280]'}`}>
          <MessageSquare className="h-4 w-4" />
          Messages
        </button>
      </nav>
    </div>
  );
}

// ── Root export ──────────────────────────────────────────────────────────────

export function VendorDashboard() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'User';
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const role = user?.user_metadata?.role as string | undefined;

  if (role === 'vendor') {
    return <VendorView displayName={displayName} avatarUrl={avatarUrl} />;
  }

  return <StudentView displayName={displayName} avatarUrl={avatarUrl} />;
}
