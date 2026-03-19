import { test, expect, devices } from '@playwright/test';
import { Page } from '@playwright/test';
import { getTestingUrl } from '../../utils/getTestingUrl';
import { next, selectAge, selectName, enterEmailAndContinue } from '../../helpers/wf.helper';

test.use({
  ...devices[process.env.DEVICE as string],
});

async function completeInitialQuestions(page: Page, yesNoAnswers: boolean[]) {
  await page.getByRole('button', { name: 'Purees' }).click();
  await next(page);
  await page.getByRole('button', { name: yesNoAnswers[0] ? 'Yes' : 'No' }).click();
  await page.getByRole('link', { name: 'Got it' }).click();
  await page.getByRole('button', { name: yesNoAnswers[1] ? 'Yes' : 'No' }).click();
  await next(page);
  await page.getByRole('link', { name: 'Got it' }).click();
  await page.getByRole('button', { name: yesNoAnswers[2] ? 'Yes' : 'No' }).click();
  await page.getByRole('link', { name: 'Got it' }).click();
  await page.getByRole('button', { name: yesNoAnswers[3] ? 'Yes' : 'No' }).click();
  await page.getByRole('link', { name: 'Got it' }).click();
}

async function completeTopConcerns(page: Page, topConcern: string = 'Baby not eating') {
  await page.waitForURL(new RegExp(`/top-concerns`), { timeout: 60_000 });
  await page.getByRole('button', { name: topConcern }).click();
  await next(page);
  await page.getByRole('link', { name: 'Let\'s go' }).click();
}

const testCases: [boolean[], string, string, boolean][] = [
  [[false, false, false, false], 'Baby not eating', 'baby not eating', false],
  [[true, false, false, false], 'Nutrition', 'nutrition', true],
  [[false, true, false, false], 'Picky eating guidance', 'picky eating guidance', true],
  [[true, false, true, false], 'Introducing food allergens', 'introducing food allergens', true],
  [[true, true, true, true], 'Minimizing the mess', 'minimizing the mess', true],
];

for (const [yesNoAnswers, topConcern, concernText, planReady] of testCases) {
  test(`${yesNoAnswers.join(', ')} ${topConcern} ${concernText} ${planReady ? 'plan ready' : 'plan not ready'}`, async ({ page }) => {
    const childName = 'Mary';
    await page.goto(getTestingUrl('orange/birth-date'));
   
    await selectAge(page);
  
    await next(page, 'link');
    await selectName(page, childName);
    await next(page, 'link');
    
    await completeInitialQuestions(page, yesNoAnswers);
    await completeTopConcerns(page, topConcern);
    await page.waitForTimeout(2000);
    await page.goto(getTestingUrl('orange/enter-email')); 
    const email = await enterEmailAndContinue(page);
    await page.waitForTimeout(2000);

    if (planReady) {
      expect(page.url()).toContain('/personal-plan-ready');
    } else {
      expect(page.url()).toContain('/personal-plan-not-ready');
    }

    await page.getByText(concernText).isVisible();
  });
}
