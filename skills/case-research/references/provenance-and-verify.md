# Provenance and `[VERIFY]` convention

Every claim in the evidence pack must carry provenance. The two pieces of
metadata are:

- **Source class**: `public` (from research/sources/public/) or `private` (from research/sources/private/).
- **Source file + page/section**: the exact file and (when applicable) page or section number.

## What is primary

A same-day newspaper is a primary source for what it printed: the words,
the date, and the fact that those words appeared. Do not tag `[VERIFY]`
on that printing. A figure the article attributes to another party can
still be `[VERIFY]` when it is load-bearing and is not in a primary filing.

A quote taken from a published teaching case is not a primary source. Do
not copy it into the pack. Mark the voice `[MISSING]` and ask the author.

## Required fields per row or quote

```text
<verbatim or paraphrase> — <speaker>, <source-path>, <page-or-section>
```

For example:

> "We were losing 15% margin on the premium line by mid-2023." — Alice (CEO), research/sources/private/interview-CEO, p. 4

## When to tag `[VERIFY]`

Tag a claim `[VERIFY]` when **all** of these hold:

- The claim originated from a secondary source (analyst note, news summary, third-party report) rather than the primary source (the company's own filing, the interview itself).
- The claim is material to the case narrative (a number that affects a calculation, a quote that anchors a character voice, a fact that drives the decision point).
- The claim is not obviously corroborated by the primary source.

Do **not** tag `[VERIFY]` on:

- Direct quotes from primary sources.
- Numbers from the primary source (annual report, transcript).
- A same-day newspaper, for the words, the date, and the fact of that printing.
- Editorial framing or background context that is not load-bearing.

## Author workflow

When the case enters `case-business-case`, the author is expected to:

1. Read every `[VERIFY]` tag in the evidence pack.
2. Confirm against the primary source or note the reason it cannot be verified.
3. Remove the `[VERIFY]` tag once confirmed, or replace the claim with a verified one.

The author can use `case-bootstrap`'s intake (`permission_status`) and
`case-disguise` to address gaps that surface during verification.

## Language

Quotes preserve the original language of the source. The skill does not
translate. Provenance metadata (`speaker`, file paths) is in English.
Portuguese author-facing descriptions of a quote can be added in
parentheses, but the quote itself is verbatim.

## Example audit

```markdown
## Theme: margin pressure

> "Perdíamos 15% de margem na linha premium até meados de 2023."
> — Alice (CEO), research/sources/private/interview-CEO, p. 4

> "Brazil was the test market; Argentina came second."
> — Bob (CFO), research/sources/private/interview-CFO, p. 11 [VERIFY — secondary paraphrase in interview preamble]
```

The first quote is verbatim Portuguese from the interview — no `[VERIFY]`.
The second is the analyst's English paraphrase of an Argentine context
the CFO mentioned — `[VERIFY]` because the underlying numbers were not in
the primary transcript.
