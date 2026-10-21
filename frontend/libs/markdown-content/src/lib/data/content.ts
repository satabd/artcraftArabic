import {
  detectTextDirection,
  useLocaleStore,
  type TextDirection,
} from "@storyteller/common";
import { parseFrontmatter, parseLocalizedFilename } from "../utils/markdown";

// Documents are bundled per language: `welcome.md` is English and
// `welcome.ar.md` is its Arabic translation (same slug). Every item carries
// the language it is written in and the direction it must be displayed in,
// so pages can set <article lang dir> and right-to-left text lays out
// correctly even for documents that were never translated.

export const DEFAULT_DOCUMENT_LANGUAGE = "en";

/** Languages written right-to-left; anything else is left-to-right. */
const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur", "ps", "sd", "ug", "yi"]);

export interface DocumentLocale {
  /** BCP 47 language code the document is written in. */
  lang: string;
  /** Display direction: explicit `dir:` frontmatter, else by language, else detected from the text. */
  direction: TextDirection;
}

export interface LocalizedQuery {
  /** Preferred language; defaults to the app language from the locale store. */
  language?: string;
}

/** Resolve lang + direction for a document from frontmatter, filename and text. */
export function resolveDocumentLocale({
  frontmatter,
  filenameLang,
  title,
  body,
}: {
  frontmatter: Record<string, string>;
  filenameLang?: string;
  title: string;
  body: string;
}): DocumentLocale {
  const lang = (frontmatter.lang || filenameLang || DEFAULT_DOCUMENT_LANGUAGE)
    .trim()
    .toLowerCase();
  const explicitDir = (frontmatter.dir || "").trim().toLowerCase();
  if (explicitDir === "rtl" || explicitDir === "ltr") {
    return { lang, direction: explicitDir };
  }
  if (frontmatter.lang || filenameLang) {
    return {
      lang,
      direction: RTL_LANGUAGES.has(lang.split("-")[0]) ? "rtl" : "ltr",
    };
  }
  return { lang, direction: detectTextDirection(`${title}\n${body}`) };
}

/** Direction for documents that arrived without one (e.g. a remote news feed). */
export function getDocumentDirection(doc: {
  direction?: string;
  lang?: string;
  title?: string;
  body?: string;
  description?: string;
}): TextDirection {
  if (doc.direction === "rtl" || doc.direction === "ltr") return doc.direction;
  if (doc.lang) {
    return RTL_LANGUAGES.has(doc.lang.toLowerCase().split("-")[0])
      ? "rtl"
      : "ltr";
  }
  return detectTextDirection(
    `${doc.title ?? ""}\n${doc.description ?? ""}\n${doc.body ?? ""}`,
  );
}

/**
 * Keep one item per slug: the one in `language` if it exists, else the
 * English original, else whatever is bundled. Preserves input order.
 */
export function selectLocalizedItems<T extends { slug: string; lang: string }>(
  items: T[],
  language: string,
): T[] {
  const wanted = language.trim().toLowerCase();
  const bySlug = new Map<string, T>();
  const rank = (item: T): number =>
    item.lang === wanted ? 0 : item.lang === DEFAULT_DOCUMENT_LANGUAGE ? 1 : 2;
  for (const item of items) {
    const current = bySlug.get(item.slug);
    if (!current || rank(item) < rank(current)) bySlug.set(item.slug, item);
  }
  return items.filter((item) => bySlug.get(item.slug) === item);
}

function resolveQueryLanguage(query?: LocalizedQuery): string {
  return query?.language ?? useLocaleStore.getState().language;
}

// NEWS
const newsFiles = import.meta.glob("../content/news/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export interface NewsPostData extends DocumentLocale {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string;
  thumbnail?: string;
}

/** All bundled news posts in every language, newest first. */
export const getAllNewsPosts = (): NewsPostData[] => {
  return Object.entries(newsFiles)
    .map(([path, raw]) => {
      const { frontmatter, body } = parseFrontmatter(raw as string);
      const { slug, lang: filenameLang } = parseLocalizedFilename(path);
      const title = frontmatter.title || slug;
      return {
        slug,
        title,
        description: frontmatter.abstract || "",
        date: frontmatter.date || "",
        thumbnail: frontmatter.thumbnail,
        body,
        ...resolveDocumentLocale({ frontmatter, filenameLang, title, body }),
      };
    })
    .sort((a, b) => {
      if (a.date && b.date)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0; // consistent output
    });
};

