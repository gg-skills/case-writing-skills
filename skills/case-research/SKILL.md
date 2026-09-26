---
name: case-research
description: when configuring research for a business case — combines public sources and private transcripts into a structured evidence pack (timeline, cast, financials, quotes-by-theme, exhibit candidates, extraction log). Keeps each evidence file in canonical Markdown and also writes HTML and PDF. Handoff to case-business-case. Not for the case narrative itself.
---

# case-research

## Overview

Specialized research for business case writing. Combines public sources
(annual reports, SEC filings, press, regulatory, news) with private
interview transcripts to produce a structured evidence pack that
`case-business-case` consumes directly. Begin with the author’s decision point when one exists. When it is still
unclear, use a bounded exploratory pass to identify candidate decisions
before committing to a full evidence pack. The pack stays partial until the
applicable readiness gates in
[`references/research-gates.md`](references/research-gates.md) pass.

## When to Use This Skill

**TRIGGER when:**
- The case needs evidence for a decision point, or the author needs exploratory research to identify one.
- The author has interviews (transcribed or not) and/or wants to gather public sources.
- A previously produced evidence pack needs to be refreshed.
- The author has trusted documents and wants only a traceable, minimal evidence brief for narrative drafting.

**SKIP when:**
- The case is purely illustrative and has no real primary data.
- The task is post-publication review (use `case-peer-review`).

## Workflow

At the start, read `internal/state.json` and check applicable `blockers`.
If one prevents this output, record a blocked history entry and stop before
ingesting sources, including in minimal existing-source mode.

1. **Decision point and scope**: use an existing decision statement or ask what the author wants to investigate. If the decision is unclear, inspect the supplied materials and a small, relevant set of sources, propose candidate decisions with evidence and gaps, and stop that exploratory pass for the author’s selection. Record candidates in `research/extraction-log.md`; do not treat a tentative decision as confirmed. Ask one thing only. When the harness has a structured question tool, offer the candidates you actually found as the options of that single question. A missing discipline, audience, or journal does not block this pass.
   - **Minimal existing-source mode**: when the author does not want a six-file pack, check permission before using private material, preserve their documents, and write `research/manual-evidence-brief.md` with the confirmed decision, exact source paths and pages or sections, arguments for the live options, and gaps. Apply the relevant readiness criteria to this brief. Then follow the state, reader-format, and disclosure steps 7–9, skipping full-pack steps 2–6. A ready brief sets `stage: "case-research"` and `next_skill: "case-business-case"`; an incomplete brief remains partial.
2. **Source plan**: search contemporary press when public reaction matters and check changes between the last source and the decision when material facts may have moved. Then produce a short list of relevant public source classes and transcripts. Follow an already authorized scope; otherwise present the plan for the author to refine while proceeding with relevant, reversible research.
3. **Ingestion**: place public sources in `case-<slug>/research/sources/public/<source-id>/` and transcripts in `case-<slug>/research/sources/private/<interview-id>/`. Check `permission_status` before using private material; pending permission leaves it unused. Maintain provenance: every claim links to a source file + page or section.
4. **Evidence pack** (six files in `case-<slug>/research/`):
   - `timeline.md` — chronological reconstruction, with a Mermaid `timeline` and a Markdown table.
   - `cast.md` — dramatis personae (roles, motivations, relationships), with a Mermaid `graph`.
   - `financials.md` — extracted tables and figures, normalized, sourced.
   - `quotes-by-theme.md` — verbatim quotes tagged by theme + speaker + source + page.
   - `exhibit-candidates.md` — proposed figures and tables with source data + draft.
   - `extraction-log.md` — what was extracted, from where, gaps, OCR issues, illegible pages.
