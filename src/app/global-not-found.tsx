import type { Metadata } from "next";
import { fontVariableClassName } from "@/app/fonts";
import { PageContainer, Section } from "@/components/layout/Layout";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { BrowseRecovery, RecoverySearch, UtilityState } from "@/features/utility-states";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Page not found | ScreenWhy",
  description: "The requested ScreenWhy page could not be found.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en-US" className={fontVariableClassName}>
      <body>
        <SiteFrame locale="en-US">
          <Section>
            <PageContainer>
              <UtilityState
                eyebrow="404"
                title="Page not found"
                description={<p>The page you're looking for doesn't exist or may have moved.</p>}
              >
                <RecoverySearch />
                <BrowseRecovery />
              </UtilityState>
            </PageContainer>
          </Section>
        </SiteFrame>
      </body>
    </html>
  );
}
