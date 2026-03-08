# Referência Técnica: Component Architect (Memory)

## 🗺️ Estrutura do Projeto (Aliasing: `@/`)

| Caminho                           | Descrição                                                                             |
| :-------------------------------- | :------------------------------------------------------------------------------------ |
| `src/app/`                        | Rotas, Layouts e Páginas (Next.js 15).                                                |
| `src/components/features/[name]/` | **Componentes de domínio:** Componentes (e subcomponentes) específicos de um domínio. |
| `src/components/ui/`              | Componentes atômicos base (Shadcn). Não alterar.                                      |
| `src/components/custom/`          | Componentes globais reutilizáveis e wrappers do Shadcn.                               |
| `src/hooks/`                      | Hooks utilitários globais (ex: `useBoolean`, `useDebounce`, `useFetcher`).            |
| `src/core/utils/`                 | Funções puras, formatadores e validadores.                                            |
| `src/core/models/`                | DTOs, Interfaces de API e Enums.                                                      |
| `src/core/http/`                  | Instâncias de API e definições de requests.                                           |

---

## 🛠️ Padrões de Implementação

### Componentes (React 19)

- **Declaração:** Preferir `export function Name() {}` (Named Exports).
- **Carregamento:** utilizar Loadings ou Skeletons para carregamento assíncrono.
- **Estilização:** Tailwind CSS com `cn()` para merge de classes.
- **Condicionais:** Evitar lógicas complexas no `return`. Compute variáveis antes ou use sub-componentes.
- **Acessibilidade:** Uso rigoroso de HTML semântico. Atributos ARIA apenas se necessário.

### Performance & Next.js 15

- **Suspense:** Utilizar Skeletons para estados de carregamento em rotas assíncronas.
- **Imagens:** Uso obrigatório de `next/image` com `priority` ou `sizes` definidos.

### Nomenclatura

- **Componentes:** `PascalCase` (ex: `UserTable.tsx`).
- **Hooks:** `camelCase` com prefixo `use` (ex: `useUserFilters.ts`).
- **Pastas:** `kebab-case`.
- **Wrappers:** Prefixar com `Custom` para extensões de UI (ex: `CustomButton`).

## 🛠️ Organização de Auxiliares e Sub-componentes

Ao aplicar a **Regra do 2x**, siga esta organização de arquivos:

### 1. Componentes Auxiliares (UI)

- **Local:** Se o auxiliar é usado apenas por um componente, ele fica na mesma pasta ou em uma subpasta `./components/` (ex: `UserCard/components/CardHeader.tsx`).
- **Privacidade:** Componentes dentro de `src/components/features/[name]/` são privados àquele domínio.

### 2. Funções Auxiliares (Lógica)

- **Local:** Se a lógica é específica, crie um arquivo de utils local (ex: `UserCard/utils.ts` ou `UserCard/hooks/useCardLogic.ts`).

## 🚀 Fluxo de Promoção (Subida de Hierarquia)

Quando um recurso precisa ser reaproveitado fora de seu contexto original, o agente deve seguir este protocolo:

| De (Origem)                               | Para (Destino)           | Critério de Promoção                                                                 |
| :---------------------------------------- | :----------------------- | :----------------------------------------------------------------------------------- |
| `src/components/features/[name]/`         | `src/components/custom/` | Quando 2 ou mais domínios diferentes precisam do mesmo componente de UI.             |
| `src/components/features/[name]/hooks/`   | `src/hooks/`             | Quando a lógica de estado/efeito é genérica o suficiente para qualquer parte do app. |
| `src/components/features/[name]/utils.ts` | `src/core/utils/`        | Quando a função é puramente lógica (ex: formatação) e útil globalmente.              |

### Como Promover

1. **Mover o arquivo:** Relocar para a pasta global correspondente.
2. **Generalizar:** Remover termos específicos do domínio do nome da função/componente e das props.
3. **Prefixar (UI):** Se for um componente de UI que estende o Shadcn, adicionar o prefixo `Custom`.
4. **Atualizar Imports:** O agente deve realizar o "find and replace" de todos os imports antigos para o novo alias `@/...`.

### Regras e Restrições

- **Desacoplamento na Promoção (Crucial):** Atenção! Ao subir um componente para a hierarquia global (`src/components/custom`), ele está **proibido** de importar tipos, hooks, constantes ou funções que residam dentro de `src/components/features/[name]`.

---

## 📋 Ferramentas de Auditoria

- **Zod:** Validação de esquemas e contratos.
- **Lucide React:** Biblioteca padrão de ícones.
- **Axe-core:** Referência para acessibilidade.
