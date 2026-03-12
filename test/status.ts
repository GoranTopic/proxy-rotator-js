import ProxyRotator from '../index.js';
import assert from 'assert';

const test_proxies = [
  '139.59.1.14:8080',
  '94.45.74.60:8080',
  '161.35.70.249:3128',
  '217.182.170.224:80',
];

describe('status()', () => {
  it('returns pool status with correct structure', () => {
    const rotator = new ProxyRotator(test_proxies);
    const status = rotator.status();

    assert.ok(status.pool, 'should have pool');
    assert.strictEqual(typeof status.pool.size, 'number');
    assert.ok(Array.isArray(status.pool.proxies));
    assert.strictEqual(status.pool.size, test_proxies.length);
    assert.deepStrictEqual(status.pool.proxies, test_proxies);

    assert.ok(status.graveyard, 'should have graveyard');
    assert.strictEqual(typeof status.graveyard.size, 'number');
    assert.ok(Array.isArray(status.graveyard.proxies));
    assert.strictEqual(status.graveyard.size, 0);

    assert.ok(status.config, 'should have config');
    assert.strictEqual(typeof status.config.revive_timer, 'number');
    assert.ok(['string', 'object'].includes(status.config.returnAs));
    assert.strictEqual(typeof status.config.shuffle, 'boolean');
    assert.strictEqual(typeof status.config.assume_aliveness, 'boolean');
    assert.strictEqual(typeof status.config.check_on_next, 'boolean');
  });

  it('status reflects pool and graveyard state', () => {
    const rotator = new ProxyRotator(test_proxies);
    rotator.setDead(test_proxies[2]);

    const status = rotator.status();
    assert.strictEqual(status.pool.size, test_proxies.length - 1);
    assert.strictEqual(status.graveyard.size, 1);
    assert.ok(status.graveyard.proxies.includes(test_proxies[2]));
    assert.ok(!status.pool.proxies.includes(test_proxies[2]));
  });

  it('status config reflects options', () => {
    const rotator = new ProxyRotator(test_proxies, {
      revive_timer: 5000,
      returnAs: 'object',
      protocol: 'http',
      shuffle: true,
      assume_aliveness: true,
      check_on_next: true,
    });
    const status = rotator.status();

    assert.strictEqual(status.config.revive_timer, 5000);
    assert.strictEqual(status.config.returnAs, 'object');
    assert.strictEqual(status.config.protocol, 'http');
    assert.strictEqual(status.config.shuffle, true);
    assert.strictEqual(status.config.assume_aliveness, true);
    assert.strictEqual(status.config.check_on_next, true);
  });

  it('status is JSON-serializable', () => {
    const rotator = new ProxyRotator(test_proxies);
    const status = rotator.status();
    const json = JSON.stringify(status);
    const parsed = JSON.parse(json);
    assert.deepStrictEqual(parsed, status);
  });

  it('status config includes fetchGeo', () => {
    const rotator = new ProxyRotator(test_proxies, { fetchGeo: false });
    const status = rotator.status();
    assert.strictEqual(status.config.fetchGeo, false);
  });
});

describe('geo country on add', () => {
  it('add with fetchGeo populates country', async function () {
    this.timeout(5000);
    const rotator = new ProxyRotator(null, { fetchGeo: true });
    await rotator.add('8.8.8.8:53'); // Google DNS - US
    const proxyObj = rotator.next({ returnAs: 'object' });
    assert.ok(proxyObj && typeof proxyObj === 'object');
    assert.ok('country' in proxyObj);
    const country = (proxyObj as { country?: { iso: string; name: string; continent: string } })
      .country;
    assert.ok(country, 'should have country');
    assert.strictEqual(typeof country.iso, 'string');
    assert.strictEqual(typeof country.name, 'string');
    assert.strictEqual(typeof country.continent, 'string');
    assert.strictEqual(country.iso, 'US');
  });

  it('add with fetchGeo false has no country', async () => {
    const rotator = new ProxyRotator(null, { fetchGeo: false });
    await rotator.add('8.8.8.8:53');
    const proxyObj = rotator.next({ returnAs: 'object' });
    assert.ok(proxyObj);
    const country = (proxyObj as { country?: unknown }).country;
    assert.ok(!country || country === null);
  });

  it('refreshGeo populates country for constructor-added proxies', async function () {
    this.timeout(5000);
    const rotator = new ProxyRotator(['8.8.8.8:53']); // constructor = sync, no geo
    const before = rotator.next({ returnAs: 'object' }) as { country?: unknown };
    assert.ok(!before?.country);
    await rotator.refreshGeo();
    const after = rotator.next({ returnAs: 'object' }) as { country?: { iso: string } };
    assert.ok(after?.country);
    assert.strictEqual(after.country.iso, 'US');
  });
});
