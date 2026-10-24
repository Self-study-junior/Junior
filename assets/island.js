// 學習島：粉彩低多邊形風格的六角島群，每座島是一個科目
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LANDMARKS } from './island-landmarks.js';

const $ = id => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem('junior.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('junior.' + k, JSON.stringify(v)); } catch (e) {} },
};
const SUBJ = window.SUBJECTS || [];
const SUM = window.SUMMARY || {};
const touch = matchMedia('(pointer: coarse)').matches;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function hasGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
if (!hasGL()) {
  const n = $('nogl'); n.hidden = false; $('loading').hidden = true;
  n.innerHTML = '<h2>這台裝置無法顯示 3D 畫面</h2>' + SUBJ.filter(s => s.ready).map(s => `<a href="../${s.id}/">${s.name}</a>`).join('') + '<p><a href="../">回一般首頁</a></p>';
  throw new Error('no webgl');
}

// ---------- 色彩 ----------
const PAL = {
  sea: '#6cc0cf', seaDeep: '#4fa6b8', sand: '#f2e0bd', sandD: '#e3c999', grass: '#b5d69a', grassD: '#94bd7a', dirt: '#c9a27a',
  wood: '#c98e5a', woodD: '#9c6a40', roof: '#e2673c', roofD: '#c4532e', white: '#fffaf2', cream: '#f7ecd8', stone: '#d8d2c8', stoneD: '#b9b1a5',
  leaf: '#7fb069', leafD: '#5f9450', leafL: '#a3c97f', trunk: '#8c6239', red: '#e05a47', yellow: '#f4c95d', blue: '#5b8fd1', pink: '#f2a7b5',
  gray: '#cfc8bf', dark: '#4a443e', glass: '#cde9f0', lava: '#ff7a3c',
};
const THEME = {
  hub: { top: '#f3e5cf', c: '#e2673c' },
  english: { top: '#cfe8ea', c: '#1a8a96' }, biology: { top: '#cfe6bb', c: '#2f8a63' }, earth: { top: '#ead7bd', c: '#9a6a3a' },
  history: { top: '#dcdcee', c: '#3d4f9a' }, civics: { top: '#f3d6d6', c: '#c7475a' },
  chinese: { top: '#e9e3da', c: '#8a817a' }, math: { top: '#e9e3da', c: '#8a817a' }, physchem: { top: '#e9e3da', c: '#8a817a' }, geography: { top: '#e9e3da', c: '#8a817a' },
};
const MC = {};
const M = (c, o = {}) => MC[c + JSON.stringify(o)] ||= new THREE.MeshStandardMaterial({ color: c, roughness: .95, metalness: 0, flatShading: true, ...o });

// ---------- 渲染器、場景 ----------
const canvas = $('sea');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 2));
renderer.shadowMap.enabled = !touch;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#bfe4ea');
scene.fog = new THREE.Fog('#bfe4ea', 230, 480);
const camera = new THREE.PerspectiveCamera(34, 1, .5, 1000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = .08;
controls.minDistance = 9; controls.maxDistance = 280; controls.maxPolarAngle = 1.22; controls.minPolarAngle = .35;
controls.screenSpacePanning = false; controls.rotateSpeed = .6; controls.zoomSpeed = .8;
scene.add(new THREE.HemisphereLight('#fff4e6', '#7fb6c2', 1.15));
const sun = new THREE.DirectionalLight('#fff1dc', 2.1);
sun.position.set(-70, 120, 60); sun.castShadow = true;
Object.assign(sun.shadow.camera, { left: -95, right: 95, top: 95, bottom: -95, near: 20, far: 340 });
sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0005; sun.shadow.normalBias = .04;
scene.add(sun);

let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const rr = (a, b) => a + rnd() * (b - a);
const shadow = o => { o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
function mesh(geo, color, x = 0, y = 0, z = 0, o) { const m = new THREE.Mesh(geo, typeof color === 'string' ? M(color, o) : color); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; }
const box = (w, h, d, c, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), c, x, y + h / 2, z);
const cyl = (rt, rb, h, c, x, y, z, seg = 10) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), c, x, y + h / 2, z);
const cone = (r, h, c, x, y, z, seg = 8) => mesh(new THREE.ConeGeometry(r, h, seg), c, x, y + h / 2, z);
const ball = (r, c, x, y, z, d = 1) => mesh(new THREE.IcosahedronGeometry(r, d), c, x, y, z);
function prism(w, h, d, c, x, y, z) { // 三角屋頂
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2);
  return mesh(g, c, x, y, z);
}

