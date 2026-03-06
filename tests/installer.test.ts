import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import { resolvePaths } from "../src/core/config.js";
import {
  installSkill,
  uninstallSkill,
  updateSkill,
} from "../src/core/installer.js";
import { loadState } from "../src/core/state.js";

const tempDirectories: string[] = [];

async function createTempProject(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "l-pw2c-"));
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

describe("installer", () => {
  it("instala a skill no diretório padrão do projeto", async () => {
    const projectDir = await createTempProject();
    const paths = resolvePaths({ projectDir });

    const result = await installSkill(paths, "example-skill");

    await expect(
      access(join(result.record.installPath, "SKILL.md")),
    ).resolves.toBeUndefined();
    const skillFile = await readFile(
      join(result.record.installPath, "SKILL.md"),
      "utf8",
    );
    expect(skillFile).toContain("Example Skill");

    const state = await loadState(paths.stateFile);
    expect(state.installedSkills["example-skill"]?.version).toBe("0.1.0");
  });

  it("atualiza uma skill já instalada", async () => {
    const projectDir = await createTempProject();
    const paths = resolvePaths({ projectDir });

    await installSkill(paths, "example-skill");
    const result = await updateSkill(paths, "example-skill");

    expect(result.record.id).toBe("example-skill");
  });

  it("remove a skill instalada e limpa o estado", async () => {
    const projectDir = await createTempProject();
    const paths = resolvePaths({ projectDir });

    await installSkill(paths, "example-skill");
    const removed = await uninstallSkill(paths, "example-skill");
    const state = await loadState(paths.stateFile);

    expect(removed).toBe(true);
    expect(state.installedSkills["example-skill"]).toBeUndefined();
  });
});
