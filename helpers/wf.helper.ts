import { expect, Page } from "@playwright/test";
import { uniqueEmail } from "../utils/testdata";
import { CreditCard } from "../utils/getCardNumber";

export async function wfTest(page: Page, url: string, childName: string, cardDetails: CreditCard, priceBeforeDiscount: number, shouldPay: boolean=true) {
    validateCardDetails(cardDetails);
    
    await page.goto(url);
    await selectGenderAndName(page, childName);
    await selectBirthDate(page);
    await completeInitialQuestions(page);
    await completeReadinessAssessment(page);
    await completeAllergyQuestions(page);
    await completeMeetVenus(page);
    await completeMeetDoctorRuiz(page);
    const email = await enterEmailAndContinue(page);
    await handlePersonalPlanAndPayment(page, email, cardDetails, priceBeforeDiscount, shouldPay);
}

function validateCardDetails(cardDetails: CreditCard) {
    expect(cardDetails.cvv).toBeDefined();
    expect(cardDetails.expiry).toBeDefined();
    expect(cardDetails.number).toBeDefined();
}

async function selectGenderAndName(page: Page, childName: string) {
    await page.getByRole('button', { name: 'Girl' }).click();
    await page.getByRole('textbox', { name: 'Type Name' }).click();
    await page.getByRole('textbox', { name: 'Type Name' }).fill(childName);
    await page.getByRole('button', { name: 'Next' }).click();
}

async function selectBirthDate(page: Page) {
    await page.getByRole('button', { name: '2025' }).click();
    await page.getByRole('button', { name: 'September' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
}

async function completeInitialQuestions(page: Page) {
    await page.getByRole('link', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'No' }).click();
    await page.getByRole('img', { name: 'Kim Grenawitzke' }).click();
    await page.getByRole('link', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Purees' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('link', { name: 'Got it' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('link', { name: 'Got it' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('link', { name: 'Got it' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('link', { name: 'Got it' }).click();
}

async function completeReadinessAssessment(page: Page) {
    await page.waitForURL(new RegExp(`/apple/readiness-assessment`), { timeout: 60_000 });
    await page.getByRole('link', { name: 'Let\'s go' }).click();
    await page.getByRole('button', { name: 'Choking prevention' }).click();
    await page.getByRole('button', { name: 'Baby not eating' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('link', { name: 'Let\'s go' }).click();
    await page.getByRole('link', { name: 'Next' }).click();
}

async function completeAllergyQuestions(page: Page) {
    await page.getByRole('button', { name: 'Egg' }).click();
    await page.getByRole('button', { name: 'Egg' }).click();
    await page.getByRole('button', { name: 'Dairy' }).click();
    await page.getByRole('button', { name: 'Peanut' }).click();
    await page.getByRole('button', { name: 'Dairy' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'No eczema' }).click();
    await page.getByRole('link', { name: 'Next' }).click();
}

async function completeMeetVenus(page: Page) {
    await page.waitForURL(new RegExp(`/apple/meet-venus`), { timeout: 60_000 });
    await page.getByRole('link', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Both' }).click();
    await page.getByRole('button', { name: 'Bottlefeed' }).click();
    await page.getByRole('button', { name: 'Iron' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Kosher' }).click();
    await page.getByRole('button', { name: 'Grain-Free' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('link', { name: 'Next' }).click();
}

async function completeMeetDoctorRuiz(page: Page) {
    await page.waitForURL(new RegExp(`/apple/meet-doctor-ruiz`), { timeout: 60_000 });
    await page.getByRole('link', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('button', { name: 'No' }).click();
    await page.getByRole('button', { name: 'Reflux' }).click();
    await page.getByRole('button', { name: 'Oral restriction' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('link', { name: 'Next' }).click();
}

async function enterEmailAndContinue(page: Page): Promise<string> {
    await page.waitForURL(new RegExp(`/apple/enter-email`), { timeout: 60_000 });
    
    const email = uniqueEmail({ domain: 'solidstarts.com', prefix: 'mary+wf' });
    console.log('Email used for test:', email);
    
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForURL(new RegExp(`/apple/personal-plan`), { timeout: 60_000 });
    
    return email;
}

async function handlePersonalPlanAndPayment(page: Page, email: string, cardDetails: CreditCard, priceBeforeDiscount: number, shouldPay: boolean) {
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Got it' }).click();
    await page.getByText('Guided introduction to 100').click();
    
    if (shouldPay) {
        await page.getByRole('button', { name: 'Get started' }).first().click();
        await page.waitForURL(new RegExp(`/apple/checkout`), { timeout: 60_000 });
        await page.getByRole('link', { name: 'Back' }).click();
        await page.waitForURL(new RegExp(`/apple/secondary-paywall`), { timeout: 60_000 });
        await page.getByRole('button', { name: `1 WEEK PLAN $${priceBeforeDiscount} USD • Now` }).first().click();
        await page.getByRole('button', { name: 'Get started' }).first().click();
        await page.waitForURL(new RegExp(`/apple/checkout`), { timeout: 60_000 });
        await payment(page, cardDetails);
        await signUp(page, email);
        await page.waitForURL(new RegExp(`/apple/download-signup-paid`), { timeout: 60_000 });
        await expect(page.getByText('It\'s time to download the app.')).toBeVisible({ timeout: 30_000 });
    } else {
        await page.waitForTimeout(15_000);
    }
}

async function payment(page: Page, cardDetails: CreditCard) {
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

async function signUp(page: Page, email: string) {
    await page.waitForURL(new RegExp(`/apple/signup-paid`), { timeout: 60_000 });
    await page.getByRole('textbox', { name: 'Password*' }).click();
    await page.getByRole('textbox', { name: 'Password*' }).fill(email);
    await page.getByRole('button', { name: 'Create account & Sync' }).click();
}