import { test, expect, devices } from '@playwright/test';
import { getTestingUrl } from '../../utils/getTestingUrl';

test.use({
  ...devices['iPhone 15 Pro Max'],
});

test('test', async ({ page }) => {
  await page.goto(getTestingUrl('apple/welcome'));
//   await page.getByRole('button', { name: 'Boy' }).click();
//   await page.getByRole('button', { name: 'Next' }).click();
    console.log(getAge(9, 'February', 2026));
});

function getAge(day: number, month: string, year: number) {
    const date = new Date(`${month} ${day}, ${year}`);
    const now = new Date();
  
    // Calculate difference in milliseconds
    const diffMs = now.getTime() - date.getTime();
    
    // Calculate differences in various units
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44); // Average days per month
    const diffYears = Math.floor(diffDays / 365.25); // Account for leap years
    
    // Return the largest appropriate unit
    if (diffYears >= 1) {
      return { count: diffYears, counter: 'year' };
    } else if (diffMonths >= 1) {
      return { count: diffMonths, counter: 'month' };
    } else if (diffWeeks >= 1) {
      return { count: diffWeeks, counter: 'week' };
    } else {
      return { count: diffDays, counter: 'day' };
    }
}

