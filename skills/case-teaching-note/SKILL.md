---
name: case-teaching-note
description: when configuring a teaching note for a business case — learning objectives, theory, 80-minute class plan with socratic questions, board plan, assessment. Consumes the case-business-case output. Keeps the note in canonical Markdown and also writes HTML and PDF. Handoff to case-classroom-test. Not for the case narrative itself.
---

# case-teaching-note

## Overview

Writes the instructor-facing teaching note that pairs with the case
narrative from `case-business-case`. Where the case is the story, the
teaching note is the pedagogy: where it lives in the curriculum, what
theory frames it, what questions drive the discussion, how to assess.

## When to Use This Skill

**TRIGGER when:**
- A `case.md` exists at the case root, or the caller supplies a variant's `case.md`, and the author wants the teaching companion.
- The author is repurposing an existing case for a different audience (course, level, time budget).
- The author wants to refresh the socratic questions after a pilot run.

**SKIP when:**
- No case narrative yet (run `case-business-case` first).
- The deliverable is a research dossier, not a teaching instrument.
- The course is a non-case teaching context (lecture-only, lab, etc.).

## Workflow

Before reading or writing artifacts, read `internal/state.json`, check
applicable `blockers`, and resolve `work_target`. If a blocker prevents the
note, record a blocked history entry and stop.

