/**
 * Downloads GeoLite2-Country.mmdb to package assets. Runs on postinstall.
 * Uses plain Node (no tsx) so it works when installed as a dependency.
 */
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets');
const DB_PATH = path.join(ASSETS_DIR, 'GeoLite2-Country.mmdb');
const MIRROR_URL =
  'https://raw.githubusercontent.com/6Kmfi6HP/maxmind/main/GeoLite2-Country.mmdb';

async function download() {
  const res = await fetch(MIRROR_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (fs.existsSync(DB_PATH)) {
    return;
  }
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  const buffer = await download();
  fs.writeFileSync(DB_PATH, buffer);
}

main().catch((err) => {
  console.warn('proxy-rotator-js: could not download GeoLite2-Country.mmdb:', err.message);
  console.warn('Run "npm run download:geo" manually, or set GEO_DB_PATH to your mmdb file.');
});
