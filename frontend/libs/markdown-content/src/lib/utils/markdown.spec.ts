import { markdownToHtml, parseLocalizedFilename } from "./markdown";

const ARABIC_PARAGRAPH = "مرحباً بكم في المدونة";

describe("markdownToHtml direction", () => {
  it("marks paragraphs, headings, lists and quotes with dir=auto", () => {
    const html = markdownToHtml(
      ["# Title", "", "Body text", "", "- item", "", "> quote"].join("\n"),
    );
    expect(html).toContain('<h1 dir="auto">Title</h1>');
    expect(html).toContain('<p dir="auto">Body text</p>');
    expect(html).toContain('<ul dir="auto">');
    expect(html).toContain('<li dir="auto">item</li>');
    expect(html).toContain('<blockquote dir="auto">quote</blockquote>');
  });

  it("keeps Arabic text intact inside directional blocks", () => {
    const html = markdownToHtml(`## ${ARABIC_PARAGRAPH}\n\n${ARABIC_PARAGRAPH}`);
    expect(html).toContain(`<h2 dir="auto">${ARABIC_PARAGRAPH}</h2>`);
    expect(html).toContain(`<p dir="auto">${ARABIC_PARAGRAPH}</p>`);
  });
});

describe("parseLocalizedFilename", () => {
  it("splits a language suffix off the slug", () => {
    expect(parseLocalizedFilename("../content/news/welcome.ar.md")).toEqual({
      slug: "welcome",
      lang: "ar",
    });
  });

  it("leaves plain filenames alone", () => {
    expect(parseLocalizedFilename("../content/news/welcome.md")).toEqual({
      slug: "welcome",
    });
    expect(parseLocalizedFilename("../content/faq/text-to-image.md")).toEqual({
      slug: "text-to-image",
    });
  });
});