// ---------- 小物件 ----------
function tree(x, z, s = 1, kind = rnd() < .5 ? 'round' : 'pine') {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s);
  g.add(cyl(.12, .16, .7, PAL.trunk, 0, 0, 0, 6));
  if (kind === 'pine') { g.add(cone(.75, 1.2, PAL.leafD, 0, .55, 0, 7)); g.add(cone(.55, 1, PAL.leaf, 0, 1.15, 0, 7)); }
  else { g.add(ball(.62, [PAL.leaf, PAL.leafL, PAL.leafD][rnd() * 3 | 0], 0, 1.15, 0, 0)); if (rnd() < .5) g.add(ball(.4, PAL.leafL, .35, 1.45, .1, 0)); }
  g.rotation.y = rnd() * 6;
  return g;
}
function house(x, z, rot = 0, s = 1, wall = PAL.white, roof = PAL.roof) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; g.scale.setScalar(s);
  g.add(box(1.4, 1, 1.2, wall, 0, 0, 0));
  g.add(prism(1.6, .7, 1.35, roof, 0, 1, 0));
  g.add(box(.3, .5, .05, PAL.woodD, 0, 0, .61));
  g.add(box(.28, .28, .05, PAL.glass, -.42, .45, .61)); g.add(box(.28, .28, .05, PAL.glass, .42, .45, .61));
  return g;
}
function person(x, z, c = PAL.blue, s = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s);
  g.add(cyl(.14, .17, .5, c, 0, 0, 0, 8)); g.add(ball(.15, '#f3d2b3', 0, .66, 0, 1)); g.add(cyl(.16, .16, .06, PAL.dark, 0, .74, 0, 8));
  return g;
}
function bench(x, z, rot = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; g.add(box(1, .08, .32, PAL.wood, 0, .32, 0)); g.add(box(1, .3, .06, PAL.wood, 0, .4, -.14)); g.add(box(.06, .32, .3, PAL.dark, -.42, 0, 0)); g.add(box(.06, .32, .3, PAL.dark, .42, 0, 0)); return g; }
function lamp(x, z) { const g = new THREE.Group(); g.position.set(x, 0, z); g.add(cyl(.04, .05, 1.2, PAL.dark, 0, 0, 0, 6)); g.add(ball(.13, '#fff3c4', 0, 1.25, 0, 0)); return g; }
function flowers(x, z, n = 5) { const g = new THREE.Group(); for (let i = 0; i < n; i++) g.add(ball(.09, [PAL.red, PAL.yellow, PAL.pink, PAL.white][i % 4], x + rr(-.4, .4), .12, z + rr(-.4, .4), 0)); return g; }
function textTex(text, { w = 256, h = 128, bg = PAL.white, fg = PAL.dark, size = 64, weight = 900 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${weight} ${size}px "Noto Sans TC","PingFang TC",sans-serif`; g.fillText(text, w / 2, h / 2 + 4);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const animators = [];  // 每幀更新的東西

// ---------- 六角島 ----------
const R = 12, AP = R * Math.sqrt(3) / 2;   // 外接半徑、邊心距
function hexIsland(theme, small = false) {
  const g = new THREE.Group();
  const h = small ? .8 : 1.1;
  const base = mesh(new THREE.CylinderGeometry(R + .25, R + .9, 1.2, 6), PAL.sandD, 0, -.7, 0); base.rotation.y = Math.PI / 6; g.add(base);
  const sand = mesh(new THREE.CylinderGeometry(R + .1, R + .25, .45, 6), PAL.sand, 0, -.05, 0); sand.rotation.y = Math.PI / 6; g.add(sand);
  const top = mesh(new THREE.CylinderGeometry(R - .35, R - .1, h - .55, 6), theme.top, 0, .2 + (h - .55) / 2 - .05, 0); top.rotation.y = Math.PI / 6; g.add(top);
  // 邊緣的條紋（像參考風格的紅白邊）
  const edge = mesh(new THREE.CylinderGeometry(R - .32, R - .32, .12, 6, 1, true), theme.c, 0, h - .32, 0, { side: THREE.DoubleSide }); edge.rotation.y = Math.PI / 6; g.add(edge);
  g.userData.top = h - .35;
  return g;
}
// 每座島的內容
const BUILD = {
  hub(g) {
    const L = lay(g, 1.85);
    L.add(cyl(3.1, 3.1, .08, PAL.stone, 0, 0, 0, 24));
    L.add(cyl(1.1, 1.25, .35, PAL.stoneD, 0, .08, 0, 16)); L.add(cyl(.95, .95, .05, PAL.sea, 0, .42, 0, 16));
    const jet = cyl(.08, .14, .9, '#e8f7fb', 0, .4, 0, 8); L.add(jet); animators.push(t => { jet.scale.y = .85 + Math.sin(t * 4) * .15; });
    // 圖書館
    const lib = new THREE.Group(); lib.position.set(0, 0, -3.6); L.add(lib);
    lib.add(box(4.2, .3, 2.2, PAL.stone, 0, 0, 0)); lib.add(box(3.8, 2, 1.8, PAL.cream, 0, .3, 0));
    for (let i = -3; i <= 3; i++) lib.add(cyl(.11, .11, 1.8, PAL.white, i * .55, .3, 1.0, 8));
    lib.add(prism(4.4, 1, 2.4, PAL.roof, 0, 2.3, 0)); lib.add(box(4.4, .18, 2.4, PAL.roofD, 0, 2.3, 0));
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, .65), new THREE.MeshBasicMaterial({ map: textTex('國中自學筆記', { w: 512, h: 128, size: 66, bg: PAL.white, fg: PAL.roof }) }));
    sign.position.set(0, 1.85, 1.22); lib.add(sign);
    // 路牌
    const post = new THREE.Group(); post.position.set(2.4, 0, 1.8); L.add(post);
    post.add(cyl(.06, .06, 2, PAL.woodD, 0, 0, 0, 6));
    [['英語 →', 0], ['← 歷史', 1], ['生物 →', 2]].forEach(([t, i]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, .32, .06), [M(PAL.wood), M(PAL.wood), M(PAL.wood), M(PAL.wood), new THREE.MeshBasicMaterial({ map: textTex(t, { w: 256, h: 64, size: 40, bg: PAL.wood, fg: '#fff' }) }), M(PAL.wood)]); b.position.set(i % 2 ? -.35 : .35, 1.75 - i * .42, 0); b.rotation.y = (i - 1) * .5; b.castShadow = true; post.add(b); });
    for (const [x, z] of [[-4.2, 1.5], [4, -1], [-3, 3.6], [1, 4.4], [-4.4, -1.6]]) L.add(tree(x, z, 1.1, 'round'));
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .3; L.add(bench(Math.cos(a) * 2.4, Math.sin(a) * 2.4, -a + Math.PI / 2)); }
    L.add(lamp(-2.2, -1.6)); L.add(lamp(2.2, -1.6));
    // 走動的學生
    const cols = [PAL.blue, PAL.red, PAL.yellow, '#8e6ad8', PAL.leafD];
    for (let i = 0; i < 5; i++) { const p = person(0, 0, cols[i]); L.add(p); const off = i / 5 * Math.PI * 2, r = 1.9 + (i % 2) * .5, sp = (i % 2 ? 1 : -1) * (.25 + i * .03);
      animators.push(t => { const a = off + t * sp; p.position.set(Math.cos(a) * r, Math.abs(Math.sin(t * 6 + i)) * .05, Math.sin(a) * r); p.rotation.y = -a + (sp > 0 ? 0 : Math.PI); }); }
  },
  // ---- 整理中的島：施工中＋代表物 ----
  soon(g, id) {
    const L = lay(g);
    // 吊車
    const cr = new THREE.Group(); cr.position.set(-2.4, 0, -1.6); L.add(cr);
    cr.add(box(.4, 4, .4, PAL.yellow, 0, 0, 0)); const arm = new THREE.Group(); arm.position.y = 4; cr.add(arm);
    arm.add(box(3.6, .25, .25, PAL.yellow, 1.2, 0, 0)); arm.add(box(.8, .4, .4, PAL.dark, -.6, -.1, 0));
    const hook = cyl(.02, .02, 1.4, PAL.dark, 2.6, -1.4, 0, 4); arm.add(hook); arm.add(box(.6, .3, .4, PAL.roof, 2.6, -1.7, 0));
    animators.push(t => { arm.rotation.y = Math.sin(t * .4 + id.length) * .6; });
    // 圍欄與三角錐
    for (let i = -2; i <= 2; i++) L.add(box(.7, .35, .06, i % 2 ? PAL.roof : PAL.white, i * .75, 0, 2.8));
    for (const [x, z] of [[2.8, 2.4], [3.4, 1.6], [-3.2, 2.2]]) { L.add(cone(.2, .5, PAL.roof, x, 0, z, 8)); L.add(box(.36, .06, .36, PAL.roof, x, 0, z)); }
    // 代表物
    const p = new THREE.Group(); p.position.set(1.4, 0, -.6); L.add(p);
    if (id === 'math') { p.add(box(.9, .9, .9, PAL.blue, -.6, 0, 0)); p.add(cone(.6, 1.1, PAL.yellow, .5, 0, .3, 4)); p.add(ball(.42, PAL.red, .2, .42, -.8, 1)); }
    if (id === 'chinese') { p.add(box(1.6, .1, 1.6, PAL.stone, 0, 0, 0)); for (const [x, z] of [[-.6, -.6], [.6, -.6], [-.6, .6]]) p.add(cyl(.06, .06, 1.2, PAL.red, x, .1, z, 6)); p.add(rot(cyl(0, 1.3, .6, PAL.dark, 0, 1.3, 0, 4), 'y', Math.PI / 4)); }
    if (id === 'physchem') { p.add(ball(.55, '#9fd8e6', 0, .55, 0, 1)); p.add(cyl(.16, .16, .7, '#9fd8e6', 0, .95, 0, 8)); p.add(box(.9, .2, .25, PAL.red, 1, 0, .2)); }
    if (id === 'geography') { const gl = ball(.65, '#6cb0d9', 0, 1.2, 0, 1); p.add(gl); p.add(cyl(.05, .3, .5, PAL.woodD, 0, 0, 0, 8)); p.add(ball(.3, PAL.leaf, .25, 1.45, .45, 0)); animators.push(t => { gl.rotation.y = t * .6; }); }
    L.add(box(1.2, .6, .8, PAL.wood, 2.6, 0, -2.4)); L.add(box(1, .5, .7, PAL.woodD, 2.6, .6, -2.4));
    for (const [x, z] of [[-3.8, .8], [3.6, -.6]]) L.add(tree(x, z, .8));
  },
};
const rot = (m, axis, v) => { m.rotation[axis] = v; return m; };
function lay(g, sc = 1.75) { const L = new THREE.Group(); L.position.y = g.userData.top; L.scale.setScalar(sc); g.add(L); return L; }

// ---------- 科目島：每個單元／類別一個地標 ----------
const tint = (c, f) => '#' + new THREE.Color(c).lerp(new THREE.Color('#ffffff'), f).getHexString();
function numSprite(text, color) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 58, 0, Math.PI * 2); g.fill();
  g.lineWidth = 8; g.strokeStyle = color; g.stroke();
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${text.length > 2 ? 44 : 60}px "Noto Sans TC",sans-serif`; g.fillText(text, 64, 68);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: true })); s.scale.set(.9, .9, 1); return s;
}
function slotsFor(defs) {
  const big = defs.filter(d => !d.small), small = defs.filter(d => d.small), out = [];
  const ring = (list, r, off) => list.forEach((d, i) => { const a = off + i / list.length * Math.PI * 2; out.push([d, Math.sin(a) * r, -Math.cos(a) * r]); });
  if (small.length) { ring(big, 4.7, 0); ring(small, 9, Math.PI / small.length); return out; }
  const n = defs.length;
  if (n <= 6) ring(defs, 6.4, 0);
  else if (n <= 10) { ring(defs.slice(0, 3), 4.1, 0); ring(defs.slice(3), 8.3, Math.PI / (n - 3)); }
  else { ring(defs.slice(0, 5), 4.5, 0); ring(defs.slice(5), 8.5, Math.PI / (n - 5)); }
  return out;
}
// 讀過的單元會在物件旁插一面小旗子
const VISITED = new Set(Object.entries(store.get('visited', {})).flatMap(([id, l]) => l.map(k => id + '|' + k)));
const seen = lm => VISITED.has(lm.it.id + '|' + lm.key);
function addStamp(lm) {
  const pr = lm.pr;
  const f = new THREE.Group(); f.position.set(-pr * .75, .3, pr * .55); lm.group.add(f);
  f.add(cyl(.03, .03, 1.3, PAL.dark, 0, 0, 0, 5));
  const flag = box(.55, .34, .03, PAL.yellow, .28, 1.0, 0); f.add(flag); f.add(ball(.06, PAL.yellow, 0, 1.33, 0, 0));
  animators.push(t => { flag.rotation.y = Math.sin(t * 3 + lm.group.position.x) * .25; });
}
const kit = { THREE, PAL, M, mesh, box, cyl, cone, ball, prism, house, person, textTex, A: f => animators.push(f) };
function buildSubject(g, id, theme, it) {
  const L = lay(g, 1);
  const defs = LANDMARKS[id] || [];
  // 中央小廣場＋科目名稱碑
  L.add(cyl(1.7, 1.8, .12, PAL.stone, 0, 0, 0, 18));
  // 直書的科目名稱（每一面都只寫一次）
  const vtex = (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 320; const x = c.getContext('2d'); x.fillStyle = tint(theme.c, .15); x.fillRect(0, 0, 128, 320);
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 74px "Noto Sans TC",sans-serif'; [...it.s.name].forEach((ch, i, a) => x.fillText(ch, 64, 160 + (i - (a.length - 1) / 2) * 86));
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return new THREE.MeshStandardMaterial({ map: t, roughness: .9 }); })();
  const ob = new THREE.Mesh(new THREE.BoxGeometry(.9, 2.2, .9), [0, 1, 2, 3, 4, 5].map(i => i === 2 || i === 3 ? M(theme.c) : vtex));
  ob.position.y = 1.2; ob.castShadow = true; L.add(ob); L.add(cone(.62, .6, theme.c, 0, 2.3, 0, 4)).children.at(-1).rotation.y = Math.PI / 4;
  // 環狀步道
  const ringGeo = new THREE.RingGeometry(6.35, 7.05, 48); ringGeo.rotateX(-Math.PI / 2);
  const walk = new THREE.Mesh(ringGeo, M(PAL.stone)); walk.position.y = .02; walk.receiveShadow = true; L.add(walk);
  it.landmarks = [];
  for (const [d, x, z] of slotsFor(defs)) {
    const w = new THREE.Group(); w.position.set(x, 0, z); w.rotation.y = Math.atan2(x, z); L.add(w);
    const few = defs.length <= 6, pr = d.small ? 1.05 : few ? 2.1 : 1.55;
    const plinth = cyl(pr, pr + .1, .3, tint(theme.c, .55), 0, 0, 0, 16); w.add(plinth);
    const inner = new THREE.Group(); inner.position.y = .3; if (few) inner.scale.setScalar(1.4); w.add(inner);
    d.build({ ...kit, g: inner });
    const sp = numSprite(d.n ? String(d.n) : d.key === 'chrono' ? '年' : '★', theme.c); sp.position.set(0, .55, pr + .15); w.add(sp);
    const key = d.key || 'u' + d.n;
    const lm = { def: d, it, group: w, plinth, sprite: sp, key, pr };
    if (VISITED.has(id + '|' + key)) addStamp(lm);
    w.traverse(m => { m.userData.lm = lm; });
    it.landmarks.push(lm);
  }
  // 空地種樹與花
  const taken = slotsFor(defs).map(([d, x, z]) => [x, z, d.small ? 1.9 : defs.length <= 6 ? 3.1 : 2.5]);
  for (let i = 0, made = 0; i < 260 && made < 26; i++) {
    const x = rr(-10, 10), z = rr(-10, 10);
    if (Math.abs(x) * .5 + Math.abs(z) * .866 > AP - 1.3 || Math.abs(x) > AP - 1.3) continue;
    if (Math.hypot(x, z) < 2.6 || (Math.hypot(x, z) > 6.1 && Math.hypot(x, z) < 7.3)) continue;
    if (taken.some(([a, b, r]) => Math.hypot(x - a, z - b) < r)) continue;
    taken.push([x, z, 1.1]); made++;
    L.add(made % 4 === 0 ? flowers(x, z, 6) : tree(x, z, rr(.75, 1.05)));
  }
}

