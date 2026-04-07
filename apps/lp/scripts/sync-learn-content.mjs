#!/usr/bin/env node
/**
 * sync-learn-content.mjs
 *
 * qm-marketing/11_recovery_study/ から教科書章を読み込み、
 * apps/lp/src/content/learn/{category}/{locale}/ に同期する。
 *
 * - 章ファイル名から ch{NN}_ プレフィックスを剥がして topic-only slug に変換
 * - frontmatter に phase / part / chapter / title / required / learningGoals / excerpt を付与
 * - title / learning goals / 必読フラグは元ファイルの本文から自動抽出
 * - 必読フラグ章（ch07_money_access, ch09_safety_plan）は required: true
 *
 * 使い方:
 *   node apps/lp/scripts/sync-learn-content.mjs
 *
 * 再実行は安全（冪等）。既存ファイルは上書きされる。
 */

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../");

// 執筆元: qm-marketing は qm-web の親ディレクトリにある
const SOURCE_BASE = path.resolve(REPO_ROOT, "../qm-marketing/11_recovery_study");
const TARGET_BASE = path.resolve(__dirname, "../src/content/learn");

// Phase ディレクトリと Part ディレクトリのマッピング
// (Phase 1 のみ。他 Phase は執筆完了次第追加)
const PHASE_DIRS = [
  {
    phase: 1,
    dir: "phase1_emergency",
    parts: [
      { code: "1A", dir: "part1a_understand" },
      { code: "1B", dir: "part1b_act_now" },
      { code: "1C", dir: "part1c_triggers" },
      { code: "1D", dir: "part1d_reality" },
      { code: "1E", dir: "part1e_rebuild" },
    ],
  },
];

// 必読フラグ章（filename ベース）
const REQUIRED_CHAPTERS = new Set(["ch07_money_access.md", "ch09_safety_plan.md"]);

// このスクリプトでは ja のみ処理（en は執筆未着手）
const TARGET_CATEGORY = "gambling";
const TARGET_LOCALE = "ja";

/**
 * filename "ch01_not_willpower.md" → { chapterNum: 1, slug: "not-willpower" }
 */
function parseFilename(filename) {
  const m = filename.match(/^ch(\d+)_(.+)\.md$/);
  if (!m) throw new Error(`Unexpected filename: ${filename}`);
  return {
    chapterNum: parseInt(m[1], 10),
    slug: m[2].replace(/_/g, "-"),
  };
}

/**
 * 章本文をパースして frontmatter フィールドと body を抽出
 */
