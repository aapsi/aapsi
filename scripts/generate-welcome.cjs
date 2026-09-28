// Usage: NODE_PATH=/path/to/node_modules node scripts/generate-welcome.cjs
// Requires opentype.js. Artwork and outlined lettering are generated locally.
const fs = require('node:fs');
const path = require('node:path');
const opentype = require('opentype.js');
const root = path.resolve(__dirname, '..');
const font = opentype.parse(fs.readFileSync(path.join(root, 'assets/SpaceGrotesk.ttf')).buffer);

function lettering(text, x, y, size, color) {
  const outline = font.getPath(text, x, y, size);
  const d = outline.toPathData(2);
  if (/NaN|undefined|Infinity/.test(d)) throw new Error(`Invalid lettering: ${text}`);
  return `<path fill="${color}" d="${d}"/>`;
}

for (const theme of ['light', 'dark']) {
  const dark = theme === 'dark';
  const bg = dark ? '#181c20' : '#f5f2ea';
  const fg = dark ? '#f3f0e6' : '#202822';
  const muted = dark ? '#b7c1b8' : '#4e6055';
  const line = dark ? '#405249' : '#b3c0b5';
  const accent = dark ? '#ffab70' : '#ad431b';
  for (const mobile of [false, true]) {
    const w = mobile ? 600 : 960;
    const h = mobile ? 390 : 420;
    const end = w - 55;
    const middle = mobile ? 372 : 660;
    const ys = mobile ? [232, 282, 332] : [240, 294, 348];
    const labelX = 34;
    const start = mobile ? 220 : 255;
    const paths = ys.map(y => `M ${start} ${y} H ${middle - 110} C ${middle - 25} ${y} ${middle - 35} ${ys[1]} ${middle + 55} ${ys[1]} H ${end}`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
  <title id="title">Aapsi Khaira — from the contract to the whole system.</title>
  <desc id="desc">Three signal paths connect contracts, infrastructure, and product. The routing animation runs once and respects reduced motion.</desc>
  <style>
    .signal { stroke-dasharray: 22 1000; stroke-dashoffset: 24; animation: route 4s cubic-bezier(.22,.61,.36,1) both; }
    .b { animation-delay: .16s; animation-duration: 3.8s; }
    .c { animation-delay: .32s; animation-duration: 3.6s; }
    @keyframes route { 0% {stroke-dashoffset:24;opacity:0} 5% {opacity:1} 85% {opacity:1} 100% {stroke-dashoffset:-900;opacity:0} }
    @media (prefers-reduced-motion: reduce) { .signal {animation:none;display:none} }
  </style>
  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${lettering('Aapsi Khaira.', 32, mobile ? 105 : 121, mobile ? 70 : 94, fg)}
  ${lettering(mobile ? 'From the contract' : 'From the contract to the whole system.', 35, mobile ? 151 : 169, mobile ? 28 : 29, muted)}
  ${mobile ? lettering('to the whole system.', 35, 187, 28, muted) : ''}
  <g fill="none" stroke="${line}" stroke-width="2.5" stroke-linecap="round">${paths.map(d => `<path d="${d}"/>`).join('')}</g>
  <g fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round">${paths.map((d,i) => `<path class="signal ${['a','b','c'][i]}" d="${d}"/>`).join('')}</g>
  ${['contracts', 'infrastructure', 'product'].map((t,i) => lettering(t, labelX, ys[i]+7, mobile ? 23 : 25, muted)).join('')}
  ${ys.map(y => `<circle cx="${start}" cy="${y}" r="4" fill="${fg}"/>`).join('')}
  <circle cx="${end}" cy="${ys[1]}" r="14" fill="${bg}" stroke="${accent}" stroke-width="2.5"/>
  <circle cx="${end}" cy="${ys[1]}" r="5" fill="${accent}"/>
  <path d="M 34 ${h-17} H ${w-34}" fill="none" stroke="${line}"/>
</svg>\n`;
    fs.writeFileSync(path.join(root, `assets/welcome-${theme}${mobile ? '-mobile' : ''}.svg`), svg);
  }
}

fs.writeFileSync(path.join(root, 'assets/activity-static.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 100" role="img" aria-label="Explore my contribution history using the link below"><rect width="800" height="100" fill="#f5f2ea"/>${lettering('A little less motion. The same curiosity.', 26, 59, 30, '#202822')}</svg>\n`);
