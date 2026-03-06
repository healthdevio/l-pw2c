import { startMcpServer } from "../mcp/server.js";
import type { CommonCommandOptions } from "./types.js";

export async function mcpCommand(options: CommonCommandOptions): Promise<void> {
  await startMcpServer(options.projectDir);
}
