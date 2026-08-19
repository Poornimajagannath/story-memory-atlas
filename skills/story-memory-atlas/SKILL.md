---
name: story-memory-atlas
description: Create a beautiful, self-contained interactive HTML memory guide for a book, film, myth, or story world. Use when a user wants to remember a story, explore its characters, compare its themes with another tradition, or turn reading notes into a visual atlas.
---

# Story Memory Atlas

Build an offline-friendly single-file HTML guide that helps a reader recall a story without reproducing the source text.

## Workflow

1. Identify the source work, spoiler boundary, and reader goal.
2. Research only what needs verification. Prefer publisher, author, museum, university, or reference sources. Label uncertain dates and distinguish fictional setting, composition/publication date, and later adaptations.
3. Create original summaries. Do not copy book passages, screenplay text, lyrics, or DRM-protected files.
4. Use `templates/atlas-template.html` as the visual starting point. Keep the page dependency-light and usable without a build step.
5. Include these sections unless the user asks for a smaller guide:
   - a strong title and short orientation;
   - a chapter, act, or mission summary in 4–6 interactive tabs;
   - a searchable character map with categories;
   - a timeline with uncertainty labels;
   - themes, parallels, or a domain map;
   - one recall quiz or memory prompt;
   - source links and a spoiler notice.
6. Validate the HTML structure and JavaScript syntax. Check that tabs, filters, search, theme controls, and quiz feedback work. Report the exact saved path.

## Design rules

- Use one visual metaphor tied to the work: sea and constellations for epics, orbital paths for space fiction, and so on.
- Use a clear serif display face with a restrained sans-serif body face. Keep contrast high and mobile layouts simple.
- Prefer original CSS, inline SVG, gradients, and text over remote images. External font loading may be progressive enhancement only.
- Use short cards and tabbed content. Do not turn the page into a wall of prose.
- State when an entry is a principal character rather than claiming literal completeness.
- Keep comparisons respectful. Similar themes are not proof of shared origins or copying.

## Copyright and privacy

- Summarize and analyze. Do not provide substantial verbatim text from copyrighted books or films.
- Do not bypass DRM or extract protected ebooks. Ask for user-provided notes or a lawful, DRM-free source when source text is needed.
- Do not put private names, credentials, library barcodes, loan links, or tokens in the HTML or repository.

## Output layout

For a reusable repository, use:

```text
examples/<work>-memory-atlas.html
templates/atlas-template.html
skills/story-memory-atlas/SKILL.md
```

Keep the skill itself under 500 lines. Put large reference material in `references/` only when it is reused across multiple atlas builds.