// ---------- 配置：中央島＋兩圈 ----------
const D = 2 * AP + 3.2;
const RING1 = [['english', 0], ['chinese', 60], ['biology', 120], ['earth', 180], ['history', 240], ['civics', 300]];
const RING2 = [['math', 90], ['physchem', 150], ['geography', 270]];
const islands = [];   // { id, s, group, pos, ready, num }
function place(id, ang, dist) {
  const a = ang * Math.PI / 180, pos = new THREE.Vector3(Math.sin(a) * dist, 0, -Math.cos(a) * dist);
  const s = id === 'hub' ? { id: 'hub', name: '學習中心', en: 'Study Center', ready: true } : SUBJ.find(x => x.id === id);
  if (!s) return;
  const theme = THEME[id] || THEME.chinese, small = !s.ready && id !== 'hub';
  const g = hexIsland(theme, small); g.position.copy(pos);
  const it = { id, s, group: g, pos, ready: s.ready, theme, bob: rnd() * 6, landmarks: [] };
  if (LANDMARKS[id] && s.ready) buildSubject(g, id, theme, it); else (BUILD[id] || BUILD.soon)(g, id);
  shadow(g); scene.add(g);
  g.traverse(m => { m.userData.island = it; });
  islands.push(it);
}
place('hub', 0, 0);
RING1.forEach(([id, a]) => place(id, a, D));
RING2.forEach(([id, a]) => place(id, a, D * Math.sqrt(3)));
// 編號：依首頁順序
let n = 0; for (const s of SUBJ) { const it = islands.find(i => i.id === s.id); if (it) it.num = String(++n).padStart(2, '0'); }

// 橋
const BRIDGES = [];
function bridge(a, b) {
  BRIDGES.push([a.clone(), b.clone()]);
  const d = new THREE.Vector3().subVectors(b, a), len = d.length() - 2 * AP + .8, mid = a.clone().add(b).multiplyScalar(.5);
  const g = new THREE.Group(); g.position.copy(mid); g.rotation.y = Math.atan2(d.x, d.z); g.scale.set(1.5, 1, 1);
  const top = .45;
  g.add(box(1.4, .14, len, PAL.wood, 0, top, 0));
  for (let z = -len / 2 + .2; z < len / 2; z += .45) g.add(box(1.5, .05, .12, PAL.woodD, 0, top + .14, z));
  for (const x of [-.75, .75]) { g.add(box(.06, .06, len, PAL.white, x, top + .65, 0)); for (let z = -len / 2; z <= len / 2 + .01; z += len / 3) g.add(box(.08, .65, .08, PAL.white, x, top + .05, z)); }
  for (const z of [-len / 4, len / 4]) for (const x of [-.6, .6]) g.add(cyl(.08, .08, 1.2, PAL.woodD, x, -.8, z, 6));
  shadow(g); scene.add(g);
}
const P = id => islands.find(i => i.id === id)?.pos;
RING1.forEach(([id]) => bridge(P('hub'), P(id)));
for (let i = 0; i < RING1.length; i++) bridge(P(RING1[i][0]), P(RING1[(i + 1) % RING1.length][0]));
bridge(P('math'), P('chinese')); bridge(P('math'), P('biology'));
bridge(P('physchem'), P('biology')); bridge(P('physchem'), P('earth'));
bridge(P('geography'), P('history')); bridge(P('geography'), P('civics'));

