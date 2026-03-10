import axios from 'axios';

export interface ProxyConfig {
  host: string;
  port: string;
  protocol?: string;
}

export default async function makeRequestWithProxy(
  proxy: ProxyConfig
): Promise<{ ip: string } | null> {
  try {
    const response = await axios.get('https://api.ipify.org?format=json', {
      proxy: {
        host: proxy.host,
        port: Number(proxy.port),
        protocol: 'http',
      },
    });
    console.log(response.data);
    return response.data as { ip: string };
  } catch {
    return null;
  }
}
