// 學習島：粉彩低多邊形風格的六角島群，每座島是一個科目
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
scene.fog = new THREE.Fog('#bfe4ea', 120, 260);
const camera = new THREE.PerspectiveCamera(34, 1, .5, 600);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = .08;
controls.minDistance = 16; controls.maxDistance = 150; controls.maxPolarAngle = 1.22; controls.minPolarAngle = .35;
controls.screenSpacePanning = false; controls.rotateSpeed = .6; controls.zoomSpeed = .8;
scene.add(new THREE.HemisphereLight('#fff4e6', '#7fb6c2', 1.15));
const sun = new THREE.DirectionalLight('#fff1dc', 2.1);
sun.position.set(-40, 70, 35); sun.castShadow = true;
Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, near: 10, far: 200 });
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0005; sun.shadow.normalBias = .04;
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
function person(x, z, c = PAL.blue) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
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
const R = 6.4, AP = R * Math.sqrt(3) / 2;   // 外接半徑、邊心距
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
    const y = g.userData.top; const L = new THREE.Group(); L.position.y = y; g.add(L);
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
  english(g) {
    const L = lay(g);
    // 鐘塔
    const tw = new THREE.Group(); tw.position.set(-1.6, 0, -1.8); L.add(tw);
    tw.add(box(1.4, 4.2, 1.4, PAL.cream, 0, 0, 0)); tw.add(box(1.6, .3, 1.6, PAL.stoneD, 0, 4.2, 0)); tw.add(box(1.2, 1, 1.2, PAL.cream, 0, 4.5, 0));
    tw.add(rot(cone(.95, 1.6, '#3f7f86', 0, 5.5, 0, 4), 'y', Math.PI / 4));
    const face = mesh(new THREE.CircleGeometry(.48, 20), PAL.white, 0, 3.4, .71); tw.add(face);
    const hand = box(.06, .38, .02, PAL.dark, 0, 3.4, .73); tw.add(hand); const hand2 = box(.05, .28, .02, PAL.dark, 0, 3.4, .73); tw.add(hand2);
    hand.geometry.translate(0, -.0, 0);
    animators.push(t => { hand.rotation.z = -t * .8; hand2.rotation.z = -t * .07; });
    // 字母方塊
    [['A', PAL.red, 1.4, .4], ['B', PAL.yellow, 2.4, .1], ['C', PAL.blue, 1.9, 1.2], ['D', '#8e6ad8', 2.0, .6]].forEach(([ch, c, x, z], i) => {
      const t = textTex(ch, { w: 128, h: 128, size: 92, bg: c, fg: '#fff' });
      const m = new THREE.Mesh(new THREE.BoxGeometry(.8, .8, .8), new THREE.MeshStandardMaterial({ map: t, roughness: .9 }));
      m.position.set(x, i === 3 ? 1.2 : .4, z); m.rotation.y = rr(-.5, .5); m.castShadow = m.receiveShadow = true; L.add(m);
    });
    // 紅色電話亭
    const ph = new THREE.Group(); ph.position.set(-3.4, 0, 1.4); L.add(ph);
    ph.add(box(.7, 1.6, .7, PAL.red, 0, 0, 0)); ph.add(box(.78, .18, .78, PAL.roofD, 0, 1.6, 0)); ph.add(box(.5, .7, .02, PAL.glass, 0, .7, .36));
    // 書本堆
    [[PAL.blue, 0], [PAL.yellow, .18], [PAL.red, .36]].forEach(([c, y], i) => L.add(rot(box(1.1 - i * .1, .18, .75, c, .3, y, 2.8), 'y', i * .2)));
    L.add(house(3.4, -2.2, -.5, .9, PAL.cream, '#3f7f86'));
    for (const [x, z] of [[-3.8, -1.2], [3.6, 2.4], [-1, 3.8], [.8, -3.6]]) L.add(tree(x, z, .95));
    L.add(flowers(-2.4, 3, 6));
  },
  biology(g) {
    const L = lay(g);
    // 溫室
    const gh = new THREE.Group(); gh.position.set(-1.4, 0, -1.6); L.add(gh);
    gh.add(box(3, .2, 2, PAL.stone, 0, 0, 0));
    gh.add(box(2.8, 1.4, 1.8, PAL.glass, 0, .2, 0, )); gh.children[1].material = new THREE.MeshStandardMaterial({ color: PAL.glass, transparent: true, opacity: .55, roughness: .2 });
    gh.add(prism(2.9, .9, 1.9, PAL.glass, 0, 1.6, 0)); gh.children[2].material = gh.children[1].material;
    for (let i = -1; i <= 1; i++) gh.add(ball(.32, PAL.leaf, i * .8, .6, 0, 0));
    // DNA 雙股螺旋
    const dna = new THREE.Group(); dna.position.set(2.2, .2, -.8); L.add(dna);
    for (let i = 0; i < 14; i++) { const a = i * .55, y = i * .25; dna.add(ball(.13, PAL.red, Math.cos(a) * .5, y, Math.sin(a) * .5, 0)); dna.add(ball(.13, PAL.blue, -Math.cos(a) * .5, y, -Math.sin(a) * .5, 0));
      if (i % 2 === 0) { const r = box(1, .05, .05, PAL.white, 0, y - .025, 0); r.rotation.y = -a; dna.add(r); } }
    dna.add(cyl(.5, .6, .2, PAL.stoneD, 0, -.2, 0, 10));
    animators.push(t => { dna.rotation.y = t * .5; });
    // 大花、蘑菇
    const fl = new THREE.Group(); fl.position.set(1.6, 0, 2.4); L.add(fl);
    fl.add(cyl(.06, .08, 1.3, PAL.leafD, 0, 0, 0, 6));
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; fl.add(ball(.28, PAL.pink, Math.cos(a) * .32, 1.4, Math.sin(a) * .32, 0)); }
    fl.add(ball(.2, PAL.yellow, 0, 1.45, 0, 0));
    for (const [x, z, s] of [[-2.8, 2.2, .5], [-2.3, 2.7, .35], [-3.2, 2.9, .4]]) { L.add(cyl(.08 * s * 2, .1 * s * 2, .5 * s * 2, PAL.white, x, 0, z, 6)); L.add(mesh(new THREE.SphereGeometry(.5 * s, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), PAL.red, x, s, z)); }
    // 蝴蝶
    const bf = new THREE.Group(); L.add(bf); const w1 = box(.25, .02, .18, PAL.yellow, -.13, 0, 0), w2 = box(.25, .02, .18, PAL.yellow, .13, 0, 0); bf.add(w1, w2);
    animators.push(t => { bf.position.set(Math.cos(t * .7) * 2.5, 2 + Math.sin(t * 2) * .3, Math.sin(t * .7) * 2.5); w1.rotation.z = Math.sin(t * 18) * .8; w2.rotation.z = -w1.rotation.z; bf.rotation.y = -t * .7; });
    for (const [x, z] of [[-3.8, -.4], [3.6, 1.2], [3.2, -2.8], [-.2, 3.8], [-4, 1.4], [.4, -3.8], [2.6, 3.4]]) L.add(tree(x, z, rr(.8, 1.1)));
    L.add(flowers(-.6, 1.6, 8));
  },
  earth(g) {
    const L = lay(g);
    // 火山
    const vol = new THREE.Group(); vol.position.set(-1.5, 0, -1.2); L.add(vol);
    vol.add(cyl(.7, 2.3, 2.6, '#a9876a', 0, 0, 0, 9)); vol.add(cyl(.55, .7, .15, PAL.lava, 0, 2.55, 0, 9));
    for (let i = 0; i < 4; i++) { const sm = ball(.35, '#eeeeee', 0, 0, 0, 0); sm.material = new THREE.MeshStandardMaterial({ color: '#f4f2ee', transparent: true, opacity: .8, flatShading: true }); vol.add(sm);
      animators.push(t => { const k = (t * .35 + i / 4) % 1; sm.position.set(Math.sin(k * 5 + i) * .3, 2.8 + k * 2.4, Math.cos(k * 4) * .3); sm.scale.setScalar(.6 + k * 1.4); sm.material.opacity = .85 * (1 - k); }); }
    // 地層
    const st = new THREE.Group(); st.position.set(2.4, 0, -1.6); L.add(st);
    ['#d9b98c', '#b98f62', '#e7d2a8', '#9a7a5a', '#cfb08a'].forEach((c, i) => st.add(box(1.8 - i * .12, .3, 1.2 - i * .06, c, 0, i * .3, 0)));
    // 天文台
    const ob = new THREE.Group(); ob.position.set(1.6, 0, 2.2); L.add(ob);
    ob.add(cyl(.9, .9, 1.1, PAL.white, 0, 0, 0, 14)); ob.add(mesh(new THREE.SphereGeometry(.9, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), '#cfd7e3', 0, 1.1, 0));
    const scope = cyl(.12, .16, 1.1, PAL.dark, .3, 1.5, 0, 8); scope.rotation.z = -.8; ob.add(scope);
    // 風車
    for (const [x, z] of [[-3.6, 1.6], [-2.4, 3.2]]) { const wm = new THREE.Group(); wm.position.set(x, 0, z); L.add(wm); wm.add(cyl(.06, .1, 2.6, PAL.white, 0, 0, 0, 6));
      const hub = new THREE.Group(); hub.position.set(0, 2.6, .12); wm.add(hub); for (let i = 0; i < 3; i++) { const b = box(.1, 1.1, .04, PAL.white, 0, 0, 0); b.geometry.translate(0, .0, 0); b.position.y = 0; const p = new THREE.Group(); p.rotation.z = i * 2.094; b.position.y = .55; p.add(b); hub.add(p); }
      animators.push(t => { hub.rotation.z = t * 2.2; }); }
    // 岩石
    for (const [x, z, s] of [[3.6, .4, .5], [3.2, 1, .3], [-.4, 3.6, .4]]) L.add(mesh(new THREE.DodecahedronGeometry(s, 0), PAL.stoneD, x, s * .6, z));
    for (const [x, z] of [[3.8, -3], [-3.8, -2.6], [.2, -3.8]]) L.add(tree(x, z, .9, 'pine'));
  },
  history(g) {
    const L = lay(g);
    // 塔（東方）
    const pg = new THREE.Group(); pg.position.set(-1.8, 0, -1.4); L.add(pg);
    pg.add(box(1.8, .3, 1.8, PAL.stone, 0, 0, 0));
    for (let i = 0; i < 4; i++) { const y = .3 + i * 1, w = 1.3 - i * .18; pg.add(box(w, .75, w, PAL.cream, 0, y, 0)); pg.add(rot(cyl((w + .7) * .72, (w + .9) * .72, .25, '#3d4f9a', 0, y + .75, 0, 4), 'y', Math.PI / 4)); }
    pg.add(cone(.12, .8, PAL.yellow, 0, 4.3, 0, 6));
    // 城堡塔（西方）
    const cs = new THREE.Group(); cs.position.set(2.4, 0, -1.4); L.add(cs);
    cs.add(cyl(.8, .85, 2.4, PAL.stone, 0, 0, 0, 10));
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; cs.add(box(.22, .3, .22, PAL.stone, Math.cos(a) * .72, 2.4, Math.sin(a) * .72)); }
    cs.add(cone(.75, 1.3, PAL.red, 0, 2.7, 0, 10)); cs.add(box(.36, .6, .05, PAL.woodD, 0, 0, .84));
    const flag = box(.5, .3, .02, PAL.yellow, .25, 4.2, 0); cs.add(cyl(.02, .02, .8, PAL.dark, 0, 3.8, 0, 4)); cs.add(flag);
    animators.push(t => { flag.rotation.y = Math.sin(t * 3) * .3; });
    // 希臘柱遺跡
    const ru = new THREE.Group(); ru.position.set(1.2, 0, 2.4); L.add(ru);
    ru.add(box(2.4, .2, 1.2, PAL.white, 0, 0, 0)); [[-.9, 1.4], [-.3, 1.4], [.3, .9], [.9, 1.4]].forEach(([x, h]) => ru.add(cyl(.14, .16, h, PAL.white, x, .2, 0, 10)));
    ru.add(box(1.4, .18, .5, PAL.white, -.6, 1.6, 0));
    // 帆船
    const sh = new THREE.Group(); sh.position.set(-3.2, 0, 2.4); sh.rotation.y = .6; L.add(sh);
    sh.add(box(1.8, .4, .6, PAL.woodD, 0, 0, 0)); sh.add(cyl(.04, .04, 1.6, PAL.wood, 0, .4, 0, 4)); sh.add(prism(.9, 1.2, .04, PAL.white, .1, .6, 0));
    // 卷軸
    L.add(rot(cyl(.12, .12, .9, PAL.cream, -.6, .12, 3.6, 10), 'z', Math.PI / 2));
    for (const [x, z] of [[-3.8, -.4], [3.8, 1.2], [.2, -3.8], [3.4, 3]]) L.add(tree(x, z, .9));
  },
  civics(g) {
    const L = lay(g);
    // 市政廳
    const ch = new THREE.Group(); ch.position.set(0, 0, -1.8); L.add(ch);
    ch.add(box(4, .3, 2.2, PAL.stone, 0, 0, 0)); ch.add(box(3.6, 1.8, 1.8, PAL.white, 0, .3, 0));
    for (let i = -3; i <= 3; i++) ch.add(cyl(.1, .1, 1.8, PAL.cream, i * .52, .3, 1.0, 8));
    ch.add(prism(3.9, .7, 2.2, PAL.cream, 0, 2.1, 0));
    ch.add(cyl(.7, .7, .6, PAL.white, 0, 2.6, -.2, 12)); ch.add(mesh(new THREE.SphereGeometry(.7, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), '#c7475a', 0, 3.2, -.2));
    // 旗杆
    L.add(cyl(.04, .05, 3.2, PAL.dark, -2.6, 0, 1, 6)); const fl = box(.8, .5, .02, PAL.red, -2.2, 2.75, 1); L.add(fl);
    animators.push(t => { fl.scale.x = .92 + Math.sin(t * 4) * .08; });
    // 投票箱
    const bb = new THREE.Group(); bb.position.set(1.8, 0, 1.6); L.add(bb);
    bb.add(box(.9, .8, .7, PAL.white, 0, 0, 0)); bb.add(box(.5, .04, .1, PAL.dark, 0, .8, 0));
    const paper = box(.36, .02, .5, PAL.yellow, 0, 1.1, 0); bb.add(paper);
    animators.push(t => { const k = (t * .5) % 1; paper.position.y = 1.5 - k * .7; paper.rotation.y = k * 3; paper.visible = k < .9; });
    // 天平
    const sc = new THREE.Group(); sc.position.set(-1, 0, 2.2); L.add(sc);
    sc.add(cyl(.3, .4, .15, PAL.yellow, 0, 0, 0, 8)); sc.add(cyl(.04, .04, 1.4, PAL.yellow, 0, .15, 0, 6));
    const beam = new THREE.Group(); beam.position.y = 1.55; sc.add(beam); beam.add(box(1.4, .05, .05, PAL.yellow, 0, -.025, 0));
    for (const x of [-.65, .65]) { beam.add(cyl(.01, .01, .4, PAL.dark, x, -.4, 0, 4)); beam.add(cyl(.25, .2, .05, PAL.yellow, x, -.45, 0, 10)); }
    animators.push(t => { beam.rotation.z = Math.sin(t * 1.2) * .12; });
    for (const [x, z] of [[-3.8, -1], [3.8, -.4], [3.4, 2.8], [-3.4, 2.8], [.6, 3.8]]) L.add(tree(x, z, .9, 'round'));
    L.add(bench(.6, .5, 0)); L.add(lamp(2.4, -.2)); L.add(lamp(-2.4, -.2));
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
function lay(g) { const L = new THREE.Group(); L.position.y = g.userData.top; g.add(L); return L; }

// ---------- 配置：中央島＋兩圈 ----------
const D = 2 * AP + 2.4;
const RING1 = [['english', 0], ['chinese', 60], ['biology', 120], ['earth', 180], ['history', 240], ['civics', 300]];
const RING2 = [['math', 90], ['physchem', 150], ['geography', 270]];
const islands = [];   // { id, s, group, pos, ready, num }
function place(id, ang, dist) {
  const a = ang * Math.PI / 180, pos = new THREE.Vector3(Math.sin(a) * dist, 0, -Math.cos(a) * dist);
  const s = id === 'hub' ? { id: 'hub', name: '學習中心', en: 'Study Center', ready: true } : SUBJ.find(x => x.id === id);
  if (!s) return;
  const theme = THEME[id] || THEME.chinese, small = !s.ready && id !== 'hub';
  const g = hexIsland(theme, small); g.position.copy(pos);
  (BUILD[id] || BUILD.soon)(g, id);
  shadow(g); scene.add(g);
  const it = { id, s, group: g, pos, ready: s.ready, theme, bob: rnd() * 6 };
  g.traverse(m => { m.userData.island = it; });
  islands.push(it);
}
place('hub', 0, 0);
RING1.forEach(([id, a]) => place(id, a, D));
RING2.forEach(([id, a]) => place(id, a, D * Math.sqrt(3)));
// 編號：依首頁順序
let n = 0; for (const s of SUBJ) { const it = islands.find(i => i.id === s.id); if (it) it.num = String(++n).padStart(2, '0'); }

// 橋
function bridge(a, b) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length() - 2 * AP + .8, mid = a.clone().add(b).multiplyScalar(.5);
  const g = new THREE.Group(); g.position.copy(mid); g.rotation.y = Math.atan2(d.x, d.z);
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
const seaGeo = new THREE.PlaneGeometry(520, 520, 90, 90); seaGeo.rotateX(-Math.PI / 2);
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
  const a = -Math.PI * .95 + i / 25 * Math.PI * .9 - .1, r = rr(150, 190);
  const h = rr(18, 42), m = cone(rr(20, 34), h, [PAL.grassD, '#a8c98c', '#9fbf86'][i % 3], Math.cos(a) * r, -1, Math.sin(a) * r, 7);
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
[[-34, -8, 'tree'], [36, -14, 'tree'], [30, 26, 'umbrella'], [-30, 22, 'rock'], [40, 8, 'light'], [-40, -24, 'tree'], [6, 40, 'tree'], [-12, -42, 'rock'], [22, -38, 'tree']].forEach(a => islet(...a));
// 帆船與浮標
for (let i = 0; i < 6; i++) {
  const g = new THREE.Group(); const r = rr(34, 50), a = rr(0, Math.PI * 2);
  g.add(box(1.4, .3, .5, [PAL.white, PAL.red, PAL.blue][i % 3], 0, -.1, 0)); g.add(cyl(.03, .03, 1.4, PAL.dark, 0, .2, 0, 4)); g.add(prism(.8, 1.1, .03, PAL.white, .1, .3, 0));
  shadow(g); scene.add(g);
  animators.push(t => { const k = a + t * .02 * (i % 2 ? 1 : -1); g.position.set(Math.cos(k) * r, Math.sin(t * 1.5 + i) * .08, Math.sin(k) * r); g.rotation.y = -k + (i % 2 ? 0 : Math.PI); g.rotation.z = Math.sin(t * 1.2 + i) * .06; });
}
for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + .2, r = 31; const b = new THREE.Group(); b.add(cyl(.2, .28, .6, i % 2 ? PAL.red : PAL.white, 0, -.3, 0, 8)); b.add(cyl(.03, .03, .7, PAL.dark, 0, .3, 0, 4)); b.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); scene.add(b); animators.push(t => { b.position.y = Math.sin(t * 2 + i) * .1; b.rotation.z = Math.sin(t * 1.3 + i) * .1; }); }
// 雲
for (let i = 0; i < 10; i++) {
  const g = new THREE.Group(); for (let k = 0; k < 4; k++) g.add(ball(rr(1.8, 3.2), PAL.white, k * 2.2 - 3, rr(-.3, .6), rr(-1, 1), 1));
  g.traverse(m => { if (m.isMesh) { m.material = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, transparent: true, opacity: .85 }); m.castShadow = false; m.receiveShadow = false; } });
  const y = rr(58, 70), r0 = rr(-140, 140), z = rr(-140, -40);
  g.position.set(r0, y, z); scene.add(g);
  animators.push((t, dt) => { g.position.x += dt * 1.2; if (g.position.x > 140) g.position.x = -140; });
}
// 海鳥
for (let i = 0; i < 5; i++) {
  const g = new THREE.Group(); const w1 = box(.7, .03, .2, PAL.white, -.35, 0, 0), w2 = box(.7, .03, .2, PAL.white, .35, 0, 0); g.add(w1, w2); scene.add(g);
  const r = rr(14, 30), h = rr(10, 16), sp = rr(.12, .22), off = rr(0, 6);
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
    tmp.copy(it.pos); tmp.y = it.id === 'hub' ? 5 : it.ready ? 6.6 : 5.2; tmp.project(camera);
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

// ---------- 島的資訊卡 ----------
const info = $('info');
const loaded = {};
function loadNotes(id) {
  if (loaded[id]) return loaded[id];
  return loaded[id] = new Promise(res => { const s = document.createElement('script'); s.src = `../data/${id}.js`; s.onload = () => res((window.NOTES || {})[id]); s.onerror = () => res(null); document.head.appendChild(s); });
}
async function showInfo(it) {
  const s = it.s, c = it.theme.c;
  info.style.setProperty('--c', c); info.hidden = false;
  if (it.id === 'hub') {
    info.innerHTML = `<button class="x" aria-label="關閉">✕</button><div class="k">STUDY CENTER</div><h3>學習中心</h3><div class="en">國中自學筆記</div>
      <p>這裡是群島的中心。從廣場走過木橋，就能到每一科的島。已開放 ${ready.length} 座島，國文、數學、理化、地理還在整理中。</p>
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
      <div class="units" id="units"><span style="color:var(--muted);font-size:13px">載入單元…</span></div>
      <a class="go" href="../${s.id}/">走進${esc(s.name)}筆記 →</a>`;
    const d = await loadNotes(s.id);
    const box = $('units'); if (!box || cur !== it) return;
    if (Array.isArray(d)) box.innerHTML = d.map(u => `<a href="../${s.id}/#u${u.unit}"><i>${u.unit}</i>${esc(u.title)}</a>`).join('') + (s.id === 'history' ? `<a href="../history/#chrono"><i>年</i>大事年表（臺灣・亞洲・歐洲）</a>` : '');
    else if (d) box.innerHTML = [['vocab', 'A', '主題單字'], ['poly', 'B', '一字多義'], ['gram', 'G', '15 大文法主題'], ['strat', '★', '學習策略']].map(([h, i, t]) => `<a href="../english/#${h}"><i>${i}</i>${t}</a>`).join('');
    else box.innerHTML = '';
  }
  info.querySelector('.x').onclick = () => { info.hidden = true; select(null); };
}

// ---------- 鏡頭動畫 ----------
let fly = null, cur = null, hover = null;
const HOME = innerWidth < 760 ? { pos: new THREE.Vector3(6, 105, 112), target: new THREE.Vector3(0, 0, 8) } : { pos: new THREE.Vector3(14, 66, 80), target: new THREE.Vector3(9, 0, 3) };
function flyTo(target, pos, dur = 1.1) { fly = { t: 0, dur, p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: target }; }
const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
function select(it) { cur = it; for (const i of islands) i.label.classList.toggle('on', i === it); }
function focus(it) {
  if (!it) return;
  select(it);
  const dir = new THREE.Vector3().subVectors(camera.position, controls.target).setY(0).normalize();
  if (dir.lengthSq() < .1) dir.set(0, 0, 1);
  const t = it.pos.clone().setY(1.5);
  const offset = innerWidth < 760 ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(0, 0, 0);
  flyTo(t.add(offset), it.pos.clone().add(dir.multiplyScalar(innerWidth < 760 ? 40 : 33)).setY(innerWidth < 760 ? 34 : 26));
  showInfo(it);
  store.set('island.last', it.id);
}
$('bHome').onclick = () => { select(null); info.hidden = true; flyTo(HOME.target.clone(), HOME.pos.clone()); };

// ---------- 點擊／滑過 ----------
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const pickables = islands.map(i => i.group);
function pick(e) {
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const h = ray.intersectObjects(pickables, true)[0]; return h && h.object.userData.island;
}
let down = null;
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', e => { if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) { const it = pick(e); if (it) focus(it); } down = null; });
canvas.addEventListener('pointermove', e => { if (touch || e.buttons) return; const it = pick(e); if (it !== hover) { hover = it; canvas.style.cursor = it ? 'pointer' : ''; } });
controls.addEventListener('start', () => { fly = null; });

// ---------- 導覽 ----------
const TOUR = [
  ['每座島是一個科目', '9 座六角形的島，拼成一座學習群島。點一座島，或用右側清單，就能看到那一科的單元。'],
  ['用木橋把知識連起來', '中央是學習中心，橋把每座島連在一起。拖曳可以轉動視角，滾輪或兩指可以縮放。'],
  ['走進筆記', '在島的卡片按「走進筆記」，或直接點單元名稱，就會打開那一科的重點筆記。灰色的島還在整理中。'],
];
let tk = 0;
function tour(i) { tk = i; const [h, p] = TOUR[i]; $('tK').textContent = `HELLO, STUDENT / 0${i + 1}`; $('tH').textContent = h; $('tP').textContent = p; $('tNext').textContent = i < TOUR.length - 1 ? '下一步 →' : '開始探索'; $('tour').hidden = false; }
$('tNext').onclick = () => { if (tk < TOUR.length - 1) tour(tk + 1); else { $('tour').hidden = true; store.set('island.tour', 1); } };
$('tSkip').onclick = () => { $('tour').hidden = true; store.set('island.tour', 1); };
$('bTour').onclick = () => tour(0);

// ---------- 主迴圈 ----------
function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.fov = innerWidth < 760 ? 44 : 34; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
camera.position.set(30, 130, 150); controls.target.copy(HOME.target);
flyTo(HOME.target.clone(), HOME.pos.clone(), 2.2);
const clock = new THREE.Clock();
function loop() {
  const dt = Math.min(.05, clock.getDelta()), t = clock.elapsedTime;
  for (const a of animators) a(t, dt);
  for (const it of islands) { const up = it === hover || it === cur ? .35 : 0; it.group.position.y += (up + Math.sin(t * .8 + it.bob) * .06 - it.group.position.y) * Math.min(1, dt * 6); }
  if (fly) {
    fly.t += dt / fly.dur; const k = ease(Math.min(1, fly.t));
    camera.position.lerpVectors(fly.p0, fly.p1, k); controls.target.lerpVectors(fly.t0, fly.t1, k);
    if (fly.t >= 1) fly = null;
  }
  // 平移限制在群島附近
  controls.target.x = Math.max(-40, Math.min(40, controls.target.x)); controls.target.z = Math.max(-40, Math.min(40, controls.target.z)); controls.target.y = Math.max(0, Math.min(4, controls.target.y));
  controls.update();
  renderer.render(scene, camera);
  updateLabels();
  requestAnimationFrame(loop);
}
loop();
setTimeout(() => { $('loading').classList.add('done'); if (!store.get('island.tour', 0)) setTimeout(() => tour(0), 900); }, 300);
