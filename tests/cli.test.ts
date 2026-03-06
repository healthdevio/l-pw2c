import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import { runCli } from "../src/cli.js";

const tempDirectories: string[] = [];

function createIoBuffer(): {
  stderr: string[];
  stdout: string[];
} {
  return {
    stderr: [],
    stdout: [],
  };
}

async function createTempProject(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "l-pw2c-cli-"));
  tempDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    tempDirectories
      .splice(0)
      .map((directory) => rm(directory, { force: true, recursive: true })),
  );
});

describe("cli", () => {
  it("lista skills em json", async () => {
    const ioBuffer = createIoBuffer();
    const exitCode = await runCli(["skill", "list", "--json"], {
      stdout: (text) => ioBuffer.stdout.push(text),
      stderr: (text) => ioBuffer.stderr.push(text),
    });

    expect(exitCode).toBe(0);
    expect(ioBuffer.stderr).toHaveLength(0);
    expect(ioBuffer.stdout.join("")).toContain("example-skill");
  });

  it("instala e remove uma skill usando diretórios temporários", async () => {
    const projectDir = await createTempProject();
    const installIo = createIoBuffer();
    const uninstallIo = createIoBuffer();

    const installExitCode = await runCli(
      ["skill", "install", "example-skill", "--project-dir", projectDir],
      {
        stdout: (text) => installIo.stdout.push(text),
        stderr: (text) => installIo.stderr.push(text),
      },
    );

    const uninstallExitCode = await runCli(
      ["skill", "uninstall", "example-skill", "--project-dir", projectDir],
      {
        stdout: (text) => uninstallIo.stdout.push(text),
        stderr: (text) => uninstallIo.stderr.push(text),
      },
    );

    expect(installExitCode).toBe(0);
    expect(uninstallExitCode).toBe(0);
    expect(installIo.stdout.join("")).toContain("instalada");
    expect(uninstallIo.stdout.join("")).toContain("removida");
  });
});
