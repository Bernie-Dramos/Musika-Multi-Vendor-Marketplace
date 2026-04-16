import {
  getInternationalResourceBySlug,
  internationalResources,
  type InternationalResource,
} from '@/lib/internationalResources';

const apiDelayMs = 120;

const withDelay = <T,>(payload: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(payload), apiDelayMs);
  });

export async function fetchInternationalResources(): Promise<InternationalResource[]> {
  return withDelay(internationalResources);
}

export async function fetchInternationalResourceBySlug(
  slug: string
): Promise<InternationalResource | null> {
  return withDelay(getInternationalResourceBySlug(slug) ?? null);
}
