import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface RuntimeOptions {
  projectDir?: string | undefined;
  installDir?: string | undefined;
  stateFile?: string | undefined;
}

export interface PackageMetadata {
  packageName: string;
  commandName: string;
  version: string;
  packageRoot: string;
}

export interface ResolvedPaths extends PackageMetadata {
  workspaceDir: string;
  installDir: string;
  stateFile: string;
  registryFile: string;
  skillsRoot: string;
}

interface RawPackageJson {
  name?: string;
  version?: string;
  bin?: Record<string, string> | string;
}

const currentDir = dirname(fileURLToPath(import.meta.url));

function findPackageRoot(startDirectory: string): string {
  let candidate = startDirectory;

  while (true) {
    if (existsSync(join(candidate, "package.json"))) {
      return candidate;
    }

    const parentDirectory = dirname(candidate);

    if (parentDirectory === candidate) {
      throw new Error("Não foi possível localizar o package.json do projeto.");
    }

    candidate = parentDirectory;
  }
}

const packageRoot = findPackageRoot(currentDir);

function loadPackageMetadata(): PackageMetadata {
  const packageJsonPath = join(packageRoot, "package.json");
  const packageJson = JSON.parse(
    readFileSync(packageJsonPath, "utf8"),
  ) as RawPackageJson;

  const packageName = packageJson.name ?? "l-pw2c";
  const commandName =
    typeof packageJson.bin === "string"
      ? (packageName.split("/").at(-1) ?? "l-pw2c")
      : (Object.keys(packageJson.bin ?? {})[0] ?? "l-pw2c");

  return {
    packageName,
    commandName,
    version: packageJson.version ?? "0.0.0",
    packageRoot,
  };
}

export function getPackageMetadata(): PackageMetadata {
  return loadPackageMetadata();
}

export function resolvePaths(options: RuntimeOptions = {}): ResolvedPaths {
  const metadata = getPackageMetadata();
  const workspaceDir = resolve(
    options.projectDir ?? process.env.LPW2C_PROJECT_DIR ?? process.cwd(),
  );
  const installDir = resolve(
    options.installDir ??
      process.env.LPW2C_INSTALL_DIR ??
      join(workspaceDir, ".cursor", "skills"),
  );
  const stateFile = resolve(
    options.stateFile ??
      process.env.LPW2C_STATE_FILE ??
      join(workspaceDir, ".cursor", "l-pw2c", "state.json"),
  );

  return {
    ...metadata,
    workspaceDir,
    installDir,
    stateFile,
    registryFile: join(metadata.packageRoot, "skills", "registry.json"),
    skillsRoot: join(metadata.packageRoot, "skills"),
  };
}

export function ensureParentDirectory(filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
}

export function ensureDirectory(directoryPath: string): void {
  mkdirSync(directoryPath, { recursive: true });
}
