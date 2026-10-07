import Link from "next/link";
import {
  ArticleLead,
  ArticleLink,
  ArticleList,
  ArticleParagraph,
  ArticleProse,
  ArticleReadingLayout,
  ArticleSection,
  ArticleTableOfContents,
  buildArticleTocItems,
  createArticleSectionId,
  type ArticleSectionDescriptor,
} from "@/components/domain/article";
import { PageContainer } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PUBLIC_HUB_ROUTES } from "@/config/routes";
import { brandConfig } from "@/config/brand";
import { EDITORIAL_PAGE_CONTENT } from "./editorial-page.content";
import type {
  EditorialContentLink,
  EditorialPageDefinition,
  EditorialPageKey,
  EditorialSection,
  EditorialSubsection,
} from "./editorial-page.types";
import styles from "./EditorialPage.module.css";

function sectionDescriptor(section: EditorialSection): ArticleSectionDescriptor {
  return {
    id: createArticleSectionId(section.key),
    heading: section.heading,
    level: 2,
    sections: section.subsections?.map((child) => ({
      id: createArticleSectionId(child.key),
      heading: child.heading,
      level: 3 as const,
    })),
  };
}

function LinkList({ links }: { readonly links: readonly EditorialContentLink[] }) {
  return (
    <ArticleList
      items={links.map((link) => (
        <span key={link.href}>
          <ArticleLink href={link.href}>{link.label}</ArticleLink>
          {link.description ? ` — ${link.description}` : ""}
        </span>
      ))}
    />
  );
}

function SectionBody({ section }: { readonly section: EditorialSubsection }) {
  return (
    <>
      {section.paragraphs?.map((paragraph) => <ArticleParagraph key={paragraph}>{paragraph}</ArticleParagraph>)}
      {section.list?.length ? <ArticleList items={section.list} /> : null}
      {section.links?.length ? <LinkList links={section.links} /> : null}
      {section.callout ? (
        <aside className={styles.callout} aria-label={section.callout.title}>
          <strong>{section.callout.title}</strong>
          <p>{section.callout.body}</p>
        </aside>
      ) : null}
    </>
  );
}

function EditorialSections({ sections }: { readonly sections: readonly EditorialSection[] }) {
  return (
    <ArticleProse>
      {sections.map((section) => (
        <ArticleSection
          key={section.key}
          id={createArticleSectionId(section.key)}
          heading={section.heading}
          level={2}
        >
          <SectionBody section={section} />
          {section.subsections?.map((subsection) => (
            <ArticleSection
              key={subsection.key}
              id={createArticleSectionId(subsection.key)}
              heading={subsection.heading}
              level={3}
            >
              <SectionBody section={subsection} />
            </ArticleSection>
          ))}
        </ArticleSection>
      ))}
    </ArticleProse>
  );
}

function RelatedPolicies({ page }: { readonly page: EditorialPageDefinition }) {
  if (!page.related?.length) return null;
  return (
    <nav className={styles.related} aria-label="Related ScreenWhy pages">
      <h2>Related pages</h2>
      <ul>
        {page.related.map((key) => {
          const related = EDITORIAL_PAGE_CONTENT[key];
          return <li key={key}><Link href={related.route}>{related.title}</Link></li>;
        })}
      </ul>
    </nav>
  );
}

function AboutIdentity() {
  return (
    <aside className={styles.brandPanel} aria-label="ScreenWhy brand promise">
      <p>{brandConfig.tagline}</p>
      <strong>{brandConfig.brandPromise}</strong>
      <span>{brandConfig.shortSlogan}</span>
    </aside>
  );
}

function ContactNotice() {
  return (
    <aside className={styles.contactNotice} aria-label="Contact availability">
      <strong>Verified public contact channel not yet published</strong>
      <p>This frontend intentionally does not show a made-up email address, phone number, office address or working submission form.</p>
    </aside>
  );
}

export function EditorialPage({ pageKey }: { readonly pageKey: EditorialPageKey }) {
  const page = EDITORIAL_PAGE_CONTENT[pageKey];
  const descriptors = page.sections.map(sectionDescriptor);
  const toc = page.useToc ? buildArticleTocItems(descriptors) : [];
  const content = <EditorialSections sections={page.sections} />;

  return (
    <PageContainer className={styles.page}>
      <Breadcrumbs items={[
        { label: "Home", href: PUBLIC_HUB_ROUTES.home },
        { label: page.title },
      ]} />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <ArticleLead>{page.intro}</ArticleLead>
        {page.lastUpdated ? <p className={styles.updated}>Last updated: {page.lastUpdated}</p> : null}
      </header>

      {page.variant === "about" ? <AboutIdentity /> : null}
      {page.variant === "contact" ? <ContactNotice /> : null}

      <main className={styles.body}>
        {page.useToc ? (
          <ArticleReadingLayout toc={<ArticleTableOfContents items={toc} label="On this page" />}>
            {content}
          </ArticleReadingLayout>
        ) : (
          <div className={styles.readingOnly}>{content}</div>
        )}
      </main>

      <RelatedPolicies page={page} />
    </PageContainer>
  );
}
