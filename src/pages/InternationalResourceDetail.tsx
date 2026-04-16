import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ExternalLink, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageEmptyState, PageErrorState, PageLoadingState } from '@/components/QueryStates';
import {
  PageSectionContainer,
  PageHeroHeader,
  PageSectionHeader,
  PageContentCard,
} from '@/components/PageScaffold';
import { type InternationalResource } from '@/lib/internationalResources';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  useInternationalResourceBySlugQuery,
  useInternationalResourcesQuery,
} from '@/features/resources/hooks/useInternationalResources';

const savedResourcesKey = 'musika.savedResources';

function getSavedResources(): number[] {
  const stored = localStorage.getItem(savedResourcesKey);
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed.filter((entry): entry is number => typeof entry === 'number');
    }
  } catch {
    return [];
  }
  return [];
}

export function InternationalResourceDetail() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [savedResourceIds, setSavedResourceIds] = useState<number[]>(() => getSavedResources());
  const [reportedResourceIds, setReportedResourceIds] = useState<number[]>([]);
  const resourceQuery = useInternationalResourceBySlugQuery(slug);
  const resourcesQuery = useInternationalResourcesQuery();

  const resource = resourceQuery.data;
  const allResources = useMemo(() => resourcesQuery.data ?? [], [resourcesQuery.data]);

  const relatedResources = useMemo(() => {
    if (!resource) {
      return [] as InternationalResource[];
    }
    return allResources
      .filter((entry) => entry.category === resource.category && entry.slug !== resource.slug)
      .slice(0, 3);
  }, [resource, allResources]);

  if (resourceQuery.isLoading || resourcesQuery.isLoading) {
    return (
      <PageSectionContainer>
        <PageLoadingState title="Loading resource details" />
      </PageSectionContainer>
    );
  }

  if (resourceQuery.isError || resourcesQuery.isError) {
    return (
      <PageSectionContainer>
        <PageErrorState
          title="Unable to load resource details"
          description="Something went wrong while loading this resource."
          onRetry={() => {
            resourceQuery.refetch();
            resourcesQuery.refetch();
          }}
        />
      </PageSectionContainer>
    );
  }

  if (!resource) {
    return (
      <PageSectionContainer>
        <PageEmptyState
          title="Resource not found"
          description="The resource you are looking for may have been moved or removed."
          action={
            <Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white" onClick={() => navigate('/international-resources')}>
              Back to Resources
            </Button>
          }
        />
      </PageSectionContainer>
    );
  }

  const isSaved = savedResourceIds.includes(resource.id);
  const isReported = reportedResourceIds.includes(resource.id);

  const toggleSave = () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    const nextSaved = isSaved
      ? savedResourceIds.filter((id) => id !== resource.id)
      : [...savedResourceIds, resource.id];

    setSavedResourceIds(nextSaved);
    localStorage.setItem(savedResourcesKey, JSON.stringify(nextSaved));
  };

  const reportResource = () => {
    if (isReported) {
      return;
    }
    setReportedResourceIds((prev) => [...prev, resource.id]);
  };

  return (
    <PageSectionContainer>
      <div className="text-sm text-slate-500 mb-4">
        <Link to="/international-resources" className="hover:text-[#0F172A] transition-colors">
          International Resources
        </Link>
        <span className="mx-2">/</span>
        <span>{resource.title}</span>
      </div>

      <PageHeroHeader title={resource.title} description={resource.summary} />

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <PageContentCard>
          <PageSectionHeader title="Resource Details" />
          <div className="space-y-4 text-slate-700">
            <p>
              <span className="font-semibold text-[#0F172A]">Category:</span> {resource.category}
            </p>
            <p>
              <span className="font-semibold text-[#0F172A]">Location:</span> {resource.city}, {resource.country}
            </p>
            <p>
              <span className="font-semibold text-[#0F172A]">Source:</span> {resource.sourceName}
            </p>
            <p>
              <span className="font-semibold text-[#0F172A]">Last Updated:</span> {new Date(resource.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {resource.tags.map((tag) => (
                <span key={tag} className="text-xs rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </PageContentCard>

        <PageContentCard>
          <PageSectionHeader title="Actions" />
          <div className="space-y-3">
            <a href={resource.sourceUrl} target="_blank" rel="noreferrer">
              <Button className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white gap-2">
                Open Source
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
            <Button variant="outline" className="w-full border-slate-300 gap-2" onClick={toggleSave}>
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
              {isSaved ? 'Saved' : 'Save Resource'}
            </Button>
            <Button
              variant="outline"
              className="w-full border-slate-300 gap-2"
              disabled={isReported}
              onClick={reportResource}
            >
              <Flag className="w-4 h-4" />
              {isReported ? 'Reported' : 'Report Resource'}
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {resource.verified ? 'Verified source' : 'Community source (under review)'}
          </p>
        </PageContentCard>
      </div>

      <div className="mt-8">
        <PageSectionHeader title="Related Resources" />
        <div className="grid md:grid-cols-3 gap-4">
          {relatedResources.map((entry) => (
            <PageContentCard key={entry.id}>
              <h3 className="font-semibold text-[#0F172A] mb-2">{entry.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{entry.summary}</p>
              <Link to={`/international-resources/${entry.slug}`}>
                <Button variant="outline" className="border-slate-300 w-full">
                  View Details
                </Button>
              </Link>
            </PageContentCard>
          ))}
        </div>
      </div>
    </PageSectionContainer>
  );
}
