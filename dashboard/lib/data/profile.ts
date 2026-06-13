/**
 * Read layer: candidate profile assembled from the numbered skill files
 * (01–07 *.md) plus the root project memory (CLAUDE.md). Missing files are
 * omitted, never fabricated (ARCH-0007). Read-only in v1.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { paths } from "@/lib/paths";
import { IS_DEMO } from "@/lib/demo/flags";
import { DEMO_PROFILE } from "@/lib/demo/seed";

export interface ProfileSection {
  name: string; // file name
  path: string; // absolute path
  content: string;
}

async function readIfExists(
  file: string,
): Promise<ProfileSection | null> {
  try {
    const content = await fs.readFile(file, "utf8");
    return { name: path.basename(file), path: file, content };
  } catch {
    return null;
  }
}

export async function readProfile(opts?: {
  skillDir?: string;
  memoryPath?: string;
}): Promise<ProfileSection[]> {
  // Static demo build: serve a bundled sample profile.
  if (IS_DEMO) return DEMO_PROFILE;

  const skillDir = opts?.skillDir ?? paths.profileSkillDir();
  const memoryPath = opts?.memoryPath ?? paths.projectMemory();

  // Numbered profile files in the skill dir (01-…, 02-…, … 07-…).
  let numbered: string[] = [];
  try {
    const entries = await fs.readdir(skillDir);
    numbered = entries
      .filter((n) => /^0[1-7]-.*\.md$/.test(n))
      .sort();
  } catch {
    numbered = [];
  }

  const sections = await Promise.all([
    ...numbered.map((n) => readIfExists(path.join(skillDir, n))),
    readIfExists(memoryPath),
  ]);

  return sections.filter((s): s is ProfileSection => s !== null);
}
