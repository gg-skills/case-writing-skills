# Pipeline flow

One request runs the case pipeline to its end. A skill that finishes its
own step does not end the turn: it tells the author what comes next and
runs the next skill.

## The chain

1. `case-bootstrap` — intake and case folder
2. `case-research` — evidence pack
3. `case-business-case` — the case
4. `case-teaching-note` — the teaching note
5. `case-classroom-test` — pre-flight check
6. `case-peer-review` — only when `target_journal` is set

`case-disguise` runs only when the author asks for a variant. A
real-classroom debrief runs only after the author has taught the case.

`next_skill` in `internal/state.json` decides the next step. Each skill
sets it from the work that actually remains, as its own instructions say.

## Continue

When a skill completes and `next_skill` names a skill in the chain,
continue in the same turn:

1. Tell the author, in their language and in one or two lines, what was
   just done and what comes next. For example: "Pasta criada em
   `case-spotify/`. Agora vou pesquisar as fontes públicas sobre o Spotify
   em 2014." This is a status line. It is not a question, and the turn
   does not end there.
2. Load the next skill's instructions and follow them: the harness's skill
   loader, or its `SKILL.md` in the sibling folder
   (`../case-<name>/SKILL.md` from this skill's folder).

Do not ask permission to continue. Do not ask which file to open between
steps. List each step's generated paths as it finishes, and offer to open
a document once, at the end of the run (see
[`reader-formats.md`](reader-formats.md#opening)).


## Defaults first, customize after

Write the first version of a document before asking about preferences.
A preference is anything with a sensible default: the audience level,
where the case sits in a syllabus, the class length, the theoretical
lenses, prior case exposure, or AI tool access in class.

- Use what the author already said. Otherwise use the skill's default and
  state it in the document, such as "Nível assumido: pós-graduação".
- Do not stop to ask a preference before the first version.
- After the document is written, offer to adjust those choices. When the
  question tool accepts several questions in one call, ask the adjustment
  as its own question, with multiple selection. Otherwise add the most
  useful adjustments as options of the end-of-run question.
- When the author picks an adjustment, ask that one fact, then revise the
  document.

Facts without a sensible default still come first: the subject, which
decision, and permission for private material.

## Never ask a one-option question

When only one option fits, use it, say so in the status line, and do not
ask. A question needs at least two real options.

## Gaps in the evidence

A gap does not stop the chain. Gaps include a voice marked `[MISSING]`, a
person with no words from the decision week, an unconfirmed `[VERIFY]`
claim, a source that could not be retrieved, and a figure that exists only
from a later date. Record each gap where the skill says, and continue:

- Research completes the pack with the gaps recorded in
  `extraction-log.md`. It does not stop to ask whether an interview or
  another source exists.
- The case is written from what the pack supports. An unconfirmed claim
  stays out of the case, and a missing voice is not invented.

After the case is written, present it together with its gaps. This is the
one planned pause in the chain when gaps remain; with no gap, continue
straight to the teaching note.

1. List the paths the run generated.
2. List the gaps in a few short lines: what is missing, and how closing
   it would improve the case.
3. Ask one question with the harness question tool. The options, in this
   order:
   - "Seguir com a nota de ensino" (recommended): continue the chain with
     the case as it is.
   - "Pesquisar outras fontes para as lacunas": run `case-research` again
     on the listed gaps, then revise the case.
   - "Vou enviar informações ou material": the author adds an interview,
     a document, or a fact; store it as a source and revise the case.
   - "Revisar o caso": the author says what to change in the case.

   When the question tool accepts more than one question in a call, add a
   second question that offers to open the case, as
   [`reader-formats.md`](reader-formats.md#opening) says. Otherwise, the
   gap question comes first and the paths are already listed.

Stop before the case only when the decision itself cannot be told without
a missing fact. Then ask with the options "Seguir sem essa informação"
(recommended, when the case can still be written with the gap stated),
"Pesquisar em outras fontes", and "Vou fornecer a informação".

## When to stop

Stop only when one of these holds:

- A fact only the author can give blocks the next step: an intake fact,
  an ambiguous subject, permission for private material, a venue choice,
  or a decision that cannot be told without a missing fact.
- The case was just written and gaps remain (see
  [Gaps in the evidence](#gaps-in-the-evidence)).
- A blocker in `internal/state.json` prevents the next skill.
- The author asked for a single step, such as "só a pesquisa".
- `next_skill` is `null`, or it needs something that has not happened yet,
  such as a class that has not been taught.
- The chain is complete.
- The run is close to the harness's context or time limit. Stop at a
  clean handoff, with state saved, rather than in the middle of a step.

## Every turn ends with a question

End every turn with the harness's native question tool (`AskUserQuestion`,
`ask_user_question`, `ask_user`, or the local equivalent). Never end a turn
with a report and no question. Ask in the author's language. Give
options the author can pick to act, with the most likely one first:

- **A fact is missing**: ask that fact, as the skill's own rules say.
- **Stopped before the chain is done**: the first option continues, such as
  "Seguir com a pesquisa". Add the real alternatives, such as "Revisar os
  dados do caso" or "Parar aqui".
- **Gaps after the case**: the options in
  [Gaps in the evidence](#gaps-in-the-evidence).
- **The chain is complete**: the question from
  [`reader-formats.md`](reader-formats.md#opening) that offers to open the
  main deliverable, plus the adjustments from
  [Defaults first, customize after](#defaults-first-customize-after), such
  as "Ajustar nível ou posição na ementa" or "Mudar a duração da aula". It
  may add optional next steps, such as "Criar uma variante" or "Preparar a
  revisão para um journal".

When the harness has no question tool, end with one short question and
its numbered options.
