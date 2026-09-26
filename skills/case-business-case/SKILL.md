---
name: case-business-case
description: when configuring the narrative of a teaching case from a research evidence pack — adaptable structure, sourced context and narrative tension, optional dialogue shown in the case language, and no theory in the body. Keeps the case in canonical Markdown and also writes HTML and PDF. Handoff to case-teaching-note. Not for the teaching note or the research itself.
---

# case-business-case

## Overview

Writes the teaching case narrative from the evidence pack produced by
`case-research`. The output is the case body students will read: a
hybrid form combining sourced sectoral context with narrative tension.
Use the decision and evidence criteria in [`references/hybrid-form.md`](references/hybrid-form.md).
Dialogue is optional. The reader sees it in the language of the case,
translated from a verbatim sourced sentence. The original may appear on
the next line, in a quieter style. Follow
[`references/reader-formats.md`](references/reader-formats.md).
Theory stays out of the body — it lives in the teaching note.
A missing voice is `[MISSING]` and a gap listed after the case, not a
reconstructed quote from a published teaching case, a later interview, or
a character sketch.

## When to Use This Skill

**TRIGGER when:**
- The evidence pack is ready. Material `[VERIFY]` claims are either confirmed by the author or left out of the case and listed as open; or the author supplies `research/manual-evidence-brief.md` with the decision, source paths, and remaining gaps.
- The author wants to (re)write the case narrative.
- The author has a decision point and enough evidence to describe the relevant actors. A decision-relevant voice with no primary words stays `[MISSING]`.

**SKIP when:**
- Neither a ready evidence pack nor a traceable manual evidence brief exists (run `case-research` first).
- The author wants to refine an existing draft, not rewrite (manual edits).
- The case is purely theoretical and has no characters or scenes.

## Workflow

Before reading or drafting artifacts, read `internal/state.json`, check
applicable `blockers`, and stop with a blocked history entry when one prevents
this output. Resolve `work_target` before selecting the case file.

1. **Read the evidence**: use the six-file pack in `research/`, or the author's `research/manual-evidence-brief.md`. Confirm material `[VERIFY]` tags are resolved before using them. If the brief lacks sources needed for the decision, leave that work with research.
2. **Decide the structural shape**: adapt order and proportions to the author’s brief and evidence. The A/B/C structure is an optional scaffold. Establish the decision and stakes early, compare the live options, and leave the outcome open.
3. **Build the cast**: follow [`references/character-construction.md`](references/character-construction.md). Include the actors the decision needs. Three to five is a possible starting point, not a minimum or maximum. When a source names the operating head of a business the decision uses, cast that person with one sourced line on how that business makes money. People who never speak about the decision stay in the pack and out of the narrative. For a confidential draft, use the author’s existing pseudonyms; `case-disguise` prepares a consistent anonymized copy, including before a first pilot.
4. **Open on sourced tension**: use a contemporary outside objection and sourced replies when available and useful. Otherwise use another evidenced event, conflict, or decision deadline. Never invent a reply or scene detail. Follow [`references/hybrid-form.md`](references/hybrid-form.md).
5. **Draft the hybrid form**:
   - **Opening**: establish the decision and stakes from evidence. Add sector, regulation, and market context where it helps students analyze the choice.
   - **Businesses**: when the decision compares businesses, walk each relevant one through what it sells, who buys, how it reaches them, performance, and industry context, as the evidence permits.
   - **Ending**: restate the live options with sourced arguments for each. A sourced conviction may remain while alternatives stay analyzable and the outcome is not told.
6. **Quality gates** (all of them; details in the two references above):
   - Case body cites no theory, framework, or author — those belong in the teaching note.
   - All numerical claims trace to the evidence pack or manual brief, with a source ID and page or section. When a material fact changed before the decision, use the later sourced value and show its date and source.
   - Every direct quotation the reader sees is in the language of the case. It translates a verbatim sentence in the evidence pack or manual brief, and it adds no fact that sentence does not state. When the source language differs, the verbatim sentence may follow as `*Original:*`. Do not lead with the foreign-language sentence and gloss it afterwards. Indirect speech is allowed only when the source itself states the position. A decision-relevant voice with no primary words is `[MISSING]`, not a drafted sentence.
   - The opening has a sourced tension, protagonist, stakes, and live options. If using an outside objection, responses come from sources; their absence calls for a different opening or more research, not invented replies.
   - A multi-business comparison gives each relevant business the context students need; the five beats are a guide, not a quota.
   - The ending preserves the decision with sourced arguments for the live options and does not tell the historical outcome.
   - For a quantitative economic choice, at least one exhibit lets students calculate the consequences with printed inputs. If the necessary inputs are missing, send the case back to research. For a qualitative choice, use decision-relevant evidence without invented numbers.
   - When the evidence describes families, clusters, or a system and that structure affects the choice, the case uses it. A headcount is not a strategy.
   - A named operating head appears when that person and business matter to the decision and sources support the line on how it makes money. People who never speak about the decision stay out of the narrative.
