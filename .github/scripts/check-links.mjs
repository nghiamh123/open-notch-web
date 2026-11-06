// CI: mọi đường dẫn cục bộ trong index.html phải trỏ tới file có thật.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync('index.html', 'utf8');
const refs = new Set();

for (const m of html.matchAll(/\b(?:src|href|poster|content)="([^"]+)"/g)) {
  const v = m[1].split('#')[0].split('?')[0];
  if (!v || /^(?:[a-z]+:|\/\/|#)/i.test(m[1])) continue; // http(s):, mailto:, #anchor...
  if (!/\.[a-z0-9]{2,5}$/i.test(v)) continue;            // bỏ qua content="width=device-width..." v.v.
  refs.add(v);
}

const missing = [...refs].filter((p) => !existsSync(join('.', p)));
console.log(`Đã kiểm tra ${refs.size} đường dẫn cục bộ.`);
if (missing.length) {
  console.error('Thiếu file:\n' + missing.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
