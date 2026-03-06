import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { getPackageMetadata, resolvePaths } from "../core/config.js";
import {
  getSkillDescriptor,
  getSkillEntryPath,
  listSkillDescriptors,
  searchSkills,
} from "../core/registry.js";

async function collectDirectoryListing(
  directoryPath: string,
): Promise<string[]> {
  const entries = await readdir(directoryPath, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      relative(directoryPath, join(entry.parentPath, entry.name)).replaceAll(
        "\\",
        "/",
      ),
    )
    .sort();
}

export function createMcpServer(projectDir?: string): McpServer {
  const metadata = getPackageMetadata();
  const paths = resolvePaths({ projectDir });
  const server = new McpServer({
    name: metadata.packageName,
    version: metadata.version,
  });

  server.registerTool(
    "search_skills",
    {
      description: "Busca skills pelo catálogo local.",
      inputSchema: {
        query: z.string().optional(),
      },
    },
    async ({ query }) => {
      const skills = await searchSkills(paths.registryFile, query);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              skills.map(({ entry, manifest }) => ({
                id: entry.id,
                name: entry.name,
                version: entry.version,
                category: entry.category,
                description: entry.description,
                tags: manifest.tags,
              })),
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "read_skill",
    {
      description: "Retorna o manifesto e o conteúdo principal de uma skill.",
      inputSchema: {
        skillId: z.string().min(1),
      },
    },
    async ({ skillId }) => {
      const descriptor = await getSkillDescriptor(paths.registryFile, skillId);
      const skillMarkdown = await readFile(
        getSkillEntryPath(descriptor),
        "utf8",
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                manifest: descriptor.manifest,
                skillMarkdown,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "fetch_skill_files",
    {
      description: "Lista ou lê arquivos de uma skill específica.",
      inputSchema: {
        skillId: z.string().min(1),
        mode: z.enum(["list", "all"]).default("list"),
      },
    },
    async ({ skillId, mode }) => {
      const descriptor = await getSkillDescriptor(paths.registryFile, skillId);
      const files = await collectDirectoryListing(descriptor.sourceDir);

      if (mode === "list") {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ files }, null, 2),
            },
          ],
        };
      }

      const contents = await Promise.all(
        files.map(async (relativePath) => ({
          path: relativePath,
          content: await readFile(
            join(descriptor.sourceDir, relativePath),
            "utf8",
          ),
        })),
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ files: contents }, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "list_skills",
    {
      description: "Lista todas as skills do catálogo local.",
    },
    async () => {
      const descriptors = await listSkillDescriptors(paths.registryFile);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              descriptors.map(({ entry }) => entry),
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  return server;
}

export async function startMcpServer(projectDir?: string): Promise<void> {
  const server = createMcpServer(projectDir);
  const transport = new StdioServerTransport();

  await server.connect(transport);
}
