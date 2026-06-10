import { visit } from 'unist-util-visit';

/**
 * Minimal Obsidian-style wikilink support for the digital garden.
 *
 * Transforms inline `[[Note Title]]` and `[[Note Title|alias]]` text into
 * standard markdown links pointing at `/garden/<slug>`, where the slug is the
 * note title lowercased with spaces collapsed to hyphens — matching the scheme
 * used by `src/pages/garden/[slug].astro` and the garden index.
 *
 * An optional `#heading` after the target becomes a URL fragment, e.g.
 * `[[Design Engineering#UX in 2026]]` -> `/garden/design-engineering#ux-in-2026`.
 *
 * Image/file embeds (`![[file.png]]`) are intentionally left untouched — use
 * standard markdown `![](/path)` for images so they go through the asset pipeline.
 *
 * This is a deliberately small, dependency-light plugin: a malformed link
 * degrades to rendering the raw `[[...]]` text rather than blanking the note.
 */
const WIKILINK = /(!?)\[\[([^\]]+?)\]\]/g;

const slugify = (s) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-#/]/g, '');

export default function remarkWikilinks() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null || !WIKILINK.test(node.value)) return;
      WIKILINK.lastIndex = 0;

      const children = [];
      let lastIndex = 0;
      let match;

      while ((match = WIKILINK.exec(node.value)) !== null) {
        const [full, bang, inner] = match;

        // Leave image/file embeds (![[...]]) as literal text — handled elsewhere.
        if (bang === '!') continue;

        // Preceding plain text
        if (match.index > lastIndex) {
          children.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }

        const [targetRaw, aliasRaw] = inner.split('|');
        const [pathPart, headingPart] = targetRaw.split('#');
        const label = (aliasRaw ?? targetRaw.replace('#', ' › ')).trim();
        const slug = slugify(pathPart);
        const hash = headingPart ? `#${slugify(headingPart)}` : '';

        children.push({
          type: 'link',
          url: `/garden/${slug}${hash}`,
          data: { hProperties: { className: 'wikilink' } },
          children: [{ type: 'text', value: label }],
        });

        lastIndex = match.index + full.length;
      }

      // Trailing plain text
      if (lastIndex < node.value.length) {
        children.push({ type: 'text', value: node.value.slice(lastIndex) });
      }

      if (children.length > 0) {
        parent.children.splice(index, 1, ...children);
      }
    });
  };
}
