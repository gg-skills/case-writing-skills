# Reader formats

Markdown is the canonical text of every document a case skill writes for a
person to read. HTML and PDF are reading copies of that Markdown. They are
not sources. When a reading copy and the Markdown disagree, regenerate the
copies from the Markdown.

## When to render

In the same turn that a skill writes or updates a reader-facing Markdown
document, and before reporting that document as ready, run this skill's
renderer once per file. The script lives next to this skill's `SKILL.md`:

```sh
node scripts/render-reader-formats.ts --input path/to/document.md
```

Use the script path from the skill directory. The program writes
`document.html` and `document.pdf` beside the Markdown and does not modify
the Markdown. Replace those copies whenever the Markdown changes.

Render every such document: `case.md`, `teaching-note.md`, each file in
`research/`, `classroom/report.md`, `review/report.md`, a variant's `case.md`
and `teaching-note.md`, and that variant's `audit.md`.

Leave these unrendered:

- everything in `internal/` (`state.json`, `intake.yaml`, `disclosure.md`)
- files stored under `research/sources/` rather than authored
- `archive/`, which already holds finished reading copies

`case-bootstrap` creates no placeholder documents. A document is rendered
when a later skill writes its Markdown.

An author-only `audit.md` stays author-only in every format. Its HTML and
PDF remain beside that Markdown, inside `variants/<variant-id>/`, and stay
out of student and submission copies.

Record the Markdown path and both reading-copy paths in the history entry's
`artifacts`.

If the renderer fails, report that failure and leave any previous reading
copies untouched. Do not describe HTML or PDF as ready.

## Cover page

Each main deliverable opens with a cover page: `case.md`, `teaching-note.md`,
`classroom/report.md`, `review/report.md`, and a variant's `case.md` and
`teaching-note.md`. The research files and `audit.md` have no cover.

The cover lives in the Markdown, as a front-matter block before the
document's own `#` title. The renderer turns it into the first PDF page and
a title block in the HTML. Write the values in the document's language,
with the labels in [`taxonomy.md`](taxonomy.md).

```markdown
---
cover:
  label: "Caso de ensino"
  title: "Marvel Enterprises"
  subtitle: "Sustentar o licenciamento depois do Homem-Aranha?"
  date: "29 de junho de 2004"
  authors: ["Ana Souza"]
  institution: "Escola X"
  details: ["Estratégia · Marketing", "Pós-graduação"]
  notice: null
  image: "assets/cover-motif.svg"
  image_alt: "Um círculo grande seguido de círculos menores e tracejados"
  image_credit: null
---

# Marvel Enterprises
```

| Field | Content |
|---|---|
| `label` | The document type: case, teaching note, classroom test, or peer review, in the document language |
| `title` | Required. The case title, as in the case's `#` heading |
| `subtitle` | Optional. One line: the decision question, or for a report, what it reviews |
| `date` | The case: the moment of the decision. The note: the same date as the case. A report: its own date |
| `authors` | `authors` from `internal/intake.yaml`. Leave the field out when it is `null` |
| `institution` | `institution` from `internal/intake.yaml`. Leave the field out when it is `null` |
| `details` | Short lines: the disciplines and the audience level from intake, in the document language; a report may add its mode or venue |
| `notice` | The teaching note: "For instructor use only" or its translation. Otherwise `null` |
| `image`, `image_alt`, `image_credit` | The cover graphic, its description, and its credit, relative to the Markdown file |

Use only these fields; the renderer rejects any other. Quote a value that
contains `: `, `#`, or a leading quote. Do not put an AI-assistance,
copyright, or disclosure line on the cover. Do not put a company logo or a
real brand mark on it.

When an older case has no `authors` or `institution` key in
`internal/intake.yaml`, ask that one fact before writing the first cover,
in the author's language, and store it. A stored `null` means the author
deferred: leave the field off without asking again.

### Cover graphic

The default graphic is an abstract motif that fits the case. The fallback
is a typographic cover with no graphic.

- Draw the motif only when you can view images and so check the result.
  Write `assets/cover-motif.svg` beside the case: an SVG with a
  `viewBox="0 0 600 300"`, two to four colours, and simple shapes that
  echo the case's tension, such as one large element against several
  smaller ones, a split, a fork, or a scale. No text, no logos, no brand
  marks, no likeness of a real person, and no external references.
- Render, then look at the first PDF page. If the motif is unreadable,
  crowded, or misleading, fix it or remove `image` from the cover.
- When you cannot view images, leave `image` out. The renderer then
  prints a typographic cover. Do not ship a motif you could not look at.
- The teaching note and the reports reuse the case's motif through a
  relative path, such as `../assets/cover-motif.svg` from `classroom/`.
- A variant draws or copies its own motif inside `variants/<variant-id>/assets/`.
  An anonymized variant does not reuse a motif that could identify the
  subject.
