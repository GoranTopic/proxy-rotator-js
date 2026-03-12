import ProxyRotator from '../index.js';
import assert from 'assert';

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
