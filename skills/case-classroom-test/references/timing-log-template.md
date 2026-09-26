# Timing log template

Used in mode 2 (real-classroom). Captures planned vs actual duration per
block, plus the question log and board-plan slippage.

## Block timing

| Block | Planned (min) | Actual (min) | Notes |
|---|---|---|---|
| 1 — Cold open + context | 20 | — | |
| 2 — Dilemma + data | 20 | — | |
| 3 — Decision moment | 20 | — | — |
| 4 — Wrap-up + transfer | 20 | — | — |

Add a `Δ` column if desired (planned − actual).

## Question log

| Block | Question | Worked? | Notes |
|---|---|---|---|
| 1 | "What did you notice first?" | yes | Quick engagement, expected. |
| 1 | "Where does the protagonist first signal discomfort?" | partly | Some students pointed to the wrong scene. |
| 2 | "What's the protagonist giving up if they choose option A?" | yes | Strong trade-off articulation. |
| 3 | "What would you do?" | partly | A few students parroted AI's position. |

`Worked?` values: `yes` (engaged, productive), `partly` (mixed), `no`
(fell flat or produced misunderstanding).

## Board plan slippage

Compare the planned board plan (`teaching-note.md`'s board plan)
to what actually ended up on the whiteboard.

```markdown
## Planned

[planned board state]

## Actual

[what was on the board at the end of the class]
```

For each divergence, explain whether the slippage was productive
(class took the discussion somewhere unexpected and useful) or
unproductive (planned question did not land; board became confusing).

## Revision brief

Prioritized list of changes for the next run:

```markdown
### High priority
- [ ] Block 1 question 2 needs a clearer scene anchor (current ambiguity caused students to point to wrong scene).

### Medium priority
- [ ] Add a counter-question to Block 3 for the AI-position shortcut.

### Low priority
- [ ] Trim Part A by 200 words; current reading time leaves Block 4 rushed.
```

Each item maps to a section of the case or teaching note, so the
author can apply the revision directly.

## Cross-references

- Pre-flight checks (`pre-flight-checks.md`) flag what the next pilot should re-verify.
- AI-move catalogue (`ai-assisted-moves.md`) is updated with any new shortcuts observed.

## Portuguese taxonomy

| English | Portuguese |
|---|---|
| Timing log | (log de tempo) |
| Question log | (log de perguntas) |
| Board plan slippage | (desvio do plano de quadro) |
| Revision brief | (briefing de revisão) |
| Worked / partly / no | (funcionou / parcialmente / não) |
