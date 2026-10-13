import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Event = { eventId: string; event: "publish" | "update" | "unpublish" | "trash"; postId: number; slug: string; oldSlug: string };
const seen = new Map<string, number>();
const SLUG = /^[a-z0-9-]{0,200}$/;
function safeEvent(raw: unknown): Event | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const x = raw as Record<string, unknown>;
  if (typeof x.eventId !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(x.eventId)) return null;
  if (x.event !== "publish" && x.event !== "update" && x.event !== "unpublish" && x.event !== "trash") return null;
  if (!Number.isSafeInteger(x.postId) || (x.postId as number) < 1) return null;
  if (typeof x.slug !== "string" || !SLUG.test(x.slug)) return null;
  if (typeof x.oldSlug !== "string" || !SLUG.test(x.oldSlug)) return null;
  return x as Event;
}
function authorized(stamp: string | null, signature: string | null, body: string): boolean {
  const secret = process.env.SCREENWHY_REVALIDATION_SECRET;
  if (!secret || secret.length < 32 || !stamp || !/^\d{10}$/.test(stamp) || !signature || !/^sha256=[a-f0-9]{64}$/.test(signature)) return false;
  if (Math.abs(Date.now() / 1000 - Number(stamp)) > 300) return false;
  const actual = Buffer.from(signature.slice(7), "hex");
  const expected = createHmac("sha256", secret).update(`${stamp}.${body}`).digest();
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export async function POST(request: NextRequest) {
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 4096) return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > 4096) return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  if (!authorized(request.headers.get("x-screenwhy-timestamp"), request.headers.get("x-screenwhy-signature"), body)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  let parsed: unknown;
  try { parsed = JSON.parse(body); } catch { return NextResponse.json({ error: "Malformed event" }, { status: 400 }); }
  const event = safeEvent(parsed);
  if (!event) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  // Best-effort process-local deduplication; production multi-region replay store is NOT certified.
  const now = Date.now();
  for (const [id, until] of seen) if (until < now) seen.delete(id);
  if (seen.has(event.eventId)) return NextResponse.json({ ok: true, duplicate: true }, { headers: { "Cache-Control": "no-store" } });
  if (seen.size > 1000) seen.clear();
  const paths = new Set(["/", "/explanations/", "/search/", "/sitemap.xml"]);
  for (const slug of [event.slug, event.oldSlug]) if (slug) paths.add(`/explain/${slug}/`);
  for (const path of paths) revalidatePath(path);
  seen.set(event.eventId, now + 5 * 60 * 1000);
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
