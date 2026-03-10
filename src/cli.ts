#!/usr/bin/env node

import { fileURLToPath } from "node:url";

import { createProgram, runCli } from "./cli/program.js";

export { createProgram, runCli };

const scriptPath = fileURLToPath(import.meta.url);

if (
  process.env.LPW2C_DEBUG === "1" ||
  process.env.LPW2C_DEBUG?.toLowerCase() === "true"
) {
  // Ajuda a diagnosticar problemas de invocação em ambientes diferentes (Windows, macOS, etc.).
  // Em versões anteriores, uma comparação rígida entre esse caminho e process.argv[1]
  // impedia a CLI de rodar em alguns ambientes.
  // Mantemos apenas o log em modo debug para futura investigação, sem bloquear a execução.

  console.error(
    `[l-pw2c][debug] entrypoint loaded\n` +
      `  scriptPath: ${scriptPath}\n` +
      `  argv[0]: ${process.argv[0]}\n` +
      `  argv[1]: ${process.argv[1]}\n`,
  );
}

void runCli().then((exitCode) => {
  if (exitCode !== 0) {
    process.exitCode = exitCode;
  }
});
