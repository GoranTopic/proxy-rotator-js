import ProxyRotator from './src/ProxyRotator.js';
import Proxy from './src/Proxy.js';

export default ProxyRotator;
export { ProxyRotator, Proxy };

export type {
  ProxyRotatorOptions,
  ReturnAs,
  PoolStatus,
  ProxyTestResult,
  ProxyTestResults,
} from './src/ProxyRotator.js';
export type { ProxyStatus, ProxyInfo, ProxyObj } from './src/Proxy.js';
export type { GeoCountry } from './src/utils/geo-types.js';
export type { ProxyConfig } from './src/utils/makeRequestWithProxy.js';
