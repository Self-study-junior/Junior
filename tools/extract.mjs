// 從「會考衝刺站」單檔 HTML 抽出重點筆記（不含題庫），輸出 data/<科目>.js
// 用法：node tools/extract.mjs <來源.html 或 .json> <civics|history|biology|earth|english> [--images]
//   --images  連同講義原圖一起輸出到 assets/img/<科目>/（出版社講義掃描，公開網站不建議）
// 自己重繪的附圖在 assets/fig/<科目>/，由 tools/figures/build.mjs 產生，這裡會自動接上
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { applyFigures } from './figures/apply.mjs';

const [src, id, ...flags] = process.argv.slice(2);
const SUBJECTS = ['civics', 'history', 'biology', 'earth', 'english'];
if (!src || !SUBJECTS.includes(id)) {
  console.error('用法：node tools/extract.mjs <來源.html> <' + SUBJECTS.join('|') + '> [--images]');
  process.exit(1);
}
const withImages = flags.includes('--images');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// 來源可以是「會考衝刺站」HTML，或同樣結構的 JSON 匯出檔
let raw;
if (src.endsWith('.json')) raw = JSON.parse(fs.readFileSync(src, 'utf8'));
else {
  const line = fs.readFileSync(src, 'utf8').split('\n').find(l => /^const (DATA|D) =/.test(l));
  if (!line) throw new Error('找不到 const DATA / const D');
  raw = vm.runInNewContext('(' + line.replace(/^const \w+ =\s*/, '').replace(/;\s*$/, '') + ')');
}

let out;
if (id === 'english') {
  // 只留筆記：單字、一字多義、文法、學習策略；題目、閱讀文章、聽力一律不收
  const MERGE = { '職業與人物': '職業', '房子公寓與家中物品': '房屋與公寓', '國家地點': '國家、地區與語言', '名詞': '其他名詞', '服裝與飾品': '衣物飾品', '食物': '飲食' };
  out = {
    vocab: raw.vocab.map(v => ({ w: v.w, pos: v.pos, zh: v.zh, note: v.note || '', topic: MERGE[v.topicG] || v.topicG })),
    polysemy: raw.polysemy.map(p => ({ w: p.w, senses: p.senses })),
    grammar: raw.grammar.map(g => ({ gt: g.gt, heading: g.heading, points: g.points, examples: g.examples || [], src: g.src })),
    strategies: raw.strategies.map(s => ({ name: s.name, area: s.area, steps: s.steps })),
  };
} else {
  const imgDir = path.join(root, 'assets/img', id);
  if (withImages) fs.mkdirSync(imgDir, { recursive: true });
  out = raw.filter(u => (u.sections || []).length).map(u => ({
    unit: u.unit, part: u.part, title: u.title, summary: u.summary,
    sections: u.sections.map((s, i) => {
      const sec = { heading: s.heading, points: s.points };
      if (s.example) sec.example = s.example;
      const m = withImages && s.img && s.img.match(/^data:image\/(\w+);base64,(.+)$/);
      if (m) {
        const name = `u${u.unit}-s${i + 1}.${m[1]}`;
        fs.writeFileSync(path.join(imgDir, name), Buffer.from(m[2], 'base64'));
        sec.img = `../assets/img/${id}/${name}`;
      }
      return sec;
    }),
    confusions: u.confusions || [],
    terms: u.terms || [],
    ...(u.experiments?.length ? { experiments: u.experiments } : {}),
    ...(u.timeline?.length ? { timeline: u.timeline } : {}),
    ...(u.sources?.length ? { sources: u.sources } : {}),
  }));
  applyFigures(root, id, out);
}
const file = path.join(root, 'data', id + '.js');
fs.writeFileSync(file, `window.NOTES=window.NOTES||{};window.NOTES[${JSON.stringify(id)}]=${JSON.stringify(out)};\n`);
console.log(`${id}: ${(fs.statSync(file).size / 1024).toFixed(0)} KB → ${path.relative(root, file)}`);

// 重新產生首頁用的摘要 data/summary.js（各科單元數、重點數…），首頁不必載入全部筆記
const summary = {};
for (const f of fs.readdirSync(path.join(root, 'data')).filter(f => f.endsWith('.js') && f !== 'summary.js')) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'data', f), 'utf8'), ctx);
  for (const [k, d] of Object.entries(ctx.window.NOTES)) {
    summary[k] = Array.isArray(d)
      ? { units: d.length, parts: [...new Set(d.map(u => u.part))], sections: d.reduce((n, u) => n + u.sections.length, 0),
          terms: d.reduce((n, u) => n + u.terms.length, 0), confusions: d.reduce((n, u) => n + u.confusions.length, 0) }
      : { vocab: d.vocab.length, polysemy: d.polysemy.length, grammar: d.grammar.length, strategies: d.strategies.length };
  }
}
fs.writeFileSync(path.join(root, 'data/summary.js'), `window.SUMMARY=${JSON.stringify(summary)};\n`);
