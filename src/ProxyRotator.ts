import fs from 'fs';
import path from 'path';
import Queue from './Queue.js';
import Proxy from './Proxy.js';
import makeRequestWithProxy from './utils/makeRequestWithProxy.js';
import type { ProxyObj } from './Proxy.js';

export type ReturnAs = 'string' | 'object';

export interface ProxyRotatorOptions {
  returnAs?: ReturnAs | 'str' | 'obj';
  revive_timer?: number;
  shuffle?: boolean;
  protocol?: string | null;
  assume_aliveness?: boolean;
  check_on_next?: boolean;
}

export default class ProxyRotator {
  private pool: Queue<Proxy>;
  private graveyard: Proxy[] = [];
  revive_timer: number;
  returnAs: ReturnAs;
  protocol: string | null;
  shuffle: boolean;
  assume_aliveness: boolean;
  check_on_next: boolean;

  constructor(
    proxies?: null | string | string[],
    options: ProxyRotatorOptions = {}
  ) {
    this.pool = new Queue<Proxy>();
    const {
      returnAs,
      revive_timer,
      shuffle,
      protocol,
      assume_aliveness,
      check_on_next,
    } = options;

    this.revive_timer = revive_timer ?? 1000 * 60 * 30;
    this.returnAs = returnAs ? this._handleReturnAsInput(returnAs) ?? 'string' : 'string';
    this.protocol = protocol ?? null;
    this.shuffle = shuffle ?? false;
    this.assume_aliveness = assume_aliveness ?? false;
    this.check_on_next = check_on_next ?? false;

    if (proxies == null) {
      // no proxies
    } else if (typeof proxies === 'string') {
      this._processOne(proxies);
    } else if (this._isArray(proxies)) {
      for (const item of proxies) this._processOne(item);
    }

    if (this.shuffle) {
      const shuffled = this._shuffleArray(this.pool.toArray());
      this.pool = new Queue<Proxy>();
      shuffled.forEach((p) => this.pool.enqueue(p));
    }
  }

  getGraveyard(): string[] {
    return this.graveyard.map((p) => p.proxy);
  }

  getGraveyardSize(): number {
    return this.graveyard.length;
  }

  getPool(): string[] {
    return this.pool.toArray().map((p) => p.proxy);
  }

  getPoolSize(): number {
    return this.pool.size;
  }

  add(proxies: string | string[]): void {
    if (this._isArray(proxies)) {
      for (const proxy of proxies) this._add(proxy);
    } else {
      this._add(proxies);
    }
  }

  /** Parse a file of proxies (newline-, space-, or comma-separated) and add each to the pool. */
  add_file(filename: string): void {
    const parsed = this._parseFile(filename);
    parsed.forEach((p) => this._add(p));
  }

  private _add(proxy: string): void {
    const p = new Proxy(proxy, this.protocol, this.assume_aliveness);
    this.pool.enqueue(p);
  }

  /** Treat a string as either a file path (add all proxies from file) or a single proxy "ip:port" / "protocol://ip:port". */
  private _processOne(item: string): void {
    if (this._isFilePath(item)) {
      this.add_file(item);
    } else {
      this._add(item);
    }
  }

  /** True if the string is an existing file path. */
  private _isFilePath(s: string): boolean {
    try {
      const resolved = path.resolve(s);
      return fs.existsSync(resolved) && fs.statSync(resolved).isFile();
    } catch {
      return false;
    }
  }

  remove(proxy: string | string[]): void {
    if (this._isArray(proxy)) {
      for (const p of proxy) this._remove(p);
    } else {
      this._remove(proxy);
    }
  }

  private _remove(proxy: string | Proxy): void {
    this.pool.toArray().forEach((p, i) => {
      if (p.equals(proxy)) this.pool.removeAt(i);
    });
  }

  getAlive(): string | undefined {
    const proxies = this.pool.toArray();
    for (const proxy of proxies) {
      if (proxy.isAlive()) return proxy.proxy;
    }
    return undefined;
  }

