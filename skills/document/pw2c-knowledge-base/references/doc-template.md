---
type: [TIPO]
project: [SLUG_OU_NOME_DO_PROJETO]
domain: [DOMÍNIO_OPCIONAL]
tags: [tag1, tag2, tag3]
---

# Título do documento

## Contexto / Objetivo

Breve descrição do que este documento cobre e por que foi criado.

## Detalhes

Conteúdo principal em Markdown. Escrever em português; manter termos técnicos, APIs e nomes de ferramentas em inglês.

## Referências / Links

Links, docs ou entidades relacionadas para o grafo de conhecimento.

## ⚠️ Restrições e pontos de atenção

Lista de restrições e limitações e pontos de atenção, se houver.

---

## Instruções para o agente (não enviar para a base)

O conteúdo **acima** (do primeiro `---` até o fim das seções de corpo) é o que deve ser enviado para a base. Use `mcp_pw2c_knowledge_insert_text` (um documento) ou `mcp_pw2c_knowledge_insert_texts` (vários). Sempre informe o parâmetro **file_source** / **file_sources** com um nome legível.

### Tipos de documento

| type                | Quando usar                                 | Exemplo de tags           |
| ------------------- | ------------------------------------------- | ------------------------- |
| `user_story`        | História de usuário, requisito funcional    | projeto, domínio, feature |
| `business_rule`     | Regra de negócio do cliente ou domínio      | projeto, domínio, negócio |
| `domain`            | Descrição de domínio, glossário, conceitos  | projeto, domínio          |
| `project`           | Visão do projeto, arquitetura, convenções   | projeto, stack            |
| `technical_summary` | Resumo técnico de solução, bug fix, decisão | projeto, domínio, técnico |
| `design_decision`   | Decisão de design ou arquitetura            | projeto, arquitetura      |
| `runbook`           | Procedimento operacional, passo a passo     | projeto, ops, runbook     |

### Nome do documento na base (file_sources)

**Convenção:** `knowledge-{slug-projeto}-{type}-{slug-titulo}.md`

- **slug-projeto:** derivado de `package.json` → `name` ou nome do projeto (lowercase, kebab-case).
- **type:** um dos tipos da tabela acima (ex.: `technical_summary`, `business_rule`).
- **slug-titulo:** título em kebab-case (ex.: `login-oauth2`, `fix-race-condition`.

**Exemplos:** `knowledge-crea-technical_summary-fix-race-condition.md`, `knowledge-crea-business_rule-regra-cancelamento.md`.
