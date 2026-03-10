/**
 * Test: Consumer using ESM import (e.g. Node with "type": "module" or .mjs).
 * Run from project root after build: node test-consumer/import.js
 * Or from test-consumer (after npm install): node import.js
 */
import ProxyRotator from 'proxy-rotator-js';

const rotator = new ProxyRotator(['1.2.3.4:8080', '5.6.7.8:3128']);
const pool = rotator.getPool();
const next = rotator.next();

if (pool.length !== 2 || typeof next !== 'string') {
  console.error('FAIL: expected pool size 2 and string from next(), got', { pool, next });
  process.exit(1);
}

console.log('OK (ESM import): proxy-rotator-js imported and used correctly.');
console.log('  pool:', pool);
console.log('  next():', next);