// ---------- 海、遠景、裝飾 ----------
const seaGeo = new THREE.PlaneGeometry(900, 900, 110, 110); seaGeo.rotateX(-Math.PI / 2);
const seaBase = seaGeo.attributes.position.array.slice();
const sea = new THREE.Mesh(seaGeo, new THREE.MeshStandardMaterial({ color: PAL.sea, roughness: .55, metalness: .05, flatShading: true }));
sea.position.y = -.35; sea.receiveShadow = true; scene.add(sea);
animators.push(t => {
  const a = seaGeo.attributes.position.array;
  for (let i = 0; i < a.length; i += 3) a[i + 1] = Math.sin(seaBase[i] * .12 + t * 1.1) * .12 + Math.cos(seaBase[i + 2] * .1 + t * .8) * .12;
  seaGeo.attributes.position.needsUpdate = true; seaGeo.computeVertexNormals();
});
// 遠山
for (let i = 0; i < 26; i++) {
  const a = -Math.PI * .95 + i / 25 * Math.PI * .9 - .1, r = rr(260, 320);
  const h = rr(30, 70), m = cone(rr(34, 56), h, [PAL.grassD, '#a8c98c', '#9fbf86'][i % 3], Math.cos(a) * r, -1, Math.sin(a) * r, 7);
  m.castShadow = false; scene.add(m);
}
// 小島
function islet(x, z, kind) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  const r = rr(1.6, 2.6);
  g.add(cyl(r, r + .4, .6, PAL.sand, 0, -.45, 0, 10));
  if (kind === 'tree') { g.add(cyl(r - .4, r - .2, .2, PAL.grass, 0, .1, 0, 10)); for (let i = 0; i < 3; i++) g.add(tree(rr(-.8, .8), rr(-.8, .8), rr(.8, 1.1))); }
  if (kind === 'rock') for (let i = 0; i < 3; i++) g.add(mesh(new THREE.DodecahedronGeometry(rr(.4, .8), 0), PAL.stoneD, rr(-.7, .7), .3, rr(-.7, .7)));
  if (kind === 'light') { g.add(cyl(.45, .6, 2.4, PAL.white, 0, .1, 0, 10)); for (let y = .6; y < 2.4; y += .7) g.add(cyl(.5, .5, .3, PAL.red, 0, y, 0, 10)); g.add(cyl(.35, .35, .4, '#fff3c4', 0, 2.5, 0, 8)); g.add(cone(.45, .5, PAL.red, 0, 2.9, 0, 10)); }
  if (kind === 'umbrella') { for (const [ux, c] of [[-.6, PAL.red], [.7, PAL.yellow]]) { g.add(cyl(.03, .03, 1.2, PAL.dark, ux, 0, 0, 4)); g.add(cone(.7, .35, c, ux, 1.1, 0, 8)); } g.add(box(.5, .05, .9, PAL.blue, 0, .15, .6)); }
  shadow(g); scene.add(g); return g;
}
[[-62, -12, 'tree'], [64, -24, 'tree'], [54, 46, 'umbrella'], [-54, 40, 'rock'], [70, 14, 'light'], [-70, -42, 'tree'], [10, 70, 'tree'], [-22, -74, 'rock'], [40, -66, 'tree'], [-40, 66, 'light']].forEach(a => islet(...a));
// 帆船與浮標
for (let i = 0; i < 6; i++) {
  const g = new THREE.Group(); const r = rr(62, 90), a = rr(0, Math.PI * 2);
  g.add(box(1.4, .3, .5, [PAL.white, PAL.red, PAL.blue][i % 3], 0, -.1, 0)); g.add(cyl(.03, .03, 1.4, PAL.dark, 0, .2, 0, 4)); g.add(prism(.8, 1.1, .03, PAL.white, .1, .3, 0));
  shadow(g); scene.add(g);
  animators.push(t => { const k = a + t * .02 * (i % 2 ? 1 : -1); g.position.set(Math.cos(k) * r, Math.sin(t * 1.5 + i) * .08, Math.sin(k) * r); g.rotation.y = -k + (i % 2 ? 0 : Math.PI); g.rotation.z = Math.sin(t * 1.2 + i) * .06; });
}
for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + .2, r = 56; const b = new THREE.Group(); b.add(cyl(.2, .28, .6, i % 2 ? PAL.red : PAL.white, 0, -.3, 0, 8)); b.add(cyl(.03, .03, .7, PAL.dark, 0, .3, 0, 4)); b.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); scene.add(b); animators.push(t => { b.position.y = Math.sin(t * 2 + i) * .1; b.rotation.z = Math.sin(t * 1.3 + i) * .1; }); }
// 雲
for (let i = 0; i < 10; i++) {
  const g = new THREE.Group(); for (let k = 0; k < 4; k++) g.add(ball(rr(1.8, 3.2), PAL.white, k * 2.2 - 3, rr(-.3, .6), rr(-1, 1), 1));
  g.traverse(m => { if (m.isMesh) { m.material = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, transparent: true, opacity: .85 }); m.castShadow = false; m.receiveShadow = false; } });
  const y = rr(80, 95), r0 = rr(-220, 220), z = rr(-230, -80);
  g.position.set(r0, y, z); scene.add(g);
  animators.push((t, dt) => { g.position.x += dt * 1.2; if (g.position.x > 230) g.position.x = -230; });
}
// 海鳥
for (let i = 0; i < 5; i++) {
  const g = new THREE.Group(); const w1 = box(.7, .03, .2, PAL.white, -.35, 0, 0), w2 = box(.7, .03, .2, PAL.white, .35, 0, 0); g.add(w1, w2); scene.add(g);
  const r = rr(24, 54), h = rr(16, 26), sp = rr(.08, .16), off = rr(0, 6);
  animators.push(t => { const a = off + t * sp; g.position.set(Math.cos(a) * r, h + Math.sin(t + i) * .6, Math.sin(a) * r); g.rotation.y = -a; w1.rotation.z = Math.sin(t * 6 + i) * .5; w2.rotation.z = -w1.rotation.z; });
}

// ---------- 標籤 ----------
const labels = $('labels'), tmp = new THREE.Vector3();
for (const it of islands) {
  const b = document.createElement('button');
  b.className = 'lb' + (it.id === 'hub' ? ' hub' : it.ready ? '' : ' soon');
  b.style.setProperty('--c', it.theme.c);
  b.innerHTML = it.id === 'hub' ? '★ 學習中心' : `<i>${it.num}</i>${esc(it.s.name)}`;
  b.onclick = e => { e.stopPropagation(); focus(it); };
  labels.appendChild(b); it.label = b;
}
function updateLabels() {
  const w = innerWidth, h = innerHeight;
  for (const it of islands) {
    tmp.copy(it.pos); tmp.y = it.id === 'hub' ? 9 : it.ready ? 8 : 9; tmp.project(camera);
    const vis = tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1;
    it.label.style.display = vis ? '' : 'none';
    if (vis) it.label.style.transform = `translate(${(tmp.x * .5 + .5) * w}px,${(-tmp.y * .5 + .5) * h}px) translate(-50%,-100%)`;
  }
}

// ---------- 清單 ----------
const ready = SUBJ.filter(s => s.ready);
$('listSub').textContent = `${ready.length} 座已開放的島 ／ ${SUBJ.length - ready.length} 座整理中。選一座島，走進它的重點筆記。`;
$('listBody').innerHTML = SUBJ.map(s => {
  const it = islands.find(i => i.id === s.id); if (!it) return '';
  const x = SUM[s.id] || {};
  const meta = !s.ready ? '整理中' : s.id === 'english' ? `${x.vocab} 單字` : `${x.units} 單元`;
  return `<button class="li${s.ready ? '' : ' soon'}" data-id="${s.id}" style="--c:${it.theme.c}"><span class="n">${it.num}</span><span><b>${esc(s.name)}島</b><small>${esc(s.en)}</small></span><span class="t">${meta} ›</span></button>`;
}).join('');
$('listBody').onclick = e => { const b = e.target.closest('.li'); if (b) { focus(islands.find(i => i.id === b.dataset.id)); if (innerWidth < 760) $('list').classList.add('closed'); } };
const toggleList = open => $('list').classList.toggle('closed', open === undefined ? undefined : !open);
$('bList').onclick = () => toggleList(); $('listX').onclick = () => toggleList(false);
if (innerWidth < 760) toggleList(false);

