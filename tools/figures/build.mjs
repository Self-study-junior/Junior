// 產生附圖：node figures/build.mjs [科目...]
// 每科一個模組（biology.mjs…），匯出 { 'u3-s2': { cap: '圖說', svg: () => '<svg…>' } }
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { applyFigures } from './apply.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['biology', 'earth', 'history'];
for (const id of ids) {
  const figs = (await import(`./${id}.mjs`)).default;
  const dir = path.join(root, 'assets/fig', id);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
  const index = {};
  for (const [k, f] of Object.entries(figs)) {
    fs.writeFileSync(path.join(dir, k + '.svg'), typeof f.svg === 'function' ? f.svg() : f.svg);
    index[k] = f.cap;
  }
  fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(index, null, 1));
  const file = path.join(root, 'data', id + '.js');
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx);
  const units = applyFigures(root, id, ctx.window.NOTES[id]);
  fs.writeFileSync(file, `window.NOTES=window.NOTES||{};window.NOTES[${JSON.stringify(id)}]=${JSON.stringify(units)};\n`);
  const kb = fs.readdirSync(dir).reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0) / 1024;
  console.log(`${id}: ${Object.keys(figs).length} 張附圖，${kb.toFixed(0)} KB`);
}
