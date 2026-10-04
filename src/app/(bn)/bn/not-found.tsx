import { PageContainer, Section } from "@/components/layout/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { StateShell } from "@/components/ui/Primitives";

export default function NotFound() {
  return (
    <Section>
      <PageContainer>
        <StateShell title="পৃষ্ঠা পাওয়া যায়নি" action={<ButtonLink href="/bn/" variant="secondary">বাংলা ফাউন্ডেশনে ফিরে যান</ButtonLink>}>
          এই রুটটি PE-FE-01B ফাউন্ডেশনে এখনো implement করা হয়নি। Final branded 404 design পরের task-এ হবে।
        </StateShell>
      </PageContainer>
    </Section>
  );
}
