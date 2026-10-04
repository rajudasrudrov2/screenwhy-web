import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ArrowRightIcon } from "@/components/icons/Icons";
import { Grid, PageContainer, ReadingColumn, Section, Stack, WideContainer } from "@/components/layout/Layout";
import { MediaFrame } from "@/components/layout/MediaFrame";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { Button, ButtonLink, IconButton } from "@/components/ui/Button";
import { Checkbox, Radio, SearchInput, Select, SelectOption, Textarea, TextInput } from "@/components/ui/FormControls";
import { Badge, Disclosure, Divider, Skeleton, StateShell } from "@/components/ui/Primitives";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "UI Foundation Preview",
  robots: { index: false, follow: false, nocache: true },
};

const swatches = [
  ["Plot Ink", "#121722"],
  ["Clarity Amber", "#F0B44D"],
  ["Explanation Indigo", "#4F5BD5"],
  ["Insight Teal", "#177E75"],
  ["Canvas", "#FFFFFF"],
  ["Subtle", "#F7F8FA"],
  ["Default border", "#D7DCE4"],
  ["Error", "#A7352A"],
] as const;

const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] as const;

type SwatchStyle = CSSProperties & { "--swatch": string };
type SpacingStyle = CSSProperties & { "--space-size": string };

export default function UiFoundationPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <SiteFrame locale="en-US" activePath="/__ui/">
      <div className={styles.preview}>
        <PageContainer>
          <div className={styles.headerBlock}>
            <Stack gap="var(--pe-space-4)">
              <p className={styles.eyebrow}>Development only · noindex · production returns 404</p>
              <h1>ScreenWhy global UI foundation</h1>
              <p className="pe-lead">Brand, tokens, responsive shell and generic interaction primitives only. This is a component-verification surface, not a public page design.</p>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "UI foundation preview" }]} />
            </Stack>
          </div>
        </PageContainer>

        <PageContainer>
          <section className={styles.board}>
            <h2 className={styles.sectionTitle}>Temporary ScreenWhy identity</h2>
            <Grid mobile={1} tablet={2} gap="var(--pe-space-5)">
              <div className={styles.panel}>
                <Stack>
                  <p className="pe-metadata">Text identity · light surface</p>
                  <BrandLogo kind="horizontal" surface="light" width={160} href="/__ui/" />
                  <p className={styles.note}>Temporary text fallback only. Official ScreenWhy logo asset is pending.</p>
                </Stack>
              </div>
              <div className={styles.panel}>
                <Stack>
                  <p className="pe-metadata">Compact text identity · light surface</p>
                  <BrandLogo kind="mark" surface="light" width={28} href="/__ui/" />
                  <p className={styles.note}>Temporary ScreenWhy text fallback; no monogram has been invented.</p>
                </Stack>
              </div>
              <div className={`${styles.panel} ${styles.panelDark}`} data-focus-surface="dark">
                <Stack>
                  <p className={styles.darkMeta}>Text identity · dark surface</p>
                  <BrandLogo kind="horizontal" surface="dark" width={160} href="/__ui/" />
                </Stack>
              </div>
              <div className={`${styles.panel} ${styles.panelDark}`} data-focus-surface="dark">
                <Stack>
                  <p className={styles.darkMeta}>Compact text identity · dark surface</p>
                  <BrandLogo kind="mark" surface="dark" width={28} href="/__ui/" />
                </Stack>
              </div>
            </Grid>
          </section>

          <section className={styles.board}>
            <h2 className={styles.sectionTitle}>Color tokens</h2>
            <div className={styles.panel}>
              <div className={styles.swatches}>
                {swatches.map(([name, value]) => (
                  <div className={styles.swatch} key={name}>
                    <span className={styles.swatchColor} style={{ "--swatch": value } as SwatchStyle} />
                    <span className={styles.swatchText}><strong>{name}</strong><br /><code>{value}</code></span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.board}>
            <h2 className={styles.sectionTitle}>Typography</h2>
            <div className={`${styles.panel} ${styles.typography}`}>
              <p className="pe-display">Display foundation</p>
              <h1>H1 · A clear explanation starts here</h1>
              <h2>H2 · Supporting evidence follows</h2>
              <h3>H3 · Story context remains readable</h3>
              <p className="pe-lead">Lead text supports context without competing with the primary explanation.</p>
              <p>Inter is the English body/UI foundation. <a className="pe-inline-link" href="#controls">Inline editorial links remain recognizable.</a></p>
              <p lang="bn-BD" className={styles.banglaSample}>বাংলা UI এবং কনটেন্ট Hind Siliguri ব্যবহার করে। বাংলা টেক্সটে ইংরেজি heading-এর negative letter-spacing প্রয়োগ করা হয় না।</p>
            </div>
          </section>

          <section className={styles.board}>
            <h2 className={styles.sectionTitle}>Responsive containers</h2>
            <Stack gap="var(--pe-space-4)">
              <div className={styles.containerDemo}><strong>Page shell</strong><span>1280px max</span></div>
              <WideContainer className={styles.wideDemo}><strong>Editorial wide</strong><span>1120px max</span></WideContainer>
              <ReadingColumn className={styles.readingDemoBox}><strong>Reading measure</strong><span>720px max</span></ReadingColumn>
            </Stack>
          </section>

          <section className={styles.board}>
            <h2 className={styles.sectionTitle}>Spacing scale</h2>
            <div className={styles.panel}>
              <div className={styles.spacingGrid}>
                {spacing.map((value) => (
                  <div className={styles.spacingItem} key={value}>
                    <span className={styles.spacingBar} style={{ "--space-size": `${value}px` } as SpacingStyle} />
                    <code>{value}px</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.board} id="controls">
            <h2 className={styles.sectionTitle}>Buttons + keyboard focus</h2>
            <Grid mobile={1} desktop={2} gap="var(--pe-space-5)">
              <div className={styles.panel}>
                <Stack gap="var(--pe-space-5)">
                  <div className={styles.controls}>
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="tertiary">Tertiary</Button>
                    <Button disabled>Disabled</Button>
                    <Button loading loadingLabel="Loading example">Loading</Button>
                    <IconButton aria-label="Next example" icon={<ArrowRightIcon />} variant="secondary" />
                  </div>
                  <ButtonLink href="/__ui/" variant="secondary">Semantic link action</ButtonLink>
                </Stack>
              </div>
              <div className={`${styles.panel} ${styles.panelDark}`} data-focus-surface="dark">
                <Stack gap="var(--pe-space-4)">
                  <h3 className={styles.darkHeading}>Focus on Plot Ink</h3>
                  <p className={styles.darkNote}>Press Tab. The canonical Indigo outer ring remains visible with the white separator on a dark surface.</p>
                  <Button variant="secondary">Keyboard focus target</Button>
                </Stack>
              </div>
            </Grid>
          </section>

          <section className={styles.board}>
            <h2 className={styles.sectionTitle}>Form foundations</h2>
            <div className={styles.panel}>
              <div className={styles.formGrid}>
                <TextInput id="preview-season" label="Season" placeholder="Season 2" helperText="Labels remain outside fields." required />
                <TextInput id="preview-error" label="Episode" placeholder="Episode 8" error="This field is required." />
                <TextInput id="preview-disabled" label="Disabled field" defaultValue="Unavailable" disabled />
                <SearchInput id="preview-search" label="Search ScreenWhy" placeholder="Ending, character, mystery…" />
                <Select id="preview-select" label="Content type" defaultValue="explanation">
                  <SelectOption value="explanation">Explanation</SelectOption>
                  <SelectOption value="title">Title</SelectOption>
                  <SelectOption value="character">Character</SelectOption>
                </Select>
                <Textarea id="preview-question" label="Your question" placeholder="Ask about a scene, character, ending, timeline, or relationship." />
                <Stack gap="var(--pe-space-1)">
                  <Checkbox id="preview-checkbox" label="Notify me when available" />
                  <Radio id="preview-radio-a" name="preview-radio" label="Option A" defaultChecked />
                  <Radio id="preview-radio-b" name="preview-radio" label="Option B" />
                </Stack>
              </div>
            </div>
          </section>

          <section className={styles.board}>
            <h2 className={styles.sectionTitle}>Generic primitives</h2>
            <Grid mobile={1} tablet={2} desktop={3} gap="var(--pe-space-4)">
              <div className={styles.panel}>
                <Stack>
                  <div className={styles.controls}>
                    <Badge>Neutral</Badge><Badge tone="info">Info</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge><Badge tone="spoiler">Semantic</Badge>
                  </div>
                  <Divider />
                  <Disclosure summary="Disclosure example">Native details/summary behavior keeps the primitive keyboard-operable without building a page-specific accordion system.</Disclosure>
                </Stack>
              </div>
              <div className={styles.panel}>
                <Stack>
                  <Skeleton height="64px" radius="10px" />
                  <Skeleton width="70%" />
                  <Skeleton width="45%" />
                </Stack>
              </div>
              <StateShell title="No results">A concise empty-state foundation with a useful next path can be composed later.</StateShell>
            </Grid>
            <div className={styles.stateGap}>
              <StateShell title="Something went wrong" tone="error" action={<Button variant="secondary">Retry</Button>}>
                The request could not be completed. Recovery stays explicit and restrained.
              </StateShell>
            </div>
          </section>

          <section className={styles.board}>
            <h2 className={styles.sectionTitle}>Reserved media geometry</h2>
            <Grid mobile={2} tablet={4} gap="var(--pe-space-4)">
              <MediaFrame ratio="poster"><span className={styles.mediaLabel}>2:3 poster</span></MediaFrame>
              <MediaFrame ratio="portrait"><span className={styles.mediaLabel}>4:5 portrait</span></MediaFrame>
              <MediaFrame ratio="landscape"><span className={styles.mediaLabel}>16:9 editorial</span></MediaFrame>
              <MediaFrame ratio="square"><span className={styles.mediaLabel}>1:1 identity</span></MediaFrame>
            </Grid>
          </section>
        </PageContainer>

        <Section>
          <WideContainer>
            <ReadingColumn className={styles.readingDemo}>
              <h2>720px long-form measure</h2>
              <p className="pe-article-body">Primary long-form Explanation paragraphs use 17px on mobile and 18px at desktop, with approximately 1.62 line-height. The reading measure stays constrained while large screens gain whitespace instead of stretched prose.</p>
              <p className="pe-article-body">Domain-specific Title, Explanation and Character cards; Quick Answer; Canon; Spoiler; citations; relationships; timeline; and Table of Contents are intentionally not implemented in PE-FE-01B.</p>
            </ReadingColumn>
          </WideContainer>
        </Section>
      </div>
    </SiteFrame>
  );
}
