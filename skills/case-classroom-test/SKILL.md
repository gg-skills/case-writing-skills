---
name: case-classroom-test
description: when configuring pre-flight classroom checks and post-class debrief for a business case and its teaching note — audience-fit (geography, socio-demographic, AI-assisted student moves), complexity calibration, timing log, revision brief. Consumes case-business-case and case-teaching-note. Keeps the report in canonical Markdown and also writes HTML and PDF. Handoff to case-peer-review or author revision. Not for journal submission review.
---

# case-classroom-test

## Overview

Two-mode skill: pre-flight (before the case is used in class) and
real-classroom (after the case has been used). Pre-flight catches
audience-fit problems, complexity calibration, and likely student
moves (including AI-assisted shortcuts) before exposing students to a
case that does not land. Real-classroom captures the timing log,
questions that worked, and a revision brief.

## When to Use This Skill

**TRIGGER when:**
- A complete case + teaching note pair exists and is about to be used in class (pre-flight mode).
- The author wants to know whether the case will land with the intended audience before committing to a class session.
- After a real class session (real-classroom mode) — to capture feedback and produce a revision brief.
- The author wants to check whether a published case would resonate with a different audience.

**SKIP when:**
- The case has not been written yet.
- The deliverable is journal publication review (use `case-peer-review`).
- The case is purely a research artefact and will not be taught.

## Workflow

Before either mode, read `internal/state.json`, check applicable `blockers`,
and resolve `work_target`. If a blocker prevents this output, record a blocked
history entry and stop before preparing the report.

### Mode 1: pre-flight

1. **Audience profile**: read stored `audience_level`, `discipline`, and `audience_location`. Use what is already set. `discipline` is a list; check fit against every listed discipline. Do not ask before the first report. Mark each missing fact — level, location, prior case exposure, AI tool access during the session — as not informed in the audience profile, run every check the known facts support, and state which checks depend on a missing fact. Do not invent audience data. After the report is written, offer to add these facts, as [`references/pipeline-flow.md`](references/pipeline-flow.md#defaults-first-customize-after) says. When the author picks one, ask that one and revise the report. Write a level, discipline, or location answer into `internal/intake.yaml` and `config`; disciplines go into the `discipline` list, with multiple selections allowed. Keep prior exposure and AI access in the classroom report.
2. **Fit checks** — produce a short report flagging:
   - Context that requires orientation, based on the reported audience profile. Lack of local access to a service does not by itself mean the case should be replaced.
   - Concepts too advanced or too basic for the level.
   - AI-assisted student moves the case is vulnerable to (e.g., a calculation a spreadsheet can produce in one click; a summary the model can produce in 30 seconds).
   - Counter-arguments that obvious AI shortcuts would surface.
3. **Recommendation**: pass (use as-is), pass-with-revisions, or replace.
4. If pass-with-revisions, propose the minimal set of changes.
5. If replacement is recommended, record the author decision in `next_action` and use `next_skill: null` unless a specific revision skill can resolve the stated problem.

### Mode 2: real-classroom

1. **Capture timing log**: planned vs actual per block.
2. **Capture question log**: which questions worked, which fell flat, which produced unexpected responses.
3. **Capture board-plan slippage**: where the whiteboard diverged from the plan.
4. **Capture revision brief**: prioritized list of changes (case text, exhibits, teaching-note questions, timing).
5. **Cross-reference the rubric**: if assessment criteria were used, record how each criterion landed.

### Mode 3: ai-move catalogue (used in pre-flight and review)

A running catalogue of likely AI-assisted student moves for the case,
each tagged with the case section it targets and the counter-question
the author can use to block the shortcut without becoming obvious.

### Reader formats

Write every heading, caption, cross reference, and label the reader sees in the document language, with the terms in [`references/taxonomy.md`](references/taxonomy.md) ("Anexo", not "Exhibit", in Portuguese). Open `classroom/report.md` with the cover front matter in [`references/reader-formats.md`](references/reader-formats.md#cover-page): the classroom-test label, the case title, the mode, the report date, and the case's cover image through `../assets/` when there is one. Keep `classroom/report.md` canonical. Render the sibling HTML and PDF, record all three paths, list every generated path for the author, and offer to open only `classroom/report.md`, PDF first. Follow [`references/reader-formats.md`](references/reader-formats.md).

Check applicable state `blockers` before the report. At completion, append
the run's inputs, outputs, AI contribution, human contribution, checks, and
pending checks to `internal/disclosure.md`.

## Artifact paths and state

The root-level paths below are defaults. Read `work_target` from state before
choosing files; when it names a variant, use its case, note, and
`classroom_report` paths and preserve the masters. A caller's new explicit
target updates `work_target`. On a partial or blocked run, retain the last
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

- `case.md` and `teaching-note.md`.
- Audience profile (mode 1) or class session data (mode 2).
- Optional: rubric from a prior run.

## Outputs

- `case-<slug>/classroom/report.md` — the canonical test report, with mode flags.
- `case-<slug>/classroom/report.html` and `case-<slug>/classroom/report.pdf` — reading copies of that Markdown.
- Updated `internal/state.json` with a history entry that includes mode (`pre-flight` or `real-classroom`).
- For mode 2: a revision brief ready for the author to apply.

## Limits

- Does not write the case or the teaching note.
- Does not produce a journal submission review (use `case-peer-review`).
- Does not run real-classroom sessions itself — captures what the instructor reports.
- Does not invent audience data; everything must come from the author or from public, sourced geographic / demographic data with explicit citation.
- Does not edit HTML or PDF as sources. Regenerate them from the Markdown.

## References

- [`references/taxonomy.md`](references/taxonomy.md) — the terms the reader sees, per language: headings, captions, cross references, and cover labels ("Exhibit" is "Anexo" in Portuguese). Use it for every reader-facing document.
- [`references/pipeline-flow.md`](references/pipeline-flow.md) — continue into the next skill, when to stop, and the question that ends every turn.
- [`references/pre-flight-checks.md`](references/pre-flight-checks.md) — the check catalogue with examples.
- [`references/ai-assisted-moves.md`](references/ai-assisted-moves.md) — catalogue of likely AI moves per case type.
- [`references/timing-log-template.md`](references/timing-log-template.md) — the real-classroom template.
- [`references/case-folder-convention.md`](references/case-folder-convention.md) — folder + state schema with English/Portuguese taxonomy.
- [`references/reader-formats.md`](references/reader-formats.md) — canonical Markdown, HTML and PDF copies, the paths to list, and the one main deliverable to offer to open.

## Common Pitfalls

1. Running pre-flight without an audience profile — produces generic feedback.
2. Blocking AI shortcuts by adding a trap — students see through it; the case loses credibility.
3. Recording the timing log without recording the question log — timing slips often hide behind question slips.
4. Treating the AI-move catalogue as a one-shot; it should be refreshed after every pilot.
