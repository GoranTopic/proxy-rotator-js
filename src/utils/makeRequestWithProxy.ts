import axios from 'axios';

export interface ProxyConfig {
  host: string;
  port: string;
  protocol?: string;
}

export interface MakeRequestWithProxyOptions {
  /** If true, suppresses console output. Default false. */
  quiet?: boolean;
}

export default async function makeRequestWithProxy(
  proxy: ProxyConfig,
  options: MakeRequestWithProxyOptions = {}
): Promise<{ ip: string } | null> {
  try {
    const response = await axios.get('https://api.ipify.org?format=json', {
      proxy: {
        host: proxy.host,
        port: Number(proxy.port),
        protocol: 'http',
      },
    });
    if (!options.quiet) {
      console.log(response.data);
    }
    return response.data as { ip: string };
  } catch {
    return null;
  }
}
