#!/usr/bin/env node

import { fileURLToPath } from "node:url";

import { createProgram, runCli } from "./cli/index.js";

export { createProgram, runCli };

const isMainModule = process.argv[1]
  ? fileURLToPath(import.meta.url) === process.argv[1]
  : false;

if (isMainModule) {
  void runCli().then((exitCode) => {
    if (exitCode !== 0) {
      process.exitCode = exitCode;
    }
  });
}
