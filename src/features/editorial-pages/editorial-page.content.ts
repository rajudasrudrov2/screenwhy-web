import { EDITORIAL_ROUTES } from "@/config/routes";
import type { EditorialPageDefinition, EditorialPageKey } from "./editorial-page.types";

const LAST_UPDATED = "October 7, 2026";

/**
 * Verified public contact configuration.
 * Null means no verified public destination is currently configured.
 * Keep these empty until authoritative details are supplied.
 */
export const PUBLIC_CONTACT_CONFIG = Object.freeze({
  generalContactHref: null,
  publicEmail: null,
  publicPhone: null,
  officeAddress: null,
  legalCompanyName: null,
  dmcaAgent: null,
});

const pages: Record<EditorialPageKey, EditorialPageDefinition> = {
  about: {
    key: "about",
    route: EDITORIAL_ROUTES.about,
    title: "About ScreenWhy",
    eyebrow: "About ScreenWhy",
    intro: "ScreenWhy helps viewers understand movies, TV shows, anime, K-drama and other screen stories after watching.",
    metaDescription: "Learn what ScreenWhy does, how its post-watch explanations are structured, and what the editorial product is designed to help viewers understand.",
    variant: "about",
    sections: [
      {
        key: "what-screenwhy-does",
        heading: "What ScreenWhy does",
        paragraphs: [
          "ScreenWhy is a post-watch explanation platform built around the questions people still have after a movie, episode or series ends. The goal is to make endings, character choices, mysteries, scenes, relationships, timelines and adaptation differences easier to understand.",
          "The product is designed around clear editorial explanation rather than database-style browsing. Story context, Canon and Spoiler information are kept visible so an answer can be useful without pretending every interpretation is established fact.",
        ],
      },
      {
        key: "how-to-use-screenwhy",
        heading: "How to use ScreenWhy",
        list: [
          "Browse movies, TV shows, anime, K-drama and documentary coverage by Title.",
          "Open a focused Explanation when you have a specific question about an ending, character, mystery, relationship, scene or timeline.",
          "Use Canon and Spoiler context to understand what is confirmed, what is adaptation-specific and what may reveal major story details.",
          "Use Search and discovery pages to find the question or story topic that matches what confused you.",
        ],
      },
      {
        key: "brand-promise",
        heading: "The ScreenWhy promise",
        paragraphs: [
          "The Why Behind What You Watch.",
          "Questions After Watching, Answered. That means the useful unit is not a rating or a watch button; it is a clear answer that helps the story make more sense.",
        ],
      },
      {
        key: "what-screenwhy-is-not",
        heading: "What ScreenWhy is not",
        paragraphs: ["ScreenWhy is an explanation and editorial product. It is not designed to replace the places where people watch or license entertainment."],
        list: [
          "not a streaming service;",
          "not a ratings database;",
          "not a piracy or download service;",
          "not a gossip or entertainment-news portal.",
        ],
      },
    ],
    related: ["editorialPolicy", "sourcingPolicy", "aiUsagePolicy"],
  },
  contact: {
    key: "contact",
    route: EDITORIAL_ROUTES.contact,
    title: "Contact ScreenWhy",
    eyebrow: "Contact",
    intro: "Use this page to understand the kinds of enquiries ScreenWhy is prepared to receive and what information is useful when a verified public contact channel is published.",
    metaDescription: "Contact information and enquiry guidance for ScreenWhy, including corrections, editorial questions and copyright concerns.",
    variant: "contact",
    sections: [
      {
        key: "contact-availability",
        heading: "Current contact availability",
        paragraphs: [
          "ScreenWhy does not currently publish a verified public email address, phone number, office address or message-submission destination. Rather than inventing a contact route or pretending a message was sent, this page remains informational until a verified public channel is published.",
        ],
        callout: {
          title: "No public contact destination is published yet",
          body: "A verified contact destination can be inserted here later without changing the page structure or creating a fake submission flow.",
        },
      },
      {
        key: "general-questions",
        heading: "General questions",
        paragraphs: ["For a general ScreenWhy question, it helps to identify the page or feature you are asking about and describe the question as specifically as possible."],
      },
      {
        key: "corrections",
        heading: "Corrections",
        paragraphs: ["For a factual, Canon, source or clarity correction, include the page URL, the exact statement you believe needs review, and the evidence or context that supports the correction."],
        links: [{ label: "Read the Corrections Policy", href: EDITORIAL_ROUTES.correctionsPolicy }],
      },
      {
        key: "copyright",
        heading: "Copyright or DMCA concerns",
        paragraphs: ["For a copyright concern, identify the protected work, the ScreenWhy material or URL at issue, and the basis for the request. Do not send sensitive personal information that is not necessary to evaluate the issue."],
        links: [{ label: "Read Copyright / DMCA", href: EDITORIAL_ROUTES.copyrightDmca }],
      },
      {
        key: "editorial-questions",
        heading: "Editorial or sourcing questions",
        paragraphs: ["For a question about how ScreenWhy distinguishes evidence, Canon and interpretation, see the editorial and sourcing standards first. Those pages describe ScreenWhy’s editorial model without claiming review processes that have not been established."],
        links: [
          { label: "Editorial Policy", href: EDITORIAL_ROUTES.editorialPolicy },
          { label: "Sourcing Policy", href: EDITORIAL_ROUTES.sourcingPolicy },
        ],
      },
    ],
    related: ["correctionsPolicy", "copyrightDmca", "editorialPolicy"],
  },
  editorialPolicy: {
    key: "editorialPolicy",
    route: EDITORIAL_ROUTES.editorialPolicy,
    title: "Editorial Policy",
    eyebrow: "Editorial standards",
    intro: "How ScreenWhy approaches clear, spoiler-aware story explanation while keeping fact, Canon and interpretation distinct.",
    metaDescription: "ScreenWhy editorial principles for clarity, Canon, spoiler labeling, sourcing, corrections and story interpretation.",
    lastUpdated: LAST_UPDATED,
    useToc: true,
    variant: "standard",
    sections: [
      {
        key: "purpose",
        heading: "Our editorial purpose",
        paragraphs: ["ScreenWhy is built to answer real post-watch questions. Explanations should help a viewer understand what happened, why it matters and which parts are confirmed by the story rather than adding unnecessary plot retelling."],
      },
      {
        key: "clarity",
        heading: "Clarity before complexity",
        list: [
          "Answer the central question before expanding into supporting detail.",
          "Use structured sections when a story contains several causes, timelines or interpretations.",
          "Prefer understandable language over database terminology or raw internal enum values.",
        ],
      },
      {
        key: "canon-interpretation",
        heading: "Canon and interpretation",
        paragraphs: ["ScreenWhy uses a structured Canon model because not every explanation has the same evidentiary status. Confirmed screen continuity, source-material continuity, adaptation differences, interpretation and speculation should not be flattened into one voice."],
      },
      {
        key: "spoilers",
        heading: "Spoiler labeling",
        paragraphs: ["Spoiler scope is part of the content model. Major or full-spoiler details should not be exposed in supposedly safe labels, metadata or discovery surfaces before the reader chooses to reveal them."],
      },
      {
        key: "sources-and-corrections",
        heading: "Sources, review and corrections",
        paragraphs: ["Where a factual claim depends on external evidence, ScreenWhy's Source/Citation system is designed to keep supporting evidence visible at the claim or section level. Corrections should distinguish factual errors, Canon errors, source problems and clarifications."],
        links: [
          { label: "Sourcing Policy", href: EDITORIAL_ROUTES.sourcingPolicy },
          { label: "Corrections Policy", href: EDITORIAL_ROUTES.correctionsPolicy },
        ],
      },
      {
        key: "updates",
        heading: "Updates",
        paragraphs: ["Editorial pages and explanations may be revised when stronger evidence, clearer wording or changed product behavior justifies an update. ScreenWhy does not promise a fixed response or update time on this page."],
      },
    ],
    related: ["sourcingPolicy", "correctionsPolicy", "aiUsagePolicy"],
  },
  sourcingPolicy: {
    key: "sourcingPolicy",
    route: EDITORIAL_ROUTES.sourcingPolicy,
    title: "Sourcing Policy",
    eyebrow: "Editorial standards",
    intro: "How ScreenWhy separates supporting evidence from editorial explanation and interpretation.",
    metaDescription: "ScreenWhy sourcing principles, including source transparency, primary-source preference and claim-level evidence.",
    lastUpdated: LAST_UPDATED,
    useToc: true,
    variant: "standard",
    sections: [
      {
        key: "why-sources-matter",
        heading: "Why sources matter",
        paragraphs: ["Sources are most useful when they make a specific factual claim easier to verify. ScreenWhy's current data model supports public citations, verification state and section-level evidence relationships rather than treating a long source list as proof by itself."],
      },
      {
        key: "source-preference",
        heading: "Source preference",
        paragraphs: ["When appropriate and available, authoritative or primary material should be preferred for factual claims. Secondary sources can still be useful for context, reporting or interpretation, but their role should be clear."],
      },
      {
        key: "claim-level-evidence",
        heading: "Claim-level evidence",
        list: [
          "Connect evidence to the claim or section it supports where practical.",
          "Keep source identity and public visibility distinct from internal record IDs.",
          "Avoid presenting a source as support for a claim it does not actually establish.",
        ],
      },
      {
        key: "evidence-vs-interpretation",
        heading: "Evidence is not interpretation",
        paragraphs: ["A source can establish what a film, episode, creator statement or source work says. It does not automatically prove one interpretation of an ambiguous story. Interpretive readings should remain labeled as interpretation or uncertainty when the underlying material does not settle the question."],
      },
      {
        key: "source-transparency",
        heading: "Source transparency",
        paragraphs: ["When public evidence is attached to an explanation, ScreenWhy's citation system is designed to show useful source labels and evidence context without exposing internal identifiers or broken links."],
      },
    ],
    related: ["editorialPolicy", "correctionsPolicy", "aiUsagePolicy"],
  },
  correctionsPolicy: {
    key: "correctionsPolicy",
    route: EDITORIAL_ROUTES.correctionsPolicy,
    title: "Corrections Policy",
    eyebrow: "Editorial standards",
    intro: "How ScreenWhy distinguishes corrections, clarifications and updates when published explanation needs review.",
    metaDescription: "ScreenWhy corrections principles for factual, Canon, source and clarity issues.",
    lastUpdated: LAST_UPDATED,
    useToc: true,
    variant: "standard",
    sections: [
      {
        key: "what-may-need-correction",
        heading: "What may need correction",
        list: [
          "a factual statement that is wrong or unsupported;",
          "a Canon classification or continuity claim that is incorrect;",
          "a source or citation attached to the wrong claim;",
          "wording that creates a materially misleading impression;",
          "content that became incomplete because stronger information is now available.",
        ],
      },
      {
        key: "correction-vs-clarification",
        heading: "Correction, clarification or update",
        paragraphs: ["Not every revision means the same thing. A factual correction changes an error; a clarification makes an accurate statement easier to understand; a source correction fixes evidence attribution; and an update adds material that became relevant later."],
      },
      {
        key: "canon-corrections",
        heading: "Canon corrections",
        paragraphs: ["ScreenWhy treats continuity as structured context. If screen Canon, source-material Canon, adaptation difference, interpretation or speculation is mislabeled, the correction should address the classification as well as the surrounding prose."],
      },
      {
        key: "how-to-report",
        heading: "What helps when reporting an issue",
        paragraphs: ["A useful correction report identifies the page URL, the exact statement, the reason it appears wrong, and any source or story context that supports the request. A verified public submission channel is not currently published, so this page does not promise a response time."],
        links: [{ label: "Contact guidance", href: EDITORIAL_ROUTES.contact }],
      },
    ],
    related: ["editorialPolicy", "sourcingPolicy", "contact"],
  },
  aiUsagePolicy: {
    key: "aiUsagePolicy",
    route: EDITORIAL_ROUTES.aiUsagePolicy,
    title: "AI Usage Policy",
    eyebrow: "Editorial standards",
    intro: "Principles for keeping factual verification, Canon and editorial accountability clear when AI-assisted tools are used.",
    metaDescription: "ScreenWhy principles for responsible use of AI-assisted editorial tools without replacing factual or source verification.",
    lastUpdated: LAST_UPDATED,
    useToc: true,
    variant: "standard",
    sections: [
      {
        key: "assisted-workflow",
        heading: "AI-assisted workflow",
        paragraphs: ["Where AI-assisted tools are used, they may support parts of an editorial workflow such as organization, drafting assistance or language cleanup. Their output should not be treated as a source of truth simply because it is fluent."],
      },
      {
        key: "verification",
        heading: "Verification still matters",
        list: [
          "AI output should not replace factual or source verification.",
          "A confident-sounding answer should not be presented as established Canon without support.",
          "Uncertainty and interpretation should remain labeled when the story does not settle a question.",
        ],
      },
      {
        key: "accountability",
        heading: "Published accountability",
        paragraphs: ["The published ScreenWhy page—not a tool or model—is the editorial output readers see. Content should therefore remain subject to the same clarity, sourcing, spoiler and correction standards regardless of which tools assisted the workflow."],
      },
      {
        key: "vendor-neutral",
        heading: "No vendor-specific promise",
        paragraphs: ["This policy does not claim that a particular AI vendor, model or automated system is used for every page. Specific vendor claims should only be added if ScreenWhy establishes and approves them as current public information."],
      },
    ],
    related: ["editorialPolicy", "sourcingPolicy", "correctionsPolicy"],
  },
  privacy: {
    key: "privacy",
    route: EDITORIAL_ROUTES.privacy,
    title: "Privacy Policy",
    eyebrow: "Legal & privacy",
    intro: "A conservative description of privacy-relevant behavior that ScreenWhy can currently verify.",
    metaDescription: "ScreenWhy privacy information, including browser-local Recent Searches and current data-collection limitations.",
    lastUpdated: LAST_UPDATED,
    useToc: true,
    variant: "standard",
    sections: [
      {
        key: "recent-searches",
        heading: "Recent Searches",
        paragraphs: ["The current Search experience can store up to five Recent Searches in the user's own browser using local storage. Those values are used to show the Recent Searches module on that browser and can be cleared from the Search interface."],
        callout: {
          title: "Browser-local history",
          body: "Recent Searches are stored locally in the browser and are not represented as a server-side ScreenWhy account history.",
        },
      },
      {
        key: "accounts-and-submissions",
        heading: "Accounts and submissions",
        paragraphs: ["The current public site does not include a ScreenWhy user-account system, comments, newsletter signup or a working Contact submission form. This policy therefore does not describe those features as active services."],
      },
      {
        key: "technical-processing",
        heading: "Technical processing",
        paragraphs: ["ScreenWhy does not make broad promises that no cookies, infrastructure logs, network processing or third-party technical processing can ever occur. Hosting, delivery and other infrastructure may process technical request information, so this page avoids privacy claims that cannot be verified from the current product behavior."],
      },
      {
        key: "analytics-and-future-services",
        heading: "Analytics and future services",
        paragraphs: ["No public analytics integration is currently represented by the site. If analytics, advertising, accounts, comments, newsletters, contact submissions or other third-party services are introduced later, this policy should be updated before describing those services as active."],
      },
      {
        key: "policy-updates",
        heading: "Policy updates",
        paragraphs: ["Privacy information should be revised when the actual product changes. The date shown on this page is a stable content date, not a dynamically generated statement that the policy was reviewed on every request."],
      },
    ],
    related: ["terms", "contact", "aiUsagePolicy"],
  },
  terms: {
    key: "terms",
    route: EDITORIAL_ROUTES.terms,
    title: "Terms",
    eyebrow: "Legal & use",
    intro: "Baseline terms for using ScreenWhy as an informational and editorial explanation website.",
    metaDescription: "Baseline ScreenWhy terms covering editorial use, intellectual property, acceptable use, external links and content limitations.",
    lastUpdated: LAST_UPDATED,
    useToc: true,
    variant: "standard",
    sections: [
      {
        key: "editorial-purpose",
        heading: "Informational and editorial purpose",
        paragraphs: ["ScreenWhy provides explanation, commentary and story-understanding content. It does not provide streaming access, downloads, professional advice or a guarantee that every interpretation is the only possible reading of a story."],
      },
      {
        key: "intellectual-property",
        heading: "Intellectual property",
        paragraphs: ["ScreenWhy's own original site text, layout and editorial presentation may be protected by applicable intellectual-property rights. Titles, characters, trademarks and other third-party material remain associated with their respective rights holders where applicable."],
      },
      {
        key: "acceptable-use",
        heading: "Acceptable use",
        list: [
          "Do not use the site to interfere with its operation or security.",
          "Do not misrepresent ScreenWhy content as an official statement from a film studio, publisher, creator or rights holder.",
          "Do not use the site as a source of unauthorized copies, streams or downloads; ScreenWhy is not built for that purpose.",
        ],
      },
      {
        key: "external-links",
        heading: "External links and sources",
        paragraphs: ["An explanation may reference external sources or websites for evidence or context. A link does not mean ScreenWhy controls that external service or guarantees its continued availability."],
      },
      {
        key: "accuracy-and-updates",
        heading: "Accuracy and updates",
        paragraphs: ["ScreenWhy aims for clear and supportable explanations, but stories can be ambiguous and information can change. Content may be corrected, clarified or updated. These baseline terms do not create a response-time guarantee."],
      },
      {
        key: "legal-scope",
        heading: "Legal scope",
        paragraphs: ["These baseline terms do not state a governing-law jurisdiction, arbitration clause, registered company identity or paid-subscription terms because those details have not been established as authoritative public ScreenWhy information."],
      },
    ],
    related: ["privacy", "copyrightDmca", "contact"],
  },
  copyrightDmca: {
    key: "copyrightDmca",
    route: EDITORIAL_ROUTES.copyrightDmca,
    title: "Copyright / DMCA",
    eyebrow: "Copyright",
    intro: "How ScreenWhy approaches copyright concerns without publishing unverified agent or contact details.",
    metaDescription: "ScreenWhy copyright and DMCA guidance, including what information is useful in a takedown request and current contact limitations.",
    lastUpdated: LAST_UPDATED,
    useToc: true,
    variant: "standard",
    sections: [
      {
        key: "editorial-context",
        heading: "Editorial context",
        paragraphs: ["ScreenWhy is an explanation and commentary site. References to films, shows, characters, source works, creators or other third-party material are used to identify and discuss the stories being explained. Rights in third-party material remain with their respective rights holders where applicable."],
      },
      {
        key: "copyright-concern",
        heading: "If you have a copyright concern",
        paragraphs: ["A useful copyright or takedown request should clearly identify the protected work and the specific ScreenWhy URL or material at issue so the concern can be evaluated accurately."],
        list: [
          "identify the copyrighted work or rights you are relying on;",
          "identify the ScreenWhy URL or material you want reviewed;",
          "explain the basis of the request;",
          "provide only the contact information reasonably necessary for the request;",
          "state whether you are the rights holder or authorized to act for the rights holder.",
        ],
      },
      {
        key: "dmca-contact",
        heading: "DMCA contact status",
        paragraphs: ["A designated public DMCA agent name, mailing address, phone number and email address have not been verified for publication. This page therefore does not invent or imply a formal agent designation."],
        callout: {
          title: "Verified contact slot pending",
          body: "When verified DMCA contact details are available for publication, this page can display them.",
        },
      },
      {
        key: "misidentification",
        heading: "Avoid unnecessary personal information",
        paragraphs: ["A copyright request should contain enough information to identify the work, the disputed material and the requesting party's authority. Sensitive personal information that is unrelated to those points should not be included merely because this page describes a takedown process."],
      },
    ],
    related: ["terms", "contact", "sourcingPolicy"],
  },
};

export const EDITORIAL_PAGE_CONTENT: Readonly<Record<EditorialPageKey, EditorialPageDefinition>> = Object.freeze(pages);
