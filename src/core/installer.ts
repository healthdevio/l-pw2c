import { cp, rm } from "node:fs/promises";
import { join } from "node:path";

import type { ResolvedPaths } from "./config.js";
import { ensureDirectory } from "./config.js";
import { getSkillDescriptor, loadRegistry } from "./registry.js";
import {
  loadState,
  removeInstalledSkill,
  upsertInstalledSkill,
} from "./state.js";
import type { InstalledSkillRecord, SkillDescriptor } from "./types.js";

export interface InstallResult {
  record: InstalledSkillRecord;
  descriptor: SkillDescriptor;
}

function getInstallPath(paths: ResolvedPaths, skillId: string): string {
  return join(paths.installDir, skillId);
}

export async function installSkill(
  paths: ResolvedPaths,
  skillId: string,
): Promise<InstallResult> {
  const descriptor = await getSkillDescriptor(paths.registryFile, skillId);
  const installPath = getInstallPath(paths, descriptor.entry.id);

  ensureDirectory(paths.installDir);
  await rm(installPath, { force: true, recursive: true });
  await cp(descriptor.sourceDir, installPath, { recursive: true });

  const record: InstalledSkillRecord = {
    id: descriptor.entry.id,
    version: descriptor.entry.version,
    installedAt: new Date().toISOString(),
    category: descriptor.entry.category,
  };

  await upsertInstalledSkill(paths.stateFile, record);

  return {
    record,
    descriptor,
  };
}

export async function uninstallSkill(
  paths: ResolvedPaths,
  skillId: string,
): Promise<boolean> {
  const installPath = getInstallPath(paths, skillId);
  const state = await loadState(paths.stateFile);

  if (!state.installedSkills[skillId]) {
    return false;
  }

  await rm(installPath, { force: true, recursive: true });
  await removeInstalledSkill(paths.stateFile, skillId);
  return true;
}

export async function updateSkill(
  paths: ResolvedPaths,
  skillId: string,
): Promise<InstallResult> {
  const state = await loadState(paths.stateFile);

  if (!state.installedSkills[skillId]) {
    throw new Error(`Skill '${skillId}' não está instalada.`);
  }

  return installSkill(paths, skillId);
}

export async function updateAllSkills(
  paths: ResolvedPaths,
): Promise<InstallResult[]> {
  const state = await loadState(paths.stateFile);

  return Promise.all(
    Object.keys(state.installedSkills).map(async (skillId) =>
      updateSkill(paths, skillId),
    ),
  );
}

export async function listInstalledSkillIds(
  paths: ResolvedPaths,
): Promise<string[]> {
  const state = await loadState(paths.stateFile);
  return Object.keys(state.installedSkills).sort();
}

export async function getAvailableSkillIds(
  paths: ResolvedPaths,
): Promise<string[]> {
  const registry = await loadRegistry(paths.registryFile);
  return registry.map((skill) => skill.id).sort();
}
