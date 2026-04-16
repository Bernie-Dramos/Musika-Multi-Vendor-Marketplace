import { Button } from '@/components/ui/button';
import {
  PageSectionContainer,
  PageHeroHeader,
  PageSectionHeader,
  PageContentCard,
  PageStateBlock,
  PageCTAFooter,
} from '@/components/PageScaffold';

export function CommunityForum() {
  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="Community Forum"
        description="Ask questions, share insights, and help fellow students succeed."
      />

      <PageSectionHeader
        title="Forum Channels"
        description="Planned channel groups for structured student discussions."
      />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <PageContentCard>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Student Life</h3>
          <p className="text-slate-600">Housing tips, routines, and adapting to a new city.</p>
        </PageContentCard>
        <PageContentCard>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Academics</h3>
          <p className="text-slate-600">Course guidance, peer advice, and university-specific support.</p>
        </PageContentCard>
        <PageContentCard>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Marketplace Help</h3>
          <p className="text-slate-600">Buyer and vendor discussions for trusted transactions.</p>
        </PageContentCard>
      </div>

      <PageStateBlock
        title="Posting, replies, and voting are next"
        description="Phase 3 will introduce feed tabs, post creation, threaded replies, and moderation actions."
        action={<Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white">Coming Soon</Button>}
      />

      <PageCTAFooter
        title="Want to start a discussion topic?"
        description="Tell us what community channels you want first, and we will prioritize launch order."
        action={<Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Submit Topic Idea</Button>}
      />
    </PageSectionContainer>
  );
}
