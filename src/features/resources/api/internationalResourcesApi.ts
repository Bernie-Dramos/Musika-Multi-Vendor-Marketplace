import {
  getInternationalResourceBySlug,
  internationalResources,
  type InternationalResource,
} from '@/lib/internationalResources';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { ResourceRow } from '@/lib/database.types';

const apiDelayMs = 120;

const withDelay = <T,>(payload: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(payload), apiDelayMs);
  });

export async function fetchInternationalResources(): Promise<InternationalResource[]> {
  if (!isSupabaseConfigured || !supabase) {
    return withDelay(internationalResources);
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to load resources');
  }

  return (data ?? []).map(mapResourceRowToViewModel);
}

export async function fetchInternationalResourceBySlug(
  slug: string
): Promise<InternationalResource | null> {
  if (!isSupabaseConfigured || !supabase) {
    return withDelay(getInternationalResourceBySlug(slug) ?? null);
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Failed to load resource');
  }

  return data ? mapResourceRowToViewModel(data) : null;
}

export async function fetchSavedResourceIds(userId: string): Promise<number[]> {
  if (!isSupabaseConfigured || !supabase) {
    return withDelay([]);
  }

  const { data, error } = await supabase
    .from('saved_resources')
    .select('resource_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to load saved resources');
  }

  return (data ?? []).map((entry) => entry.resource_id);
}

export async function fetchSavedResources(userId: string): Promise<InternationalResource[]> {
  if (!isSupabaseConfigured || !supabase) {
    return withDelay([]);
  }

  const savedIds = await fetchSavedResourceIds(userId);
  if (savedIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .in('id', savedIds)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to load saved resource details');
  }

  return (data ?? []).map(mapResourceRowToViewModel);
}

export async function saveResource(userId: string, resourceId: number): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const { error } = await supabase.from('saved_resources').insert({
    user_id: userId,
    resource_id: resourceId,
  });

  if (error && error.code !== '23505') {
    throw new Error(error.message || 'Failed to save resource');
  }
}

export async function unsaveResource(userId: string, resourceId: number): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const { error } = await supabase
    .from('saved_resources')
    .delete()
    .eq('user_id', userId)
    .eq('resource_id', resourceId);

  if (error) {
    throw new Error(error.message || 'Failed to unsave resource');
  }
}

function mapResourceRowToViewModel(row: ResourceRow): InternationalResource {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.description,
    category: mapResourceCategory(row.category),
    country: row.country,
    city: row.city ?? 'N/A',
    verified: row.is_verified,
    sourceName: row.url ? new URL(row.url).hostname.replace('www.', '') : 'Musika Verified Source',
    sourceUrl: row.url ?? '#',
    updatedAt: row.updated_at,
    tags: [row.category, row.country, row.city ?? 'general'],
  };
}

function mapResourceCategory(category: ResourceRow['category']): InternationalResource['category'] {
  const mapping: Record<ResourceRow['category'], InternationalResource['category']> = {
    visa: 'Visa & Legal',
    legal: 'Visa & Legal',
    housing: 'Housing',
    transport: 'Transportation',
    healthcare: 'Healthcare',
    discounts: 'Academics',
    emergency: 'Safety',
  };

  return mapping[category];
}
