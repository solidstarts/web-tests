import { expect, Page } from "@playwright/test";
import { test, devices } from '@playwright/test';

test.use({
  ...devices[process.env.DEVICE as string],
});

const testCases: [string, boolean][] = [
    ['     ', false],
    ['Mary', true],
    [`O'neil`, true],
    ['12345', true],
    ['Mary Popins', true]

]

test('test', async ({ page }) => {
    await page.goto('https://welcome.solidstarts.com/');
    await page.getByRole('button', { name: 'Girl' }).click();
    for (const testcase of testCases) {
        await fillName(page, testcase[0])
        await checkButtonEnabled(page, testcase[1])
    }
    const check20SymbolsString = 'AbracadabraBombarrdaPulyabra12312445';
    await fillName(page, 'AbracadabraBombarrdaPulyabra12312445')
    expect(await page.getByRole('textbox', { name: 'Type Name' })).toHaveValue(check20SymbolsString.slice(0, 20))
});

async function fillName(page: Page, value: string){
    await page.getByRole('textbox', { name: 'Type Name' }).click();
    await page.getByRole('textbox', { name: 'Type Name' }).fill(value);
}

async function checkButtonEnabled(page: Page, expectEnabled: boolean) {
    const nextButton = await page.getByRole('button', { name: 'Next' })
    if (expectEnabled) {
        await expect(nextButton).toBeEnabled()
    } else {
        await expect(nextButton).toBeDisabled();
    }
}