// ---------- 島的資訊卡、地標卡 ----------
const info = $('info');
const ENG = SUM.english || {};
function lmInfo(lm) {   // 地標的標題、說明、重點、連結
  const d = lm.def, id = lm.it.id;
  if (id === 'english') {
    if (d.key === 'vocab') return { k: 'VOCABULARY', t: d.title, s: `共 ${ENG.vocab || ''} 個單字片語，依主題分成 ${(ENG.topics || []).length} 組。`, h: (ENG.topics || []).slice(0, 16).map(([t, c]) => `${t} ${c}`), href: d.href };
    if (d.key === 'poly') return { k: 'POLYSEMY', t: d.title, s: `會考常考的一字多義，共 ${ENG.polysemy || ''} 個字，附例句與中譯。`, h: [], href: d.href };
    if (d.gram) { const g = (ENG.gram || []).find(x => x[0] === d.n); return { k: 'GRAMMAR ' + d.n, t: d.title, s: `${g ? g[1].length : ''} 則重點，含例句。`, h: g ? g[1] : [], href: d.href }; }
    const area = d.key.split('-')[1], st = (ENG.strat || []).find(x => x[0] === area);
    return { k: 'STRATEGY', t: d.title, s: `${st ? st[1].length : ''} 則${area}方法與解題步驟。`, h: st ? st[1] : [], href: d.href };
  }
  if (d.key === 'chrono') return { k: 'TIMELINE', t: d.title, s: d.desc, h: [], href: d.href };
  const u = (SUM[id]?.list || []).find(x => x.n === d.n) || {};
  return { k: `${lm.it.s.name} · 單元 ${d.n}`, t: `${d.n}．${u.t || d.short}`, s: u.s || '', h: u.h || [], href: `../${id}/#u${d.n}`, part: u.p };
}
function showLandmark(lm) {
  const x = lmInfo(lm);
  info.style.setProperty('--c', lm.it.theme.c); info.hidden = false;
  info.innerHTML = `<button class="x" aria-label="關閉">✕</button><div class="k">${esc(x.k)}${x.part ? ' · ' + esc(x.part) : ''}</div><h3 class="lmt">${esc(x.t)}</h3>
    <div class="en">島上的「${esc(lm.def.short)}」${seen(lm) ? '　<span class="done">✓ 已讀過</span>' : '　<span class="new">還沒讀過，去看看！</span>'}</div>
    ${x.s ? `<p>${esc(x.s)}</p>` : ''}
    ${x.h.length ? `<div class="chips">${x.h.map(h => `<span>${esc(h)}</span>`).join('')}</div>` : ''}
    <a class="go" href="${x.href}">閱讀這個${lm.it.id === 'english' ? '主題' : lm.def.key === 'chrono' ? '年表' : '單元'} →</a>
    <button class="back" type="button">← 回到${esc(lm.it.s.name)}島</button>`;
  info.querySelector('.x').onclick = () => { info.hidden = true; selectLm(null); };
  info.querySelector('.back').onclick = () => focus(lm.it);
}
function showInfo(it) {
  const s = it.s, c = it.theme.c;
  info.style.setProperty('--c', c); info.hidden = false;
  if (it.id === 'hub') {
    info.innerHTML = `<button class="x" aria-label="關閉">✕</button><div class="k">STUDY CENTER</div><h3>學習中心</h3><div class="en">國中自學筆記</div>
      <p>這裡是群島的中心。從廣場走過木橋，就能到每一科的島。已開放 ${ready.length} 座島，國文、數學、理化、地理還在整理中。</p>
      ${(() => { const all = islands.flatMap(i => i.landmarks), v = all.filter(seen).length; return `<div class="prog"><div class="bar"><i style="width:${all.length ? v / all.length * 100 : 0}%"></i></div><span>整座群島已探索 <b>${v}</b> / ${all.length}</span></div>`; })()}
      <a class="go" href="../">打開一般版首頁（含全站搜尋） →</a>`;
  } else if (!s.ready) {
    info.innerHTML = `<button class="x" aria-label="關閉">✕</button><div class="k">${it.num} · UNDER CONSTRUCTION</div><h3>${esc(s.name)}島</h3><div class="en">${esc(s.en)}</div>
      <p>這座島還在施工中，筆記整理好之後就會開放。先去其他島逛逛吧！</p>`;
  } else {
    const x = SUM[s.id] || {};
    const stats = s.id === 'english' ? [[x.vocab, '單字片語'], [x.polysemy, '一字多義'], [x.grammar, '文法重點']] : [[x.units, '單元'], [x.sections, '重點'], [x.terms, '關鍵名詞']];
    info.innerHTML = `<button class="x" aria-label="關閉">✕</button><div class="k">${it.num} · ${esc(s.en.toUpperCase())}</div><h3>${esc(s.name)}島</h3>
      <p>${esc(s.desc || '')}</p>
      <div class="stats">${stats.map(([v, t]) => `<div><b>${(v || 0).toLocaleString()}</b><span>${t}</span></div>`).join('')}</div>
      ${(() => { const n = it.landmarks.length, v = it.landmarks.filter(seen).length; return `<div class="prog"><div class="bar"><i style="width:${n ? v / n * 100 : 0}%"></i></div><span>已探索 <b>${v}</b> / ${n}${v === n && n ? '　🏆 全部探索完成！' : ''}</span></div>`; })()}
      <div class="hint2">島上每個物件代表一個${s.id === 'english' ? '類別' : '單元'}，讀過的會插上 🚩 黃色小旗。點物件或下面的名稱就能前往。</div>
      <div class="units">${it.landmarks.map((lm, i) => { const y = lmInfo(lm); return `<button type="button" data-i="${i}"><i>${lm.def.n && !lm.def.gram ? lm.def.n : lm.def.key === 'chrono' ? '年' : lm.def.gram ? 'G' + lm.def.n : '★'}</i><span>${esc(y.t.replace(/^\d+．/, ''))}<small>${esc(lm.def.short)}</small></span>${seen(lm) ? '<em>✓</em>' : ''}</button>`; }).join('')}</div>
      <a class="go" href="../${s.id}/">走進${esc(s.name)}筆記 →</a>`;
    info.querySelectorAll('.units button').forEach(b => {
      const lm = it.landmarks[+b.dataset.i];
      b.onclick = () => focusLm(lm);
      b.onmouseenter = () => { hoverLm = lm; }; b.onmouseleave = () => { if (hoverLm === lm) hoverLm = null; };
    });
  }
  info.querySelector('.x').onclick = () => { info.hidden = true; select(null); };
}

// ---------- 鏡頭動畫 ----------
let fly = null, cur = null, hover = null, curLm = null, hoverLm = null;
const HOME = innerWidth < 760 ? { pos: new THREE.Vector3(10, 190, 205), target: new THREE.Vector3(0, 0, 12) } : { pos: new THREE.Vector3(24, 118, 140), target: new THREE.Vector3(16, 0, 6) };
function flyTo(target, pos, dur = 1.2) { fly = { t: 0, dur, p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: target }; }
const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
function select(it) { cur = it; for (const i of islands) i.label.classList.toggle('on', i === it); if (!it) selectLm(null); }
function selectLm(lm) { curLm = lm; }
// 讓焦點落在沒有被卡片擋住的畫面中央
function framed(target, camPos) {
  const w = innerWidth, h = innerHeight, d = camPos.distanceTo(target), wpp = 2 * d * Math.tan(camera.fov * Math.PI / 360) / h;
  const fwd = new THREE.Vector3().subVectors(target, camPos).setY(0).normalize(), right = new THREE.Vector3(-fwd.z, 0, fwd.x);
  let off = new THREE.Vector3();
  if (w >= 760) {
    const listOpen = !$('list').classList.contains('closed'), left = 400, rightEdge = listOpen ? w - 340 : w;
    off.addScaledVector(right, -((left + rightEdge) / 2 - w / 2) * wpp);
  } else {
    off.addScaledVector(fwd, -(h * .23) * wpp * 1.5);
  }
  return [target.clone().add(off), camPos.clone().add(off)];
}
function viewDir() { const d = new THREE.Vector3().subVectors(camera.position, controls.target).setY(0); return d.lengthSq() < .1 ? d.set(0, 0, 1) : d.normalize(); }
function focus(it) {
  if (!it) return;
  select(it); selectLm(null);
  const mob = innerWidth < 760;
  flyTo(...framed(it.pos.clone().setY(1.5), it.pos.clone().add(viewDir().multiplyScalar(mob ? 62 : 46)).setY(mob ? 58 : 40)));
  showInfo(it);
  store.set('island.last', it.id);
}
function focusLm(lm) {
  select(lm.it); selectLm(lm);
  const wp = new THREE.Vector3(); lm.group.getWorldPosition(wp);
  const out = wp.clone().sub(lm.it.pos).setY(0); if (out.lengthSq() < .1) out.copy(viewDir()); out.normalize();
  const mob = innerWidth < 760;
  flyTo(...framed(wp.clone().setY(wp.y + 1.4), wp.clone().add(out.multiplyScalar(mob ? 17 : 13)).setY(wp.y + (mob ? 12 : 8.5))));
  showLandmark(lm);
}
$('bHome').onclick = () => { select(null); info.hidden = true; flyTo(HOME.target.clone(), HOME.pos.clone()); };

// ---------- 點擊／滑過 ----------
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const pickables = islands.map(i => i.group);
const tip = document.createElement('div'); tip.id = 'tip'; tip.hidden = true; document.body.appendChild(tip);
function pick(e) {
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const h = ray.intersectObjects(pickables, true)[0]; if (!h) return null;
  return { it: h.object.userData.island, lm: h.object.userData.lm };
}
let down = null;
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', e => {
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) { const p = pick(e); if (walk.on) { if (p?.lm) walkTo(p.lm); } else if (p?.lm) focusLm(p.lm); else if (p?.it) focus(p.it); }
  down = null;
});
canvas.addEventListener('pointermove', e => {
  if (touch || e.buttons || walk.on) { tip.hidden = true; return; }
  const p = pick(e); const it = p?.it || null, lm = p?.lm || null;
  hover = it; hoverLm = lm; canvas.style.cursor = it ? 'pointer' : '';
  if (lm) { const x = lmInfo(lm); tip.innerHTML = `<b style="color:${lm.it.theme.c}">${esc(lm.it.s.name)}</b>　${esc(x.t)}`; tip.style.transform = `translate(${e.clientX + 14}px,${e.clientY + 14}px)`; tip.hidden = false; }
  else tip.hidden = true;
});
canvas.addEventListener('pointerleave', () => { tip.hidden = true; hoverLm = null; hover = null; });
controls.addEventListener('start', () => { fly = null; });

