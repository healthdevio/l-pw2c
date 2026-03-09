# l-pw2c

[![Release](https://github.com/healthdevio/l-pw2c/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/healthdevio/l-pw2c/actions/workflows/release.yml) [![CI](https://github.com/healthdevio/l-pw2c/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/healthdevio/l-pw2c/actions/workflows/ci.yml)

CLI e servidor MCP para distribuir skills pré-definidas da HealthDev aos desenvolvedores.

O projeto foi inspirado na ideia do [`tech-leads-club/agent-skills`](https://github.com/tech-leads-club/agent-skills), mas focado em um catálogo interno simples, versionado no GitHub e pronto para CI/CD.

## Objetivos

- instalar skills rapidamente em projetos dos devs
- remover skills que não serão mais usadas
- atualizar skills já instaladas
- expor o catálogo local via MCP para o Cursor localizar habilidades
- permitir que líderes do time adicionem novas skills sem alterar a arquitetura da CLI

## Instalação

O pacote está publicado no GitHub Packages. Para usar sem instalar globalmente:

```bash
npx @healthdevio/l-pw2c skill install example-skill
npx @healthdevio/l-pw2c skill list
npx @healthdevio/l-pw2c mcp
```

Se preferir instalar globalmente no seu projeto (ou globalmente na máquina), use `npm install @healthdevio/l-pw2c` conforme a documentação do GitHub Packages. O binário fica disponível como `l-pw2c`.

### Não consegue instalar o pacote?

Verifique se você está usando o token correto no arquivo `.npmrc` na raiz do seu projeto.

```text
@healthdevio:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=AUTH_TOKEN_AQUI
```

## Uso da CLI

```bash
l-pw2c skill install <skill-id>
l-pw2c skill uninstall <skill-id>
l-pw2c skill list
l-pw2c skill update <skill-id>
l-pw2c skill update --all
```

Com `npx` (sem instalar):

```bash
npx @healthdevio/l-pw2c skill install example-skill
npx @healthdevio/l-pw2c skill uninstall example-skill
npx @healthdevio/l-pw2c skill list
npx @healthdevio/l-pw2c mcp
```

## Onde as skills são instaladas

Por padrão, a instalação acontece em:

`<projeto>/.cursor/skills/<skill-id>`

O arquivo de estado fica em:

`<projeto>/.cursor/l-pw2c/state.json`

Esse arquivo funciona como um índice local das skills instaladas. Ele guarda metadados como `id`, `version`, `installedAt` e `category`, permitindo que a CLI saiba rapidamente o que está instalado para comandos como `skill list`, `skill update` e `skill update --all`.

Quando a última skill é removida, o `state.json` também é apagado. A pasta `.cursor/l-pw2c` só é removida se estiver vazia, para não apagar arquivos extras adicionados manualmente.

Opções da CLI para paths: `--project-dir`, `--install-dir`, `--state-file`. Variáveis de ambiente: `LPW2C_PROJECT_DIR`, `LPW2C_INSTALL_DIR`, `LPW2C_STATE_FILE`.

## Comando MCP

O comando abaixo sobe um servidor MCP local via `stdio`:

```bash
l-pw2c mcp
```

Ferramentas expostas: `search_skills`, `read_skill`, `fetch_skill_files`, `list_skills`.

### Configuração no Cursor

Com `npx`:

```json
{
  "mcpServers": {
    "l-pw2c": {
      "command": "npx",
      "args": ["@healthdevio/l-pw2c", "mcp"]
    }
  }
}
```

Com pacote instalado globalmente:

```json
{
  "mcpServers": {
    "l-pw2c": {
      "command": "l-pw2c",
      "args": ["mcp"]
    }
  }
}
```

## Catálogo

O pacote inclui um catálogo de skills em `skills/`. Use `l-pw2c skill list` para ver as instaladas e o MCP para descobrir as disponíveis.

---

## Contribuidores

Instruções para quem desenvolve ou contribui no repositório.

### Stack

- TypeScript estrito
- ESM
- Commander para CLI
- Zod para validação
- MCP TypeScript SDK
- Vitest para testes
- ESLint + Prettier
- Changesets para release

### Instalação local

```bash
npm install
npm run build
```

### Desenvolvimento

```bash
npm run dev -- skill list
npm run dev -- skill install example-skill
```

Comandos da CLI em modo dev (sem instalar o pacote):

```bash
npm run dev -- skill install example-skill
npm run dev -- skill uninstall example-skill
npm run dev -- skill list
npm run dev -- skill update example-skill
npm run dev -- skill update --all
```

### Catálogo de skills (estrutura)

O catálogo fica em `skills/`:

```text
skills/
  registry.json
  testing/
    example-skill/
      skill.json
      SKILL.md
      templates/
      references/
```

Consulte [docs/adding-skills.md](docs/adding-skills.md) para o fluxo completo de cadastro de novas skills.

### Scripts

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run package:check
```

### Release e GitHub Packages

O workflow de release usa Changesets, GitHub Actions e GitHub Packages. O fluxo faz **commit direto na `main`** (sem abrir PR), para funcionar mesmo quando a organização não permite que o GitHub Actions crie pull requests. Se essa permissão estiver habilitada (Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests"), você pode optar por usar a `changesets/action` com fluxo baseado em PR.

#### Como publicar uma nova versão

1. **Criar o changeset** — `npm run changeset`. Escolha o tipo de bump (patch, minor, major) e escreva o resumo das mudanças (entra no CHANGELOG).
2. **Commitar e enviar** — commit do arquivo em `.changeset/` (e das suas alterações) e push na `main`.
3. **CI** — na `main`, o workflow valida (lint, typecheck, testes, build), aplica os changesets (atualiza `package.json` e CHANGELOG), faz commit e push do bump na própria `main` e publica no GitHub Packages.

Você **não** precisa alterar o `version` no `package.json` manualmente, nem rodar `version-packages` ou `release` localmente; a pipeline faz isso.

Antes do primeiro publish, confirme:

1. o repositório existe em `healthdevio/l-pw2c`
2. o `package.json` está com o nome correto do pacote
3. a visibilidade/permissões do pacote no GitHub Packages estão alinhadas com o time

### Testes

Os testes cobrem:

- carregamento e validação do registry
- instalação, remoção e atualização de skills
- execução da CLI
- ferramentas do MCP em memória
