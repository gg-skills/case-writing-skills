#!/usr/bin/env -S node --experimental-strip-types

/**
 * Refreshes the public skills tree from a local maintainer configuration.
 */

import { spawnSync } from "node:child_process";
import { mkdir, readFile, rename, rm, rmdir, writeFile } from "node:fs/promises";
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

const PUBLIC_BUNDLE = "gg-skills/case-writing-skills";
const LOCAL_CONFIG = "bundle.sources.local.json";
const INSTALL_SECTION = /^## Install\r?\n[\s\S]*?(?=^## )/m;

const help = `Refresh skills/ using a local source mapping (see bundle.sources.example.json).

Usage: ./scripts/sync-bundle.ts [--help]

Options:
  --help, -h            Show this help and exit without reading or writing files.
  CASE_BUNDLE_SOURCES   Path to a source mapping. Defaults to bundle.sources.local.json.

Effects:
  Fetches each configured Git ref and stages all seven skills. Rewrites their
  install instructions for the public bundle, then replaces skills/. Does not push.
`;

type Source = { repository: string; ref: string };

const root = path.resolve(import.meta.dirname, "..");

async function loadSources(): Promise<Map<string, Source>> {
  const configPath = process.env.CASE_BUNDLE_SOURCES
    ? path.resolve(process.env.CASE_BUNDLE_SOURCES)
    : path.join(root, LOCAL_CONFIG);

  const contents = await readFile(configPath, "utf8").catch(() => {
    throw new Error(`Cannot read source mapping. Create ${LOCAL_CONFIG} from bundle.sources.example.json or set CASE_BUNDLE_SOURCES.`);
  });
  let config: Record<string, Partial<Source> | undefined>;
  try {
    config = JSON.parse(contents);
  } catch {
    throw new Error("The source mapping must be valid JSON.");
  }
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("The source mapping must be a JSON object keyed by skill.");
  }

  const sources = new Map<string, Source>();
  for (const name of SKILLS) {
    const source = config[name];
    if (typeof source?.repository !== "string" || !source.repository.trim()
      || typeof source.ref !== "string" || !source.ref.trim()) {
      throw new Error(`Configure a repository and Git ref for ${name}.`);
    }
    const repository = source.repository.includes(":")
      ? source.repository
      : path.resolve(path.dirname(configPath), source.repository);
    sources.set(name, { repository, ref: source.ref });
  }
  return sources;
}

function git(cwd: string, args: string[], failure: string, expectedStatus = 0): void {
  const result = spawnSync("git", args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
  if (result.status !== expectedStatus) throw new Error(failure);
}

async function stageSkill(name: string, source: Source, staging: string): Promise<void> {
  const destination = path.join(staging, name);
  await mkdir(destination);
  git(destination, ["-c", "init.templateDir=", "init"], `Could not initialize Git for ${name}.`);
  git(
    destination,
    ["fetch", "--depth=1", "--no-tags", "--", source.repository, source.ref],
    `Could not fetch ${name}. Check access to the configured repository and ref.`,
  );
  git(destination, ["checkout", "--detach", "FETCH_HEAD"], `Could not check out ${name}.`);

  await readFile(path.join(destination, "SKILL.md"));
  const readmePath = path.join(destination, "README.md");
  const readme = await readFile(readmePath, "utf8");
  if (!INSTALL_SECTION.test(readme)) throw new Error(`Could not find the install section for ${name}.`);

  const installSection = [
    "## Install",
    "",
    "Install this skill together with the other six case skills.",
    "",
    "```bash",
    `npx skills add ${PUBLIC_BUNDLE} -y`,
    "```",
    "",
    "To install only this skill, use its name.",
    "",
    "```bash",
    `npx skills add ${PUBLIC_BUNDLE} --skill ${name} -y`,
    "```",
    "",
    "Restart your agent or reload skills after installation. Browse public skills on the [GG Skills organization profile](https://github.com/gg-skills).",
    "",
    "",
  ].join("\n");
  await writeFile(readmePath, readme.replace(INSTALL_SECTION, installSection));

  const owner = PUBLIC_BUNDLE.split("/")[0];
  const sourceReference = `(${owner}|github[.]com[:/][[:alnum:]_.-]+)(/|%2f)(${SKILLS.join("|")})([^[:alnum:]_-]|$)`;
  const commitPin = "(^|[^[:xdigit:]])[[:xdigit:]]{40}([^[:xdigit:]]|$)";
  git(
    destination,
    ["grep", "-IqiE", "-e", sourceReference, "-e", commitPin, "--"],
    `Could not verify public content for ${name}. Review it for repository references or commit pins.`,
    1,
  );
  await rm(path.join(destination, ".git"), { recursive: true });
}

async function publishSkills(staging: string, backup: string): Promise<void> {
  const destination = path.join(root, "skills");
  const hasBackup = await rename(destination, backup).then(() => true).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return false;
    throw error;
  });
  try {
    await rename(staging, destination);
  } catch (error) {
    if (hasBackup) {
      await rename(backup, destination).catch(() => {
        throw new Error("Could not restore skills/. Recover the previous tree from .bundle-sync/previous-skills.");
      });
    }
    throw error;
  }
  if (hasBackup) await rm(backup, { recursive: true });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h") || args.includes("--h")) {
    console.log(help);
    return;
  }
  if (args.length > 0) throw new Error(`Unknown argument: ${args[0]}`);

  const sources = await loadSources();
  const scratch = path.join(root, ".bundle-sync");
  await mkdir(scratch).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "EEXIST") throw new Error("A sync is running or left work in .bundle-sync/.");
    throw error;
  });
  const staging = path.join(scratch, "staged-skills");
  try {
    await mkdir(staging);
    for (const [name, source] of sources) await stageSkill(name, source, staging);
    await publishSkills(staging, path.join(scratch, "previous-skills"));
  } finally {
    await rm(staging, { recursive: true, force: true });
    await rmdir(scratch).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOTEMPTY") throw error;
    });
  }
  console.log(`Wrote ${SKILLS.length} skills into skills/.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
