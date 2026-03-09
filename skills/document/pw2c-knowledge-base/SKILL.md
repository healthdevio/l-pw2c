---
name: pw2c-knowledge-base
description: Consulta e envia conhecimento à base PW2C (LightRAG). Use ao planejar, antes de codar, ao resolver bugs/tarefas complexas ou quando o usuário pedir para consultar/indexar a base.
---

# Base de Conhecimento PW2C

Orientação para consultar e alimentar a base de conhecimento central (LightRAG) com economia de tokens. Ferramentas MCP: `mcp_pw2c_knowledge_query_text`, `mcp_pw2c_knowledge_insert_text`, `mcp_pw2c_knowledge_insert_texts`.

## 1. Consulta antes de planejar/codar

Ao elaborar um **planejamento** ou **antes de criar código**:

1. Chamar `mcp_pw2c_knowledge_query_text` com `query` em português (termos técnicos em inglês), `mode="hybrid"`.
2. Usar o resultado para evitar reexplicar o que já está na base e para basear o plano.
3. Resposta ao usuário: curta (uma linha quando for só confirmação).

## 2. Envio para a base

- **Template:** [references/doc-template.md](references/doc-template.md). Frontmatter obrigatório: `type`, `project`, `domain` (opcional), `tags`. Corpo em Markdown: português, termos técnicos em inglês.
- **file_sources:** Nome legível e único (ex.: `knowledge-{slug-projeto}-{type}-{slug-titulo}.md`).
- **Ferramenta:** `mcp_pw2c_knowledge_insert_text` (um texto) ou `mcp_pw2c_knowledge_insert_texts` (vários).
- **Após indexar:** Confirmar em **uma linha** (ex.: "Resumo técnico X indexado."). Em erro: mensagem objetiva. Não repetir conteúdo indexado.

## 3. Pergunta ao DEV

Ao **final** de (a) tarefa complexa, (b) resolução de bug, (c) problema crítico:

- Perguntar de forma objetiva: "Quer que eu envie um resumo técnico detalhado para a base de conhecimento para outros agentes e devs?"
- Se sim: produzir o resumo pelo template (tipo `technical_summary` ou outro adequado), indexar com `mcp_pw2c_knowledge_insert_text`/`mcp_pw2c_knowledge_insert_texts` e confirmar em uma linha.

## 4. Idioma

Texto em **português**. Manter conceitos técnicos, nomes de APIs, ferramentas e termos de domínio em **inglês** (ou como usualmente referidos).

## 5. Fallback MCP

Se a consulta/inserção falhar ou as ferramentas não estiverem disponíveis: orientar configuração conforme `./references/mcp-setup.md` e seguir sem base (não travar o fluxo).

## 6. Componentes/hooks/utils React

Para indexar componentes, hooks ou utils React, use a skill **component-architect-memory** e seu template de Knowledge Card em `skills/frontend/component-architect-memory/references/knowledge-card-template.md`.
