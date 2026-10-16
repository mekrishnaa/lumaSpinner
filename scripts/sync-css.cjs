const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../src/styles/lumaspinner.css');
const tsPath = path.resolve(__dirname, '../src/styles/css-content.ts');

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
    .replace(/\s+/g, ' ') // collapse whitespace
    .replace(/\s*([\{\}\:\;\,])\s*/g, '$1') // remove spaces around syntax chars
    .replace(/;\}/g, '}') // trailing semicolon in rule
    .trim();
}

const rawCss = fs.readFileSync(cssPath, 'utf8');
const esbuild = require('esbuild');
const minified = esbuild.transformSync(rawCss, { loader: 'css', minify: true }).code.trim();

// Escape backticks and template interpolation
const escaped = minified
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

const tsContent = `// Auto-generated CSS bundle content for zero-config auto-injection\nexport const LUMA_CSS_TEXT = \`${escaped}\`;\n`;

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log(`Successfully synchronized CSS (${rawCss.length} bytes -> ${minified.length} bytes) to ${tsPath}`);

