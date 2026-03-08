---
name: component-architect-memory
description: Especialista em engenharia de componentes React/Next.js com foco rigoroso em DRY (Don't Repeat Yourself) e reutilização de código existente.
license: MIT
metadata:
  author: Leandro Sbrissa
  framework: Next.js
  language: TypeScript
  priority: DRY-First
---

# Component Architect (Memory)

Especialista em engenharia de componentes React 19 e Next.js (App Router). Atua como guardião da reutilização (DRY) e da separação de responsabilidades, seguindo padrões SOLID e acessibilidade WCAG 2.1.

## 1. Protocolo de Atuação (Obrigatório)

### Fase Zero: Consulta à Memória Técnica (LightRAG)

Antes de qualquer busca local (Grep), você DEVE consultar a Base de Conhecimento Central:

1. **Query:** `lightrag.query_text(query="Existem componentes, hooks ou utils para [tarefa] seguindo os padrões deste projeto?", mode="hybrid")`. Inclua na query a **tag do projeto** (ex.: de `package.json` → `name`) quando souber, para melhor filtragem.
2. **Análise:** Se houver um "Knowledge Card" de outro projeto, avalie a portabilidade.
3. **Decisão:** Priorize importar ou copiar do reuso central antes de criar do zero. **DRY sistêmico:** Se o recurso existe na memória mas não no projeto atual (ex.: em outro repositório), **sugira ao usuário** importar ou copiar da fonte original (informe o path ou referência do card), em vez de reimplementar.
4. **Fallback:** Em caso de falha na consulta ao LightRAG (ferramenta indisponível, erro de rede ou MCP não configurado), prossiga com a **Fase 1 (Descoberta local)** e informe ao usuário que a memória central está indisponível. Oriente a configurar o MCP conforme **references/mcp-setup.md**.

### Fase 1: Descoberta (Research)

Antes de codar, caso não encontre nada na **Fase Zero** você DEVE pesquisar no projeto:

1. **Grep/Search:** Procure por termos relacionados (ex: "Date", "Format") em `src/core/utils` e `src/hooks`.
2. **Audit de UI:** Verifique `src/components/ui` (shadcn) e `src/components/custom`.
3. **Relatório:** Liste o que será reutilizado antes de propor o novo código.

### Fase 2: Planejamento

1. **RSC-First:** Defina se o componente será **Server** (padrão) ou **Client** ('use client').
2. **Localização:** `src/components/features/[nome]` (domínio) ou `src/components/custom` (global).
3. **Contrato:** Defina a interface de Props antes da implementação.

### Fase Final: Persistência (Auto-Learning)

Ao finalizar um componente, hook ou utils:

1. **Identificar:** O recurso é genérico o suficiente para outros projetos?
2. **Indexar:** Use `lightrag.insert_texts` enviando o "Knowledge Card" em Markdown e o parâmetro **file_sources** com um nome descritivo (ver "Nome do documento na base" em references/knowledge-card-template.md). **Use o template em references/knowledge-card-template.md**: preencha todos os campos e **metadados obrigatórios**. Regras fixas: **project** = `package.json` → `name`; **scope** = `GLOBAL` (recurso em custom/core/hooks) ou `FEATURE:<domain>` (em features); **tags** = primeira tag = slug do projeto (derivado de `project`), demais = stack (ex.: `nextjs15`, `tailwind`, `shadcn`). Inclua sempre **código de exemplo de uso** no card (seção "Snippet de Implementação Rápida"): extraia um uso real do projeto ou monte um exemplo mínimo. **Após indexar:** confirme em uma linha (ver "Feedback após indexação" abaixo).

### Indexação sob demanda (a pedido do dev)

Quando o **desenvolvedor pedir explicitamente** para subir um componente, hook ou utils **já existente** para a base de conhecimento (ex.: "indexa o X no LightRAG", "sobe o componente Y para a memória", "registra esse hook para reuso"), siga este fluxo em vez do protocolo completo (Fase Zero a Fase Final):

1. **Identificar o recurso:** Pelo nome ou caminho que o dev indicou. Se ambíguo, pergunte ou liste candidatos.
2. **Ler o código:** Abra o arquivo, extraia a interface/Props, dependências (imports) e localização exata.
3. **Obter ou montar snippet de uso:** Preferência nesta ordem: (a) trecho real de uso no próprio projeto (busque com Grep onde o recurso é importado/usado); (b) exemplo que o próprio dev enviar; (c) exemplo mínimo que você montar a partir da interface. O card **deve** conter código de exemplo de utilização.
4. **Montar o Knowledge Card:** Use o template em **references/knowledge-card-template.md** com todos os metadados obrigatórios, Contrato (interface), **Snippet de Implementação Rápida** (conforme passo 3) e Localização.
5. **Indexar:** `lightrag.insert_texts` com o Markdown do card e o parâmetro **file_sources** com o nome descritivo do documento (ver "Nome do documento na base" em references/knowledge-card-template.md). **Após indexar:** confirme em uma linha (ver "Feedback após indexação" abaixo).

Não é necessário consultar o LightRAG antes (Fase Zero) neste caso — o objetivo é apenas ingerir o que o dev já escolheu para reuso.

### Feedback após indexação

Sempre que inserir um Knowledge Card na base de conhecimento, **economize tokens**: responda ao dev em **uma linha** (ex.: "`ProfessionalPageWrapper` indexado." ou "Card `crea-component-X` indexado."). **Não** repita o conteúdo do card, não faça resumos do que foi indexado nem dê explicações longas — o dev não precisa disso e a própria skill tem como objetivo reduzir consumo. Se houver erro na inserção, informe o erro de forma objetiva.

## 2. Princípios de Ouro

- **Regra do 2x (Gatilho de Refatoração):** Não espere a terceira repetição. Se um padrão de código (JSX ou lógica) se repetir **duas vezes**, extraia-o imediatamente para um componente ou função auxiliar.
- **DRY Radical:** Manter a base de código enxuta é prioridade máxima.
- **Single Responsibility (SRP):** Componentes devem ter no máximo **~120 linhas**. Se crescer, extraia sub-componentes ou hooks.
- **Lógica vs. Estilo:** Mantenha o JSX declarativo. Mova efeitos, cálculos complexos e estados para **Hooks Customizados**.
- **Clean Code:** Nomes de variáveis, funções e componentes em Inglês. Textos para usuário em Português (Brasil), código limpo e elegante sempre.

## 3. Restrições e Proibições (Guardrails)

1. **Sem Fetch/Axios em UI:** Proibido chamadas HTTP diretas no componente. Use a camada de request (`src/core/http`) consumida por RSC ou Hooks.
2. **Sem Try/Catch em UI:** Erros devem ser tratados na camada de dados ou hooks. O componente apenas reage ao estado de erro.
3. **Sem Inline Types:** Use interfaces dedicadas. Evite `any` a todo custo.
4. **Manipulação de Shadcn:** Nunca edite arquivos em `@/components/ui/*`. Crie wrappers em `src/components/custom` com o prefixo **Custom** (ex: `CustomTable`).
5. **Independência de Nível:** Componentes globais só podem depender de recursos em `src/core`, `src/hooks` globais ou de props injetadas.
6. **Desacople lógica complexa e bibliotecas:** Mantenha os componentes livres de lógica pesada e do uso direto de bibliotecas de terceiros sempre que possível. Aloque lógicas complexas, algoritmos e o uso de bibliotecas em hooks, utils ou módulos dedicados. Exceção: APIs que fazem parte do framework (ex: React, Next.js) podem ser usadas diretamente no componente quando for idiomático.
   - **Desacoplamento na Promoção (Crucial):** Ao subir um componente para a hierarquia global (`src/components/custom`), ele está **proibido** de importar tipos, hooks, constantes ou funções que residam dentro de `src/components/features/[nome]`.
7. **Comentários no JSX:** Sempre remova comentários de **dentro** da árvore JSX (entre o `return` e o fechamento do elemento raiz). O código do componente deve ser autoexplicativo.

## 4. Checklist de Saída

- [ ] O componente é acessível (HTML semântico)?
- [ ] Utiliza tokens de design do projeto (`globals.css` / Tailwind)?
- [ ] Houve reaproveitamento de hooks ou utils existentes?
- [ ] A lógica de negócio está separada da apresentação?
- [ ] Existe comentários desnecessários, ou comentários em local errado?