- When the author supplies an image or another asset, copy it into
  `assets/`, point `image` to it, and fill `image_alt` and, when there is
  one, `image_credit`. An author-supplied image replaces the motif. Keep
  it on later runs and never redraw over it. Redraw an existing motif only
  when the author asks.

If the renderer rejects the cover, fix the front matter and render again.
Do not report the document as ready with a failed cover.

## Opening

At the end of a run, list the paths of every document the run wrote or
updated: each Markdown file with its HTML and PDF copies. Then offer to
open **only the run's main deliverable**. Supporting documents get their
paths, not an offer to open them.

| Skill | Main deliverable to offer |
|---|---|
| `case-business-case` | `case.md` |
| `case-teaching-note` | `teaching-note.md` |
| `case-classroom-test` | `classroom/report.md` |
| `case-peer-review` | `review/report.md` |
| `case-disguise` | the variant's `case.md`; the variant's `teaching-note.md` only when the run changed the note alone. Never `audit.md`. |
| `case-research` | none. The evidence pack is working material for the case. List its paths and ask nothing. |
| `case-bootstrap` | none. It renders nothing. |

When one run covers several skills (see
[`pipeline-flow.md`](pipeline-flow.md)), do not ask between steps. Ask
once, at the end: offer the case when the run wrote or rewrote it, and
otherwise the main deliverable of the last skill that produced one. Do not
ask about the intermediate documents.

Ask in the author's language. One question. Open nothing until they
answer, including in that same turn. If they decline, leave the files in
place.

When the running harness has a structured question tool (`ask_user_question`,
`AskUserQuestion`, or the local equivalent), use it for this choice. Pass
one question that names the main deliverable, for example "Abrir o caso
agora?". The options are PDF, HTML, Markdown, and not now, each with a
one-line description. PDF is the recommended format: put it first and
mark it as recommended (for example "(Recomendado)" in the label, or the
tool's own recommended marker). Do not recommend HTML or Markdown unless
the author has said they prefer that format. If the harness has no such
tool, ask the same choice in one short message and name PDF as the
recommendation. Do not list other pending work or
other documents as options in that question.

After they choose a format, open only the main deliverable in it:

```sh
node scripts/render-reader-formats.ts --input path/to/case.md --open pdf
```

`--open` accepts `markdown`, `html`, or `pdf`. This rerun regenerates the
copies from the current Markdown and then opens the chosen file. To open an
existing file without rewriting it, use the operating-system opener on that
path (`open` on macOS). Open a supporting document only when the author
asks for that file.

## Quotations the reader sees

In `case.md`, `teaching-note.md`, and a variant's copies of those files, a
quotation is already in the language of that document. The highlighted
quotation is that wording. When the source uses another language, the
verbatim sentence may sit on the next line, outside the quotation, in a
quieter style. Omit that line when the source is already in the document
language, or when the author asks to leave it off the page. An anonymized
student or submission copy also omits it when the source sentence would
identify the subject. The verbatim wording then stays in the author-only
audit.

```markdown
> "Ninguém garante o resultado do lançamento, e uma continuação precisa superar o original."

*Original:* "No one can guarantee the launch, and a sequel has to outperform the original."
```

The blockquote is the citation the reader meets. `*Original:*` is the
verbatim source. `*No original:*` is the same line when the document uses
that label. The renderer styles the blockquote as the highlighted citation
and that following line as secondary text. A short quotation inside a
paragraph uses the same order: the words in quotation marks are the
document language, and `*Original:*` may follow in that paragraph.

Do not put the source-language sentence in the highlighted quotation and
the translation underneath. Do not invent either sentence. The translation
adds no fact the source does not state.

`research/`, `classroom/report.md`, `review/report.md`, and `audit.md` keep
the source wording. They are working documents. The evidence pack stays
verbatim so the case can translate from it.

## Limits

The PDF is printed with headless Chrome or Chromium. Pass `--chrome PATH`
or set `CASE_WRITING_CHROME` when the browser is not in a standard location.
A fenced ` ```mermaid ` block is drawn as a diagram: the renderer runs
Mermaid once in the same browser and stores the result in the HTML as an
inline SVG, so the HTML and the PDF show it without a script or a
network connection. Mermaid is loaded from `--mermaid PATH`, from
`CASE_WRITING_MERMAID`, or from jsDelivr at a pinned version; offline,
pass a local `mermaid.min.js`. Other fenced blocks stay as code.

Write a flowchart, timeline, or other diagram as a `mermaid` block. When
the renderer warns that a diagram could not be drawn, that block is still
source text in the HTML and PDF: fix its Mermaid syntax and render again.
When Mermaid cannot be loaded at all, report that the diagrams stay as
source text. Do not describe a document as ready while one of its
diagrams is shown as code.
Relative links and images in the Markdown are preserved.
