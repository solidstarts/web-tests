import { test, expect, devices } from '@playwright/test';
import { Page } from '@playwright/test';
import { getTestingUrl } from '../../../utils/getTestingUrl';
import { next, selectBirthDate } from '../../../helpers/wf.helper';

test.use({
  ...devices[process.env.DEVICE as string],
});

function getBirthDateForMonthsAgo(monthsAgo: number): { year: string; month: string } {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  const year = d.getFullYear().toString();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[d.getMonth()];
  return { year, month };
}

async function goToPersonalPlanApple(
  page: Page,
  options: { year: string; month: string; topConcern: string }
) {
  await page.goto(getTestingUrl('apple/birth-date'));
  await page.waitForURL(new RegExp(`/apple/birth-date`), { timeout: 10_000 });

  await selectBirthDate(page, options.year, options.month);
  await page.waitForURL(new RegExp(`/apple/(birth-date-info|baby-age-info)`), { timeout: 10_000 });

  await page.goto(getTestingUrl('apple/top-concerns'));
  await page.waitForURL(new RegExp(`/apple/top-concerns`), { timeout: 10_000 });

  await page.getByRole('button', { name: options.topConcern }).click();
  await next(page);
  await page.waitForURL(new RegExp(`/apple/top-concerns-info`), { timeout: 10_000 });

  await page.goto(getTestingUrl('apple/personal-plan'));
  await page.waitForURL(new RegExp(`/apple/personal-plan`), { timeout: 10_000 });
}

const APPLE_AGE_BUCKETS: { label: string; monthsAgo: number; module1: string; module2: string }[] = [
  { label: '0-4 months', monthsAgo: 3, module1: 'Activities to Prep for Solids', module2: 'Readiness to Start Solids' },
  { label: '5-6 months', monthsAgo: 5, module1: "Baby's 100 Foods Plan", module2: 'Infant Rescue: Choking, First Aid & CPR' },
  { label: '7-11 months', monthsAgo: 9, module1: 'Purees to Finger Food Course', module2: 'Skill Building: Chewing, Big Flavors, Pick Up Practice' },
  { label: '12+ months', monthsAgo: 14, module1: 'Help Toddler Try New Foods', module2: 'Weaning Guide' },
];

const APPLE_TOP_CONCERN_TO_MODULE: [string, string][] = [
  ['How to start', 'How to Start Solids Course'],
  ['Preventing choking', 'Gagging vs Choking'],
  ['Introducing food allergens', 'Introduction to Allergens'],
  ['Nutrition', 'Iron-Rich Foods for Babies'],
  ['Baby not eating', 'Handling Food Refusal'],
  ['Meal planning/cooking', 'Build Your Meal Plan & Shopping List'],
  ['Building a feeding schedule', 'Baby Feeding Schedules'],
  ['Picky eating guidance', 'Picky Eating: When to Get Help'],
  ['Minimizing the mess', 'Minimizing the Mess with BLW'],
  ['Purees to finger foods', 'Transitioning to Independent Eating'],
];

test.describe('apple: personal-plan validation', () => {
  for (const { label, monthsAgo, module1, module2 } of APPLE_AGE_BUCKETS) {
    test(`first 2 modules are age-based for ${label}: ${module1}, ${module2}`, async ({ page }) => {
      const { year, month } = getBirthDateForMonthsAgo(monthsAgo);
      await goToPersonalPlanApple(page, { year, month, topConcern: 'How to start' });
      await page.waitForURL(new RegExp(`/apple/personal-plan`), { timeout: 10_000 });
      await expect(page.getByText(module1)).toBeVisible();
      await expect(page.getByText(module2)).toBeVisible();
      await expect(page.getByText('How to Start Solids Course')).toBeVisible();
    });
  }

  for (const [topConcernButton, thirdModuleTitle] of APPLE_TOP_CONCERN_TO_MODULE) {
    test(`3rd module = top concern "${topConcernButton}" → ${thirdModuleTitle}`, async ({ page }) => {
      const { year, month } = getBirthDateForMonthsAgo(5);
      await goToPersonalPlanApple(page, { year, month, topConcern: topConcernButton });
      await page.waitForURL(new RegExp(`/apple/personal-plan`), { timeout: 10_000 });
      await expect(page.getByText("Baby's 100 Foods Plan")).toBeVisible();
      await expect(page.getByText('Infant Rescue: Choking, First Aid & CPR')).toBeVisible();
      await expect(page.getByText(thirdModuleTitle)).toBeVisible();
    });
  }
});
