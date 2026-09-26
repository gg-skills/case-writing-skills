# Skills para escrever casos de ensino

Sete skills que conduzem um estudo de caso de ensino, da abertura até a variante. O mesmo texto serve aos agentes de código que leem `SKILL.md` e aos produtos que aceitam esse arquivo por upload.

Este repositório é o pacote instalável. O material da palestra e o acervo ficam em outro repositório, `gaspargiacomini/case-writing`.

| Skill | Quando entra |
| --- | --- |
| `case-bootstrap` | Abre a pasta do caso e coleta um fato de cada vez |
| `case-research` | Monta o pacote de evidências |
| `case-business-case` | Escreve a narrativa do caso |
| `case-teaching-note` | Escreve a nota de ensino |
| `case-classroom-test` | Prepara o teste em sala e o debrief |
| `case-peer-review` | Revisa o caso e a nota para um periódico |
| `case-disguise` | Produz uma variante para reuso, adaptação ou anonimização |

O pacote acompanha o `main` de cada repositório `gg-skills/case-*` no momento da sincronização. O projeto Case Writing pode continuar fixado num commit anterior.

## Instalar num agente de código

É preciso Node.js 18 ou mais recente para o comando abaixo. O repositório é público.

```sh
npx skills add gg-skills/case-writing-skills -y
```

O comando copia as sete skills para `.agents/skills/`. Cursor, Codex, Gemini CLI e GitHub Copilot leem essa pasta. Claude Code também recebe um link em `.claude/skills/` quando o comando detecta o Claude Code.

Para escolher os agentes:

```sh
npx skills add gg-skills/case-writing-skills -y \
  -a claude-code -a cursor -a codex -a github-copilot -a gemini-cli
```

### Claude Code

Dentro de uma sessão:

```text
/plugin marketplace add gg-skills/case-writing-skills
```

Depois instale o plugin `case-writing`. As sete skills passam a valer nessa sessão.

### Codex

```sh
codex plugin marketplace add gg-skills/case-writing-skills
```

Abra `/plugins`, instale **Case writing**, e confira os nomes com `/skills`.

### Cursor, GitHub Copilot e Gemini CLI

O `npx skills add` acima é o caminho. Cursor também lê `.cursor/skills/`, `.claude/skills/` e `.codex/skills/`. O Copilot lê `.github/skills/`, `.claude/skills/` e `.agents/skills/`, no projeto, e `~/.copilot/skills/` ou `~/.agents/skills/` na conta da máquina. O Gemini CLI lê `.gemini/skills/` e `.agents/skills/`, um nível abaixo da pasta de skills.

### Windsurf e outros agentes da CLI `skills`

```sh
npx skills add gg-skills/case-writing-skills -y -a windsurf
```

A lista de agentes aceitos está em `npx skills add --help`.

## Instalar sem um agente de código

Cada skill também existe como zip na [página de releases](https://github.com/gg-skills/case-writing-skills/releases). O zip de uma skill tem a pasta da skill na raiz (`case-bootstrap/SKILL.md`). O zip `case-writing-plugin.zip` junta as sete, com `.claude-plugin/plugin.json`.

### Claude no navegador, no aplicativo e no Cowork

1. Ative a execução de código em **Settings → Capabilities**.
2. Abra **Customize → Skills → + → Create skill → Upload a skill** e envie um zip de skill.
3. Ou, num plano com a aba **Plugins**, envie `case-writing-plugin.zip`.

A skill fica disponível no chat e no Cowork da mesma conta. Num plano Team ou Enterprise, um owner pode provisionar a skill para a organização.

### ChatGPT

**Skills → Create → Upload from your computer**, um zip de skill por vez. Um administrador do workspace pode enviar o zip do plugin ou importar o marketplace deste repositório.

### Microsoft Copilot Studio

Envie o `SKILL.md` ou o zip da skill no agente. Esse produto é distinto do GitHub Copilot.

## O que a instalação não faz

As skills escrevem HTML e PDF com Node.js 24.12 ou mais recente, pnpm e o Google Chrome. Isso funciona num agente de código, nesta máquina. O chat do Claude e o ChatGPT seguem as instruções de escrita. Eles não executam esse renderizador.

## Atualizar o pacote

Num clone deste repositório, com acesso de leitura aos repositórios `gg-skills/case-*`:

```sh
pnpm install
pnpm run sync
pnpm run check
pnpm run package
```

`sync` substitui `skills/` pela ponta do `main` de cada skill e reescreve `bundle.lock.json`. `package` gera `dist/*.zip`. Publique o commit e um release com esses zips. A ajuda de cada script sai com `--help` e não altera arquivos.

Cada pasta em `skills/<nome>/` traz `.bundle-source.json` com o repositório e o commit copiados. A edição continua no repositório da skill, não nesta cópia.
