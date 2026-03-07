import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

import { z } from "zod";

import type {
  SkillDescriptor,
  SkillManifest,
  SkillRegistryEntry,
} from "./types.js";

const skillManifestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  entry: z.string().min(1),
  files: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).default([]),
  compatibility: z.object({
    targets: z.array(z.string().min(1)).min(1),
    minimumCliVersion: z.string().min(1).optional(),
  }),
});

const skillRegistryEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  manifestPath: z.string().min(1),
});

const registrySchema = z.object({
  version: z.literal(1),
  skills: z.array(skillRegistryEntrySchema).min(1),
});

interface RegistryFile {
  version: 1;
  skills: SkillRegistryEntry[];
}

export async function loadRegistry(
  registryFile: string,
): Promise<SkillRegistryEntry[]> {
  const registry = registrySchema.parse(
    JSON.parse(await readFile(registryFile, "utf8")),
  ) as RegistryFile;

  return registry.skills;
}

export async function getSkillIdsByCategory(
  registryFile: string,
  category: string,
): Promise<string[]> {
  const registry = await loadRegistry(registryFile);
  return registry
    .filter((entry) => entry.category === category)
    .map((entry) => entry.id)
    .sort();
}

export async function loadManifest(
  manifestPath: string,
): Promise<SkillManifest> {
  return skillManifestSchema.parse(
    JSON.parse(await readFile(manifestPath, "utf8")),
  ) as SkillManifest;
}

export async function validateRegistry(
  registryFile: string,
): Promise<SkillRegistryEntry[]> {
  const registry = await loadRegistry(registryFile);

  await Promise.all(
    registry.map(async (entry) => {
      const manifestPath = resolve(dirname(registryFile), entry.manifestPath);
      const manifest = await loadManifest(manifestPath);

      if (
        manifest.id !== entry.id ||
        manifest.name !== entry.name ||
        manifest.version !== entry.version ||
        manifest.category !== entry.category ||
        manifest.description !== entry.description
      ) {
        throw new Error(
          `O manifest '${entry.id}' não está sincronizado com o registry.`,
        );
      }
    }),
  );

  return registry;
}

export async function getSkillDescriptor(
  registryFile: string,
  skillId: string,
): Promise<SkillDescriptor> {
  const registry = await loadRegistry(registryFile);
  const entry = registry.find((candidate) => candidate.id === skillId);

  if (!entry) {
    throw new Error(`Skill '${skillId}' não encontrada.`);
  }

  const manifestPath = resolve(dirname(registryFile), entry.manifestPath);
  const manifest = await loadManifest(manifestPath);

  return {
    entry,
    manifest,
    sourceDir: dirname(manifestPath),
  };
}

export async function listSkillDescriptors(
  registryFile: string,
): Promise<SkillDescriptor[]> {
  const registry = await loadRegistry(registryFile);

  return Promise.all(
    registry.map(async (entry) => {
      const manifestPath = resolve(dirname(registryFile), entry.manifestPath);
      const manifest = await loadManifest(manifestPath);

      return {
        entry,
        manifest,
        sourceDir: dirname(manifestPath),
      };
    }),
  );
}

export async function searchSkills(
  registryFile: string,
  query?: string,
): Promise<SkillDescriptor[]> {
  const normalizedQuery = query?.trim().toLowerCase();
  const descriptors = await listSkillDescriptors(registryFile);

  if (!normalizedQuery) {
    return descriptors;
  }

  return descriptors.filter(({ entry, manifest }) => {
    const haystack = [
      entry.id,
      entry.name,
      entry.description,
      entry.category,
      ...manifest.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function getSkillFilePath(
  descriptor: SkillDescriptor,
  relativePath: string,
): string {
  return resolve(descriptor.sourceDir, relativePath);
}

export function getSkillEntryPath(descriptor: SkillDescriptor): string {
  return join(descriptor.sourceDir, descriptor.manifest.entry);
}
