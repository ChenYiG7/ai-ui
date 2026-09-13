#!/usr/bin/env node
/**
 * PostToolUse hook:src/registry 下的每次写入后立即跑注册表秒级校验,
 * 约定类错误当场回报给模型(省掉一整轮 pnpm test/build 的往返 token)。
 * 其他路径静默放行;本钩子自身绝不写文件。
 */
'use strict';
const path = require('node:path');
const { spawnSync } = require('node:child_process');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  try {
    const { tool_input } = JSON.parse(input || '{}');
    const fp = tool_input && tool_input.file_path ? path.resolve(tool_input.file_path) : '';
    const root = path.resolve(__dirname, '..', '..'); // .claude/hooks → 项目根
    if (!fp || !fp.startsWith(path.join(root, 'src', 'registry') + path.sep)) process.exit(0);

    const r = spawnSync('pnpm', ['registry:check', '--quiet'], {
      cwd: root,
      encoding: 'utf8',
      shell: true,
      timeout: 60_000,
      windowHide: true,
    });
    if (r.status !== 0) {
      const out = ((r.stdout || '') + (r.stderr || '')).trim();
      console.error(out.split('\n').slice(-40).join('\n'));
      process.exit(2); // exit 2 = 把 stderr 反馈给模型,当场修
    }
  } catch {
    // 解析失败等异常一律放行,不阻塞正常工作流
  }
  process.exit(0);
});
