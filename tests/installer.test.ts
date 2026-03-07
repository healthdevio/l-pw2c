import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import { resolvePaths } from "../src/core/config.js";
import {
  installSkill,
  uninstallSkill,
  updateSkill,
} from "../src/core/installer.js";
import { loadState, saveState } from "../src/core/state.js";

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
    const installDir = join(paths.installDir, result.record.id);

    await expect(access(join(installDir, "SKILL.md"))).resolves.toBeUndefined();
    const skillFile = await readFile(join(installDir, "SKILL.md"), "utf8");
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

    expect(removed).toBe(true);
    await expect(access(paths.stateFile)).rejects.toMatchObject({
      code: "ENOENT",
    });
    await expect(access(dirname(paths.stateFile))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("preserva o estado quando ainda existe outra skill registrada", async () => {
    const projectDir = await createTempProject();
    const paths = resolvePaths({ projectDir });

    await installSkill(paths, "example-skill");
    const state = await loadState(paths.stateFile);

    state.installedSkills["another-skill"] = {
      category: "testing",
      id: "another-skill",
      installedAt: new Date().toISOString(),
      version: "0.0.1",
    };
    await saveState(paths.stateFile, state);

    const removed = await uninstallSkill(paths, "example-skill");
    const nextState = await loadState(paths.stateFile);

    expect(removed).toBe(true);
    expect(nextState.installedSkills["another-skill"]?.version).toBe("0.0.1");
    await expect(access(paths.stateFile)).resolves.toBeUndefined();
  });

  it("não apaga o diretório de estado se houver arquivos extras", async () => {
    const projectDir = await createTempProject();
    const paths = resolvePaths({ projectDir });

    await installSkill(paths, "example-skill");
    await writeFile(
      join(dirname(paths.stateFile), "custom-note.txt"),
      "keep me",
    );

    const removed = await uninstallSkill(paths, "example-skill");

    expect(removed).toBe(true);
    await expect(access(paths.stateFile)).rejects.toMatchObject({
      code: "ENOENT",
    });
    await expect(access(dirname(paths.stateFile))).resolves.toBeUndefined();
  });
});
