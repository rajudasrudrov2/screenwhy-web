import assert from "node:assert/strict";
import { parsePublicAuthorPage, getPublicAuthorPage } from "../src/data/api/author-profiles";

const valid = () => ({
  meta: { apiVersion: "1", locale: "en-US" },
  data: {
    profile: { userId: 1, displayName: "Test Author", slug: "test-author", profilePublic: true },
    articles: [{ title: "Test explanation", slug: "test-explanation", excerpt: "Summary", publishedAt: "2026-10-12" }],
    page: 1, hasMore: false,
  },
});

async function main() {
  assert.equal(parsePublicAuthorPage(valid(), "test-author", 1)?.articles.length, 1);
  assert.equal(parsePublicAuthorPage(valid(), "other-author", 1), null);
  assert.equal(parsePublicAuthorPage(valid(), "test-author", 2), null);
  const privateProfile = valid(); privateProfile.data.profile.profilePublic = false;
  assert.equal(parsePublicAuthorPage(privateProfile, "test-author", 1), null);
  const badLocale = valid(); badLocale.meta.locale = "invalid";
  assert.equal(parsePublicAuthorPage(badLocale, "test-author", 1), null);
  const unsafeArticle = valid(); unsafeArticle.data.articles[0].slug = "../admin";
  assert.equal(parsePublicAuthorPage(unsafeArticle, "test-author", 1), null);
  const oversized = valid(); oversized.data.articles = Array(13).fill(valid().data.articles[0]);
  assert.equal(parsePublicAuthorPage(oversized, "test-author", 1), null);
  assert.equal(parsePublicAuthorPage({ ...valid(), data: { ...valid().data, profile: { ...valid().data.profile, website: "javascript:alert(1)" } } }, "test-author", 1), null);
  assert.equal(parsePublicAuthorPage(null, "test-author", 1), null);
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (input, init) => {
    calls++;
    assert.equal(String(input), "https://cms.screenwhy.com/wp-json/screenwhy/v1/authors/test-author?locale=en-US&page=1");
    assert.equal(init?.method, "GET"); assert.equal(init?.cache, "no-store");
    return new Response(JSON.stringify(valid()), { status: 200 });
  };
  try {
    assert.equal(await getPublicAuthorPage("../admin"), null);
    assert.equal(await getPublicAuthorPage("test-author", 101), null);
    assert.equal(calls, 0);
    assert.equal((await getPublicAuthorPage("test-author"))?.profile.slug, "test-author");
    assert.equal(calls, 1);
    globalThis.fetch = async () => new Response("missing", { status: 404 });
    assert.equal(await getPublicAuthorPage("test-author"), null);
    globalThis.fetch = async () => new Response("unavailable", { status: 500 });
    assert.equal(await getPublicAuthorPage("test-author"), null);
    globalThis.fetch = async () => new Response("not-json", { status: 200 });
    assert.equal(await getPublicAuthorPage("test-author"), null);
  } finally { globalThis.fetch = originalFetch; }
  console.log("PASS — Author Profile contract, privacy, pagination, URL safety, GET integration and fail-closed responses");
}
void main();
