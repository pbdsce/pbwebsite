import fs from 'fs';
import path from 'path';
import { Scenario } from '../planner/planner';

function selectorToCode(selector: string): string {
  if (selector === 'body') return `page.locator('body')`;

  if (selector.includes('>>')) {
    const [scope, inner] = selector.split('>>').map(s => s.trim());
    return `page.locator('${scope}').${selectorToCode(inner).replace('page.', '')}`;
  }

  if (selector.startsWith('role=')) {
    const m = selector.match(/role=(\w+)\[name="(.+)"\]/);
    return `page.getByRole('${m![1]}', { name: '${m![2]}' })`;
  }

  return `page.locator('${selector}')`;
}

export function generateTest(scenario: Scenario) {
  const slug = scenario.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const outDir = path.join(process.cwd(), 'tests/e2e/generated');
  fs.mkdirSync(outDir, { recursive: true });

  const file = path.join(outDir, `${slug}.spec.ts`);

  let code = `
import { test, expect } from '@playwright/test';

test('${scenario.name}', async ({ page }) => {
`;

  for (const step of scenario.steps) {
    if (step.action === 'goto') {
      code += `  await page.goto('${step.value}');\n`;
    }
    if (step.action === 'assertVisible') {
      code += `  await expect(${selectorToCode(step.value)}).toBeVisible();\n`;
    }
  }

  code += `
  await page.screenshot({
    path: 'screenshots/${slug}.png',
    fullPage: true
  });
});
`;

  fs.writeFileSync(file, code);
}
