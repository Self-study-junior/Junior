// 方塊校園：以 Three.js 繪製的 3D 入口，走進各科的館進入筆記
import * as THREE from 'three';

const $ = id => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem('junior.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('junior.' + k, JSON.stringify(v)); } catch (e) {} },
};
const COLORS = { english: '#1a8a96', biology: '#2f8a63', earth: '#9a6a3a', history: '#3d4f9a', civics: '#c7475a', soon: '#9a9a9a' };
const SUBJ = window.SUBJECTS || [];
const touch = matchMedia('(pointer: coarse)').matches;

// ---------- WebGL 檢查 ----------
function hasGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
if (!hasGL()) {
  const n = $('nogl'); n.hidden = false;
  n.innerHTML = '<h2>這台裝置無法顯示 3D 畫面</h2><p>直接選科目：</p>' + SUBJ.filter(s => s.ready).map(s => `<a href="../${s.id}/">${s.name}</a>`).join('') + '<p><a href="../">回一般首頁</a></p>';
  throw new Error('no webgl');
}

// ---------- 小工具：亂數、像素材質 ----------
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const hex = c => new THREE.Color(c);
function pixTex(draw, size = 16) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'); draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapNearestFilter; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function noise(g, size, base, v = .12, alpha = 1) {
  const b = hex(base);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const k = 1 + (rnd() - .5) * 2 * v;
    g.fillStyle = `rgba(${Math.min(255, b.r * 255 * k) | 0},${Math.min(255, b.g * 255 * k) | 0},${Math.min(255, b.b * 255 * k) | 0},${alpha})`;
    g.fillRect(x, y, 1, 1);
  }
}
const lighten = (c, f) => '#' + hex(c).lerp(new THREE.Color('#ffffff'), f).getHexString();
const darken = (c, f) => '#' + hex(c).lerp(new THREE.Color('#000000'), f).getHexString();

const T = {
  grassTop: pixTex((g, s) => noise(g, s, '#6dbb45', .16)),
  grassSide: pixTex((g, s) => { noise(g, s, '#8a5f3a', .14); for (let x = 0; x < s; x++) { const h = 3 + (rnd() * 3 | 0); g.fillStyle = '#62ab3e'; g.fillRect(x, 0, 1, h); } }),
  dirt: pixTex((g, s) => noise(g, s, '#8a5f3a', .16)),
  cobble: pixTex((g, s) => { noise(g, s, '#8c8c8c', .1); g.fillStyle = 'rgba(0,0,0,.28)'; for (let i = 0; i < 9; i++) g.fillRect(rnd() * s | 0, rnd() * s | 0, 3 + (rnd() * 3 | 0), 1); for (let i = 0; i < 7; i++) g.fillRect(rnd() * s | 0, rnd() * s | 0, 1, 3); }),
  planks: pixTex((g, s) => { noise(g, s, '#b38a52', .08); g.fillStyle = 'rgba(0,0,0,.25)'; for (let y = 3; y < s; y += 4) g.fillRect(0, y, s, 1); for (let y = 0; y < s; y += 4) g.fillRect(((y / 4) % 2) * 8 + 3, y, 1, 3); }),
  logSide: pixTex((g, s) => { noise(g, s, '#6b4d2c', .1); g.fillStyle = 'rgba(0,0,0,.25)'; for (let x = 1; x < s; x += 3) g.fillRect(x, 0, 1, s); }),
  logTop: pixTex((g, s) => { noise(g, s, '#b38a52', .06); g.strokeStyle = 'rgba(90,60,30,.6)'; for (let r = 2; r < 8; r += 2) { g.strokeRect(8 - r, 8 - r, r * 2, r * 2); } }),
  leaves: pixTex((g, s) => { for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) { if (rnd() < .18) continue; const k = .7 + rnd() * .5; g.fillStyle = `rgb(${50 * k | 0},${130 * k | 0},${45 * k | 0})`; g.fillRect(x, y, 1, 1); } }),
  stone: pixTex((g, s) => noise(g, s, '#a3a3a3', .07)),
  brick: pixTex((g, s) => { g.fillStyle = '#c9c2b5'; g.fillRect(0, 0, s, s); for (let y = 0; y < s; y += 4) for (let x = -((y / 4) % 2) * 4; x < s; x += 8) { const k = .85 + rnd() * .3; g.fillStyle = `rgb(${172 * k | 0},${80 * k | 0},${60 * k | 0})`; g.fillRect(x + 1, y + 1, 7, 3); } }),
  sand: pixTex((g, s) => noise(g, s, '#e3d39a', .06)),
  water: pixTex((g, s) => { noise(g, s, '#3d7fd6', .08); g.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 6; i++) g.fillRect(rnd() * s | 0, rnd() * s | 0, 3, 1); }),
  glass: pixTex((g, s) => { g.fillStyle = 'rgba(200,235,255,.35)'; g.fillRect(0, 0, s, s); g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(0, 0, s, 1); g.fillRect(0, s - 1, s, 1); g.fillRect(0, 0, 1, s); g.fillRect(s - 1, 0, 1, s); g.fillRect(4, 4, 1, 3); g.fillRect(5, 3, 1, 1); }),
};
const wallTex = {}, stripeTex = {};
const wallOf = c => wallTex[c] ||= pixTex((g, s) => { noise(g, s, c, .07); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, s - 1, s, 1); });
const stripeOf = c => stripeTex[c] ||= pixTex((g, s) => { noise(g, s, lighten(c, .55), .05); });
const mat = (t, o = {}) => new THREE.MeshLambertMaterial({ map: t, ...o });
const MAT = {
  grass: [mat(T.grassSide), mat(T.grassSide), mat(T.grassTop), mat(T.dirt), mat(T.grassSide), mat(T.grassSide)],
  dirt: mat(T.dirt), cobble: mat(T.cobble), planks: mat(T.planks), stone: mat(T.stone), brick: mat(T.brick), sand: mat(T.sand),
  log: [mat(T.logSide), mat(T.logSide), mat(T.logTop), mat(T.logTop), mat(T.logSide), mat(T.logSide)],
  leaves: mat(T.leaves, { alphaTest: .5, side: THREE.DoubleSide }),
  glass: mat(T.glass, { transparent: true, depthWrite: false }),
};
const matCache = {};
const wallMat = c => matCache['w' + c] ||= mat(wallOf(c));
const stripeMat = c => matCache['s' + c] ||= mat(stripeOf(c));

