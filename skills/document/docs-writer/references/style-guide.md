# Guia de estilo de documentação

## I. Princípios fundamentais

1. **Clareza:** Escreva para facilitar a compreensão. Priorize uma linguagem clara, direta e simples.
2. **Consistência:** Utilize terminologia, formatação e estilo consistentes em toda a documentação.
3. **Precisão:** Garanta que todas as informações estejam tecnicamente corretas e atualizadas.
4. **Acessibilidade:** Projete a documentação para ser utilizável por todos. Foque em estrutura semântica, texto de link claro e alternativas para imagens (alt text).
5. **Público global:** Escreva em português do Brasil. Evite gírias, expressões idiomáticas e referências culturais.
6. **Prescritivo:** Oriente o leitor recomendando ações e caminhos específicos, especialmente para tarefas complexas.

## II. Voz e tom

- **Profissional, porém amigável:** Mantenha um tom prestativo, de quem tem propriedade no assunto e conversacional, sem ser frívolo.
- **Direto:** Vá direto ao ponto. Mantenha os parágrafos curtos e focados.
- **Segunda pessoa:** Dirija-se ao leitor como "você".
- **Tempo presente:** Use o tempo presente para descrever funcionalidades (ex: "A API retorna um objeto JSON.").
- **Evite:** Jargões, gírias, hype de marketing e linguagem excessivamente informal.

## III. Linguagem e gramática

- **Voz ativa:** Prefira a voz ativa em vez da voz passiva.
  - _Exemplo:_ "O sistema envia uma notificação." (Não: "Uma notificação é enviada pelo sistema.")
- **Contrações:** Use contrações comuns (ex: "don't," "it's") para manter um tom natural.
- **Vocabulário simples:** Use palavras comuns. Defina termos técnicos quando necessário.
- **Concisão:** Mantenha as frases curtas e focadas, mas não omita informações úteis.
- **"Por favor":** Evite o uso da palavra "por favor".

## IV. Procedimentos e passos

- Comece cada passo com um verbo no imperativo (ex: "Conecte ao banco de dados").
- Numere os passos sequencialmente.
- Introduza listas de passos com uma frase completa.
- Coloque as condições antes das instruções, não depois.
- Forneça contexto claro de onde a ação ocorre (ex: "No console de administração...").
- Indique passos opcionais claramente (ex: "Opcional: ...").

## V. Formatação e pontuação

- **Text wrap:** Quebre todo o texto em 80 caracteres, com exceção de links longos ou tabelas.
- **Cabeçalhos, títulos e negrito:** Use "sentence case" (apenas a primeira letra da frase em maiúscula). Estruture os cabeçalhos hierarquicamente.
- **Listas:** Use listas numeradas para passos sequenciais e listas com marcadores (bullets) para todas as outras listas. Mantenha os itens da lista com estrutura paralela.
- **Vírgula serial:** Use a vírgula serial (ex: "um, dois, e três").
- **Pontuação:** Use a pontuação padrão americana. Coloque pontos finais dentro das aspas.
- **Datas:** Use formatação de data inequívoca (ex: "22 de janeiro de 2026").

## VI. UI, código e links

- **Elementos de UI:** Coloque elementos de interface de usuário em **negrito**. Foque na tarefa ao discutir a interação.
- **Código:** Use `code font` para nomes de arquivos, snippets de código, comandos e elementos de API. Use blocos de código (code blocks) para exemplos de várias linhas.
- **Links:** Use texto de link descritivo que indique para onde o link leva. Evite "clique aqui".

## VII. Escolha de palavras e terminologia

- **Nomenclatura consistente:** Use nomes de produtos e features de forma consistente.
- **Verbos específicos:** Use verbos precisos.
- **Evite:**
  - Abreviações latinas (ex: use "por exemplo" em vez de "e.g.").
  - Nomes de placeholder como "foo" e "bar" em exemplos; use nomes significativos em vez disso.
  - Antropomorfismo (ex: "O servidor acha...").
  - "Should" (deveria): Seja claro sobre requisitos ("must") vs. recomendações ("recomendamos").

## VIII. Arquivos e mídia

- **Nomes de arquivos:** Use letras minúsculas, separe as palavras com hífens (-) e use caracteres ASCII padrão.
- **Imagens:** Forneça texto alternativo (alt text) descritivo para todas as imagens. Forneça imagens de alta resolução ou vetoriais quando praticável.

## IX. Check rápido de acessibilidade

- Forneça alt text descritivo para imagens.
- Garanta que o texto do link faça sentido fora de contexto.
- Use elementos HTML semânticos corretamente (cabeçalhos, listas, tabelas).
