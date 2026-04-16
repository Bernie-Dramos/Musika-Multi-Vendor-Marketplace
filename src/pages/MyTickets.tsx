import { PageSectionContainer, PageHeroHeader, PageStateBlock } from '@/components/PageScaffold';

export function MyTickets() {
  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="My Tickets"
        description="Track support requests and status updates from the support team."
      />
      <PageStateBlock
        title="Ticket timeline and messaging are coming next"
        description="Ticket statuses, threaded support replies, and attachments will be implemented in upcoming phases."
      />
    </PageSectionContainer>
  );
}
