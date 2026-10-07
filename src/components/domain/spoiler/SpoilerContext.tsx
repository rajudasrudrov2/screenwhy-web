import type { ReactNode } from "react";
import { AlertCircleIcon, CheckIcon, ChevronDownIcon } from "@/components/icons/Icons";
import {
  sourceMaterialSpoilerLabels,
  spoilerLabels,
} from "@/components/domain/shared/domain-labels";
import type { LocaleCode } from "@/lib/i18n/locales";
import type {
  ExplanationSpoilerContext,
  SourceMaterialSpoilerMetadata,
  SpoilerMetadata,
  SpoilerScope,
} from "@/types/domain/spoiler";
import styles from "./SpoilerContext.module.css";

export interface SpoilerMarkerProps {
  readonly metadata: SpoilerMetadata;
  readonly locale?: LocaleCode;
  readonly scopeLabel?: string;
}

export interface SourceMaterialSpoilerMarkerProps {
  readonly metadata: SourceMaterialSpoilerMetadata;
  readonly locale?: LocaleCode;
  readonly sourceWorkLabel?: string;
}

export interface SpoilerContextProps {
  readonly context: ExplanationSpoilerContext;
  readonly locale?: LocaleCode;
  readonly screenScopeLabel?: string;
  readonly sourceWorkLabel?: string;
}

export interface SpoilerWarningProps extends SpoilerMarkerProps {
  readonly variant?: "article" | "scoped";
  readonly description?: string;
}

export interface SourceMaterialSpoilerWarningProps extends SourceMaterialSpoilerMarkerProps {
  readonly description?: string;
}

export interface SpoilerDisclosureProps extends SpoilerMarkerProps {
  readonly children: ReactNode;
  readonly sourceMaterial?: SourceMaterialSpoilerMetadata;
  readonly sourceWorkLabel?: string;
  readonly defaultOpen?: boolean;
}

function screenScopeText(scope: SpoilerScope | undefined, locale: LocaleCode, override?: string) {
  if (override) return override;
  if (!scope) return undefined;

  if (scope.type === "full_title") return "Full title";
  if (scope.type === "season") return `Season ${scope.seasonNumber}`;
  if (scope.type === "installment") return "Specific installment";
  if (scope.type === "source_work") return "Source work";

  const volume = scope.volume !== undefined ? `Volume ${scope.volume}, ` : "";
  const chapter = `Chapter ${scope.chapter}`;
  return `${volume}${chapter}`;
}

function sourceScopeText(metadata: SourceMaterialSpoilerMetadata, locale: LocaleCode, sourceWorkLabel?: string) {
  const parts: string[] = [];
  if (sourceWorkLabel) parts.push(sourceWorkLabel);
  if (metadata.volume !== undefined) parts.push(`Volume ${metadata.volume}`);
  if (metadata.chapter !== undefined) parts.push(`Chapter ${metadata.chapter}`);
  return parts.length > 0 ? parts.join(" · ") : "Source material";
}

function ScreenSpoilerIcon({ level }: { readonly level: SpoilerMetadata["level"] }) {
  return level === "spoiler_free" ? <CheckIcon size={17} /> : <AlertCircleIcon size={17} />;
}

export function SpoilerMarker({ metadata, locale = "en-US", scopeLabel }: SpoilerMarkerProps) {
  const label = spoilerLabels[locale][metadata.level];
  const scope = screenScopeText(metadata.scope, locale, scopeLabel);
  const tone = metadata.level === "spoiler_free" ? styles.free : styles.warning;

  return (
    <span className={`${styles.marker} ${tone}`} lang={locale}>
      <span className={styles.icon}><ScreenSpoilerIcon level={metadata.level} /></span>
      <span className={styles.markerLabel}>{label}</span>
      {scope ? <span className={styles.markerScope}>{scope}</span> : null}
    </span>
  );
}

export function SourceMaterialSpoilerMarker({
  metadata,
  locale = "en-US",
  sourceWorkLabel,
}: SourceMaterialSpoilerMarkerProps) {
  const label = sourceMaterialSpoilerLabels[locale][metadata.level];
  const scope = sourceScopeText(metadata, locale, sourceWorkLabel);
  const tone = metadata.level === "none" ? styles.free : styles.sourceMaterial;

  return (
    <span className={`${styles.marker} ${tone}`} lang={locale}>
      <span className={styles.icon}>{metadata.level === "none" ? <CheckIcon size={17} /> : <AlertCircleIcon size={17} />}</span>
      <span className={styles.markerLabel}>{label}</span>
      <span className={styles.markerScope}>{scope}</span>
    </span>
  );
}

