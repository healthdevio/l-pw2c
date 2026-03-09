---
id: ${component_name}
type: [COMPONENT | HOOK | UTILS | DESIGN_DECISION]
scope: [GLOBAL | FEATURE:${domain}]
project: [NOME_DO_PROJETO]
tags: [slug_do_projeto, nextjs15, tailwind, shadcn, typescript]
---

# 🧠 Knowledge Card: ${Name}

## 🎯 Intenção e Problema Resolvido

Explique brevemente **POR QUE** este recurso existe.

- _Exemplo:_ "Componente de tabela com paginação server-side integrada para evitar boilerplate em dashboards."

## 🛠️ Contrato de Reuso (Interface)

O "Coração" do card. Define como invocar sem precisar ler o código-fonte original.

```typescript
// Interface simplificada para o Grafo de Conhecimento
export interface ${Name}Props {
  data: Array<any>;
  isLoading?: boolean;
  onAction?: (id: string) => void;
}
```

## 🚀 Snippet de Implementação Rápida (obrigatório)

Código de exemplo de utilização. Preferência: uso real no projeto → exemplo fornecido pelo dev → exemplo mínimo montado pelo agente.

```typescript
import { ${Name} } from "@/components/custom/${Name}";

export function Example() {
  return <${Name} data={items} onAction={(id) => console.log(id)} />;
}
```

## 🔗 Grafo de Dependências

Lista de entidades relacionadas para o LightRAG criar conexões (edges):

- Base UI: `@/components/ui/table` (Shadcn)
- Hooks: `useDebounce`, `useFetcher`
- Libs: `lucide-react`, `zod`
- Padrão: `SOLID`, `RSC (Server Components)`

## 📍 Localização e Proveniência

- Source Project: [NOME_DO_PROJETO]
- Current Path: `src/components/custom/${Name}.tsx`
- Refactoring Trigger: "Se precisar de ordenação por colunas, promover para `CustomTable`."

## ⚠️ Restrições e Side-Effects

- Não suporta renderização em IE11.
- Requer `Suspense` no nível da página para estados de loading.

---

## Instruções para o agente (não enviar para a base)

O conteúdo **acima** (do primeiro `---` até o fim da seção "Restrições e Side-Effects") é o que deve ser enviado para `mcp_pw2c_knowledge_insert_texts`. Preencha os placeholders e substitua os exemplos pelo conteúdo real. A seção abaixo serve só de referência ao preencher.

### Nome do documento na base

Ao chamar `mcp_pw2c_knowledge_insert_texts`, informe sempre o parâmetro **file_sources** (ou **file_source** em insert de um único texto) com um nome que um humano consiga reconhecer na interface do LightRAG. **Não use o padrão** (ex.: `text_input_1.txt`).

**Convenção:** `knowledge-card-{slug-projeto}-{tipo}-{nome-recurso}.md`

- **slug-projeto:** derivado de `package.json` → `name` (ex.: `crea`).
- **tipo:** `component`, `hook`, `utils` ou `design-decision`.
- **nome-recurso:** nome do componente/hook/utils em kebab-case (ex.: `professional-page-wrapper`, `use-debounce`, `format-date`).

**Exemplos:** `knowledge-card-crea-component-professional-page-wrapper.md`, `knowledge-card-crea-hook-use-debounce.md`, `knowledge-card-crea-utils-format-date.md`.

Assim a base fica fácil de gerenciar pela interface do LightRAG.

### Escopos e tags predefinidos

**Scope (obrigatório):**

| Valor              | Quando usar                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `GLOBAL`           | Recurso em `src/components/custom`, `src/hooks`, `src/core/*` — compartilhado por todo o app. |
| `FEATURE:<domain>` | Recurso em `src/components/features/<domain>`. Ex.: `FEATURE:professional`, `FEATURE:art`.    |

**Tags:** (1) Obrigatório: incluir em `tags` o **slug do projeto** (derivado de `package.json` → `name`; lowercase, sem escopo npm). (2) Recomendado: tags de stack — `nextjs15`, `react19`, `tailwind`, `shadcn`, `typescript`, etc.

### Metadados obrigatórios

| Campo                | Regra (fonte única)                                                                                    | Exemplo                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| **Projeto**          | Sempre `package.json` → `name`. Frontmatter `project` + corpo "Source Project".                        | `crea`, `@s4s/crea-project`                  |
| **Scope**            | `GLOBAL` se recurso em custom/core/hooks; `FEATURE:<domain>` se em `src/components/features/<domain>`. | `GLOBAL`, `FEATURE:professional`             |
| **Tags**             | Primeira tag = slug do projeto (derivado de `project`). Demais = stack aplicável.                      | `["crea", "nextjs15", "tailwind", "shadcn"]` |
| **Stack**            | Texto na Intenção ou Localização (opcional).                                                           | Next.js 15, React 19, Tailwind, Shadcn       |
| **Camada**           | Componentes/hooks/UI = `frontend`. Outros = `backend` se aplicável.                                    | `frontend`                                   |
| **Caminho relativo** | Corpo "Current Path" — caminho relativo ao repo.                                                       | `src/components/custom/CustomTable.tsx`      |

**Snippet de uso:** Preencher na ordem: (1) uso real extraído do projeto; (2) exemplo fornecido pelo dev; (3) exemplo mínimo a partir da interface.
