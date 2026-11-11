// 學習島：粉彩低多邊形風格的六角島群，每座島是一個科目
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
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
  chinese: { top: '#f1ddd4', c: '#a8453a' }, math: { top: '#f3dbe6', c: '#a8326e' }, physchem: { top: '#e6e0f3', c: '#6a4fb0' }, geography: { top: '#f3e4cc', c: '#b8701f' },
};
const MC = {};
const M = (c, o = {}) => MC[c + JSON.stringify(o)] ||= new THREE.MeshStandardMaterial({ color: c, roughness: .95, metalness: 0, flatShading: true, ...o });

// ---------- 渲染器、場景 ----------
const canvas = $('sea');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 2));
renderer.shadowMap.enabled = !touch;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
const scene = new THREE.Scene();
scene.background = (() => {   // 天空：上藍下暖的漸層
  const c = document.createElement('canvas'); c.width = 4; c.height = 512; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, '#7cc6ea'); gr.addColorStop(.45, '#c4eaf3'); gr.addColorStop(.75, '#fdf0dc'); gr.addColorStop(1, '#fde3c8'); g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
scene.fog = new THREE.Fog('#d8f0f1', 240, 520);
const camera = new THREE.PerspectiveCamera(34, 1, .5, 1000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = .08;
controls.minDistance = 9; controls.maxDistance = 280; controls.maxPolarAngle = 1.22; controls.minPolarAngle = .35;
controls.screenSpacePanning = false; controls.rotateSpeed = .6; controls.zoomSpeed = .8;
scene.add(new THREE.HemisphereLight('#fff6ea', '#8fc7c9', 1.25));
const sun = new THREE.DirectionalLight('#ffedd2', 2.25);
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
const SMC = {};
const SM = (c, o = {}) => SMC[c + JSON.stringify(o)] ||= new THREE.MeshStandardMaterial({ color: c, roughness: .8, metalness: 0, ...o });   // 平滑材質（人物、雲）
const shade = (c, f) => '#' + new THREE.Color(c).lerp(new THREE.Color(f > 0 ? '#ffffff' : '#3a2c22'), Math.abs(f)).getHexString();
const blob = (r, c, x, y, z, sy = .82) => { const m = ball(r, c, x, y, z, 1); m.scale.y = sy; m.rotation.y = rnd() * 6; return m; };
const LEAVES = ['#7fb069', '#93c47d', '#6aa35a', '#a8cf86'];
function tree(x, z, s = 1, kind = rnd() < .5 ? 'round' : 'pine') {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); g.rotation.y = rnd() * 6;
  const lf = () => LEAVES[rnd() * LEAVES.length | 0];
  if (kind === 'pine') {
    g.add(cyl(.1, .15, .6, PAL.trunk, 0, 0, 0, 6));
    const c = rnd() < .5 ? '#5f9450' : '#4f8a5b';
    g.add(cone(.8, 1, shade(c, -.12), 0, .45, 0, 7)); g.add(cone(.62, .9, c, 0, 1.0, 0, 7)); g.add(cone(.42, .8, shade(c, .15), 0, 1.5, 0, 7));
  } else if (kind === 'cypress') {
    g.add(cyl(.08, .1, .4, PAL.trunk, 0, 0, 0, 6)); const b = ball(.42, '#4f8a5b', 0, 1.35, 0, 1); b.scale.set(1, 2.6, 1); g.add(b);
  } else if (kind === 'palm') {
    let px = 0, py = 0; for (let i = 0; i < 5; i++) { const sgm = cyl(.1 - i * .008, .12 - i * .008, .5, i % 2 ? '#a9825a' : '#96714c', px, py, 0, 6); sgm.rotation.z = -i * .07; g.add(sgm); px += .5 * Math.sin(i * .07); py += .46; }
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, p = new THREE.Group(); p.position.set(px, py + .05, 0); p.rotation.y = a; const l = box(1.15, .04, .3, i % 2 ? '#5fa35a' : '#79b866', .6, 0, 0); l.rotation.z = -.5; p.add(l); const l2 = box(.5, .04, .22, '#5fa35a', 1.18, -.42, 0); l2.rotation.z = -1.0; p.add(l2); g.add(p); }
    g.add(ball(.11, '#7a5230', px + .12, py - .08, .08, 0)); g.add(ball(.11, '#7a5230', px - .1, py - .1, -.06, 0));
  } else if (kind === 'cherry') {
    g.add(cyl(.1, .15, .8, '#7a5546', 0, 0, 0, 6)); const b1 = cyl(.05, .07, .5, '#7a5546', .2, .7, 0, 5); b1.rotation.z = -.7; g.add(b1);
    for (const [bx, by, bz, r] of [[0, 1.35, 0, .62], [.5, 1.2, .1, .42], [-.42, 1.15, -.15, .45], [.1, 1.75, -.1, .4], [-.1, 1.2, .45, .38]]) g.add(blob(r, ['#f7c1d0', '#f2a7bd', '#fbd5df'][rnd() * 3 | 0], bx, by, bz));
  } else if (kind === 'bamboo') {
    for (const [bx, bz, h] of [[0, 0, 2.3], [.22, .12, 1.9], [-.15, .2, 2.05], [.08, -.2, 1.7]]) { const st = cyl(.045, .05, h, '#8fbf6a', bx, 0, bz, 5); st.rotation.z = (bx) * .25; g.add(st); for (let k = 1; k < 4; k++) g.add(cyl(.06, .06, .03, '#6f9f52', bx, h * k / 4, bz, 5)); g.add(blob(.26, '#a3d17c', bx + .05, h, bz, .5)); g.add(blob(.2, '#8fc76a', bx - .12, h - .3, bz + .1, .5)); }
  } else if (kind === 'bush') {
    g.add(blob(.42, lf(), 0, .28, 0, .75)); g.add(blob(.32, lf(), .36, .22, .1, .75)); g.add(blob(.28, lf(), -.3, .2, .16, .75));
    if (rnd() < .5) for (let i = 0; i < 4; i++) g.add(ball(.07, [PAL.red, PAL.yellow, '#fff', PAL.pink][i], rr(-.4, .4), rr(.4, .55), rr(-.3, .3), 0));
  } else if (kind === 'topiary') {
    g.add(cyl(.07, .09, .55, PAL.trunk, 0, 0, 0, 6)); const c = '#6aa35a', k = rnd() * 3 | 0;
    if (k === 0) { const b = box(.8, .8, .8, c, 0, .5, 0); g.add(b); } else if (k === 1) g.add(cone(.55, 1.2, c, 0, .45, 0, 4)); else { g.add(ball(.5, c, 0, .95, 0, 1)); g.add(ball(.3, shade(c, .15), 0, 1.6, 0, 1)); }
  } else if (kind === 'cactus') {
    const c = '#6fae6a'; g.add(cyl(.2, .22, 1.3, c, 0, 0, 0, 8)); g.add(ball(.2, c, 0, 1.3, 0, 1));
    for (const sd of [-1, 1]) { const a = cyl(.1, .1, .4, c, sd * .32, .55 + sd * .1, 0, 6); a.rotation.z = Math.PI / 2; g.add(a); g.add(cyl(.1, .1, .45, c, sd * .5, .62 + sd * .1, 0, 6)); g.add(ball(.1, c, sd * .5, 1.07 + sd * .1, 0, 0)); }
    g.add(ball(.07, PAL.pink, 0, 1.52, 0, 0));
  } else if (kind === 'crystal') {
    const cs = ['#b9a4f0', '#8fd3e8', '#f2a7d0'];
    for (const [cx, cz, h, r, t] of [[0, 0, 1.1, .26, 0], [.3, .1, .7, .18, .35], [-.26, .14, .8, .2, -.3], [.05, -.28, .55, .15, .2]]) { const m = mesh(new THREE.OctahedronGeometry(r, 0), cs[rnd() * 3 | 0], cx, h * .5, cz); m.scale.y = h / r * .5; m.rotation.z = t; g.add(m); }
    g.add(mesh(new THREE.DodecahedronGeometry(.3, 0), PAL.stoneD, 0, .08, 0));
  } else if (kind === 'rock') {
    for (const [cx, cz, r] of [[0, 0, .45], [.45, .15, .28], [-.35, .25, .22]]) { const m = mesh(new THREE.DodecahedronGeometry(r, 0), rnd() < .5 ? '#bdb5a8' : '#a9a093', cx, r * .55, cz); m.rotation.set(rnd() * 3, rnd() * 3, 0); m.scale.y = .75; g.add(m); }
    g.add(blob(.16, '#93c47d', .2, .1, .4, .5));
  } else if (kind === 'mushroom') {
    for (const [cx, cz, sc, c] of [[0, 0, 1, '#e05a47'], [.4, .2, .6, '#f2a23c'], [-.3, .3, .5, '#e05a47']]) { g.add(cyl(.1 * sc, .13 * sc, .45 * sc, '#fff6e6', cx, 0, cz, 7)); const cap = mesh(new THREE.SphereGeometry(.38 * sc, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), c, cx, .42 * sc, cz); g.add(cap); for (let i = 0; i < 4; i++) { const a = i * 1.6 + cx; g.add(ball(.05 * sc, '#fff', cx + Math.cos(a) * .22 * sc, .42 * sc + .26 * sc, cz + Math.sin(a) * .22 * sc, 0)); } }
  } else if (kind === 'lantern') {
    g.add(cyl(.22, .26, .12, PAL.stoneD, 0, 0, 0, 6)); g.add(cyl(.09, .11, .6, PAL.stone, 0, .12, 0, 6)); g.add(box(.36, .3, .36, PAL.stone, 0, .72, 0)); g.add(box(.2, .18, .38, '#ffe9a8', 0, .78, 0)); g.add(cone(.36, .26, PAL.stoneD, 0, 1.02, 0, 4)); g.children.at(-1).rotation.y = Math.PI / 4;
  } else if (kind === 'lampost') {
    g.add(cyl(.12, .14, .1, PAL.dark, 0, 0, 0, 8)); g.add(cyl(.04, .05, 1.7, PAL.dark, 0, .1, 0, 6)); g.add(box(.5, .04, .04, PAL.dark, 0, 1.75, 0)); for (const sd of [-.25, .25]) { g.add(cyl(.09, .06, .16, PAL.dark, sd, 1.56, 0, 6)); g.add(ball(.1, '#ffe9a8', sd, 1.5, 0, 1)); }
  } else if (kind === 'hedge') {
    g.add(box(1.5, .5, .45, '#6aa35a', 0, 0, 0)); g.add(box(1.4, .08, .38, '#84bb6d', 0, .5, 0));
  } else if (kind === 'column') {
    g.add(box(.5, .12, .5, PAL.cream, 0, 0, 0)); const h = rr(.6, 1.5); g.add(cyl(.17, .19, h, PAL.white, 0, .12, 0, 10)); if (rnd() < .5) g.add(box(.46, .1, .46, PAL.cream, 0, .12 + h, 0)); const f = cyl(.17, .17, .5, PAL.white, .5, .0, .3, 10); f.rotation.z = Math.PI / 2; f.position.y = .17; g.add(f);
  } else if (kind === 'flagpole') {
    g.add(cyl(.03, .04, 1.8, PAL.white, 0, 0, 0, 5)); g.add(ball(.05, PAL.yellow, 0, 1.82, 0, 0)); const c = [PAL.red, PAL.blue, PAL.yellow, '#2f8a63'][rnd() * 4 | 0]; g.add(box(.6, .36, .03, c, .32, 1.38, 0)); g.add(box(.6, .12, .035, '#fff', .32, 1.5, 0));
  } else { // round
    g.add(cyl(.11, .16, .75, PAL.trunk, 0, 0, 0, 6));
    const c = lf(); g.add(blob(.68, c, 0, 1.25, 0)); g.add(blob(.46, shade(c, .12), .42, 1.5, .12)); g.add(blob(.42, shade(c, -.1), -.4, 1.1, -.18)); if (rnd() < .6) g.add(blob(.36, shade(c, .2), -.05, 1.8, .2));
    if (rnd() < .3) for (let i = 0; i < 5; i++) g.add(ball(.07, PAL.red, rr(-.5, .5), rr(1, 1.7), rr(.3, .6), 0));
  }
  return g;
}
function house(x, z, rot = 0, s = 1, wall = PAL.white, roof = PAL.roof) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; g.scale.setScalar(s);
  g.add(box(1.5, .1, 1.3, PAL.stone, 0, 0, 0));
  g.add(box(1.4, 1, 1.2, wall, 0, .1, 0));
  g.add(prism(1.7, .75, 1.4, roof, 0, 1.1, 0)); g.add(box(1.72, .06, 1.42, shade(roof, -.2), 0, 1.07, 0));
  g.add(box(.2, .4, .2, shade(roof, -.3), .42, 1.3, -.2));
  g.add(box(.3, .55, .05, PAL.woodD, 0, .1, .61)); g.add(ball(.03, PAL.yellow, .09, .38, .65, 0));
  for (const wx of [-.42, .42]) { g.add(box(.32, .32, .04, PAL.white, wx, .5, .61)); g.add(box(.26, .26, .05, PAL.glass, wx, .53, .61)); g.add(box(.36, .08, .12, roof, wx, .42, .66)); }
  return g;
}
const HAIRS = ['#2b1d12', '#6b4325', '#c08a3e', '#3a2a22', '#d0533f'];
function person(x, z, c = PAL.blue, s = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s);
  g.add(cyl(.13, .18, .42, c, 0, 0, 0, 8)); g.add(ball(.13, c, 0, .42, 0, 1));
  g.add(ball(.2, '#f6d2b5', 0, .7, 0, 1));
  const hr = mesh(new THREE.SphereGeometry(.215, 10, 6, 0, Math.PI * 2, 0, Math.PI / 1.9), HAIRS[rnd() * HAIRS.length | 0], 0, .72, -.015); hr.rotation.x = -.3; g.add(hr);
  for (const ex of [-.07, .07]) g.add(ball(.025, PAL.dark, ex, .7, .185, 0));
  return g;
}
function bench(x, z, rot = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; for (const dz of [-.1, .02, .14]) g.add(box(1.1, .05, .1, PAL.wood, 0, .32, dz)); g.add(box(1.1, .1, .05, PAL.wood, 0, .5, -.17)); g.add(box(1.1, .1, .05, PAL.wood, 0, .66, -.19)); for (const sx of [-.45, .45]) { g.add(box(.06, .32, .34, PAL.dark, sx, 0, 0)); g.add(box(.06, .45, .05, PAL.dark, sx, .32, -.18)); } return g; }
function lamp(x, z) { const g = tree(x, z, 1, 'lampost'); g.rotation.y = 0; return g; }
function flowers(x, z, n = 5) {
  const g = new THREE.Group(); const cs = [PAL.red, PAL.yellow, PAL.pink, '#fff', '#b79cf0'];
  for (let i = 0; i < n; i++) { const fx = x + rr(-.5, .5), fz = z + rr(-.5, .5), h = rr(.18, .34); g.add(cyl(.015, .015, h, '#5f9450', fx, 0, fz, 4)); g.add(ball(.085, cs[rnd() * cs.length | 0], fx, h + .04, fz, 0)); g.add(ball(.035, PAL.yellow, fx, h + .1, fz, 0)); }
  return g;
}
function tuft(x, z) { const g = new THREE.Group(); g.position.set(x, 0, z); for (let i = 0; i < 3; i++) { const c = cone(.07, rr(.22, .36), '#8fc76a', rr(-.1, .1), 0, rr(-.1, .1), 4); c.rotation.z = rr(-.3, .3); g.add(c); } return g; }
// 把一群靜態物件烘成一個網格（頂點色），大幅減少繪製次數
const VCM = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95, metalness: 0, flatShading: true });
function bake(group) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert(), geos = [], m4 = new THREE.Matrix4();
  group.traverse(m => {
    if (!m.isMesh || Array.isArray(m.material)) return;
    let ge = m.geometry.clone(); if (ge.index) ge = ge.toNonIndexed();
    ge.applyMatrix4(m4.multiplyMatrices(inv, m.matrixWorld));
    const col = m.material.color, n = ge.attributes.position.count, arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = col.r; arr[i * 3 + 1] = col.g; arr[i * 3 + 2] = col.b; }
    for (const k of Object.keys(ge.attributes)) if (k !== 'position' && k !== 'normal') ge.deleteAttribute(k);
    ge.setAttribute('color', new THREE.BufferAttribute(arr, 3)); geos.push(ge);
  });
  const out = new THREE.Mesh(mergeGeometries(geos, false), VCM);
  out.position.copy(group.position); out.quaternion.copy(group.quaternion); out.scale.copy(group.scale);
  out.castShadow = out.receiveShadow = true; return out;
}
function textTex(text, { w = 256, h = 128, bg = PAL.white, fg = PAL.dark, size = 64, weight = 900 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${weight} ${size}px "Noto Sans TC","PingFang TC",sans-serif`; g.fillText(text, w / 2, h / 2 + 4);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const animators = [];  // 每幀更新的東西
const LOOKS = {
  skin: ['#f6d2b5', '#e9b48a', '#c98d62', '#8d5a3b'],
  hair: ['#2b1d12', '#6b4325', '#c08a3e', '#e8e0d0', '#d0533f', '#4a6fd1'],
  shirt: ['#e2673c', '#1a8a96', '#2f8a63', '#f4c95d', '#8e6ad8', '#3d4f9a', '#fffaf2'],
  pants: ['#3d4f9a', '#4a443e', '#8c6239', '#2f6d3a', '#c7475a'],
  hat: ['none', '#f4c95d', '#e2673c', '#1a8a96', '#fffaf2'],
};


// ---------- 六角島 ----------
const R = 12, AP = R * Math.sqrt(3) / 2;   // 外接半徑、邊心距
const hexM = (rt, rb, h, c, y) => { const m = mesh(new THREE.CylinderGeometry(rt, rb, h, 6), c, 0, y + h / 2, 0); m.rotation.y = Math.PI / 6; return m; };
const flat = (geo, c, y) => { geo.rotateX(-Math.PI / 2); const m = mesh(geo, c, 0, y, 0); m.castShadow = false; return m; };
const inHexLocal = (x, z, m) => Math.abs(x) <= AP - m && Math.abs(x) * .5 + Math.abs(z) * .866 <= AP - m;
function hexIsland(theme0) {
  // 地面用比較飽和的主題色，島和島之間才分得出來
  const theme = { ...theme0, top: '#' + new THREE.Color(theme0.top).lerp(new THREE.Color(theme0.c), .24).getHexString() };
  const g = new THREE.Group(), base = new THREE.Group();
  base.add(hexM(R + .7, R - 2, 2.4, '#b6a58f', -3.1));            // 水下的岩盤
  base.add(hexM(R + 1.5, R + 2.9, .55, '#f7ead0', -.85));          // 淺灘
  base.add(hexM(R + .4, R + 1.5, .38, PAL.sand, -.32));            // 沙灘
  base.add(hexM(R - .1, R + .1, .5, shade(theme.top, -.22), .05)); // 土崖
  base.add(hexM(R - .28, R - .1, .2, theme.top, .55));             // 草地
  // 內緣的主題色飾線
  const trim = flat(new THREE.RingGeometry(R - 1.02, R - .84, 6, 1), theme.c, .762); base.add(trim);
  // 草地上深淺不一的色塊
  for (let i = 0; i < 16; i++) {
    const x = rr(-10, 10), z = rr(-10, 10), r = rr(.9, 2.2); if (!inHexLocal(x, z, r + 1.2)) continue;
    const p = flat(new THREE.CircleGeometry(r, 9), shade(theme.top, i % 2 ? .12 : -.07), .756 + i * .0004); p.position.x = x; p.position.z = z; p.rotation.y = rnd() * 3; base.add(p);
  }
  // 沙灘上的石頭、貝殼
  for (let k = 0; k < 6; k++) {
    const a = Math.PI / 6 + k * Math.PI / 3 + rr(-.25, .25), d = R + rr(.2, .7);
    const rk = mesh(new THREE.DodecahedronGeometry(rr(.25, .5), 0), k % 2 ? '#bdb5a8' : '#a9a093', Math.sin(a) * d, .08, Math.cos(a) * d); rk.scale.y = .7; rk.rotation.y = rnd() * 3; base.add(rk);
    const b = Math.PI / 3 * k + rr(-.3, .3), e = AP + rr(.5, .9); base.add(ball(.09, ['#f2a7b5', '#fff', '#f4c95d'][k % 3], Math.sin(b) * e, .08, Math.cos(b) * e, 0));
  }
  g.add(bake(base));
  g.userData.top = .75;
  return g;
}
// 地磚：沿著圓弧或直線鋪石板
function tilesRing(deco, r, n, c1, c2, w = .62, d = .36) { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, t = box(w, .05, d, i % 2 ? c1 : c2, Math.sin(a) * r, 0, Math.cos(a) * r); t.rotation.y = a + Math.PI / 2; t.castShadow = false; deco.add(t); } }
function tilesLine(deco, a, r0, r1, c1, c2) { let i = 0; for (let r = r0; r <= r1; r += .62, i++) { const t = box(.8 + (i % 2) * .15, .05, .42, i % 2 ? c1 : c2, Math.sin(a) * r + Math.cos(a) * (i % 2 ? .06 : -.06), 0, -Math.cos(a) * r); t.rotation.y = -a; t.castShadow = false; deco.add(t); } }
const STONE1 = '#e4ddd0', STONE2 = '#d3cabb';
const SUBJ_COLORS = ['#1a8a96', '#a8453a', '#a8326e', '#2f8a63', '#6a4fb0', '#9a6a3a', '#3d4f9a', '#b8701f', '#c7475a'];
// 每座島的內容
const BUILD = {
  hub(g) {
    const L = lay(g, 1.85), deco = new THREE.Group();
    // 廣場：放射狀地磚
    deco.add(cyl(3.5, 3.55, .06, STONE1, 0, 0, 0, 36));
    tilesRing(deco, 3.25, 40, '#f0b9a0', '#f7ead0', .5, .34); tilesRing(deco, 2.2, 26, STONE2, '#efe8dc', .5, .5);
    for (let k = 0; k < 6; k++) tilesLine(deco, k * Math.PI / 3, 3.7, 5.35, STONE1, STONE2);
    // 噴水池（三層）
    deco.add(cyl(1.25, 1.35, .34, PAL.stoneD, 0, .06, 0, 20)); deco.add(cyl(1.32, 1.32, .06, PAL.stone, 0, .38, 0, 20));
    deco.add(cyl(.22, .3, .7, PAL.stone, 0, .3, 0, 10)); deco.add(cyl(.62, .3, .16, PAL.stone, 0, 1.0, 0, 14)); deco.add(cyl(.12, .16, .45, PAL.stone, 0, 1.12, 0, 8)); deco.add(cyl(.3, .14, .1, PAL.stone, 0, 1.55, 0, 10));
    const WATER = M('#8fd6e6', { transparent: true, opacity: .85, roughness: .2 });
    L.add(cyl(1.12, 1.12, .05, WATER, 0, .37, 0, 20)); L.add(cyl(.54, .54, .04, WATER, 0, 1.14, 0, 14));
    const jets = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, j = cyl(.03, .05, .7, '#e8f7fb', Math.cos(a) * .42, .5, Math.sin(a) * .42, 5); j.rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .5); L.add(j); jets.push(j); }
    const top = cyl(.04, .08, .55, '#e8f7fb', 0, 1.62, 0, 6); L.add(top);
    animators.push(t => { top.scale.y = .8 + Math.sin(t * 5) * .2; jets.forEach((j, i) => { j.scale.y = .85 + Math.sin(t * 4 + i) * .15; }); });
    // 圖書館：階梯、柱廊、山牆、圓頂
    const lib = new THREE.Group(); lib.position.set(0, 0, -3.6); deco.add(lib);
    for (let i = 0; i < 3; i++) lib.add(box(4.5 - i * .12, .12, 2.5 - i * .12, i % 2 ? PAL.stone : STONE1, 0, i * .12, 0));
    lib.add(box(3.9, 2, 1.7, '#fbf1de', 0, .36, -.1));
    for (let i = -3; i <= 3; i++) { lib.add(cyl(.11, .13, 1.85, PAL.white, i * .58, .36, .95, 10)); lib.add(box(.3, .08, .3, PAL.white, i * .58, .36, .95)); lib.add(box(.3, .08, .3, PAL.white, i * .58, 2.2, .95)); }
    lib.add(box(4.4, .22, 2.4, PAL.white, 0, 2.28, 0)); lib.add(prism(4.5, 1, 2.45, PAL.roof, 0, 2.5, 0)); lib.add(box(4.6, .1, 2.5, PAL.roofD, 0, 2.47, 0));
    lib.add(cyl(.75, .8, .4, '#fbf1de', 0, 3.1, -.2, 14)); lib.add(mesh(new THREE.SphereGeometry(.78, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), '#f0a56a', 0, 3.5, -.2)); lib.add(cyl(.03, .03, .4, PAL.yellow, 0, 4.25, -.2, 5)); lib.add(ball(.09, PAL.yellow, 0, 4.68, -.2, 1));
    lib.add(box(.7, 1.15, .06, PAL.woodD, 0, .36, .78)); lib.add(box(.8, .1, .1, PAL.roofD, 0, 1.5, .8));
    for (const wx of [-1.45, -.85, .85, 1.45]) { lib.add(box(.34, .7, .05, PAL.glass, wx, 1.0, .77)); lib.add(box(.4, .06, .08, PAL.white, wx, .96, .79)); }
    for (const sx of [-2.5, 2.5]) { lib.add(box(.5, .5, .5, STONE1, sx, 0, 1.0)); lib.add(blob(.42, '#84bb6d', sx, .85, 1.0)); }
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.7, .6), new THREE.MeshBasicMaterial({ map: textTex('國中自學筆記', { w: 512, h: 114, size: 64, bg: PAL.white, fg: PAL.roof }) }));
    sign.position.set(0, 2.4, -3.6 + 1.215); L.add(sign);
    // 九科的彩旗：圍著廣場
    const N = 9, PR = 3.75, poles = [];
    for (let i = 0; i < N; i++) { const a = (i + .5) / N * Math.PI * 2 + Math.PI; if (Math.abs(Math.sin(a) * PR) < 2.6 && -Math.cos(a) * PR < -2) continue; poles.push(a); deco.add(cyl(.05, .06, 2.1, PAL.white, Math.sin(a) * PR, 0, -Math.cos(a) * PR, 6)); deco.add(ball(.09, SUBJ_COLORS[i], Math.sin(a) * PR, 2.14, -Math.cos(a) * PR, 1)); }
    for (let i = 0; i < poles.length - 1; i++) {
      const a0 = poles[i], a1 = poles[i + 1]; if (a1 - a0 > 1) continue;
      for (let k = 1; k < 7; k++) { const u = k / 7, a = a0 + (a1 - a0) * u, sag = Math.sin(u * Math.PI) * .32, f = cone(.12, .26, SUBJ_COLORS[(i * 2 + k) % 9], Math.sin(a) * PR, 1.72 - sag, -Math.cos(a) * PR, 3); f.rotation.x = Math.PI; f.rotation.y = -a; f.scale.z = .25; deco.add(f); }
    }
    // 路牌
    const post = new THREE.Group(); post.position.set(2.75, 0, 2.05); L.add(post);
    post.add(cyl(.07, .08, 2.1, PAL.woodD, 0, 0, 0, 6)); post.add(cone(.14, .2, PAL.roof, 0, 2.1, 0, 6));
    [['英語 →', 0], ['← 歷史', 1], ['生物 →', 2]].forEach(([t, i]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(1.25, .34, .06), [M(PAL.wood), M(PAL.wood), M(PAL.wood), M(PAL.wood), new THREE.MeshBasicMaterial({ map: textTex(t, { w: 256, h: 70, size: 42, bg: PAL.wood, fg: '#fff' }) }), M(PAL.wood)]); b.position.set(i % 2 ? -.36 : .36, 1.82 - i * .44, 0); b.rotation.y = (i - 1) * .5; b.castShadow = true; post.add(b); });
    // 樹、花圃、長椅、路燈
    for (const [x, z, k, sc] of [[-4.7, 1.2, 'round', 1.35], [4.6, -.6, 'cherry', 1.2], [-3.3, 4.0, 'cherry', 1.1], [1.2, 5.0, 'round', 1.2], [-4.9, -1.9, 'round', 1.15], [4.3, 2.9, 'palm', 1.1], [3.6, -3.4, 'pine', 1.1], [-3.5, -3.6, 'pine', 1.2], [-1.4, 5.2, 'bush', 1], [5.2, 1.1, 'bush', 1], [-5.3, -.2, 'bush', 1.1]]) deco.add(tree(x, z, sc, k));
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .52; deco.add(bench(Math.cos(a) * 2.72, Math.sin(a) * 2.72, -a + Math.PI / 2)); }
    for (const a of [.52, 2.62, 3.67, 5.76]) { const lp = tree(Math.cos(a) * 3.9, Math.sin(a) * 3.9, 1.05, 'lampost'); lp.rotation.y = -a; deco.add(lp); }
    for (const [x, z] of [[-2.3, 3.5], [2.6, 3.9], [-4.2, 2.7], [4.9, -2], [-4.6, -3.1]]) { deco.add(cyl(.62, .66, .12, '#b98f62', x, 0, z, 10)); deco.add(flowers(x, z, 7)); deco.children.at(-1).position.y = .1; }
    for (let i = 0; i < 26; i++) { const a = rnd() * 6.28, r = rr(4.1, 5.6); deco.add(tuft(Math.cos(a) * r, Math.sin(a) * r)); }
    L.add(bake(deco));
    // 氣球
    const bl = new THREE.Group(); bl.position.set(-2.75, 0, -1.9); L.add(bl);
    [['#e05a47', 0, 0], ['#f4c95d', .28, .1], ['#5b8fd1', -.22, .16]].forEach(([c, x, z], i) => { const b = mesh(new THREE.SphereGeometry(.26, 12, 10), SM(c, { roughness: .35 }), x, 2.2 + i * .22, z); b.scale.y = 1.15; bl.add(b); bl.add(cyl(.006, .006, 1.6 + i * .22, PAL.dark, x * .5, .5, z * .5, 3)); });
    bl.add(box(.3, .5, .3, PAL.woodD, 0, 0, 0));
    animators.push(t => { bl.children.forEach((b, i) => { if (i % 2 === 0 && i < 6) b.position.y = 2.2 + (i / 2) * .22 + Math.sin(t * 1.6 + i) * .06; }); });
    // 散步的島民
    const looks = [0, 1, 2, 3, 4].map(i => ({ skin: LOOKS.skin[i % 4], hair: LOOKS.hair[(i * 2) % 6], shirt: LOOKS.shirt[(i * 3 + 1) % 7], pants: LOOKS.pants[i % 5], hat: i % 2 ? LOOKS.hat[1 + i % 4] : 'none' }));
    looks.forEach((lk, i) => { const p = makeVillager(lk, true); p.scale.setScalar(.5); L.add(p); const off = i / 5 * Math.PI * 2, r = 1.75 + (i % 2) * .32, sp = (i % 2 ? 1 : -1) * (.22 + i * .025);
      animators.push(t => { const a = off + t * sp, u = p.userData, sw = Math.sin(t * 7 + i) * .6; p.position.set(Math.cos(a) * r, .04, Math.sin(a) * r); p.rotation.y = -a + (sp > 0 ? 0 : Math.PI); u.legL.rotation.x = sw; u.legR.rotation.x = -sw; u.armL.rotation.x = -sw; u.armR.rotation.x = sw; u.body.position.y = Math.abs(Math.sin(t * 7 + i)) * .04; }); });
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
  const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d');
  g.shadowColor = 'rgba(40,30,20,.35)'; g.shadowBlur = 10; g.shadowOffsetY = 5;
  g.fillStyle = '#fff'; g.beginPath(); g.arc(80, 76, 62, 0, Math.PI * 2); g.fill();
  g.shadowColor = 'transparent';
  const gr = g.createLinearGradient(0, 20, 0, 132); gr.addColorStop(0, tint(color, .18)); gr.addColorStop(1, color);
  g.fillStyle = gr; g.beginPath(); g.arc(80, 76, 52, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${text.length > 2 ? 44 : 60}px "Noto Sans TC",sans-serif`; g.fillText(text, 80, 80);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: true })); s.scale.set(1.05, 1.05, 1); return s;
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
  const f = new THREE.Group(); f.position.set(-pr * .78, .3, pr * .55); lm.group.add(f);
  f.add(cyl(.035, .04, 1.45, PAL.white, 0, 0, 0, 5)); f.add(ball(.07, PAL.yellow, 0, 1.48, 0, 1));
  const flag = new THREE.Group(); flag.position.y = 1.2; f.add(flag);
  const fm = cone(.2, .62, '#f7c531', .33, -.2, 0, 3); fm.rotation.z = -Math.PI / 2; fm.scale.z = .12; flag.add(fm);
  animators.push(t => { flag.rotation.y = Math.sin(t * 3 + lm.group.position.x) * .3; });
}
const kit = { THREE, PAL, M, mesh, box, cyl, cone, ball, prism, house, person, textTex, A: f => animators.push(f) };
// 每座島的植栽風格
const FLORA = {
  english: ['round', 'round', 'cypress', 'bush', 'lampost', 'hedge', 'round'],
  chinese: ['cherry', 'bamboo', 'cherry', 'pine', 'lantern', 'bush', 'bamboo'],
  math: ['topiary', 'topiary', 'round', 'hedge', 'topiary', 'bush', 'cypress'],
  biology: ['round', 'pine', 'palm', 'mushroom', 'bush', 'cherry', 'round', 'mushroom'],
  physchem: ['round', 'crystal', 'pine', 'crystal', 'bush', 'lampost', 'round'],
  earth: ['pine', 'rock', 'rock', 'cactus', 'pine', 'bush', 'crystal'],
  history: ['cypress', 'round', 'column', 'cypress', 'bush', 'column', 'pine'],
  geography: ['palm', 'palm', 'round', 'rock', 'bush', 'flagpole', 'cactus'],
  civics: ['round', 'hedge', 'lampost', 'round', 'bush', 'cherry', 'flagpole'],
};
function buildSubject(g, id, theme, it) {
  const L = lay(g, 1), deco = new THREE.Group();
  const defs = LANDMARKS[id] || [], slots = slotsFor(defs), few = defs.length <= 6;
  const soft = tint(theme.c, .62), softer = tint(theme.c, .8);
  // 中央廣場、通往六個方向的石板路、環狀步道
  deco.add(cyl(2.25, 2.3, .06, STONE1, 0, 0, 0, 28)); tilesRing(deco, 2.0, 22, soft, softer, .5, .4);
  const ringR = few ? 0 : 6.7;
  if (ringR) tilesRing(deco, ringR, 62, STONE1, STONE2, .6, .5);
  for (let k = 0; k < 6; k++) tilesLine(deco, k * Math.PI / 3, 2.6, AP - .7, STONE1, STONE2);
  // 科目碑：台階＋直書的科目名稱＋屋頂
  deco.add(cyl(1.35, 1.45, .16, PAL.stone, 0, .06, 0, 8)); deco.add(cyl(1.0, 1.1, .16, soft, 0, .22, 0, 8));
  const vtex = (() => { const c = document.createElement('canvas'); c.width = 128; c.height = 320; const x = c.getContext('2d');
    const gr = x.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, tint(theme.c, .12)); gr.addColorStop(1, shade(theme.c, -.12)); x.fillStyle = gr; x.fillRect(0, 0, 128, 320);
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 5; x.strokeRect(10, 10, 108, 300);
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 74px "Noto Sans TC",sans-serif'; [...it.s.name].forEach((ch, i, a) => x.fillText(ch, 64, 160 + (i - (a.length - 1) / 2) * 86));
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return new THREE.MeshStandardMaterial({ map: t, roughness: .85 }); })();
  const ob = new THREE.Mesh(new THREE.BoxGeometry(.92, 2.2, .92), [0, 1, 2, 3, 4, 5].map(i => i === 2 || i === 3 ? M(theme.c) : vtex));
  ob.position.y = 1.48; ob.castShadow = true; L.add(ob);
  deco.add(box(1.25, .1, 1.25, shade(theme.c, -.25), 0, 2.58, 0)); const roof = cone(.98, .7, theme.c, 0, 2.68, 0, 4); roof.rotation.y = Math.PI / 4; deco.add(roof); deco.add(ball(.1, PAL.yellow, 0, 3.42, 0, 1));
  for (const a of [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4]) { deco.add(cyl(.3, .34, .14, '#b98f62', Math.cos(a) * 1.72, .05, Math.sin(a) * 1.72, 8)); const fl = flowers(Math.cos(a) * 1.72, Math.sin(a) * 1.72, 4); fl.position.y = .17; fl.scale.set(1, 1, 1); deco.add(fl); }
  it.landmarks = [];
  const taken = [];
  for (const [d, x, z] of slots) {
    const w = new THREE.Group(); w.position.set(x, 0, z); w.rotation.y = Math.atan2(x, z); L.add(w);
    const pr = d.small ? 1.05 : few ? 2.1 : 1.55;
    // 底座：石階＋主題色台面
    const ped = new THREE.Group();
    ped.add(cyl(pr + .14, pr + .26, .13, PAL.stone, 0, 0, 0, 20)); ped.add(cyl(pr, pr + .08, .17, soft, 0, .13, 0, 20));
    const inl = flat(new THREE.CircleGeometry(pr - .2, 20), softer, .305); ped.add(inl);
    const rim = flat(new THREE.RingGeometry(pr - .2, pr - .1, 24), theme.c, .306); ped.add(rim);
    ped.add(cyl(.05, .06, .5, PAL.woodD, 0, .13, pr + .12, 5));
    const plinth = bake(ped); w.add(plinth);
    const inner = new THREE.Group(); inner.position.y = .3; if (few) inner.scale.setScalar(1.4); w.add(inner);
    d.build({ ...kit, g: inner });
    const sp = numSprite(d.n ? String(d.n) : d.key === 'chrono' ? '年' : d.key === 'valence' ? '價' : '★', theme.c); sp.position.set(0, .92, pr + .14); w.add(sp);
    const key = d.key || 'u' + d.n;
    const lm = { def: d, it, group: w, plinth, sprite: sp, key, pr };
    if (VISITED.has(id + '|' + key)) addStamp(lm);
    w.traverse(m => { m.userData.lm = lm; });
    it.landmarks.push(lm);
    taken.push([x, z, pr + .95]);
  }
  // 依科目風格種樹、擺小物
  const flora = FLORA[id] || ['round', 'pine', 'bush'];
  const free = (x, z, r) => inHexLocal(x, z, 1.5) && Math.hypot(x, z) > 2.9 && !(ringR && Math.abs(Math.hypot(x, z) - ringR) < .75 + r * .3) && !taken.some(([a, b, q]) => Math.hypot(x - a, z - b) < q + r)
    && ![0, 1, 2, 3, 4, 5].some(k => { const a = k * Math.PI / 3, t = x * Math.sin(a) - z * Math.cos(a); return t > 0 && Math.abs(x * Math.cos(a) + z * Math.sin(a)) < .75 + r * .4; });
  for (let i = 0, made = 0; i < 500 && made < 30; i++) {
    const x = rr(-10.5, 10.5), z = rr(-10.5, 10.5), kind = flora[made % flora.length], big = !['bush', 'rock', 'mushroom', 'lantern', 'crystal'].includes(kind);
    if (!free(x, z, big ? .55 : .3)) continue;
    taken.push([x, z, big ? 1.0 : .7]); made++;
    deco.add(tree(x, z, rr(.8, 1.1), kind));
  }
  for (let i = 0, made = 0; i < 300 && made < 46; i++) { const x = rr(-10.5, 10.5), z = rr(-10.5, 10.5); if (!free(x, z, .05)) continue; made++; deco.add(made % 5 === 0 ? flowers(x, z, 4) : tuft(x, z)); }
  // 島的外緣種一圈矮樹叢和花
  const edgeKinds = flora.filter(k => ['bush', 'rock', 'mushroom', 'crystal', 'hedge', 'cactus'].includes(k)).concat(['bush']);
  for (let k = 0; k < 6; k++) {
    const a = k * Math.PI / 3, nx = Math.sin(a), nz = -Math.cos(a), tx = Math.cos(a), tz = Math.sin(a), ap = AP - .78;
    for (let t = -5.2, i = 0; t <= 5.2; t += 1.05, i++) {
      if (Math.abs(t) < 1.5) continue;
      const x = nx * ap + tx * t, z = nz * ap + tz * t;
      if (taken.some(([p, q, r]) => Math.hypot(x - p, z - q) < r - .35)) continue;
      const kind = edgeKinds[(i + k) % edgeKinds.length];
      if (i % 3 === 1) { const f = flowers(x, z, 4); deco.add(f); } else if (kind === 'hedge') { const h = tree(x, z, .62, 'hedge'); h.rotation.y = -a; deco.add(h); } else deco.add(tree(x, z, rr(.55, .75), kind));
    }
  }
  L.add(bake(deco));
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
  const g = hexIsland(theme); g.position.copy(pos);
  const it = { id, s, group: g, pos, ready: s.ready, theme, bob: rnd() * 6, landmarks: [] };
  if (LANDMARKS[id] && s.ready) buildSubject(g, id, theme, it); else (BUILD[id] || BUILD.soon)(g, id);
  scene.add(g);
  g.traverse(m => { m.userData.island = it; });
  islands.push(it);
}
place('hub', 0, 0);
RING1.forEach(([id, a]) => place(id, a, D));
RING2.forEach(([id, a]) => place(id, a, D * Math.sqrt(3)));
// 編號：依首頁順序
let n = 0; for (const s of SUBJ) { const it = islands.find(i => i.id === s.id); if (it) it.num = String(++n).padStart(2, '0'); }