export function SpoilerContext({
  context,
  locale = "en-US",
  screenScopeLabel,
  sourceWorkLabel,
}: SpoilerContextProps) {
  return (
    <div className={styles.contextGroup} role="group" aria-label="Spoiler context">
      <SpoilerMarker metadata={context.screen} locale={locale} scopeLabel={screenScopeLabel} />
      {context.sourceMaterial ? (
        <SourceMaterialSpoilerMarker metadata={context.sourceMaterial} locale={locale} sourceWorkLabel={sourceWorkLabel} />
      ) : null}
    </div>
  );
}

export function SpoilerWarning({
  metadata,
  locale = "en-US",
  scopeLabel,
  variant = "article",
  description,
}: SpoilerWarningProps) {
  const label = spoilerLabels[locale][metadata.level];
  const scope = screenScopeText(metadata.scope, locale, scopeLabel);
  const free = metadata.level === "spoiler_free";
  const defaultDescription = free
    ? "This section can be read without revealing important story events."
    : "Continue only if you are comfortable with the stated spoiler scope.";

  return (
    <aside className={`${styles.warningPanel} ${free ? styles.freePanel : ""} ${variant === "scoped" ? styles.scoped : ""}`} lang={locale} aria-label={label}>
      <span className={styles.warningIcon}><ScreenSpoilerIcon level={metadata.level} /></span>
      <div className={styles.warningCopy}>
        <div className={styles.warningHeading}>
          <strong>{label}</strong>
          {scope ? <span className={styles.warningScope}>{scope}</span> : null}
        </div>
        <p>{description || defaultDescription}</p>
      </div>
    </aside>
  );
}

export function SourceMaterialSpoilerWarning({
  metadata,
  locale = "en-US",
  sourceWorkLabel,
  description,
}: SourceMaterialSpoilerWarningProps) {
  const label = sourceMaterialSpoilerLabels[locale][metadata.level];
  const scope = sourceScopeText(metadata, locale, sourceWorkLabel);
  const defaultDescription = metadata.level === "none"
    ? "This explanation does not reveal additional source-material events."
    : "This source-material warning is separate from the screen-version spoiler level.";

  return (
    <aside className={`${styles.warningPanel} ${styles.sourcePanel}`} lang={locale} aria-label={label}>
      <span className={styles.warningIcon}>{metadata.level === "none" ? <CheckIcon size={18} /> : <AlertCircleIcon size={18} />}</span>
      <div className={styles.warningCopy}>
        <div className={styles.warningHeading}>
          <strong>{label}</strong>
          <span className={styles.warningScope}>{scope}</span>
        </div>
        <p>{description || defaultDescription}</p>
      </div>
    </aside>
  );
}

export function SpoilerDisclosure({
  metadata,
  locale = "en-US",
  scopeLabel,
  sourceMaterial,
  sourceWorkLabel,
  children,
  defaultOpen = false,
}: SpoilerDisclosureProps) {
  const level = spoilerLabels[locale][metadata.level];
  const scope = screenScopeText(metadata.scope, locale, scopeLabel);
  const reveal = "Reveal explanation";

  return (
    <details className={styles.disclosure} open={defaultOpen || undefined} lang={locale}>
      <summary className={styles.disclosureSummary}>
        <span className={styles.disclosureContext}>
          <span className={styles.icon}><ScreenSpoilerIcon level={metadata.level} /></span>
          <span>
            <strong>{level}</strong>
            {scope ? <span className={styles.disclosureScope}>{scope}</span> : null}
          </span>
        </span>
        <span className={styles.revealAction}>{reveal}<ChevronDownIcon size={18} /></span>
      </summary>
      <div className={styles.disclosureBody}>
        {sourceMaterial ? (
          <div className={styles.disclosureSource}>
            <SourceMaterialSpoilerMarker metadata={sourceMaterial} locale={locale} sourceWorkLabel={sourceWorkLabel} />
          </div>
        ) : null}
        {children}
      </div>
    </details>
  );
}
