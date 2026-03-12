/**
 * After CJS tsc build, renames dist/cjs .js files to .cjs and
 * updates require() paths so Node loads them as CommonJS.
 * Also copies geo.cjs (excluded from tsc) to dist/cjs/utils/.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../dist/cjs');
const utilsDir = path.join(root, 'src', 'utils');
fs.mkdirSync(utilsDir, { recursive: true });
fs.copyFileSync(
  path.join(__dirname, '../src/utils/geo.cjs'),
  path.join(utilsDir, 'geo.cjs')
);
const allFiles = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.js')) allFiles.push(full);
  }
}
walk(root);

for (const jsPath of allFiles) {
  let content = fs.readFileSync(jsPath, 'utf8');
  content = content.replace(/require\((['"])(\.\/[^'"]+)\.js\1\)/g, "require($1$2.cjs$1)");
  const cjsPath = jsPath.replace(/\.js$/, '.cjs');
  fs.writeFileSync(cjsPath, content);
  fs.unlinkSync(jsPath);
}

function walkMap(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walkMap(full);
    else if (name.endsWith('.js.map')) {
      fs.renameSync(full, full.replace(/\.js\.map$/, '.cjs.map'));
    }
  }
}
walkMap(root);

console.log('CJS files renamed to .cjs');
