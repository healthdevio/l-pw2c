# Configuração MCP (Component Architect Memory)

Para esta skill funcionar (consulta e ingestão no LightRAG + uso do Shadcn MCP), o usuário precisa configurar os servidores MCP no cliente (ex.: Cursor). **Quando a consulta ao LightRAG falhar ou as ferramentas `lightrag.*` não estiverem disponíveis**, oriente o usuário a configurar conforme este arquivo e indique a documentação completa em `docs/skill-plan/readme.md`.

**Onde configurar:** arquivo de configuração MCP do cliente (ex.: `.cursor/mcp.json` ou configuração global do Cursor).

**Exemplo de configuração:**

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    },
    "lightrag-mcp": {
      "command": "npx",
      "args": ["@g99/lightrag-mcp-server"],
      "env": {
        "LIGHTRAG_SERVER_URL": "https://lightrag-dev-mcp.docuscan.com.br",
        "LIGHTRAG_API_KEY": "<api_key_here>"
      }
    }
  }
}
```
