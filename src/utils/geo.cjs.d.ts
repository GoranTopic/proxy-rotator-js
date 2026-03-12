declare module './utils/geo.cjs' {
  export function getCountryFromIp(ip: string): Promise<{ iso: string; name: string; continent: string } | null>;
}
