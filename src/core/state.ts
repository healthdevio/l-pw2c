import { readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { z } from "zod";

import { ensureParentDirectory } from "./config.js";
import type { InstalledSkillRecord, SkillState } from "./types.js";

const installedSkillRecordSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  installedAt: z.string().datetime(),
  installPath: z.string().min(1).optional(), // legado: não é mais gravado; aceito ao carregar state antigo
  category: z.string().min(1),
});

const skillStateSchema = z.object({
  version: z.literal(1),
  installedSkills: z.record(z.string(), installedSkillRecordSchema),
});

export async function loadState(stateFile: string): Promise<SkillState> {
  try {
    const rawState = await readFile(stateFile, "utf8");
    return skillStateSchema.parse(JSON.parse(rawState)) as SkillState;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {
        version: 1,
        installedSkills: {},
      };
    }

    throw error;
  }
}

export async function saveState(
  stateFile: string,
  state: SkillState,
): Promise<void> {
  ensureParentDirectory(stateFile);
  await writeFile(stateFile, JSON.stringify(state, null, 2), "utf8");
}

export async function upsertInstalledSkill(
  stateFile: string,
  record: InstalledSkillRecord,
): Promise<SkillState> {
  const state = await loadState(stateFile);
  state.installedSkills[record.id] = record;
  await saveState(stateFile, state);
  return state;
}

export async function getInstalledSkillIdsByCategory(
  stateFile: string,
  category: string,
): Promise<string[]> {
  const state = await loadState(stateFile);
  return Object.values(state.installedSkills)
    .filter((record) => record.category === category)
    .map((record) => record.id)
    .sort();
}

export async function removeInstalledSkill(
  stateFile: string,
  skillId: string,
): Promise<SkillState> {
  const state = await loadState(stateFile);
  delete state.installedSkills[skillId];

  if (Object.keys(state.installedSkills).length === 0) {
    await removeStateFile(stateFile);
    return state;
  }

  await saveState(stateFile, state);
  return state;
}

async function removeStateFile(stateFile: string): Promise<void> {
  try {
    await unlink(stateFile);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  try {
    await rmdir(dirname(stateFile));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code !== "ENOENT" && code !== "ENOTEMPTY") {
      throw error;
    }
  }
}
