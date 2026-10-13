import { env } from "@/config/env";

/** Wire shape for v0.7.1's public, WordPress-published-only /live-explanations endpoint. */
export type LiveNode =
  | { readonly kind: "text"; readonly text: string }
  | {
      readonly kind: "element";
      readonly tag: string;
      readonly children: readonly LiveNode[];
      readonly href?: string;
      readonly src?: string;
      readonly alt?: string;
      readonly width?: number;
      readonly height?: number;
      readonly id?: string;
    };
export interface LiveExplanation {
  readonly id: number;
  readonly slug: string;
  readonly headline: string;
  readonly excerpt: string;
  readonly publicPath: string;
  readonly publishedAt: string;
  readonly modifiedAt: string;
  readonly body?: readonly LiveNode[];
  readonly bodyComplete?: boolean;
  readonly bodyNotice?: string | null;
}
export interface LiveList {
  readonly items: readonly LiveExplanation[];
  readonly page: number;
  readonly perPage: number;
  readonly total: number;
}

const TAGS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "strong", "b", "em", "i", "a", "img", "br", "code", "pre", "hr", "sup", "sub", "figure", "figcaption", "div", "span", "u", "s", "del", "ins", "table", "thead", "tbody", "tfoot", "tr", "th", "td"]);
const SLUG = /^[a-z0-9-]{1,200}$/;
const ITEM_LIMIT = 20000;

/** Local mock mode remains available for tests; production always uses the CMS or fails closed. */
export function isLiveApiMode(): boolean {
  return process.env.NODE_ENV === "production" || env.dataSource === "api";
}

function apiBase(): string {
  if (process.env.NODE_ENV === "production" && env.dataSource !== "api") {
    throw new Error("ScreenWhy production requires SCREENWHY_DATA_SOURCE=api; mock mode is forbidden.");
  }
  if (!env.cmsApiBaseUrl) throw new Error("ScreenWhy public CMS API URL is not configured.");
  const url = new URL(env.cmsApiBaseUrl);
  if (process.env.NODE_ENV === "production" && (url.protocol !== "https:" || url.hostname !== "cms.screenwhy.com")) {
    throw new Error("ScreenWhy production CMS API must use the approved HTTPS host.");
  }
  return url.toString().replace(/\/$/, "");
}
function record(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Malformed public explanation data.");
  return raw as Record<string, unknown>;
}
function string(raw: unknown): string {
  if (typeof raw !== "string") throw new Error("Malformed public explanation string.");
  return raw;
}
function int(raw: unknown): number {
  if (!Number.isSafeInteger(raw) || (raw as number) < 0) throw new Error("Malformed public explanation number.");
  return raw as number;
}
function safeHref(href: string): boolean {
  return /^(https?:\/\/[^\s<>]+|mailto:[^\s<>@]+@[^\s<>@]+|#[a-zA-Z][\w:-]*|\/(?!\/)[^\s<>]*)$/.test(href);
}
function decodeNodes(raw: unknown, depth = 0, budget: { remaining: number } = { remaining: ITEM_LIMIT }): readonly LiveNode[] {
  if (depth > 25 || !Array.isArray(raw) || raw.length > 2000) throw new Error("Unsafe or invalid article nesting.");
  return raw.map((item): LiveNode => {
    if (--budget.remaining < 0) throw new Error("Article exceeded safe node limit.");
    const node = record(item);
    if (node.kind === "text") return { kind: "text", text: string(node.text) };
    if (node.kind !== "element") throw new Error("Unknown public article node.");
    const tag = string(node.tag);
    if (!TAGS.has(tag)) throw new Error("Unsafe public article element.");
    const children = decodeNodes(node.children, depth + 1, budget);
    const result: LiveNode = { kind: "element", tag, children };
    const props: Record<string, string | number | readonly LiveNode[]> = { ...result };
    if (tag === "a") {
      const href = string(node.href ?? "");
      if (!safeHref(href)) throw new Error("Unsafe link in public article.");
      props.href = href;
    }
    if (tag === "img") {
      const src = string(node.src);
      if (!/^https?:\/\/[^\s<>]+$/.test(src)) throw new Error("Unsafe public image URL.");
      props.src = src;
      props.alt = string(node.alt ?? "");
      if (node.width !== undefined) props.width = Math.min(4096, int(node.width));
      if (node.height !== undefined) props.height = Math.min(4096, int(node.height));
    }
    if (node.id !== undefined && /^[a-zA-Z][\w:.-]{0,120}$/.test(string(node.id))) props.id = string(node.id);
    return props as unknown as LiveNode;
  });
}
function decodeItem(raw: unknown, detail: boolean): LiveExplanation {
  const r = record(raw);
  const slug = string(r.slug);
  if (!SLUG.test(slug) || r.publicPath !== `/explain/${slug}/`) throw new Error("Invalid canonical public explanation slug.");
  const item: LiveExplanation = {
    id: int(r.id), slug, headline: string(r.headline), excerpt: string(r.excerpt),
    publicPath: `/explain/${slug}/`, publishedAt: string(r.publishedAt), modifiedAt: string(r.modifiedAt),
    ...(detail ? {
      body: decodeNodes(r.body),
      bodyComplete: r.bodyComplete === true,
      bodyNotice: r.bodyNotice === null || r.bodyNotice === undefined ? null : string(r.bodyNotice),
    } : {}),
  };
  if (!item.headline.trim() || item.id < 1) throw new Error("Invalid published explanation record.");
  return item;
}
async function request(path: string): Promise<Response> {
  const url = `${apiBase()}/screenwhy/v1${path}`;
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" }, redirect: "error" });
  if (response.status >= 500 || response.status === 401 || response.status === 403) {
    throw new Error(`ScreenWhy public CMS temporarily unavailable (${response.status}).`);
  }
  return response;
}

export async function getLiveExplanation(slug: string): Promise<LiveExplanation | null> {
  if (!SLUG.test(slug)) return null;
  const response = await request(`/live-explanations/${encodeURIComponent(slug)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Published explanation API error (${response.status}).`);
  return decodeItem(await response.json(), true);
}
export async function getLiveExplanations(options: { page?: number; perPage?: number; q?: string } = {}): Promise<LiveList> {
  const page = Math.max(1, Math.min(1000, Math.floor(options.page ?? 1)));
  const perPage = Math.max(1, Math.min(50, Math.floor(options.perPage ?? 20)));
  const q = (options.q ?? "").trim().slice(0, 160);
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (q) params.set("q", q);
  const response = await request(`/live-explanations?${params.toString()}`);
  if (!response.ok) throw new Error(`Published explanation listing API error (${response.status}).`);
  const r = record(await response.json());
  if (!Array.isArray(r.items)) throw new Error("Malformed published explanation listing.");
  return { items: r.items.map((x) => decodeItem(x, false)), page: int(r.page), perPage: int(r.perPage), total: int(r.total) };
}