// ---------- 場景 ----------
const canvas = $('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !touch });
renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 2));
renderer.shadowMap.enabled = !touch;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#9fd3ff');
scene.fog = new THREE.Fog('#bfe3ff', 45, 110);
const camera = new THREE.PerspectiveCamera(60, 1, .1, 300);
scene.add(new THREE.HemisphereLight('#dff1ff', '#5a7a3a', .9));
const sun = new THREE.DirectionalLight('#fff6dc', 1.6);
sun.position.set(30, 50, 20); sun.castShadow = true;
Object.assign(sun.shadow.camera, { left: -55, right: 55, top: 55, bottom: -55, near: 1, far: 140 });
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

// ---------- 方塊登記 ----------
const blocks = new Map();     // 材質名 → 位置陣列
const solid = new Set();      // "x,z"：人物不能穿過的格子
const occupied = new Set();   // 已經放東西的格子（種樹時避開）
const pathCells = new Set();
const materials = {};
function put(name, m, x, y, z, isSolid = true) {
  if (!blocks.has(name)) { blocks.set(name, []); materials[name] = m; }
  blocks.get(name).push(x, y, z);
  occupied.add(x + ',' + z);
  if (isSolid && y < 3) solid.add(x + ',' + z);
}
function flushBlocks() {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const m4 = new THREE.Matrix4();
  for (const [name, arr] of blocks) {
    const n = arr.length / 3, mesh = new THREE.InstancedMesh(geo, materials[name], n);
    for (let i = 0; i < n; i++) { m4.makeTranslation(arr[i * 3], arr[i * 3 + 1] + .5, arr[i * 3 + 2]); mesh.setMatrixAt(i, m4); }
    mesh.castShadow = name !== 'glass'; mesh.receiveShadow = true;
    scene.add(mesh);
  }
}

// 地面：一整片草地＋邊緣一圈立體草方塊
const R = 46;
const ground = new THREE.Mesh(new THREE.PlaneGeometry(R * 2 + 1, R * 2 + 1), mat(T.grassTop.clone()));
ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
ground.material.map.repeat.set(R * 2 + 1, R * 2 + 1);
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
scene.add(ground);
for (let i = -R; i <= R; i++) for (const [x, z] of [[i, -R - 1], [i, R + 1], [-R - 1, i], [R + 1, i]]) { put('grass', MAT.grass, x, -1, z, false); put('grass', MAT.grass, x, 0, z); }
// 平鋪在地面上的路面
const tiles = new Map();
function tile(name, m, x, z) { if (!tiles.has(name)) tiles.set(name, { m, list: [] }); tiles.get(name).list.push(x, z); }
function flushTiles() {
  const geo = new THREE.PlaneGeometry(1, 1); geo.rotateX(-Math.PI / 2);
  const m4 = new THREE.Matrix4();
  for (const [, { m, list }] of tiles) {
    const n = list.length / 2, mesh = new THREE.InstancedMesh(geo, m, n);
    for (let i = 0; i < n; i++) { m4.makeTranslation(list[i * 2], .02, list[i * 2 + 1]); mesh.setMatrixAt(i, m4); }
    mesh.receiveShadow = true; scene.add(mesh);
  }
}

