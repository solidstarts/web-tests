import { test, expect, devices } from '@playwright/test';
import { getTestingUrl } from '../../utils/getTestingUrl';

test.use({
  ...devices[process.env.DEVICE as string],
});

const funnels = ['apple', 'orange', 'banana'];
const concernsOptions = ['Reflux', 'Oral restriction'];

async function getOptionElement(page: any, optionName: string) {
  const button = page.getByRole('button', { name: optionName });
  if (await button.count() > 0) {
    return button;
  }
  const checkbox = page.getByRole('checkbox', { name: optionName });
  if (await checkbox.count() > 0) {
    return checkbox;
  }
  return page.getByText(optionName).locator('..');
}

async function isOptionSelected(page: any, optionName: string): Promise<boolean> {
  const element = await getOptionElement(page, optionName);
  
  const ariaChecked = await element.getAttribute('aria-checked');
  if (ariaChecked !== null) {
    return ariaChecked === 'true';
  }
  
  const ariaPressed = await element.getAttribute('aria-pressed');
  if (ariaPressed !== null) {
    return ariaPressed === 'true';
  }
  
  const dataState = await element.getAttribute('data-state');
  if (dataState !== null) {
    return dataState === 'checked' || dataState === 'on';
  }
  
  const checkboxInElement = element.locator('input[type="checkbox"]');
  if (await checkboxInElement.count() > 0) {
    return await checkboxInElement.first().isChecked();
  }
  
  const isSelected = await element.evaluate((el: Element) => {
    const hasSelectedAttr = el.classList.contains('selected') || 
           el.classList.contains('active') ||
           el.classList.contains('checked') ||
           el.getAttribute('data-selected') === 'true' ||
           el.getAttribute('data-checked') === 'true';
    if (hasSelectedAttr) return true;
    
    const svgCheck = el.querySelector('svg path[d*="M9"], svg path[d*="check"], svg.check, svg[class*="check"]');
    if (svgCheck) return true;
    
    return false;
  });
  
  return isSelected;
}

async function clickOption(page: any, optionName: string) {
  const element = await getOptionElement(page, optionName);
  await element.click();
}

for (const funnel of funnels) {
  test.describe(`${funnel}: Medical concerns Selector Validation`, () => {
    test('can select multiple concerns options', async ({ page }) => {
      await page.goto(getTestingUrl(`${funnel}/medical-concerns`));
      await page.waitForURL(new RegExp(`/${funnel}/medical-concerns`), { timeout: 10_000 });

      await clickOption(page, 'Reflux');
      await clickOption(page, 'Oral restriction');

      expect(await isOptionSelected(page, 'Reflux')).toBe(true);
      expect(await isOptionSelected(page, 'Oral restriction')).toBe(true);
    });

    test('selecting No deselects all other options', async ({ page }) => {
      await page.goto(getTestingUrl(`${funnel}/medical-concerns`));
      await page.waitForURL(new RegExp(`/${funnel}/medical-concerns`), { timeout: 10_000 });

      await clickOption(page, 'Reflux');
      await clickOption(page, 'Oral restriction');

      expect(await isOptionSelected(page, 'Reflux')).toBe(true);
      expect(await isOptionSelected(page, 'Oral restriction')).toBe(true);

      await clickOption(page, 'No');

      expect(await isOptionSelected(page, 'No')).toBe(true);
      for (const option of concernsOptions) {
        expect(await isOptionSelected(page, option)).toBe(false);
      }
    });

    test('selecting an option after No deselects No', async ({ page }) => {
      await page.goto(getTestingUrl(`${funnel}/medical-concerns`));
      await page.waitForURL(new RegExp(`/${funnel}/medical-concerns`), { timeout: 10_000 });

      await clickOption(page, 'No');
      expect(await isOptionSelected(page, 'No')).toBe(true);

      await clickOption(page, 'Oral restriction');

      expect(await isOptionSelected(page, 'No')).toBe(false);
      expect(await isOptionSelected(page, 'Oral restriction')).toBe(true);
    });

    test('tapping an option toggles its selection state', async ({ page }) => {
      await page.goto(getTestingUrl(`${funnel}/medical-concerns`));
      await page.waitForURL(new RegExp(`/${funnel}/medical-concerns`), { timeout: 10_000 });

      await clickOption(page, 'Oral restriction');
      expect(await isOptionSelected(page, 'Oral restriction')).toBe(true);

      await clickOption(page, 'Oral restriction');
      expect(await isOptionSelected(page, 'Oral restriction')).toBe(false);

      await clickOption(page, 'Oral restriction');
      expect(await isOptionSelected(page, 'Oral restriction')).toBe(true);
    });
  });
}
