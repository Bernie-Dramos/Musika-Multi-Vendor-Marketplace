import { Bell, Globe, Grid2x2, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusDot } from '@/components/musika/ui-primitives';

const tableRows = [
  { id: 'ARC-2024-001', name: 'Treehaven House', category: 'Dormitory', vendor: 'Studio Minimalist', status: 'approved' as const },
  { id: 'ARC-2024-042', name: 'White Void Wall Relief', category: 'Furniture', vendor: 'Monolith Arts', status: 'pending' as const },
  { id: 'ARC-2024-009', name: 'Hot Pot', category: 'Restaurant', vendor: 'Dan Hungwe', status: 'approved' as const },
  { id: 'ARC-2024-055', name: 'Bronze Filament Pendant', category: 'Gadgets', vendor: 'Lumina Curio', status: 'rejected' as const },
];

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="flex">
        <aside className="hidden min-h-screen w-[260px] shrink-0 bg-[#0f1523] px-5 py-6 text-white lg:block">
          <h1 className="text-[30px] font-bold">Musika</h1>
          <p className="mt-1 text-[10px] uppercase tracking-[1px] text-[#6b7280]">International Student Multivendor Marketplace</p>
          <nav className="mt-10 space-y-2 text-sm">
            {['Dashboard', 'Vendors', 'Orders', 'Analytics', 'Compliance', 'Settings'].map((item) => (
              <button
                key={item}
                className={`flex w-full items-center rounded-r-xl px-4 py-3 text-left transition-all duration-150 ${
                  item === 'Vendors'
                    ? 'border-l-[3px] border-white bg-[#1a1f2e] text-white'
                    : 'text-[#9ca3af] hover:bg-[#1a1f2e] hover:text-[#e5e7eb]'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-10">
            <div className="rounded-xl bg-[#1a1f2e] p-3">
              <p className="text-sm font-medium">codeSage</p>
              <p className="text-xs text-[#9ca3af]">Global Admin</p>
            </div>
            <Button className="mt-4 w-full bg-[#1a1f2e] text-white hover:bg-[#222a3b]">Support Portal</Button>
            <Button variant="ghost" className="mt-2 w-full text-[#d1d5db] hover:bg-[#1a1f2e]">Logout</Button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 sm:px-8">
            <h2 className="text-sm font-semibold text-[#111111]">Vendor Listings</h2>
            <div className="hidden w-full max-w-md items-center gap-2 rounded-full bg-[#f3f4f6] px-3 py-2 md:flex">
              <Search className="h-4 w-4 text-[#9ca3af]" />
              <input className="w-full bg-transparent text-sm outline-none" placeholder="Search listings..." />
            </div>
            <div className="flex items-center gap-4 text-[#374151]">
              <Globe className="h-4 w-4" />
              <Bell className="h-4 w-4" />
              <div className="h-6 w-6 rounded-full bg-[#1a1f2e]" />
            </div>
          </header>

          <main className="p-4 sm:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-[#111111]">Vendor Management</h1>
                <p className="text-[#6b7280]">Review, manage, and audit high-end architectural pieces from global vendors.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-[#111111]">Export CSV</Button>
                <Button className="bg-[#111111] text-white hover:bg-black">+ New Listing</Button>
              </div>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { title: 'Total Listings', value: '1,284', growth: '+12%' },
                { title: 'Pending Review', value: '42' },
                { title: 'Active Vendors', value: '156' },
                { title: 'Rejected/Flagged', value: '8' },
              ].map((card) => (
                <div key={card.title} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="h-10 w-10 rounded-full bg-[#f3f4f6]" />
                    {card.growth ? <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-xs text-[#16a34a]">{card.growth}</span> : null}
                  </div>
                  <p className="text-sm text-[#6b7280]">{card.title}</p>
                  <p className="text-4xl font-bold text-[#111111]">{card.value}</p>
                </div>
              ))}
            </section>

            <section className="mt-8 rounded-xl border border-[#e5e7eb] bg-white">
              <div className="flex flex-wrap items-center justify-between border-b border-[#f3f4f6] px-4 py-3">
                <div className="flex flex-wrap items-center gap-5 text-sm">
                  <button className="border-b-2 border-[#111111] pb-2 font-medium text-[#111111]">All Listings</button>
                  <button className="text-[#6b7280]">Pending (42)</button>
                  <button className="text-[#6b7280]">Active</button>
                  <button className="text-[#6b7280]">Archived</button>
                </div>
                <div className="flex items-center gap-3 text-[#6b7280]">
                  <Grid2x2 className="h-4 w-4" />
                  <List className="h-4 w-4" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead>
                    <tr className="border-b border-[#f3f4f6] text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9ca3af]">
                      <th className="px-4 py-3">Listing Details</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Vendor</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={row.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-lg bg-[#e5e7eb]" />
                            <div>
                              <p className="font-semibold text-[#111111]">{row.name}</p>
                              <p className="text-xs text-[#9ca3af]">SKU: {row.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-[#f3f4f6] px-2 py-1 text-xs text-[#374151]">{row.category}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-[#e5e7eb]" />
                            <span className="text-sm text-[#111111]">{row.vendor}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusDot tone={row.status}>
                            {row.status === 'approved' ? 'Approved' : row.status === 'pending' ? 'Pending' : 'Rejected'}
                          </StatusDot>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Button className="h-8 rounded-full bg-[#111111] px-4 text-xs text-white hover:bg-black">
                              {row.status === 'pending' ? 'Approve' : 'Edit'}
                            </Button>
                            <Button variant="outline" className="h-8 rounded-full border-[#d1d5db] px-4 text-xs">
                              {row.status === 'pending' ? 'Reject' : 'Remove'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-[#6b7280]">
                <p>Showing 1-10 of 1,284 listings</p>
                <div className="flex items-center gap-2">
                  <button className="h-9 w-9 rounded-full border border-[#e5e7eb]">1</button>
                  <button className="h-9 w-9 rounded-full bg-[#111111] text-white">2</button>
                  <button className="h-9 w-9 rounded-full border border-[#e5e7eb]">3</button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