// ---------- 文字材質（招牌、名牌） ----------
function textCanvas(lines, { w = 512, h = 192, bg = '#3b2a1a', fg = '#fff', border = '#1d140c', sizes = [72, 34] } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  if (bg) { g.fillStyle = border; g.fillRect(0, 0, w, h); g.fillStyle = bg; g.fillRect(10, 10, w - 20, h - 20); }
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = fg;
  const total = lines.reduce((a, _, i) => a + sizes[i] * 1.15, 0);
  let y = h / 2 - total / 2;
  lines.forEach((t, i) => { const sz = sizes[i] || 30; g.font = `${i ? 700 : 900} ${sz}px "Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif`; y += sz * .575; g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowOffsetX = g.shadowOffsetY = 4; g.fillText(t, w / 2, y); y += sz * .575; });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// ---------- 建築 ----------
const doors = [];  // { s, pos: Vector3, normal: Vector3, ready }
const spinners = [], portals = [];
function building(s, cx, cz) {
  const color = COLORS[s.ready ? s.id : 'soon'];
  const dx = -cx, dz = -cz;
  const F = Math.abs(dx) > Math.abs(dz) ? [Math.sign(dx), 0] : [0, Math.sign(dz)];   // 門朝向廣場
  const Rt = [F[1], -F[0]];
  const W = ([lx, lz]) => [cx + lx * Rt[0] + lz * F[0], cz + lx * Rt[1] + lz * F[1]];
  const HW = 4, HD = 3, H = s.ready ? 5 : 2;
  for (let lx = -HW; lx <= HW; lx++) for (let lz = -HD; lz <= HD; lz++) {
    const [x, z] = W([lx, lz]);
    const edge = Math.abs(lx) === HW || Math.abs(lz) === HD, corner = Math.abs(lx) === HW && Math.abs(lz) === HD;
    put('stone', MAT.stone, x, -1, z, false); tile('planks', MAT.planks, x, z);
    if (!edge) { occupied.add(x + ',' + z); solid.add(x + ',' + z); continue; }
    for (let y = 0; y < H; y++) {
      const door = lz === HD && Math.abs(lx) <= 1 && y < 3;
      if (door) continue;
      if (corner) { put('log', MAT.log, x, y, z); continue; }
      const win = s.ready && y === 2 && ((Math.abs(lx) === 3 && Math.abs(lz) === HD) || (Math.abs(lz) === 1 && Math.abs(lx) === HW));
      if (win) put('glass', MAT.glass, x, y, z);
      else if (y === 0) put('brick', MAT.brick, x, y, z);
      else if (y === H - 1 && s.ready) put('st' + color, stripeMat(color), x, y, z);
      else put('w' + color, wallMat(color), x, y, z);
    }
  }
  // 內部的人物不能進去（只有門口可以走）
  for (let lx = -HW + 1; lx <= HW - 1; lx++) for (let lz = -HD + 1; lz <= HD - 1; lz++) { const [x, z] = W([lx, lz]); solid.add(x + ',' + z); }
  if (s.ready) {
    // 階梯式屋頂
    for (let k = 0; k <= 3; k++) for (let lx = -HW - 1 + k; lx <= HW + 1 - k; lx++) for (let lz = -HD - 1 + k; lz <= HD + 1 - k; lz++) {
      const ring = Math.abs(lx) === HW + 1 - k || Math.abs(lz) === HD + 1 - k;
      if (k < 3 && !ring && k > 0) continue;   // 每一層只鋪外圈，最上層鋪滿
      const [x, z] = W([lx, lz]); put('roof', MAT.planks, x, H + k, z, false);
    }
    // 門框上方
    for (let lx = -2; lx <= 2; lx++) { const [x, z] = W([lx, HD + 1]); put('log', MAT.log, x, 3, z, false); }
    for (const lx of [-2, 2]) for (let y = 0; y < 3; y++) { const [x, z] = W([lx, HD + 1]); put('log', MAT.log, x, y, z); }
  } else {
    // 施工中：鷹架
    for (const [lx, lz] of [[-HW - 1, -HD - 1], [HW + 1, -HD - 1], [-HW - 1, HD + 1], [HW + 1, HD + 1]]) for (let y = 0; y < 5; y++) { const [x, z] = W([lx, lz]); put('log', MAT.log, x, y, z); }
    for (let lx = -HW - 1; lx <= HW + 1; lx++) { for (const lz of [-HD - 1, HD + 1]) { const [x, z] = W([lx, lz]); put('roof', MAT.planks, x, 4, z, false); } }
  }
  // 地基前的門廊
  const [px, pz] = W([0, HD + 1]);
  const yaw = Math.atan2(F[0], F[1]);
  const [dx0, dz0] = W([0, HD]), doorPos = new THREE.Vector3(dx0, 0, dz0);
  // 招牌
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.7), new THREE.MeshBasicMaterial({ map: textCanvas(s.ready ? [s.name + '館', s.en] : [s.name + '館', '整理中．敬請期待'], { bg: s.ready ? darken(color, .35) : '#5a5a5a', border: '#111' }) }));
  const sp = W([0, HD + 1.02]); sign.position.set(sp[0], s.ready ? 4.15 : 3.1, sp[1]); sign.rotation.y = yaw;
  scene.add(sign);
  if (s.ready) {
    // 傳送門（發光、會閃爍）
    const ptex = pixTex((g, sz) => { for (let y = 0; y < sz; y++) for (let x = 0; x < sz; x++) { const v = Math.sin((x + y * .6) * .9) * .5 + .5; g.fillStyle = '#' + hex(color).lerp(new THREE.Color('#ffffff'), .25 + v * .5 * rnd() + .1).getHexString(); g.fillRect(x, y, 1, 1); } });
    ptex.wrapS = ptex.wrapT = THREE.RepeatWrapping; ptex.repeat.set(1.5, 1.5);
    const pm = new THREE.MeshBasicMaterial({ map: ptex, transparent: true, opacity: .8, side: THREE.DoubleSide });
    const portal = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), pm);
    const pp = W([0, HD - .45]); portal.position.set(pp[0], 1.5, pp[1]); portal.rotation.y = yaw;
    scene.add(portal); portals.push(portal);
    const glow = new THREE.PointLight(lighten(color, .3), 6, 6, 2); glow.position.set(pp[0], 1.5, pp[1]); scene.add(glow);
    // 屋頂上旋轉的科目方塊
    const mk = textCanvas([s.mark], { w: 128, h: 128, bg: color, border: darken(color, .5), sizes: [80] });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), new THREE.MeshLambertMaterial({ map: mk, emissive: hex(color), emissiveIntensity: .25 }));
    cube.position.set(cx, H + 6, cz); cube.castShadow = true; scene.add(cube); spinners.push(cube);
  }
  const n = new THREE.Vector3(F[0], 0, F[1]);
  doors.push({ s, color, pos: doorPos, normal: n, front: new THREE.Vector3(px, 0, pz), ready: s.ready, yaw });
  return { front: [px + F[0] * 1, pz + F[1] * 1] };
}

