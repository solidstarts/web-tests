import fs from 'fs';

export function getAndIncreaseTestNumber(): number {
    if (!fs.existsSync('testnumber.txt')) {
        fs.writeFileSync('testnumber.txt', '0');
    }
    const testNumber = fs.readFileSync('testnumber.txt', 'utf8');
    const number = parseInt(testNumber);
    fs.writeFileSync('testnumber.txt', (number + 1).toString());
    return number;
}

export function uniqueEmail(params: { domain?: string; prefix?: string } = {}) {
    const domain = params.domain ?? 'example.com';
    const prefix = params.prefix ?? 'test';
    return `${prefix}_a${getAndIncreaseTestNumber()}@${domain}`;
  }