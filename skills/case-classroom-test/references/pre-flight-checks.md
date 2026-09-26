# Pre-flight checks

A catalogue of audience-fit and complexity checks run before the case
is used in class. Each check has a trigger, a heuristic, and an example
failure that should make the case be replaced or revised.

## Checks

### 1. Geographic and demographic resonance

- **Trigger**: case involves a service, product, or institution that is geographically concentrated.
- **Heuristic**: ask whether the audience's location plausibly has the service or institution. Local availability alone does not establish familiarity or suitability. Use the reported audience profile to identify a preparation need.
- **Example failure**: a fintech case about Uber in a 20k-person city in the interior of Goiás where Uber does not operate and is not planned to operate. If the instructor reports that the cohort is unfamiliar with the service, check whether a brief introduction would support the learning objectives.
- **Recommendation**: provide a brief orientation where sufficient; recommend adaptation or replacement only when the learning objectives and audience evidence justify it.

### 2. Level calibration

- **Trigger**: case introduces concepts above or below the audience's prior exposure.
- **Heuristic**: use declared prerequisites and instructor-reported prior knowledge; degree level alone does not establish familiarity with a concept.
- **Example failure**: a planned calculation requires knowledge that the instructor says this cohort has not studied and that assigned preparation does not provide.
- **Recommendation**: shift the depth in the case body, or move the basic concept to the teaching note's appendix.

### 3. Decision urgency

- **Trigger**: case has a protagonist who must decide but the timing of the decision is vague.
- **Heuristic**: the decision must be framed with a deadline or a triggering event. "She will decide sometime next year" is not a case.
- **Example failure**: a strategic decision narrated without a board meeting, regulatory deadline, or counterparty offer. The discussion becomes a survey of opinions.
- **Recommendation**: anchor the decision in a concrete event the audience can identify.

### 4. Stakeholder representation

- **Trigger**: the audience will map themselves onto one of the characters.
- **Heuristic**: check whether students can understand the relevant actors’ motivations and constraints; demographic matching is not a requirement. Clarify unfamiliar roles when that helps students analyze the decision.
- **Example failure**: the instructor reports that students cannot distinguish the actors’ responsibilities, preventing them from analyzing the options.
- **Recommendation**: clarify an evidenced actor’s role or supply orientation; never add an invented actor to meet an audience-fit criterion.

### 5. AI-shortcut vulnerability

- **Trigger**: the case has a calculation, summary, or comparison a student could produce in under a minute with AI assistance.
- **Heuristic**: list every numerical claim, every comparison, and every position statement. If a spreadsheet + LLM can produce any of them in <60 seconds, the case is vulnerable to a shortcut.
- **Example failure**: a case whose central question is "what's the IRR of this project?" — the spreadsheet computes it; the discussion collapses.
- **Recommendation**: add a counter-question the discussion requires the student to engage with (e.g., "even if the IRR is 14%, should the project proceed given the strategic context?").

### 6. Counter-argument visibility

- **Trigger**: the case implicitly favors one side of the decision.
- **Heuristic**: an instructor reading the case cold should be able to argue against the protagonist's apparent choice. If not, the discussion is one-sided.
- **Example failure**: a case that depicts a CEO as obviously right; students either agree or play contrarian.
- **Recommendation**: surface one character's strongest counter-argument inside the case body.

### 7. Time-budget realism

- **Trigger**: the case is dense and the discussion could run long.
- **Heuristic**: sum planned discussion, calculations, group work, transitions, and buffer. Count in-class reading only when it is actually planned; do not convert the whole session into a word budget.
- **Example failure**: a case that takes 30 minutes to read in full, leaving 50 minutes for discussion of 4 blocks.
- **Recommendation**: adjust activities or assign preparation; preserve a short synthesis/transfer segment and a buffer.

## Output format

For each check, the skill produces a row in `classroom/report.md`:

```markdown
| Check | Trigger fired? | Severity | Recommendation |
|---|---|---|---|
| Geographic resonance | yes | high | Replace with X case |
| Level calibration | no | — | — |
| Decision urgency | yes | medium | Anchor in board meeting of YYYY-MM-DD |
| AI-shortcut vulnerability | yes | high | Add counter-question in Block 2 |
```

Severity: `high` (case must be replaced or substantially revised),
`medium` (revision recommended), `low` (optional), `—` (check passed).

## Portuguese taxonomy

| English | Portuguese |
|---|---|
| Geographic resonance | (aderência geográfica) |
| Level calibration | (calibração de nível) |
| Decision urgency | (urgência da decisão) |
| Stakeholder representation | (representação dos stakeholders) |
| AI-shortcut vulnerability | (vulnerabilidade a atalhos de IA) |
| Counter-argument visibility | (visibilidade do contra-argumento) |
| Time-budget realism | (realismo do orçamento de tempo) |
