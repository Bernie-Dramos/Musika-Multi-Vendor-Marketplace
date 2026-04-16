import { PageSectionContainer, PageHeroHeader, PageStateBlock } from '@/components/PageScaffold';

export function Profile() {
  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="My Profile"
        description="Manage your account details, saved items, and activity."
      />
      <PageStateBlock
        title="Profile features are being prepared"
        description="Detailed profile management, preferences, and account controls will be added in the next phase."
      />
    </PageSectionContainer>
  );
}
