import ProxyRotator from '../index.js';
import assert from 'assert';
import chai from 'chai';

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

describe('read form proxy files', () => {
  it('reading file with newlines', () => {
    const proxies_file = './assets/http_proxies_with_newlines.txt';
    const rotator_with_newlines = new ProxyRotator(proxies_file);
    const pool = rotator_with_newlines.getPool();
    assert.deepEqual(test_proxies, pool);
  });

  it('reading file with spaces', () => {
    const proxies_file = './assets/http_proxies_with_spaces.txt';
    const rotator_with_spaces = new ProxyRotator(proxies_file);
    const pool = rotator_with_spaces.getPool();
    assert.deepEqual(test_proxies, pool);
  });

  it('reading file with commas', () => {
    const proxies_file = './assets/http_proxies_with_commas.txt';
    const rotator_with_commas = new ProxyRotator(proxies_file);
    const pool = rotator_with_commas.getPool();
    assert.deepEqual(test_proxies, pool);
  });
});

describe('basic functionality', () => {
  it('add proxies array', () => {
    const rotator = new ProxyRotator(test_proxies);
    assert.deepEqual(test_proxies, rotator.getPool());
  });

  it('add proxy one by one ', async () => {
    const rotator = new ProxyRotator(null, { fetchGeo: false });
    for (const proxy of test_proxies) await rotator.add(proxy);
    assert.deepEqual(test_proxies, rotator.getPool());
  });

  it('remove one', () => {
    const rotator = new ProxyRotator(test_proxies);
    const removed = test_proxies.filter((e) => e !== test_proxies[3]);
    rotator.remove(test_proxies[3]);
    assert.deepEqual(removed, rotator.getPool());
  });

  it('remove proxy one by one ', () => {
    const rotator = new ProxyRotator(test_proxies);
    for (const proxy of test_proxies) rotator.remove(proxy);
    assert.deepEqual([], rotator.getPool());
  });

  it('set dead to graveyard', () => {
    const rotator = new ProxyRotator(test_proxies);
    rotator.setDead(test_proxies[3]);
    assert.deepEqual(
      rotator.getGraveyard().includes(test_proxies[3]),
      true
    );
  });

  it('set dead remove from pool', () => {
    const rotator = new ProxyRotator(test_proxies);
    rotator.setDead(test_proxies[3]);
    assert.equal(rotator.getPool().includes(test_proxies[3]), false);
  });

  it('resurect proxy from graveyard', () => {
    const rotator = new ProxyRotator(test_proxies);
    rotator.setDead(test_proxies[3]);
    rotator.resurect(test_proxies[3]);
    assert.equal(rotator.getPool().includes(test_proxies[3]), true);
  });

  it('set dead proxy alive', () => {
    const rotator = new ProxyRotator(test_proxies);
    rotator.setDead(test_proxies[3]);
    rotator.setAlive(test_proxies[3]);
    assert.equal(rotator.getPool().includes(test_proxies[3]), true);
  });

  it('get alive', () => {
    const rotator = new ProxyRotator(test_proxies);
    rotator.setAlive(test_proxies[3]);
    const proxy = rotator.getAlive();
    assert.equal(proxy, test_proxies[3]);
  });

  it('test rotation', () => {
    const rotator = new ProxyRotator(test_proxies);
    const removed = test_proxies.filter((e) => e !== test_proxies[3]);
    rotator.setDead(test_proxies[3]);
    for (let i = 0; i < removed.length; i++) {
      const proxy = rotator.next();
      assert.equal(proxy, removed[i]);
    }
  });

  it('resurect timer', function (done) {
    this.timeout(1100);
    const rotator = new ProxyRotator(test_proxies, { revive_timer: 1000 });
    rotator.setDead(test_proxies[3]);
    setTimeout(() => {
      assert.equal(rotator.getPool().includes(test_proxies[3]), true);
      done();
    }, 1000);
  });
});

describe('Test return type', () => {
  it('test default return string type', () => {
    const rotator = new ProxyRotator(test_proxies);
    const proxy = rotator.next();
    assert.equal(typeof proxy, 'string');
  });

  it('test if it return object when passed returnAs obj', () => {
    const rotator = new ProxyRotator(test_proxies, { returnAs: 'object' });
    const proxy = rotator.next();
    assert.equal(typeof proxy, 'object');
  });

  it('test if it return obj when passed as paramter', () => {
    const rotator = new ProxyRotator(test_proxies);
    const proxy = rotator.next({ returnAs: 'obj' });
    assert.equal(typeof proxy, 'object');
    const proxy2 = rotator.next({ returnAs: 'str' });
    assert.equal(typeof proxy2, 'string');
  });
});