1. **Read the case** (`case.md`) and its evidence pack in `research/` or `research/manual-evidence-brief.md`.
2. **Author interview**: read `internal/intake.yaml`. Use `discipline` and `audience_level` when they are set. `discipline` is a list; when it names more than one field, choose lenses, questions, and board work that serve each listed discipline instead of picking one. Do not ask before writing the first version. Use what the author already said and these defaults, and state them in the note: the stored level, or the level the author's request implies, or `graduate`; a suggested syllabus position that follows from the case's theory, written as a suggestion; an 80-minute class; and the lenses the evidence and the disciplines support. After the note is written, offer to adjust these choices, as [`references/pipeline-flow.md`](references/pipeline-flow.md#defaults-first-customize-after) says: level, syllabus position, class length, and theoretical lenses. When the author picks one, ask that one, revise the note, and write a level or discipline answer into `internal/intake.yaml` and `config`; disciplines go into the `discipline` list, with multiple selections allowed. Keep the syllabus position, class length, and lenses in the note.
3. **Theory scan**: combine the references in `research/extraction-log.md` or the manual brief with the author's uploads. Select a focused set of theoretical lenses applicable to the decision point. Mark which the case supports directly and which require extrapolation.
4. **Learning objectives**: choose a manageable number of measurable objectives (often 3–5), each mapped to case evidence and a rubric criterion. Adapt the count to the author’s purpose and available time.
5. **Class plan**:
   - **Block 1** (15 min in the 80-minute example): cold open + context. Socratic questions that surface student assumptions.
   - **Block 2** (20 min): dilemma + data. Questions that test comprehension and force trade-off articulation.
   - **Block 3** (20 min): decision moment. Questions that elicit a position and force defense.
   - **Block 4** (20 min): wrap-up + transfer. Questions that connect the case to prior cases or to the student's own experience.
   - Reserve 5 minutes as a buffer in the 80-minute example (75 minutes of activities + 5 buffer). Scale the blocks to the author’s time budget while preserving a short synthesis/transfer segment. Generalization, group work, breaks, or a guest speaker are options, not requirements; see the timed templates.
6. **Board plan**: a visualizable sequence (a Mermaid `flowchart` or a structured outline) that a colleague can recreate on a whiteboard without notes.
7. **Pre/in/post assignments**: pre-class reading or short writing, in-class group prompts, post-class reflection or follow-up.
8. **Assessment**: rubric (formative or summative) — pull criteria from `case-classroom-test` if it has run; otherwise default to a 5-criterion rubric (issue identification, framework application, evidence use, position defense, transfer).
9. **State update**: check applicable `blockers` and read `work_target` before choosing files. Write to its `teaching_note` path for a variant; when that field is `null`, use `variants/<variant-id>/teaching-note.md` and store that path in `work_target`. Use `case-<slug>/teaching-note.md` for the master. Archive a previous root note with its reading copies before replacement. Preserve the active target; set `stage: "case-teaching-note"`, `next_skill: "case-classroom-test"`, and append history in `internal/state.json`.
10. **Reader formats**: Write every heading, caption, cross reference, and label the reader sees in the document language, with the terms in [`references/taxonomy.md`](references/taxonomy.md) ("Anexo", not "Exhibit", in Portuguese). open `teaching-note.md` with the cover front matter in [`references/reader-formats.md`](references/reader-formats.md#cover-page): the case's title and date, the teaching-note label, the instructor-only notice, and the case's cover image when there is one. Keep that Markdown canonical. Render the sibling HTML and PDF, record all three paths, list every generated path for the author, and offer to open only `teaching-note.md`, PDF first. Follow [`references/reader-formats.md`](references/reader-formats.md).
11. **Disclosure**: append this run's inputs, outputs, AI contribution, human contribution, checks, and pending checks to `internal/disclosure.md`.

## Artifact paths and state

The root-level paths below are defaults. Read `work_target` from state before
choosing files; when it names a variant, use those paths and preserve the
masters. A caller's new explicit target updates `work_target`. On a partial or blocked run, retain the last
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

- `case.md` and its evidence pack in `research/` or `research/manual-evidence-brief.md`.
- Author interview answers.
- Optional: rubric criteria from `case-classroom-test` if already produced.

## Outputs

- `case-<slug>/teaching-note.md` — the canonical teaching note.
- `case-<slug>/teaching-note.html` and `case-<slug>/teaching-note.pdf` — reading copies of that Markdown.
- Updated `internal/state.json` with a history entry.

## Limits

- Does not produce the case narrative (that's `case-business-case`).
- Does not run the case in class (that's `case-classroom-test`).
- Does not submit to a journal (that's `case-peer-review`).
- Does not produce the participant guide or slide deck (those are downstream of the presentation pipeline).
- Does not invent theory citations — every reference must come from the evidence pack, manual brief, or the author's uploads.
- When the note quotes a source, the highlighted quotation is in the language of the note. The verbatim original may follow as `*Original:*`. Follow [`references/reader-formats.md`](references/reader-formats.md). Do not lead with the source language and gloss it afterwards.
- Does not edit HTML or PDF as sources. Regenerate them from the Markdown.

## References

- [`references/taxonomy.md`](references/taxonomy.md) — the terms the reader sees, per language: headings, captions, cross references, and cover labels ("Exhibit" is "Anexo" in Portuguese). Use it for every reader-facing document.
- [`references/pipeline-flow.md`](references/pipeline-flow.md) — continue into the next skill, when to stop, and the question that ends every turn.
- [`references/class-plan-template.md`](references/class-plan-template.md) — 60/80/90/180-minute variants with question ladders.
- [`references/socratic-questions.md`](references/socratic-questions.md) — what makes a good question for each block.
- [`references/case-folder-convention.md`](references/case-folder-convention.md) — folder + state schema with English/Portuguese taxonomy.
- [`references/reader-formats.md`](references/reader-formats.md) — canonical Markdown, HTML and PDF copies, the paths to list, and the one main deliverable to offer to open.

## Common Pitfalls

1. Quoting the case body verbatim in the teaching note — the note should paraphrase and analyze, not repeat.
2. Requiring undeclared preparation — questions must be answerable using case evidence and the declared prerequisites or assigned readings. Make any required theory available through those readings or prior coursework, without inserting it into the case body.
3. Time overruns — the plan must fit the time available, with a 5-minute buffer for overruns.
4. Theory overload — select only the lenses needed for the objectives; fewer may be sufficient.
5. Missing instructor analysis — keep prompts open, but include worked calculations, plausible responses, trade-offs, and guidance in the instructor-facing note so another teacher can use it.
