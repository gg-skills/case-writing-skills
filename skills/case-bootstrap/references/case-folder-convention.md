# Case folder convention

This document mirrors the project-wide `governanca/convencao-pastas-de-caso.md`
spec so that a skill can operate on a case folder without depending on
that file. The convention is language-agnostic: all identifiers, file
names, and field names are English. The taxonomy section at the end
provides a Portuguese mapping for author-facing communication.

## Layout

```
case-<slug>/
├── case.md                      # current teaching case; also .html and .pdf
├── teaching-note.md             # current teaching note; also .html and .pdf
├── assets/                      # figures in the current case, and cover-motif.svg
├── research/
│   ├── manual-evidence-brief.md   # optional minimal alternative to the full pack
│   ├── timeline.md              # evidence pack; each file also .html and .pdf
│   ├── cast.md
│   ├── financials.md
│   ├── quotes-by-theme.md
│   ├── exhibit-candidates.md
│   ├── extraction-log.md
│   └── sources/
│       ├── public/<source-id>/
│       └── private/<interview-id>/
├── classroom/
│   └── report.md                # also .html and .pdf
├── review/
│   └── report.md                # also .html and .pdf
├── variants/
│   └── <variant-id>/
│       ├── case.md
│       ├── teaching-note.md
│       ├── assets/
│       ├── classroom/report.md  # if this variant is tested
│       ├── review/report.md     # if this variant is reviewed
│       └── audit.md             # author-only
├── archive/
│   └── <yyyy-mm-dd-hhmm>/       # previous case and teaching-note copies
├── internal/
│   ├── state.json
│   ├── intake.yaml
│   └── disclosure.md
└── package/                     # journal bundle, only when that step exists
```

Bootstrap creates `internal/` and `research/sources/` only. It does not
create placeholder documents. `classroom/`, `review/`, `variants/`,
`archive/`, `assets/`, and `package/` appear when first used. `case.md` and
`teaching-note.md` appear when those documents are written. Replacing either
document moves the previous Markdown, HTML, PDF, and, for the case, `assets/`
into `archive/<yyyy-mm-dd-hhmm>/`.

## Slug rules

- ASCII lowercase, kebab-case.
- Derived from the company name or protagonist (e.g., `magazine-luiza`, `uber-2024`).
- Never reuse a slug; each case is its own folder.

## State at bootstrap time

After this skill runs, `internal/state.json` looks like:

```json
{
  "schema_version": 2,
  "case_slug": "<slug>",
  "stage": "bootstrap",
  "current_skill": null,
  "next_skill": "case-research",
  "work_target": null,
  "history": [
    {
      "skill": "case-bootstrap",
      "started_at": "<ISO-8601>",
      "completed_at": "<ISO-8601>",
      "status": "completed",
      "artifacts": ["internal/intake.yaml"],
      "checks": [],
      "limitations": [],
      "next_action": "Run case-research"
    }
  ],
  "blockers": [],
  "config": {
    "subject": "<company, protagonist, or decision>",
    "discipline": "<list|null>",
    "authors": "<list|null>",
    "institution": "<string|null>",
    "audience_level": "undergraduate|graduate|executive|null",
    "audience_location": "<string|null>",
    "target_journal": "<string|null>",
    "permission_status": "pending|granted|not-applicable",
    "teaching_tension": "<string|null>",
    "contrast_set": "<list|null>"
  },
  "updated_at": "<ISO-8601>"
}
```

`discipline` is a list of English kebab-case slugs, such as
`["strategy", "marketing"]`; a case may serve more than one discipline.
`authors` is a list of names in the author's spelling, and `institution`
is one string; both feed the cover page of the main documents.
The `audience_level` and `permission_status` values are English keyword
strings; see the taxonomy below for the Portuguese equivalents. `null` on
`discipline`, `authors`, `institution`, `audience_level`,
`audience_location`, `target_journal`, `teaching_tension`, or
`contrast_set` means that fact has not been
collected. Bootstrap asks one blocking fact per turn and leaves audience,
location, and journal `null` until a later skill needs them. It does not
ask `teaching_tension` or `contrast_set`. Store each when the author's
message already names the doubt or a set of products, people, or markets
to compare, and pass any stored value to research. See `intake-questions.md`.

## Taxonomy (English ↔ Portuguese)

The skill's identifiers are English. When communicating with a
Portuguese-speaking author, use the Portuguese mapping below. The
**values stored in `internal/state.json` and `internal/intake.yaml` are always the
English form** so that downstream skills can rely on a stable schema.

### File names

| English (canonical) | Portuguese |
|---|---|
| `case.md` | caso |
| `teaching-note.md` | nota de ensino |
| `assets/` | ativos |
| `research/` | pesquisa |
| `classroom/report.md` | relatório de sala |
| `review/report.md` | relatório de revisão |
| `variants/<variant-id>/audit.md` | trilha privada da variante |
| `archive/` | arquivo das versões anteriores |
| `internal/intake.yaml` | questionário inicial |
| `internal/disclosure.md` | registro de assistência de IA |
| `internal/state.json` | estado do caso |

### Config fields

| English field | Portuguese (when prompting) |
|---|---|
| `discipline` | disciplinas-alvo |
| `authors` | autores do caso |
| `institution` | instituição |
| `audience_level` | nível da audiência |
| `audience_location` | localização da audiência |
| `target_journal` | journal-alvo |
| `sources_status.interviews_available` | entrevistas disponíveis |
| `sources_status.transcripts_available` | transcrições disponíveis |
| `sources_status.public_sources_identified` | fontes públicas identificadas |
| `permission_status` | status de permission |
| `teaching_tension` | tensão de ensino |
| `contrast_set` | conjunto de contraste |

### Enum values

| English value | Portuguese |
|---|---|
| `audience_level: undergraduate` | graduação |
| `audience_level: graduate` | pós-graduação |
| `audience_level: executive` | executivo |
| `permission_status: pending` | pendente |
| `permission_status: granted` | obtida |
| `permission_status: not-applicable` | não aplicável |
| `status: completed` | concluído |
| `status: partial` | parcial |
| `status: blocked` | bloqueado |
| `status: in-progress` | em andamento |
| `checks.result: passed` | passou |
| `checks.result: failed` | falhou |
| `checks.result: not-run` | não executado |

### Stage names

| English stage | Portuguese |
|---|---|
| `bootstrap` | (inicialização) |
| `case-research` | pesquisa |
| `case-business-case` | escrita do caso |
| `case-teaching-note` | escrita da nota |
| `case-classroom-test` | teste em sala |
| `case-peer-review` | revisão cega |
| `case-disguise` | variantes |

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
