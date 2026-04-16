import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchInternationalResourceBySlug,
  fetchInternationalResources,
  fetchSavedResourceIds,
  fetchSavedResources,
  saveResource,
  unsaveResource,
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

export function useSavedResourceIdsQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['saved-resource-ids', userId],
    queryFn: () => fetchSavedResourceIds(userId!),
    enabled: Boolean(userId),
  });
}

export function useSavedResourcesQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['saved-resources', userId],
    queryFn: () => fetchSavedResources(userId!),
    enabled: Boolean(userId),
  });
}

export function useSaveResourceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, resourceId }: { userId: string; resourceId: number }) =>
      saveResource(userId, resourceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['saved-resource-ids', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['saved-resources', variables.userId] });
    },
  });
}

export function useUnsaveResourceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, resourceId }: { userId: string; resourceId: number }) =>
      unsaveResource(userId, resourceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['saved-resource-ids', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['saved-resources', variables.userId] });
    },
  });
}
