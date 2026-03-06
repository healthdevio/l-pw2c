import { resolvePaths } from "../../core/config.js";
import { listSkillDescriptors, searchSkills } from "../../core/registry.js";
import { loadState } from "../../core/state.js";
import type { CommonCommandOptions } from "../types.js";

export interface ListCommandOptions extends CommonCommandOptions {
  installed?: boolean;
  available?: boolean;
}

export interface ListedSkill {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  installed: boolean;
}

export async function listSkillsCommand(
  query: string | undefined,
  options: ListCommandOptions,
): Promise<ListedSkill[]> {
  const paths = resolvePaths(options);
  const [descriptors, state] = await Promise.all([
    query
      ? searchSkills(paths.registryFile, query)
      : listSkillDescriptors(paths.registryFile),
    loadState(paths.stateFile),
  ]);

  return descriptors
    .map(({ entry }) => ({
      id: entry.id,
      name: entry.name,
      version: entry.version,
      category: entry.category,
      description: entry.description,
      installed: Boolean(state.installedSkills[entry.id]),
    }))
    .filter((skill) => {
      if (options.installed) {
        return skill.installed;
      }

      if (options.available) {
        return !skill.installed;
      }

      return true;
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}