7. **Update `internal/state.json`**: check applicable `blockers` before drafting. When the quality gates pass, write the case to `case-<slug>/case.md`, or to `work_target.case` for a variant. Figures live beside that case in `assets/`. Archive a previous root case and its reading copies before replacement. Set `stage: "case-business-case"`, `next_skill: "case-teaching-note"`, and append history. When a gate fails, keep the last successful stage and record the gap.
8. **Reader formats**: Write every heading, caption, cross reference, and label the reader sees in the document language, with the terms in [`references/taxonomy.md`](references/taxonomy.md) ("Anexo", not "Exhibit", in Portuguese). open `case.md` with the cover front matter in [`references/reader-formats.md`](references/reader-formats.md#cover-page): title, decision question, decision date, and `authors`, `institution`, disciplines, and level from intake. Draw `assets/cover-motif.svg` only when you can view the rendered page; otherwise leave `image` out for a typographic cover. When a replaced case moves `assets/` to `archive/`, carry the motif or the author's cover image forward. Keep that Markdown canonical. Render the sibling HTML and PDF, record all three paths, list every generated path for the author, and offer to open only `case.md`, PDF first. Follow [`references/reader-formats.md`](references/reader-formats.md).
9. **Disclosure**: append this run's inputs, outputs, AI contribution, human contribution, checks, and pending checks to `internal/disclosure.md`.

## Artifact paths and state

The case root paths below are defaults. Read `work_target` from state before
choosing files; when it names a variant, use those paths and preserve the
masters. A caller's new explicit target updates `work_target`. On a partial
or blocked run, retain the last successful `stage` and record limitations
and the next action. If evidence needed for the opening or an applicable
exhibit is missing, keep the previous stage and route to `case-research`.
List a gap an interview may close among the gaps presented after the
case. A `[MISSING]` mark, with that person left out of the narrative,
satisfies the voice gate. On completion,
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

When the case is written and gaps remain — `[MISSING]` voices, open
`[VERIFY]` claims, sources not retrieved — present the case with its gaps
and ask with the options in
[`references/pipeline-flow.md`](references/pipeline-flow.md#gaps-in-the-evidence):
continue to the teaching note, research the gaps, add information, or
revise the case. With no gap, continue to the teaching note.

## Inputs

- `case-<slug>/research/` evidence pack (six files), or author-supplied `research/manual-evidence-brief.md`.
- Author's confirmation of `[VERIFY]` tags when it exists. An unconfirmed claim stays out of the case and is listed at the end of the run.
- Author’s structural preferences, if supplied. Otherwise follow the sourced-decision and applicable evidence criteria.

## Outputs

- `case-<slug>/case.md` — the canonical case narrative.
- `case-<slug>/case.html` and `case-<slug>/case.pdf` — reading copies of that Markdown.
- Updated `internal/state.json` with a history entry.

## Limits

- Does not write the teaching note (theory, lesson plan, socratic questions). That's `case-teaching-note`.
- Does not produce the slide deck or the participant guide. Those are downstream of the presentation pipeline.
- Does not invent facts. Every claim must trace back to the evidence pack or the author's manual brief and its underlying sources.
- Does not run pre-flight classroom checks. That's `case-classroom-test`.
- Does not perform a full anonymization pass. Route that work to `case-disguise` for a separate copy; preserve the research sources.
- Does not edit other skills' outputs or shared global files.
- Does not edit HTML or PDF as sources. Regenerate them from the Markdown.

## References

- [`references/taxonomy.md`](references/taxonomy.md) — the terms the reader sees, per language: headings, captions, cross references, and cover labels ("Exhibit" is "Anexo" in Portuguese). Use it for every reader-facing document.
- [`references/pipeline-flow.md`](references/pipeline-flow.md) — continue into the next skill, when to stop, and the question that ends every turn.
- [`references/hybrid-form.md`](references/hybrid-form.md) — adaptable opening and sourced narrative, with examples.
- [`references/character-construction.md`](references/character-construction.md) — what makes a character anchored, what makes them vague.
- [`references/case-folder-convention.md`](references/case-folder-convention.md) — folder + state schema with English/Portuguese taxonomy.
- [`references/reader-formats.md`](references/reader-formats.md) — canonical Markdown, HTML and PDF copies, the paths to list, and the one main deliverable to offer to open.

## Common Pitfalls

1. Putting theory in the case body ("Smith's framework suggests...") — that belongs in the teaching note. Cases are stories, not literature reviews.
2. Drafting a sentence for a decision-relevant voice with no primary words — mark `[MISSING]` and list the gap after the case. Indirect speech is allowed only when the source itself states the position.
3. Telling the outcome. A sourced conviction may remain when the other fork stays alive and the outcome is not told.
4. Inventing an outside objection or replies to fit a template — use a different sourced opening.
5. Treating a segment income statement as the exhibit that computes each economic option — send a quantitative case back to research when inputs are missing.
6. Leading with the source language and placing the translation underneath. The highlighted quotation is already in the language of the case. The verbatim original is the optional line below it.
