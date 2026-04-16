import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { formatVendorStatus, useVendorApplicationQuery } from '@/features/vendor/hooks/useVendorApplication';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageSectionContainer, PageHeroHeader, PageContentCard } from '@/components/PageScaffold';
import { PageErrorState, PageLoadingState } from '@/components/QueryStates';

export function VendorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const applicationQuery = useVendorApplicationQuery(user?.id);
  const application = applicationQuery.data;

  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="Vendor Dashboard"
        description="Track listings, orders, and growth in one place."
      />

      {applicationQuery.isLoading ? <PageLoadingState title="Loading vendor dashboard" /> : null}

      {applicationQuery.isError ? (
        <PageErrorState
          title="Unable to load vendor status"
          description="Please retry in a moment."
          onRetry={() => applicationQuery.refetch()}
        />
      ) : null}

      {!applicationQuery.isLoading && !applicationQuery.isError && !application ? (
        <PageContentCard className="space-y-4 text-center">
          <h2 className="text-xl font-semibold text-[#0F172A]">No active vendor application</h2>
          <p className="text-sm text-slate-600">
            Start your onboarding to submit a vendor application and unlock seller tools.
          </p>
          <Button onClick={() => navigate('/become-vendor')} className="bg-emerald-600 text-white hover:bg-emerald-700">
            Start Onboarding
          </Button>
        </PageContentCard>
      ) : null}

      {!applicationQuery.isLoading && !applicationQuery.isError && application ? (
        <PageContentCard className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#0F172A]">{application.business_name}</h2>
              <p className="text-sm text-slate-600">Application ID: {application.id}</p>
            </div>
            <Badge className="capitalize">{formatVendorStatus(application.status)}</Badge>
          </div>

          <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <p>
              <span className="font-medium text-[#0F172A]">Owner:</span> {application.owner_name}
            </p>
            <p>
              <span className="font-medium text-[#0F172A]">Category:</span> {application.category}
            </p>
            <p>
              <span className="font-medium text-[#0F172A]">Business Type:</span> {application.business_type.replace('_', ' ')}
            </p>
            <p>
              <span className="font-medium text-[#0F172A]">Submitted:</span>{' '}
              {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : 'Draft'}
            </p>
          </div>

          {application.review_notes ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-medium text-[#0F172A]">Review Notes</p>
              <p className="mt-1">{application.review_notes}</p>
            </div>
          ) : null}
        </PageContentCard>
      ) : null}
    </PageSectionContainer>
  );
}
