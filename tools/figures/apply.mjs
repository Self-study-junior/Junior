// 把 assets/fig/<科目>/index.json 的附圖接到筆記資料的對應小節（key = u單元-s第幾節）
import fs from 'node:fs';
import path from 'node:path';
export function applyFigures(root, id, units) {
  const f = path.join(root, 'assets/fig', id, 'index.json');
  const idx = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
  for (const u of units) u.sections.forEach((s, i) => {
    const k = `u${u.unit}-s${i + 1}`;
    delete s.fig;
    if (idx[k]) s.fig = { src: `../assets/fig/${id}/${k}.svg`, cap: idx[k] };
  });
  return units;
}
