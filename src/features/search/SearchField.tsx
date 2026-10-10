"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "@/components/icons/Icons";
import { searchRoute } from "@/config/routes";
import { getSearchSuggestions } from "@/features/search/search.actions";
import type { SearchFilter, SearchSuggestionItem, SearchSuggestions } from "@/features/search/search.types";
import { SEARCH_QUERY_MAX_LENGTH } from "@/features/search/search.utils";
import { storeRecentSearch } from "@/features/search/RecentSearches";
import styles from "./SearchPage.module.css";

export interface SearchFieldProps {
  readonly initialQuery?: string;
  readonly filter?: SearchFilter;
  readonly autofocus?: boolean;
}

export function SearchField({ initialQuery = "", filter = "all", autofocus = false }: SearchFieldProps) {
  const [value, setValue] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestions | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const flattened = useMemo(
    () => suggestions?.groups.flatMap((group) => group.items) ?? [],
    [suggestions],
  );

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const next = await getSearchSuggestions(query);
        if (cancelled) return;
        setSuggestions(next);
        setOpen(next.groups.length > 0);
        setActiveIndex(-1);
      } catch {
        if (!cancelled) {
          setSuggestions(null);
          setOpen(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [value]);

  function moveActive(delta: number) {
    if (!flattened.length) return;
    setOpen(true);
    setActiveIndex((current) => {
      if (current < 0) return delta > 0 ? 0 : flattened.length - 1;
      return (current + delta + flattened.length) % flattened.length;
    });
  }

  function chooseSuggestion(item: SearchSuggestionItem) {
    storeRecentSearch(value);
    window.location.assign(item.href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault();
      const item = flattened[activeIndex];
      if (item) chooseSuggestion(item);
    }
  }

  return (
    <div className={styles.searchExperience}>
      <form
        className={styles.searchForm}
        action={searchRoute("en-US")}
        method="get"
        role="search"
        onSubmit={() => storeRecentSearch(value)}
      >
        <label className={styles.visuallyHidden} htmlFor={`${listboxId}-input`}>Search ScreenWhy</label>
        <span className={styles.searchIcon} aria-hidden="true"><SearchIcon size={20} /></span>
        <input
          ref={inputRef}
          id={`${listboxId}-input`}
          className={styles.searchInput}
          name="q"
          type="search"
          value={value}
          maxLength={SEARCH_QUERY_MAX_LENGTH}
          placeholder="Search a title, character, question…"
          autoComplete="off"
          autoFocus={autofocus}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const nextValue = event.target.value;
            setValue(nextValue);
            if (nextValue.trim().length < 2) {
              setSuggestions(null);
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
          onFocus={() => {
            if (suggestions?.groups.length) setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {filter !== "all" ? <input type="hidden" name="type" value={filter} /> : null}
        {value ? (
          <button
            type="button"
            className={styles.clearButton}
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              setSuggestions(null);
              setOpen(false);
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
          >
            <CloseIcon size={18} />
          </button>
        ) : null}
        <button className={styles.submitButton} type="submit">Search</button>
      </form>

      {open && suggestions ? (
        <div className={styles.suggestionOverlay} id={listboxId} role="listbox" aria-label="Search suggestions">
          {suggestions.groups.map((group) => (
            <section key={group.kind} className={styles.suggestionGroup} aria-labelledby={`${listboxId}-${group.kind}`}>
              <h2 id={`${listboxId}-${group.kind}`}>{group.label}</h2>
              <ul>
                {group.items.map((item) => {
                  const index = flattened.findIndex((candidate) => candidate.id === item.id && candidate.kind === item.kind);
                  return (
                    <li
                      key={`${item.kind}:${item.id}`}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={activeIndex === index}
                      className={activeIndex === index ? styles.activeSuggestion : undefined}
                    >
                      <Link href={item.href} onClick={() => storeRecentSearch(value)}>
                        <span>
                          <strong>{item.label}</strong>
                          {item.context ? <small>{item.context}</small> : null}
                        </span>
                        <ArrowRightIcon size={16} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <Link className={styles.moreResults} href={suggestions.searchHref} onClick={() => storeRecentSearch(value)}>
            Search for “{suggestions.query}” <ArrowRightIcon size={16} />
          </Link>
          {loading ? <span className={styles.suggestionStatus} role="status">Updating suggestions…</span> : null}
        </div>
      ) : null}
    </div>
  );
}
