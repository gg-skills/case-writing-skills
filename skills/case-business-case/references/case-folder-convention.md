# Case folder convention (mirror for case-business-case)

This document mirrors the project spec for skill authors. The convention
is language-agnostic; Portuguese mappings are in the taxonomy table.

## Layout relevant to case-business-case

```
case-<slug>/
├── case.md                      # this skill's output
├── case.html
├── case.pdf
├── assets/                      # figures in the case, and cover-motif.svg
├── research/                    # evidence pack read by this skill
└── internal/
    └── state.json
```

## Output file: `case.md`

The case body lives in this single Markdown file. Follow
[`hybrid-form.md`](hybrid-form.md). Open on sourced decision tension,
develop the live options with the context they need, and end without telling
the outcome. Use an outside objection, a five-beat comparison, and a
calculable exhibit when the decision and evidence call for them. The scaffold
below is only a file shape:

```markdown
---
cover:
  label: "<Teaching case, in the case language>"
  title: "<Case title>"
  subtitle: "<decision question, optional>"
  date: "<moment of the decision>"
  authors: ["<from intake; omit the field when null>"]
  institution: "<from intake; omit the field when null>"
  details: ["<disciplines>", "<audience level>"]
  image: "assets/cover-motif.svg"   # omit for a typographic cover
  image_alt: "<what the motif shows>"
---

# <Case title>

## Opening

<sourced tension, protagonist, stakes, and live options>

## Decision context

<relevant actors, businesses, evidence, and trade-offs>

## Ending

<live options and sourced arguments; the outcome is not told>

### Exhibit: <decision evidence; calculable consequences for a quantitative choice>

<!-- Write the heading in the case language: "Anexo 1. <title>" in Portuguese. See taxonomy.md. -->

<table>...</table>
```

Exhibits that are figures (charts, photos) live in `assets/` and
are referenced with relative paths. Tables can live inline in the
Markdown. When this skill replaces an existing `case.md`, move the previous
case, its HTML and PDF, and `assets/` into `archive/<yyyy-mm-dd-hhmm>/` first.

## State transition

This skill:

- Reads the existing state and checks that the evidence pack or manual brief is ready. Reads `work_target` before choosing a master or variant path. Revision runs may follow classroom testing, review, or disguise; do not rewrite `stage` to manufacture a prerequisite.
- Writes `internal/state.json` with `stage = "case-business-case"`, `next_skill = "case-teaching-note"`, and appends a history entry.

## File-name taxonomy

| English (canonical) | Portuguese |
|---|---|
| `case.md` | (caso de negócio / estudo de caso) |
| `assets/` | (ativos do caso) |
| `exhibit-N-*.png` | (Anexo N; the file name stays in English) |

## Reader formats

A Markdown document written for a person to read is canonical. In the same
turn, write sibling `.html` and `.pdf` files and ask which format to open.
Follow [`reader-formats.md`](reader-formats.md). Files in `internal/` are
not reading copies. Bootstrap creates no placeholder documents.

## State lifecycle

Read `internal/state.json` before work; set `current_skill` while running.
On successful completion, `stage` names the completed skill (`bootstrap`
only for initial setup), while `next_skill` recommends the next action.
For partial or blocked work, retain the last completed stage and record the
status, limitations, and remaining action in a new history entry. At the end,
clear `current_skill` to `null` and refresh `updated_at`. Never replace earlier
history. Re-running intake preserves the existing completed stage.
