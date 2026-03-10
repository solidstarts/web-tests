import { test, devices } from '@playwright/test';
import { getTestingUrl } from '../../utils/getTestingUrl';
import { getCardDetails } from '../../utils/getCardNumber';
import { Page } from '@playwright/test';
import { CreditCard } from '../../utils/getCardNumber';
import { selectName,selectGender, next, completeAllergyQuestions, completeEczemaQuestions, meetDoctor, medicalConcers, completeSuppliments, enterEmailAndContinue,completeDietaryRestrictions, handlePersonalPlanAndPayment, payment, signUp } from '../../helpers/wf.helper';

test.use({
  ...devices[process.env.DEVICE as string],
});

const childName = 'Mary'
const shouldPay = process.env.SHOULD_PAY === 'true'

test('test', async ({ page }) => {
  await wfTestBanana(page, getTestingUrl('banana/welcome', {
    pw: 'green'
  }), childName, getCardDetails(), [6.99, 3.49], shouldPay);
});

async function wfTestBanana(page: Page, url: string, childName: string, cardDetails: CreditCard, priceAfterDiscount: [number, number], shouldPay: boolean=true) {
  await page.goto(url);
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Yes - first baby' }).click();
  await next(page, 'link');
  await selectGender(page, 'Girl');
  await page.getByRole('button', { name: '6 months' }).click();
  await next(page, 'link');
  await page.getByRole('button', { name: 'Spoon feeding' }).click();
  await next(page, 'button');
  await page.getByRole('link', { name: 'Got it' }).click();
  await selectName(page, childName);
  await page.waitForURL(new RegExp(`/who-are-you`), { timeout: 60_000 });
  await page.getByRole('button', { name: 'Mom' }).click();
  await next(page, 'button');
  await next(page, 'link');
  await page.getByRole('button', { name: 'Interested in food you\'re' }).click();
  await next(page, 'button');
  await next(page, 'link'); 
  await page.getByRole('button', { name: 'Yes' }).click();
  await next(page, 'link');
  await completeAllergyQuestions(page);
  await next(page, 'link');
  await completeEczemaQuestions(page, false, 'button');
  await page.getByRole('button', { name: 'Formula' }).click();
  await next(page, 'button');
  await page.getByRole('link', { name: 'Got it' }).click();
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByRole('button', { name: 'Iron' }).click();
  await next(page, 'button');
  await page.getByRole('link', { name: 'Let\'s go' }).click();
  await page.waitForURL(new RegExp(`/solids-started`), { timeout: 60_000 });
  await page.getByRole('button', { name: 'Finger foods' }).click();
  await page.getByRole('button', { name: 'Purees' }).click();
  await page.getByRole('button', { name: 'Allergens' }).click();
  await next(page, 'button');
  await page.getByRole('slider', { name: 'How many foods have they' }).fill('7');
  await next(page, 'button');
  await page.getByRole('button', { name: 'Many times' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await next(page, 'link');
  await completeDietaryRestrictions(page);
  await page.getByRole('button', { name: 'Reflux' }).click();
  await page.getByRole('button', { name: 'Oral restriction' }).click();
  await next(page);
  await next(page, 'link');
  await page.getByRole('button', { name: 'My family\'s favorite foods' }).click();
  await next(page, 'link');
  await page.getByRole('button', { name: 'I know a thing or two' }).click();
  await next(page, 'link');
  await page.getByRole('button', { name: 'Once in a while' }).click();
  await next(page, 'link');
  await page.getByRole('button', { name: '30 minutes' }).click();
  await next(page, 'button');
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('button', { name: 'A few times a week' }).click();
  await next(page, 'button');
  await page.getByRole('button', { name: 'I ask friends for help' }).click();
  await next(page, 'button');
  await page.getByRole('button', { name: 'Preventing choking' }).click();
  await next(page, 'button');
  await next(page, 'link');
  await page.waitForTimeout(2000);
  await next(page, 'link');
  const email = await enterEmailAndContinue(page);
  await page.waitForTimeout(2000);
  await next(page, 'link');
  await handlePersonalPlanAndPayment(page, email, cardDetails, priceAfterDiscount, shouldPay);
  // await payment(page, cardDetails);
  // await signUp(page, email);
  // await page.waitForURL(new RegExp(`/download-signup-paid`), { timeout: 60_000 });

}



  // await page.getByRole('button', { name: 'Yes' }).click();
  // await page.getByRole('button', { name: 'Yes - first baby' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Girl' }).click();
  // await page.getByRole('button', { name: '6 months' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Spoon feeding' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Got it' }).click();
  // await page.getByRole('textbox', { name: 'Type Name' }).click();
  // await page.getByRole('textbox', { name: 'Type Name' }).fill('mary');
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Mom' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Interested in food you\'re' }).click();
  // await page.getByRole('button', { name: 'Hold their head upright and' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Yes' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Fish', exact: true }).click();
  // await page.getByRole('button', { name: 'Wheat' }).click();
  // await page.getByRole('button', { name: 'Egg' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'I\'m not sure' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Got it' }).click();
  // await page.getByRole('button', { name: 'Formula' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Got it' }).click();
  // await page.getByRole('button', { name: 'No' }).click();
  // await page.getByRole('button', { name: 'Iron' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Let\'s go' }).click();
  // await page.getByRole('button', { name: 'Finger foods' }).click();
  // await page.getByRole('button', { name: 'Purees' }).click();
  // await page.getByRole('button', { name: 'Allergens' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('slider', { name: 'How many foods have they' }).fill('7');
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Many times' }).click();
  // await page.getByRole('button', { name: 'Yes' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Kosher' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Oral restriction' }).click();
  // await page.getByRole('button', { name: 'Constipation' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'My family\'s favorite foods' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'I know a thing or two' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Once in a while' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('button', { name: '30 minutes' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Yes' }).click();
  // await page.getByRole('button', { name: 'A few times a week' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'I ask friends for help' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('button', { name: 'Preventing choking' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.getByRole('link', { name: 'Next' }).click();
  // await page.locator('.flex.h-12').click();
  // await page.getByRole('textbox', { name: 'Email' }).fill('mary@solidstarts.com');
  // await page.getByRole('button', { name: 'Next' }).click();
  