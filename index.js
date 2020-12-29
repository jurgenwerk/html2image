const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();

  const urls = readLines("urls.txt");

  const urlBatches = batches(urls, 5);
  for (const urlBatch of urlBatches) {
    console.log(`Processing batch...`);
    await processUrls(browser, urlBatch);
  }

  await browser.close();
})();

async function processUrls(browser, urls) {
  await Promise.all(urls.map((url) => processUrl(browser, url)));
}

async function processUrl(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3 });
  await page.goto(url);

  // IMPLEMENT: find the shareable element, or bring up the intended slide by injecting some JS, then screenshot it
  await page.waitForTimeout(3000);

  await page.screenshot({ path: `images/${imageFilename(url)}.png` });
  await page.close();
}

function imageFilename(url) {
  // Takes the id from url like https://a.b.com/1
  return url.split("/").slice(-1)[0];
}

function readLines(file) {
  return fs
    .readFileSync(file)
    .toString()
    .split("\n")
    .filter((row) => row != ""); // Get rid of the empty last line
}

function batches(array, batchSize) {
  let batches = [],
    i = 0,
    n = array.length;

  while (i < n) {
    batches.push(array.slice(i, (i += batchSize)));
  }

  return batches;
}
