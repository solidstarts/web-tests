import { defineConfig } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export default defineConfig({
  testDir: './tests',
  timeout: 180_000, // 3 minutes to allow for full test flow including waitForURL calls
  retries: 0,
  use: {
    headless: false,
    trace: 'on-first-retry',
    // launchOptions: { slowMo: 3000 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/report.json' }],
  ],
});