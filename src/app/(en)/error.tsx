"use client";

import { PageContainer, Section } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { StateShell } from "@/components/ui/Primitives";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <Section>
      <PageContainer>
        <StateShell title="Frontend error" tone="error" action={<Button variant="secondary" onClick={reset}>Try again</Button>}>
          The technical foundation encountered an unexpected error.
        </StateShell>
      </PageContainer>
    </Section>
  );
}
