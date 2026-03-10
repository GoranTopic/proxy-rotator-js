/**
 * Test: Consumer using CommonJS require() (e.g. Node without "type": "module").
 * Run from project root after build: node test-consumer/require.cjs
 * Or from test-consumer (after npm install): node require.cjs
 */
const pkg = require('proxy-rotator-js');

const ProxyRotator = pkg.default ?? pkg.ProxyRotator ?? pkg;
if (typeof ProxyRotator !== 'function') {
  console.error('FAIL: ProxyRotator not found. Got:', Object.keys(pkg));
  process.exit(1);
}

const rotator = new ProxyRotator(['1.2.3.4:8080', '5.6.7.8:3128']);
const pool = rotator.getPool();
const next = rotator.next();

if (pool.length !== 2 || typeof next !== 'string') {
  console.error('FAIL: expected pool size 2 and string from next(), got', { pool, next });
  process.exit(1);
}

console.log('OK (CJS require): proxy-rotator-js imported and used correctly.');
console.log('  pool:', pool);
console.log('  next():', next);
