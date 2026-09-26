# Rotation rules

Surface disguise works by rotating specific fields in the case without
changing the teaching objective. The skill applies a configurable
rotation rule per field. This document describes how to design
rotation rules that survive cross-cohort reuse.

## Fields to rotate

| Field | Effect | Recommended rotation |
|---|---|---|
| Title | Single most effective disguise; students search by title. | Replace with a different phrase that still captures the dilemma (e.g., "Brazilian Fintech on the Brink" → "LatAm Payments Crossroads"). |
| Names | Characters become unsearchable. | Maintain a list of 4–6 names per cohort; cycle through. Avoid names that start with the same letter (alphabetical search). |
| Prices and costs | Forces re-calculation of every financial exhibit. | Apply a fixed delta (e.g., ±10%) or a deterministic shift (e.g., 4.20 → 4.10). Do not randomize — the rotation must be reproducible. |
| Currency | Forces re-check of any FX assumption. | Convert using the rate at the new date; cite the source. |
| Dates | Forces re-check of any temporal assumption. | Shift by 1–3 years; cite the source of the new dates. |

## What NOT to rotate

- **The decision type**: preserve the analytical task. A numerical rotation can change the recommendation; verify and document that result in the variant teaching note.
- **The teaching objective**: preserve it unless the author requests a change.
- **Theoretical lenses applied in the teaching note**: retain applicable lenses while updating their worked application to the transformed data.
- **Character archetypes** (e.g., "the cautious CFO"): only the names and pronouns change, not the role types.

## Designing a name list

```yaml
names:
  cohort_1: ["Alice", "Bob", "Carol", "Dan"]
  cohort_2: ["Eve", "Frank", "Gina", "Hugo"]
  cohort_3: ["Iris", "Jack", "Kira", "Liam"]
```

Rules:

- Each name is unique within a cohort and across cohorts used in the same academic year.
- Names should be culturally plausible for the locale.
- Keep at most 5–6 names to avoid combinatorial explosion in the case body.

## Designing a price rotation

```yaml
prices:
  delta_pct: 10       # ±10% on every price and cost
  currency: BRL       # or auto-convert from base
  base_year: 2024     # year of the price snapshot
```

The skill applies the rotation deterministically. The audit trail
records every changed value with the rotation rule applied.

## Anti-patterns

- **Randomize every price**: makes the rotation unreproducible; a future pilot cannot reproduce it.
- **Rotate only the names**: leaves every number exposed; students only need to redo the title page.
- **Rotate the decision**: defeats the purpose; the case becomes a new case.
- **Skip the audit trail**: without it, a future cohort can reconstruct the original and copy from a third cohort.

## How to test a rotation

After applying a rotation, the author should:

1. Re-run every financial exhibit by hand or with a calculator.
2. Confirm every number in the case body and variant teaching note still adds up, and reconcile all worked solutions and recommendations.
3. Read the case aloud once — a clumsy rotation often produces ungrammatical sentences.
4. Confirm the title does not match any prior cohort's title.
5. Confirm the author-only audit trail records all changes and their dependencies; preserve the master and store both variant documents in a distinct folder.

## Portuguese taxonomy

| English | Portuguese |
|---|---|
| Rotation rule | (regra de rotação) |
| Surface disguise | (disfarce superficial) |
| Substantive twist | (twist substantivo) |
| Audit trail | (trilha de auditoria) |
| Cohort | (turma / coorte) |
| Delta | (delta) |
| Deterministic | (determinístico) |
