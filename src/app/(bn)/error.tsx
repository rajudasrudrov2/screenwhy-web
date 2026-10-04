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
        <StateShell title="ফ্রন্টএন্ড ত্রুটি" tone="error" action={<Button variant="secondary" onClick={reset}>আবার চেষ্টা করুন</Button>}>
          টেকনিক্যাল ফাউন্ডেশনে একটি অপ্রত্যাশিত সমস্যা হয়েছে।
        </StateShell>
      </PageContainer>
    </Section>
  );
}
