import type { InstallByCategoryResult } from "../commands/skill/install.js";
import type { UninstallByCategoryResult } from "../commands/skill/uninstall.js";
import type { installSkillCommand } from "../commands/skill/install.js";
import type { uninstallSkillCommand } from "../commands/skill/uninstall.js";

export function isInstallByCategory(
  result: Awaited<ReturnType<typeof installSkillCommand>>,
): result is InstallByCategoryResult {
  return "category" in result && "results" in result;
}

export function isUninstallByCategory(
  result: Awaited<ReturnType<typeof uninstallSkillCommand>>,
): result is UninstallByCategoryResult {
  return "category" in result && "results" in result;
}
