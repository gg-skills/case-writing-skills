# state.json schema reference

This document is the runtime reference for `internal/state.json` in every
`case-<slug>/` folder. Mirrors the project spec in
`governanca/convencao-pastas-de-caso.md` §3. Field names and stored values
are English (see the taxonomy in `case-folder-convention.md` for the
Portuguese wording used with the author).

## Top-level fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `schema_version` | int | yes | `2` for this folder layout and these stored values. |
| `case_slug` | string | yes | The `case-<slug>/` slug. |
| `stage` | string | yes | Most recent successfully completed skill; `bootstrap` after initial setup. |
| `current_skill` | string \| null | yes | Skill currently running; `null` when idle. |
| `next_skill` | string \| null | yes | Recommended next skill; `null` when no skill follow-up is selected. |
| `work_target` | object \| null | no | Active variant paths, or `null` for root artifacts; absent in older version-2 states means `null`. |
| `history` | array | yes | Append-only log of completed runs. |
| `blockers` | array | yes | Active blockers with `depends_on`. |
| `config` | object | yes | Intake config (see `case-bootstrap`). |
| `updated_at` | string (ISO-8601) | yes | Last write timestamp. |

## history entry

```json
{
  "skill": "<skill-name>",
  "started_at": "<ISO-8601>",
  "completed_at": "<ISO-8601> | null",
  "status": "completed | partial | blocked | in-progress",
  "artifacts": ["<relative-path>", "..."],
  "checks": [
    {
      "description": "<string>",
      "result": "passed | failed | not-run",
      "evidence": "<path-or-text>"
    }
  ],
  "limitations": ["<string>", "..."],
  "next_action": "<string>"
}
```

## Completed stage and routing

`work_target` is `null` or absent for root artifacts. For a variant, store paths relative
to the case folder, for example:

```json
{
  "variant_id": "pilot-sao-paulo",
  "case": "variants/pilot-sao-paulo/case.md",
  "teaching_note": "variants/pilot-sao-paulo/teaching-note.md",
  "classroom_report": "variants/pilot-sao-paulo/classroom/report.md",
  "review_report": "variants/pilot-sao-paulo/review/report.md"
}
```

Use `null` for a document not yet written. `case-disguise` sets this object;
downstream skills read it before choosing paths and preserve it while working
on the variant. An explicit new target from the author replaces it. A
request to work on the master sets it back to `null`. History records the
exact paths used on every run, so the route survives a fresh conversation.

`stage` records the last successfully completed skill, using `bootstrap`
after initial setup. `next_skill` recommends work that has not yet been
completed; never copy that recommendation into `stage`.

| Completed skill | Stored `stage` | Recommended `next_skill` |
|---|---|---|
| `case-bootstrap` (initial setup) | `bootstrap` | `case-research`, or the applicable intake route |
| `case-research` (ready evidence pack) | `case-research` | `case-business-case` |
| `case-business-case` | `case-business-case` | `case-teaching-note` |
| `case-teaching-note` | `case-teaching-note` | `case-classroom-test` |
| `case-classroom-test` (either mode) | `case-classroom-test` | `case-business-case` or `case-teaching-note` for revision, `case-peer-review` for intended submission review, or `null` |
| `case-peer-review` | `case-peer-review` | Narrative/note revision, `case-disguise` for anonymization, an available and requested `case-package`, or `null` |
| `case-disguise` | `case-disguise` | Narrative/note work, classroom check, intended submission review, or `null`, according to variant readiness and requested scope |

A completed review can report problems: completion describes the review
work, not approval of the reviewed case. If a skill's own requested output
is partial or blocked, keep the previous successful `stage`, record the
appropriate history status and remaining action, and recommend the skill
that can resolve it. For exploratory research, use `next_skill:
"case-research"` until the evidence pack is ready. `null` means no skill
follow-up is selected; record any remaining author action in `next_action`.

Re-running bootstrap to refresh intake must preserve an existing successful
stage and history; it must not reset an advanced case to `bootstrap`.

A decision evidence pack with an applicable open research gate is not a ready
pack. Keep the previous successful `stage`, record `status: "partial"`,
and set `next_skill` to `case-research`.

## Cross-cutting notes

- Read state at start, set `current_skill` while running, then clear it to `null` and refresh `updated_at` at the end.
- Check applicable `blockers` before work; record `blocked` when one prevents the skill's output.
- Skills never edit a previous `history` entry — corrections are new entries.
- `blockers[].depends_on` is either a skill name or a path to a missing file/source.
- Each skill appends its inputs, outputs, human and AI contributions, checks,
  and pending checks to `internal/disclosure.md` at the end of a run. This
  internal audit file is not a reader-facing document.

## Intake config

`config` mirrors the collected intake. `subject` is the author's name for
the company, protagonist, or decision. `discipline`, `authors`, `institution`, `audience_level`,
`audience_location`, `target_journal`, `teaching_tension`, and
`contrast_set` are `null` until collected. `permission_status` is
`pending`, `granted`, or `not-applicable`. `sources_status` lives in
`internal/intake.yaml`, not in `config`.

`discipline` is a list of one or more English kebab-case slugs, such as
`["strategy", "marketing"]`. A case may serve several disciplines; keep
every one the author gave. Read a legacy single string as a one-item list.

`authors` is a list of names in the author's spelling and order, and
`institution` is one string. Bootstrap asks each when the author has not
said it. A deferred answer stays `null`, and the cover omits it. A case
written before these fields has no key; the first skill that writes a
cover asks for the missing one.

`teaching_tension` is a string: the doubt students must be able to argue.
`contrast_set` is a list of strings: products, people, or markets the
author names for comparison. Store each field when the author's message
already names it. Leave it `null` when the message does not. Neither
field is a blocking question, and bootstrap does not ask it. Write both
to `internal/intake.yaml` and to `config`. When a field is set, pass it
to `case-research`.

`schema_version` stays `2`. A missing or `null` field means "not collected
yet." For a field on the blocking list, the skill that needs it asks for
it and writes the answer. That answer is the author's approval to update
`config` and `intake.yaml`. Other edits to intake still need explicit
approval. `teaching_tension` and `contrast_set` are not on that list.

Bootstrap asks one blocking fact per turn. Audience level, audience
location, and target journal are not required to start research. The
question order is `intake-questions.md`.
