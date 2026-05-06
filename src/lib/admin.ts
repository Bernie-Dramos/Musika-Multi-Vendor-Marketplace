import { supabase } from '@/lib/supabase';
import type {
  VendorApplicationRow,
  ProfileRow,
  SupportTicketRow,
  ForumPostRow,
} from '@/lib/database.types';
import type { Database } from '@/lib/database.types';

type ResourceCategory = Database['public']['Enums']['resource_category'];
type VendorApplicationStatus = Database['public']['Enums']['vendor_application_status'];

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalListings: number;
  pendingReview: number;
  activeVendors: number;
  rejectedFlagged: number;
  totalUsers: number;
  openTickets: number;
  forumPosts: number;
  totalResources: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  if (!supabase) {
    return { totalListings: 0, pendingReview: 0, activeVendors: 0, rejectedFlagged: 0, totalUsers: 0, openTickets: 0, forumPosts: 0, totalResources: 0 };
  }

  const [
    totalListings,
    pendingReview,
    activeVendors,
    rejectedFlagged,
    totalUsers,
    openTickets,
    forumPosts,
    totalResources,
  ] = await Promise.all([
    supabase.from('vendor_applications').select('id', { count: 'exact', head: true }),
    supabase.from('vendor_applications').select('id', { count: 'exact', head: true }).in('status', ['submitted', 'review']),
    supabase.from('vendor_applications').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('vendor_applications').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    supabase.from('forum_posts').select('id', { count: 'exact', head: true }),
    supabase.from('resources').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalListings: totalListings.count ?? 0,
    pendingReview: pendingReview.count ?? 0,
    activeVendors: activeVendors.count ?? 0,
    rejectedFlagged: rejectedFlagged.count ?? 0,
    totalUsers: totalUsers.count ?? 0,
    openTickets: openTickets.count ?? 0,
    forumPosts: forumPosts.count ?? 0,
    totalResources: totalResources.count ?? 0,
  };
}

// ─── Vendor Applications ──────────────────────────────────────────────────────

export interface VendorApplicationWithProfile extends VendorApplicationRow {
  profile?: Pick<ProfileRow, 'full_name' | 'avatar_url' | 'email'> | null;
}

export async function fetchVendorApplications(
  filter?: VendorApplicationStatus | 'all',
  page = 1,
  pageSize = 10
): Promise<{ data: VendorApplicationWithProfile[]; count: number }> {
  if (!supabase) return { data: [], count: 0 };

  let query = supabase
    .from('vendor_applications')
    .select('*, profile:profiles!vendor_applications_vendor_id_fkey(full_name, avatar_url, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (filter && filter !== 'all') {
    query = query.eq('status', filter);
  }

  const { data, count, error } = await query;
  if (error) return { data: [], count: 0 };
  return { data: (data as VendorApplicationWithProfile[]) ?? [], count: count ?? 0 };
}

export async function updateVendorApplicationStatus(
  id: string,
  status: VendorApplicationStatus,
  notes?: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };

  const update: Partial<VendorApplicationRow> = {
    status,
    reviewed_at: new Date().toISOString(),
  };
  if (notes !== undefined) update.review_notes = notes;

  const { error } = await supabase
    .from('vendor_applications')
    .update(update)
    .eq('id', id);

  return { error: error ? error.message : null };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function fetchAllUsers(
  page = 1,
  search?: string,
  pageSize = 10
): Promise<{ data: ProfileRow[]; count: number }> {
  if (!supabase) return { data: [], count: 0 };

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, count, error } = await query;
  if (error) return { data: [], count: 0 };
  return { data: data ?? [], count: count ?? 0 };
}

// ─── Activity Feed (Orders section) ──────────────────────────────────────────

export type ActivityItem =
  | { kind: 'ticket'; data: SupportTicketRow & { profile?: Pick<ProfileRow, 'full_name' | 'email'> | null } }
  | { kind: 'vendor'; data: VendorApplicationWithProfile };

