---
name: case-disguise
description: Create consistent case and teaching-note variants for reuse, contextual adaptation, or anonymization before a pilot or publication. Preserve source files, track changes, and check dependent calculations. Keeps each variant document in canonical Markdown and also writes HTML and PDF. Not for original authorship.
---

# case-disguise

## Purpose and modes

Create a separate variant of an existing draft or completed case:

- **Substantive twist**: adapt geography, date, or protagonist characteristics while preserving the intended teaching objectives and decision type.
- **Surface disguise**: rotate names, title, prices, or costs for cohort reuse.
- **Combined**: apply a substantive twist, then surface changes, with both layers recorded.
- **Anonymization**: prepare a copy for a specified classroom or publication audience, replacing or generalizing identifying details consistently. This can happen before the first pilot and is distinct from changing a case to prevent answer reuse.

Use this skill when an author requests one of these transformations. A pilot
is useful evidence about teaching effectiveness, not a prerequisite. Do not
use it for original authorship or an ordinary edit with no variant requested.

## Workflow

Before transforming anything, read `internal/state.json` and check applicable
`blockers`. If one prevents this output, record a blocked history entry and
stop. Resolve the current `work_target` to identify the requested source.

1. **Read the source and scope**: inspect the case, teaching note if available, linked exhibits, and relevant evidence. Use the author's requested mode and audience. When the mode is missing, or the request fits more than one mode, ask which one and stop the turn. Use the harness question tool when it exists. The options are substantive twist, surface disguise, combined, and anonymization — only those the request leaves open. For reuse or substantive adaptation, require the teaching note or an explicit statement of teaching objectives. For anonymization, an existing draft is sufficient; record a missing teaching note as a limitation.
2. **Choose a distinct destination**: use `variants/<variant-id>/` under the source case, or a destination explicitly supplied by the author. Keep the master case, master note, and research sources unchanged. If a variant already exists, update it only when the author is continuing that variant; otherwise select a new descriptive ID. See [storage and state rules](references/case-folder-convention.md).
3. **Map dependencies**: list changes to the narrative, identifiers, quotations, exhibits, calculations, teaching-note analysis, assignment questions, rubric references, and board plan. Preserve the teaching objective unless the author requests its revision. Label transformed data and adapted narrative as such; do not present them as unchanged historical evidence.
4. **Transform the copy**:
   - Substantive: research the requested locale or period, cite the inputs, and recompute dependent data. See [substantive patterns](references/substantive-twist-patterns.md).
   - Surface: apply reproducible rotation rules and record the original values, transformation, and derived values. See [rotation rules](references/rotation-rules.md).
   - Combined: record each layer in order.
   - Anonymization: apply the author's requirements and, for publication, obtain the current target venue's instructions from the author or an official source. Check names, organizations, locations, distinctive dates and events, document metadata, filenames, links, exhibit labels, and identifying quotations. A pseudonym alone may leave a subject identifiable. Preserve analytical relationships and distinguish disguised details from documented facts. Keep the identity mapping and source crosswalk in the author-only audit trail, outside any student or submission copy. Record unresolved identifying details for author review; do not claim guaranteed anonymity. Anonymization does not grant permission or change `permission_status`.
