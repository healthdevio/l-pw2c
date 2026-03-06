#!/usr/bin/env node

import { Command, CommanderError } from "commander";
import { fileURLToPath } from "node:url";

import { getPackageMetadata } from "./core/config.js";
import { mcpCommand } from "./commands/mcp.js";
import { installSkillCommand } from "./commands/skill/install.js";
import { listSkillsCommand } from "./commands/skill/list.js";
import { uninstallSkillCommand } from "./commands/skill/uninstall.js";
import { updateSkillCommand } from "./commands/skill/update.js";
import type { CommandIo, CommonCommandOptions } from "./commands/types.js";
import { formatError } from "./commands/utils.js";

const defaultIo: CommandIo = {
  stdout: (text) => process.stdout.write(text),
  stderr: (text) => process.stderr.write(text),
};

function printJson(io: CommandIo, value: unknown): void {
  io.stdout(`${JSON.stringify(value, null, 2)}\n`);
}

function printSkillList(
  io: CommandIo,
  skills: Awaited<ReturnType<typeof listSkillsCommand>>,
): void {
  if (skills.length === 0) {
    io.stdout("Nenhuma skill encontrada.\n");
    return;
  }

  const lines = skills.map(
    (skill) =>
      `${skill.installed ? "[instalada]" : "[disponível]"} ${skill.id} (${skill.version}) - ${skill.description}`,
  );

  io.stdout(`${lines.join("\n")}\n`);
}

function applyCommonOptions(command: Command): Command {
  return command
    .option("--project-dir <path>", "Diretório do projeto alvo")
    .option("--install-dir <path>", "Diretório onde as skills serão instaladas")
    .option("--state-file <path>", "Arquivo de estado das skills instaladas")
    .option("--json", "Retorna o resultado em JSON");
}

interface RawOptionBag {
  projectDir?: unknown;
  installDir?: unknown;
  stateFile?: unknown;
  json?: unknown;
  all?: unknown;
  installed?: unknown;
  available?: unknown;
}

function toCommonOptions(options: RawOptionBag): CommonCommandOptions {
  return {
    projectDir:
      typeof options.projectDir === "string" ? options.projectDir : undefined,
    installDir:
      typeof options.installDir === "string" ? options.installDir : undefined,
    stateFile:
      typeof options.stateFile === "string" ? options.stateFile : undefined,
    json: options.json === true,
  };
}

type InstallCliOptions = CommonCommandOptions;

type UninstallCliOptions = CommonCommandOptions;

interface UpdateCliOptions extends CommonCommandOptions {
  all?: boolean;
}

interface ListCliOptions extends CommonCommandOptions {
  installed?: boolean;
  available?: boolean;
}

export function createProgram(io: CommandIo = defaultIo): Command {
  const metadata = getPackageMetadata();
  const program = new Command();

  program
    .name(metadata.commandName)
    .description("Gerencia skills da HealthDev e expõe um servidor MCP local.")
    .version(metadata.version)
    .configureOutput({
      writeErr: (text) => io.stderr(text),
      writeOut: (text) => io.stdout(text),
    })
    .exitOverride();

  const skillCommand = program
    .command("skill")
    .description("Gerencia skills locais");

  applyCommonOptions(
    skillCommand
      .command("install")
      .description("Instala uma skill no diretório alvo")
      .argument("<skill>", "Nome da skill")
      .action(async (skill: string, options: InstallCliOptions) => {
        const result = await installSkillCommand(
          skill,
          toCommonOptions(options),
        );

        if (options.json) {
          printJson(io, result);
          return;
        }

        io.stdout(
          `Skill '${result.skillId}' instalada em '${result.installPath}'.\n`,
        );
      }),
  );

  applyCommonOptions(
    skillCommand
      .command("uninstall")
      .description("Remove uma skill instalada")
      .argument("<skill>", "Nome da skill")
      .action(async (skill: string, options: UninstallCliOptions) => {
        const result = await uninstallSkillCommand(
          skill,
          toCommonOptions(options),
        );

        if (options.json) {
          printJson(io, result);
          return;
        }

        io.stdout(
          result.removed
            ? `Skill '${result.skillId}' removida.\n`
            : `Skill '${result.skillId}' não estava instalada.\n`,
        );
      }),
  );

  applyCommonOptions(
    skillCommand
      .command("update")
      .description("Atualiza uma skill instalada ou todas com --all")
      .argument("[skill]", "Nome da skill")
      .option("--all", "Atualiza todas as skills instaladas")
      .action(async (skill: string | undefined, options: UpdateCliOptions) => {
        const result = await updateSkillCommand(skill, {
          ...toCommonOptions(options),
          all: options.all === true,
        });

        if (options.json) {
          printJson(io, result);
          return;
        }

        io.stdout(
          `Skills atualizadas: ${result.updatedSkillIds.join(", ") || "nenhuma"}.\n`,
        );
      }),
  );

  applyCommonOptions(
    skillCommand
      .command("list")
      .description("Lista skills disponíveis ou instaladas")
      .argument("[query]", "Filtro opcional pelo nome, id ou descrição")
      .option("--installed", "Mostra apenas as instaladas")
      .option("--available", "Mostra apenas as não instaladas")
      .action(async (query: string | undefined, options: ListCliOptions) => {
        const result = await listSkillsCommand(query, {
          ...toCommonOptions(options),
          installed: options.installed === true,
          available: options.available === true,
        });

        if (options.json) {
          printJson(io, result);
          return;
        }

        printSkillList(io, result);
      }),
  );

  applyCommonOptions(
    program
      .command("mcp")
      .description("Inicia o servidor MCP local usando stdio")
      .action(async (options: CommonCommandOptions) => {
        await mcpCommand(toCommonOptions(options));
      }),
  );

  return program;
}

export async function runCli(
  argv = process.argv.slice(2),
  io: CommandIo = defaultIo,
): Promise<number> {
  const program = createProgram(io);

  try {
    await program.parseAsync(argv, { from: "user" });
    return 0;
  } catch (error) {
    if (error instanceof CommanderError) {
      if (error.code === "commander.helpDisplayed") {
        return 0;
      }

      if (error.exitCode > 0) {
        return error.exitCode;
      }
    }

    io.stderr(`${formatError(error)}\n`);
    return 1;
  }
}

const isMainModule = process.argv[1]
  ? fileURLToPath(import.meta.url) === process.argv[1]
  : false;

if (isMainModule) {
  void runCli().then((exitCode) => {
    if (exitCode !== 0) {
      process.exitCode = exitCode;
    }
  });
}
