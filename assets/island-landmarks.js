// 學習島的地標：每個單元（英語為每個類別）一個代表物件
// 每個 build(k) 在原點附近、直徑約 2.6 的範圍內畫出物件；k 是 island.js 傳入的繪圖工具
export const LANDMARKS = {
  biology: [
    { n: 1, short: '顯微鏡', build: k => { const { g, box, cyl, PAL } = k;
      g.add(box(1.2, .2, .9, PAL.dark, 0, 0, 0)); g.add(box(.25, 1.4, .25, PAL.dark, -.35, .2, -.2));
      g.add(box(.9, .08, .7, PAL.stoneD, .1, .7, 0)); const tube = cyl(.16, .2, 1.1, PAL.white, 0, 0, 0, 10); tube.position.set(0, 1.55, -.05); tube.rotation.z = -.35; g.add(tube);
      g.add(cyl(.09, .09, .3, PAL.dark, .2, 2.05, -.05, 8)); g.add(box(.5, .02, .3, '#cde9f0', .1, .79, 0)); } },
    { n: 2, short: '光合作用', build: k => { const { g, cyl, ball, PAL, M, THREE, A } = k;
      g.add(cyl(.45, .35, .6, '#c9835a', 0, 0, 0, 10)); g.add(cyl(.06, .08, 1.2, PAL.leafD, 0, .6, 0, 6));
      for (const [x, y, r] of [[-.45, 1.25, .5], [.45, 1.5, -.5], [0, 1.85, 0]]) { const l = ball(.38, PAL.leaf, x, y, 0, 0); l.scale.set(1, .35, .7); l.rotation.z = r; g.add(l); }
      const sun = ball(.35, PAL.yellow, .9, 2.3, 0, 1); sun.material = M('#ffd34d', { emissive: '#ffb300', emissiveIntensity: .45 }); g.add(sun);
      A(t => { sun.rotation.y = t; }); g.add(ball(.25, PAL.red, -.75, .25, .5, 1)); } },
    { n: 3, short: '心臟', build: k => { const { g, ball, cone, cyl, PAL, A } = k;
      const h = new k.THREE.Group(); h.position.y = 1.2; g.add(h);
      h.add(ball(.5, PAL.red, -.33, .3, 0, 1)); h.add(ball(.5, PAL.red, .33, .3, 0, 1)); const c = cone(.78, 1.1, PAL.red, 0, -.95, 0, 12); c.rotation.x = Math.PI; c.position.y = -.25; h.add(c);
      g.add(cyl(.1, .1, .9, '#5b8fd1', -.25, 1.4, -.1, 8)); g.add(cyl(.1, .1, .8, '#e05a47', .2, 1.5, -.1, 8));
      A(t => { const s = 1 + Math.max(0, Math.sin(t * 5)) * .08; h.scale.setScalar(s); }); } },
    { n: 4, short: '神經與大腦', build: k => { const { g, ball, cyl, PAL } = k;
      const br = ball(.75, PAL.pink, -.18, 1.55, 0, 1); br.scale.set(1, .75, .85); g.add(br); const br2 = ball(.75, '#eb95a6', .18, 1.55, 0, 1); br2.scale.set(1, .75, .85); g.add(br2);
      g.add(cyl(.14, .16, 1, '#f3c0c9', 0, .2, 0, 8));
      for (const a of [-1, 1]) for (const y of [.5, .9]) { const n = cyl(.03, .03, .8, PAL.yellow, a * .4, y, 0, 4); n.rotation.z = a * 1.1; g.add(n); } } },
    { n: 5, short: '體溫恆定', build: k => { const { g, cyl, ball, box, PAL } = k;
      g.add(box(.9, .2, .5, PAL.stoneD, 0, 0, 0)); g.add(cyl(.2, .2, 2, PAL.white, 0, .45, 0, 10)); g.add(ball(.33, PAL.red, 0, .45, 0, 1));
      g.add(cyl(.1, .1, 1.1, PAL.red, 0, .6, .02, 8)); for (let i = 0; i < 5; i++) g.add(box(.12, .03, .03, PAL.dark, .2, .8 + i * .3, .14)); } },
    { n: 6, short: '生殖', build: k => { const { g, ball, PAL, THREE, mesh } = k;
      g.add(mesh(new THREE.TorusGeometry(.7, .28, 6, 12), '#a97c50', 0, .35, 0)).rotation.x = 0; g.children[g.children.length - 1].rotation.x = Math.PI / 2;
      for (const [x, z] of [[-.2, -.1], [.25, .05], [0, .3]]) { const e = ball(.26, PAL.white, x, .5, z, 1); e.scale.y = 1.3; g.add(e); }
      const f = new THREE.Group(); f.position.set(.9, 0, -.6); g.add(f); f.add(k.cyl(.04, .05, 1.2, PAL.leafD, 0, 0, 0, 5)); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; f.add(ball(.16, PAL.pink, Math.cos(a) * .2, 1.25, Math.sin(a) * .2, 0)); } f.add(ball(.12, PAL.yellow, 0, 1.28, 0, 0)); } },
    { n: 7, short: 'DNA 遺傳', build: k => { const { g, ball, box, cyl, PAL, A, THREE } = k;
      const d = new THREE.Group(); d.position.y = .3; g.add(d); g.add(cyl(.55, .65, .25, PAL.stoneD, 0, 0, 0, 10));
      for (let i = 0; i < 12; i++) { const a = i * .6, y = i * .22; d.add(ball(.12, PAL.red, Math.cos(a) * .5, y, Math.sin(a) * .5, 0)); d.add(ball(.12, PAL.blue, -Math.cos(a) * .5, y, -Math.sin(a) * .5, 0));
        if (i % 2 === 0) { const r = box(1, .05, .05, PAL.white, 0, y - .025, 0); r.rotation.y = -a; d.add(r); } }
      A(t => { d.rotation.y = t * .6; }); } },
    { n: 8, short: '生物分類', build: k => { const { g, cyl, ball, cone, box, PAL, THREE, mesh } = k;
      g.add(cyl(.09, .12, .5, PAL.white, -.6, 0, .2, 6)); g.add(mesh(new THREE.SphereGeometry(.35, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), PAL.red, -.6, .5, .2));
      g.add(cone(.35, .9, PAL.leafD, .55, 0, .3, 6)); g.add(cone(.25, .7, PAL.leaf, .55, .5, .3, 6));
      const fish = ball(.32, PAL.yellow, 0, .9, -.5, 0); fish.scale.set(1.4, .8, .6); g.add(fish); const tail = cone(.2, .35, PAL.yellow, -.55, .75, -.5, 4); tail.rotation.z = Math.PI / 2; g.add(tail);
      g.add(cyl(.04, .04, .6, PAL.dark, 0, .2, -.5, 4)); } },
    { n: 9, short: '食物鏈', build: k => { const { g, box, ball, PAL } = k;
      g.add(box(2.2, .4, 2.2, PAL.leaf, 0, 0, 0)); g.add(box(1.6, .4, 1.6, PAL.yellow, 0, .4, 0)); g.add(box(1, .4, 1, '#f39b5b', 0, .8, 0)); g.add(box(.5, .4, .5, PAL.red, 0, 1.2, 0));
      g.add(ball(.15, PAL.leafD, .8, .55, .8, 0)); } },
  ],
  earth: [
    { n: 1, short: '河流與地層', build: k => { const { g, box, PAL, mesh, THREE } = k;
      ['#d9b98c', '#b98f62', '#e7d2a8', '#9a7a5a'].forEach((c, i) => { g.add(box(1.1, .35, 2, c, -.75, i * .35, 0)); g.add(box(1.1, .35, 2, c, .75, i * .35, 0)); });
      g.add(box(.4, .12, 2.1, '#6cb0d9', 0, 0, 0)); g.add(mesh(new THREE.DodecahedronGeometry(.25, 0), PAL.stoneD, 0, .25, .5)); } },
    { n: 2, short: '火山與板塊', build: k => { const { g, cyl, ball, PAL, A, THREE } = k;
      g.add(cyl(.45, 1.3, 1.8, '#a9876a', 0, 0, 0, 9)); g.add(cyl(.38, .45, .1, PAL.lava, 0, 1.78, 0, 9));
      for (let i = 0; i < 3; i++) { const sm = ball(.25, '#f4f2ee', 0, 0, 0, 0); sm.material = new THREE.MeshStandardMaterial({ color: '#f4f2ee', transparent: true, opacity: .8, flatShading: true }); g.add(sm);
        A(t => { const p = (t * .35 + i / 3) % 1; sm.position.set(Math.sin(p * 5 + i) * .2, 2 + p * 1.6, Math.cos(p * 4) * .2); sm.scale.setScalar(.6 + p * 1.3); sm.material.opacity = .85 * (1 - p); }); } } },
    { n: 3, short: '天文台', build: k => { const { g, cyl, ball, PAL, mesh, THREE, A } = k;
      g.add(cyl(.75, .75, .9, PAL.white, 0, 0, 0, 14)); g.add(mesh(new THREE.SphereGeometry(.75, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), '#cfd7e3', 0, .9, 0));
      const sc = cyl(.1, .13, .9, PAL.dark, .25, 1.25, 0, 8); sc.rotation.z = -.8; g.add(sc);
      const orb = new THREE.Group(); orb.position.y = 2.4; g.add(orb); orb.add(ball(.25, '#eeeeee', .9, 0, 0, 1)); orb.add(mesh(new THREE.TorusGeometry(.9, .02, 4, 32), PAL.white, 0, 0, 0)); orb.children[1].rotation.x = Math.PI / 2;
      A(t => { orb.rotation.y = t * .5; }); } },
    { n: 4, short: '氣象站', build: k => { const { g, cyl, ball, box, PAL, A, THREE } = k;
      g.add(cyl(.05, .06, 2, PAL.white, -.4, 0, 0, 6)); const cups = new THREE.Group(); cups.position.set(-.4, 2, 0); g.add(cups);
      for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; const arm = box(.5, .03, .03, PAL.dark, Math.cos(a) * .25, 0, Math.sin(a) * .25); arm.rotation.y = -a; cups.add(arm); cups.add(ball(.09, PAL.red, Math.cos(a) * .5, 0, Math.sin(a) * .5, 0)); }
      A(t => { cups.rotation.y = t * 3; });
      const cl = new THREE.Group(); cl.position.set(.5, 1.8, 0); g.add(cl); for (const [x, r] of [[-.3, .3], [0, .4], [.3, .3]]) cl.add(ball(r, PAL.white, x, 0, 0, 1));
      for (let i = 0; i < 4; i++) { const d = ball(.05, '#6cb0d9', 0, 0, 0, 0); cl.add(d); A(t => { const p = (t * .8 + i / 4) % 1; d.position.set(-.3 + i * .2, -.3 - p * 1.2, 0); }); } } },
    { n: 5, short: '全球變遷', build: k => { const { g, ball, cyl, box, PAL, A, THREE, M } = k;
      const gl = ball(.65, '#6cb0d9', 0, 1.3, 0, 1); g.add(gl); const cap = ball(.4, PAL.white, 0, 1.75, 0, 0); cap.scale.y = .45; g.add(cap);
      g.add(ball(.3, PAL.leaf, .35, 1.3, .45, 0)); g.add(cyl(.06, .35, .6, PAL.woodD, 0, 0, 0, 8));
      const wm = new THREE.Group(); wm.position.set(1, 0, -.4); g.add(wm); wm.add(cyl(.04, .07, 2, PAL.white, 0, 0, 0, 6));
      const hub = new THREE.Group(); hub.position.set(0, 2, .1); wm.add(hub); for (let i = 0; i < 3; i++) { const p = new THREE.Group(); p.rotation.z = i * 2.094; const b = box(.08, .8, .03, PAL.white, 0, 0, 0); b.position.y = .4; p.add(b); hub.add(p); }
      A(t => { hub.rotation.z = t * 2.2; gl.rotation.y = t * .3; }); } },
  ],
  history: [
    { n: 1, short: '石板棺與玉器', build: k => { const { g, box, mesh, THREE, PAL } = k;
      g.add(box(1.8, .5, .9, PAL.stoneD, 0, 0, 0)); const lid = box(1.9, .15, 1, '#a9a196', 0, .5, 0); lid.rotation.y = .15; g.add(lid);
      const jade = mesh(new THREE.TorusGeometry(.32, .1, 6, 14), '#6fbf8f', .6, 1.05, .2); jade.rotation.y = .5; g.add(jade);
      g.add(mesh(new THREE.ConeGeometry(.12, .45, 4), PAL.stoneD, -.6, .9, .3)); } },
    { n: 2, short: '熱蘭遮城', build: k => { const { g, box, cyl, PAL } = k;
      g.add(box(1.8, .7, 1.8, '#c46a4a', 0, 0, 0)); g.add(box(1.2, .9, 1.2, '#d47f5c', 0, .7, 0));
      for (const [x, z] of [[-.9, -.9], [.9, -.9], [-.9, .9], [.9, .9]]) g.add(box(.45, .9, .45, '#b65a3c', x, 0, z));
      g.add(cyl(.02, .02, .9, PAL.dark, 0, 1.6, 0, 4)); g.add(box(.5, .1, .02, '#e05a47', .25, 2.3, 0)); g.add(box(.5, .1, .02, '#fff', .25, 2.2, 0)); g.add(box(.5, .1, .02, '#3d6fb6', .25, 2.1, 0)); } },
    { n: 3, short: '清代廟宇', build: k => { const { g, box, cyl, prism, PAL, ball } = k;
      g.add(box(2, .25, 1.4, PAL.stone, 0, 0, 0)); g.add(box(1.6, 1, 1.1, '#c0392b', 0, .25, 0));
      g.add(prism(2.2, .6, 1.5, '#3a4a5a', 0, 1.25, 0)); g.add(box(2.4, .08, 1.6, '#3a4a5a', 0, 1.22, 0));
      for (const x of [-.95, .95]) { g.add(cyl(.02, .02, .3, PAL.dark, x, 1.0, .7, 4)); g.add(ball(.13, PAL.red, x, .95, .7, 0)); }
      g.add(box(.5, .6, .05, PAL.woodD, 0, .25, .56)); } },
    { n: 4, short: '縱貫鐵路', build: k => { const { g, box, cyl, PAL } = k;
      g.add(box(2.4, .05, .7, PAL.woodD, 0, 0, 0)); for (const z of [-.2, .2]) g.add(box(2.4, .05, .05, PAL.dark, 0, .05, z));
      const b = cyl(.32, .32, 1.3, PAL.dark, 0, 0, 0, 10); b.rotation.z = Math.PI / 2; b.position.set(-.2, .55, 0); g.add(b);
      g.add(box(.6, .75, .6, '#2b2b2b', .65, .25, 0)); g.add(box(.7, .08, .7, '#c0392b', .65, 1, 0)); g.add(cyl(.09, .12, .45, PAL.dark, -.6, .8, 0, 8));
      for (const x of [-.6, -.1, .5]) for (const z of [-.3, .3]) { const w = cyl(.18, .18, .06, '#c0392b', x, 0, z, 10); w.rotation.x = Math.PI / 2; w.position.y = .22; g.add(w); } } },
    { n: 5, short: '當代臺灣', build: k => { const { g, box, cyl, PAL } = k;
      g.add(box(.8, .3, .8, PAL.stone, 0, 0, 0));
      for (let i = 0; i < 8; i++) { g.add(box(.5 + (i % 2) * .08, .32, .5 + (i % 2) * .08, i % 2 ? '#7fc3b6' : '#a9d8cf', 0, .3 + i * .32, 0)); }
      g.add(cyl(.03, .05, .8, PAL.dark, 0, 2.86, 0, 6)); } },
    { n: 6, short: '青銅鼎', build: k => { const { g, cyl, box, mesh, THREE } = k;
      const br = '#7a9a7a'; g.add(mesh(new THREE.CylinderGeometry(.75, .6, .7, 12), br, 0, 1.05, 0));
      for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; g.add(cyl(.08, .1, .75, br, Math.cos(a) * .45, 0, Math.sin(a) * .45, 6)); }
      for (const x of [-.55, .55]) { const e = mesh(new THREE.TorusGeometry(.17, .05, 4, 8, Math.PI), br, x, 1.45, 0); g.add(e); } } },
    { n: 7, short: '鄭和寶船', build: k => { const { g, box, cyl, prism, PAL } = k;
      g.add(box(2.2, .45, .8, '#8a5a3a', 0, 0, 0)); g.add(box(.5, .3, .8, '#8a5a3a', -1, .45, 0));
      for (const [x, h] of [[-.4, 1.6], [.4, 1.9]]) { g.add(cyl(.04, .04, h, PAL.woodD, x, .45, 0, 4)); g.add(box(.7, h * .6, .03, '#d9534a', x, .45 + h * .3, 0)); } } },
    { n: 8, short: '自強運動', build: k => { const { g, box, cyl, PAL } = k;
      g.add(box(1.2, .35, .7, PAL.woodD, 0, 0, 0)); for (const x of [-.45, .45]) for (const z of [-.38, .38]) { const w = cyl(.22, .22, .06, PAL.dark, x, 0, z, 10); w.rotation.x = Math.PI / 2; w.position.y = .22; g.add(w); }
      const b = cyl(.15, .22, 1.6, PAL.dark, 0, 0, 0, 10); b.rotation.z = -1.25; b.position.set(.3, .65, 0); g.add(b); } },
    { n: 9, short: '民國建立', build: k => { const { g, box, cyl, PAL, mesh, THREE } = k;
      g.add(box(.6, 1.8, .6, PAL.cream, -.8, 0, 0)); g.add(box(.6, 1.8, .6, PAL.cream, .8, 0, 0)); g.add(box(2.3, .5, .7, PAL.cream, 0, 1.8, 0));
      g.add(mesh(new THREE.CylinderGeometry(.5, .5, .7, 12, 1, false, 0, Math.PI), PAL.cream, 0, 1.6, 0)).rotation.x = 0;
      g.add(box(2.5, .12, .8, '#c0392b', 0, 2.3, 0)); g.add(cyl(.25, .25, .25, PAL.yellow, 0, 2.42, 0, 10)); } },
    { n: 10, short: '冷戰分界', build: k => { const { g, box, cyl, PAL } = k;
      for (let i = -3; i <= 3; i++) g.add(cyl(.04, .04, .9, PAL.dark, i * .35, 0, 0, 4)); for (const y of [.3, .6, .85]) g.add(box(2.2, .02, .02, '#9aa3ac', 0, y, 0));
      g.add(box(.5, 1.6, .5, PAL.stoneD, 1.1, 0, -.6)); g.add(box(.8, .5, .8, PAL.stone, 1.1, 1.6, -.6)); g.add(box(.9, .08, .9, PAL.dark, 1.1, 2.1, -.6)); } },
    { n: 11, short: '金字塔與神殿', build: k => { const { g, cone, box, cyl, PAL } = k;
      g.add(cone(1, 1.4, '#e3c58a', -.5, 0, -.2, 4)).rotation.y = 0; g.children[g.children.length - 1].rotation.y = Math.PI / 4;
      g.add(box(1.2, .12, .6, PAL.white, .6, 0, .6)); for (const x of [.15, .45, .75, 1.05]) g.add(cyl(.07, .08, .8, PAL.white, x, .12, .6, 8)); g.add(box(1.2, .1, .6, PAL.white, .6, .92, .6)); } },
    { n: 12, short: '大航海帆船', build: k => { const { g, box, cyl, prism, ball, PAL, A, THREE } = k;
      g.add(box(1.8, .4, .6, '#9c6a40', 0, 0, 0)); g.add(cyl(.04, .04, 1.8, PAL.wood, 0, .4, 0, 4)); g.add(box(.9, .9, .03, PAL.white, 0, 1.2, 0)); g.add(box(.6, .5, .03, PAL.white, .6, .9, 0));
      const gl = ball(.35, '#6cb0d9', -.9, 1.3, -.5, 1); g.add(gl); g.add(ball(.15, PAL.leaf, -.75, 1.4, -.25, 0)); A(t => { gl.rotation.y = t * .5; }); } },
    { n: 13, short: '工業革命', build: k => { const { g, box, cyl, ball, PAL, A, THREE } = k;
      g.add(box(1.8, .9, 1, '#b65a3c', 0, 0, 0)); for (let i = 0; i < 3; i++) g.add(k.prism(.6, .35, 1, '#8a3f2a', -.6 + i * .6, .9, 0));
      for (const x of [-.6, .3]) g.add(cyl(.15, .2, 1.8, '#7a6a5a', x, .9, -.3, 8));
      for (let i = 0; i < 3; i++) { const s = ball(.2, '#d9d4cc', 0, 0, 0, 0); s.material = new THREE.MeshStandardMaterial({ color: '#d9d4cc', transparent: true, opacity: .8, flatShading: true }); g.add(s);
        A(t => { const p = (t * .3 + i / 3) % 1; s.position.set(-.6 + p * .4, 2.8 + p * 1.2, -.3); s.scale.setScalar(.6 + p * 1.2); s.material.opacity = .8 * (1 - p); }); } } },
    { n: 14, short: '和平鴿紀念碑', build: k => { const { g, box, cone, ball, PAL, A, THREE } = k;
      g.add(box(.9, .3, .9, PAL.stone, 0, 0, 0)); g.add(box(.45, 1.8, .45, PAL.white, 0, .3, 0)); g.add(cone(.32, .4, PAL.white, 0, 2.1, 0, 4));
      const dove = new THREE.Group(); g.add(dove); dove.add(ball(.14, PAL.white, 0, 0, 0, 0)); const w1 = box(.4, .02, .15, PAL.white, -.2, 0, 0), w2 = box(.4, .02, .15, PAL.white, .2, 0, 0); dove.add(w1, w2);
      A(t => { dove.position.set(Math.cos(t * .8) * .8, 2.8 + Math.sin(t * 2) * .1, Math.sin(t * .8) * .8); dove.rotation.y = -t * .8; w1.rotation.z = Math.sin(t * 12) * .6; w2.rotation.z = -w1.rotation.z; }); } },
    { key: 'chrono', short: '大事年表', title: '大事年表（臺灣・亞洲・歐洲）', href: '../history/#chrono', desc: '把 14 個單元的年代軸依年份排好，臺灣、亞洲、歐洲並排對照。',
      build: k => { const { g, cyl, box, PAL, A } = k;
        g.add(cyl(.9, 1, .25, PAL.stone, 0, 0, 0, 16)); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.add(box(.05, .03, .22, PAL.dark, Math.cos(a) * .72, .25, Math.sin(a) * .72)).children; }
        const gn = box(.06, .7, .7, PAL.yellow, 0, .25, 0); g.add(gn); const sh = box(.9, .01, .08, '#7a716a', .4, .26, 0); g.add(sh);
        A(t => { sh.rotation.y = -t * .3; sh.position.set(Math.cos(t * .3) * .4, .26, Math.sin(t * .3) * .4); }); } },
  ],
  civics: [
    { n: 1, short: '身分與社群', build: k => { const { g, box, person, PAL } = k;
      const id = box(1, .65, .05, PAL.white, 0, .6, -.4); id.rotation.x = -.2; g.add(id); g.add(box(.3, .35, .02, '#cfd7e3', -.25, .75, -.37)); g.add(box(.4, .05, .02, PAL.dark, .2, .9, -.37)); g.add(box(.4, .05, .02, PAL.dark, .2, .75, -.37));
      [[-.6, .4, PAL.blue], [0, .6, PAL.red], [.6, .4, PAL.yellow]].forEach(([x, z, c]) => g.add(person(x, z, c, 1.4))); } },
    { n: 2, short: '家庭與社區', build: k => { const { g, house, person, PAL } = k;
      g.add(house(-.3, -.3, 0, 1.1, PAL.cream, '#c7475a')); g.add(person(.7, .6, PAL.blue, 1.3)); g.add(person(1, .4, PAL.pink, 1.1)); } },
    { n: 3, short: '社會與文化', build: k => { const { g, box, cyl, ball, PAL, A } = k;
      g.add(box(2, .3, 1.2, PAL.wood, 0, 0, 0)); for (const x of [-.9, .9]) g.add(cyl(.05, .05, 1.6, PAL.red, x, .3, -.4, 6)); g.add(box(2, .1, .1, PAL.red, 0, 1.9, -.4));
      for (const x of [-.45, 0, .45]) { const l = ball(.18, '#e05a47', x, 1.6, -.4, 1); l.scale.y = 1.3; g.add(l); A(t => { l.rotation.z = Math.sin(t * 2 + x * 4) * .15; }); } } },
    { n: 4, short: '公平正義', build: k => { const { g, cyl, box, PAL, A, THREE } = k;
      g.add(cyl(.35, .45, .2, PAL.yellow, 0, 0, 0, 8)); g.add(cyl(.04, .04, 1.6, PAL.yellow, 0, .2, 0, 6));
      const beam = new THREE.Group(); beam.position.y = 1.8; g.add(beam); beam.add(box(1.6, .05, .05, PAL.yellow, 0, -.025, 0));
      for (const x of [-.75, .75]) { beam.add(cyl(.01, .01, .45, PAL.dark, x, -.45, 0, 4)); beam.add(cyl(.28, .22, .05, PAL.yellow, x, -.5, 0, 10)); }
      A(t => { beam.rotation.z = Math.sin(t * 1.2) * .12; }); } },
    { n: 5, short: '憲法與人權', build: k => { const { g, box, PAL } = k;
      g.add(box(.8, .7, .5, PAL.woodD, 0, 0, 0)); const l = box(.8, .08, 1, PAL.white, -.38, .75, 0); l.rotation.z = .15; g.add(l); const r = box(.8, .08, 1, PAL.white, .38, .75, 0); r.rotation.z = -.15; g.add(r);
      g.add(box(.1, .12, 1.02, '#c7475a', 0, .72, 0)); for (let i = 0; i < 4; i++) { g.add(box(.5, .01, .04, PAL.dark, -.4, .84 + i * .0, -.3 + i * .2)); } } },
    { n: 6, short: '三權分立', build: k => { const { g, box, cyl, prism, PAL } = k;
      g.add(box(2.1, .25, 1.1, PAL.stone, 0, 0, 0)); [['#e05a47', -.65], ['#f4c95d', 0], ['#5b8fd1', .65]].forEach(([c, x]) => g.add(cyl(.18, .2, 1.5, c, x, .25, 0, 10)));
      g.add(box(2.1, .2, 1.1, PAL.white, 0, 1.75, 0)); g.add(prism(2.2, .55, 1.1, PAL.white, 0, 1.95, 0)); } },
    { n: 7, short: '投票參與', build: k => { const { g, box, PAL, A } = k;
      g.add(box(1.1, 1, .8, PAL.white, 0, 0, 0)); g.add(box(.6, .05, .1, PAL.dark, 0, 1, 0)); g.add(box(1.12, .2, .82, '#c7475a', 0, .4, 0));
      const p = box(.4, .02, .55, PAL.yellow, 0, 1.3, 0); g.add(p); A(t => { const q = (t * .5) % 1; p.position.y = 1.8 - q * .8; p.rotation.y = q * 3; p.visible = q < .9; }); } },
    { n: 8, short: '契約與財產', build: k => { const { g, box, cyl, mesh, THREE, PAL } = k;
      const doc = box(1.1, .03, 1.4, PAL.white, -.2, .4, 0); doc.rotation.y = .2; g.add(doc); g.add(box(.8, .4, .6, PAL.woodD, -.2, 0, 0));
      for (let i = 0; i < 4; i++) g.add(box(.7, .01, .04, PAL.dark, -.2, .44, -.4 + i * .2));
      const key = new THREE.Group(); key.position.set(.75, .5, .3); key.rotation.z = .5; g.add(key); key.add(mesh(new THREE.TorusGeometry(.18, .05, 5, 12), PAL.yellow, 0, .35, 0)); key.add(box(.07, .6, .07, PAL.yellow, 0, -.25, 0)); key.add(box(.15, .07, .07, PAL.yellow, .07, -.2, 0)); } },
    { n: 9, short: '法槌與刑罰', build: k => { const { g, box, cyl, PAL, A, THREE } = k;
      g.add(cyl(.55, .6, .25, PAL.woodD, 0, 0, 0, 12));
      const gv = new THREE.Group(); gv.position.set(0, .35, 0); g.add(gv); const head = cyl(.18, .18, .7, '#8a5a3a', 0, 0, 0, 10); head.rotation.z = Math.PI / 2; head.position.set(.35, .55, 0); gv.add(head); gv.add(cyl(.04, .04, .9, '#6b4228', .35, 0, 0, 6));
      A(t => { gv.rotation.z = Math.max(0, Math.sin(t * 2)) * .5; }); } },
    { n: 10, short: '交通與規範', build: k => { const { g, box, cyl, ball, PAL, M, A } = k;
      g.add(cyl(.05, .06, 1.6, PAL.dark, -.4, 0, 0, 6)); g.add(box(.35, .95, .3, PAL.dark, -.4, 1.6, 0));
      const lights = ['#e05a47', '#f4c95d', '#4caf50'].map((c, i) => { const b = ball(.1, c, -.4, 2.35 - i * .3, .16, 1); g.add(b); return b; });
      A(t => { const on = Math.floor(t / 1.5) % 3; lights.forEach((b, i) => b.scale.setScalar(i === on ? 1.25 : .8)); });
      g.add(cyl(.04, .04, 1.3, PAL.gray, .6, 0, .2, 6)); const st = cyl(.35, .35, .05, '#e05a47', .6, 1.3, .2, 8); st.rotation.x = Math.PI / 2; st.position.y = 1.5; g.add(st); } },
    { n: 11, short: '選擇與機會成本', build: k => { const { g, box, cyl, PAL } = k;
      g.add(cyl(.05, .05, 1.9, PAL.woodD, 0, 0, 0, 6));
      [[.45, 1.6, -.4, '#5b8fd1'], [-.45, 1.25, .4, '#e05a47']].forEach(([x, y, r, c]) => { const b = box(.9, .25, .05, c, x, y, 0); b.rotation.y = r; g.add(b); });
      for (let i = 0; i < 4; i++) g.add(cyl(.18, .18, .07, PAL.yellow, .7, i * .07, .6, 10)); } },
    { n: 12, short: '市場與貨幣', build: k => { const { g, box, cyl, ball, PAL } = k;
      g.add(box(1.8, .6, .8, PAL.wood, 0, 0, 0)); for (const x of [-.8, .8]) g.add(cyl(.04, .04, 1.4, PAL.woodD, x, .6, .35, 4));
      for (let i = 0; i < 6; i++) g.add(box(.3, .05, 1, i % 2 ? PAL.white : '#c7475a', -.75 + i * .3, 2, .1));
      for (let i = 0; i < 5; i++) g.add(ball(.13, [PAL.red, PAL.yellow, '#f39b5b'][i % 3], -.6 + i * .3, .72, 0, 0));
      for (let i = 0; i < 3; i++) g.add(cyl(.15, .15, .06, PAL.yellow, .5, .6 + i * .06, -.25, 10)); } },
    { n: 13, short: '勞動與競爭', build: k => { const { g, box, cyl, mesh, THREE, PAL, A } = k;
      const gear = new THREE.Group(); gear.position.set(0, 1.2, 0); g.add(gear);
      gear.add(mesh(new THREE.CylinderGeometry(.6, .6, .25, 16), '#9aa3ac', 0, 0, 0)); gear.children[0].rotation.x = Math.PI / 2;
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const t = box(.22, .22, .25, '#9aa3ac', Math.cos(a) * .7, Math.sin(a) * .7 - .11, 0); t.rotation.z = a; gear.add(t); }
      g.add(box(.3, .6, .3, PAL.dark, 0, 0, 0)); A(t => { gear.rotation.z = t * .8; });
      const hat = mesh(new THREE.SphereGeometry(.3, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), PAL.yellow, .9, .1, .4); g.add(hat); g.add(cyl(.38, .38, .04, PAL.yellow, .9, .08, .4, 12)); } },
    { n: 14, short: '科技與全球化', build: k => { const { g, box, cyl, mesh, THREE, PAL, A } = k;
      g.add(box(2.2, .4, .8, '#3d5a80', 0, 0, 0)); g.add(box(.4, .5, .7, PAL.white, -.85, .4, 0));
      ['#e05a47', '#f4c95d', '#5b8fd1', '#4caf50'].forEach((c, i) => g.add(box(.35, .3, .6, c, -.35 + i * .38, .4, 0)));
      const dish = new THREE.Group(); dish.position.set(.9, 1.1, 0); g.add(dish); g.add(cyl(.03, .03, .7, PAL.dark, .9, .4, 0, 4));
      dish.add(mesh(new THREE.SphereGeometry(.35, 10, 6, 0, Math.PI * 2, 0, Math.PI / 3), PAL.white, 0, 0, 0)); dish.rotation.x = 2.4; A(t => { dish.rotation.z = t * .5; }); } },
  ],
};

