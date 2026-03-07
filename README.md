# l-pw2c

CLI e servidor MCP para distribuir skills pré-definidas da HealthDev aos desenvolvedores.

O projeto foi inspirado na ideia do [`tech-leads-club/agent-skills`](https://github.com/tech-leads-club/agent-skills), mas focado em um catálogo interno simples, versionado no GitHub e pronto para CI/CD.

## Objetivos

- instalar skills rapidamente em projetos dos devs
- remover skills que não serão mais usadas
- atualizar skills já instaladas
- expor o catálogo local via MCP para o Cursor localizar habilidades
- permitir que líderes do time adicionem novas skills sem alterar a arquitetura da CLI

## Stack

- TypeScript estrito
- ESM
- Commander para CLI
- Zod para validação
- MCP TypeScript SDK
- Vitest para testes
- ESLint + Prettier
- Changesets para release

## Instalação local

```bash
npm install
npm run build
```

### Desenvolvimento

```bash
npm run dev -- skill list
npm run dev -- skill install example-skill
```

## Uso da CLI

### Localmente em desenvolvimento

```bash
npm run dev -- skill install example-skill
npm run dev -- skill uninstall example-skill
npm run dev -- skill list
npm run dev -- skill update example-skill
npm run dev -- skill update --all
```

### Após instalar o pacote

Se o pacote estiver instalado globalmente, o binário fica disponível como `l-pw2c`.

```bash
l-pw2c skill install example-skill
l-pw2c skill uninstall example-skill
l-pw2c skill list
l-pw2c mcp
```

### Usando com `npx`

Como o GitHub Packages exige pacote npm com scope, a chamada via `npx` ficará assim enquanto o pacote estiver publicado lá:

```bash
npx @healthdevio/l-pw2c skill install example-skill
npx @healthdevio/l-pw2c skill uninstall example-skill
npx @healthdevio/l-pw2c skill list
npx @healthdevio/l-pw2c mcp
```

Se no futuro você quiser a ergonomia exata de `npx l-pw2c ...`, será necessário publicar também um pacote sem scope em outro registry ou criar um wrapper dedicado.

## Onde as skills são instaladas

Por padrão, a instalação acontece em:

`<projeto>/.cursor/skills/<skill-id>`

O arquivo de estado fica em:

`<projeto>/.cursor/l-pw2c/state.json`

Esse arquivo funciona como um índice local das skills instaladas. Ele guarda metadados como `id`, `version`, `installedAt`, `installPath` e `category`, permitindo que a CLI saiba rapidamente o que está instalado para comandos como `skill list`, `skill update` e `skill update --all`.

Quando a última skill é removida, o `state.json` também é apagado. A pasta `.cursor/l-pw2c` só é removida se estiver vazia, para não apagar arquivos extras adicionados manualmente.

Você também pode sobrescrever paths com opções da CLI:

- `--project-dir`
- `--install-dir`
- `--state-file`

Ou via variáveis de ambiente:

- `LPW2C_PROJECT_DIR`
- `LPW2C_INSTALL_DIR`
- `LPW2C_STATE_FILE`

## Comando MCP

O comando abaixo sobe um servidor MCP local via `stdio`:

```bash
l-pw2c mcp
```

Ferramentas expostas:

- `search_skills`
- `read_skill`
- `fetch_skill_files`
- `list_skills`

### Exemplo de configuração no Cursor

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

Se o pacote estiver instalado globalmente:

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

## Catálogo de skills

O catálogo fica em `skills/`.

Estrutura esperada:

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

Consulte [docs/adding-skills.md](docs/adding-skills.md) para o fluxo completo de cadastro.

## Scripts

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run package:check
```

## Release e GitHub Packages

O workflow de release usa:

- `Changesets` para versionamento
- `GitHub Actions` para validação e publicação
- `GitHub Packages` como registry npm

Antes do primeiro publish, confirme:

1. o repositório existe em `healthdevio/l-pw2c`
2. o `package.json` está com o nome correto do pacote
3. a visibilidade/permissões do pacote no GitHub Packages estão alinhadas com o time

## Testes

Os testes cobrem:

- carregamento e validação do registry
- instalação, remoção e atualização de skills
- execução da CLI
- ferramentas do MCP em memória
