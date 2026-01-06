import fs from 'fs';
import path from 'path';

export interface Step {
  action: 'goto' | 'assertVisible';
  value: string;
}

export interface Scenario {
  name: string;
  steps: Step[];
}

export function loadManualScenarios(): Scenario[] {
  const dir = path.join(process.cwd(), 'tests/specs');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.spec.json'))
    .flatMap(f =>
      JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')).scenarios
    );
}

export function autoScenarioForRoute(route: string): Scenario {
  return {
    name: `Page loads: ${route}`,
    steps: [
      { action: 'goto', value: route },
      { action: 'assertVisible', value: 'body' }
    ]
  };
}
