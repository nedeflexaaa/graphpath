import puppeteer from 'puppeteer-core';

const URL = 'http://127.0.0.1:5173/';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb'],
});

const page = await browser.newPage();
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => pageErrors.push(error.message));
page.on('requestfailed', (request) => failedRequests.push(`${request.url()} :: ${request.failure()?.errorText}`));

function assert(condition, message) {
  if (!condition) throw new Error(message);
  console.log(`PASS  ${message}`);
}

async function clickButton(text) {
  const clicked = await page.evaluate((label) => {
    const button = [...document.querySelectorAll('button')].find((item) =>
      item.textContent.replace(/\s+/g, ' ').trim().includes(label),
    );
    if (!button) return false;
    button.click();
    return true;
  }, text);
  assert(clicked, `button "${text}" found`);
}

async function waitForResult(timeout = 30000) {
  await page.waitForFunction(
    () => Boolean(document.querySelector('.result-banner')),
    { timeout },
  );
  return page.evaluate(() => ({
    text: document.querySelector('.result-banner')?.innerText ?? '',
    status: document.querySelector('.status-pill')?.innerText ?? '',
  }));
}

await page.setViewport({ width: 1440, height: 1000 });
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
await page.goto(URL, { waitUntil: 'networkidle0' });
await page.waitForSelector('.graph-node');

assert((await page.title()).includes('GraphPath'), 'page title is GraphPath');
assert((await page.$$('.graph-node')).length === 7, 'city graph has 7 nodes');
assert((await page.$$('.graph-edge')).length === 10, 'city graph has 10 edges');

await page.evaluate(async () => {
  for (const image of document.images) {
    image.scrollIntoView({ block: 'center' });
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  window.scrollTo(0, 0);
  await new Promise((resolve) => setTimeout(resolve, 300));
});

const imageStatus = await page.evaluate(() =>
  [...document.images].map((image) => ({
    src: image.currentSrc || image.src,
    loaded: image.complete && image.naturalWidth > 0,
  })),
);
assert(imageStatus.every((item) => item.loaded), 'all page images loaded');
assert(imageStatus.length >= 5, 'real photos are present');

const initial = await page.evaluate(() => ({
  start: document.querySelectorAll('.control-panel select')[0]?.value,
  end: document.querySelectorAll('.control-panel select')[1]?.value,
  algorithm: [...document.querySelectorAll('.algorithm-switch button')]
    .find((button) => button.getAttribute('aria-pressed') === 'true')?.innerText,
}));
assert(initial.start === 'a', 'default start is Вокзал');
assert(initial.end === 'e', 'default finish is Лікарня');
assert(initial.algorithm === 'Dijkstra', 'default algorithm is Dijkstra');

await clickButton('Запустити');
const dijkstraResult = await waitForResult();
assert(dijkstraResult.text.includes('Вокзал'), 'Dijkstra result includes start');
assert(dijkstraResult.text.includes('Лікарня'), 'Dijkstra result includes finish');
assert(dijkstraResult.text.includes('7'), 'Dijkstra cost is 7');
assert(dijkstraResult.status.includes('Завершено'), 'status changes to Завершено');
console.log(`RESULT Dijkstra: ${dijkstraResult.text.replace(/\n/g, ' | ')}`);

await clickButton('BFS');
await clickButton('Запустити');
const bfsResult = await waitForResult();
assert(bfsResult.text.includes('Вокзал'), 'BFS result includes start');
assert(bfsResult.text.includes('Лікарня'), 'BFS result includes finish');
assert(bfsResult.text.includes('3'), 'BFS path has 3 edges');
console.log(`RESULT BFS: ${bfsResult.text.replace(/\n/g, ' | ')}`);

await clickButton('Скинути');
await clickButton('Крок');
const stepState = await page.evaluate(() => ({
  result: Boolean(document.querySelector('.result-banner')),
  status: document.querySelector('.status-pill')?.innerText ?? '',
  stepText: document.querySelector('.state-metrics')?.innerText ?? '',
}));
assert(!stepState.result, 'step does not finish the run immediately');
assert(stepState.status.includes('Пауза') || stepState.status.includes('Готово'), 'step keeps a controlled state');
console.log(`STEP: ${stepState.stepText.replace(/\n/g, ' | ')}`);

const themeBefore = await page.evaluate(() => document.documentElement.dataset.theme);
await page.evaluate(() => {
  const button = [...document.querySelectorAll('button')].find((item) =>
    (item.getAttribute('aria-label') || '').includes('тему'),
  );
  button?.click();
});
await new Promise((resolve) => setTimeout(resolve, 120));
const themeAfter = await page.evaluate(() => ({
  theme: document.documentElement.dataset.theme,
  stored: localStorage.getItem('graphpath-theme'),
}));
assert(themeAfter.theme !== themeBefore, 'theme toggle changes data-theme');
assert(themeAfter.stored === themeAfter.theme, 'theme preference is persisted');

await page.setViewport({ width: 390, height: 844 });
await page.reload({ waitUntil: 'networkidle0' });
await page.waitForSelector('.graph-node');
const mobile = await page.evaluate(() => ({
  innerWidth: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  menuVisible: getComputedStyle(document.querySelector('.menu-button')).display !== 'none',
}));
assert(mobile.scrollWidth <= mobile.innerWidth + 1, 'mobile page has no horizontal overflow');
assert(mobile.menuVisible, 'mobile menu button is visible');
await page.click('.menu-button');
const navOpen = await page.evaluate(() =>
  document.querySelector('#main-navigation')?.classList.contains('site-nav--open'),
);
assert(navOpen, 'mobile navigation opens');

await page.setViewport({ width: 1440, height: 1000 });
await page.reload({ waitUntil: 'networkidle0' });
await page.waitForSelector('.graph-node');
const keyboard = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll('.graph-node')];
  nodes[1].focus();
  return {
    focused: document.activeElement?.getAttribute('aria-label'),
    nodeCount: nodes.length,
  };
});
assert(keyboard.focused?.includes('Центр'), 'graph nodes are keyboard-focusable');
await page.keyboard.press('Enter');
await new Promise((resolve) => setTimeout(resolve, 80));
const startAfterKeyboard = await page.evaluate(
  () => document.querySelectorAll('.control-panel select')[0]?.value,
);
assert(startAfterKeyboard === 'b', 'Enter on a node changes the start vertex');

assert(consoleErrors.length === 0, 'no console errors');
assert(pageErrors.length === 0, 'no page errors');
assert(failedRequests.length === 0, 'no failed network requests');

console.log('\nQA SUMMARY');
console.log(`console errors: ${consoleErrors.length}`);
console.log(`page errors: ${pageErrors.length}`);
console.log(`failed requests: ${failedRequests.length}`);
if (consoleErrors.length) console.log(consoleErrors);
if (pageErrors.length) console.log(pageErrors);
if (failedRequests.length) console.log(failedRequests);

await browser.close();
