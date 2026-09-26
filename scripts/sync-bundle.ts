#!/usr/bin/env -S node --experimental-strip-types

/**
 * Copies each case skill from the tip of its main branch into skills/.
 * Records those commits in bundle.lock.json. Does not follow submodules.
 */

import { execFileSync } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const SKILLS = [
  "case-bootstrap",
  "case-research",
  "case-business-case",
  "case-teaching-note",
  "case-classroom-test",
  "case-peer-review",
  "case-disguise",
] as const;

const help = `Refresh skills/ from the main branch of each gg-skills case repository.

Usage: ./scripts/sync-bundle.ts [--help]

Options:
  --help, -h   Show this help and exit. Does not read or write the bundle.

Effects:
  For each skill, reads refs/heads/main, clones that commit, and replaces
  skills/<name>/ with those files. Writes bundle.lock.json. Removes a skill
  directory that is no longer in the list above. Does not push.

Example:
  ./scripts/sync-bundle.ts
`;

type LockFile = {
  source: "skill-main";
  skills: Record<string, string>;
};

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function run(command: string, args: string[], cwd?: string): string {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function mainSha(name: string): string {
  const remote = `git@github.com:gg-skills/${name}.git`;
  const line = run("git", ["ls-remote", remote, "refs/heads/main"]);
  const sha = line.split(/\s+/)[0] ?? "";
  if (!/^[0-9a-f]{40}$/.test(sha)) {
    fail(`Could not read main for ${name}: ${line || "(empty)"}`);
  }
  return sha;
}

async function copySkill(name: string, sha: string, scratch: string): Promise<void> {
  const remote = `git@github.com:gg-skills/${name}.git`;
  const clone = path.join(scratch, name);
  run("git", ["clone", "--depth", "1", remote, clone]);
  const head = run("git", ["rev-parse", "HEAD"], clone);
  if (head !== sha) {
    fail(`${name} moved while syncing. Expected ${sha}, cloned ${head}. Run the sync again.`);
  }
  const destination = path.join(root, "skills", name);
  await rm(destination, { recursive: true, force: true });
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(clone, destination, {
    recursive: true,
    filter: (source) => {
      const relative = path.relative(clone, source);
      if (relative === "") return true;
      return relative.split(path.sep)[0] !== ".git";
    },
  });
  const sourceNote = {
    repository: `gg-skills/${name}`,
    sha,
  };
  await writeFile(
    path.join(destination, ".bundle-source.json"),
    `${JSON.stringify(sourceNote, null, 2)}\n`,
  );
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h") || args.includes("--h")) {
    console.log(help);
    return;
  }
  if (args.length > 0) {
    console.error(`Unknown argument: ${args[0] ?? ""}`);
    console.log(help);
    process.exit(1);
  }

  const lock: LockFile = { source: "skill-main", skills: {} };
  const scratch = path.join(tmpdir(), `case-writing-skills-${Date.now().toString()}`);
  await mkdir(scratch, { recursive: true });
  try {
    for (const name of SKILLS) {
      const sha = mainSha(name);
      await copySkill(name, sha, scratch);
      lock.skills[name] = sha;
      console.log(`${name} ${sha}`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }

  await writeFile(path.join(root, "bundle.lock.json"), `${JSON.stringify(lock, null, 2)}\n`);
  console.log(`Wrote ${SKILLS.length.toString()} skills into skills/.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
