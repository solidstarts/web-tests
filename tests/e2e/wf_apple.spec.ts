import { test, devices } from '@playwright/test';
import { wfTest } from '../../helpers/wf.helper';
import { getTestingUrl } from '../../utils/getTestingUrl';
import { getCardDetails } from '../../utils/getCardNumber';

test.use({
  ...devices[process.env.DEVICE as string],
});

const childName = 'Mary'
const shouldPay = process.env.SHOULD_PAY === 'true'

test('test', async ({ page }) => {
  await wfTest(page, getTestingUrl('apple/welcome', {
    pw: 'green'
  }), childName, getCardDetails(), [6.99, 3.49], shouldPay);
});

