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

  describe("install por categoria", () => {
    it("instala todas as skills da categoria com --category", async () => {
      const projectDir = await createTempProject();
      const io = createIoBuffer();

      const exitCode = await runCli(
        [
          "skill",
          "install",
          "--category",
          "testing",
          "--project-dir",
          projectDir,
        ],
        {
          stdout: (text) => io.stdout.push(text),
          stderr: (text) => io.stderr.push(text),
        },
      );

      expect(exitCode).toBe(0);
      expect(io.stderr).toHaveLength(0);
      const out = io.stdout.join("");
      expect(out).toContain("testing");
      expect(out).toContain("example-skill");
      expect(out).toContain("instalada");
    });

    it("retorna mensagem quando a categoria não tem skills", async () => {
      const projectDir = await createTempProject();
      const io = createIoBuffer();

      const exitCode = await runCli(
        [
          "skill",
          "install",
          "--category",
          "categoria-inexistente",
          "--project-dir",
          projectDir,
        ],
        {
          stdout: (text) => io.stdout.push(text),
          stderr: (text) => io.stderr.push(text),
        },
      );

      expect(exitCode).toBe(0);
      expect(io.stderr).toHaveLength(0);
      expect(io.stdout.join("")).toContain("Nenhuma skill na categoria");
      expect(io.stdout.join("")).toContain("categoria-inexistente");
    });

    it("retorna JSON com category e results ao usar --category e --json", async () => {
      const projectDir = await createTempProject();
      const io = createIoBuffer();

      const exitCode = await runCli(
        [
          "skill",
          "install",
          "--category",
          "frontend",
          "--project-dir",
          projectDir,
          "--json",
        ],
        {
          stdout: (text) => io.stdout.push(text),
          stderr: (text) => io.stderr.push(text),
        },
      );

      expect(exitCode).toBe(0);
      expect(io.stderr).toHaveLength(0);
      const data = JSON.parse(io.stdout.join("")) as {
        category: string;
        results: Array<{
          skillId: string;
          version: string;
          installPath: string;
        }>;
      };
      expect(data.category).toBe("frontend");
      expect(Array.isArray(data.results)).toBe(true);
      expect(data.results.length).toBeGreaterThan(0);
      expect(data.results[0]).toHaveProperty("skillId");
      expect(data.results[0]).toHaveProperty("installPath");
    });
  });

  describe("uninstall por categoria", () => {
    it("remove todas as skills instaladas da categoria com --category", async () => {
      const projectDir = await createTempProject();
      const installIo = createIoBuffer();
      const uninstallIo = createIoBuffer();

      await runCli(
        [
          "skill",
          "install",
          "--category",
          "testing",
          "--project-dir",
          projectDir,
        ],
        {
          stdout: (text) => installIo.stdout.push(text),
          stderr: (text) => installIo.stderr.push(text),
        },
      );

      const uninstallExitCode = await runCli(
        [
          "skill",
          "uninstall",
          "--category",
          "testing",
          "--project-dir",
          projectDir,
        ],
        {
          stdout: (text) => uninstallIo.stdout.push(text),
          stderr: (text) => uninstallIo.stderr.push(text),
        },
      );

      expect(uninstallExitCode).toBe(0);
      expect(uninstallIo.stderr).toHaveLength(0);
      const out = uninstallIo.stdout.join("");
      expect(out).toContain("testing");
      expect(out).toContain("example-skill");
      expect(out).toContain("removida");
    });

    it("retorna mensagem quando não há skills instaladas na categoria", async () => {
      const projectDir = await createTempProject();
      const io = createIoBuffer();

      const exitCode = await runCli(
        [
          "skill",
          "uninstall",
          "--category",
          "frontend",
          "--project-dir",
          projectDir,
        ],
        {
          stdout: (text) => io.stdout.push(text),
          stderr: (text) => io.stderr.push(text),
        },
      );

      expect(exitCode).toBe(0);
      expect(io.stderr).toHaveLength(0);
      expect(io.stdout.join("")).toContain(
        "Nenhuma skill instalada na categoria",
      );
      expect(io.stdout.join("")).toContain("frontend");
    });

    it("retorna JSON com category e results ao usar --category e --json", async () => {
      const projectDir = await createTempProject();
      const io = createIoBuffer();

      await runCli(
        [
          "skill",
          "install",
          "--category",
          "document",
          "--project-dir",
          projectDir,
        ],
        { stdout: () => {}, stderr: () => {} },
      );

      const exitCode = await runCli(
        [
          "skill",
          "uninstall",
          "--category",
          "document",
          "--project-dir",
          projectDir,
          "--json",
        ],
        {
          stdout: (text) => io.stdout.push(text),
          stderr: (text) => io.stderr.push(text),
        },
      );

      expect(exitCode).toBe(0);
      expect(io.stderr).toHaveLength(0);
      const data = JSON.parse(io.stdout.join("")) as {
        category: string;
        results: Array<{ skillId: string; removed: boolean }>;
      };
      expect(data.category).toBe("document");
      expect(Array.isArray(data.results)).toBe(true);
      expect(data.results.length).toBeGreaterThan(0);
      expect(data.results[0]).toHaveProperty("skillId");
      expect(data.results[0]).toHaveProperty("removed");
    });
  });
});
