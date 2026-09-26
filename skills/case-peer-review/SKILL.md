---
name: case-peer-review
description: when configuring blind peer review of a business case and its teaching note for journal submission — applies recurring critical checklists, predicts publication blockers, separates severity tiers. Keeps the report in canonical Markdown and also writes HTML and PDF. Handoff to author revision or case-package (backlog). Not for self-review or classroom pre-flight.
---

# case-peer-review

## Overview

Simulates a blind peer review for journal submission of a business case
and its teaching note. Applies recurring critical checklists that real
reviewers at Ivey, Case Centre, HBP, RAE, and similar venues raise.
Predicts publication blockers by severity. The skill produces a
structured critique for the author to address before submission.

## When to Use This Skill

**TRIGGER when:**
- The author intends to submit the case + teaching note to a journal.
- A draft has been revised after classroom pilot and is ready for external review.
- The author wants to simulate a review before paying submission fees.

**SKIP when:**
- The case is for internal use only and won't be submitted.
- The deliverable is classroom feedback (use `case-classroom-test`).
- The case is being repurposed (use `case-disguise`).

## Workflow

Read `internal/state.json`, check applicable `blockers`, and resolve
`work_target` before asking for a venue or reviewing files. If a blocker
prevents this output, record a blocked history entry and stop.

If `target_journal` in `internal/intake.yaml` is unset, ask which venue and stop before reviewing. Use the harness question tool when it exists. Options are Ivey, Case Centre, HBP, RAE, another named venue, or none. Store the answer in `internal/intake.yaml` and `config`. If the author chooses none, stop without a submission review.

1. **Check state and venue**: check applicable `blockers`; read `work_target` before choosing the case and note. Obtain the current submission instructions from the venue's official source or the author, and cite the version or access date in the report. If unavailable, mark editorial-format conformance unverified rather than guessing. Then adopt a reviewer persona and critique specifically.
2. **Apply the eight critical checklists**:
   - **Decision clarity and urgency**: is the decision unambiguous, urgent, consequential?
   - **Case vs note separation**: is the case body free of theory that belongs in the teaching note?
   - **Source verifiability**: are all claims traceable to sources; are citations correct? A highlighted quotation in the document language is sourced when the verbatim sentence is on the following `*Original:*` line, in the evidence pack, or in the author-only audit. Do not require the foreign-language sentence to occupy the highlight.
   - **Measurable learning objectives**: are objectives specific, measurable, mapped to case sections?
   - **Replicable lesson plan**: could a colleague who is not the author teach the class cold from the teaching note alone?
   - **Audience fit**: is the case appropriate for the declared reader?
   - **Originality of contribution**: does the case offer a new angle or only repeat the obvious?
   - **Editorial format conformance**: does the manuscript match the target journal's template?
3. **For each issue raised**: problem, evidence (page/section of case or note), suggestion for correction, severity (`impeditiva` = blocks publication, `importante` = should fix before next round, `menor` = optional).
4. **Differentiate simulated review from real review**: the skill does not have access to a real editorial board; it produces a structured self-assessment that approximates one. The author must not present the output as a real review.
5. **Update `internal/state.json`**: write `work_target.review_report` for a variant or `review/report.md` for the master, set `stage: "case-peer-review"`, and select `next_skill` from remaining work: `case-business-case` or `case-teaching-note` for revisions, `case-disguise` for anonymization, `case-package` only when available and requested, or `null` when the review has no skill follow-up. Preserve `work_target` and append history with the exact paths.
6. **Reader formats**: Write every heading, caption, cross reference, and label the reader sees in the document language, with the terms in [`references/taxonomy.md`](references/taxonomy.md) ("Anexo", not "Exhibit", in Portuguese). open `review/report.md` with the cover front matter in [`references/reader-formats.md`](references/reader-formats.md#cover-page): the peer-review label, the case title, the venue, the report date, and the case's cover image through `../assets/` when there is one. Keep that Markdown canonical. Render the sibling HTML and PDF, record all three paths, list every generated path for the author, and offer to open only `review/report.md`, PDF first. Follow [`references/reader-formats.md`](references/reader-formats.md).
7. **Disclosure**: append this run's inputs, outputs, AI contribution, human contribution, checks, and pending checks to `internal/disclosure.md`.

## Artifact paths and state

The root-level paths below are defaults. Read `work_target` from state before
choosing files; when it names a variant, use its case, note, and `review_report`
paths and preserve the masters. A caller's new explicit target updates
`work_target`. On a partial or blocked run, retain the last
successful `stage` and record limitations and the next action. On completion,
store this skill as `stage`, select `next_skill` from actual remaining work,
append history, clear `current_skill`, and refresh `updated_at`. A completed
review or classroom report may identify revisions; its completion does not
mean the case is approved.

## Continuing the pipeline

When this skill completes, follow [`references/pipeline-flow.md`](references/pipeline-flow.md):
tell the author in one line what comes next, and run `next_skill` in the
same turn. Stop only for a reason listed there. End every turn with the
harness question tool and options the author can pick, such as "Seguir com
a pesquisa".

## Inputs

- `case.md`, `teaching-note.md`, and the evidence pack or `research/manual-evidence-brief.md` used for the case.
- Target journal (from `internal/intake.yaml`).
- Author's revision history (if any) so the skill can avoid repeating already-resolved critiques.

## Outputs

- `case-<slug>/review/report.md` — the canonical review report.
- `case-<slug>/review/report.html` and `case-<slug>/review/report.pdf` — reading copies of that Markdown.
- Updated `internal/state.json` with a history entry.

## Limits

- Does not submit to any journal (the author does that).
- Does not edit the case or teaching note.
- Does not produce self-review — the skill simulates an outside reviewer.
- Does not produce classroom feedback (use `case-classroom-test`).
- Does not transform files for anonymization. Route that work to `case-disguise`, which can prepare a separate copy before a pilot or publication; review the supplied anonymized variant when that is the target.
- Does not edit HTML or PDF as sources. Regenerate them from the Markdown.

## References

- [`references/taxonomy.md`](references/taxonomy.md) — the terms the reader sees, per language: headings, captions, cross references, and cover labels ("Exhibit" is "Anexo" in Portuguese). Use it for every reader-facing document.
- [`references/pipeline-flow.md`](references/pipeline-flow.md) — continue into the next skill, when to stop, and the question that ends every turn.
- [`references/checklists.md`](references/checklists.md) — the eight critical checklists with examples and severity rules.
- [`references/reviewer-personas.md`](references/reviewer-personas.md) — how to simulate different reviewer types (Ivey, Case Centre, RAE).
- [`references/case-folder-convention.md`](references/case-folder-convention.md) — folder + state schema with English/Portuguese taxonomy.
- [`references/reader-formats.md`](references/reader-formats.md) — canonical Markdown, HTML and PDF copies, the paths to list, and the one main deliverable to offer to open.

## Common Pitfalls

1. Being too lenient — every checklist passes "in the spirit of" the case. Real reviewers will not.
2. Being too harsh — flagging every detail as `impeditiva`. Severity matters.
3. Vague suggestions ("the case could be clearer") — every critique must name a section and a fix.
4. Forgetting to flag the case-vs-note separation — the most common reviewer complaint.
5. Presenting the simulated review as a real review — that misleads the author.
