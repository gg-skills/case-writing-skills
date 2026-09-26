# Case folder convention (mirror for case-peer-review)

This document mirrors the project spec for skill authors. The convention
is language-agnostic; Portuguese mappings are in the taxonomy table.

## Layout relevant to case-peer-review

```
case-<slug>/
├── case.md       # input
├── teaching-note.md       # input
├── review/report.md             # this skill's output
└── internal/
    └── state.json
```

## Output file: `review/report.md`

```markdown
---
cover:
  label: "<Peer review, in the report language>"
  title: "<case title>"
  subtitle: "<venue>"
  date: "<report date>"
  authors: ["<from intake; omit the field when null>"]
  institution: "<from intake; omit the field when null>"
  image: "../assets/cover-motif.svg"   # omit when the case has none
  image_alt: "<what the motif shows>"
---

# Peer review — <case title>

## Reviewer persona
<ivey | case-centre | hbp | rae | other>

## Date
<ISO-8601>

## Summary
<2–3 sentences>

## Critical findings
| # | Checklist | Severity | Problem | Evidence | Suggested fix |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

## Detailed findings
### 1. <checklist name>
- **Severity**: <impeditiva | importante | menor>
- **Problem**: <text>
- **Evidence**: <page/section>
- **Suggested fix**: <text>

### 2. <checklist name>
- ...

## Recommendation
<submit-as-is | revise-and-resubmit | major-revision | not-recommended-for-this-journal>
```

## State transition

- Reads the existing state and supplied case/note paths, including explicit variant paths. Review may follow classroom testing or anonymization; no single previous stage is required.
- On completion, writes `stage = "case-peer-review"` and routes `next_skill` to narrative or note revision, `case-disguise` for anonymization, an available and requested `case-package`, or `null` when no skill follow-up is needed. Record specific artifact paths in `next_action`.
- Records `persona` and `recommendation` in `history[].limitations`.

## File-name taxonomy

| English (canonical) | Portuguese |
|---|---|
| `review/report.md` | (revisão por pares) |
| `impeditiva` | (impeditiva) |
| `importante` | (importante) |
| `menor` | (menor) |
| `submit-as-is` | (submeter como está) |
| `revise-and-resubmit` | (revisar e submeter novamente) |
| `major-revision` | (revisão ampla) |

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
