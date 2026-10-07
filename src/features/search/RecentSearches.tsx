"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildSearchHref, normalizeSearchQuery } from "@/features/search/search.utils";
import styles from "./SearchPage.module.css";

const STORAGE_KEY = "screenwhy.recentSearches.v1";
const MAX_RECENT = 5;

function readRecent(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

export function storeRecentSearch(query: string): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return;
  const current = readRecent().filter((item) => item.toLocaleLowerCase() !== normalized.toLocaleLowerCase());
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([normalized, ...current].slice(0, MAX_RECENT)));
  window.dispatchEvent(new Event("screenwhy:recent-searches"));
}

export function RecentSearches() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<readonly string[]>([]);

  useEffect(() => {
    const sync = () => setItems(readRecent());
    setMounted(true);
    sync();
    window.addEventListener("screenwhy:recent-searches", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("screenwhy:recent-searches", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!mounted || items.length === 0) return null;

  function clearAll() {
    window.localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  }

  return (
    <section className={styles.recent} aria-labelledby="recent-searches-heading">
      <div className={styles.rowHeading}>
        <h2 id="recent-searches-heading">Recent searches</h2>
        <button type="button" className={styles.textButton} onClick={clearAll}>Clear all</button>
      </div>
      <ul className={styles.recentList}>
        {items.map((query) => (
          <li key={query}>
            <Link href={buildSearchHref(query)} onClick={() => storeRecentSearch(query)}>{query}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