/** News posts for one language (the app language by default), one per slug. */
export const getNewsPosts = (query?: LocalizedQuery): NewsPostData[] => {
  return selectLocalizedItems(getAllNewsPosts(), resolveQueryLanguage(query));
};

export const getNewsPostBySlug = (
  slug: string,
  query?: LocalizedQuery,
): NewsPostData | null => {
  const posts = getNewsPosts(query);
  return posts.find((p) => p.slug === slug) || null;
};

// FAQ
const faqFiles = import.meta.glob("../content/faq/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export interface FaqItem extends DocumentLocale {
  slug: string;
  title: string;
  description: string;
  body: string;
  isPublished: boolean;
  thumbnail?: string;
}

/** All bundled FAQ entries in every language. */
export const getAllFaqItems = (): FaqItem[] => {
  return Object.entries(faqFiles).map(([path, raw]) => {
    const { frontmatter, body } = parseFrontmatter(raw as string);
    const { slug, lang: filenameLang } = parseLocalizedFilename(path);
    const title = frontmatter.title || slug;
    return {
      slug,
      title,
      description: frontmatter.abstract || "",
      body,
      isPublished: frontmatter.isPublished !== "false",
      thumbnail: frontmatter.thumbnail,
      ...resolveDocumentLocale({ frontmatter, filenameLang, title, body }),
    };
  });
};

/** FAQ entries for one language (the app language by default), one per slug. */
export const getFaqItems = (query?: LocalizedQuery): FaqItem[] => {
  return selectLocalizedItems(getAllFaqItems(), resolveQueryLanguage(query));
};

export const getFaqItemBySlug = (
  slug: string,
  query?: LocalizedQuery,
): FaqItem | null => {
  const items = getFaqItems(query);
  return items.find(i => i.slug === slug) || null;
};


// TUTORIALS
const tutorialFiles = import.meta.glob("../content/tutorials/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export interface TutorialItem extends DocumentLocale {
  slug: string;
  title: string;
  abstract: string;
  category?: string;
  thumbnail?: string;
  videoUrl?: string;
  youtubeId?: string;
  aliases?: string[];
  body: string;
  isPublished: boolean;
}

/** All bundled tutorials in every language. */
export const getAllTutorialItems = (): TutorialItem[] => {
  return Object.entries(tutorialFiles).map(([path, raw]) => {
    const { frontmatter, body } = parseFrontmatter(raw as string);
    const { slug, lang: filenameLang } = parseLocalizedFilename(path);
    const title = frontmatter.title || slug;
    return {
      slug: (frontmatter.slug || slug).trim().toLowerCase(),
      title,
      abstract: frontmatter.abstract || "",
      category: frontmatter.category,
      thumbnail: frontmatter.thumbnail,
      videoUrl: frontmatter.videoUrl,
      youtubeId: frontmatter.youtubeId,
      aliases: frontmatter.aliases ? frontmatter.aliases.split(/[\s,]+/).map(s => s.trim().toLowerCase()).filter(Boolean) : [],
      body,
      isPublished: frontmatter.isPublished !== "false",
      ...resolveDocumentLocale({ frontmatter, filenameLang, title, body }),
    };
  });
};

/** Tutorials for one language (the app language by default), one per slug. */
export const getTutorialItems = (query?: LocalizedQuery): TutorialItem[] => {
  return selectLocalizedItems(
    getAllTutorialItems(),
    resolveQueryLanguage(query),
  );
};

export const getTutorialItemBySlug = (
  slug: string,
  query?: LocalizedQuery,
): TutorialItem | null => {
    const items = getTutorialItems(query);
    const wanted = slug.toLowerCase();
    return items.find(t => t.slug === wanted || t.aliases?.includes(wanted)) || null;
};
