import type { CommandIo } from "../commands/types.js";
import type { ListedSkill } from "../commands/skill/list.js";

const MAX_DESC_LENGTH = 52;

function truncateDescription(description: string): string {
  const trimmed = description.trim();
  if (trimmed.length <= MAX_DESC_LENGTH) {
    return trimmed;
  }
  return `${trimmed.slice(0, MAX_DESC_LENGTH - 1)}…`;
}

function statusIcon(installed: boolean): string {
  return installed ? "✓" : "○";
}

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
      `${statusIcon(skill.installed)} ${skill.id} (${skill.version}) ${truncateDescription(skill.description)}`,
  );

  io.stdout(`${lines.join("\n")}\n`);
}
