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
    pw:'red'
  }), childName, getCardDetails(), [14.99, 7.49], shouldPay);
});
