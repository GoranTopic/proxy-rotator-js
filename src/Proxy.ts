import type { GeoCountry } from './utils/geo-types.js';

export type ProxyStatus = 'new' | 'alive' | 'dead';

export interface ProxyInfo {
  protocol: string | null;
  ip: string;
  host: string;
  port: string;
  country?: GeoCountry | null;
}

export interface ProxyObj extends ProxyInfo {
  status: ProxyStatus;
  changeTimeStamp: number;
}

export default class Proxy {
  readonly protocol: string | null;
  readonly ip: string;
  readonly host: string;
  readonly port: string;
  readonly proxy: string;
  status: ProxyStatus;
  changeTimeStamp: number;
  country: GeoCountry | null = null;

  constructor(
    proxy: string,
    protocol: string | null = null,
    assumeAlive: boolean = false,
    country: GeoCountry | null = null
  ) {
    if (proxy.includes('://')) {
      this.protocol = proxy.split('://')[0];
      this.ip = proxy.split('://')[1].split(':')[0];
      this.host = this.ip;
      this.port = proxy.split('://')[1].split(':')[1];
    } else {
      this.protocol = protocol;
      this.ip = proxy.split(':')[0];
      this.host = this.ip;
      this.port = proxy.split(':')[1];
    }
    this.proxy = `${this.protocol ? this.protocol + '://' : ''}${this.ip}:${this.port}`;
    this.status = assumeAlive ? 'alive' : 'new';
    this.changeTimeStamp = Date.now();
    this.country = country ?? null;
  }

  toString(): string {
    return `${this.protocol ? this.protocol + '://' : ''}${this.ip}:${this.port}`;
  }

  get(): ProxyInfo {
    return {
      protocol: this.protocol,
      ip: this.ip,
      host: this.host,
      port: this.port,
      country: this.country ?? undefined,
    };
  }

  obj(): ProxyObj {
    return {
      protocol: this.protocol,
      ip: this.ip,
      host: this.host,
      port: this.port,
      status: this.status,
      changeTimeStamp: this.changeTimeStamp,
      country: this.country ?? undefined,
    };
  }

  setCountry(country: GeoCountry | null): void {
    this.country = country;
  }

  kill(): void {
    this.status = 'dead';
    this.changeTimeStamp = Date.now();
  }

  setDead(): void {
    this.status = 'dead';
    this.changeTimeStamp = Date.now();
  }

  setAlive(): void {
    this.status = 'alive';
    this.changeTimeStamp = Date.now();
  }

  setNew(): void {
    this.status = 'new';
    this.changeTimeStamp = Date.now();
  }

  isDead(): boolean {
    return this.status === 'dead';
  }

  isAlive(): boolean {
    return this.status === 'alive';
  }

  isNew(): boolean {
    return this.status === 'new';
  }

  revive(): void {
    this.status = 'alive';
    this.changeTimeStamp = Date.now();
  }

  reset(): void {
    this.status = 'new';
    this.changeTimeStamp = Date.now();
  }

  equals(proxy: string | Proxy): boolean {
    const other = typeof proxy === 'string' ? new Proxy(proxy) : proxy;
    return this.ip === other.ip && this.port === other.port;
  }

  timeSinceStatusChange(): number {
    return Date.now() - this.changeTimeStamp;
  }

  print(): void {
    console.log(this.get());
  }

  getIp(): string {
    return this.ip;
  }

  getPort(): string {
    return this.port;
  }

  getProtocol(): string | null {
    return this.protocol;
  }
}
