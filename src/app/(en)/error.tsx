"use client";

import { PageContainer, Section } from "@/components/layout/Layout";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { RetryableFailure } from "@/features/utility-states";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <SiteFrame locale="en-US">
      <Section>
        <PageContainer>
          <RetryableFailure onRetry={reset} />
        </PageContainer>
      </Section>
    </SiteFrame>
  );
}
