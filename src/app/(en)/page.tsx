import { PageContainer, Stack } from "@/components/layout/Layout";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { ButtonLink } from "@/components/ui/Button";
import { env } from "@/config/env";
import styles from "./foundation.module.css";

export default function FrontendFoundationPage() {
  return (
    <SiteFrame locale="en-US" alternateLocaleHref="/bn/" activePath="/">
      <PageContainer className={styles.shell}>
        <div className={styles.card}>
          <Stack gap="var(--pe-space-5)">
            <div>
              <p className="pe-metadata">PE-FE-01B foundation status</p>
              <h1>ScreenWhy global UI foundation</h1>
            </div>
            <p className="pe-lead">
              Temporary ScreenWhy identity, typography, tokens, responsive layout primitives, global navigation and core interactions are wired. Official ScreenWhy logo assets and final public page designs remain intentionally deferred.
            </p>
            <dl className={styles.meta}>
              <div className={styles.row}><dt>Locale</dt><dd>en-US (root)</dd></div>
              <div className={styles.row}><dt>Data source</dt><dd>{env.dataSource}</dd></div>
              <div className={styles.row}><dt>Version</dt><dd>0.3.3</dd></div>
            </dl>
            <p className={styles.note}>Development visual QA lives at <code>/__ui/</code> and returns 404 in production builds.</p>
            <ButtonLink href="/__ui/" variant="secondary">Open UI foundation preview</ButtonLink>
          </Stack>
        </div>
      </PageContainer>
    </SiteFrame>
  );
}
