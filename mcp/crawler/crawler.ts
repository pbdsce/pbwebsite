import { chromium } from 'playwright';

const INVALID_EXTENSIONS = ['.pdf', '.zip', '.png', '.jpg', '.jpeg'];

export async function discoverRoutes(baseURL: string): Promise<string[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL);

  const links = await page.$$eval('a[href]', a =>
    a.map(x => x.getAttribute('href') || '')
  );

  await browser.close();

  return Array.from(
    new Set(
      links.filter(
        href =>
          href.startsWith('/') &&
          !href.includes('...') &&
          !INVALID_EXTENSIONS.some(ext => href.endsWith(ext))
      )
    )
  );
}