// ---------- 導覽 ----------
const TOUR = [
  ['每座島是一個科目', '9 座六角形的島，拼成一座學習群島。點一座島，或用右側清單，鏡頭就會飛過去。'],
  ['用木橋把知識連起來', '中央是學習中心，橋把每座島連在一起。拖曳可以轉動視角，滾輪或兩指可以縮放。'],
  ['化身島民去探險', '按上方「🧍 化身島民」建立自己的角色，用左下角的圓點搖桿在島上走路。走到物件旁邊，就能選擇進入那個單元。'],
  ['島上的物件都有意義', '每個物件代表一個單元（英語是一個類別）：例如生物島的 DNA 是「遺傳」、歷史島的火車是「日本帝國時期」。點物件看單元重點，再按按鈕走進筆記。灰色的島還在整理中。'],
];
let tk = 0;
function tour(i) { tk = i; const [h, p] = TOUR[i]; $('tK').textContent = `HELLO, STUDENT / 0${i + 1}`; $('tH').textContent = h; $('tP').textContent = p; $('tNext').textContent = i < TOUR.length - 1 ? '下一步 →' : '開始探索'; $('tour').hidden = false; }
$('tNext').onclick = () => { if (tk < TOUR.length - 1) tour(tk + 1); else { $('tour').hidden = true; store.set('island.tour', 1); } };
$('tSkip').onclick = () => { $('tour').hidden = true; store.set('island.tour', 1); };
$('bTour').onclick = () => tour(0);


// ================= 島民模式：化身成島民，用搖桿在島上走 =================
const LOOKS = {
  skin: ['#f6d2b5', '#e9b48a', '#c98d62', '#8d5a3b'],
  hair: ['#2b1d12', '#6b4325', '#c08a3e', '#e8e0d0', '#d0533f', '#4a6fd1'],
  shirt: ['#e2673c', '#1a8a96', '#2f8a63', '#f4c95d', '#8e6ad8', '#3d4f9a', '#fffaf2'],
  pants: ['#3d4f9a', '#4a443e', '#8c6239', '#2f6d3a', '#c7475a'],
  hat: ['none', '#f4c95d', '#e2673c', '#1a8a96', '#fffaf2'],
};
let look = store.get('islander', null);
const walk = { on: false, pos: new THREE.Vector3(0, 0, 8), yaw: Math.PI, vy: 0, camYaw: 0, camPitch: .5, camDist: 13, target: null, stuck: 0, near: null, t: 0 };
let villager = null;

function makeVillager(L) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const S = c => M(c);
  const leg = x => { const p = new THREE.Group(); p.position.set(x, .62, 0); p.add(box(.2, .62, .22, L.pants, 0, -.62, 0)); p.add(box(.22, .1, .3, PAL.dark, 0, -.68, .04)); return p; };
  const legL = leg(-.13), legR = leg(.13); body.add(legL, legR);
  body.add(cyl(.3, .34, .62, L.shirt, 0, .58, 0, 10));
  const arm = x => { const p = new THREE.Group(); p.position.set(x, 1.12, 0); p.add(cyl(.08, .08, .5, L.shirt, 0, -.5, 0, 6)); p.add(ball(.09, L.skin, 0, -.55, 0, 0)); return p; };
  const armL = arm(-.38), armR = arm(.38); body.add(armL, armR);
  const head = new THREE.Group(); head.position.y = 1.5; body.add(head);
  head.add(ball(.33, L.skin, 0, 0, 0, 1));
  const hair = mesh(new THREE.SphereGeometry(.35, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.1), L.hair, 0, .02, -.02); hair.rotation.x = -.25; head.add(hair);
  for (const x of [-.11, .11]) head.add(ball(.045, PAL.dark, x, .02, .3, 0));
  head.add(ball(.05, '#f2a7b5', -.2, -.08, .25, 0)); head.add(ball(.05, '#f2a7b5', .2, -.08, .25, 0));
  if (L.hat !== 'none') { head.add(cyl(.5, .5, .05, L.hat, 0, .2, 0, 14)); head.add(cyl(.28, .32, .26, L.hat, 0, .22, 0, 12)); }
  shadow(g);
  g.userData = { body, legL, legR, armL, armR, head };
  if (L.name) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 72; const x = c.getContext('2d');
    x.font = '900 36px "Noto Sans TC",sans-serif'; const w = Math.min(250, x.measureText(L.name).width + 30);
    x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.roundRect((256 - w) / 2, 10, w, 52, 26); x.fill();
    x.fillStyle = PAL.dark; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(L.name, 128, 37);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false })); sp.scale.set(2.2, .62, 1); sp.position.y = 2.45; sp.renderOrder = 5; g.add(sp);
  }
  // 腳下的光圈
  const ring = new THREE.Mesh(new THREE.RingGeometry(.45, .6, 24), new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: .7 })); ring.rotation.x = -Math.PI / 2; ring.position.y = .03; g.add(ring);
  return g;
}

// ---------- 地形：哪裡能走、地面多高 ----------
const HEXN = [0, 1, 2].map(k => { const a = k * Math.PI / 3; return [Math.sin(a), -Math.cos(a)]; });
const inHex = (x, z, c, m) => HEXN.every(([nx, nz]) => Math.abs((x - c.x) * nx + (z - c.z) * nz) <= AP - m);
const obstacles = [];  // { x, z, r } 或 { box:[x0,z0,x1,z1] }
for (const it of islands) {
  for (const lm of it.landmarks) { const p = new THREE.Vector3(); lm.group.getWorldPosition(p); obstacles.push({ x: p.x, z: p.z, r: lm.pr * .92, lm }); lm.wp = p; }
  if (it.landmarks.length) obstacles.push({ x: it.pos.x, z: it.pos.z, r: .85 });
}
const HUB = islands.find(i => i.id === 'hub');
if (HUB) { obstacles.push({ x: 0, z: 0, r: 2.45 }); obstacles.push({ box: [-3.9, -8.75, 3.9, -4.6] }); }
function groundAt(x, z) {   // 回傳地面高度；不能走回傳 null
  for (const it of islands) if (inHex(x, z, it.pos, .7)) return it.group.position.y + it.group.userData.top;
  for (const [a, b] of BRIDGES) {
    const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz), t = ((x - a.x) * dx + (z - a.z) * dz) / L;
    if (t < 0 || t > L) continue;
    if (Math.abs((x - a.x) * dz - (z - a.z) * dx) / L <= .95) return .66;
  }
  return null;
}
function blocked(x, z) {
  for (const o of obstacles) {
    if (o.box) { if (x > o.box[0] && x < o.box[2] && z > o.box[1] && z < o.box[3]) return true; }
    else if ((x - o.x) ** 2 + (z - o.z) ** 2 < (o.r + .35) ** 2) return true;
  }
  return groundAt(x, z) === null;
}
const islandAt = (x, z) => islands.find(it => inHex(x, z, it.pos, 0));

// ---------- 介面 ----------
const joy = $('joy'), knob = joy.querySelector('i'), nearEl = $('near');
const stick = { x: 0, y: 0, id: null };
function moveStick(e) {
  const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let dx = (e.clientX - cx) / (r.width / 2), dy = (e.clientY - cy) / (r.height / 2); const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
  stick.x = dx; stick.y = dy; knob.style.transform = `translate(${dx * 40}px,${dy * 40}px)`;
}
joy.addEventListener('pointerdown', e => { stick.id = e.pointerId; joy.setPointerCapture(e.pointerId); joy.classList.add('on'); walk.target = null; moveStick(e); e.preventDefault(); });
joy.addEventListener('pointermove', e => { if (stick.id === e.pointerId) moveStick(e); });
const stickEnd = () => { stick.id = null; stick.x = stick.y = 0; knob.style.transform = ''; joy.classList.remove('on'); };
joy.addEventListener('pointerup', stickEnd); joy.addEventListener('pointercancel', stickEnd);
const keys = new Set();
addEventListener('keydown', e => {
  if (!walk.on || e.target.tagName === 'INPUT') return;
  keys.add(e.code);
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'Enter' && walk.near?.href) location.href = walk.near.href;
  if (e.code === 'Space' && walk.vy === 0 && villager && villager.position.y - walk.ground < .01) walk.vy = 6;
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => keys.clear());

