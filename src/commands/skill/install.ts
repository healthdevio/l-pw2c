import { join } from "node:path";

import { resolvePaths } from "../../core/config.js";
import { installSkill } from "../../core/installer.js";
import { getSkillIdsByCategory } from "../../core/registry.js";
import type { CommonCommandOptions } from "../types.js";

export interface InstallCommandResult {
  skillId: string;
  version: string;
  installPath: string;
}

export interface InstallByCategoryResult {
  category: string;
  results: InstallCommandResult[];
}

export type InstallCommandResultUnion =
  | InstallCommandResult
  | InstallByCategoryResult;

export async function installSkillCommand(
  skillId: string | undefined,
  options: CommonCommandOptions & { category?: string },
): Promise<InstallCommandResultUnion> {
  const paths = resolvePaths(options);

  if (options.category !== undefined) {
    const ids = await getSkillIdsByCategory(
      paths.registryFile,
      options.category,
    );
    const results: InstallCommandResult[] = [];

    for (const id of ids) {
      const result = await installSkill(paths, id);
      results.push({
        skillId: result.record.id,
        version: result.record.version,
        installPath: join(paths.installDir, result.record.id),
      });
    }

    return {
      category: options.category,
      results,
    };
  }

  if (skillId === undefined) {
    throw new Error("Informe a skill ou use --category.");
  }

  const result = await installSkill(paths, skillId);
  return {
    skillId: result.record.id,
    version: result.record.version,
    installPath: join(paths.installDir, result.record.id),
  };
}
