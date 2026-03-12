import ProxyRotator from '../index.js';
import assert from 'assert';

const test_proxies = [
  '139.59.1.14:8080',
  '94.45.74.60:8080',
  '161.35.70.249:3128',
  '217.182.170.224:80',
];

describe('status()', () => {
  it('output has pool with size and proxies array', () => {
    const status = new ProxyRotator(test_proxies).status();
    assert.ok(status.pool);
    assert.strictEqual(typeof status.pool.size, 'number');
    assert.ok(Array.isArray(status.pool.proxies));
    assert.strictEqual(status.pool.size, test_proxies.length);
  });

  it('output pool.proxies items have status, changeTimeStamp, country', () => {
    const status = new ProxyRotator(test_proxies).status();
    for (const p of status.pool.proxies) {
      assert.strictEqual(typeof p.status, 'string');
      assert.strictEqual(typeof p.changeTimeStamp, 'number');
      assert.ok(['protocol', 'ip', 'host', 'port', 'status', 'changeTimeStamp'].every((k) => k in p));
    }
  });

  it('output has graveyard with size and proxies array', () => {
    const status = new ProxyRotator(test_proxies).status();
    assert.ok(status.graveyard);
    assert.strictEqual(typeof status.graveyard.size, 'number');
    assert.ok(Array.isArray(status.graveyard.proxies));
  });

  it('output graveyard.proxies items have status, changeTimeStamp', () => {
    const rotator = new ProxyRotator(test_proxies);
    rotator.setDead(test_proxies[2]);
    const status = rotator.status();
    assert.strictEqual(status.graveyard.proxies.length, 1);
    const p = status.graveyard.proxies[0];
    assert.strictEqual(typeof p.status, 'string');
    assert.strictEqual(typeof p.changeTimeStamp, 'number');
    assert.strictEqual(p.host, '161.35.70.249');
    assert.strictEqual(p.port, '3128');
  });

  it('output has config with expected keys', () => {
    const status = new ProxyRotator(test_proxies).status();
    assert.ok(status.config);
    assert.strictEqual(typeof status.config.revive_timer, 'number');
    assert.ok(['string', 'object'].includes(status.config.returnAs));
    assert.strictEqual(typeof status.config.shuffle, 'boolean');
    assert.strictEqual(typeof status.config.assume_aliveness, 'boolean');
    assert.strictEqual(typeof status.config.check_on_next, 'boolean');
    assert.strictEqual(typeof status.config.fetchGeo, 'boolean');
  });

  it('output config reflects constructor options', () => {
    const status = new ProxyRotator(test_proxies, {
      revive_timer: 5000,
      returnAs: 'object',
      protocol: 'http',
      shuffle: true,
      assume_aliveness: true,
      check_on_next: true,
      fetchGeo: false,
    }).status();

    assert.strictEqual(status.config.revive_timer, 5000);
    assert.strictEqual(status.config.returnAs, 'object');
    assert.strictEqual(status.config.protocol, 'http');
    assert.strictEqual(status.config.shuffle, true);
    assert.strictEqual(status.config.assume_aliveness, true);
    assert.strictEqual(status.config.check_on_next, true);
    assert.strictEqual(status.config.fetchGeo, false);
  });

  it('output is JSON-serializable', () => {
    const status = new ProxyRotator(test_proxies).status();
    const parsed = JSON.parse(JSON.stringify(status));
    assert.strictEqual(parsed.pool.size, status.pool.size);
    assert.strictEqual(parsed.graveyard.size, status.graveyard.size);
    assert.strictEqual(parsed.pool.proxies.length, status.pool.proxies.length);
    for (const p of parsed.pool.proxies) {
      assert.ok('status' in p && 'changeTimeStamp' in p);
    }
  });
});