// 橋：微微拱起的木棧橋
const BRIDGES = [], ARCH = .42, BR_Y = .64;
function bridge(a, b) {
  BRIDGES.push([a.clone(), b.clone()]);
  const d = new THREE.Vector3().subVectors(b, a), len = d.length() - 2 * AP + 1.0, mid = a.clone().add(b).multiplyScalar(.5);
  const g = new THREE.Group(); g.position.copy(mid); g.rotation.y = Math.atan2(d.x, d.z);
  const yAt = z => BR_Y + ARCH * Math.cos(z / len * Math.PI), n = Math.ceil(len / .4);
  for (let i = 0; i < n; i++) { const z = -len / 2 + (i + .5) * len / n, p = box(2.1, .08, len / n - .05, i % 2 ? PAL.wood : '#d39a66', 0, yAt(z) - .08, z); p.rotation.x = Math.atan(ARCH * Math.PI / len * Math.sin(z / len * Math.PI)); g.add(p); }
  for (const x of [-1.0, 1.0]) {
    let prev = null;
    for (let k = 0; k <= 4; k++) { const z = -len / 2 + k * len / 4, y = yAt(z); g.add(cyl(.07, .08, .95, PAL.woodD, x, y - .1, z, 6)); g.add(ball(.1, '#fff3c4', x, y + .9, z, 0));
      if (prev) for (let s = 1; s <= 4; s++) { const u = s / 5, rz = prev.z + (z - prev.z) * u, ry = prev.y + (y - prev.y) * u + .68 - Math.sin(u * Math.PI) * .16; g.add(ball(.045, '#f7ead0', x, ry, rz, 0)); }
      prev = { z, y }; }
    for (const z of [-len / 4, len / 4]) g.add(cyl(.1, .1, 1.5, PAL.woodD, x * .85, -.9, z, 6));
  }
  g.add(box(1.9, .1, len, PAL.woodD, 0, BR_Y - .25, 0));
  const out = bake(g); out.userData.bridge = true; scene.add(out);
}
const P = id => islands.find(i => i.id === id)?.pos;
RING1.forEach(([id]) => bridge(P('hub'), P(id)));
for (let i = 0; i < RING1.length; i++) bridge(P(RING1[i][0]), P(RING1[(i + 1) % RING1.length][0]));
bridge(P('math'), P('chinese')); bridge(P('math'), P('biology'));
bridge(P('physchem'), P('biology')); bridge(P('physchem'), P('earth'));
bridge(P('geography'), P('history')); bridge(P('geography'), P('civics'));

