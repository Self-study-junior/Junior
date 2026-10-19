// 附圖繪製小工具：產生 SVG 字串
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { geoMercator, geoPath, geoEquirectangular, geoNaturalEarth1, geoGraticule10 } from 'd3-geo';
import { feature, mesh } from 'topojson-client';

export const C = {
  ink: '#1f2630', muted: '#646b72', line: '#b9b2a3', paper: '#fffdf8', soft: '#f3efe6',
  red: '#d0505f', blue: '#3b6fb6', green: '#2f8a63', orange: '#e08a2c', purple: '#7a5bb5',
  teal: '#1a8a96', brown: '#8a5a2b', yellow: '#f2c94c', pink: '#e98fa6', sky: '#8cc4e8',
  redS: '#f8dde1', blueS: '#dce8f6', greenS: '#dcefe4', orangeS: '#fbe9d3', purpleS: '#ebe3f6',
  tealS: '#d7eef0', brownS: '#f1e5d6', yellowS: '#fdf3c9', grayS: '#ebe8e1',
  sea: '#dcecf5', land: '#f7f3ea', border: '#cfc6b4',
};
const FONT = `'Noto Sans TC','PingFang TC','Microsoft JhengHei','Heiti TC','WenQuanYi Zen Hei',sans-serif`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = v => Math.round(v * 10) / 10;

export function svg(w, h, body, { bg = C.paper } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="${FONT}" font-size="14" fill="${C.ink}">` +
    (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') + body + '</svg>';
}

// 文字，\n 換行
export function T(x, y, s, o = {}) {
  const { size = 14, anchor = 'middle', fill = C.ink, weight = 400, lh = 1.3, rotate, halo, italic } = o;
  const lines = String(s).split('\n');
  const y0 = y - ((lines.length - 1) * size * lh) / 2;
  const tr = rotate ? ` transform="rotate(${rotate} ${n(x)} ${n(y)})"` : '';
  const hs = halo ? ` stroke="${halo === true ? '#fff' : halo}" stroke-width="3.5" stroke-linejoin="round" paint-order="stroke"` : '';
  return `<text x="${n(x)}" y="${n(y0)}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="${fill}" font-weight="${weight}"${italic ? ' font-style="italic"' : ''}${hs}${tr}>` +
    lines.map((l, i) => `<tspan x="${n(x)}" dy="${i ? size * lh : 0}">${esc(l)}</tspan>`).join('') + '</text>';
}
// 直書文字
export function TV(x, y, s, o = {}) {
  const size = o.size || 14, chars = [...s];
  return chars.map((c, i) => T(x, y + (i - (chars.length - 1) / 2) * size * 1.1, c, o)).join('');
}
const st = o => {
  const { fill = 'none', stroke = 'none', sw = 1.5, dash, op, r, cap = 'round' } = o;
  return ` fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="${cap}" stroke-linejoin="round"` +
    (dash ? ` stroke-dasharray="${dash}"` : '') + (op != null ? ` opacity="${op}"` : '');
};
export const R = (x, y, w, h, o = {}) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${o.r ?? 6}"${st({ fill: C.paper, stroke: C.ink, ...o })}/>`;
export const O = (cx, cy, r, o = {}) => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}"${st({ fill: C.paper, stroke: C.ink, ...o })}/>`;
export const E = (cx, cy, rx, ry, o = {}) => `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}"${st({ fill: C.paper, stroke: C.ink, ...o })}/>`;
export const P = (d, o = {}) => `<path d="${d}"${st({ stroke: C.ink, ...o })}/>`;
export const L = (x1, y1, x2, y2, o = {}) => P(`M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`, o);
export const G = (body, tr) => `<g${tr ? ` transform="${tr}"` : ''}>${body}</g>`;