function parseChapter(content) {
  const lines = content.split("\n");

  // line 0: "# 第N章 タイトル"
  const titleMatch = lines[0].match(/^#\s+第\d+章\s+(.+)$/);
  if (!titleMatch) {
    throw new Error(`Could not extract title from first line: ${lines[0]}`);
  }
  const title = titleMatch[1].trim();

  // 学習ゴール抽出 + 該当範囲を bodyLines から削除
  const learningGoals = [];
  let required = false;
  const bodyLines = [];

  let i = 1;
  let state = "preamble"; // preamble | inGoals | postGoals
  let goalsHeadingFound = false;

  while (i < lines.length) {
    const line = lines[i];

    if (state === "preamble") {
      // 必読フラグマーカー
      if (/^>\s*\*\*必読/.test(line)) {
        required = true;
        i++;
        // 直後の空行も skip
        if (i < lines.length && lines[i].trim() === "") i++;
        continue;
      }
      // 学習ゴール見出し
      if (/^##\s+この章で学ぶこと/.test(line)) {
        state = "inGoals";
        goalsHeadingFound = true;
        i++;
        continue;
      }
      // それ以外は preamble に何もないはず（空行のみ skip）
      if (line.trim() === "") {
        i++;
        continue;
      }
      // 想定外の preamble 内容: postGoals に遷移して body に含める
      state = "postGoals";
      bodyLines.push(line);
      i++;
      continue;
    }

    if (state === "inGoals") {
      // bullet 行
      const bulletMatch = line.match(/^-\s+(.+)$/);
      if (bulletMatch) {
        learningGoals.push(bulletMatch[1].trim());
        i++;
        continue;
      }
      // 空行: スキップ
      if (line.trim() === "") {
        i++;
        continue;
      }
      // bullet でも空行でもない: 学習ゴール終了 → postGoals に遷移
      state = "postGoals";
      bodyLines.push(line);
      i++;
      continue;
    }

    if (state === "postGoals") {
      bodyLines.push(line);
      i++;
      continue;
    }
  }

  if (!goalsHeadingFound) {
    throw new Error("Could not find ## この章で学ぶこと heading");
  }
  if (learningGoals.length === 0) {
    throw new Error("Could not extract any learning goals");
  }

  // body の整形:
  // - 先頭の "---" 区切りを 1 つだけ落とす（学習ゴール直後の `---` を除去）
  // - 末尾の余分な空行を削除
  let body = bodyLines.join("\n");

  // 先頭の連続空行を削除
  body = body.replace(/^\n+/, "");

  // 学習ゴール直後の `---` 区切りを 1 つ削除
  body = body.replace(/^---\n+/, "");

  // 連続空行を最大 1 つに圧縮（読みやすさのため）
  body = body.replace(/\n{3,}/g, "\n\n");

  // 末尾整形
  body = body.trimEnd() + "\n";

  return { title, learningGoals, required, body };
}

/**
 * excerpt を本文から自動生成
 * 最初の段落（連続する非空行）の先頭 120 文字程度を抜き出す
 */
function generateExcerpt(body) {
  const lines = body.split("\n");
  const paragraphLines = [];
  let started = false;
  for (const line of lines) {
    const trimmed = line.trim();
    // 区切り、見出し、bullet、引用、テーブルは skip
    if (
      trimmed === "" ||
      trimmed.startsWith("#") ||
      trimmed.startsWith(">") ||
      trimmed.startsWith("-") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith("```") ||
      trimmed === "---"
    ) {
      if (started) break;
      continue;
    }
    started = true;
    paragraphLines.push(trimmed);
    if (paragraphLines.join("").length > 100) break;
  }
  let excerpt = paragraphLines.join(" ").replace(/\s+/g, " ").trim();
  // 120 文字程度で切る + 末尾の不完全な文を整える
  if (excerpt.length > 120) {
    excerpt = excerpt.slice(0, 117) + "...";
  }
  return excerpt;
}

/**
 * frontmatter YAML を生成
 */
function buildFrontmatter({ phase, part, chapter, title, required, learningGoals, excerpt, updatedAt }) {
  const escapeYamlString = (s) => {
    // ダブルクォートを含む or コロンを含む文字列はクォート + escape
    if (/["\\]/.test(s)) {
      return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `"${s}"`;
  };

  const goalsYaml = learningGoals.map((g) => `  - ${escapeYamlString(g)}`).join("\n");

  return [
    "---",
    `phase: ${phase}`,
    `part: "${part}"`,
    `chapter: ${chapter}`,
    `title: ${escapeYamlString(title)}`,
    `required: ${required}`,
    `learningGoals:`,
    goalsYaml,
    `excerpt: ${escapeYamlString(excerpt)}`,
    `updatedAt: "${updatedAt}"`,
    "---",
    "",
  ].join("\n");
}

/**
 * 単一章ファイルを変換して書き出す
 */
async function processChapter({ sourcePath, filename, phase, partCode }) {
  const content = await readFile(sourcePath, "utf-8");
  const { chapterNum, slug } = parseFilename(filename);
  const { title, learningGoals, required: requiredFromBody, body } = parseChapter(content);

  // 必読フラグ: ファイル名 OR 本文内マーカーのいずれか
  const required = REQUIRED_CHAPTERS.has(filename) || requiredFromBody;

  const excerpt = generateExcerpt(body);
  const updatedAt = new Date().toISOString().slice(0, 10);

  const frontmatter = buildFrontmatter({
    phase,
    part: partCode,
    chapter: chapterNum,
    title,
    required,
    learningGoals,
    excerpt,
    updatedAt,
  });

  const targetDir = path.join(TARGET_BASE, TARGET_CATEGORY, TARGET_LOCALE);
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }
  const targetPath = path.join(targetDir, `${slug}.md`);
  await writeFile(targetPath, frontmatter + body, "utf-8");

  return { slug, chapterNum, title, required, learningGoalsCount: learningGoals.length };
}

async function main() {
  console.log(`Source: ${SOURCE_BASE}`);
  console.log(`Target: ${TARGET_BASE}/${TARGET_CATEGORY}/${TARGET_LOCALE}`);
  console.log("");

  let totalProcessed = 0;
  let totalRequired = 0;

  for (const phaseInfo of PHASE_DIRS) {
    const phaseDir = path.join(SOURCE_BASE, phaseInfo.dir);
    if (!existsSync(phaseDir)) {
      console.warn(`[skip] phase dir not found: ${phaseDir}`);
      continue;
    }

    for (const partInfo of phaseInfo.parts) {
      const partDir = path.join(phaseDir, partInfo.dir);
      if (!existsSync(partDir)) {
        console.warn(`[skip] part dir not found: ${partDir}`);
        continue;
      }

      const files = (await readdir(partDir))
        .filter((f) => /^ch\d+_.+\.md$/.test(f))
        .sort();

      for (const filename of files) {
        try {
          const result = await processChapter({
            sourcePath: path.join(partDir, filename),
            filename,
            phase: phaseInfo.phase,
            partCode: partInfo.code,
          });
          const flag = result.required ? " [必読⚠️]" : "";
          console.log(
            `  Phase ${phaseInfo.phase} ${partInfo.code} ch${result.chapterNum.toString().padStart(2, "0")} → ${result.slug}.md${flag}`,
          );
          if (result.required) totalRequired++;
          totalProcessed++;
        } catch (err) {
          console.error(`[error] ${filename}: ${err.message}`);
        }
      }
    }
  }

  console.log("");
  console.log(`Done. Processed ${totalProcessed} chapters (${totalRequired} required).`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