5. **Verification tagging**: mark a material, uncorroborated claim from a secondary source `[VERIFY]` in the relevant file, following [`references/provenance-and-verify.md`](references/provenance-and-verify.md). The author must confirm it before `case-business-case` uses it. A same-day newspaper is primary for what it printed. A quote taken from a published teaching case is not.
6. **Readiness gates**: read `teaching_tension` and `contrast_set` from `internal/intake.yaml` and `config`. Apply only the relevant gates in [`references/research-gates.md`](references/research-gates.md) before a completed handoff. Record the opening tension and the arguments the narrative can actually source.
7. **State update**: read `internal/state.json` and its applicable `blockers` at start. Append a history entry with the artifacts and any `[VERIFY]` count. When the pack passes the applicable gates, set `stage: "case-research"` and `next_skill: "case-business-case"`. When the decision is still exploratory, a blocker applies, or a needed gate is open, record `status: "partial"` or `"blocked"`, retain the last completed `stage`, and name the remaining action. Do not route a blocked pack to narrative writing.
8. **Reader formats**: keep each evidence-pack Markdown file canonical. Render a sibling HTML and PDF for every file written in this run, record those paths, and list them for the author. Do not offer to open them: the evidence pack is working material, and the file to offer is the case that `case-business-case` writes. When the same turn continues into the case, offer only `case.md`. Follow [`references/reader-formats.md`](references/reader-formats.md).
9. **Disclosure**: append this run's inputs, outputs, AI contribution, human contribution, checks, and pending checks to `internal/disclosure.md` as required by the case-folder convention.

## Continuing the pipeline

When this skill completes, follow [`references/pipeline-flow.md`](references/pipeline-flow.md):
tell the author in one line what comes next, and run `next_skill` in the
same turn. Stop only for a reason listed there. End every turn with the
harness question tool and options the author can pick, such as "Seguir com
a pesquisa".

## Inputs

- Author’s decision-point statement, or a topic and scope for exploration.
- Public source list (URLs or PDFs in `research/sources/public/`).
- Interview transcripts or recordings (in `research/sources/private/`).
- The current `internal/state.json` and `internal/intake.yaml`, including `teaching_tension` and `contrast_set` when either is set. A null value stays null.

## Outputs

- The six canonical Markdown files of the full evidence pack, or `research/manual-evidence-brief.md` in minimal existing-source mode.
- Sibling `.html` and `.pdf` reading copies for each Markdown file written.
- Updated `internal/state.json` with one history entry.

## Limits

- Does not write the case narrative or teaching-note analysis. Exploratory comparison of candidate decisions is within scope.
- Does not translate quotations for the reader. The pack keeps the source language verbatim. `case-business-case` and `case-teaching-note` show the document-language citation.
- Does not make up numbers when sources are silent — marks `[MISSING]` instead.
- A missing voice is `[MISSING]` and a recorded gap, presented to the author after the case, not a reconstructed quote from a published teaching case, a later interview, or a character sketch.
- Preserves raw sources. Route anonymization of a draft to `case-disguise`, including before a first pilot; do not replace originals with disguised evidence.
- Does not edit other skills' outputs or shared global files.
- Does not edit HTML or PDF as sources. Regenerate them from the Markdown.

## References

- [`references/taxonomy.md`](references/taxonomy.md) — the terms the reader sees, per language: headings, captions, cross references, and cover labels ("Exhibit" is "Anexo" in Portuguese). Use it for every reader-facing document.
- [`references/pipeline-flow.md`](references/pipeline-flow.md) — continue into the next skill, when to stop, and the question that ends every turn.
- [`references/research-gates.md`](references/research-gates.md) — conditional readiness gates and the handoff contract.
- [`references/evidence-pack-schema.md`](references/evidence-pack-schema.md) — file formats and field schemas for each of the six output files.
- [`references/provenance-and-verify.md`](references/provenance-and-verify.md) — provenance tagging rules and the `[VERIFY]` convention.
- [`references/case-folder-convention.md`](references/case-folder-convention.md) — mirrors the project spec, includes the English/Portuguese taxonomy for naming.
- [`references/reader-formats.md`](references/reader-formats.md) — canonical Markdown, HTML and PDF copies, the paths to list, and the one main deliverable to offer to open.

## Common Pitfalls

1. Treating exploratory candidate decisions as settled — confirm the chosen decision before handing a completed evidence pack to narrative drafting.
2. Mixing public and private sources without `[PUBLIC]` / `[PRIVATE]` tags — breaks `case-business-case`'s claim classification.
3. Summarizing rather than quoting verbatim — destroys `case-business-case`'s ability to pick representative quotes for character voices.
4. Marking every claim `[VERIFY]` — clutters the pack; tag only secondary sources.
5. Using `exhibit-candidates.md` as a draft of the case — that file is research material, not narrative.
6. Handing off a decision while an applicable research gate is open — keep the pack partial and route the unresolved evidence to research.
7. Drafting a sentence for a decision-relevant voice with no primary words — mark `[MISSING]` and record the gap.
8. Stopping the run to ask whether an interview or another source exists. Record the gap and continue; the gaps are presented after the case.
