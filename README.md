Proxy Rotator
=======
#### 


## Introduction

ProxyRotator is a JavaScript class that provides a mechanism for managing a pool of proxies and rotating them based on their availability and status. It supports country geolocation lookup, pool status reporting, and proxy testing with JSON output for programmatic use.

## Installation
```
npm install proxy-rotator-js
```

### Geolocation

The GeoLite2-Country database is **bundled in the package** at `assets/GeoLite2-Country.mmdb`, so geo works immediately with no download step.

To update to a newer database (MaxMind updates weekly), run:

```bash
npm run download:geo
```

You can also set `GEO_DB_PATH` to point to a custom mmdb file.

## Usage

```javascript

import ProxyRotator from 'proxy-rotator-js'

let proxies = ['proxy1', 'proxy2', 'proxy3']

let rotator = new ProxyRotator(proxies, options={})

console.log( rotator.next() ) // 'proxy1'
console.log( rotator.next() ) // 'proxy2'
```

or you can pass the path to a proxy file

```javascript

import ProxyRotator from 'proxy-rotator-js'

let filename = '/path/to/proxy/file.txt'

let rotator = new ProxyRotator(filename, options={});


console.log( rotator.next() ) // 'proxy1'
console.log( rotator.next() ) // 'proxy2'
```


Initializes a new instance of ProxyRotator with the given proxies and options. The proxies parameter can be a file path or an array of proxies. The options parameter allows customization of various settings such as revive timer, shuffling, protocol assumption, geolocation, and more.

**Note:** `add()` and `add_file()` are async when `fetchGeo` is true. Proxies passed to the constructor are added synchronously without geo; use `refreshGeo()` to look up country for them later.

## Methods 

```javascript
next(options?)           // Rotates the proxy by moving the front proxy to the end of the pool and returns it.
                         // Options: { returnAs: 'string' | 'object' } — when 'object', returns proxy with country info.

add(proxies)             // Adds one or more proxies to the pool. async — fetches country geolocation when fetchGeo is true.

add_file(filename)       // Parses a file (newline-, space-, or comma-separated) and adds proxies. async.

status()                 // Returns pool status as JSON. Each proxy includes country, status, changeTimeStamp.

refreshGeo()             // Fetches country geolocation for all proxies (constructor-added proxies start without geo). async.

test_proxies(options?)   // Tests proxies. Options: { output: 'console' | 'json' }.
                         // Default 'console' — prints to stdout. Use output: 'json' to get results for programmatic use.

getAlive()               // Retrieves an alive proxy from the pool.

setAlive(proxy)          // Sets a specific proxy to an alive state.

setDead(proxy)           // Sets a specific proxy to a dead state and moves it to the graveyard.

resurect(proxy)          // Moves a proxy from the graveyard back to the pool.

getPool()                // Returns an array of proxy strings in the pool.

getPoolSize()            // Returns the number of proxies in the pool.

getGraveyard()           // Returns an array of proxies in the graveyard (dead proxies).

getGraveyardSize()       // Returns the number of proxies in the graveyard.

remove(proxy)            // Removes one or more proxies from the pool.
```

## Properties

    pool: Represents the pool of proxies as a queue.

    graveyard: Stores proxies that are currently dead or inactive.

## Options
```javascript
const proxies = ['proxy1.example.com', 'proxy2.example.com'];
const options = {
    returnAs: 'object',
    revive_timer: 1000 * 60 * 30,
    shuffle: true,
    protocol: 'http',
    assume_aliveness: true,
    check_on_next: true,
    fetchGeo: true
};

const proxyRotator = new ProxyRotator(proxies, options);
```
    The following options can be passed to customize the behavior of the ProxyRotator:

    - returnAs: Specifies the return type of proxies. Can be either 'string' or 'object'. Default: 'string'.
    - revive_timer: Specifies the duration in milliseconds before a dead proxy is revived. Default: 1000 * 60 * 30 (30 minutes).
    - protocol: Specifies a protocol for all proxies. Default: null.
    - shuffle: Specifies whether to shuffle the proxies before adding them to the queue. Default: false.
    - assume_aliveness: Specifies whether to assume all proxies are alive when first added instead of 'new'. Default: false.
    - check_on_next: Specifies whether to check for resurrection when calling next(). Default: false.
    - fetchGeo: When true, fetches country geolocation (iso, name, continent) when adding proxies. Requires GeoLite2-Country.mmdb. Default: true.

## Testing your Proxies

