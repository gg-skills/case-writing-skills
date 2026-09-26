# Case folder convention (mirror for case-disguise)

## Storage

```text
case-<slug>/
├── case.md                          # unchanged master
├── teaching-note.md                 # unchanged master, if available
├── variants/
│   └── <variant-id>/
│       ├── case.md
│       ├── teaching-note.md         # synchronized copy, if a source note exists
│       ├── assets/                  # variant figures and cover-motif.svg
│       ├── classroom/report.md     # when tested
│       ├── review/report.md        # when reviewed
│       └── audit.md                 # author-only audit and identity crosswalk
└── internal/
    └── state.json
```

Every mode uses a distinct variant destination, including surface disguise
and anonymization before a first pilot. Never rewrite the master in place.
Use a descriptive, lowercase, ASCII, hyphenated variant ID. For a new variant,
do not overwrite an existing variant folder. Continue an existing variant
only when that is the author's request.

Copy or transform referenced assets and repair relative links. Raw sources
remain unchanged. The private audit trail and identity mapping must not enter
a student or submission bundle. When handing a variant to another skill, set
`work_target` in the root `internal/state.json` with `variant_id`, `case`,
`teaching_note`, `classroom_report`, and `review_report` paths relative to the
case folder. A missing note is `null`. The next skill reads that target before
choosing files and must not fall back to master artifacts or create a nested state.

## State transition

- Read `internal/state.json` and the source artifacts; no completed pilot stage is required.
- On successful completion of the requested transformation, set `stage = "case-disguise"`. A draft-only anonymization can be complete even when a teaching note has not yet been written; record that distinction.
- If the requested transformation or pair synchronization is incomplete, retain the last successfully completed `stage` and record `status: "partial"` or `"blocked"`, with the limitation and next action.
- Choose `next_skill` from actual remaining work: `case-business-case` for narrative revision, `case-teaching-note` for missing or revised note analysis, `case-classroom-test` for an intended pilot check, `case-peer-review` for requested submission review, or `null` when the requested work is complete with no skill follow-up. Store an author-only action in `history[].next_action` when no skill can resolve it.
- Append history with mode, exact variant artifact paths, checks, limitations, and `next_action`. Set `current_skill = null` at the end and refresh `updated_at`.

## Taxonomy

| Identifier | Portuguese |
|---|---|
| `variants/` | variantes do caso |
| `variant-id` | identificador da variante |
| `anonymization` | anonimização para um público definido |
| `audit.md` | relatório privado e trilha de alterações |

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
