# Case folder convention (mirror for case-classroom-test)

This document mirrors the project spec for skill authors. The convention
is language-agnostic; Portuguese mappings are in the taxonomy table.

## Layout relevant to case-classroom-test

```
case-<slug>/
├── case.md       # input
├── teaching-note.md       # input
├── classroom/report.md          # this skill's output
└── internal/
    └── state.json
```

## Output file: `classroom/report.md`

Single Markdown file with sections for each mode invoked:

```markdown
---
cover:
  label: "<Classroom test, in the report language>"
  title: "<case title>"
  subtitle: "<pre-flight or real-classroom>"
  date: "<report date>"
  authors: ["<from intake; omit the field when null>"]
  institution: "<from intake; omit the field when null>"
  image: "../assets/cover-motif.svg"   # omit when the case has none
  image_alt: "<what the motif shows>"
---

# Classroom test — <case title>

## Mode
<pre-flight | real-classroom>

## Date
<ISO-8601>

## Audience profile (pre-flight)
- Level: <undergraduate|graduate|executive>
- Disciplines: <one or more>
- Location: <...>
- Prior cases seen: <list>
- AI tool access: <laptop | phone | allowed | blocked | ...>

## Pre-flight checks
| Check | Trigger fired? | Severity | Recommendation |
|---|---|---|---|
| ... | ... | ... | ... |

## AI-assisted moves catalogue
| Move | Target section | Counter-question |
|---|---|---|
| ... | ... | ... |

## (real-classroom only) Timing log
| Block | Planned | Actual | Notes |
|---|---|---|---|
| ... | ... | ... | ... |

## (real-classroom only) Question log
| Block | Question | Worked? | Notes |
|---|---|---|---|
| ... | ... | ... | ... |

## (real-classroom only) Board plan slippage
<planned vs actual>

## Revision brief
### High priority
- [ ] ...

### Medium priority
- [ ] ...

### Low priority
- [ ] ...
```

## State transition

- Reads state and the supplied case/note pair, including explicit variant paths after disguise; mode depends on whether this is a pre-flight or instructor-reported classroom session, not a required previous stage.
- Writes `stage = "case-classroom-test"`, `next_skill = "case-peer-review"` (when pre-flight passes and submission review is intended) or `next_skill = "case-business-case"` or `"case-teaching-note"` (according to which artifact needs revision) or `null` (when the run is final).
- Records mode in `history[].limitations` as `mode: pre-flight|real-classroom`.

## File-name taxonomy

| English (canonical) | Portuguese |
|---|---|
| `classroom/report.md` | (teste em sala) |
| `pre-flight` | (pré-teste) |
| `real-classroom` | (sala real) |

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
