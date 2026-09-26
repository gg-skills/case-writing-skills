# Critical checklists

The eight checklists applied by the skill. Each checklist has a
trigger, a set of look-for signals, and an example finding with
severity.

## 1. Decision clarity and urgency

- **Trigger**: every case.
- **Look for**: is there one explicit decision the protagonist must make? Is there a deadline or triggering event? Is the decision consequential (not "should we change the logo color?")?
- **Example finding**: `severity: importante` — "The protagonist's decision to enter Argentina is described as 'under consideration'. There is no deadline, no board meeting, no counterparty offer. The discussion will devolve into a survey of opinions."

## 2. Case vs note separation

- **Trigger**: every case.
- **Look for**: is the case body free of theory, framework names, or authorial commentary? Do theory-laden passages live only in the teaching note?
- **Example finding**: `severity: impeditiva` — "Part B contains the line 'consistent with agency theory's prediction of misalignment under information asymmetry'. This is teaching-note content. Remove or rewrite as character voice."

## 3. Source verifiability

- **Trigger**: every case.
- **Look for**: are all claims traceable to a source? Are page numbers given? Are URLs working? Are interview transcripts cited by ID? A highlighted quotation in the document language is sourced when the verbatim sentence is on the following `*Original:*` line, in the evidence pack, or in the author-only audit. Flag a translation that adds a fact the source does not state. Do not require the foreign-language sentence to occupy the highlighted quotation.
- **Example finding**: `severity: importante` — "Exhibit 3 cites a 'recent McKinsey report' without a year or URL. Either cite the specific report or remove the claim."

## 4. Measurable learning objectives

- **Trigger**: every teaching note.
- **Look for**: are objectives specific, measurable, and mapped to case sections? Or are they vague ("understand X")?
- **Example finding**: `severity: importante` — "Objective 2 ('understand the trade-offs of international expansion') is not measurable. Replace with 'defend a position on whether the protagonist should expand to Argentina, citing Exhibit 4'."

## 5. Replicable lesson plan

- **Trigger**: every teaching note.
- **Look for**: could a colleague who has never met the author teach the class cold from the teaching note alone? Are timings realistic? Are questions supported by case evidence and explicitly declared prerequisites or assigned readings?
- **Example finding**: `severity: impeditiva` — "Block 2 requires a Porter framework that is absent from the declared preparation. Specify an accessible prerequisite or assigned reading and explain its case application in the teaching note, or replace the question. Keep theory out of the case body."

## 6. Audience fit

- **Trigger**: every case.
- **Look for**: does the case match the declared reader (level, disciplines, locale)? When several disciplines are declared, does the case give each one material to work with? If the journal targets undergraduate, are graduate-level concepts absent from the case body?
- **Example finding**: `severity: importante` — "The case targets 'advanced graduate' but uses 'EBITDA' without explanation. Either define it in the case body or move the explanation to the teaching note appendix."

## 7. Originality of contribution

- **Trigger**: every submission.
- **Look for**: does the case offer something not already published? Is the angle obvious or does it surface a non-trivial insight?
- **Example finding**: `severity: menor` — "The angle (fintech regulation in Brazil) is well-trodden. The non-obvious finding — that the regulator's forbearance benefited incumbents over entrants — is the contribution. Lead with it in the opening paragraph."

## 8. Editorial format conformance

- **Trigger**: every submission.
- **Look for**: word count, citation style, exhibit numbering, anonymization, author bio, conflict-of-interest disclosure.
- **Example finding**: `severity: impeditiva` — "Ivey requires 8–15 pages and APA citation. Current manuscript is 22 pages with Harvard citation. Reformat before submission."

## Severity legend

| Severity | Meaning | Action |
|---|---|---|
| `impeditiva` | Blocks publication. | Must fix before submission. |
| `importante` | Should fix in this round. | Fix if time allows. |
| `menor` | Optional polish. | Address if no other priorities. |

## Output row format

```markdown
| # | Checklist | Severity | Problem | Evidence | Suggested fix |
|---|---|---|---|---|---|
| 1 | Decision clarity | importante | Decision has no deadline | Part B, page 4 | Anchor in board meeting of YYYY-MM-DD |
| 2 | Case vs note | impeditiva | Theory in body | Part B, page 6, line 3 | Rewrite as character voice |
```

## Portuguese taxonomy

| English | Portuguese |
|---|---|
| Decision clarity | (clareza da decisão) |
| Case vs note separation | (separação caso vs nota) |
| Source verifiability | (verificabilidade das fontes) |
| Measurable objectives | (objetivos mensuráveis) |
| Replicable lesson plan | (plano replicável) |
| Audience fit | (aderência ao público) |
| Originality | (originalidade) |
| Editorial format | (formato editorial) |
| Severity | (severidade / gravidade) |
