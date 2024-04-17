Proxy Rotator
=======
#### 


## Introduction

ProxyRotator is a JavaScript class that provides a mechanism for managing a pool of proxies and rotating them based on their availability and status.

## Installation
```
npm install proxy-rotator-js
```

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


Initializes a new instance of ProxyRotator with the given proxies and options. The proxies parameter can be a file path or an array of proxies. The options parameter allows customization of various settings such as revive timer, shuffling, protocol assumption, and more.
Methods

## Methods 

```javascript
next() // Rotates the proxy by moving the front proxy to the end of the pool and returns it.

add(proxies) // Adds one or more proxies to the pool.

getAlive() //  Retrieves a random alive proxy from the pool.

setAlive(proxy) // Sets a specific proxy to an alive state.

setDead(proxy) // Sets a specific proxy to a dead state and moves it to the graveyard.

resurrect(proxy) // Moves a proxy from the graveyard back to the pool.

getPool() // Returns an array of proxies in the pool.

getPoolSize() // Returns the number of proxies in the pool.

getGraveyard() // Returns an array of proxies in the graveyard (dead proxies).

getGraveyardSize() // Returns the number of proxies in the graveyard.

remove(proxy) // Removes one or more proxies from the pool.
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
    check_on_next: true
};

const proxyRotator = new ProxyRotator(proxies, options);
```
    The following options can be passed to customize the behavior of the ProxyRotator:

    - returnAs: Specifies the return type of proxies. Can be either 'string' or 'object'. Default: 'string'.
    - revive_timer: Specifies the duration in milliseconds before a dead proxy is revived. Default: 1000 * 60 * 30 (30 minutes).
    - protocol: Specifies a protocol for all proxies. Default: null.
    - shuffle: Specifies whether to shuffle the proxies before adding them to the queue. Default: false.
    - assume_aliveness: Specifies whether to assume all proxies are alive when first added instead of 'new'. Default: false.
    - check_on_next: Specifies whether to check if proxies are alive when they are added to the queue. Default: false.

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

// Call the methods
proxyRotator.add('proxy4');
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
License

The ProxyRotator class is released under the MIT License. You can freely use and modify it in your projects. Please refer to the license file for more information.
Contact

If you have any questions, suggestions, or feedback regarding the ProxyRotator class, please me =) Goran Topic @  telegonicaxx@live.com. We appreciate your input and are happy to assist you.

Thank you for using the ProxyRotator class. We hope it helps simplify your proxy management and rotation tasks.