// ---------- 場景配置 ----------
function pathLine(x0, z0, x1, z1, w = 1) {
  const n = Math.ceil(Math.hypot(x1 - x0, z1 - z0) * 2);
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x0 + (x1 - x0) * i / n), z = Math.round(z0 + (z1 - z0) * i / n);
    for (let a = -w; a <= w; a++) for (let b = -w; b <= w; b++) { const k = (x + a) + ',' + (z + b); if (!pathCells.has(k) && !occupied.has(k)) { pathCells.add(k); tile('cobble', MAT.cobble, x + a, z + b); } }
  }
}
// 廣場
for (let x = -7; x <= 7; x++) for (let z = -7; z <= 7; z++) if (x * x + z * z <= 52) { pathCells.add(x + ',' + z); tile('cobble', MAT.cobble, x, z); }
// 中央紀念碑：石柱＋招牌
for (let y = 0; y < 4; y++) put('stone', MAT.stone, 0, y, 0);
put('log', MAT.log, 0, 4, 0, false);
for (const [ry, off] of [[0, [0, .52]], [Math.PI, [0, -.52]], [Math.PI / 2, [.52, 0]], [-Math.PI / 2, [-.52, 0]]]) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.35), new THREE.MeshBasicMaterial({ map: textCanvas(['國中自學筆記', '走進各科的館開始閱讀'], { bg: '#2b3a55', sizes: [62, 30] }) }));
  m.position.set(off[0] * 1, 5.6, off[1] * 1); m.rotation.y = ry; scene.add(m);
}
// 各科館：依首頁的分組順序排成一圈
const order = ['english', 'chinese', 'math', 'biology', 'physchem', 'earth', 'history', 'geography', 'civics'];
const list = order.map(id => SUBJ.find(s => s.id === id)).filter(Boolean).concat(SUBJ.filter(s => !order.includes(s.id)));
const RING = 23;
list.forEach((s, i) => {
  const a = -Math.PI / 2 + i * 2 * Math.PI / list.length;
  const cx = Math.round(Math.cos(a) * RING), cz = Math.round(Math.sin(a) * RING);
  const b = building(s, cx, cz);
  pathLine(Math.cos(a) * 6.5, Math.sin(a) * 6.5, b.front[0], b.front[1], s.ready ? 1 : 0);
});
// 外環步道
for (let i = 0; i < 180; i++) { const a = i / 180 * Math.PI * 2; const x = Math.round(Math.cos(a) * 14.5), z = Math.round(Math.sin(a) * 14.5); const k = x + ',' + z; if (!pathCells.has(k) && !occupied.has(k)) { pathCells.add(k); tile('cobble', MAT.cobble, x, z); } }
// 池塘
const WATER = mat(T.water, { transparent: true, opacity: .9 });
function pond(cx, cz, rx, rz) {
  for (let x = -rx - 1; x <= rx + 1; x++) for (let z = -rz - 1; z <= rz + 1; z++) {
    const d = (x * x) / (rx * rx) + (z * z) / (rz * rz), k = (cx + x) + ',' + (cz + z);
    if (pathCells.has(k) || occupied.has(k)) continue;
    if (d <= 1) { tile('water', WATER, cx + x, cz + z); solid.add(k); occupied.add(k); }
    else if (d <= 1.6) { tile('sand', MAT.sand, cx + x, cz + z); occupied.add(k); }
  }
}
pond(36, -6, 4, 3); pond(-35, 8, 3, 4); pond(9, 36, 4, 2);
// 樹
function tree(x, z) {
  const h = 4 + (rnd() * 2 | 0);
  for (let y = 0; y < h; y++) put('log', MAT.log, x, y, z);
  for (let y = h - 2; y <= h + 1; y++) {
    const r = y >= h ? 1 : 2;
    for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) {
      if (Math.abs(a) === r && Math.abs(b) === r && (y === h + 1 || rnd() < .5)) continue;
      if (a === 0 && b === 0 && y < h) continue;
      put('leaves', MAT.leaves, x + a, y, z + b, false);
    }
  }
}
const clear = (x, z, m) => { for (let a = -m; a <= m; a++) for (let b = -m; b <= m; b++) { const k = (x + a) + ',' + (z + b); if (occupied.has(k) || pathCells.has(k)) return false; } return true; };
for (let i = 0, made = 0; i < 900 && made < 70; i++) {
  const a = rnd() * Math.PI * 2, r = 9 + rnd() * 36, x = Math.round(Math.cos(a) * r), z = Math.round(Math.sin(a) * r);
  if (Math.abs(x) > R - 2 || Math.abs(z) > R - 2) continue;
  if ((r > 17 && r < 30) && rnd() < .6) continue;
  if (clear(x, z, 2)) { tree(x, z); made++; }
}
// 花
const flowerMats = ['#e8483b', '#f2c94c', '#ffffff', '#8e6ad8'].map(c => new THREE.MeshLambertMaterial({ color: c }));
const fgeo = new THREE.BoxGeometry(.25, .3, .25);
for (let i = 0; i < 160; i++) {
  const x = (rnd() - .5) * 88, z = (rnd() - .5) * 88, k = Math.round(x) + ',' + Math.round(z);
  if (occupied.has(k) || pathCells.has(k)) continue;
  const f = new THREE.Mesh(fgeo, flowerMats[i % 4]); f.position.set(x, .15, z); scene.add(f);
}
flushBlocks(); flushTiles();

