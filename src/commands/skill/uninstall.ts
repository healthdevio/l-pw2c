import { resolvePaths } from "../../core/config.js";
import { uninstallSkill } from "../../core/installer.js";
import { getInstalledSkillIdsByCategory } from "../../core/state.js";
import type { CommonCommandOptions } from "../types.js";

export interface UninstallCommandResult {
  removed: boolean;
  skillId: string;
}

export interface UninstallByCategoryResult {
  category: string;
  results: UninstallCommandResult[];
}

export type UninstallCommandResultUnion =
  | UninstallCommandResult
  | UninstallByCategoryResult;

export async function uninstallSkillCommand(
  skillId: string | undefined,
  options: CommonCommandOptions & { category?: string },
): Promise<UninstallCommandResultUnion> {
  const paths = resolvePaths(options);

  if (options.category !== undefined) {
    const ids = await getInstalledSkillIdsByCategory(
      paths.stateFile,
      options.category,
    );
    const results: UninstallCommandResult[] = [];

    for (const id of ids) {
      const removed = await uninstallSkill(paths, id);
      results.push({ removed, skillId: id });
    }

    return {
      category: options.category,
      results,
    };
  }

  if (skillId === undefined) {
    throw new Error("Informe a skill ou use --category.");
  }

  const removed = await uninstallSkill(paths, skillId);
  return {
    removed,
    skillId,
  };
}
