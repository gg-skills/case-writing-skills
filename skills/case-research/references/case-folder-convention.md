# Case folder convention (mirror for case-research)

This document mirrors the project spec for skill authors who don't need
the full governance file. The convention is language-agnostic; Portuguese
mappings are in the taxonomy table at the end.

## Layout relevant to case-research

```
case-<slug>/
├── research/
│   ├── timeline.md
│   ├── cast.md
│   ├── financials.md
│   ├── quotes-by-theme.md
│   ├── exhibit-candidates.md
│   ├── extraction-log.md
│   └── sources/
│       ├── public/<source-id>/
│       └── private/<interview-id>/
└── internal/
    └── state.json
```

## Source-ID conventions

- `public/<source-id>/`: kebab-case, derived from the source name (e.g., `sec-10k-2023`, `globo-news-2024-09`).
- `private/<interview-id>/`: kebab-case, derived from the role or pseudonym (e.g., `interview-ceo`, `interview-cfo`).
- IDs are stable across runs — the author references them by ID in `internal/state.json` history artifacts.

## File-name taxonomy (English canonical)

| English (canonical) | Portuguese |
|---|---|
| `timeline.md` | (linha do tempo) |
| `cast.md` | (personagens) |
| `financials.md` | (dados financeiros) |
| `quotes-by-theme.md` | (citações por tema) |
| `exhibit-candidates.md` | (candidatos a exhibit) |
| `extraction-log.md` | (log de extração) |
| `internal/state.json` | (estado do caso) |
| `research/sources/public/` | (fontes públicas) |
| `research/sources/private/` | (fontes privadas / entrevistas) |

## State transition

This skill:

- Reads `internal/state.json` at start.
- On a completed evidence pack that passes the applicable [`research-gates.md`](research-gates.md), writes `stage = "case-research"`, `next_skill = "case-business-case"`, and appends history. An exploratory pass, or a decision with needed evidence still missing, retains the last completed `stage`, records `status: "partial"`, and recommends `case-research` with the remaining action in `next_action`.
- Records `[VERIFY]` count in `history[].limitations` if the count is non-zero.

See `state-schema.md` in `case-bootstrap/references/` for the full schema.

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
