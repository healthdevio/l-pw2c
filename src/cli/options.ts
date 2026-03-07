import type { Command } from "commander";

import type { CommonCommandOptions } from "../commands/types.js";

export interface RawOptionBag {
  projectDir?: unknown;
  installDir?: unknown;
  stateFile?: unknown;
  json?: unknown;
  all?: unknown;
  installed?: unknown;
  available?: unknown;
  category?: unknown;
}

export function toCommonOptions(options: RawOptionBag): CommonCommandOptions {
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

export function applyCommonOptions(command: Command): Command {
  return command
    .option("--project-dir <path>", "Diretório do projeto alvo")
    .option("--install-dir <path>", "Diretório onde as skills serão instaladas")
    .option("--state-file <path>", "Arquivo de estado das skills instaladas")
    .option("--json", "Retorna o resultado em JSON");
}

export interface InstallCliOptions extends CommonCommandOptions {
  category?: string;
}

export interface UninstallCliOptions extends CommonCommandOptions {
  category?: string;
}

export interface UpdateCliOptions extends CommonCommandOptions {
  all?: boolean;
}

export interface ListCliOptions extends CommonCommandOptions {
  installed?: boolean;
  available?: boolean;
}