```javascript
import ProxyRotator from 'proxy-rotator-js'

const proxies = ['proxy1', 'proxy2', 'proxy3']
const rotator = new ProxyRotator(proxies)

// Print results to console (default)
await rotator.test_proxies()
// or rotator.test()

// Get results as JSON for programmatic use
const results = await rotator.test_proxies({ output: 'json' })
// results = { results: [...], summary: { total, working, notWorking } }
```

## Pool Status

```javascript
const status = rotator.status()
// Returns: { pool: { size, proxies: ProxyObj[] }, graveyard: { size, proxies: ProxyObj[] }, config }
// Each proxy in proxies has: protocol, ip, host, port, status, changeTimeStamp, country (when fetchGeo)
```

## Geolocation

When `fetchGeo` is true (default), proxies added via `add()` or `add_file()` are enriched with country data. Use `returnAs: 'object'` to get the full proxy object including country:

```javascript
const rotator = new ProxyRotator(null, { fetchGeo: true })
await rotator.add(['1.2.3.4:8080'])
const proxy = rotator.next({ returnAs: 'object' })
// proxy.country → { iso: 'US', name: 'United States', continent: 'NA' }
```

Proxies loaded via the constructor (file or array) do not get geo by default. Call `refreshGeo()` to populate country for existing proxies:

```javascript
const rotator = new ProxyRotator(['1.2.3.4:8080'])
await rotator.refreshGeo()
const proxy = rotator.next({ returnAs: 'object' })
// proxy.country now populated
```

To skip geolocation (e.g. when the database is not available), set `fetchGeo: false`:

```javascript
const rotator = new ProxyRotator(null, { fetchGeo: false })
await rotator.add('1.2.3.4:8080')
```

## Getting Started

To use the ProxyRotator class in your JavaScript project, follow these steps:

    Make sure you have Node.js  and npm installed on your system. 

```javascript
npm install proxy-rotator-js
```

Import the ProxyRotator class into your JavaScript file using the following line of code:

    Create an instance of ProxyRotator by calling the constructor and providing the required parameters. For example:

```javascript

const proxies = ['proxy1:8000', 'proxy2:322', 'proxy3:543'];
const rotator = new ProxyRotator(proxies);

```

    Access the properties and methods of the ProxyRotator object using dot notation. For example:

```javascript

rotator.next();
// 'proxy1:500'
const poolSize = proxyRotator.getPoolSize();
// 3
const aliveProxy = proxyRotator.getAlive();
// 'proxy2:500'
proxyRotator.setAlive( 'proxy2:500' );
// null 
```

### Examples


```javascript

import ProxyRotator from './ProxyRotator.js';

// Create an instance of ProxyRotator
const proxies = ['proxy1', 'proxy2', 'proxy3'];
const options = { revive_timer: 1800000, shuffle: true };
const proxyRotator = new ProxyRotator(proxies, options);

// Access the properties
console.log(proxyRotator.getGraveyard());  // Output: []
console.log(proxyRotator.getGraveyardSize());  // Output: 0
console.log(proxyRotator.getPool());  // Output: ['proxy1', 'proxy2', 'proxy3']
console.log(proxyRotator.getPoolSize());  // Output: 3

// Call the methods (add is async when fetchGeo is true)
await proxyRotator.add('proxy4');
console.log(proxyRotator.getPool());  // Output: ['proxy1', 'proxy2', 'proxy3', 'proxy4']
proxyRotator.remove('proxy2');
console.log(proxyRotator.getPool());  // Output: ['proxy1', 'proxy3', 'proxy4']
const aliveProxy = proxyRotator.getAlive();
console.log(aliveProxy);  // Output: 'proxy1'
proxyRotator.setAlive('proxy3');
proxyRotator.next(); // prox1
proxyRotator.next(); // prox3
proxyRotator.next(); // prox4
console.log(proxyRotator.getPool());  // Output: ['proxy1', 'proxy4', 'proxy3']
```

### Contributing

If you would like to contribute to the ProxyRotator project, you can fork the repository and make your desired changes. Feel free to submit a pull request with your improvements or bug fixes. We appreciate your contributions!

### License

The ProxyRotator class is released under the MIT License. You can freely use and modify it in your projects. Please refer to the license file for more information.

### Contact

If you have any questions, suggestions, or feedback regarding the ProxyRotator class, please me =) Goran Topic @  telegonicaxx@live.com. We appreciate your input and are happy to assist you.

Thank you for using the ProxyRotator class. We hope it helps simplify your proxy management and rotation tasks.
