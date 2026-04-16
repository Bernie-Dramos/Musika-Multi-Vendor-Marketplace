import { useQuery } from '@tanstack/react-query';
import {
  fetchInternationalResourceBySlug,
  fetchInternationalResources,
} from '@/features/resources/api/internationalResourcesApi';

export function useInternationalResourcesQuery() {
  return useQuery({
    queryKey: ['international-resources'],
    queryFn: fetchInternationalResources,
  });
}

export function useInternationalResourceBySlugQuery(slug: string) {
  return useQuery({
    queryKey: ['international-resource', slug],
    queryFn: () => fetchInternationalResourceBySlug(slug),
    enabled: Boolean(slug),
  });
}
