import { PageSectionContainer, PageHeroHeader, PageStateBlock } from '@/components/PageScaffold';

export function SavedResources() {
  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="Saved Resources"
        description="Access your bookmarked guides and student essentials in one place."
      />
      <PageStateBlock
        title="Resource bookmarks are coming next"
        description="Saved resource lists, tags, and quick actions will be enabled in the next phase."
      />
    </PageSectionContainer>
  );
}