// 英語：依類別；外圈 15 棟小屋是 15 個文法主題
const GT = ['', '名詞、代名詞', '現在／過去簡單式', '進行式、未來式', 'Wh- 疑問詞', '形容詞', '副詞', '介系詞', '連接詞', '助動詞', '動詞', '被動語態', '不定詞、動名詞、分詞', '現在／過去完成式', '關係代名詞', '特殊句構'];
LANDMARKS.english = [
  { key: 'vocab', short: '主題單字', title: '主題單字市集', href: '../english/#vocab', build: k => { const { g, box, cyl, ball, PAL, textTex, THREE } = k;
    g.add(box(2, .6, .9, PAL.wood, 0, 0, 0)); for (const x of [-.9, .9]) g.add(cyl(.04, .04, 1.4, PAL.woodD, x, .6, .4, 4));
    for (let i = 0; i < 6; i++) g.add(box(.34, .05, 1.05, i % 2 ? PAL.white : '#1a8a96', -.85 + i * .34, 2, .1));
    ['A', 'B', 'C'].forEach((ch, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.4, .4, .4), new THREE.MeshStandardMaterial({ map: textTex(ch, { w: 64, h: 64, size: 46, bg: ['#e05a47', '#f4c95d', '#5b8fd1'][i], fg: '#fff' }) })); m.position.set(-.55 + i * .5, .8, 0); m.rotation.y = i * .3 - .3; m.castShadow = true; g.add(m); });
    g.add(ball(.15, PAL.red, .75, .72, .2, 0)); g.add(ball(.15, PAL.yellow, .75, .72, -.15, 0)); } },
  { key: 'poly', short: '一字多義', title: '一字多義路標', href: '../english/#poly', build: k => { const { g, box, cyl, PAL } = k;
    g.add(cyl(.06, .06, 2.4, PAL.woodD, 0, 0, 0, 6));
    ['#1a8a96', '#e05a47', '#f4c95d', '#5b8fd1'].forEach((c, i) => { const b = box(1, .26, .05, c, .35, 2.1 - i * .4, 0); b.rotation.y = i * 1.4; b.position.x = Math.cos(i * 1.4) * .35; b.position.z = -Math.sin(i * 1.4) * .35; g.add(b); }); } },
  { key: 'strat-單字', short: '單字策略', title: '單字記憶策略', href: '../english/#strat/' + encodeURIComponent('單字'), build: k => { const { g, box, PAL, textTex, THREE } = k;
    g.add(box(1.4, .5, 1, PAL.woodD, 0, 0, 0)); const book = box(1.3, .3, .95, '#1a8a96', 0, .5, 0); g.add(book); g.add(box(1.22, .26, .9, PAL.white, .03, .52, 0));
    const t = new THREE.Mesh(new THREE.PlaneGeometry(.9, .45), new THREE.MeshBasicMaterial({ map: textTex('A–Z', { w: 128, h: 64, size: 44, bg: '#1a8a96', fg: '#fff' }) })); t.rotation.x = -Math.PI / 2; t.position.set(0, .81, 0); g.add(t); } },
  { key: 'strat-閱讀', short: '閱讀策略', title: '閱讀策略圖書館', href: '../english/#strat/' + encodeURIComponent('閱讀'), build: k => { const { g, box, PAL } = k;
    g.add(box(1.8, 2, .5, PAL.woodD, 0, 0, -.2));
    const cols = ['#e05a47', '#f4c95d', '#5b8fd1', '#1a8a96', '#8e6ad8', '#4caf50'];
    for (let r = 0; r < 3; r++) { g.add(box(1.7, .05, .45, PAL.wood, 0, .1 + r * .62, 0)); for (let i = 0; i < 7; i++) g.add(box(.18, .45 + (i % 3) * .05, .35, cols[(i + r) % 6], -.65 + i * .21, .15 + r * .62, .02)); } } },
  { key: 'strat-聽力', short: '聽力策略', title: '聽力策略廣播站', href: '../english/#strat/' + encodeURIComponent('聽力'), build: k => { const { g, box, cyl, ball, mesh, THREE, PAL, A } = k;
    g.add(box(.9, .6, .7, PAL.cream, 0, 0, 0)); for (let i = 0; i < 4; i++) { const l = cyl(.03, .03, .55, PAL.dark, -.3 + i * .2, 2.0 - i * .45, 0, 4); l.rotation.z = Math.PI / 2; l.position.y = .9 + i * .45; g.add(l); }
    g.add(cyl(.04, .1, 2.6, '#9aa3ac', 0, .6, 0, 4)); const top = ball(.12, '#e05a47', 0, 3.25, 0, 1); g.add(top);
    const waves = [0, 1, 2].map(i => { const w = mesh(new THREE.TorusGeometry(.3 + i * .25, .02, 4, 24, Math.PI / 2), '#1a8a96', 0, 3.25, 0); w.rotation.z = -Math.PI / 4; g.add(w); return w; });
    A(t => waves.forEach((w, i) => { w.material.opacity = 1; w.scale.setScalar(1 + ((t * .8 + i / 3) % 1) * .4); })); } },
  ...GT.slice(1).map((name, i) => ({ key: 'gram-' + (i + 1), n: i + 1, gram: true, short: '文法 ' + (i + 1), title: `文法 ${i + 1}．${name}`, href: '../english/#gram/' + (i + 1), small: true,
    build: k => { const { g, PAL } = k; const roofs = ['#1a8a96', '#e05a47', '#f4c95d', '#5b8fd1', '#8e6ad8']; g.add(k.house(0, 0, 0, .75, PAL.white, roofs[i % 5])); } })),
];