// ---------- 海、遠景、裝飾 ----------
const seaGeo = new THREE.PlaneGeometry(900, 900, 120, 120); seaGeo.rotateX(-Math.PI / 2);
const seaBase = seaGeo.attributes.position.array.slice();
{ // 靠近島的海水比較淺、比較亮
  const n = seaGeo.attributes.position.count, col = new Float32Array(n * 3), c0 = new THREE.Color('#a5e6df'), c1 = new THREE.Color('#62c3d3'), c2 = new THREE.Color('#3f9fc6'), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const x = seaBase[i * 3], z = seaBase[i * 3 + 2]; let d = 1e9; for (const it of islands) d = Math.min(d, Math.hypot(x - it.pos.x, z - it.pos.z));
    const k = Math.min(1, Math.max(0, (d - R - 1) / 16)), k2 = Math.min(1, Math.max(0, (Math.hypot(x, z) - 70) / 160));
    c.copy(c0).lerp(c1, k * k * (3 - 2 * k)).lerp(c2, k2); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  seaGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
}
const sea = new THREE.Mesh(seaGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .42, metalness: .08, flatShading: true }));
sea.position.y = -.35; sea.receiveShadow = true; scene.add(sea);
animators.push(t => {
  const a = seaGeo.attributes.position.array;
  for (let i = 0; i < a.length; i += 3) a[i + 1] = Math.sin(seaBase[i] * .12 + t * 1.1) * .12 + Math.cos(seaBase[i + 2] * .1 + t * .8) * .12;
  seaGeo.attributes.position.needsUpdate = true; seaGeo.computeVertexNormals();
});
// 岸邊的浪花
for (const it of islands) {
  const rings = [0, 1].map(k => { const f = new THREE.Mesh(new THREE.RingGeometry(R + 1.5, R + 1.95, 6, 1), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .5, depthWrite: false })); f.geometry.rotateX(-Math.PI / 2); f.rotation.y = Math.PI / 6; f.position.set(it.pos.x, -.2, it.pos.z); scene.add(f); return f; });
  animators.push(t => rings.forEach((f, k) => { const p = (t * .22 + k * .5 + it.bob) % 1; f.scale.setScalar(1.0 + p * .16); f.material.opacity = .55 * (1 - p); }));
}
// 遠山
for (let i = 0; i < 26; i++) {
  const a = -Math.PI * .95 + i / 25 * Math.PI * .9 - .1, r = rr(260, 320), rad = rr(34, 56);
  const h = rr(30, 70), m = cone(rad, h, ['#9cc4a4', '#a9cfae', '#8fb9a6'][i % 3], Math.cos(a) * r, -1, Math.sin(a) * r, 7);
  m.castShadow = false; scene.add(m);
  if (h > 48) { const s = cone(rad * .3, h * .3, '#f6fbfb', Math.cos(a) * r, -1 + h * .7 + .2, Math.sin(a) * r, 7); s.castShadow = false; scene.add(s); }
}
// 小島
function islet(x, z, kind) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  const r = rr(2.2, 3.4);
  g.add(cyl(r + .5, r + 1.4, .5, '#f7ead0', 0, -.8, 0, 9)); g.add(cyl(r, r + .5, .45, PAL.sand, 0, -.35, 0, 9));
  if (kind !== 'umbrella') g.add(cyl(r - .7, r - .4, .22, PAL.grass, 0, .08, 0, 9));
  if (kind === 'tree') { g.add(tree(0, 0, 1.2, 'palm')); g.add(tree(-.9, .5, .9, 'round')); g.add(tree(.8, -.6, .8, 'bush')); g.add(tree(.5, .9, .7, 'rock')); }
  if (kind === 'rock') { g.add(tree(0, 0, 1.6, 'rock')); g.add(tree(.9, .4, 1, 'pine')); g.add(tree(-.8, -.5, .8, 'bush')); }
  if (kind === 'light') { g.add(cyl(.5, .7, 2.6, PAL.white, 0, .28, 0, 10)); for (let y = .7; y < 2.6; y += .8) g.add(cyl(.56 - y * .06, .6 - y * .06, .36, PAL.red, 0, y, 0, 10)); g.add(cyl(.62, .62, .08, PAL.dark, 0, 2.88, 0, 10)); g.add(cyl(.34, .34, .45, '#fff3c4', 0, 2.96, 0, 8)); g.add(cone(.5, .5, PAL.red, 0, 3.4, 0, 10)); g.add(tree(1.1, .6, .8, 'bush')); }
  if (kind === 'umbrella') { for (const [ux, c] of [[-.7, PAL.red], [.8, PAL.yellow]]) { g.add(cyl(.03, .03, 1.3, PAL.white, ux, .1, 0, 4)); g.add(cone(.8, .4, c, ux, 1.3, 0, 8)); g.add(box(.45, .06, .95, ux < 0 ? PAL.blue : '#f2a7b5', ux + .5, .12, .3)); } g.add(tree(0, -1.1, 1.1, 'palm')); g.add(ball(.2, '#e05a47', .1, .3, 1.0, 1)); }
  scene.add(bake(g));
}
[[-62, -12, 'tree'], [64, -24, 'tree'], [54, 46, 'umbrella'], [-54, 40, 'rock'], [70, 14, 'light'], [-70, -42, 'tree'], [10, 70, 'tree'], [-22, -74, 'rock'], [40, -66, 'tree'], [-40, 66, 'light']].forEach(a => islet(...a));
// 帆船與浮標
for (let i = 0; i < 6; i++) {
  const g = new THREE.Group(), b = new THREE.Group(); const r = rr(62, 90), a = rr(0, Math.PI * 2), c = [PAL.white, PAL.red, PAL.blue, PAL.yellow][i % 4];
  b.add(box(1.7, .32, .62, c, 0, -.12, 0)); const bow = prism(.62, .5, .32, c, .85, -.12, 0); bow.rotation.set(Math.PI / 2, 0, -Math.PI / 2); bow.position.set(.85, .04, 0); b.add(bow);
  b.add(box(1.6, .05, .5, PAL.wood, 0, .2, 0)); b.add(cyl(.035, .035, 1.9, PAL.woodD, .1, .2, 0, 4));
  b.add(prism(1.0, 1.5, .03, PAL.white, .1, .45, 0)); const jib = prism(.6, 1.1, .03, i % 2 ? '#f7c9a0' : '#cfe8f2', .1, .5, 0); jib.position.x = .68; jib.scale.x = -1; b.add(jib);
  g.add(bake(b)); scene.add(g);
  animators.push(t => { const k = a + t * .02 * (i % 2 ? 1 : -1); g.position.set(Math.cos(k) * r, Math.sin(t * 1.5 + i) * .08, Math.sin(k) * r); g.rotation.y = -k + (i % 2 ? 0 : Math.PI); g.rotation.z = Math.sin(t * 1.2 + i) * .06; });
}
for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + .2, r = 56; const b = new THREE.Group(); b.add(cyl(.2, .28, .6, i % 2 ? PAL.red : PAL.white, 0, -.3, 0, 8)); b.add(cyl(.03, .03, .7, PAL.dark, 0, .3, 0, 4)); b.add(ball(.08, PAL.yellow, 0, 1.0, 0, 0)); b.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); scene.add(b); animators.push(t => { b.position.y = Math.sin(t * 2 + i) * .1; b.rotation.z = Math.sin(t * 1.3 + i) * .1; }); }
// 熱氣球
[['#e2673c', '#fff3c4', -48, 30, -30], ['#5b8fd1', '#f7ead0', 52, 36, 20]].forEach(([c1, c2, x, y, z], i) => {
  const g = new THREE.Group(), b = new THREE.Group();
  for (let k = 0; k < 8; k++) { const sgm = mesh(new THREE.SphereGeometry(3, 4, 10, k * Math.PI / 4, Math.PI / 4), k % 2 ? c1 : c2, 0, 0, 0); sgm.scale.y = 1.15; b.add(sgm); }
  b.add(cyl(1.1, .7, 1.0, c1, 0, -4.1, 0, 8)); b.add(box(1, .8, 1, PAL.wood, 0, -6, 0)); for (const [sx, sz] of [[-.45, -.45], [.45, -.45], [-.45, .45], [.45, .45]]) b.add(cyl(.02, .02, 1.3, PAL.dark, sx, -5.2, sz, 3));
  const bm = bake(b); bm.castShadow = false; g.add(bm); scene.add(g);
  animators.push(t => { g.position.set(x + Math.sin(t * .05 + i * 2) * 14, y + Math.sin(t * .4 + i) * 1.2, z + Math.cos(t * .04 + i) * 10); g.rotation.y = t * .05; });
});
// 雲
for (let i = 0; i < 12; i++) {
  const g = new THREE.Group(), cm = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, transparent: true, opacity: .9 });
  for (let k = 0; k < 5; k++) { const p = new THREE.Mesh(new THREE.SphereGeometry(rr(1.8, 3.4), 10, 8), cm); p.position.set(k * 2.3 - 4.6, rr(-.2, .5) + (k === 2 ? .9 : 0), rr(-1, 1)); p.scale.y = .62; g.add(p); }
  const y = rr(80, 95), r0 = rr(-220, 220), z = rr(-230, -80);
  g.position.set(r0, y, z); g.scale.setScalar(rr(1, 1.8)); scene.add(g);
  animators.push((t, dt) => { g.position.x += dt * 1.2; if (g.position.x > 230) g.position.x = -230; });
}
// 海鳥
for (let i = 0; i < 6; i++) {
  const g = new THREE.Group(); const w1 = box(.7, .03, .22, PAL.white, -.35, 0, 0), w2 = box(.7, .03, .22, PAL.white, .35, 0, 0); g.add(w1, w2); g.add(ball(.1, PAL.white, 0, 0, .05, 0)); scene.add(g);
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
$('listSub').textContent = `${ready.length} 座已開放的島${SUBJ.length > ready.length ? ` ／ ${SUBJ.length - ready.length} 座整理中` : '，全部開放'}。選一座島，走進它的重點筆記。`;
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
  if (d.key === 'valence') return { k: 'TABLE', t: d.title, s: d.desc, h: ['＋1 價', '＋2 價', '＋3 價', '－1 價', '－2 價', '化學式寫法', '容易搞混'], href: d.href };
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
    <a class="go" href="${x.href}">閱讀這個${lm.it.id === 'english' ? '主題' : lm.def.key === 'chrono' ? '年表' : lm.def.key === 'valence' ? '表' : '單元'} →</a>
    <button class="back" type="button">← 回到${esc(lm.it.s.name)}島</button>`;
  info.querySelector('.x').onclick = () => { info.hidden = true; selectLm(null); };
  info.querySelector('.back').onclick = () => focus(lm.it);
}
function showInfo(it) {
  const s = it.s, c = it.theme.c;
  info.style.setProperty('--c', c); info.hidden = false;
  if (it.id === 'hub') {
    info.innerHTML = `<button class="x" aria-label="關閉">✕</button><div class="k">STUDY CENTER</div><h3>學習中心</h3><div class="en">國中自學筆記</div>
      <p>這裡是群島的中心。從廣場走過木橋，就能到每一科的島。已開放 ${ready.length} 座島${SUBJ.some(x => !x.ready) ? `，${SUBJ.filter(x => !x.ready).map(x => x.name).join('、')}還在整理中` : '，每一科都開放了'}。</p>
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
      <div class="units">${it.landmarks.map((lm, i) => { const y = lmInfo(lm); return `<button type="button" data-i="${i}"><i>${lm.def.n && !lm.def.gram ? lm.def.n : lm.def.key === 'chrono' ? '年' : lm.def.key === 'valence' ? '價' : lm.def.gram ? 'G' + lm.def.n : '★'}</i><span>${esc(y.t.replace(/^\d+．/, ''))}<small>${esc(lm.def.short)}</small></span>${seen(lm) ? '<em>✓</em>' : ''}</button>`; }).join('')}</div>
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
let look = store.get('islander', null);
const walk = { on: false, pos: new THREE.Vector3(0, 0, 8), yaw: Math.PI, vy: 0, camYaw: 0, camPitch: .5, camDist: 13, target: null, stuck: 0, near: null, t: 0 };
let villager = null;

function makeVillager(L, npc) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const sm = (geo, c, x, y, z, o) => { const m = new THREE.Mesh(geo, SM(c, o)); m.position.set(x, y, z); m.castShadow = true; return m; };
  const cap = (r, len, c, x, y, z) => sm(new THREE.CapsuleGeometry(r, len, 5, 12), c, x, y, z);
  const sph = (r, c, x, y, z, o) => sm(new THREE.SphereGeometry(r, 18, 14), c, x, y, z, o);
  // 腿與鞋
  const leg = x => { const p = new THREE.Group(); p.position.set(x, .5, 0); p.add(cap(.105, .2, L.pants, 0, -.2, 0)); const sh = sph(.13, '#4a443e', 0, -.43, .05); sh.scale.set(1, .62, 1.45); p.add(sh); return p; };
  const legL = leg(-.14), legR = leg(.14); body.add(legL, legR);
  // 身體、背包
  const torso = cap(.27, .2, L.shirt, 0, .82, 0); torso.scale.set(1, 1, .88); body.add(torso);
  const pack = sm(new THREE.CapsuleGeometry(.15, .16, 4, 10), L.hat !== 'none' ? L.hat : '#c98e5a', 0, .86, -.27); pack.scale.set(1.25, 1, .7); body.add(pack);
  body.add(sm(new THREE.BoxGeometry(.2, .1, .05), '#fff', 0, .86, -.37, { roughness: .6 }));
  // 手臂
  const arm = x => { const p = new THREE.Group(); p.position.set(x, 1.0, 0); p.rotation.z = x < 0 ? -.16 : .16; p.add(cap(.075, .2, L.shirt, 0, -.17, 0)); p.add(sph(.085, L.skin, 0, -.38, 0)); return p; };
  const armL = arm(-.33), armR = arm(.33); body.add(armL, armR);
  // 頭
  const head = new THREE.Group(); head.position.y = 1.5; body.add(head);
  head.add(sph(.42, L.skin, 0, 0, 0));
  for (const x of [-.41, .41]) head.add(sph(.075, L.skin, x, -.04, 0));
  const hair = sm(new THREE.SphereGeometry(.445, 18, 12, 0, Math.PI * 2, 0, Math.PI * .56), L.hair, 0, .02, -.03); hair.rotation.x = -.42; head.add(hair);
  if (L.hat === 'none') for (const [x, s] of [[-.2, .17], [0, .19], [.2, .17]]) { const b = sph(s, L.hair, x, .3, .27); b.scale.set(1.1, .6, .7); head.add(b); }
  else for (const x of [-.17, .17]) { const b = sph(.15, L.hair, x, .16, .33); b.scale.set(1.1, .5, .6); head.add(b); }
  const eyes = [-.15, .15].map(x => { const e = sph(.058, '#2a2622', x, -.02, .385, { roughness: .3 }); e.scale.set(1, 1.3, .55); head.add(e); head.add(sm(new THREE.SphereGeometry(.02, 8, 6), '#fff', x + .02, .015, .415, { roughness: .2 })); return e; });
  for (const x of [-.25, .25]) { const c = sph(.07, '#f29aa8', x, -.13, .33, { transparent: true, opacity: .75 }); c.scale.set(1.15, .7, .4); head.add(c); }
  const mouth = sm(new THREE.TorusGeometry(.055, .014, 6, 12, Math.PI), '#b0473c', 0, -.13, .395); mouth.rotation.z = Math.PI; head.add(mouth);
  if (L.hat !== 'none') {
    const brim = sm(new THREE.CylinderGeometry(.66, .7, .04, 24), L.hat, 0, .22, 0); brim.rotation.x = -.08; head.add(brim);
    const crown = sm(new THREE.SphereGeometry(.47, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), L.hat, 0, .16, -.02); crown.scale.y = .78; crown.rotation.x = -.08; head.add(crown);
    const band = sm(new THREE.TorusGeometry(.465, .03, 6, 28), shade(L.hat, -.35), 0, .24, -.02); band.rotation.x = Math.PI / 2 - .08; head.add(band);
  }
  g.userData = { body, legL, legR, armL, armR, head, eyes };
  // 腳下的影子
  const sh = new THREE.Mesh(new THREE.CircleGeometry(.42, 20), new THREE.MeshBasicMaterial({ color: '#2a2622', transparent: true, opacity: .16, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = .03; g.add(sh);
  if (npc) return g;
  if (L.name) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 72; const x = c.getContext('2d');
    x.font = '900 36px "Noto Sans TC",sans-serif'; const w = Math.min(250, x.measureText(L.name).width + 30);
    x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.roundRect((256 - w) / 2, 10, w, 52, 26); x.fill();
    x.fillStyle = PAL.dark; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(L.name, 128, 37);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false })); sp.scale.set(2.2, .62, 1); sp.position.y = 2.55; sp.renderOrder = 5; g.add(sp);
  }
  // 腳下的光圈
  const ring = new THREE.Mesh(new THREE.RingGeometry(.52, .64, 28), new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: .75, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = .04; g.add(ring);
  g.userData.ring = ring;
  return g;
}

