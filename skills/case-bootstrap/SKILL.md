---
name: case-bootstrap
description: when configuring initial setup for a new case — scaffolds the case folder, collects one missing intake fact at a time, initializes internal/state.json, routes to research, review, or variant work. Idempotent. Not for case-specific writing.
---

# case-bootstrap

## Overview

Scaffolds a new case folder, collects intake one missing fact at a time,
initializes `internal/state.json` per the project convention, and routes to
the first downstream skill. Designed to be the first thing a user (or another
agent) invokes when starting a new case study.

## When to Use This Skill

**TRIGGER when:**
- Starting a new business case study from scratch.
- The user says "I want to write a case about X" or "new case".
- Re-opening an existing case whose `internal/state.json` is missing or stale.

**SKIP when:**
- The case folder already has current intake and a populated `internal/state.json` (use the downstream skill in `next_skill` directly).
- The user wants to revise an existing case's metadata without re-scaffolding (do it manually).
- The task is research, drafting, or testing on a case that is already bootstrapped.

## Workflow

At the start, read an existing `internal/state.json` and stop with a blocked
history entry if an applicable `blockers` item prevents this run.

1. **Intake, one fact**: read what the author already said and any existing `internal/intake.yaml`. Store every unambiguous value. Follow [`references/intake-questions.md`](references/intake-questions.md). When a blocking fact is still open, ask that one fact and stop the turn. Use the harness question tool for a real choice, and ordinary text for an open fact such as the company or the protagonist. Ask in the author's language. Do not list the other fields. When nothing blocks, continue in this same turn. Store `teaching_tension` and `contrast_set` when the author already states them, leave each `null` otherwise, and pass any stored value to research; they are not blocking questions ([`references/intake-questions.md`](references/intake-questions.md), [`references/state-schema.md`](references/state-schema.md)).
2. **Slug**: once the subject is known, derive a kebab-case `case-<slug>/` from it. ASCII, no accents.
3. **Scaffold**: create `case-<slug>/internal/` and `case-<slug>/research/sources/public/` plus `research/sources/private/`. Do this only after the blocking questions are answered or explicitly deferred. Do not create placeholder documents. The full layout is in [`references/case-folder-convention.md`](references/case-folder-convention.md).
4. **State**: check applicable `blockers` in an existing state, then write `internal/state.json` per [`references/state-schema.md`](references/state-schema.md), with `stage: "bootstrap"`, `work_target: null` for a new case, and a bootstrap history entry. On rerun, preserve the existing successful stage, `work_target`, and history. Choose `next_skill` from the routing table below and actual remaining work. Leave uncollected audience, location, and journal as `null`.
5. **Routing**:
   - No clear idea yet → `case-research` (it will elicit the decision point)
   - Idea + interviews/transcripts ready → `case-research`
   - Everything written, heading to publication → `case-peer-review` (ask the journal first when it is unset)
   - Existing draft or case needing adaptation or anonymization, including before its first pilot → `case-disguise`
6. **Idempotency**: re-running on the same slug must not duplicate files. Update `internal/state.json` and `internal/intake.yaml` only when needed; leave case artifacts alone.
7. **Report and continue**: after scaffolding, print the case folder path and a one-line summary of the intake, say in one line that the next step starts, and run `next_skill` in this same turn, following [`references/pipeline-flow.md`](references/pipeline-flow.md). Do not report a folder you have not created, and do not end the turn with this report.
8. **Disclosure**: append this run's inputs, outputs, AI contribution, human contribution, checks, and pending checks to `internal/disclosure.md`. Do not render that internal audit file.

## Limits

- Does not collect case content. Does not run `case-research`. Does not analyze primary material.
- Does not edit `AGENTS.md`, `INDICE.md`, `governanca/decisoes-sobre-skills.md`, or any other global file.
- Does not push, merge, or publish. Pushes happen via the project's standard commit/push workflow.
- Does not create placeholder documents and does not render `internal/`. A later skill renders a document when it writes the Markdown. See [`references/reader-formats.md`](references/reader-formats.md).

## Continuing the pipeline

When this skill completes, follow [`references/pipeline-flow.md`](references/pipeline-flow.md):
tell the author in one line what comes next, and run `next_skill` in the
same turn. Stop only for a reason listed there. End every turn with the
harness question tool and options the author can pick, such as "Seguir com
a pesquisa".

## Inputs

- Whatever intake facts the author has already given. Missing facts are collected one at a time, per [`references/intake-questions.md`](references/intake-questions.md).
- The existing `case-<slug>/` if rerunning for idempotency.

## Outputs

- `case-<slug>/internal/state.json` initialized with `schema_version: 2`, `stage: "bootstrap"`, `work_target: null`, and one history entry.
- `case-<slug>/internal/intake.yaml` with the intake config.
- `case-<slug>/internal/disclosure.md` with the run's audit entry.
- `case-<slug>/research/sources/public/` and `research/sources/private/`, ready for `case-research`.

## References

- [`references/taxonomy.md`](references/taxonomy.md) — the terms the reader sees, per language: headings, captions, cross references, and cover labels ("Exhibit" is "Anexo" in Portuguese). Use it for every reader-facing document.
- [`references/pipeline-flow.md`](references/pipeline-flow.md) — continue into the next skill, when to stop, and the question that ends every turn.
- [`references/case-folder-convention.md`](references/case-folder-convention.md) — project-wide folder + state.json spec.
- [`references/intake-questions.md`](references/intake-questions.md) — canonical question wording and validation rules.
- [`references/state-schema.md`](references/state-schema.md) — full `internal/state.json` schema reference.
- [`references/reader-formats.md`](references/reader-formats.md) — canonical Markdown, HTML and PDF copies, the paths to list, and the one main deliverable to offer to open. Downstream skills render; bootstrap does not render scaffold files.

## Common Pitfalls

1. Re-running on a non-empty `case-<slug>/` without checking existing state — overwrite risk.
2. Generating the slug with accents or uppercase letters — breaks downstream scripts and tooling.
3. Setting `next_skill` to `null` after bootstrap — leaves the pipeline stalled.
4. Forgetting to write the `history` entry for bootstrap — breaks the audit trail.
5. Sending the whole intake as one numbered list. Ask the first open blocking fact and stop the turn.
6. Ending the turn after scaffolding with a report and no question. Continue into `next_skill`; when something does stop the run, end with the harness question tool and a "continue" option.