  setAlive(proxy: string | Proxy): void {
    const proxies = this.pool.toArray();
    for (const p of proxies) {
      if (p.equals(proxy)) {
        p.setAlive();
        return;
      }
    }
    for (const p of this.graveyard) {
      if (p.equals(proxy)) {
        this.resurect(p);
        return;
      }
    }
  }

  resurect(proxy: string | Proxy): void {
    const p = this.graveyard.find((x) => x.equals(proxy));
    if (!p) return;
    this.graveyard = this.graveyard.filter((x) => !x.equals(proxy));
    p.setNew();
    this.pool.enqueue(p);
  }

  setDead(proxy: string | Proxy): void {
    this.pool.toArray().forEach((p, i) => {
      if (p.equals(proxy)) {
        p.setDead();
        this.pool.removeAt(i);
        this.graveyard.push(p);
      }
    });
    setTimeout(() => this.resurect(proxy), this.revive_timer);
  }

  kill(proxy: string | Proxy): void {
    this.setDead(proxy);
  }

  next(options: { returnAs?: ReturnAs | 'str' | 'obj' } = {}): string | ProxyObj | null {
    let { returnAs } = options;
    if (this.check_on_next) this._resurection();
    if (this.pool.size === 0) return null;

    const proxy = this.pool.dequeue();
    this.pool.enqueue(proxy);

    const resolvedReturnAs = returnAs
      ? this._handleReturnAsInput(returnAs)
      : this.returnAs;
    if (resolvedReturnAs === 'string') return proxy.toString();
    if (resolvedReturnAs === 'object') return proxy.obj();
    return null;
  }

  private _shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  private _handleReturnAsInput(
    proxyType: ReturnAs | 'str' | 'obj' | null
  ): ReturnAs | null {
    if (typeof proxyType === 'string') {
      proxyType = proxyType.toLowerCase() as ReturnAs | 'str' | 'obj';
      if (proxyType === 'str') proxyType = 'string';
      if (proxyType === 'obj') proxyType = 'object';
      if (proxyType !== 'string' && proxyType !== 'object') {
        console.error('proxyType must be either "string" or "object"');
        return null;
      }
      return proxyType as ReturnAs;
    }
    return null;
  }

  private _parseFile(filename: string): string[] {
    const str = fs.readFileSync(filename, 'utf8');
    let strList = str.split('\n').filter((s) => s.length > 0);
    if (strList.length === 1) strList = str.split(' ');
    if (strList.length === 1) strList = str.split(',');
    strList = strList
      .map((s) => s.replace(',', ''))
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return strList;
  }

  private _isArray(value: unknown): value is unknown[] {
    return (
      !!value &&
      typeof value === 'object' &&
      (value as object).constructor === Array
    );
  }

  private _resurection(): void {
    for (const proxy of this.graveyard) {
      if (
        proxy.isDead() &&
        proxy.timeSinceStatusChange() >= this.revive_timer
      ) {
        this.resurect(proxy);
      }
    }
  }

  async test_proxies(): Promise<void> {
    const proxies = this.pool.toArray().map((p) => {
      const parts = p.proxy.split(':');
      return { host: parts[0], port: parts[1] };
    });
    console.log('--- Testing Proxies ---');
    let workingCount = 0;
    let notWorkingCount = 0;
    for (const proxy of proxies) {
      console.log(`Testing proxy ${proxy.host}:${proxy.port}...`);
      const response = await makeRequestWithProxy(proxy);
      if (response?.ip === proxy.host) {
        console.log(`Proxy ${proxy.host}:${proxy.port} is working.`);
        workingCount++;
      } else {
        console.log(`Proxy ${proxy.host}:${proxy.port} is not working.`);
        notWorkingCount++;
      }
    }
    console.log('--- Statistics ---');
    console.log(`Total proxies: ${proxies.length}`);
    console.log(`Working proxies: ${workingCount}`);
    console.log(`Not working proxies: ${notWorkingCount}`);
  }

  test = this.test_proxies;
}
