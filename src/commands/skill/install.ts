import { installSkill } from "../../core/installer.js";
import { resolvePaths } from "../../core/config.js";
import type { CommonCommandOptions } from "../types.js";

export interface InstallCommandResult {
  skillId: string;
  version: string;
  installPath: string;
}

export async function installSkillCommand(
  skillId: string,
  options: CommonCommandOptions,
): Promise<InstallCommandResult> {
  const paths = resolvePaths(options);
  const result = await installSkill(paths, skillId);

  return {
    skillId: result.record.id,
    version: result.record.version,
    installPath: result.record.installPath,
  };
}
