import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export type CheckLevel = "PASS" | "WARN" | "FAIL";

export interface CheckLine {
  level: CheckLevel;
  label: string;
  message: string;
}

export function printHeading(title: string) {
  console.log(`\n${title}`);
}

export function printCheck(line: CheckLine) {
  console.log(`[${line.level}] ${line.label}: ${line.message}`);
}

export function hasFailures(lines: CheckLine[]) {
  return lines.some((line) => line.level === "FAIL");
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function parseEnvValue(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const inner = trimmed.slice(1, -1);
    return trimmed.startsWith('"')
      ? inner.replace(/\\n/g, "\n").replace(/\\"/g, '"')
      : inner;
  }

  return trimmed;
}

function loadEnvFile(filename: string) {
  const filepath = resolve(process.cwd(), filename);
  if (!existsSync(filepath)) {
    return;
  }

  const content = readFileSync(filepath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const normalized = trimmed.startsWith("export ") ? trimmed.slice(7).trim() : trimmed;
    const separatorIndex = normalized.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = normalized.slice(0, separatorIndex).trim();
    const rawValue = normalized.slice(separatorIndex + 1);
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = parseEnvValue(rawValue);
  }
}

export function loadLocalEnvIfPresent() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");
}
