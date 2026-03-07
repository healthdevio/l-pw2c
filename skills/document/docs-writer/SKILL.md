---
name: docs-writer
description: Escreva, revise e edite arquivos de documentação com estrutura, tom e precisão técnica consistentes. Use ao criar documentos, revisar arquivos Markdown, escrever arquivos README, atualizar diretórios `/docs` ou quando o usuário disser "escrever documentação", "revisar este documento", "melhorar este README", "criar um guia" ou "editar Markdown". NÃO use para comentários de código, JSDoc embutido ou geração de referências de API.
---

# Instruções de habilidade `docs-writer`

Como redator técnico e editor especialista, seu objetivo é produzir e refinar documentações que sejam precisas, claras, consistentes e fáceis de entender para os usuários. Você deve aderir ao processo de contribuição de documentação descrito em `CONTRIBUTING.md`.

## Passo 1: Compreenda o objetivo e crie um plano

1. **Esclareça a solicitação:** Compreenda totalmente a solicitação de documentação do usuário. Identifique a feature principal, comando ou conceito que precisa de trabalho.
2. **Diferencie a tarefa:** Determine se a solicitação é primariamente para **writing** (escrita) de novo conteúdo ou **editing** (edição) de conteúdo existente. Se a solicitação for ambígua (ex: "corrija a doc"), peça esclarecimentos ao usuário.
3. **Formule um plano:** Crie um plano claro, passo a passo, para as alterações necessárias.

## Passo 2: Investigue e colete informações

1. **Leia o código:** Examine detalhadamente o codebase relevante, principalmente dentro dos diretórios `packages/` ou `src/`, para garantir que seu trabalho seja respaldado pela implementação e para identificar quaisquer lacunas.
2. **Identifique arquivos:** Localize os arquivos de documentação específicos no diretório `docs/` que precisam ser modificados. Sempre leia a versão mais recente de um arquivo antes de iniciar o trabalho.
3. **Verifique conexões:** Considere documentações relacionadas. Se você alterar o comportamento de um comando, verifique outras páginas que o referenciam. Se adicionar uma nova página, verifique se o `docs/sidebar.json` precisa ser atualizado. Certifique-se de que todos os links estejam atualizados.

## Passo 3: Escreva ou edite a documentação

1. **Siga o style guide:** Adira às regras em `references/style-guide.md`. Leia este arquivo para entender os padrões de documentação do projeto.
2. Garanta que a nova documentação reflita com precisão as features no código.
3. **Use `replace` e `write_file`:** Use ferramentas de file system para aplicar as alterações planejadas. Para pequenas edições, o `replace` é preferido. Para novos arquivos ou grandes reformulações (rewrites), o `write_file` é mais apropriado.

### Sub-passo: Editando documentação existente (conforme esclarecido no Passo 1)

- **Gaps:** Identifique áreas onde a documentação está incompleta ou não reflete mais o código existente.
- **Tone:** Garanta que o tom seja ativo e engajador, não passivo.
- **Clarity:** Corrija redações confusas, ortografia e gramática. Reformule frases para torná-las mais fáceis de entender para os usuários.
- **Consistency:** Verifique a consistência da terminologia e do estilo em todos os documentos editados.

## Passo 4: Verifique e finalize

1. **Revise seu trabalho:** Após fazer as alterações, releia os arquivos para garantir que a documentação esteja bem formatada e que o conteúdo esteja correto com base no código existente.
2. **Verificação de links:** Verifique a validade de todos os links no novo conteúdo. Verifique a validade dos links existentes que levam à página com o novo conteúdo ou conteúdo excluído.
3. **Ofereça a execução do npm format:** Assim que todas as alterações estiverem concluídas, ofereça a execução do script de formatação do projeto para garantir a consistência, propondo o comando: `npm run format`
