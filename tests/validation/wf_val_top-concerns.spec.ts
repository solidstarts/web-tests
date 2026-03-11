import { test, expect, devices } from '@playwright/test';
import { getTestingUrl } from '../../utils/getTestingUrl';
import { next } from '../../helpers/wf.helper';

test.use({
  ...devices[process.env.DEVICE as string],
});

const appleOrangeOptions: [string, string][] = [
  ['How to start', "You're in the right place!"],
  ['Preventing choking', 'Choking is rare when you do it right'],
  ['Introducing food allergens', 'Waiting increases the risk'],
  ['Nutrition', 'Their iron needs are growing'],
  ['Baby not eating', 'When food refusal happens'],
  ['Meal planning/cooking', 'Leave meal planning to us'],
  ['Building a feeding schedule', 'Avoid too much, too soon'],
  ['Picky eating guidance', 'Eating habits form early'],
  ['Minimizing the mess', 'Control the chaos'],
  ['Purees to finger foods', "Don't get stuck on purees"],
];

const bananaOptions: [string, string][] = [
  ['Knowing how to start', 'Parents like you learned how to start with confidence with us'],
  ['Preventing choking', 'Parents like you learned how to serve any food safely with us'],
  ['Introducing allergens', 'Parents like you learned how to safely introduce allergens with us'],
  ['Learning about nutrition', 'Parents like you learned how to share a variety of foods with us'],
  ['Meal planning/cooking', 'Parents like you found mealtimes easier with us'],
  ['Other', 'Parents like you learned how to start with confidence with us'],
];

type Funnel = 'apple' | 'orange' | 'banana';

function getOptionsForFunnel(funnel: Funnel): [string, string][] {
  if (funnel === 'apple' || funnel === 'orange') {
    return appleOrangeOptions;
  }
  return bananaOptions;
}

const funnels: Funnel[] = ['apple', 'orange','banana'];

for (const funnel of funnels) {
  test(`${funnel}: top concerns options show correct info screen`, async ({ page }) => {
    const options = getOptionsForFunnel(funnel);
    
    await page.goto(getTestingUrl(`${funnel}/top-concerns`));
    await page.waitForURL(new RegExp(`/${funnel}/top-concerns`), { timeout: 10_000 });

    for (const [optionName, expectedText] of options) {
      await page.getByRole('button', { name: optionName }).click();
      await next(page);

      await page.waitForURL(new RegExp(`/${funnel}/top-concerns-info`), { timeout: 10_000 });
      
      await expect(page.getByText(expectedText.replace(/'/g, "'"))).toBeVisible();

      await page.goBack();
      await page.waitForURL(new RegExp(`/${funnel}/top-concerns`), { timeout: 10_000 });
    }
  });
}