// 雲
const clouds = [];
const cmat = new THREE.MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: .92 });
for (let i = 0; i < 14; i++) {
  const g = new THREE.Group();
  for (let k = 0; k < 4; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(4 + rnd() * 6, 1.2, 3 + rnd() * 4), cmat); b.position.set(rnd() * 6, 0, rnd() * 4); g.add(b); }
  g.position.set((rnd() - .5) * 160, 34 + rnd() * 6, (rnd() - .5) * 160); scene.add(g); clouds.push(g);
}

// ---------- 角色 ----------
const SW = {
  skin: ['#f6d2b5', '#e9b48a', '#c98d62', '#8d5a3b'],
  hair: ['#2b1d12', '#5a3a1c', '#b7863e', '#d9d9d9', '#c2453b', '#3b5ec9'],
  shirt: ['#3b8fd9', '#e0503c', '#3fae5a', '#f2c94c', '#8e6ad8', '#2b2b2b', '#ffffff'],
  pants: ['#2c3d7a', '#3a3a3a', '#6b4d2c', '#2f6d3a', '#7a2f2f'],
};
let look = store.get('avatar', null) || { name: '', skin: 0, hair: 0, shirt: 0, pants: 0 };

function faceTex(L) {
  return pixTex(g => {
    g.fillStyle = SW.skin[L.skin]; g.fillRect(0, 0, 8, 8);
    g.fillStyle = SW.hair[L.hair]; g.fillRect(0, 0, 8, 2); g.fillRect(0, 2, 1, 1); g.fillRect(7, 2, 1, 1);
    g.fillStyle = '#fff'; g.fillRect(1, 4, 2, 1); g.fillRect(5, 4, 2, 1);
    g.fillStyle = '#3a2a6a'; g.fillRect(2, 4, 1, 1); g.fillRect(5, 4, 1, 1);
    g.fillStyle = darken(SW.skin[L.skin], .35); g.fillRect(3, 6, 2, 1);
  }, 8);
}
function makePlayer(L) {
  const g = new THREE.Group();
  const M = c => new THREE.MeshLambertMaterial({ color: c });
  const skin = M(SW.skin[L.skin]), hair = M(SW.hair[L.hair]), shirt = M(SW.shirt[L.shirt]), pants = M(SW.pants[L.pants]);
  const headMats = [hair, hair, hair, skin, new THREE.MeshLambertMaterial({ map: faceTex(L) }), hair].map((m, i) => i === 0 || i === 1 ? new THREE.MeshLambertMaterial({ map: pixTex(gg => { gg.fillStyle = SW.skin[L.skin]; gg.fillRect(0, 0, 8, 8); gg.fillStyle = SW.hair[L.hair]; gg.fillRect(0, 0, 8, 3); }, 8) }) : m);
  const head = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), headMats); head.position.y = 1.55;
  const body = new THREE.Mesh(new THREE.BoxGeometry(.5, .7, .26), shirt); body.position.y = 1.0;
  const limb = (m, x, y, h) => { const p = new THREE.Group(); p.position.set(x, y, 0); const b = new THREE.Mesh(new THREE.BoxGeometry(.24, h, .24), m); b.position.y = -h / 2; p.add(b); b.castShadow = true; return p; };
  const armL = limb(shirt, -.37, 1.33, .7), armR = limb(shirt, .37, 1.33, .7);
  [armL, armR].forEach(a => { const hand = new THREE.Mesh(new THREE.BoxGeometry(.24, .16, .24), skin); hand.position.y = -.62; a.add(hand); });
  const legL = limb(pants, -.13, .65, .65), legR = limb(pants, .13, .65, .65);
  [head, body].forEach(m => { m.castShadow = true; });
  g.add(head, body, armL, armR, legL, legR);
  g.userData = { armL, armR, legL, legR, head };
  return g;
}
function nameSprite(name) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d');
  x.font = '700 34px "Noto Sans TC",sans-serif'; const w = Math.min(250, x.measureText(name).width + 24);
  x.fillStyle = 'rgba(0,0,0,.45)'; x.fillRect((256 - w) / 2, 8, w, 48); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(name, 128, 33);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false })); s.scale.set(2, .5, 1); s.position.y = 2.15; s.renderOrder = 10;
  return s;
}
let player = null;
function spawnPlayer() {
  const old = player && { p: player.position.clone(), r: player.rotation.y };
  if (player) scene.remove(player);
  player = makePlayer(look);
  if (look.name) player.add(nameSprite(look.name));
  if (old) { player.position.copy(old.p); player.rotation.y = old.r; } else { player.position.set(0, 0, 4.5); player.rotation.y = Math.PI; }
  scene.add(player);
}

