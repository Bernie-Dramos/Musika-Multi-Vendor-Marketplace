import { Button } from '@/components/ui/button';
import {
  PageSectionContainer,
  PageHeroHeader,
  PageSectionHeader,
  PageContentCard,
  PageStateBlock,
  PageCTAFooter,
} from '@/components/PageScaffold';

export function BecomeVendor() {
  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="Become a Vendor"
        description="Launch your student business on Musika with trusted verification."
      />

      <PageSectionHeader
        title="Why join Musika as a vendor"
        description="Planned onboarding benefits included in the upcoming vendor flow."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <PageContentCard>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Verified Trust</h3>
          <p className="text-slate-600">Build confidence with profile verification and credibility badges.</p>
        </PageContentCard>
        <PageContentCard>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Student Audience</h3>
          <p className="text-slate-600">Reach international students actively searching for services and products.</p>
        </PageContentCard>
        <PageContentCard>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Simple Onboarding</h3>
          <p className="text-slate-600">Guided setup for profile, documents, listings, and business preferences.</p>
        </PageContentCard>
      </div>

      <PageStateBlock
        title="Vendor application wizard coming next"
        description="Phase 3 will add step-based onboarding, document upload, and application status tracking."
        action={<Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white">Coming Soon</Button>}
      />

      <PageCTAFooter
        title="Ready to start selling with Musika?"
        description="Join the early vendor list to get notified when onboarding opens."
        action={<Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Join Vendor Waitlist</Button>}
      />
    </PageSectionContainer>
  );
}
