import { Command, CommanderError } from "commander";

import { getPackageMetadata } from "../core/config.js";
import { mcpCommand } from "../commands/mcp.js";
import type { CommandIo } from "../commands/types.js";
import { formatError } from "../commands/utils.js";
import {
  applyCommonOptions,
  toCommonOptions,
  type RawOptionBag,
} from "./options.js";
import { registerSkillCommand } from "./skill.js";

export const defaultIo: CommandIo = {
  stdout: (text) => process.stdout.write(text),
  stderr: (text) => process.stderr.write(text),
};

function isDebugEnabled(): boolean {
  const value = process.env.LPW2C_DEBUG;
  if (!value) {
    return false;
  }

  return value === "1" || value.toLowerCase() === "true";
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

  registerSkillCommand(program, io);

  applyCommonOptions(
    program
      .command("mcp")
      .description("Inicia o servidor MCP local usando stdio")
      .action(async (options: RawOptionBag) => {
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
    if (isDebugEnabled()) {
      const details =
        error instanceof Error
          ? (error.stack ?? error.message)
          : JSON.stringify(error);

      io.stderr(
        `[l-pw2c][debug] command failed\n` +
          `  platform: ${process.platform}\n` +
          `  argv: ${JSON.stringify(argv)}\n` +
          `  error: ${details}\n`,
      );
    }

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
