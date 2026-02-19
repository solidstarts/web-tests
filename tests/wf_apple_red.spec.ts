import { test, devices } from '@playwright/test';
import { wfTest } from '../helpers/wf.helper';
import { getTestingUrl } from '../utils/getTestingUrl';
import { getCardDetails } from '../utils/getCardNumber';

test.use({
  ...devices[process.env.DEVICE as string],
});

const childName = 'Mary'
const shouldPay = false

test('test', async ({ page }) => {
  await wfTest(page, getTestingUrl('apple/welcome', {
    pw:'red'
  }), childName, getCardDetails(), 29.99, shouldPay);
});

