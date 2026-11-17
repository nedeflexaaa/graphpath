import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const diagramDir = path.join(projectRoot, 'docs', 'diagrams');
const outputDir = path.join(diagramDir, 'png');
await mkdir(outputDir, { recursive: true });

const diagrams = [
  { file: 'user-flow.html', output: 'user-flow.png', width: 1000, height: 700 },
  { file: 'state-diagram.html', output: 'state-diagram.png', width: 1160, height: 600 },
  { file: 'wireframe-desktop.html', output: 'wireframe-desktop.png', width: 1240, height: 900 },
  { file: 'wireframe-mobile.html', output: 'wireframe-mobile.png', width: 520, height: 900 },
];

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb'],
});

for (const diagram of diagrams) {
  const page = await browser.newPage();
  await page.setViewport({
    width: diagram.width,
    height: diagram.height,
    deviceScaleFactor: 2,
  });
  await page.goto(pathToFileURL(path.join(diagramDir, diagram.file)).href, {
    waitUntil: 'networkidle0',
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => window.setTimeout(resolve, 120));
  });
  await page.addStyleTag({
    content: `
      html, body { scrollbar-width: none; }
      ::-webkit-scrollbar { display: none; }
    `,
  });
  await page.screenshot({
    path: path.join(outputDir, diagram.output),
    fullPage: true,
  });
  await page.close();
  console.log(`Captured ${diagram.output}`);
}

await browser.close();
