/**
 * Test: Consumer using TypeScript with types.
 * Run from project root: npx tsx test-consumer/import.ts (after npm run build and npm install in test-consumer)
 * Or: cd test-consumer && npx tsx import.ts
 */
import ProxyRotator, {
  type ProxyRotatorOptions,
  type ProxyObj,
  type ProxyStatus,
} from 'proxy-rotator-js';

const options: ProxyRotatorOptions = {
  returnAs: 'object',
  revive_timer: 60_000,
};

const rotator = new ProxyRotator(['1.2.3.4:8080', '5.6.7.8:3128'], options);
const pool = rotator.getPool();
const next = rotator.next();

if (pool.length !== 2) {
  console.error('FAIL: expected pool size 2, got', pool.length);
  process.exit(1);
}

if (next === null || typeof next !== 'object') {
  console.error('FAIL: expected object from next() with returnAs object, got', next);
  process.exit(1);
}

const obj = next as ProxyObj;
if (
  typeof obj.ip !== 'string' ||
  typeof obj.port !== 'string' ||
  typeof obj.status !== 'string'
) {
  console.error('FAIL: expected ProxyObj shape, got', obj);
  process.exit(1);
}

const status: ProxyStatus = obj.status;

console.log('OK (TypeScript): proxy-rotator-js imported with types and used correctly.');
console.log('  pool:', pool);
console.log('  next() as ProxyObj:', obj);
console.log('  status type:', status);
