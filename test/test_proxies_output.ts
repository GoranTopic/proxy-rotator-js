import ProxyRotator, { type ProxyTestResults } from '../index.js';
import assert from 'assert';

const test_proxies = [
  '139.59.1.14:8080',
  '94.45.74.60:8080',
  '161.35.70.249:3128',
  '217.182.170.224:80',
];

describe('test_proxies() output options', () => {
  it('output json returns ProxyTestResults structure', async function () {
    this.timeout(30000);
    const rotator = new ProxyRotator(test_proxies);
    const result = (await rotator.test_proxies({
      output: 'json',
    })) as ProxyTestResults;

    assert.ok(result, 'should return result');
    assert.ok(result.results, 'should have results array');
    assert.ok(result.summary, 'should have summary');
    assert.strictEqual(result.results.length, test_proxies.length);
    assert.strictEqual(result.summary.total, test_proxies.length);
    assert.strictEqual(
      result.summary.working + result.summary.notWorking,
      result.summary.total
    );
  });

  it('output json each result has required fields', async function () {
    this.timeout(30000);
    const rotator = new ProxyRotator(test_proxies);
    const result = (await rotator.test_proxies({
      output: 'json',
    })) as ProxyTestResults;

    for (const r of result.results) {
      assert.strictEqual(typeof r.proxy, 'string');
      assert.strictEqual(typeof r.working, 'boolean');
      assert.strictEqual(typeof r.expectedIp, 'string');
      assert.ok(r.actualIp === null || typeof r.actualIp === 'string');
      if (!r.working && r.actualIp === null) {
        assert.ok(
          r.error === undefined || typeof r.error === 'string',
          'error should be string if present'
        );
      }
    }
  });

  it('output json is JSON-serializable', async function () {
    this.timeout(30000);
    const rotator = new ProxyRotator(test_proxies);
    const result = (await rotator.test_proxies({
      output: 'json',
    })) as ProxyTestResults;
    const json = JSON.stringify(result);
    const parsed = JSON.parse(json);
    assert.deepStrictEqual(parsed, result);
  });

  it('output console returns undefined', async function () {
    this.timeout(30000);
    const rotator = new ProxyRotator(test_proxies);
    const result = await rotator.test_proxies();
    assert.strictEqual(result, undefined);
  });

  it('output console explicit returns undefined', async function () {
    this.timeout(30000);
    const rotator = new ProxyRotator(test_proxies);
    const result = await rotator.test_proxies({ output: 'console' });
    assert.strictEqual(result, undefined);
  });
});
