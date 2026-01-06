import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { discoverRoutes } from './crawler/crawler';
import { loadManualScenarios, autoScenarioForRoute } from './planner/planner';
import { generateTest } from './generator/generator';


if (!process.env.ENABLE_MCP) {
  console.log('ℹ MCP disabled. Set ENABLE_MCP=true to run.');
  process.exit(0);
}


function isValidRoute(route: string) {
  return route.startsWith('/') && !route.includes('...') && !route.includes('.pdf');
}

async function runMCP() {
  const baseURL = 'http://localhost:3000';

  // cleaning old generated tests
  const genDir = path.join(process.cwd(), 'tests/e2e/generated');
  if (fs.existsSync(genDir)) {
    fs.rmSync(genDir, { recursive: true, force: true });
  }
  fs.mkdirSync(genDir, { recursive: true });

  // cleaning old screenshots
  const screenshotsDir = path.join(process.cwd(), 'test-results/screenshots');
  if (fs.existsSync(screenshotsDir)) {
    fs.rmSync(screenshotsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(screenshotsDir, { recursive: true });

  console.log(' Discovering routes...');
  const discovered = await discoverRoutes(baseURL);
  const routes = Array.from(new Set(discovered.filter(isValidRoute)));

  const manual = loadManualScenarios();
  const auto = routes.map(autoScenarioForRoute);
  const scenarios = [...manual, ...auto];

  console.log(`Generating ${scenarios.length} tests...`);
  scenarios.forEach(generateTest);

  console.log('Running Playwright...');
  let status = 'SUCCESS';

  try {
    execSync('npx playwright test', { stdio: 'inherit' });
  } catch {
    status = 'PARTIAL_FAILURE';
    console.warn(' Some tests failed.');
  }

  fs.writeFileSync(
    'mcp-results.json',
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        routesTested: routes.length,
        manualScenarios: manual.length,
        autoScenarios: auto.length,
        totalTests: scenarios.length,
        status
      },
      null,
      2
    )
  );
}

runMCP();
