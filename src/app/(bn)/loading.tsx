import { PageContainer, Section } from "@/components/layout/Layout";
import { Skeleton, StateShell } from "@/components/ui/Primitives";

export default function Loading() {
  return (
    <Section>
      <PageContainer>
        <StateShell title="ScreenWhy লোড হচ্ছে…" tone="loading">
          <Skeleton width="min(100%, 28rem)" />
        </StateShell>
      </PageContainer>
    </Section>
  );
}
