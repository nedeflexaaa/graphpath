import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const theme = process.argv[2] === 'dark' ? 'dark' : 'light';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(projectRoot, 'screenshots', theme);
await mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);

page.on('console', (message) => {
  if (message.type() === 'error') {
    console.log('CONSOLE ERROR:', message.text());
  }
});
page.on('pageerror', (error) => {
  console.log('PAGE ERROR:', error.message);
});

async function preparePage() {
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
  await page.addStyleTag({
    content: `
      .skip-link { display: none !important; }
      html { scroll-behavior: auto !important; }
    `,
  });
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
    const height = document.body.scrollHeight;

    for (let y = 0; y < height; y += 650) {
      window.scrollTo(0, y);
      await wait(70);
    }

    window.scrollTo(0, 0);
    await wait(200);

    await Promise.all(
      [...document.images].map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
            }),
      ),
    );
  });
}

async function screenshot(name, target = page) {
  await target.screenshot({ path: path.join(outputDir, name) });
}

await preparePage();
await page.screenshot({ path: path.join(outputDir, 'home.png'), fullPage: true });
await screenshot('hero.png');

await page.addStyleTag({
  content: `.site-header { display: none !important; }`,
});

const visualizer = await page.$('#visualizer');
if (visualizer) {
  await screenshot('workspace.png', visualizer);
}

await page.click('#visualizer .control-actions .btn--primary');
await new Promise((resolve) => setTimeout(resolve, 1100));
if (visualizer) {
  await screenshot('workspace-running.png', visualizer);
}

await page.click('#visualizer .control-actions .btn--ghost');
const stepButton = await page.$('#visualizer .control-actions .btn--secondary');
if (stepButton) {
  for (let index = 0; index < 30; index += 1) {
    const hasResult = await page.$('#visualizer .result-banner');
    if (hasResult) {
      break;
    }
    await stepButton.click();
    await new Promise((resolve) => setTimeout(resolve, 70));
  }
}

if (visualizer) {
  await screenshot('workspace-result.png', visualizer);
}

const mobile = await browser.newPage();
await mobile.setViewport({
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
await mobile.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
await mobile.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0' });
await mobile.addStyleTag({
  content: `
    .skip-link { display: none !important; }
    html { scroll-behavior: auto !important; }
  `,
});
await mobile.evaluate(async () => {
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const height = document.body.scrollHeight;

  for (let y = 0; y < height; y += 600) {
    window.scrollTo(0, y);
    await wait(60);
  }

  window.scrollTo(0, 0);
  await wait(200);

  await Promise.all(
    [...document.images].map((image) =>
      image.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
          }),
    ),
  );
});
await mobile.screenshot({
  path: path.join(outputDir, 'home-mobile.png'),
  fullPage: true,
});
await mobile.addStyleTag({ content: '.site-header { display: none !important; }' });
const mobileVisualizer = await mobile.$('#visualizer');
if (mobileVisualizer) {
  await mobileVisualizer.screenshot({
    path: path.join(outputDir, 'workspace-mobile.png'),
  });
}

await browser.close();
console.log(`Screenshots saved to ${outputDir}`);
