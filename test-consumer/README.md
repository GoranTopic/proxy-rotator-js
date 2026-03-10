# Consumer import tests

Simulates someone who installed `proxy-rotator-js` and imports it from **JavaScript (CJS)**, **JavaScript (ESM)**, and **TypeScript**.

## Run all consumer tests (from project root)

```bash
npm run test:consumer
```

This builds the package, installs it here via `"proxy-rotator-js": "file:.."`, then runs:

- **require.cjs** – CommonJS `require('proxy-rotator-js')`
- **import.js** – ESM `import ProxyRotator from 'proxy-rotator-js'`
- **import.ts** – TypeScript with types `import ProxyRotator, { type ProxyRotatorOptions } from 'proxy-rotator-js'`

## Run manually (after `npm run build` from project root)

```bash
npm install
node require.cjs
node import.js
npx tsx import.ts
```
