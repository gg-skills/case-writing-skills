# Taxonomy

Every word a reader sees in a case document is in that document's
language. This file gives the terms for the supported languages, English
and Portuguese, and says how to adapt them to other languages.

Identifiers stay in English in every language: file and folder names
(`case.md`, `assets/`, `exhibit-1.png`), field names and values in
`internal/`, and skill names. Only the text the reader sees changes. A
Portuguese case may embed `assets/exhibit-1.png` and still call it "Anexo 1".

## How to use it

- Take the document language from the case itself. A Portuguese case gets
  a Portuguese teaching note and Portuguese reports, unless the author
  asks otherwise.
- Use the term in the table, including in headings, captions, cross
  references, table headers, and the cover. Never leave the English term
  in a document written in another language: a Portuguese case has
  "Anexo 1", not "Exhibit 1".
- Keep one term per concept. The case, its teaching note, and its reports
  use the same words.
- Singular and plural follow the language: "Anexo 1", "Anexos".

## Case

| English | Portuguese |
|---|---|
| Teaching case (cover label) | Caso de ensino |
| Exhibit | Anexo |
| Exhibits (section heading) | Anexos |
| Exhibit 1. Title | Anexo 1. Título |
| see Exhibit 1 | ver Anexo 1 |
| Source: | Fonte: |
| Note: / Notes: | Nota: / Notas: |
| Table | Tabela |
| Figure | Figura |
| Appendix | Apêndice |
| Epilogue | Epílogo |
| in thousands of US$ | em milhares de US$ (US$ mil) |
| in millions of US$ | em milhões de US$ (US$ milhões) |
| blank (a value left for students) | em branco |

## Teaching note

| English | Portuguese |
|---|---|
| Teaching note (cover label and title) | Nota de ensino |
| For instructor use only | Uso exclusivo do instrutor |
| Synopsis | Sinopse |
| Learning objectives | Objetivos de aprendizagem |
| Theoretical lenses | Lentes teóricas |
| Class plan | Plano de aula |
| Block 1 — Cold open and context | Bloco 1 — Abertura e contexto |
| Block 2 — Dilemma and data | Bloco 2 — Dilema e dados |
| Block 3 — Decision moment | Bloco 3 — Momento da decisão |
| Block 4 — Wrap-up and transfer | Bloco 4 — Fechamento e transferência |
| Buffer | Margem de tempo |
| Discussion questions | Questões para discussão |
| Pre-class assignment | Preparação para a aula |
| Post-class reflection | Reflexão após a aula |
| Assessment rubric | Rubrica de avaliação |
| Board plan | Plano de quadro |
| Epilogue (what happened) | Epílogo (o que aconteceu) |

## Classroom test report

| English | Portuguese |
|---|---|
| Classroom test (cover label and title) | Teste em sala |
| Mode | Modo |
| Pre-flight | Verificação prévia |
| Real classroom | Aula real |
| Date | Data |
| Audience profile | Perfil da turma |
| Level / Disciplines / Location | Nível / Disciplinas / Local |
| Prior cases seen | Casos já discutidos |
| AI tool access | Acesso a ferramentas de IA |
| Pre-flight checks | Verificações prévias |
| Check / Trigger fired? / Severity / Recommendation | Verificação / Gatilho acionado? / Gravidade / Recomendação |
| AI-assisted moves catalogue | Catálogo de atalhos com IA |
| Timing log | Registro de tempos |
| Question log | Registro de perguntas |
| Board plan slippage | Desvios do plano de quadro |
| Revision brief | Orientações de revisão |
| High / Medium / Low priority | Prioridade alta / média / baixa |

## Peer review report

| English | Portuguese |
|---|---|
| Peer review (cover label and title) | Revisão cega por pares |
| Reviewer persona | Perfil do avaliador |
| Date | Data |
| Summary | Resumo |
| Critical findings | Achados críticos |
| Detailed findings | Achados detalhados |
| Checklist | Lista de verificação |
| Severity: blocking / important / minor | Gravidade: impeditiva / importante / menor |
| Problem / Evidence / Suggested fix | Problema / Evidência / Correção sugerida |
| Recommendation | Recomendação |

## Cover details

| Stored value | English | Portuguese |
|---|---|---|
| `strategy` | Strategy | Estratégia |
| `marketing` | Marketing | Marketing |
| `operations` | Operations | Operações |
| `financial-planning` | Financial planning | Planejamento financeiro |
| `sustainability` | Sustainability | Sustentabilidade |
| `undergraduate` | Undergraduate | Graduação |
| `graduate` | Graduate | Pós-graduação |
| `executive` | Executive education | Educação executiva |

A discipline stored as any other slug is written as its ordinary name in
the document language, such as `people-management` → "Gestão de pessoas".

## Working documents

The evidence pack in `research/` and a variant's `audit.md` are working
documents. Their headings and field names follow the schemas of the skill
that writes them, in English. Their notes to the author follow the
author's language, and quoted sources keep their original wording.

## Other languages

For a language not listed here, use the term that case publishers and
business schools in that language already use, not a word-for-word
translation. For example, Spanish uses "Anexo" and "Nota de enseñanza",
and French uses "Annexe" and "Note pédagogique". When no established
term is clear, choose the closest ordinary term, use it consistently in
the case, the note, and the reports, and record the choice in
`internal/disclosure.md`.
