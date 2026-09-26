# Case folder convention (mirror for case-teaching-note)

This document mirrors the project spec for skill authors. The convention
is language-agnostic; Portuguese mappings are in the taxonomy table.

## Layout relevant to case-teaching-note

```
case-<slug>/
├── case.md                      # input
├── teaching-note.md             # this skill's output, with .html and .pdf
├── research/                    # evidence pack or manual brief input
└── internal/
    └── state.json
```

## Output file: `teaching-note.md`

Replacing an existing note moves the previous Markdown, HTML, and PDF into
`archive/<yyyy-mm-dd-hhmm>/` first.

Single Markdown file with these sections:

```markdown
---
cover:
  label: "<Teaching note, in the note language>"
  title: "<case title>"
  date: "<the case's date>"
  authors: ["<from intake; omit the field when null>"]
  institution: "<from intake; omit the field when null>"
  details: ["<disciplines>", "<audience level>"]
  notice: "<For instructor use only, in the note language>"
  image: "assets/cover-motif.svg"   # the case's motif; omit when the case has none
  image_alt: "<what the motif shows>"
---

# Teaching note — <case title>

## Synopsis
<one paragraph, mirror of the case without spoiler>

## Learning objectives
1. <objective 1>
2. <objective 2>
3. <objective 3>

## Theoretical lenses
- <lens 1>: <one-sentence application>
- <lens 2>: ...

## Class plan

### Block 1 — Cold open + context (15 min)
- Question: <verbatim question>
- Board: <state at the end of the block>
- Analysis: <worked reasoning, plausible responses, calculations, and follow-up guidance for another instructor>

### Block 2 — Dilemma + data (20 min)
- ...

### Block 3 — Decision moment (20 min)
- ...

### Block 4 — Wrap-up + transfer (20 min)
- ...

### Buffer (5 min)
<overrun allowance; all blocks and buffer total 80 minutes>

## Pre-class assignment
<case reading and any required theoretical readings or declared prerequisites>

## Post-class reflection
<prompt for individual or group>

## Assessment rubric
<default 5-criteria, or override from case-classroom-test>

## Board plan
<mermaid flowchart>
```

## State transition

- Reads state and the supplied case artifacts. May run after drafting, classroom feedback, review, or disguise; evaluate inputs instead of requiring a single previous stage. For a variant, use the explicit variant case and note paths and update `internal/state.json`.
- Writes `stage = "case-teaching-note"`, `next_skill = "case-classroom-test"`, appends history.

## File-name taxonomy

| English (canonical) | Portuguese |
|---|---|
| `teaching-note.md` | (nota de ensino) |
| `Synopsis` | (sinopse) |
| `Learning objectives` | (objetivos de aprendizagem) |
| `Theoretical lenses` | (lentes teóricas) |
| `Class plan` | (plano de aula) |
| `Assessment rubric` | (rubrica de avaliação) |

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
