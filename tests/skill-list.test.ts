import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { listSkillsCommand } from "../src/commands/skill/list.js";
import { resolvePaths } from "../src/core/config.js";
import { saveState } from "../src/core/state.js";
import type { SkillState } from "../src/core/types.js";

function createTempProjectDir(): string {
  return mkdtempSync(join(tmpdir(), "l-pw2c-skill-list-"));
}

function removeTempProjectDir(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}

describe("listSkillsCommand", () => {
  it("lista todas as skills do registry quando não há estado", async () => {
    const projectDir = createTempProjectDir();

    try {
      const skills = await listSkillsCommand(undefined, {
        projectDir,
      });

      expect(skills.length).toBeGreaterThan(0);
      expect(skills.some((skill) => skill.id === "example-skill")).toBe(true);
      expect(skills.every((skill) => skill.installed === false)).toBe(true);
    } finally {
      removeTempProjectDir(projectDir);
    }
  });

  it("marca skills instaladas corretamente com base no state.json", async () => {
    const projectDir = createTempProjectDir();

    try {
      const paths = resolvePaths({ projectDir });

      const state: SkillState = {
        version: 1,
        installedSkills: {
          "example-skill": {
            id: "example-skill",
            version: "0.1.0",
            category: "testing",
            installedAt: new Date().toISOString(),
          },
        },
      };

      await saveState(paths.stateFile, state);

      const skills = await listSkillsCommand(undefined, {
        projectDir,
        installed: true,
      });

      expect(skills.length).toBeGreaterThan(0);
      expect(skills.every((skill) => skill.installed === true)).toBe(true);
      expect(skills.some((skill) => skill.id === "example-skill")).toBe(true);
    } finally {
      removeTempProjectDir(projectDir);
    }
  });
});
