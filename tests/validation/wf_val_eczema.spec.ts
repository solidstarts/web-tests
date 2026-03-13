import { test, expect, devices } from '@playwright/test';
import { getTestingUrl } from '../../utils/getTestingUrl';

test.use({
  ...devices[process.env.DEVICE as string],
});

const funnels = ['apple', 'orange', 'banana'];
const optionsWithDoctorScreen = ["I'm not sure", 'Mild eczema', 'Severe eczema'];

for (const funnel of funnels) {
  test(`${funnel}: eczema options show allergy risk screen`, async ({ page }) => {
    for (const option of optionsWithDoctorScreen) {
      await page.goto(getTestingUrl(`${funnel}/eczema`), { waitUntil: 'networkidle' });
      await page.waitForURL(new RegExp(`/${funnel}/eczema`), { timeout: 10_000 });

      await page.getByRole('button', { name: option }).click();

      const nextButton = page.getByRole('button', { name: 'Next' });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }

      const doctorScreen = page.getByText('Talk to your doctor');
      const riskScreen = page.getByText('more likely to develop food allergies');
      await expect(doctorScreen.or(riskScreen)).toBeVisible();

      await page.getByRole('link', { name: 'Got it' }).click();
      await page.waitForTimeout(500);
    }
  });

  test(`${funnel}: No eczema skips allergy risk screen`, async ({ page }) => {
    await page.goto(getTestingUrl(`${funnel}/eczema`), { waitUntil: 'networkidle' });
    await page.waitForURL(new RegExp(`/${funnel}/eczema`), { timeout: 10_000 });

    await page.getByRole('button', { name: 'No eczema' }).click();

    const nextButton = page.getByRole('button', { name: 'Next' });
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }

    const doctorScreen = page.getByText('Talk to your doctor');
    const riskScreen = page.getByText('more likely to develop food allergies');
    await expect(doctorScreen.or(riskScreen)).not.toBeVisible();
  });
}
