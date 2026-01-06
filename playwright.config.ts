import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },

  webServer: {
    command: 'infisical run -- npm run dev',
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  }
});
