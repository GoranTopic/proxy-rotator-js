import maxmind, { type CountryResponse, type Reader } from 'maxmind';
import path from 'path';

function getDbPath(): string {
  return (
    process.env.GEO_DB_PATH ||
    path.join(process.cwd(), 'assets', 'GeoLite2-Country.mmdb')
  );
}

let _reader: Reader<CountryResponse> | null = null;

async function getReader(): Promise<Reader<CountryResponse>> {
  if (!_reader) {
    _reader = await maxmind.open<CountryResponse>(getDbPath());
  }
  return _reader;
}

export interface GeoCountry {
  iso: string; // 'US', 'CR', 'DE' ...
  name: string; // 'United States', 'Costa Rica' ...
  continent: string; // 'NA', 'EU' ...
}

export async function getCountryFromIp(ip: string): Promise<GeoCountry | null> {
  const reader = await getReader();
  const result = reader.get(ip);

  if (!result?.country) return null;

  return {
    iso: result.country.iso_code ?? 'Unknown',
    name: result.country.names?.en ?? 'Unknown',
    continent: result.continent?.code ?? 'Unknown',
  };
}
