import { PageContainer, Section } from "@/components/layout/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { StateShell } from "@/components/ui/Primitives";

export default function NotFound() {
  return (
    <Section>
      <PageContainer>
        <StateShell title="Page not found" action={<ButtonLink href="/" variant="secondary">Return to foundation</ButtonLink>}>
          This route is not implemented in the PE-FE-01B foundation. Final branded 404 design is intentionally deferred.
        </StateShell>
      </PageContainer>
    </Section>
  );
}
