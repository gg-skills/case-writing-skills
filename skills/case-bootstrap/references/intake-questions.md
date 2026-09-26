# Intake questions

Ask **one** missing fact per turn, then stop. A message that lists the
protagonist, discipline, authors, institution, level, location, journal,
sources, and permission together is the wrong shape for this skill.

The wording table below is a source of single questions. It is not a form
to paste.

Stored values in `internal/intake.yaml` and `internal/state.json` `config`
are always the English canonical form. Ask in the author's language. When
the author is writing in Portuguese, use the Portuguese column for that
one question.

## Before asking

- Read the author's message and, when it exists, `internal/intake.yaml`.
- Store every value that is already unambiguous. Do not ask for it again.
- A later sentence in the same message can fill a field you have not
  reached. Store it and skip that question.
- "I don't know", "use the default", or "go ahead" is an answer. Record
  the field as unset (`null`, or the source default below) and continue.
  Do not ask that question again.
- Do not create `case-<slug>/` while a blocking question is still open.
  When the author's first message already resolves every blocking row,
  scaffold in that turn and ask nothing.

## How to ask

Ask the first open row in [What blocks the next step](#what-blocks-the-next-step).
One question. No numbered list of the rows you are not asking. No "answer
what you can."

When the running harness has a structured question tool (`ask_user_question`,
`AskUserQuestion`, or the local equivalent), use it for a choice among a
few real options. Pass **one** question. Put the most likely option first.
Give each option a short label and a one-line description of the value you
will store. List only options the author's words support, or the allowed
values of that field. Leave the tool's free-text answer available. When
more than one listed option can be true, allow multiple selections. If the
harness has no such tool, ask that same single choice in one short message.
When the author's words leave only one real option, store it and say so
in one line; do not ask a one-option question.

Ask an open fact — a company, a person, a place, a decision — in ordinary
text. Do not invent a menu of companies or people.

On the next turn, store the answer, then either ask the new first open
row or scaffold and route. Write answers into both `internal/intake.yaml`
and `config`. A downstream skill that later collects a deferred field does
the same write: the author's answer is the approval to store it.

## What blocks the next step

| Order | Ask only when | Field | If the author defers |
|---|---|---|---|
| 1 | No company, protagonist, or researchable theme | `subject` | Stop. Research has nothing to open. |
| 2 | The subject names more than one plausible company, period, decision, or case | which one | Stop until the author chooses. Options come only from their words. |
| 3 | `discipline` is unset and the request does not already name a field | `discipline` | Store `null` and continue. |
| 4 | The author has not said who will author the case | `authors` | Store `null` and continue. The cover omits authors. |
| 5 | The author has not said which institution the case belongs to | `institution` | Store `null` and continue. The cover omits the institution. |
| 6 | The author has not said which sources are already in hand | `sources_status` | Store all three flags `false` and continue with public research. |
| 7 | A private source is in hand and `permission_status` is unset | `permission_status` | Store `pending` and do not use that private material. |
| 8 | The next skill is `case-peer-review` and `target_journal` is unset | `target_journal` | Store `null` (no submission) and do not run a submission review. |

Leave these unset until the author volunteers them or the skill that needs
them asks, one at a time:

- `audience_level` — `case-teaching-note` or `case-classroom-test`
- `audience_location` — `case-classroom-test`
- `target_journal` — `case-peer-review`, unless row 8 already applies

With no private source, store `permission_status: pending` and do not ask
row 7.

`authors` and `institution` feed the cover page of the case, the teaching
note, and the reports. An "I" in the author's message ("I am writing this
case at Escola X") does not name the author; ask for the name.

## Stored when already said

`teaching_tension` and `contrast_set` are not rows in the blocking list.
Do not ask them. Store each one when the author's message already names
it, and leave it `null` when the message does not.

| Field | Store when the author already names | Otherwise |
|---|---|---|
| `teaching_tension` | The doubt students must be able to argue | `null` |
| `contrast_set` | A set of products, people, or markets to compare | `null` |

`contrast_set` is a list of those names, in the author's words. Do not
add names. When either field is set, write it to `internal/intake.yaml`
and to `config`, and pass it to `case-research`. `schema_version` stays
`2`.

## Question wording

| Field | English | Portuguese |
|---|---|---|
| `subject` | "Which company, protagonist, or decision is this case about?" | "Sobre qual empresa, protagonista ou decisão é o caso?" |
| `discipline` | "Which disciplines is this case for?" | "Para quais disciplinas esse caso será escrito?" |
| `authors` | "Who will be named as the author or authors of this case?" | "Quem assina o caso como autor ou autores?" |
| `institution` | "Which institution is this case written for?" | "A qual instituição o caso está vinculado?" |
| `sources_status` | "Which sources do you already have?" | "Quais fontes você já tem?" |
| `permission_status` | "Do you have authorization to use the private material?" | "Você tem autorização para usar o material privado?" |
| `audience_level` | "What is the audience level?" | "Qual o nível dos alunos?" |
| `audience_location` | "Where is the audience?" | "Onde fica o público?" |
| `target_journal` | "Which journal is this for?" | "Para qual journal?" |

Choice options, stored in English:

| Field | Options | Tool |
|---|---|---|
| `discipline` | `strategy`, `financial-planning`, `marketing`, `operations`; any other field through free text, stored as an English kebab-case slug | multiple selection |
| `sources_status` | interviews available, transcripts available, public sources identified, none yet | multiple selection |
| `permission_status` | `pending`, `granted`, `not-applicable` | single choice |
| `audience_level` | `undergraduate`, `graduate`, `executive` | single choice |
| `target_journal` | `Ivey`, `Case Centre`, `HBP`, `RAE`, another named venue, none | single choice |
| `audience_location` | open text: city, state, country | ordinary text |
| `authors` | open text: one or more names, as the author writes them | ordinary text |
| `institution` | open text: the institution's name, as the author writes it | ordinary text |

`authors` is a list of names in the author's own spelling and order. Do
not add titles, degrees, or affiliations the author did not write, and do
not invent names. `institution` is one string. Ask both as ordinary text,
not as a menu.

`discipline` is a list. A case can serve more than one discipline: store
every field the author selects or names, in the order given, without
duplicates, as English kebab-case slugs. A free-text answer that names
several fields adds each one. Do not narrow the answer to a single
"main" discipline. An earlier case may hold one string; read it as a
one-item list and write the list form on the next update.

"None yet" for sources stores all three flags `false`. A named public,
interview, or transcript selection stores that flag `true`. `none` for the
journal stores `null`.

## Stored values

```yaml
subject: "Magazine Luiza"          # author's words; also the slug source
discipline: ["strategy"]           # list of one or more slugs, or null
authors: ["Ana Souza"]             # list of names, author's spelling; or null
institution: "Escola X"            # verbatim; or null
audience_level: null               # undergraduate | graduate | executive
audience_location: null            # verbatim when known
target_journal: null               # "Ivey" | "Case Centre" | "HBP" | "RAE" | other name | null
sources_status:
  interviews_available: false
  transcripts_available: false
  public_sources_identified: true
permission_status: pending         # pending | granted | not-applicable
teaching_tension: null             # the doubt, or null when the author did not name one
contrast_set: null                 # list of names, or null when the author did not name a set
```

`schema_version` stays `2`. `null` means the field has not been collected.
Downstream skills treat `null` as unknown and ask when their own step needs
the field. They do not ask `teaching_tension` or `contrast_set`. Research
reads a stored value and leaves a null value null.

## Worked turns

The author says only "I want to write a case." Ask row 1 and stop:

> Para começar a pesquisa, preciso de um dado: sobre qual empresa, protagonista ou decisão é o caso?

The author says "Magazine Luiza." Row 1 is filled. Ask row 3 with the
discipline choices as a multiple selection. Do not also ask about level, city, journal, or sources
in that message.

The author says "strategy, public sources only." Store `discipline` as
`["strategy"]` and `sources_status`, then ask row 4: who will author the
case. After "Ana Souza, at Escola X", store `authors` and `institution`,
skip rows 6 and 7, scaffold `case-magazine-luiza/`, and route to
`case-research`. Leave level, location, and journal `null`.

The author picks strategy and marketing in the discipline question.
Store `discipline: ["strategy", "marketing"]`. Do not ask which one is
the main discipline.

The author says "a strategy case on Magazine Luiza for graduate students
in São Paulo, written by Ana Souza at Escola X, public sources, no
journal." Store all of that from the one message, scaffold, and ask
nothing.

The same message without "written by Ana Souza at Escola X" still asks
row 4 and then row 5, one per turn.

The author says "the coastal mill" and the message itself could mean two
periods or two decisions. Ask which of those, and only those.

The author says students should be able to argue whether the lead product
can be repeated, and names three smaller products. Store
`teaching_tension` and `contrast_set` from that message. Do not ask about
either field. Continue with the first open blocking row.

## Re-running

On an existing case folder:

- Read `internal/intake.yaml`.
- Ask only the first open row that the current route still needs.
- Update a field only when the author changed it in this run.
- Preserve the completed `stage` and append history. Do not reset the case
  to `bootstrap`.
