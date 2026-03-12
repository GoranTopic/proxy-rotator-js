/**
 * Downloads GeoLite2-Country.mmdb to assets folder.
 *
 * Uses a community mirror (updated weekly). For official MaxMind database,
 * sign up at https://www.maxmind.com/ and set MAXMIND_LICENSE_KEY to get
 * the latest version via their API.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, '../assets');
const DB_PATH = path.join(ASSETS_DIR, 'GeoLite2-Country.mmdb');

const MIRROR_URL =
  'https://raw.githubusercontent.com/6Kmfi6HP/maxmind/main/GeoLite2-Country.mmdb';

async function download(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  }
  return res.arrayBuffer();
}

async function main(): Promise<void> {
  const licenseKey = process.env.MAXMIND_LICENSE_KEY;
  let buffer: ArrayBuffer;

  if (licenseKey) {
    const url = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${licenseKey}&suffix=tar.gz`;
    console.log('Using MaxMind API with license key...');
    buffer = await download(url);
    const tar = await import('tar');
    const tmpDir = path.join(ASSETS_DIR, '.tmp-geo');
    fs.mkdirSync(tmpDir, { recursive: true });
    try {
      const tarball = path.join(tmpDir, 'GeoLite2-Country.tar.gz');
      fs.writeFileSync(tarball, Buffer.from(buffer));
      await tar.extract({ file: tarball, cwd: tmpDir });
      const dirs = fs.readdirSync(tmpDir, { withFileTypes: true });
      const mmdbDir = dirs.find((d) => d.isDirectory())?.name;
      const mmdbFile = mmdbDir
        ? fs.readdirSync(path.join(tmpDir, mmdbDir)).find((f) => f.endsWith('.mmdb'))
        : null;
      if (!mmdbFile || !mmdbDir)
        throw new Error('No .mmdb file in archive');
      fs.mkdirSync(ASSETS_DIR, { recursive: true });
      fs.copyFileSync(
        path.join(tmpDir, mmdbDir, mmdbFile),
        DB_PATH
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  } else {
    console.log('Using community mirror...');
    buffer = await download(MIRROR_URL);
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, Buffer.from(buffer));
  }

  console.log(`Saved to ${DB_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
