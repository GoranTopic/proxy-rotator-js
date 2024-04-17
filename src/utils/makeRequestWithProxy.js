import axios from 'axios';
// Description: Function to make an Axios request using a proxy

// Function to make an Axios request using a proxy
async function makeRequestWithProxy(proxy) {
  try {
    const response = await axios.get('https://api.ipify.org?format=json', {
      proxy: {
        host: proxy.host,
        port: proxy.port,
        protocol: 'http'
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    return null;
  }
}

export default makeRequestWithProxy;