export async function fetchActivityFeed(
  page = 1,
  pageSize = 20
): Promise<{ items: ActivityItem[]; hasMore: boolean }> {
  if (!supabase) return { items: [], hasMore: false };

  const [ticketsRes, vendorsRes] = await Promise.all([
    supabase
      .from('support_tickets')
      .select('*, profile:profiles!support_tickets_user_id_fkey(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(pageSize),
    supabase
      .from('vendor_applications')
      .select('*, profile:profiles!vendor_applications_vendor_id_fkey(full_name, avatar_url, email)')
      .order('created_at', { ascending: false })
      .limit(pageSize),
  ]);

  const tickets: ActivityItem[] = (ticketsRes.data ?? []).map((d) => ({
    kind: 'ticket' as const,
    data: d as SupportTicketRow & { profile?: Pick<ProfileRow, 'full_name' | 'email'> | null },
  }));

  const vendors: ActivityItem[] = (vendorsRes.data ?? []).map((d) => ({
    kind: 'vendor' as const,
    data: d as VendorApplicationWithProfile,
  }));

  const combined = [...tickets, ...vendors].sort(
    (a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime()
  );

  const start = (page - 1) * pageSize;
  const slice = combined.slice(start, start + pageSize);
  return { items: slice, hasMore: combined.length > start + pageSize };
}

// ─── Support Tickets ──────────────────────────────────────────────────────────

export async function fetchSupportTickets(
  filter?: string,
  page = 1,
  pageSize = 10
): Promise<{ data: (SupportTicketRow & { profile?: Pick<ProfileRow, 'full_name' | 'email'> | null })[]; count: number }> {
  if (!supabase) return { data: [], count: 0 };

  let query = supabase
    .from('support_tickets')
    .select('*, profile:profiles!support_tickets_user_id_fkey(full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (filter && filter !== 'all') {
    query = query.eq('status', filter as 'closed' | 'open' | 'in_progress' | 'waiting_customer' | 'resolved');
  }

  const { data, count, error } = await query;
  if (error) return { data: [], count: 0 };
  return { data: (data ?? []) as (SupportTicketRow & { profile?: Pick<ProfileRow, 'full_name' | 'email'> | null })[], count: count ?? 0 };
}

export async function updateTicketStatus(
  id: string,
  status: Database['public']['Enums']['support_ticket_status']
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase
    .from('support_tickets')
    .update({ status })
    .eq('id', id);
  return { error: error ? error.message : null };
}

// ─── Forum Posts ──────────────────────────────────────────────────────────────

export async function fetchForumPosts(
  page = 1,
  pageSize = 10
): Promise<{ data: (ForumPostRow & { profile?: Pick<ProfileRow, 'full_name' | 'email'> | null })[]; count: number }> {
  if (!supabase) return { data: [], count: 0 };

  const { data, count, error } = await supabase
    .from('forum_posts')
    .select('*, profile:profiles!forum_posts_author_id_fkey(full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) return { data: [], count: 0 };
  return { data: (data ?? []) as (ForumPostRow & { profile?: Pick<ProfileRow, 'full_name' | 'email'> | null })[], count: count ?? 0 };
}

export async function deleteForumPost(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('forum_posts').delete().eq('id', id);
  return { error: error ? error.message : null };
}

// ─── Resources (New Listing) ──────────────────────────────────────────────────

export interface NewResourceInput {
  title: string;
  description: string;
  category: ResourceCategory;
  country: string;
  city?: string;
  url?: string;
  is_free: boolean;
  created_by: string;
}

export async function createResource(input: NewResourceInput): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };

  const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;

  const { error } = await supabase.from('resources').insert({
    title: input.title,
    description: input.description,
    category: input.category,
    country: input.country,
    city: input.city ?? null,
    url: input.url ?? null,
    is_free: input.is_free,
    is_verified: true,
    created_by: input.created_by,
    slug,
  });
  return { error: error ? error.message : null };
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function generateVendorsCSV(data: VendorApplicationWithProfile[]): void {
  const headers = ['ID', 'Business Name', 'Category', 'Owner', 'Email', 'Status', 'Submitted At'];
  const rows = data.map((row) => [
    row.id,
    `"${row.business_name}"`,
    `"${row.category}"`,
    `"${row.owner_name}"`,
    `"${row.owner_email}"`,
    row.status,
    row.submitted_at ?? '',
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vendor-listings-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface WeeklyPoint {
  week: string;
  registrations: number;
  submissions: number;
}

export async function fetchAnalyticsSeries(): Promise<WeeklyPoint[]> {
  if (!supabase) return [];

  const weeks: WeeklyPoint[] = [];
  const now = new Date();

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const label = weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const [regRes, subRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStart.toISOString())
        .lt('created_at', weekEnd.toISOString()),
      supabase
        .from('vendor_applications')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStart.toISOString())
        .lt('created_at', weekEnd.toISOString()),
    ]);

    weeks.push({
      week: label,
      registrations: regRes.count ?? 0,
      submissions: subRes.count ?? 0,
    });
  }

  return weeks;
}
