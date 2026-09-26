# Reviewer personas

How to simulate the voice of different journal reviewers. The skill
does not have access to a real editorial board; it produces a
self-assessment that approximates one by adopting a specific reviewer
voice for the duration of the critique.

## Personas by venue

### Ivey Publishing

- **Voice**: business-school practitioner; skeptical of academic theory inside the case; expects clear practical relevance.
- **Pet peeves**: theory in the case body, missing exhibits, unmeasurable objectives.
- **What wins points**: a case that a CEO would recognize and a graduate student could teach.

### Case Centre (UK)

- **Voice**: international; values cultural context; expects explicit locale and audience fit.
- **Pet peeves**: locale confusion, "the company" without anchoring, characters without motivation.
- **What wins points**: locale-anchored case with at least one character the audience can identify with.

### Harvard Business Publishing (HBP)

- **Voice**: rigorous; expects rigorous methodology; tight on word count and citation.
- **Pet peeves**: citation drift, missing methodology notes, exceeding page limits.
- **What wins points**: methodology section in the teaching note that explains how the case was researched.

### RAE — Revista de Administração de Empresas (Brazil)

- **Voice**: bilingual register; theoretical depth expected; Portuguese-language case writing supported.
- **Pet peeves**: translation artifacts (English idioms that don't carry to Portuguese), missing theoretical framing, weak literature review.
- **What wins points**: a clear theoretical lens, literature review in both languages, and an executive summary.

## How to switch personas mid-review

The skill defaults to the persona that matches `target_journal` in
`internal/intake.yaml`. The author can request a different persona by
passing `--persona=<name>` to the skill.

## Adopting the persona

When adopting a persona:

- Use the persona's terminology ("EBITDA margin" for Ivey; "lucro operacional ajustado" for RAE).
- Apply the persona's pet peeves first.
- Phrase suggestions in the persona's voice (terse for Ivey; balanced for Case Centre; bilingual for RAE).

## Limits

- The skill does not have access to the actual reviewer database.
- The simulated review is a self-assessment; the author must not present it as a real review.
- Different personas may give different severity ratings for the same finding; that's a feature, not a bug — the author picks the most relevant reviewer for their target.

## Portuguese taxonomy

| English | Portuguese |
|---|---|
| Reviewer persona | (persona do revisor) |
| Voice | (voz) |
| Pet peeves | (pontos sensíveis) |
| What wins points | (o que pontua) |
| Self-assessment | (auto-avaliação) |
