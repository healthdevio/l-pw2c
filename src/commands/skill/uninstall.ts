import { resolvePaths } from "../../core/config.js";
import { uninstallSkill } from "../../core/installer.js";
import type { CommonCommandOptions } from "../types.js";

export interface UninstallCommandResult {
  removed: boolean;
  skillId: string;
}

export async function uninstallSkillCommand(
  skillId: string,
  options: CommonCommandOptions,
): Promise<UninstallCommandResult> {
  const paths = resolvePaths(options);
  const removed = await uninstallSkill(paths, skillId);

  return {
    removed,
    skillId,
  };
}