// ---------- 地形：哪裡能走、地面多高 ----------
const HEXN = [0, 1, 2].map(k => { const a = k * Math.PI / 3; return [Math.sin(a), -Math.cos(a)]; });
const inHex = (x, z, c, m) => HEXN.every(([nx, nz]) => Math.abs((x - c.x) * nx + (z - c.z) * nz) <= AP - m);
const obstacles = [];  // { x, z, r } 或 { box:[x0,z0,x1,z1] }
for (const it of islands) {
  for (const lm of it.landmarks) { const p = new THREE.Vector3(); lm.group.getWorldPosition(p); obstacles.push({ x: p.x, z: p.z, r: lm.pr * .92, lm }); lm.wp = p; }
  if (it.landmarks.length) obstacles.push({ x: it.pos.x, z: it.pos.z, r: 1.25 });
}
const HUB = islands.find(i => i.id === 'hub');
if (HUB) { obstacles.push({ x: 0, z: 0, r: 2.5 }); obstacles.push({ box: [-4.2, -8.9, 4.2, -4.5] }); }
function groundAt(x, z) {   // 回傳地面高度；不能走回傳 null
  for (const it of islands) if (inHex(x, z, it.pos, .7)) return it.group.position.y + it.group.userData.top;
  for (const [a, b] of BRIDGES) {
    const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz), t = ((x - a.x) * dx + (z - a.z) * dz) / L;
    if (t < 0 || t > L) continue;
    if (Math.abs((x - a.x) * dz - (z - a.z) * dx) / L <= .9) return BR_Y + ARCH * Math.cos((t - L / 2) / (L - 2 * AP + 1.0) * Math.PI);
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
      <div class="acts"><a href="${x.href}">進入${n.lm.it.id === 'english' ? '主題' : n.lm.def.key === 'chrono' ? '年表' : n.lm.def.key === 'valence' ? '表' : '單元'} →</a><button type="button" data-a="peek">看重點</button></div>`;
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
    walk.pos.set(pick[0], 0, pick[1]); walk.yaw = pick[2] + Math.PI; walk.spawnSide = true;
  }
  else { walk.pos.set(0, 0, 9); walk.yaw = Math.PI; }
  walk.pos.y = groundAt(walk.pos.x, walk.pos.z) ?? 1; walk.camYaw = walk.yaw + Math.PI + (walk.spawnSide ? .95 : 0); walk.spawnSide = false;   // 從物件旁出現時，鏡頭偏一邊，才不會被科目碑擋住
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
  const bk = (t % 3.4) < .13 ? .12 : 1; u.eyes.forEach(e => { e.scale.y = 1.3 * bk; });
  u.head.rotation.z = moving ? Math.sin(walk.t) * .05 : Math.sin(t * 1.2) * .03;
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
