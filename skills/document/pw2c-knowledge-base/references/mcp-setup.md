# Configuração MCP

Para esta skill funcionar (consulta e ingestão no LightRAG), o usuário precisa configurar os servidores MCP no cliente (ex.: Cursor). **Quando a consulta ao LightRAG falhar ou as ferramentas `mcp_pw2c_knowledge_*` não estiverem disponíveis**, oriente o usuário a configurar conforme este arquivo e indique a documentação.

**Onde configurar:** arquivo de configuração MCP do cliente (ex.: `.cursor/mcp.json` ou configuração global do Cursor).

**Exemplo de configuração:**

```json
{
  "mcpServers": {
    "pw2c_knowledge": {
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
