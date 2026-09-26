# Character construction

Use the actors the decision needs; 3–5 is a possible starting point, not a
requirement. Source factual descriptions and distinguish interpretation
from documented motivations.

A missing voice is `[MISSING]` and a question to the author, not a
reconstructed quote from a published teaching case, a later interview, or
a character sketch.

## The five elements

1. **Name**, pseudonym, or an unambiguous role label.
2. **Role** at the moment of the decision.
3. **Motivation** — what they want from the decision.
4. **Voice** — take the words from `research/quotes-by-theme.md`. In the case, the highlighted quotation is those words in the language of the case. The verbatim source may follow as `*Original:*`. Indirect speech is allowed only when the source itself states the position. No primary words means `[MISSING]`.
5. **Constraint** — what limits what they can do (regulatory, financial, organizational).

## Quality gates per element

| Element | Gate |
|---|---|
| Name | Use a name or stable role label. Pseudonyms are explicit (`"Acme's CFO (called Mariana in the case)"`). |
| Role | Must be true at the moment of the decision, not at the moment of writing. |
| Motivation | Must be inferable from a source. If motivation is the analyst's guess, mark `[VERIFY]`. |
| Voice | Any direct quote must be in `research/quotes-by-theme.md` with theme and attribution. The case shows it in the case language; `*Original:*` carries the verbatim source when the languages differ. Indirect speech is allowed only when the source itself states the position. A decision-relevant voice with no primary words is `[MISSING]`. Do not draft the sentence. |
| Constraint | Must be true at the moment of the decision (e.g., "couldn't raise rates because of an existing fixed-rate loan book" must come from the evidence). |

## Protagonist and antagonist

- **Protagonist**: the character who must decide. Identify who owns the decision from the evidence; a team decision is acceptable when that is the case design.
- **Antagonist**: optional. When present, it is a force (market, regulation, internal rival) that constrains the protagonist, not a "villain". The market can be the antagonist. The regulator can be the antagonist. Avoid creating a personified villain unless the evidence pack supports it.

## How many characters

- A single decision maker may be enough.
- Add actors when their interests or constraints change the analysis.
- For a larger cast, clarify roles; do not add or remove people merely to satisfy a count.

## Voice ≠ personality

- Voice is the lexical and rhythm signature of a character, anchored on a quote. It is not a personality description.
- "Alice is decisive" is a personality claim. "Alice said: 'I won't sit on this again, we move Monday.'" is a voice claim.

## Character card

For each character, the case author should be able to fill this:

```yaml
- name: <name>
  role: <role at decision time>
  motivation: <one sentence, sourced>
  voice_or_position: <sourced verbatim quote or indirect speech>
  constraint: <one sentence, sourced>
```

Record a missing decision-relevant voice as `[MISSING]` and ask the author. Do not fill the line. An actor with no words about the decision stays in the pack and out of the narrative.

## Businesses the decision uses

When a source names the operating head of a business the decision uses,
cast that person with one sourced line on how that business makes money.
The line the reader sees is the case-language rendering of a verbatim quote, or a paraphrase the source itself states. The verbatim source may follow as `*Original:*`.
People who never speak about the decision stay in the pack and out of the
narrative.

A decision-relevant voice with no primary words is `[MISSING]` in the pack.
Do not draft the sentence in the case. Ask the author whether an interview
exists.

## What makes a character fail

1. Unsupported personality claims: "Bob is analytical" without evidence.
2. Role without motivation: "Head of Operations" with no source for what they wanted.
3. Motivation without constraint: "Wanted to grow" without explaining what blocked them.
4. Ambiguous role labels: distinguish actors consistently when names are unavailable or withheld.
5. A drafted sentence for a voice with no primary words. Mark `[MISSING]` and ask the author.

## Portuguese taxonomy

| English | Portuguese |
|---|---|
| Protagonist | protagonista |
| Antagonist | antagonista |
| Voice | voz |
| Motivation | motivação |
| Constraint | restrição / limitação |
| Ally | aliado |
