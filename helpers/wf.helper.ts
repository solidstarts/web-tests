import { expect, Page } from "@playwright/test";
import { uniqueEmail } from "../utils/testdata";
import { CreditCard } from "../utils/getCardNumber";

export async function wfTest(page: Page, url: string, childName: string, cardDetails: CreditCard, priceAfterDiscount: [number, number], shouldPay: boolean=true) {
    validateCardDetails(cardDetails);
    
    await page.goto(url);
    await selectGender(page, 'Girl');
    // await selectName(page, childName);
    await selectBirthDate(page);
    await next(page, 'link');
    await page.getByRole('button', { name: 'No' }).click();
    await page.getByRole('img', { name: 'Kim Grenawitzke' }).click();
    await next(page, 'link');
    await completeInitialQuestions(page, false);
    await completeReadinessAssessment(page, true);
    await next(page, 'link');
    await completeAllergyQuestions(page);
    await completeEczemaQuestions(page, false);
    await meetDoctor(page, 'meet-venus');
    await page.getByRole('button', { name: 'Both' }).click();
    await page.getByRole('button', { name: 'Both' }).click();
    await completeSuppliments(page);
    await completeDietaryRestrictions(page);
    await meetDoctor(page, 'meet-doctor-ruiz');
    await medicalConcers(page);
    const email = await enterEmailAndContinue(page);
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Got it' }).click();
    await page.getByText('Guided introduction to 100').click();
    await handlePersonalPlanAndPayment(page, email, cardDetails, priceAfterDiscount, shouldPay);
}

export async function wfTestOrange(page: Page, url: string, childName: string, cardDetails: CreditCard, priceAfterDiscount: [number, number], shouldPay: boolean=true) {
    await page.goto(url);
    await selectGender(page, 'Girl');
    await page.getByRole('button', { name: 'Yes' }).click();
    await selectAge(page);

    await next(page, 'link');
    await selectName(page, childName);
    await next(page, 'link');
    
    await completeInitialQuestions(page, true);
    await completeReadinessAssessment(page, false);
    await completeAllergyQuestions(page);
    await completeEczemaQuestions(page, true);

    await page.getByRole('button', { name: 'Both' }).click();
    await next(page);
    await page.getByRole('button', { name: 'Both' }).click();
    
    await next(page);
    await page.getByRole('link', { name: 'Got it' }).click();
    await completeSuppliments(page);
    await completeDietaryRestrictions(page);
    await medicalConcers(page);
    const email = await enterEmailAndContinue(page);
    await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Claim plan' }).click();
    await handlePersonalPlanAndPayment(page, email, cardDetails, priceAfterDiscount, shouldPay);
}

export function validateCardDetails(cardDetails: CreditCard) {
    expect(cardDetails.cvv).toBeDefined();
    expect(cardDetails.expiry).toBeDefined();
    expect(cardDetails.number).toBeDefined();
}

export async function selectGender(page: Page, gender: string) {
    await page.getByRole('button', { name: gender }).click();
}

export async function selectName(page: Page, name: string) {
    await page.getByRole('textbox', { name: 'Type Name' }).click();
    await page.getByRole('textbox', { name: 'Type Name' }).fill(name);
    await next(page);
}

export async function selectBirthDate(page: Page) {
    await page.getByRole('button', { name: '2025' }).click();
    await page.getByRole('button', { name: 'September' }).click();
    await next(page);
}

export async function selectAge(page: Page, age: string='6 months') {
    await page.getByRole('button', { name: age }).click();
}

export async function next(page: Page, type: 'button' | 'link' = 'button') {
    await page.getByRole(type, { name: 'Next' }).click();

}

