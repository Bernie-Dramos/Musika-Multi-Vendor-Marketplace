import { Link } from 'react-router-dom';
import { BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useSavedResourcesQuery,
  useUnsaveResourceMutation,
} from '@/features/resources/hooks/useInternationalResources';
import { Button } from '@/components/ui/button';
import { PageSectionContainer, PageHeroHeader, PageContentCard } from '@/components/PageScaffold';
import { PageEmptyState, PageErrorState, PageLoadingState } from '@/components/QueryStates';

export function SavedResources() {
  const { user } = useAuth();
  const savedResourcesQuery = useSavedResourcesQuery(user?.id);
  const unsaveMutation = useUnsaveResourceMutation();

  const resources = savedResourcesQuery.data ?? [];

  const handleRemove = async (resourceId: number) => {
    if (!user) {
      return;
    }
    await unsaveMutation.mutateAsync({ userId: user.id, resourceId });
  };

  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="Saved Resources"
        description="Access your bookmarked guides and student essentials in one place."
      />

      {savedResourcesQuery.isLoading ? <PageLoadingState title="Loading saved resources" /> : null}

      {savedResourcesQuery.isError ? (
        <PageErrorState
          title="Unable to load saved resources"
          description="Please try again in a moment."
          onRetry={() => savedResourcesQuery.refetch()}
        />
      ) : null}

      {!savedResourcesQuery.isLoading && !savedResourcesQuery.isError && resources.length === 0 ? (
        <PageEmptyState
          title="No saved resources yet"
          description="Browse International Resources and save guides you want to revisit."
          action={
            <Link to="/international-resources">
              <Button className="bg-[#0F172A] text-white hover:bg-[#1E293B]">Explore Resources</Button>
            </Link>
          }
        />
      ) : null}

      {!savedResourcesQuery.isLoading && !savedResourcesQuery.isError && resources.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <PageContentCard key={resource.id} className="flex h-full flex-col">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-[#0F172A] leading-tight">{resource.title}</h3>
                <BookmarkCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mb-4 text-sm text-slate-600">{resource.summary}</p>
              <p className="mb-1 text-xs text-slate-500">{resource.category}</p>
              <p className="mb-4 text-xs text-slate-500">
                {resource.city}, {resource.country}
              </p>
              <div className="mt-auto flex gap-2">
                <Link to={`/international-resources/${resource.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full border-slate-300">
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-slate-300"
                  disabled={unsaveMutation.isPending}
                  onClick={() => {
                    void handleRemove(resource.id);
                  }}
                >
                  Remove
                </Button>
              </div>
            </PageContentCard>
          ))}
        </div>
      ) : null}
    </PageSectionContainer>
  );
}
