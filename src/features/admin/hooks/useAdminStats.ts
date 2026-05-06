import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchDashboardStats,
  fetchVendorApplications,
  updateVendorApplicationStatus,
} from '@/lib/admin';
import type { Database } from '@/lib/database.types';

type VendorApplicationStatus = Database['public']['Enums']['vendor_application_status'];

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchDashboardStats,
    staleTime: 30_000,
  });
}

export function useAdminVendors(
  filter?: VendorApplicationStatus | 'all',
  page = 1,
  pageSize = 10
) {
  return useQuery({
    queryKey: ['adminVendors', filter, page, pageSize],
    queryFn: () => fetchVendorApplications(filter, page, pageSize),
    staleTime: 30_000,
  });
}

export function useUpdateVendorStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: VendorApplicationStatus;
      notes?: string;
    }) => updateVendorApplicationStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVendors'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}