// ---------- 角色建立畫面 ----------
const av = $('avatar'), avr = new THREE.WebGLRenderer({ canvas: av, alpha: true, antialias: true });
avr.setPixelRatio(Math.min(devicePixelRatio, 2));
const avScene = new THREE.Scene(), avCam = new THREE.PerspectiveCamera(30, 3 / 4, .1, 20);
avCam.position.set(0, 1.25, 4.4); avCam.lookAt(0, 1.0, 0);
avScene.add(new THREE.HemisphereLight('#ffffff', '#666666', 1.6)); const avL = new THREE.DirectionalLight('#ffffff', 1.2); avL.position.set(2, 3, 4); avScene.add(avL);
let avModel = null;
function refreshAvatar() { if (avModel) avScene.remove(avModel); avModel = makePlayer(look); avScene.add(avModel); }
document.querySelectorAll('.sw').forEach(box => {
  const k = box.dataset.k;
  box.innerHTML = SW[k].map((c, i) => `<button style="background:${c}" data-i="${i}" aria-label="${k} ${i + 1}" aria-pressed="${look[k] === i}"></button>`).join('');
  box.onclick = e => { const b = e.target.closest('button'); if (!b) return; look[k] = +b.dataset.i; box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); refreshAvatar(); };
});
$('nm').value = look.name || '';
$('rand').onclick = () => { for (const k of Object.keys(SW)) look[k] = rnd() * SW[k].length | 0; document.querySelectorAll('.sw').forEach(box => box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', +x.dataset.i === look[box.dataset.k]))); refreshAvatar(); };
let playing = false;
$('play').onclick = () => {
  look.name = $('nm').value.trim().slice(0, 10);
  store.set('avatar', look);
  spawnPlayer();
  $('start').hidden = true; playing = true;
  if (touch) { $('stick').hidden = false; $('tbtns').hidden = false; }
};
$('reskin').onclick = () => { playing = false; $('start').hidden = false; refreshAvatar(); $('play').textContent = '回到校園'; };
refreshAvatar();

// ---------- 傳送清單、小地圖 ----------
$('warpList').innerHTML = doors.map((d, i) => `<button class="mcbtn" data-i="${i}"><i style="background:${d.color}"></i>${d.s.name}${d.ready ? '' : '（整理中）'}</button>`).join('');
$('warpList').onclick = e => {
  const b = e.target.closest('button'); if (!b || !player) return;
  const d = doors[+b.dataset.i];
  player.position.set(d.front.x + d.normal.x * 1.2, 0, d.front.z + d.normal.z * 1.2);
  player.rotation.y = d.yaw + Math.PI; camYaw = d.yaw;
};
if (innerWidth < 640) $('warp').open = false;
$('warpList').addEventListener('click', () => { if (innerWidth < 640) $('warp').open = false; });
const mini = $('mini').querySelector('canvas'), mg = mini.getContext('2d');
function drawMini() {
  const S = mini.width, k = S / (R * 2 + 4);
  mg.fillStyle = '#5e9e3c'; mg.fillRect(0, 0, S, S);
  mg.fillStyle = '#9a9a9a';
  for (const c of pathCells) { const [x, z] = c.split(',').map(Number); mg.fillRect((x + R + 2) * k, (z + R + 2) * k, k + .5, k + .5); }
  for (const d of doors) {
    const x = (d.pos.x - d.normal.x * 3 + R + 2) * k, z = (d.pos.z - d.normal.z * 3 + R + 2) * k;
    mg.fillStyle = d.color; mg.fillRect(x - 4.5 * k, z - 4.5 * k, 9 * k, 9 * k);
    mg.fillStyle = '#fff'; mg.font = `700 ${Math.round(S / 14)}px "Noto Sans TC",sans-serif`; mg.textAlign = 'center'; mg.textBaseline = 'middle'; mg.fillText(d.s.name, x, z);
  }
  if (player) {
    const x = (player.position.x + R + 2) * k, z = (player.position.z + R + 2) * k, r = player.rotation.y;
    mg.save(); mg.translate(x, z); mg.rotate(-r); mg.fillStyle = '#ffe36b'; mg.strokeStyle = '#000'; mg.lineWidth = 2;
    mg.beginPath(); mg.moveTo(0, 9); mg.lineTo(6, -6); mg.lineTo(0, -2); mg.lineTo(-6, -6); mg.closePath(); mg.fill(); mg.stroke(); mg.restore();
  }
}

// ---------- 操作 ----------
const keys = new Set();
addEventListener('keydown', e => {
  if (!playing || e.target.tagName === 'INPUT') return;
  keys.add(e.code);
  if (e.code === 'KeyE' && near) enter(near);
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => keys.clear());
let camYaw = 0, camPitch = .38, camDist = 8;
// 拖曳轉視角（滑鼠或右半邊觸控）
let drag = null;
canvas.addEventListener('pointerdown', e => { if (!playing) return; drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => {
  if (!drag || drag.id !== e.pointerId) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
  camYaw -= dx * .006; camPitch = Math.min(1.2, Math.max(.08, camPitch + dy * .004));
});
canvas.addEventListener('pointerup', e => {
  if (drag && drag.moved < 6) clickBuilding(e);
  drag = null;
});
canvas.addEventListener('wheel', e => { camDist = Math.min(16, Math.max(3.5, camDist + e.deltaY * .01)); e.preventDefault(); }, { passive: false });
// 點擊建築：走到門口
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function clickBuilding(e) {
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(scene.children, true)[0];
  if (!hit) return;
  const p = hit.point; let best = null, bd = 9;
  for (const d of doors) { const dd = Math.hypot(p.x - (d.pos.x - d.normal.x * 3), p.z - (d.pos.z - d.normal.z * 3)); if (dd < bd) { bd = dd; best = d; } }
  if (best) target = best;
}
let target = null;
// 搖桿
const stick = $('stick'), knob = stick.querySelector('i');
let joy = { x: 0, y: 0, id: null };
stick.addEventListener('pointerdown', e => { joy.id = e.pointerId; stick.setPointerCapture(e.pointerId); moveJoy(e); });
stick.addEventListener('pointermove', e => { if (joy.id === e.pointerId) moveJoy(e); });
const endJoy = () => { joy = { x: 0, y: 0, id: null }; knob.style.transform = ''; };
stick.addEventListener('pointerup', endJoy); stick.addEventListener('pointercancel', endJoy);
function moveJoy(e) {
  const r = stick.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  let dx = (e.clientX - cx) / (r.width / 2), dy = (e.clientY - cy) / (r.height / 2); const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
  joy.x = dx; joy.y = dy; knob.style.transform = `translate(${dx * 36}px,${dy * 36}px)`;
}
let jumpReq = false;
$('tjump').onclick = () => { jumpReq = true; };

// ---------- 進入科目 ----------
let near = null, leaving = false;
const prompt = $('prompt');
$('pgo').onclick = () => near && enter(near);
function enter(d) {
  if (!d.ready || leaving) return;
  leaving = true;
  store.set('last', { id: d.s.id, hash: '', title: d.s.name + '館' });
  $('fade').style.opacity = 1;
  setTimeout(() => { location.href = `../${d.s.id}/`; }, 480);
}
addEventListener('pageshow', () => { leaving = false; $('fade').style.opacity = 0; });

// ---------- 移動與碰撞 ----------
const PR = .3;
function blocked(x, z) {
  for (let a = Math.round(x - PR); a <= Math.round(x + PR); a++) for (let b = Math.round(z - PR); b <= Math.round(z + PR); b++) {
    if (!solid.has(a + ',' + b)) continue;
    if (Math.abs(x - a) < .5 + PR && Math.abs(z - b) < .5 + PR) return true;
  }
  return Math.abs(x) > R || Math.abs(z) > R;
}
let vy = 0, py = 0, walkT = 0;
const tmp = new THREE.Vector3();
function update(dt, t) {
  for (const s of spinners) { s.rotation.y += dt * .8; s.position.y += Math.sin(t * 2 + s.position.x) * .004; }
  for (const p of portals) { p.material.opacity = .65 + Math.sin(t * 3 + p.position.x) * .15; p.material.map.offset.y -= dt * .35; p.material.map.offset.x = Math.sin(t * .7 + p.position.z) * .2; }
  for (const c of clouds) { c.position.x += dt * 1.2; if (c.position.x > 90) c.position.x = -90; }
  if (!player || !playing) return;
  // 輸入
  let fx = 0, fz = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) fz += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) fz -= 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) fx -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) fx += 1;
  if (joy.id !== null) { fx += joy.x; fz -= joy.y; }
  if (fx || fz) target = null;
  let mx = 0, mz = 0;
  if (target) {
    const goal = tmp.set(target.front.x + target.normal.x * .2, 0, target.front.z + target.normal.z * .2);
    const dx = goal.x - player.position.x, dz = goal.z - player.position.z, l = Math.hypot(dx, dz);
    if (l < .4) target = null; else { mx = dx / l; mz = dz / l; }
  } else if (fx || fz) {
    const l = Math.min(1, Math.hypot(fx, fz)), a = Math.atan2(fx, fz);
    const dir = camYaw + Math.PI - a;   // 鏡頭在角色後方：前進＝背對鏡頭
    mx = Math.sin(dir) * l; mz = Math.cos(dir) * l;
  }
  const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 7.5 : 4.6) * dt;
  const moving = Math.hypot(mx, mz) > .05;
  if (moving) {
    const nx = player.position.x + mx * speed, nz = player.position.z + mz * speed;
    if (!blocked(nx, player.position.z)) player.position.x = nx;
    if (!blocked(player.position.x, nz)) player.position.z = nz;
    const want = Math.atan2(mx, mz);
    let d = want - player.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
    player.rotation.y += d * Math.min(1, dt * 12);
    walkT += dt * (speed / dt) * 1.6;
  } else walkT *= .9;
  // 跳躍
  if ((keys.has('Space') || jumpReq) && py === 0) vy = 7;
  jumpReq = false;
  vy -= 22 * dt; py = Math.max(0, py + vy * dt); if (py === 0) vy = Math.max(0, vy);
  player.position.y = py;
  const u = player.userData, sw = Math.sin(walkT) * (moving ? .7 : 0);
  u.armL.rotation.x = sw; u.armR.rotation.x = -sw; u.legL.rotation.x = -sw; u.legR.rotation.x = sw;
  // 門口偵測
  near = null; let nd = 3.2;
  for (const d of doors) {
    const dx = player.position.x - d.pos.x, dz = player.position.z - d.pos.z;
    const along = dx * d.normal.x + dz * d.normal.z, side = Math.abs(dx * d.normal.z - dz * d.normal.x);
    const dist = Math.hypot(dx, dz);
    if (dist < nd && along > -1.2) { nd = dist; near = d; }
    if (d.ready && along < .35 && along > -1.2 && side < 1.6) enter(d);
  }
  if (near) {
    prompt.hidden = false;
    $('pn').textContent = near.s.name + '館';
    $('pd').textContent = near.ready ? near.s.desc || '' : '這一科還在整理中，敬請期待！';
    $('pgo').hidden = !near.ready;
  } else prompt.hidden = true;
}

