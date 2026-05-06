import { useState } from 'react';
import { Grid2x2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusDot } from '@/components/musika/ui-primitives';
import { useAdminVendors, useUpdateVendorStatus } from '@/features/admin/hooks/useAdminStats';
import { generateVendorsCSV, createResource } from '@/lib/admin';
import type { Database } from '@/lib/database.types';
import type { NewResourceInput } from '@/lib/admin';
import { useAuth } from '@/features/auth/context/AuthContext';

type VendorApplicationStatus = Database['public']['Enums']['vendor_application_status'];
type ResourceCategory = Database['public']['Enums']['resource_category'];

type TabFilter = 'all' | 'submitted' | 'approved' | 'rejected';

const tabs: { label: string; filter: TabFilter }[] = [
  { label: 'All Listings', filter: 'all' },
  { label: 'Pending', filter: 'submitted' },
  { label: 'Active', filter: 'approved' },
  { label: 'Archived', filter: 'rejected' },
];

const statusTone: Record<VendorApplicationStatus, 'approved' | 'pending' | 'rejected'> = {
  approved: 'approved',
  submitted: 'pending',
  review: 'pending',
  draft: 'pending',
  rejected: 'rejected',
  revision_required: 'rejected',
};

const RESOURCE_CATEGORIES: ResourceCategory[] = [
  'visa', 'legal', 'housing', 'transport', 'healthcare', 'discounts', 'emergency',
];

interface NewListingModalProps {
  userId: string;
  onClose: () => void;
}