export async function completeInitialQuestions(page: Page, withNext: boolean=true) {
    await page.getByRole('button', { name: 'Purees' }).click();
    if (withNext) await next(page);
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('link', { name: 'Got it' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    if (withNext) await next(page);
    await page.getByRole('link', { name: 'Got it' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('link', { name: 'Got it' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('link', { name: 'Got it' }).click();
}

export async function completeReadinessAssessment(page: Page, hasLetGoAndReadinessAssessment: boolean) {
    if (hasLetGoAndReadinessAssessment) await page.waitForURL(new RegExp(`/readiness-assessment`), { timeout: 60_000 });
    if (hasLetGoAndReadinessAssessment) await page.getByRole('link', { name: 'Let\'s go' }).click();
    await page.waitForURL(new RegExp(`/top-concerns`), { timeout: 60_000 });
    await page.getByRole('button', { name: 'Baby not eating' }).click();
    await next(page);
    await page.getByRole('link', { name: 'Let\'s go' }).click();

}

export async function completeAllergyQuestions(page: Page) {
    await page.getByRole('button', { name: 'Egg' }).click();
    await page.getByRole('button', { name: 'Dairy' }).click();
    await page.getByRole('button', { name: 'Peanut' }).click();
    await page.getByRole('button', { name: 'Dairy' }).click();
    await next(page);
}

export async function completeEczemaQuestions(page: Page, hasEczema: boolean, nextType: 'button' | 'link' = 'link') {
    if (hasEczema) {
        await next(page, 'link');
        await page.getByRole('button', { name: 'Mild eczema' }).click();
        await next(page);
        await page.getByRole('link', { name: 'Got it' }).click();
    } else {
        await page.getByRole('button', { name: 'No eczema' }).click();
        await next(page, nextType);
    }
}

export async function meetDoctor(page: Page, url: string) {
    await page.waitForURL(new RegExp(`/${url}`), { timeout: 60_000 });
    await next(page, 'link');
}

export async function medicalConcers(page: Page) {
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('button', { name: 'No' }).click();
    await page.getByRole('button', { name: 'Reflux' }).click();
    await page.getByRole('button', { name: 'Oral restriction' }).click();
    await next(page);
    await next(page, 'link');
}

export async function completeSuppliments(page: Page) {
    await page.getByRole('button', { name: 'Iron' }).click();
    await next(page);
}

export async function completeDietaryRestrictions(page: Page) {
    await page.getByRole('button', { name: 'Kosher' }).click();
    await page.getByRole('button', { name: 'Grain-Free' }).click();
    await next(page);
    await next(page, 'link');
}

export async function enterEmailAndContinue(page: Page): Promise<string> {
    await page.waitForURL(new RegExp(`/enter-email`), { timeout: 60_000 });
    
    const email = uniqueEmail({ domain: 'solidstarts.com', prefix: 'mary+wf' });
    console.log('Email used for test:', email);
    
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await next(page);
    await page.waitForURL(new RegExp(`/personal-plan`), { timeout: 60_000 });
    
    return email;
}

export async function handlePersonalPlanAndPayment(page: Page, email: string, cardDetails: CreditCard, priceAfterDiscount: [number, number], shouldPay: boolean) {
    await page.waitForTimeout(2000);
    
    if (shouldPay) {
        await page.getByRole('button', { name: 'Get started' }).first().click();
        await page.waitForURL(new RegExp(`/checkout`), { timeout: 60_000 });
        await page.getByRole('link', { name: 'Back' }).click();
        await page.waitForURL(new RegExp(`/secondary-paywall`), { timeout: 60_000 });
        const planButton = page.getByRole('button', { name: /1 WEEK PLAN/i }).first();
        await expect(planButton).toContainText(`Now $${priceAfterDiscount[1].toString()} USD`);
        await planButton.click();
        await page.getByRole('button', { name: 'Get started' }).first().click();
        await page.waitForURL(new RegExp(`/checkout`), { timeout: 60_000 });
        await payment(page, cardDetails);
        await signUp(page, email);
        await page.waitForURL(new RegExp(`/download-signup-paid`), { timeout: 60_000 });
        await expect(page.getByText('It\'s time to download the app.')).toBeVisible({ timeout: 30_000 });
    } else {
        const planButton = page.getByRole('button', { name: /1 WEEK PLAN/i }).first();
        await expect(planButton).toContainText(`$${priceAfterDiscount[0].toString()} USD`);
    }
}

export async function payment(page: Page, cardDetails: CreditCard) {
    const cardFrame = page.frameLocator('iframe[title="Secure card number input frame"]');
    const cardLocator = cardFrame.locator('input[data-elements-stable-field-name="cardNumber"]')
    await expect(cardLocator).toBeVisible({ timeout: 30_000 });
    await cardLocator.fill(cardDetails.number);
    const expFrame = page.frameLocator('iframe[title="Secure expiration date input frame"]');
    await expFrame.locator('input[data-elements-stable-field-name="cardExpiry"]').fill(cardDetails.expiry);
    const cvcFrame = page.frameLocator('iframe[title="Secure CVC input frame"]');
    await cvcFrame.locator('input[data-elements-stable-field-name="cardCvc"]').fill(cardDetails.cvv);
    await page.getByRole('button', { name: 'Buy Now' }).click();
}

export async function signUp(page: Page, email: string) {
    await page.waitForURL(new RegExp(`/signup-paid`), { timeout: 60_000 });
    await page.getByRole('textbox', { name: 'Password*' }).click();
    await page.getByRole('textbox', { name: 'Password*' }).fill(email);
    await page.getByRole('button', { name: 'Create account & Sync' }).click();
}