// 拖曳畫面轉視角
let camDrag = null;
canvas.addEventListener('pointerdown', e => { if (walk.on) camDrag = { id: e.pointerId, x: e.clientX, y: e.clientY }; });
addEventListener('pointermove', e => {
  if (!walk.on || !camDrag || camDrag.id !== e.pointerId) return;
  walk.camYaw -= (e.clientX - camDrag.x) * .006; walk.camPitch = Math.max(.18, Math.min(1.15, walk.camPitch + (e.clientY - camDrag.y) * .004));
  camDrag.x = e.clientX; camDrag.y = e.clientY;
});
addEventListener('pointerup', e => { if (camDrag && camDrag.id === e.pointerId) camDrag = null; });
canvas.addEventListener('wheel', e => { if (walk.on) { walk.camDist = Math.max(6, Math.min(26, walk.camDist + e.deltaY * .012)); e.preventDefault(); } }, { passive: false });

// 靠近時的提示卡
function nearInfo() {
  const p = walk.pos; let best = null, bd = 1e9;
  for (const o of obstacles) if (o.lm) { const d = Math.hypot(p.x - o.x, p.z - o.z) - o.r; if (d < 1.9 && d < bd) { bd = d; best = { lm: o.lm }; } }
  if (best) return best;
  const it = islandAt(p.x, p.z);
  if (!it) return null;
  if (it.id === 'hub') return Math.hypot(p.x, p.z + 6.7) < 7 ? { hub: true } : null;
  if (!it.ready) return Math.hypot(p.x - it.pos.x, p.z - it.pos.z) < 8 ? { soon: it } : null;
  if (Math.hypot(p.x - it.pos.x, p.z - it.pos.z) < 3.2) return { it };
  return null;
}
function renderNear(n) {
  const key = n ? (n.lm ? 'l' + n.lm.it.id + n.lm.key : n.it ? 'i' + n.it.id : n.soon ? 's' + n.soon.id : 'h') : '';
  if (key === renderNear.k) return; renderNear.k = key;
  walk.near = null;
  if (!n) { nearEl.hidden = true; return; }
  let c, html;
  if (n.lm) {
    const x = lmInfo(n.lm); c = n.lm.it.theme.c; walk.near = { href: x.href };
    html = `<div class="k">${esc(n.lm.it.s.name)}島 · 島上的「${esc(n.lm.def.short)}」</div><b>${esc(x.t)}</b>
      <small>${seen(n.lm) ? '<span class="done">✓ 已讀過</span>' : '還沒讀過，進去看看吧！'}</small>
      <div class="acts"><a href="${x.href}">進入${n.lm.it.id === 'english' ? '主題' : n.lm.def.key === 'chrono' ? '年表' : '單元'} →</a><button type="button" data-a="peek">看重點</button></div>`;
  } else if (n.it) {
    const s = n.it.s, v = n.it.landmarks.filter(seen).length; c = n.it.theme.c; walk.near = { href: `../${s.id}/` };
    html = `<div class="k">${esc(s.en.toUpperCase())}</div><b>${esc(s.name)}島的科目碑</b><small>已探索 ${v} / ${n.it.landmarks.length} 個${s.id === 'english' ? '類別' : '單元'}</small>
      <div class="acts"><a href="../${s.id}/">走進${esc(s.name)}筆記 →</a><button type="button" data-a="list">單元列表</button></div>`;
  } else if (n.soon) {
    c = n.soon.theme.c; html = `<div class="k">UNDER CONSTRUCTION</div><b>${esc(n.soon.s.name)}島施工中</b><small>筆記整理好之後就會開放，先去其他島逛逛吧！</small>`;
  } else {
    c = PAL.roof; walk.near = { href: '../' };
    html = `<div class="k">STUDY CENTER</div><b>學習中心圖書館</b><small>這裡可以打開一般版首頁，搜尋全部筆記。</small><div class="acts"><a href="../">打開一般版首頁 →</a></div>`;
  }
  nearEl.style.setProperty('--c', c); nearEl.innerHTML = html; nearEl.hidden = false;
  const peek = nearEl.querySelector('[data-a="peek"]'); if (peek) peek.onclick = () => { showLandmark(n.lm); info.querySelector('.back').onclick = () => { info.hidden = true; }; };
  const lst = nearEl.querySelector('[data-a="list"]'); if (lst) lst.onclick = () => { showInfo(n.it); info.querySelectorAll('.units button').forEach(b => { const lm = n.it.landmarks[+b.dataset.i]; b.onclick = () => walkTo(lm); }); };
}
function walkTo(lm) { walk.target = lm; walk.stuck = 0; info.hidden = true; }

// ---------- 進入、離開 ----------
function spawnAt(lm) {
  if (lm) {   // 找物件旁邊一個能站、而且最靠近這個物件的位置，面向物件
    const base = Math.atan2(lm.it.pos.x - lm.wp.x, lm.it.pos.z - lm.wp.z); let pick = null;
    for (let i = 0; i < 16 && !pick; i++) {
      const a = base + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * Math.PI / 8, r = lm.pr + 1.3;
      const x = lm.wp.x + Math.sin(a) * r, z = lm.wp.z + Math.cos(a) * r;
      if (blocked(x, z)) continue;
      const nearest = obstacles.filter(o => o.lm).reduce((m, o) => { const d = Math.hypot(x - o.x, z - o.z) - o.r; return d < m.d ? { d, o } : m; }, { d: 1e9 });
      if (nearest.o?.lm === lm) pick = [x, z, a];
    }
    if (!pick) { const a = base; pick = [lm.wp.x + Math.sin(a) * (lm.pr + 1.3), lm.wp.z + Math.cos(a) * (lm.pr + 1.3), a]; }
    walk.pos.set(pick[0], 0, pick[1]); walk.yaw = pick[2] + Math.PI;
  }
  else { walk.pos.set(0, 0, 9); walk.yaw = Math.PI; }
  walk.pos.y = groundAt(walk.pos.x, walk.pos.z) ?? 1; walk.camYaw = walk.yaw + Math.PI;
}
function startWalk(lm) {
  if (!look) { openMaker(() => startWalk(lm)); return; }
  if (villager) scene.remove(villager);
  villager = makeVillager(look); scene.add(villager);
  if (!walk.on || lm) spawnAt(lm);
  walk.on = true; store.set('island.mode', 'walk');
  document.body.classList.add('walking'); controls.enabled = false; fly = null;
  select(null); info.hidden = true; tip.hidden = true;
  $('walkHud').hidden = false; joy.hidden = false; $('wHelp').hidden = touch; renderNear.k = null;
}
function stopWalk() {
  walk.on = false; store.set('island.mode', 'view');
  if (villager) { scene.remove(villager); villager = null; }
  document.body.classList.remove('walking'); controls.enabled = true;
  $('walkHud').hidden = true; joy.hidden = true; $('wHelp').hidden = true; nearEl.hidden = true; info.hidden = true;
  const p = walk.pos.clone(); flyTo(p.clone().setY(1), p.clone().add(new THREE.Vector3(0, 60, 60)));
}
$('bWalk').onclick = () => startWalk(null);
$('wExit').onclick = stopWalk;
$('wSkin').onclick = () => openMaker(() => startWalk());

