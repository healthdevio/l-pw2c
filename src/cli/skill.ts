import type { Command } from "commander";

import { installSkillCommand } from "../commands/skill/install.js";
import { listSkillsCommand } from "../commands/skill/list.js";
import { uninstallSkillCommand } from "../commands/skill/uninstall.js";
import { updateSkillCommand } from "../commands/skill/update.js";
import type { CommandIo } from "../commands/types.js";
import { isInstallByCategory } from "./guards.js";
import { isUninstallByCategory } from "./guards.js";
import {
  applyCommonOptions,
  type InstallCliOptions,
  type ListCliOptions,
  type UninstallCliOptions,
  type UpdateCliOptions,
  toCommonOptions,
} from "./options.js";
import { printJson, printSkillList } from "./output.js";

export function registerSkillCommand(program: Command, io: CommandIo): void {
  const skillCommand = program
    .command("skill")
    .description("Gerencia skills locais");

  applyCommonOptions(
    skillCommand
      .command("install")
      .description("Instala uma skill no diretório alvo")
      .argument("[skill]", "Nome da skill")
      .option("--category <name>", "Instala todas as skills da categoria")
      .action(async (skill: string | undefined, options: InstallCliOptions) => {
        const opts = {
          ...toCommonOptions(options),
          ...(typeof options.category === "string"
            ? { category: options.category }
            : {}),
        };
        const result = await installSkillCommand(skill, opts);

        if (options.json) {
          printJson(io, result);
          return;
        }

        if (isInstallByCategory(result)) {
          const { category, results } = result;
          if (results.length === 0) {
            io.stdout(`Nenhuma skill na categoria '${category}'.\n`);
          } else {
            io.stdout(
              `${results.length} skill(s) da categoria '${category}' instalada(s): ${results.map((r) => r.skillId).join(", ")}.\n`,
            );
          }
        } else {
          io.stdout(
            `Skill '${result.skillId}' instalada em '${result.installPath}'.\n`,
          );
        }
      }),
  );

  applyCommonOptions(
    skillCommand
      .command("uninstall")
      .description("Remove uma skill instalada")
      .argument("[skill]", "Nome da skill")
      .option(
        "--category <name>",
        "Remove todas as skills instaladas da categoria",
      )
      .action(
        async (skill: string | undefined, options: UninstallCliOptions) => {
          const opts = {
            ...toCommonOptions(options),
            ...(typeof options.category === "string"
              ? { category: options.category }
              : {}),
          };
          const result = await uninstallSkillCommand(skill, opts);

          if (options.json) {
            printJson(io, result);
            return;
          }

          if (isUninstallByCategory(result)) {
            const byCategory = result;
            const { category, results } = byCategory;
            if (results.length === 0) {
              io.stdout(
                `Nenhuma skill instalada na categoria '${category}'.\n`,
              );
            } else {
              const removed = results.filter((r) => r.removed).length;
              io.stdout(
                `${removed} skill(s) da categoria '${category}' removida(s): ${results.map((r) => r.skillId).join(", ")}.\n`,
              );
            }
          } else {
            io.stdout(
              result.removed
                ? `Skill '${result.skillId}' removida.\n`
                : `Skill '${result.skillId}' não estava instalada.\n`,
            );
          }
        },
      ),
  );

  applyCommonOptions(
    skillCommand
      .command("update")
      .description("Atualiza uma skill instalada ou todas com --all")
      .argument("[skill]", "Nome da skill")
      .option("--all", "Atualiza todas as skills instaladas")
      .action(async (skill: string | undefined, options: UpdateCliOptions) => {
        const result = await updateSkillCommand(skill, {
          ...toCommonOptions(options),
          all: options.all === true,
        });

        if (options.json) {
          printJson(io, result);
          return;
        }

        io.stdout(
          `Skills atualizadas: ${result.updatedSkillIds.join(", ") || "nenhuma"}.\n`,
        );
      }),
  );

  applyCommonOptions(
    skillCommand
      .command("list")
      .description("Lista skills disponíveis ou instaladas")
      .argument("[query]", "Filtro opcional pelo nome, id ou descrição")
      .option("--installed", "Mostra apenas as instaladas")
      .option("--available", "Mostra apenas as não instaladas")
      .action(async (query: string | undefined, options: ListCliOptions) => {
        const result = await listSkillsCommand(query, {
          ...toCommonOptions(options),
          installed: options.installed === true,
          available: options.available === true,
        });

        if (options.json) {
          printJson(io, result);
          return;
        }

        printSkillList(io, result);
      }),
  );
}
