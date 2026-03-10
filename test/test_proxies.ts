import ProxyRotator from '../index.js';
import assert from 'assert';

const test_proxies = [
  '139.59.1.14:8080',
  '94.45.74.60:8080',
  '161.35.70.249:3128',
  '217.182.170.224:80',
  '222.138.76.6:9002',
  '218.252.206.89:80',
  '18.214.66.210:80',
  '120.234.203.171:9002',
];

describe('testing testing proxies', () => {
  it('testing proxeis', async () => {
    const rotator = new ProxyRotator(test_proxies);
    await rotator.test();
    assert.deepEqual(test_proxies, rotator.getPool());
  });
});
