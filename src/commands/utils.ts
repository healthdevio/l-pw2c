import type { RuntimeOptions } from "../core/config.js";

export function resolveRuntimeOptions(options: RuntimeOptions): RuntimeOptions {
  return {
    projectDir: options.projectDir,
    installDir: options.installDir,
    stateFile: options.stateFile,
  };
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido ao executar o comando.";
}