// 箭頭頭
function head(x, y, ang, color, size) {
  const a1 = ang + Math.PI * 0.85, a2 = ang - Math.PI * 0.85;
  return `<path d="M${n(x)} ${n(y)}L${n(x + size * Math.cos(a1))} ${n(y + size * Math.sin(a1))}L${n(x + size * Math.cos(a2))} ${n(y + size * Math.sin(a2))}Z" fill="${color}"/>`;
}
// 折線箭頭 pts=[[x,y],...]
export function A(pts, o = {}) {
  const { stroke = C.ink, sw = 2, size = 6 + sw * 1.5, both, dash } = o;
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const back = size * 0.6;
  const end = [b[0] - back * Math.cos(ang), b[1] - back * Math.sin(ang)];
  let q = [...pts.slice(0, -1), end];
  let out = '';
  if (both) {
    const [c, d] = [pts[1], pts[0]], ang2 = Math.atan2(d[1] - c[1], d[0] - c[0]);
    q[0] = [d[0] - back * Math.cos(ang2), d[1] - back * Math.sin(ang2)];
    out += head(d[0], d[1], ang2, stroke, size);
  }
  return P('M' + q.map(p => `${n(p[0])} ${n(p[1])}`).join('L'), { stroke, sw, dash }) + out + head(b[0], b[1], ang, stroke, size);
}
// 弧形箭頭（二次貝茲）
export function AQ(x1, y1, cx, cy, x2, y2, o = {}) {
  const { stroke = C.ink, sw = 2, size = 6 + sw * 1.5, dash } = o;
  const ang = Math.atan2(y2 - cy, x2 - cx), back = size * 0.6;
  const ex = x2 - back * Math.cos(ang), ey = y2 - back * Math.sin(ang);
  return P(`M${n(x1)} ${n(y1)}Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)}`, { stroke, sw, dash }) + head(x2, y2, ang, stroke, size);
}
// 有字的框
export function B(x, y, w, h, s, o = {}) {
  const { fill = C.paper, stroke = C.ink, size = 14, color = C.ink, weight = 400, r = 8, sw = 1.5 } = o;
  return R(x, y, w, h, { fill, stroke, r, sw }) + T(x + w / 2, y + h / 2, s, { size, fill: color, weight });
}
// 標籤 + 引線：從 (px,py) 拉到文字 (tx,ty)
export function callout(px, py, tx, ty, s, o = {}) {
  const { anchor = tx < px ? 'end' : 'start', color = C.ink, size = 13, dot = true } = o;
  const gap = anchor === 'end' ? 4 : anchor === 'start' ? -4 : 0;
  return L(px, py, tx + gap, ty, { stroke: C.muted, sw: 1 }) + (dot ? O(px, py, 2.2, { fill: C.muted, stroke: 'none' }) : '') +
    T(tx, ty, s, { size, anchor, fill: color, ...o });
}
// 平滑封閉曲線（Catmull-Rom）
export function smooth(pts, closed = true) {
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${n(p[1][0])} ${n(p[1][1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    d += `C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
// 圖例
export function legend(x, y, items, o = {}) {
  const { size = 13, gap = 22, w = 150, title } = o;
  let out = '', yy = y + 14 + (title ? 20 : 0);
  const h = items.length * gap + 12 + (title ? 20 : 0);
  out += R(x, y, w, h, { fill: 'rgba(255,253,248,.92)', stroke: C.line, sw: 1, r: 6 });
  if (title) out += T(x + 10, y + 16, title, { anchor: 'start', size, weight: 700 });
  for (const it of items) {
    const [kind, color, label] = it;
    if (kind === 'box') out += R(x + 10, yy - 6, 18, 12, { fill: color, stroke: it[3] || 'none', r: 2, sw: 1 });
    else if (kind === 'arrow') out += A([[x + 8, yy], [x + 30, yy]], { stroke: color, sw: 2.5, size: 8 });
    else if (kind === 'dash') out += L(x + 8, yy, x + 30, yy, { stroke: color, sw: 2.5, dash: '5 4' });
    else if (kind === 'line') out += L(x + 8, yy, x + 30, yy, { stroke: color, sw: 2.5 });
    else if (kind === 'dot') out += O(x + 19, yy, 4.5, { fill: color, stroke: '#fff', sw: 1.2 });
    else if (kind === 'sq') out += R(x + 14, yy - 5, 10, 10, { fill: color, stroke: 'none', r: 1 });
    out += T(x + 38, yy, label, { anchor: 'start', size });
    yy += gap;
  }
  return out;
}

// ---------------- 地圖 ----------------
const require = createRequire(import.meta.url);
const TOPO = {};
function topo(res) { return TOPO[res] ||= JSON.parse(fs.readFileSync(require.resolve(`world-atlas/countries-${res}.json`), 'utf8')); }

// bbox=[西經度, 南緯度, 東經度, 北緯度]
export function geomap({ bbox, w, res = '50m', proj = 'mercator', borders = true, grid = false, rotate }) {
  const [x0, y0, x1, y1] = bbox;
  const P0 = proj === 'equirect' ? geoEquirectangular() : proj === 'natural' ? geoNaturalEarth1() : geoMercator();
  if (rotate) P0.rotate(rotate);
  P0.scale(1).translate([0, 0]);
  const a = P0([x0, y1]), b = P0([x1, y0]);
  const s = w / (b[0] - a[0]);
  const h = Math.round((b[1] - a[1]) * s);
  P0.scale(s).translate([-a[0] * s, -a[1] * s]).clipExtent([[0, 0], [w, h]]);
  const path = geoPath(P0).digits(1);
  const t = topo(res);
  const land = feature(t, t.objects.land || t.objects.countries);
  const p = ll => P0(ll);
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  const api = {
    w, h, p,
    base() {
      let out = `<defs><clipPath id="${id}"><rect width="${w}" height="${h}"/></clipPath></defs><rect width="${w}" height="${h}" fill="${C.sea}"/>`;
      if (grid) out += `<path d="${path(geoGraticule10())}" fill="none" stroke="#c6dceb" stroke-width=".6"/>`;
      out += `<path d="${path(land)}" fill="${C.land}" stroke="#a9b8c2" stroke-width=".8"/>`;
      if (borders) out += `<path d="${path(mesh(t, t.objects.countries, (a, b) => a !== b))}" fill="none" stroke="${C.border}" stroke-width=".7"/>`;
      return out;
    },
    // 單一國家（依名稱）填色
    country(names, o = {}) {
      const set = new Set([].concat(names));
      const fs_ = feature(t, t.objects.countries).features.filter(f => set.has(f.properties.name));
      return fs_.map(f => `<path d="${path(f)}"${st({ fill: o.fill || C.redS, stroke: o.stroke || 'none', sw: o.sw || .8, op: o.op })}/>`).join('');
    },
    // 平面化的區域（手繪範圍，平滑）
    region(lls, o = {}) { return `<g clip-path="url(#${id})">${P(smooth(lls.map(p)), { fill: C.redS, stroke: 'none', op: .75, ...o })}</g>`; },
    poly(lls, o = {}) { return `<g clip-path="url(#${id})">${P('M' + lls.map(p).map(q => q.map(n).join(' ')).join('L') + 'Z', { fill: C.redS, stroke: 'none', ...o })}</g>`; },
    // 路線（平滑折線＋箭頭）
    route(lls, o = {}) {
      const pts = lls.map(p), { stroke = C.red, sw = 2.5, arrow = true, dash } = o;
      if (pts.length === 2 || !o.curve) return arrow ? A(pts, { stroke, sw, dash }) : P('M' + pts.map(q => q.map(n).join(' ')).join('L'), { stroke, sw, dash });
      const d = smooth(pts, false);
      const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
      return P(d, { stroke, sw, dash }) + (arrow ? A([[b[0] - (b[0] - a[0]) * .05, b[1] - (b[1] - a[1]) * .05], b], { stroke, sw: 0.01, size: 6 + sw * 1.5 }) : '');
    },
    dot(ll, label, o = {}) {
      const [x, y] = p(ll), { dx = 6, dy = 0, anchor = dx < 0 ? 'end' : dx === 0 ? 'middle' : 'start', size = 13, color = C.ink, mark = 'dot', fill = C.ink, weight = 400 } = o;
      const m = mark === 'cap' ? R(x - 4, y - 4, 8, 8, { fill: C.red, stroke: '#fff', sw: 1.2, r: 1 })
        : mark === 'star' ? T(x, y, '★', { size: 14, fill: C.red }) : mark === 'none' ? '' : O(x, y, 3.5, { fill, stroke: '#fff', sw: 1.2 });
      return m + (label ? T(x + dx, y + dy, label, { anchor, size, fill: color, halo: true, weight }) : '');
    },
    label(ll, s, o = {}) { const [x, y] = p(ll); return T(x, y, s, { halo: true, size: 14, ...o }); },
    frame() { return R(0.5, 0.5, w - 1, h - 1, { fill: 'none', stroke: C.line, sw: 1, r: 0 }); },
  };
  return api;
}
// 地圖上的說明框
export function note(x, y, s, o = {}) {
  const { size = 13, color = C.ink, fill = 'rgba(255,253,248,.95)', stroke = C.ink, pad = 7, w } = o;
  const lines = String(s).split('\n');
  const ww = w || Math.max(...lines.map(l => [...l].reduce((a, c) => a + (c.charCodeAt(0) > 255 ? 1 : .56), 0))) * size + pad * 2;
  const hh = lines.length * size * 1.3 + pad * 1.6;
  return R(x, y, ww, hh, { fill, stroke, sw: 1, r: 5 }) + T(x + ww / 2, y + hh / 2, s, { size, fill: color });
}
