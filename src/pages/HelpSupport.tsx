import { Button } from '@/components/ui/button';
import {
  PageSectionContainer,
  PageHeroHeader,
  PageSectionHeader,
  PageContentCard,
  PageFilterSidebar,
  PageStateBlock,
} from '@/components/PageScaffold';

export function HelpSupport() {
  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="Help & Support"
        description="Get answers quickly and contact support when you need help."
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        <PageFilterSidebar title="Support Categories">
          <p>Account Access</p>
          <p>Orders & Payments</p>
          <p>Vendor Verification</p>
          <p>Safety & Reporting</p>
          <p>General FAQs</p>
        </PageFilterSidebar>

        <div>
          <PageSectionHeader
            title="Help Center"
            description="FAQs and support workflows will be expanded in Phase 3."
            action={<Button variant="outline" className="border-slate-300">Browse Articles</Button>}
          />

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <PageContentCard>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">FAQ</h3>
              <p className="text-slate-600">Instant answers for common account and marketplace questions.</p>
            </PageContentCard>
            <PageContentCard>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Support Tickets</h3>
              <p className="text-slate-600">Create and track support requests with status updates.</p>
            </PageContentCard>
          </div>

          <PageStateBlock
            title="Ticketing and article search coming next"
            description="Phase 3 adds searchable articles, contact forms, and support ticket history."
            action={<Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white">Coming Soon</Button>}
          />
        </div>
      </div>
    </PageSectionContainer>
  );
}