// ---------- 鏡頭 ----------
function updateCamera() {
  const p = player ? player.position : tmp.set(0, 0, 0);
  const tx = p.x, ty = (player ? p.y : 0) + 1.6, tz = p.z;
  camera.position.set(tx + Math.sin(camYaw) * Math.cos(camPitch) * camDist, ty + Math.sin(camPitch) * camDist, tz + Math.cos(camYaw) * Math.cos(camPitch) * camDist);
  camera.position.y = Math.max(.6, camera.position.y);
  camera.lookAt(tx, ty, tz);
}

// ---------- 主迴圈 ----------
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  const r = av.getBoundingClientRect(); avr.setSize(r.width || 150, r.height || 200, false);
}
addEventListener('resize', resize); resize();
const clock = new THREE.Clock();
let miniT = 0;
function loop() {
  const dt = Math.min(.05, clock.getDelta()), t = clock.elapsedTime;
  update(dt, t);
  if (!playing) { camYaw += dt * .12; camPitch = .45; camDist = 34; }
  else camDist = Math.min(camDist, 16);
  updateCamera();
  renderer.render(scene, camera);
  if (!$('start').hidden && avModel) { avModel.rotation.y = Math.sin(t * .8) * .6; avr.render(avScene, avCam); }
  if ((miniT += dt) > .1) { miniT = 0; drawMini(); }
  requestAnimationFrame(loop);
}
// 開場鏡頭：從高處環繞
$('play').addEventListener('click', () => { camDist = 8; camPitch = .38; camYaw = player ? player.rotation.y + Math.PI : 0; }, { capture: true });
loop();
