import { PageContainer, Section } from "@/components/layout/Layout";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { PageLoadingState } from "@/features/utility-states";

export default function Loading() {
  return (
    <SiteFrame locale="en-US">
      <Section>
        <PageContainer>
          <PageLoadingState />
        </PageContainer>
      </Section>
    </SiteFrame>
  );
}
