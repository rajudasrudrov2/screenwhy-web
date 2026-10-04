import { PageContainer, Stack } from "@/components/layout/Layout";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { env } from "@/config/env";
import styles from "./foundation.module.css";

export default function BanglaFoundationPage() {
  return (
    <SiteFrame locale="bn-BD" alternateLocaleHref="/" activePath="/bn/">
      <PageContainer className={styles.shell}>
        <div className={styles.card}>
          <Stack gap="var(--pe-space-5)">
            <div>
              <p className="pe-metadata">PE-FE-01B foundation status</p>
              <h1>ScreenWhy বাংলা UI ফাউন্ডেশন</h1>
            </div>
            <p className="pe-lead">ScreenWhy temporary text identity, বাংলা টাইপোগ্রাফি, responsive layout এবং global navigation foundation সক্রিয় আছে। এটি কোনো English editorial fallback নয়।</p>
            <dl className={styles.meta}>
              <div className={styles.row}><dt>Locale</dt><dd>bn-BD</dd></div>
              <div className={styles.row}><dt>Data source</dt><dd>{env.dataSource}</dd></div>
              <div className={styles.row}><dt>Version</dt><dd>0.3.3</dd></div>
            </dl>
            <p className={styles.note}>Final বাংলা editorial content এবং domain components পরের frontend workstream-এ data contract অনুযায়ী যুক্ত হবে।</p>
          </Stack>
        </div>
      </PageContainer>
    </SiteFrame>
  );
}
