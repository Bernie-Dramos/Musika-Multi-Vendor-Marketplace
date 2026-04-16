import { Button } from '@/components/ui/button';
import {
  PageSectionContainer,
  PageHeroHeader,
  PageSectionHeader,
  PageContentCard,
  PageStateBlock,
  PageCTAFooter,
} from '@/components/PageScaffold';

export function InternationalResources() {
  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="International Resources"
        description="Curated guides, legal resources, and verified links for international students."
      />

      <PageSectionHeader
        title="Resource Highlights"
        description="A quick overview of what will be searchable in Phase 3."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <PageContentCard>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Visa & Documentation</h3>
          <p className="text-slate-600">Country-specific checklists, embassy links, and renewal timelines.</p>
        </PageContentCard>
        <PageContentCard>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Housing & Transport</h3>
          <p className="text-slate-600">Verified accommodation guides and commute resources near campus.</p>
        </PageContentCard>
        <PageContentCard>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Health & Emergency</h3>
          <p className="text-slate-600">Trusted healthcare providers and emergency support references.</p>
        </PageContentCard>
      </div>

      <PageStateBlock
        title="Search and bookmark flow coming next"
        description="Phase 3 will add search, category filters, bookmarks, and source verification labels for each resource."
        action={<Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white">Coming Soon</Button>}
      />

      <PageCTAFooter
        title="Need a specific resource right now?"
        description="Use Help & Support and tell us what you need. We will prioritize high-demand guides."
        action={<Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Request a Resource</Button>}
      />
    </PageSectionContainer>
  );
}
