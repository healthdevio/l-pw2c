export { runCli, createProgram } from "./cli.js";
export { createMcpServer, startMcpServer } from "./mcp/server.js";
export { resolvePaths, getPackageMetadata } from "./core/config.js";
export {
  getSkillDescriptor,
  listSkillDescriptors,
  loadRegistry,
  searchSkills,
  validateRegistry,
} from "./core/registry.js";
export {
  installSkill,
  uninstallSkill,
  updateAllSkills,
  updateSkill,
} from "./core/installer.js";
export { loadState } from "./core/state.js";
export type {
  SkillDescriptor,
  SkillManifest,
  SkillRegistryEntry,
  InstalledSkillRecord,
  SkillState,
} from "./core/types.js";
