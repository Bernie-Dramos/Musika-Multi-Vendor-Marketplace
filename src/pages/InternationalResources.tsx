import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Flag, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageEmptyState, PageErrorState, PageLoadingState } from '@/components/QueryStates';
import {
  PageSectionContainer,
  PageHeroHeader,
  PageSectionHeader,
  PageContentCard,
  PageCTAFooter,
} from '@/components/PageScaffold';
import { featuredResourceSlugs, type InternationalResource } from '@/lib/internationalResources';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useInternationalResourcesQuery } from '@/features/resources/hooks/useInternationalResources';

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

export function InternationalResources() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [savedResourceIds, setSavedResourceIds] = useState<number[]>(() => getSavedResources());
  const [reportedResourceIds, setReportedResourceIds] = useState<number[]>([]);
  const resourcesQuery = useInternationalResourcesQuery();
  const resources = useMemo(() => resourcesQuery.data ?? [], [resourcesQuery.data]);

  const categories = useMemo(
    () => ['all', ...new Set(resources.map((resource) => resource.category))],
    [resources]
  );
  const countries = useMemo(
    () => ['all', ...new Set(resources.map((resource) => resource.country))],
    [resources]
  );
  const cities = useMemo(() => ['all', ...new Set(resources.map((resource) => resource.city))], [resources]);

  const featuredResources = useMemo(
    () => resources.filter((resource) => featuredResourceSlugs.includes(resource.slug)),
    [resources]
  );

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return resources.filter((resource) => {
      const queryMatch =
        normalizedQuery.length === 0 ||
        resource.title.toLowerCase().includes(normalizedQuery) ||
        resource.summary.toLowerCase().includes(normalizedQuery) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;
      const countryMatch = selectedCountry === 'all' || resource.country === selectedCountry;
      const cityMatch = selectedCity === 'all' || resource.city === selectedCity;
      const verifiedMatch = !showVerifiedOnly || resource.verified;

      return queryMatch && categoryMatch && countryMatch && cityMatch && verifiedMatch;
    });
  }, [query, selectedCategory, selectedCountry, selectedCity, showVerifiedOnly, resources]);

  const toggleSave = (resourceId: number) => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    const nextSaved = savedResourceIds.includes(resourceId)
      ? savedResourceIds.filter((id) => id !== resourceId)
      : [...savedResourceIds, resourceId];

    setSavedResourceIds(nextSaved);
    localStorage.setItem(savedResourcesKey, JSON.stringify(nextSaved));
  };

  const reportResource = (resourceId: number) => {
    if (reportedResourceIds.includes(resourceId)) {
      return;
    }
    setReportedResourceIds((prev) => [...prev, resourceId]);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedCountry('all');
    setSelectedCity('all');
    setShowVerifiedOnly(false);
  };

  const renderResourceCard = (resource: InternationalResource) => {
    const isSaved = savedResourceIds.includes(resource.id);
    const isReported = reportedResourceIds.includes(resource.id);

    return (
      <PageContentCard key={resource.id} className="h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-[#0F172A] leading-tight">{resource.title}</h3>
          <span
            className={`text-xs rounded-full px-2 py-1 ${
              resource.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {resource.verified ? 'Verified' : 'Community'}
          </span>
        </div>

        <p className="text-slate-600 text-sm mb-4">{resource.summary}</p>

        <div className="text-sm text-slate-500 mb-4 space-y-1">
          <p>{resource.category}</p>
          <p>
            {resource.city}, {resource.country}
          </p>
          <p>{resource.sourceName}</p>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2">
          <Link to={`/international-resources/${resource.slug}`} className="col-span-3">
            <Button variant="outline" className="w-full border-slate-300">
              View Details
            </Button>
          </Link>
          <Button variant="outline" className="border-slate-300 gap-1" onClick={() => toggleSave(resource.id)}>
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button
            variant="outline"
            className="border-slate-300 gap-1 col-span-2"
            disabled={isReported}
            onClick={() => reportResource(resource.id)}
          >
            <Flag className="w-4 h-4" />
            {isReported ? 'Reported' : 'Report'}
          </Button>
        </div>
      </PageContentCard>
    );
  };

  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="International Resources"
        description="Curated guides, legal resources, and verified links for international students."
      />

      {resourcesQuery.isLoading ? <PageLoadingState title="Loading resources" /> : null}

      {resourcesQuery.isError ? (
        <PageErrorState
          title="Unable to load resources"
          description="We couldn't load international resources right now."
          onRetry={() => resourcesQuery.refetch()}
        />
      ) : null}

      {!resourcesQuery.isLoading && !resourcesQuery.isError && resources.length === 0 ? (
        <PageEmptyState
          title="No resources available"
          description="Resources will appear here once published."
        />
      ) : null}

      {!resourcesQuery.isLoading && !resourcesQuery.isError && resources.length > 0 ? (
        <>

          <PageSectionHeader
            title="Find the right resource"
            description="Search by topic, location, and verification status."
          />

          <PageContentCard className="mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search resources"
                  className="w-full h-10 pl-10 pr-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-10 border border-slate-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
                className="h-10 border border-slate-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country === 'all' ? 'All countries' : country}
                  </option>
                ))}
              </select>
              <select
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
                className="h-10 border border-slate-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All cities' : city}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showVerifiedOnly}
                  onChange={(event) => setShowVerifiedOnly(event.target.checked)}
                  className="rounded border-slate-300"
                />
                Show verified sources only
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Saved: {savedResourceIds.length}</span>
                <Button variant="outline" className="border-slate-300" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            </div>
          </PageContentCard>

          <PageSectionHeader title="Featured Resources" />
          <div className="grid md:grid-cols-3 gap-4 mb-8">{featuredResources.map((resource) => renderResourceCard(resource))}</div>

          <PageSectionHeader
            title="All Resources"
            description={`${filteredResources.length} resource${filteredResources.length === 1 ? '' : 's'} found`}
          />

          {filteredResources.length === 0 ? (
            <PageEmptyState
              title="No resources match these filters"
              description="Try broadening your filters or searching with different keywords."
              action={
                <Button onClick={clearFilters} className="bg-[#0F172A] hover:bg-[#1E293B] text-white">
                  Reset Filters
                </Button>
              }
            />
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">{filteredResources.map((resource) => renderResourceCard(resource))}</div>
          )}

          <PageCTAFooter
            title="Need a specific resource right now?"
            description="Use Help & Support and tell us what you need. We will prioritize high-demand guides."
            action={<Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Request a Resource</Button>}
          />
        </>
      ) : null}
    </PageSectionContainer>
  );
}
