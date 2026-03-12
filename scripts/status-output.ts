/**
 * Run with: npx tsx scripts/status-output.ts
 * Or use: npm run status:output (uses status-output.mjs with built dist)
 *
 * Must use dist/ so geo.cjs path resolution works. Run "npm run build" first.
 */
import ProxyRotator from '../dist/index.js';

const proxies = [
  '139.59.1.14:8080',
  '94.45.74.60:8080',
  '161.35.70.249:3128',
  '217.182.170.224:80',
];

async function main() {
  const rotator = new ProxyRotator(proxies);
  rotator.setDead(proxies[2]);
  await rotator.refreshGeo();
  const status = rotator.status();
  console.log('--- status() output ---\n');
  console.log(JSON.stringify(status, null, 2));
}

main().catch(console.error);
