#!/usr/bin/env -S node --experimental-strip-types

/**
 * Builds one zip per skill and one Claude plugin zip under dist/.
 * Does not upload a GitHub release.
 */

import { execFileSync } from "node:child_process";
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const help = `Build release zips from the vendored skills tree.

Usage: ./scripts/package-release.ts [--help]

Options:
  --help, -h   Show this help and exit. Does not read skill files or write dist/.

Effects:
  Writes dist/<skill>.zip for each directory in skills/ that contains SKILL.md.
  Each skill zip has the skill folder as its top entry.
  Writes dist/case-writing-plugin.zip with .claude-plugin/, .codex-plugin/,
  and skills/. Replaces dist/ first. Does not push or create a GitHub release.

Example:
  ./scripts/package-release.ts
`;

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function zip(cwd: string, archive: string, paths: string[]): void {
  execFileSync("zip", ["-r", archive, ...paths, "-x", "*.DS_Store"], {
    cwd,
    stdio: "inherit",
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(help);
    return;
  }
  if (args.length > 0) {
    console.error(`Unknown argument: ${args[0] ?? ""}`);
    console.log(help);
    process.exit(1);
  }

  const skillsDir = path.join(root, "skills");
  const dist = path.join(root, "dist");
  let entries: string[];
  try {
    entries = await readdir(skillsDir);
  } catch {
    fail("skills/ is missing. Run scripts/sync-bundle.ts first.");
  }

  const skills: string[] = [];
  for (const entry of entries) {
    const skillFile = path.join(skillsDir, entry, "SKILL.md");
    try {
      if ((await stat(skillFile)).isFile()) skills.push(entry);
    } catch {
      // Not a skill directory.
    }
  }
  skills.sort();
  if (skills.length === 0) {
    fail("No SKILL.md files under skills/. Run scripts/sync-bundle.ts first.");
  }

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  for (const name of skills) {
    const archive = path.join(dist, `${name}.zip`);
    zip(skillsDir, archive, [name]);
    console.log(archive);
  }

  const plugin = path.join(dist, "case-writing-plugin.zip");
  zip(root, plugin, [".claude-plugin", ".codex-plugin", "skills"]);
  console.log(plugin);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