5. **Synchronize the teaching note**: when a note exists, create its variant alongside the case and update every dependent number, worked solution, identifier, question, and board-plan reference. Preserve theoretical lenses and objectives when still applicable. If a transformation changes the supported analysis or recommendation, document it explicitly. If a note is missing or cannot be reconciled, deliver the available draft with that limitation and route note work to `case-teaching-note`; do not call the pair ready for use.
6. **Verify the pair**: recompute changed calculations from the recorded inputs; check units, totals, links, and case-to-note references. Check that students can still analyze the intended decision and that the note supports that analysis. Reader-facing quotations keep the shape in [`references/reader-formats.md`](references/reader-formats.md): the highlighted sentence is the variant's language, and `*Original:*` is the optional verbatim line. When the words change, change both lines together. For anonymization, inspect every audience-facing artifact for identifying remnants and exclude the private audit trail from distribution. Omit `*Original:*` from a student or submission copy when the source sentence would identify the subject, and keep that sentence in `audit.md`.
7. **Record and route**: check applicable state `blockers`, write `variants/<variant-id>/audit.md`, and set `work_target` in `internal/state.json` to the variant ID and exact case, note, classroom-report, and review-report paths. Use `null` for a note not yet written. The next skill reads these paths before choosing files; it must not fall back to the master. Move root documents into `archive/<yyyy-mm-dd-hhmm>/` and copy the variant to the root only when the author asks to adopt it; then set `work_target: null`. Leave `audit.md` in the variant folder.
8. **Reader formats**: Write every heading, caption, cross reference, and label the reader sees in the document language, with the terms in [`references/taxonomy.md`](references/taxonomy.md) ("Anexo", not "Exhibit", in Portuguese). open the variant's `case.md` and `teaching-note.md` with the cover front matter in [`references/reader-formats.md`](references/reader-formats.md#cover-page), using the variant's title and names, never the real ones in an anonymized variant, and a motif inside the variant's `assets/`. `audit.md` has no cover. Keep every Markdown document written in this run canonical, including the variant case, the variant note, and `audit.md`. Render a sibling HTML and PDF for each, record those paths, and list every generated path for the author. Offer to open only the variant's `case.md`, PDF first, or the variant's `teaching-note.md` when the run changed the note alone. Never offer `audit.md`; its HTML and PDF stay author-only. Follow [`references/reader-formats.md`](references/reader-formats.md).
9. **Disclosure**: append this run's inputs, outputs, AI contribution, human contribution, checks, and pending checks to `internal/disclosure.md`.

## Audit trail

Store an author-only `audit.md` in each variant folder containing:

- Mode, purpose, intended audience, source artifact paths and revisions or hashes.
- Transformation inputs, sourced assumptions, and rotation rules.
- A change table: source section/value, new section/value, reason or rule, and affected case/note/exhibit paths.
- Preserved objectives and decision type; any changed analytical result.
- Calculation and cross-reference checks, with evidence and unresolved issues.
- For anonymization, the private identity crosswalk and checks performed against the intended audience or venue requirements.
- Readiness of the case and teaching note separately, limitations, and the next action with variant paths.

Keep the audit trail author-only even when the variant is for students or
submission. `internal/state.json` records the variant paths. A new run appends
history and does not replace an earlier variant folder.

## Continuing the pipeline

When this skill completes, follow [`references/pipeline-flow.md`](references/pipeline-flow.md):
tell the author in one line what comes next, and run `next_skill` in the
same turn. Stop only for a reason listed there. End every turn with the
harness question tool and options the author can pick, such as "Seguir com
a pesquisa".

## Inputs and outputs

Inputs: an existing case or draft, its note when available, the requested
transformation, and relevant source evidence or author instructions.

Outputs under `variants/<variant-id>/`:

- `case.md` — the transformed case copy.
- `teaching-note.md` — the consistent note copy when a source note exists.
- Referenced assets copied or transformed as needed, with working relative links.
- `audit.md` — the author-only audit trail.

Each of those Markdown files also gets sibling `.html` and `.pdf` reading
copies. The audit trail's copies stay author-only, with the private Markdown.

Also update `internal/state.json`. Preserve research sources and
master artifacts. Do not submit or distribute the variant, assert permissions,
or fabricate sources for transformed data. Other skills can revise the
variant pair when routed with its explicit paths. Do not edit HTML or PDF
as sources; regenerate them from the Markdown.

## References

- [`references/taxonomy.md`](references/taxonomy.md) — the terms the reader sees, per language: headings, captions, cross references, and cover labels ("Exhibit" is "Anexo" in Portuguese). Use it for every reader-facing document.
- [`references/pipeline-flow.md`](references/pipeline-flow.md) — continue into the next skill, when to stop, and the question that ends every turn.
- [`references/reader-formats.md`](references/reader-formats.md) — canonical Markdown, HTML and PDF copies, the cover page, the paths to list, and the one main deliverable to offer to open.