function NewListingModal({ userId, onClose }: NewListingModalProps) {
  const [form, setForm] = useState<Omit<NewResourceInput, 'created_by'>>({
    title: '',
    description: '',
    category: 'housing',
    country: '',
    city: '',
    url: '',
    is_free: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error: err } = await createResource({ ...form, created_by: userId });
    setSaving(false);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="mb-4 text-xl font-bold text-[#111111]">New Resource Listing</h2>

        {error && <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Title *</label>
            <input
              required
              title="Resource title"
              placeholder="Enter title"
              className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#111111]"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#374151]">Description *</label>
            <textarea
              required
              rows={3}
              title="Resource description"
              placeholder="Enter description"
              className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#111111]"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">Category *</label>
              <select
                title="Resource category"
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#111111]"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ResourceCategory }))}
              >
                {RESOURCE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">Country *</label>
              <input
                required
                title="Country"
                placeholder="Enter country"
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#111111]"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">City</label>
              <input
                title="City"
                placeholder="Enter city"
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#111111]"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#374151]">URL</label>
              <input
                type="url"
                title="Resource URL"
                placeholder="https://"
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#111111]"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_free}
              onChange={(e) => setForm((f) => ({ ...f, is_free: e.target.checked }))}
            />
            Free resource
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving} className="bg-[#111111] text-white hover:bg-black">
            {saving ? 'Saving…' : 'Create Listing'}
          </Button>
        </div>
      </form>
    </div>
  );
}

interface AdminVendorsProps {
  searchQuery: string;
}

export function AdminVendors({ searchQuery }: AdminVendorsProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const pageSize = 10;
  const { data, isLoading } = useAdminVendors(activeTab === 'all' ? 'all' : (activeTab as VendorApplicationStatus), page, pageSize);
  const updateStatus = useUpdateVendorStatus();

  const rows = (data?.data ?? []).filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.business_name.toLowerCase().includes(q) ||
      r.owner_name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleAction = (id: string, status: VendorApplicationStatus) => {
    updateStatus.mutate({ id, status });
  };

  const handleExportCSV = () => {
    if (data?.data) generateVendorsCSV(data.data);
  };

  return (
    <>
      {showModal && user && (
        <NewListingModal userId={user.id} onClose={() => setShowModal(false)} />
      )}

      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#111111]">Vendor Management</h1>
            <p className="text-[#6b7280]">Review, manage, and audit listings from global vendors.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-[#111111]" onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button className="bg-[#111111] text-white hover:bg-black" onClick={() => setShowModal(true)}>
              + New Listing
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: 'Total Listings', value: totalCount, growth: '+12%' },
            { title: 'Pending Review', value: data?.data.filter((r) => ['submitted', 'review'].includes(r.status)).length ?? 0 },
            { title: 'Active Vendors', value: data?.data.filter((r) => r.status === 'approved').length ?? 0 },
            { title: 'Rejected/Flagged', value: data?.data.filter((r) => r.status === 'rejected').length ?? 0 },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-[#e5e7eb] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="h-10 w-10 rounded-full bg-[#f3f4f6]" />
                {card.growth && (
                  <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-xs text-[#16a34a]">{card.growth}</span>
                )}
              </div>
              <p className="text-sm text-[#6b7280]">{card.title}</p>
              <p className="text-4xl font-bold text-[#111111]">{isLoading ? '—' : card.value}</p>
            </div>
          ))}
        </section>

        {/* Table */}
        <section className="rounded-xl border border-[#e5e7eb] bg-white">
          <div className="flex flex-wrap items-center justify-between border-b border-[#f3f4f6] px-4 py-3">
            <div className="flex flex-wrap items-center gap-5 text-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.filter}
                  onClick={() => { setActiveTab(tab.filter); setPage(1); }}
                  className={activeTab === tab.filter
                    ? 'border-b-2 border-[#111111] pb-2 font-medium text-[#111111]'
                    : 'pb-2 text-[#6b7280] hover:text-[#374151]'}
                >
                  {tab.label}
                </button>
              ))}
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
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#9ca3af]">Loading…</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#9ca3af]">No listings found.</td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e5e7eb] text-xs font-bold uppercase text-[#374151]">
                            {row.business_name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#111111]">{row.business_name}</p>
                            <p className="text-xs text-[#9ca3af]">SKU: {row.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-[#f3f4f6] px-2 py-1 text-xs text-[#374151] capitalize">
                          {row.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5e7eb] text-xs font-bold uppercase text-[#374151]">
                            {row.owner_name.slice(0, 1)}
                          </div>
                          <span className="text-sm text-[#111111]">{row.owner_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusDot tone={statusTone[row.status]}>
                          {row.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </StatusDot>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {['submitted', 'review', 'draft'].includes(row.status) ? (
                            <>
                              <Button
                                size="sm"
                                className="h-8 rounded-full bg-[#111111] px-4 text-xs text-white hover:bg-black"
                                onClick={() => handleAction(row.id, 'approved')}
                                disabled={updateStatus.isPending}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-full border-[#d1d5db] px-4 text-xs"
                                onClick={() => handleAction(row.id, 'rejected')}
                                disabled={updateStatus.isPending}
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                className="h-8 rounded-full bg-[#111111] px-4 text-xs text-white hover:bg-black"
                                onClick={() => handleAction(row.id, 'review')}
                                disabled={updateStatus.isPending}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-full border-[#d1d5db] px-4 text-xs"
                                onClick={() => handleAction(row.id, 'rejected')}
                                disabled={updateStatus.isPending}
                              >
                                Remove
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-[#6b7280]">
            <p>
              Showing {Math.min((page - 1) * pageSize + 1, totalCount)}–{Math.min(page * pageSize, totalCount)} of{' '}
              {totalCount} listings
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] disabled:opacity-40"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-full border text-sm ${
                    page === p ? 'bg-[#111111] text-white' : 'border-[#e5e7eb] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 5 && <span className="px-1">…</span>}
              {totalPages > 5 && (
                <button
                  onClick={() => setPage(totalPages)}
                  className={`h-9 w-9 rounded-full border text-sm ${
                    page === totalPages ? 'bg-[#111111] text-white' : 'border-[#e5e7eb] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {totalPages}
                </button>
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
