import { createElement, type ReactNode } from "react";
import Link from "next/link";
import type { LiveExplanation, LiveNode, LiveList } from "@/lib/live-explanations";
import styles from "./LiveExplanationViews.module.css";

function renderNode(node: LiveNode, key: number | string): ReactNode {
  if (node.kind === "text") return node.text;
  const props: Record<string, string | number> = { key: String(key) };
  if (node.id) props.id = node.id;
  if (node.tag === "a" && node.href) props.href = node.href;
  if (node.tag === "a" && node.href?.startsWith("http")) props.rel = "noopener noreferrer";
  if (node.tag === "img" && node.src) {
    props.src = node.src;
    props.alt = node.alt ?? "";
    if (node.width) props.width = node.width;
    if (node.height) props.height = node.height;
    props.loading = "lazy";
  }
  return createElement(node.tag, props, ...node.children.map((child, i) => renderNode(child, i)));
}

export function LiveExplanationArticle({ explanation }: { readonly explanation: LiveExplanation }) {
  return (
    <main className={styles.main}>
      <nav className={styles.breadcrumb}><Link href="/">Home</Link> / <Link href="/explanations/">Explanations</Link></nav>
      <article>
        <h1>{explanation.headline}</h1>
        {explanation.excerpt ? <p className={styles.excerpt}>{explanation.excerpt}</p> : null}
        <p className={styles.timestamp}>Published explanation</p>
        {explanation.bodyComplete === false ? <p className={styles.warning} role="status">{explanation.bodyNotice ?? "Some saved content needs a compatible renderer."}</p> : null}
        <div className={styles.body}>
          {(explanation.body ?? []).map((node, index) => <div key={index} className={styles.node}>{renderNode(node, index)}</div>)}
        </div>
      </article>
    </main>
  );
}

export function LiveExplanationListing({ list, title, q = "", pagination = true }: { readonly list: LiveList; readonly title: string; readonly q?: string; readonly pagination?: boolean }) {
  return <main className={styles.main}>
    <header className={styles.listHeader}>
      <h1>{title}</h1>
      <p>Published explanations from the ScreenWhy editorial CMS.</p>
      <form action="/search/" method="get" role="search" className={styles.searchForm}>
        <label htmlFor="screenwhy-live-search">Search explanations</label>
        <div className={styles.searchRow}><input id="screenwhy-live-search" name="q" type="search" defaultValue={q} maxLength={160} placeholder="Movie, show, episode or question…" /><button type="submit">Search</button></div>
      </form>
    </header>
    {list.items.length === 0 ? <p className={styles.empty}>No published explanations matched your search.</p> :
      <div className={styles.cards}>{list.items.map((entry) => <article className={styles.card} key={entry.id}>
        <h2><Link href={entry.publicPath}>{entry.headline}</Link></h2>
        {entry.excerpt ? <p>{entry.excerpt}</p> : null}
        <Link className={styles.read} href={entry.publicPath}>Read explanation →</Link>
      </article>)}</div>}
    {pagination ? <div className={styles.pageNav}>
      {list.page > 1 ? <Link href={`?page=${list.page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>← Previous</Link> : null}
      <span>Page {list.page}</span>
      {list.page * list.perPage < list.total ? <Link href={`?page=${list.page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>Next →</Link> : null}
    </div> : null}
  </main>;
}
