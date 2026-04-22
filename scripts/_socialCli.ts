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
