export interface SkillRegistryEntry {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  manifestPath: string;
}

export interface SkillManifest {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  entry: string;
  files: string[];
  tags: string[];
  compatibility: {
    targets: string[];
    minimumCliVersion?: string;
  };
}

export interface InstalledSkillRecord {
  id: string;
  version: string;
  installedAt: string;
  installPath: string;
  category: string;
}

export interface SkillState {
  version: 1;
  installedSkills: Record<string, InstalledSkillRecord>;
}

export interface SkillDescriptor {
  entry: SkillRegistryEntry;
  manifest: SkillManifest;
  sourceDir: string;
}