// ---------- 建立角色 ----------
const draft = {};
function avatarSVG(L) {
  return `<ellipse cx="60" cy="150" rx="26" ry="5" fill="#00000022"/>
    <rect x="46" y="112" width="11" height="34" rx="4" fill="${L.pants}"/><rect x="63" y="112" width="11" height="34" rx="4" fill="${L.pants}"/>
    <path d="M40 116 L44 78 Q60 70 76 78 L80 116 Z" fill="${L.shirt}"/>
    <rect x="31" y="80" width="9" height="30" rx="4.5" fill="${L.shirt}" transform="rotate(10 35 80)"/><rect x="80" y="80" width="9" height="30" rx="4.5" fill="${L.shirt}" transform="rotate(-10 85 80)"/>
    <circle cx="60" cy="52" r="22" fill="${L.skin}"/>
    <path d="M37 52 Q36 26 60 27 Q84 26 83 52 Q78 38 60 38 Q42 38 37 52Z" fill="${L.hair}"/>
    <circle cx="52" cy="54" r="2.6" fill="#4a443e"/><circle cx="68" cy="54" r="2.6" fill="#4a443e"/>
    <circle cx="46" cy="61" r="3" fill="#f2a7b5"/><circle cx="74" cy="61" r="3" fill="#f2a7b5"/>
    ${L.hat !== 'none' ? `<ellipse cx="60" cy="33" rx="31" ry="5" fill="${L.hat}"/><path d="M45 33 Q46 16 60 16 Q74 16 75 33Z" fill="${L.hat}"/>` : ''}`;
}
function paintMaker() {
  $('mkPrev').innerHTML = avatarSVG(draft);
  document.querySelectorAll('#maker .row').forEach(r => r.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === draft[r.dataset.k])));
}
let makerDone = null;
function openMaker(done) {
  makerDone = done;
  Object.assign(draft, look || { name: '', skin: LOOKS.skin[0], hair: LOOKS.hair[0], shirt: LOOKS.shirt[0], pants: LOOKS.pants[0], hat: 'none' });
  document.querySelectorAll('#maker .row').forEach(r => {
    const k = r.dataset.k; r.querySelectorAll('button').forEach(b => b.remove());
    for (const v of LOOKS[k]) { const b = document.createElement('button'); b.type = 'button'; b.dataset.v = v; b.title = v === 'none' ? '不戴帽子' : v; b.style.background = v === 'none' ? '#fff' : v; if (v === 'none') b.textContent = '✕'; b.onclick = () => { draft[k] = v; paintMaker(); }; r.appendChild(b); }
  });
  $('mkName').value = draft.name || ''; paintMaker(); $('maker').hidden = false; setTimeout(() => $('mkName').focus(), 50);
}
$('mkRand').onclick = () => { for (const k of Object.keys(LOOKS)) draft[k] = LOOKS[k][rnd() * LOOKS[k].length | 0]; paintMaker(); };
$('mkGo').onclick = () => { draft.name = $('mkName').value.trim().slice(0, 8) || '島民'; look = { ...draft }; store.set('islander', look); $('maker').hidden = true; makerDone && makerDone(); };

// ---------- 每幀：移動、動畫、鏡頭 ----------
const camGoal = new THREE.Vector3(), lookGoal = new THREE.Vector3();
function walkUpdate(dt, t) {
  if (!walk.on || !villager) return false;
  let fx = stick.x, fz = -stick.y;
  if (keys.has('KeyW') || keys.has('ArrowUp')) fz += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) fz -= 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) fx -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) fx += 1;
  let mx = 0, mz = 0, amt = Math.min(1, Math.hypot(fx, fz));
  if (amt > .08) {
    walk.target = null;
    const a = walk.camYaw + Math.PI + Math.atan2(-fx, fz);   // 前方＝背對鏡頭
    mx = Math.sin(a); mz = Math.cos(a);
  } else if (walk.target) {
    const lm = walk.target, d = Math.hypot(lm.wp.x - walk.pos.x, lm.wp.z - walk.pos.z) - lm.pr;
    if (d < 1.4) walk.target = null; else { mx = (lm.wp.x - walk.pos.x); mz = (lm.wp.z - walk.pos.z); const l = Math.hypot(mx, mz); mx /= l; mz /= l; amt = 1; }
  }
  const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 8 : 5) * amt * dt;
  const moving = speed > 0;
  if (moving) {
    const nx = walk.pos.x + mx * speed, nz = walk.pos.z + mz * speed;
    let moved = false;
    if (!blocked(nx, nz)) { walk.pos.x = nx; walk.pos.z = nz; moved = true; }
    else if (!blocked(nx, walk.pos.z)) { walk.pos.x = nx; moved = true; }
    else if (!blocked(walk.pos.x, nz)) { walk.pos.z = nz; moved = true; }
    if (!moved && walk.target && (walk.stuck += dt) > .8) walk.target = null;
    let dy = Math.atan2(mx, mz) - walk.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); walk.yaw += dy * Math.min(1, dt * 12);
    walk.t += speed * 2.2;
  } else walk.t *= .85;
  walk.ground = groundAt(walk.pos.x, walk.pos.z) ?? walk.ground ?? .7;
  walk.vy -= 20 * dt; villager.position.y = Math.max(walk.ground, villager.position.y + walk.vy * dt);
  if (villager.position.y <= walk.ground) walk.vy = 0;
  villager.position.x = walk.pos.x; villager.position.z = walk.pos.z; villager.rotation.y = walk.yaw;
  const u = villager.userData, sw = Math.sin(walk.t) * (moving ? .75 : 0);
  u.legL.rotation.x = sw; u.legR.rotation.x = -sw; u.armL.rotation.x = -sw * .9; u.armR.rotation.x = sw * .9;
  u.body.position.y = moving ? Math.abs(Math.sin(walk.t)) * .06 : Math.sin(t * 2) * .015;
  // 鏡頭跟在後方
  const p = villager.position;
  lookGoal.set(p.x, p.y + 1.4, p.z);
  camGoal.set(p.x + Math.sin(walk.camYaw) * Math.cos(walk.camPitch) * walk.camDist, p.y + 1.4 + Math.sin(walk.camPitch) * walk.camDist, p.z + Math.cos(walk.camYaw) * Math.cos(walk.camPitch) * walk.camDist);
  camera.position.lerp(camGoal, Math.min(1, dt * 6)); controls.target.lerp(lookGoal, Math.min(1, dt * 8)); camera.lookAt(controls.target);
  // 自動走路時鏡頭慢慢轉到角色背後
  if (walk.target) { let d = (walk.yaw + Math.PI) - walk.camYaw; d = Math.atan2(Math.sin(d), Math.cos(d)); walk.camYaw += d * Math.min(1, dt * 1.5); }
  // 靠近的物件
  const n = nearInfo(); renderNear(n); hoverLm = n?.lm || null;
  return true;
}

// ---------- 主迴圈 ----------
function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.fov = innerWidth < 760 ? 44 : 34; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
camera.position.set(50, 240, 270); controls.target.copy(HOME.target);
flyTo(HOME.target.clone(), HOME.pos.clone(), 2.2);
const clock = new THREE.Clock();
function loop() {
  const dt = Math.min(.05, clock.getDelta()), t = clock.elapsedTime;
  for (const a of animators) a(t, dt);
  for (const it of islands) { const up = it === cur ? .3 : it === hover ? .2 : 0; it.group.position.y += (up + Math.sin(t * .8 + it.bob) * .06 - it.group.position.y) * Math.min(1, dt * 6);
    for (const lm of it.landmarks) { const on = lm === hoverLm || lm === curLm; const s = lm.group.scale.x + ((on ? 1.12 : 1) - lm.group.scale.x) * Math.min(1, dt * 10); lm.group.scale.setScalar(s); lm.group.position.y = (on ? .25 : 0) * (s - 1) / .12; } }
  if (fly) {
    fly.t += dt / fly.dur; const k = ease(Math.min(1, fly.t));
    camera.position.lerpVectors(fly.p0, fly.p1, k); controls.target.lerpVectors(fly.t0, fly.t1, k);
    if (fly.t >= 1) fly = null;
  }
  if (!walkUpdate(dt, t)) {
    // 平移限制在群島附近
    controls.target.x = Math.max(-75, Math.min(75, controls.target.x)); controls.target.z = Math.max(-75, Math.min(75, controls.target.z)); controls.target.y = Math.max(0, Math.min(4, controls.target.y));
    controls.update();
  }
  renderer.render(scene, camera);
  updateLabels();
  requestAnimationFrame(loop);
}
loop();
// 從筆記頁回來：#history 飛到歷史島、#history/u4 飛到第 4 單元的物件
function fromHash() {
  const [id, key] = decodeURIComponent(location.hash.slice(1)).split('/');
  const it = islands.find(i => i.id === id); if (!it) return false;
  const lm = key && it.landmarks.find(l => l.key === key);
  if (innerWidth < 760) toggleList(false);
  if (store.get('island.mode', 'view') === 'walk' && look) { startWalk(lm || it.landmarks[0] || null); if (!lm && !it.landmarks.length) { walk.pos.set(it.pos.x, 0, it.pos.z + 5); } return true; }
  lm ? focusLm(lm) : focus(it); return true;
}
addEventListener('hashchange', fromHash);
setTimeout(() => {
  $('loading').classList.add('done');
  if (location.hash.length > 1) { fly = null; setTimeout(fromHash, 200); return; }
  if (store.get('island.mode', 'view') === 'walk' && look) { setTimeout(() => startWalk(null), 200); return; }
  if (!store.get('island.tour', 0)) setTimeout(() => tour(0), 900);
}, 300);
