const puppeteer = require('puppeteer');
const chromium = require('chrome-aws-lambda');

exports.downloadPdf = async (event) => {
  const { url } = event.queryStringParameters;

  const executablePath = event.isOffline
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : await chromium.executablePath;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
  });

  const pdf = await page.pdf();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/pdf',
    },
    isBase64Encoded: true,
    body: pdf.toString('base64'),
  };
};
