import { test, expect, devices } from '@playwright/test';
import { Page } from '@playwright/test';
import { getTestingUrl } from '../../utils/getTestingUrl';
import { next } from '../../helpers/wf.helper';
import { selectAge, selectGender, selectName, enterEmailAndContinue } from '../../helpers/wf.helper';

test.use({
  ...devices[process.env.DEVICE as string],
});

const testCases: [string, string, string, string[], string[], string, string][] = [
  ['Girl', '6 months', 'Spoon feeding', ['Interested in food you\'re'], ['Hold their head upright', 'Sit upright with little or no support', 'Bring a toy to mouth while sitting'],'My family\'s favorite foods', 'Preventing choking'],
  ['Boy', '11 months', 'Baby-led weaning', ['Interested in food you\'re'], ['Hold their head upright', 'Sit upright with little or no support', 'Bring a toy to mouth while sitting'], 'Just the basics', 'Meal planning/cooking'],
  ['Girl','8 months', 'both', ['Hold their head upright', 'Sit upright with little or no support'], ['Interested in food you\'re', 'Bring a toy to mouth while sitting'], 'My family\'s favorite foods', 'Learning about nutrition'],
  ['Boy', '5 months', 'I\'m not sure yet', ['Hold their head upright', 'Sit upright with little or no support', 'Bring a toy to mouth while sitting'], ['Interested in food you\'re'], 'New foods to try together', 'Knowing how to start'],
  ['Girl', '10 months', 'I\'m not sure yet', ['Hold their head upright and steady', 'Sit upright with little or no support', 'Bring a toy to mouth while sitting', 'Interested in food you\'re'], [], 'Just the basics', 'Introducing allergens'],
  ['Girl', 'Under 5 months', 'Spoon feeding', ['Interested in food you\'re'], ['Hold their head upright', 'Sit upright with little or no support', 'Bring a toy to mouth while sitting'], 'My family\'s favorite foods', 'Preventing choking'],
  ['Boy', '12 months+', 'Baby-led weaning', ['Hold their head upright and steady', 'Sit upright with little or no support', 'Bring a toy to mouth while sitting', 'Interested in food you\'re'], [], 'Just the basics', 'Introducing allergens']
]

function getBorderAge(age: string): string {
  if (age === 'Under 5 months') {
    return '4 months';
  } else if (age === '12 months+') {
    return '13 months';
  } else {
    return age;
  }
}

async function clickButtons(page: Page, texts: string[]) {
  for (const text of texts) {
    await page.getByRole('button', { name: text }).click();
  }
}

for (const [gender, age, feedingStyle, readiness, readinessText, favoriteFoods, topConcern] of testCases) {
  test (`personal plan banana ${age} ${feedingStyle} ${readiness.join(', ')} ${favoriteFoods} ${topConcern}`, async ({ page }) => {
    const childName = 'Mary';
    await page.goto(getTestingUrl('banana/gender'));
    await selectGender(page, gender);

    await selectAge(page, age);
    await next(page, 'link');
    await page.getByRole('button', { name: feedingStyle }).click();
    await next(page, 'button');
    await page.getByRole('link', { name: 'Got it' }).click();
    await selectName(page, childName);

    await page.goto(getTestingUrl('banana/readiness'));
    await clickButtons(page, readiness);
    await next(page, 'button');
    
    await page.goto(getTestingUrl('banana/food-intro-preferences'));
    await page.getByRole('button', { name: favoriteFoods }).click();
    await next(page, 'link');

    await page.waitForTimeout(2000);
    await page.goto(getTestingUrl('banana/top-concerns'));
    await page.getByRole('button', { name: topConcern }).click();
    await next(page, 'button');
    await next(page, 'link');
    await page.waitForTimeout(2000);
    await next(page, 'link');
    const email = await enterEmailAndContinue(page);
    await page.waitForTimeout(2000);
    await next(page, 'link');

    await page.getByText(gender).isVisible();
    await page.getByText(getBorderAge(age)).isVisible();
    await page.getByText(feedingStyle).isVisible();
    if (readinessText.length) {
      await page.getByText(readinessText.join(', ')).isVisible();
    }
    await page.getByText(favoriteFoods).isVisible();
    await page.getByText(topConcern).isVisible();
  });
}