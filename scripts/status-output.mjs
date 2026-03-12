/**
 * Run this script to see the output of status().
 * Uses the built package so geo resolution works correctly.
 *
 * Usage: npm run status:output
 */
import ProxyRotator from '../dist/index.js';

const proxies = [
  '139.59.1.14:8080',
  '94.45.74.60:8080',
  '161.35.70.249:3128',
  '217.182.170.224:80',
];

const rotator = new ProxyRotator(proxies);
rotator.setDead(proxies[2]);

await rotator.refreshGeo();

const status = rotator.status();

console.log('--- status() output ---\n');
console.log(JSON.stringify(status, null, 2));
