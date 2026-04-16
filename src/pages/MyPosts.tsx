import { PageSectionContainer, PageHeroHeader, PageStateBlock } from '@/components/PageScaffold';

export function MyPosts() {
  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="My Posts"
        description="Manage your discussions, drafts, and community engagement."
      />
      <PageStateBlock
        title="Post management tools are coming next"
        description="Drafts, published posts, and moderation history will be available in Phase 3."
      />
    </PageSectionContainer>
  );
}
