import { describe, expect, it } from "vitest";

import { resolvePaths } from "../src/core/config.js";
import {
  getSkillDescriptor,
  loadRegistry,
  searchSkills,
  validateRegistry,
} from "../src/core/registry.js";

const registryLength = 3;

describe("skill registry", () => {
  it("carrega e valida o catálogo padrão", async () => {
    const paths = resolvePaths();
    const registry = await loadRegistry(paths.registryFile);

    expect(registry).toHaveLength(registryLength);
    await expect(validateRegistry(paths.registryFile)).resolves.toHaveLength(
      registryLength,
    );
  });

  it("retorna o descriptor completo de uma skill", async () => {
    const paths = resolvePaths();
    const descriptor = await getSkillDescriptor(
      paths.registryFile,
      "example-skill",
    );

    expect(descriptor.manifest.entry).toBe("SKILL.md");
    expect(descriptor.entry.category).toBe("testing");
  });

  it("permite buscar skills por termo livre", async () => {
    const paths = resolvePaths();
    const result = await searchSkills(paths.registryFile, "cursor");

    expect(result.map((item) => item.entry.id)).toContain("example-skill");
  });
});
