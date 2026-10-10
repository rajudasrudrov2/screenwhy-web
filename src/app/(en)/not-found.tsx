import { PageContainer, Section } from "@/components/layout/Layout";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { BrowseRecovery, RecoverySearch, UtilityState } from "@/features/utility-states";

export default function NotFound() {
  return (
    <SiteFrame locale="en-US">
      <Section>
        <PageContainer>
          <UtilityState
            eyebrow="404"
            title="Page not found"
            description={<p>The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>}
          >
            <RecoverySearch />
            <BrowseRecovery />
          </UtilityState>
        </PageContainer>
      </Section>
    </SiteFrame>
  );
}
