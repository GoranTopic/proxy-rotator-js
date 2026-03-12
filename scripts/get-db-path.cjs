/**
 * Resolves path to GeoLite2-Country.mmdb. CJS - used when ESM import.meta unavailable.
 */
const path = require('path');
module.exports = path.join(__dirname, '..', 'assets', 'GeoLite2-Country.mmdb');
