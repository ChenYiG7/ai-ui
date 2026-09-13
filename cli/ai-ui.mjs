#!/usr/bin/env node
/**
 * AI-UI 组件安装器:从任意静态部署的词典站点拉取组件清单,写入本地项目。
 *
 * 用法:
 *   ai-ui add <slug...> [--root <项目根>] [--force] [--registry <url>]
 *   ai-ui list
 *   ai-ui search <关键词...>
 *
 * 站点为纯静态导出,清单即 /api/registry/<slug> 返回的 JSON;
 * --registry 缺省读环境变量 AIUI_REGISTRY,再缺省用站点的正式域名。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_REGISTRY = 'https://ai-ui.example.com';

const HELP = `AI-UI · 前端组件词典安装器

用法:
  ai-ui add <slug...>     安装组件到项目(写入 src/components/ui/,提示安装依赖)
  ai-ui list              列出词典全部条目
  ai-ui search <词...>    按关键词(名称/描述/标签)过滤条目

选项:
  --root <dir>       目标项目根目录(默认当前目录)
  --registry <url>   词典站点地址(默认 AIUI_REGISTRY 环境变量,再默认 ${DEFAULT_REGISTRY})
  --force            目标文件已存在时覆盖
  -h, --help         显示本帮助

示例:
  ai-ui add magnetic-button shimmer-button
  ai-ui add aurora-background --registry http://localhost:3000
`;

function parseArgs(argv) {
  const opts = { _: [], root: process.cwd(), registry: process.env.AIUI_REGISTRY || DEFAULT_REGISTRY, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '--force') opts.force = true;
    else if (a === '--root') opts.root = path.resolve(argv[++i] ?? '');
    else if (a === '--registry') opts.registry = (argv[++i] ?? '').replace(/\/+$/, '');
    else if (a.startsWith('-')) throw new Error(`未知选项:${a}`);
    else opts._.push(a);
  }
  return opts;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`请求失败 ${res.status}:${url}`);
  return res.json();
}

function slugUrl(registry, slug) {
  return `${registry}/api/registry/${encodeURIComponent(slug)}`;
}

async function add(opts, slugs) {
  if (slugs.length === 0) throw new Error('add 需要至少一个 slug,先用 `ai-ui list` 查看可用条目');
  const installed = [];

  for (const slug of slugs) {
    const manifest = await fetchJson(slugUrl(opts.registry, slug));
    if (!manifest) {
      console.error(`✗ 未找到「${slug}」。用 \`ai-ui search ${slug}\` 或 \`ai-ui list\` 确认 slug。`);
      process.exitCode = 1;
      continue;
    }
    let wrote = false;
    for (const file of manifest.files) {
      const target = path.join(opts.root, file.path);
      if (!opts.force && (await exists(target))) {
        console.error(`✗ ${target} 已存在(用 --force 覆盖),跳过「${slug}」。`);
        process.exitCode = 1;
        continue;
      }
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, file.content + '\n', 'utf8');
      console.log(`✓ 写入 ${target}(${manifest.title} ${manifest.name})`);
      wrote = true;
    }
    if (wrote) installed.push(manifest);
  }

  const deps = [...new Set(installed.flatMap((m) => m.dependencies))];
  if (deps.length > 0) {
    console.log('\n安装依赖:');
    console.log(`  pnpm add ${deps.join(' ')}`);
  }
  if (installed.length > 0) {
    console.log('\n组件按深色展台设计,请放置在深色背景容器中使用。集成示例见词典详情页或清单中的 usage 字段。');
  }
}

async function exists(p) {
  try { await readFile(p); return true; } catch { return false; }
}

async function textList(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`请求失败 ${res.status}:${url}`);
  return res.text();
}

async function list(opts) {
  const text = await textList(`${opts.registry}/llms.txt`);
  const lines = text.split('\n').filter((l) => l.startsWith('- ['));
  console.log(`AI-UI 组件词典(${lines.length} 条,来自 ${opts.registry}):\n`);
  console.log(lines.map((l) => l.replace(/ \[提示词\]\([^)]*\) \[JSON\]\([^)]*\)/, '')).join('\n'));
}

async function search(opts, words) {
  if (words.length === 0) throw new Error('search 需要至少一个关键词');
  const text = await textList(`${opts.registry}/llms.txt`);
  const hits = text.split('\n').filter(
    (l) => l.startsWith('- [') && words.every((w) => l.toLowerCase().includes(w.toLowerCase())),
  );
  if (hits.length === 0) {
    console.log('没有匹配的条目,换个关键词试试。');
    return;
  }
  console.log(`匹配 ${hits.length} 条:\n`);
  for (const h of hits) {
    const slug = h.match(/\(\/c\/([^)]+)\)/)?.[1];
    console.log(h.replace(/ \[提示词\]\([^)]*\) \[JSON\]\([^)]*\)/, ''));
    if (slug) console.log(`  → ai-ui add ${slug}`);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || opts._.length === 0) {
    console.log(HELP);
    return;
  }
  const [cmd, ...rest] = opts._;
  if (cmd === 'add') await add(opts, rest);
  else if (cmd === 'list') await list(opts);
  else if (cmd === 'search') await search(opts, rest);
  else throw new Error(`未知命令「${cmd}」,可用:add / list / search`);
}

main().catch((err) => {
  console.error(`✗ ${err.message}`);
  process.exit(1);
});
