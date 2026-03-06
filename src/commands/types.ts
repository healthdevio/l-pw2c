import type { RuntimeOptions } from "../core/config.js";

export interface CommandIo {
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

export interface CommonCommandOptions extends RuntimeOptions {
  json?: boolean | undefined;
}
