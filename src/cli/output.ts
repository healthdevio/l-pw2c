import type { CommandIo } from "../commands/types.js";
import type { ListedSkill } from "../commands/skill/list.js";

export function printJson(io: CommandIo, value: unknown): void {
  io.stdout(`${JSON.stringify(value, null, 2)}\n`);
}

export function printSkillList(io: CommandIo, skills: ListedSkill[]): void {
  if (skills.length === 0) {
    io.stdout("Nenhuma skill encontrada.\n");
    return;
  }

  const lines = skills.map(
    (skill) =>
      `${skill.installed ? "[instalada]" : "[disponível]"} ${skill.id} (${skill.version}) - ${skill.description}`,
  );

  io.stdout(`${lines.join("\n")}\n`);
}
