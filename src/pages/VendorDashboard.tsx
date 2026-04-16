import { PageSectionContainer, PageHeroHeader, PageStateBlock } from '@/components/PageScaffold';

export function VendorDashboard() {
  return (
    <PageSectionContainer>
      <PageHeroHeader
        title="Vendor Dashboard"
        description="Track listings, orders, and growth in one place."
      />
      <PageStateBlock
        title="Vendor analytics and tools are coming next"
        description="Inventory controls, listing performance, and fulfillment workflows will be added in upcoming phases."
      />
    </PageSectionContainer>
  );
}
