import { resolvePaths } from "../../core/config.js";
import { updateAllSkills, updateSkill } from "../../core/installer.js";
import type { CommonCommandOptions } from "../types.js";

export interface UpdateCommandOptions extends CommonCommandOptions {
  all?: boolean;
}

export interface UpdateCommandResult {
  updatedSkillIds: string[];
}

export async function updateSkillCommand(
  skillId: string | undefined,
  options: UpdateCommandOptions,
): Promise<UpdateCommandResult> {
  const paths = resolvePaths(options);

  if (options.all) {
    const updated = await updateAllSkills(paths);
    return {
      updatedSkillIds: updated.map((item) => item.record.id),
    };
  }

  if (!skillId) {
    throw new Error("Informe uma skill ou use --all.");
  }

  const updated = await updateSkill(paths, skillId);

  return {
    updatedSkillIds: [updated.record.id],
  };
}
