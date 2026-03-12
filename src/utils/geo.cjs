'use strict';

const maxmind = require('maxmind');
const path = require('path');
// Resolve path to scripts/ from dist/src/utils/ or dist/cjs/utils/
const levelsUp = __dirname.includes(path.sep + 'cjs' + path.sep) ? 4 : 3;
const getDbPath = require(path.join(__dirname, ...Array(levelsUp).fill('..'), 'scripts', 'get-db-path.cjs'));

let _reader = null;

async function getReader() {
  if (!_reader) {
    _reader = await maxmind.open(getDbPath);
  }
  return _reader;
}

async function getCountryFromIp(ip) {
  const reader = await getReader();
  const result = reader.get(ip);

  if (!result?.country) return null;

  return {
    iso: result.country.iso_code ?? 'Unknown',
    name: result.country.names?.en ?? 'Unknown',
    continent: result.continent?.code ?? 'Unknown',
  };
}

module.exports = { getCountryFromIp };
