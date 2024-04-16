const fs = require('fs');
const axios = require('axios');

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

// Function to read proxies from a file
function readProxiesFromFile(filePath) {
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const proxies = fileData.split('\n').map((line) => {
            let [host, port] = line.split(':');
            port = parseInt(port);
            host = host.trim();
            return { host, port };
        });
        return proxies;
    } catch (error) {
        console.error('Error reading proxies from file:', error);
        return [];
    }
}

// Main function to test proxies
async function testProxies() {
  const proxies = readProxiesFromFile('proxies.txt');
  let workingCount = 0;
  let notWorkingCount = 0;
  for (const proxy of proxies) {
    console.log(`Testing proxy ${proxy.host}:${proxy.port}...`);    
    const response = await makeRequestWithProxy(proxy);
    if (response === proxy.host) {
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

// Run the testProxies function
testProxies();
