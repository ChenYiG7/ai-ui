// README 截图脚本:先 `pnpm dlx serve out -l 4173` 起静态服务,再 `pnpm shots`
// 用系统 Chrome(Playwright channel),无需下载浏览器;动画播完才拍
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:4173';
const shots = [
  { url: '/', file: '.github/assets/preview-home.png' },
  { url: '/c/shimmer-button', file: '.github/assets/preview-detail.png' },
  { url: '/mcp', file: '.github/assets/preview-mcp.png' },
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 2,
});

for (const { url, file } of shots) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000); // 等入场动画播完
  await page.screenshot({ path: file });
  console.log('captured', url, '->', file);
}

await browser.close();
