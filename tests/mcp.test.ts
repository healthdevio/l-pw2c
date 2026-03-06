import { afterEach, describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

import { createMcpServer } from "../src/mcp/server.js";

const cleanupTasks: Array<() => Promise<void>> = [];

interface TestMcpServer {
  close: () => Promise<void>;
  connect: (transport: Transport) => Promise<void>;
}

afterEach(async () => {
  while (cleanupTasks.length > 0) {
    const task = cleanupTasks.pop();
    if (task) {
      await task();
    }
  }
});

describe("mcp server", () => {
  it("expõe as ferramentas principais do catálogo", async () => {
    const server = createMcpServer() as TestMcpServer;
    const client = new Client({
      name: "l-pw2c-test-client",
      version: "0.1.0",
    });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    cleanupTasks.push(async () => {
      await Promise.all([
        server.close(),
        clientTransport.close(),
        serverTransport.close(),
      ]);
    });

    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);

    const tools = await client.listTools();
    const searchResult = await client.callTool({
      name: "search_skills",
      arguments: {
        query: "example",
      },
    });

    expect(tools.tools.map((tool) => tool.name)).toEqual(
      expect.arrayContaining([
        "search_skills",
        "read_skill",
        "fetch_skill_files",
      ]),
    );
    expect(JSON.stringify(searchResult)).toContain("example-skill");
  });
});
