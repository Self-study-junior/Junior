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

// 國文：一單元一個物件
const tile = (k, ch, bg, x, y, z, s = .55, ry = 0) => { const m = new k.THREE.Mesh(new k.THREE.BoxGeometry(s, s, s), new k.THREE.MeshStandardMaterial({ map: k.textTex(ch, { w: 128, h: 128, size: 84, bg, fg: '#fff' }), roughness: .9 })); m.position.set(x, y + s / 2, z); m.rotation.y = ry; m.castShadow = m.receiveShadow = true; return m; };
LANDMARKS.chinese = [
  { n: 1, short: '注音積木', build: k => { const { g } = k;
    g.add(tile(k, 'ㄅ', '#e05a47', -.55, 0, 0, .7, .2)); g.add(tile(k, 'ㄆ', '#f4c95d', .2, 0, .15, .7, -.15)); g.add(tile(k, 'ㄇ', '#5b8fd1', -.15, .7, .05, .7, .1)); g.add(tile(k, 'ˊ', '#2f8a63', .65, 0, -.5, .45)); } },
  { n: 2, short: '字形石碑', build: k => { const { g, box, THREE, M, textTex, PAL } = k;
    g.add(box(1.4, .3, .7, PAL.stoneD, 0, 0, 0));
    const t = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, .25), [M(PAL.stone), M(PAL.stone), M(PAL.stone), M(PAL.stone), new THREE.MeshStandardMaterial({ map: textTex('形', { w: 128, h: 220, size: 100, bg: '#d8d2c8', fg: '#a8453a' }) }), M(PAL.stone)]);
    t.position.y = 1.2; t.castShadow = true; g.add(t); } },
  { n: 3, short: '字典與放大鏡', build: k => { const { g, box, cyl, mesh, THREE, PAL } = k;
    const l = box(.85, .1, 1.2, PAL.white, -.42, .3, 0); l.rotation.z = .12; g.add(l); const r = box(.85, .1, 1.2, PAL.white, .42, .3, 0); r.rotation.z = -.12; g.add(r);
    g.add(box(1.8, .3, 1.3, '#a8453a', 0, 0, 0)); for (let i = 0; i < 4; i++) g.add(box(.6, .01, .04, PAL.dark, -.45, .43, -.4 + i * .25));
    const mg = new THREE.Group(); mg.position.set(.5, .9, .2); mg.rotation.set(-.6, 0, .3); g.add(mg);
    mg.add(mesh(new THREE.TorusGeometry(.32, .06, 6, 20), PAL.dark, 0, 0, 0)); mg.add(mesh(new THREE.CircleGeometry(.3, 20), '#cde9f0', 0, 0, 0, { transparent: true, opacity: .6 })); mg.add(cyl(.05, .05, .5, PAL.woodD, 0, -.55, 0, 6)); } },
  { n: 4, short: '詞語卡片', build: k => { const { g, box, PAL } = k;
    ['#fffaf2', '#f4c95d', '#cde9f0', '#f2a7b5'].forEach((c, i) => { const b = box(1, .04, .65, c, (i - 1.5) * .12, i * .06, (i - 1.5) * .05); b.rotation.y = (i - 1.5) * .35; g.add(b); });
    g.add(tile(k, '詞', '#a8453a', .55, .25, .45, .5, .3)); g.add(tile(k, '語', '#3d4f9a', -.6, .25, .4, .5, -.3)); } },
  { n: 5, short: '守株待兔', build: k => { const { g, cyl, ball, cone, PAL } = k;
    g.add(cyl(.45, .55, .5, '#9c6a40', -.35, 0, 0, 10)); g.add(cyl(.45, .45, .02, '#d9b98c', -.35, .5, 0, 10));
    const rb = new k.THREE.Group(); rb.position.set(.55, 0, .25); g.add(rb);
    const b = ball(.32, PAL.white, 0, .3, 0, 1); b.scale.set(1, .85, 1.25); rb.add(b); rb.add(ball(.22, PAL.white, 0, .62, .3, 1));
    for (const x of [-.08, .08]) { const e = cone(.06, .45, PAL.white, x, .78, .25, 6); e.rotation.x = -.2; rb.add(e); } rb.add(ball(.03, PAL.dark, .1, .68, .5, 0));
    const p = new k.THREE.Group(); p.position.set(-.9, 0, -.5); g.add(p); p.add(k.person(0, 0, '#3d6f9a', 1.5)); } },
  { n: 6, short: '標點與工具書', build: k => { const { g, box, PAL } = k;
    g.add(box(1, .5, .7, '#3d4f9a', -.45, 0, 0)); g.add(box(.9, .45, .65, '#a8453a', -.45, .5, 0));
    g.add(tile(k, '，', '#f4c95d', .45, 0, .2, .6)); g.add(tile(k, '？', '#2f8a63', .5, .6, .15, .6, .2)); g.add(tile(k, '！', '#e05a47', .35, 0, -.5, .5, -.2)); } },
  { n: 7, short: '毛筆與硯台', build: k => { const { g, box, cyl, cone, PAL } = k;
    g.add(box(1.4, .2, .9, '#3a3a3a', 0, 0, 0)); g.add(box(.9, .05, .5, '#1f1f1f', -.15, .2, 0));
    g.add(box(.25, .12, .7, '#2b2b2b', .55, .2, 0)); const paper = box(1.3, .02, .9, '#fffaf2', 0, 0, 1.1); g.add(paper);
    const br = new k.THREE.Group(); br.position.set(.35, 1.1, .2); br.rotation.z = -.5; g.add(br);
    br.add(cyl(.05, .05, 1.2, '#b98f62', 0, -.3, 0, 6)); br.add(cone(.09, .35, '#2b2b2b', 0, -.65, 0, 6)).children.at(-1); br.children.at(-1).rotation.x = Math.PI; } },
  { n: 8, short: '句型積木', build: k => { const { g } = k;
    g.add(tile(k, '主', '#e05a47', -.65, 0, 0, .6)); g.add(tile(k, '謂', '#f4c95d', 0, 0, 0, .6)); g.add(tile(k, '賓', '#5b8fd1', .65, 0, 0, .6));
    g.add(tile(k, '定', '#8e6ad8', -.35, .6, 0, .5, .2)); g.add(tile(k, '狀', '#2f8a63', .35, .6, 0, .5, -.2)); } },
  { n: 9, short: '修辭彩虹', build: k => { const { g, mesh, THREE, ball, PAL } = k;
    ['#e05a47', '#f39b5b', '#f4c95d', '#7fb069', '#5b8fd1', '#8e6ad8'].forEach((c, i) => { const r = mesh(new THREE.TorusGeometry(1.15 - i * .12, .06, 6, 24, Math.PI), c, 0, .1, 0); g.add(r); });
    for (const x of [-1.15, 1.05]) for (let i = 0; i < 3; i++) g.add(ball(.2, PAL.white, x + i * .12 - .1, .15, (i - 1) * .12, 1)); } },
  { n: 10, short: '郵筒與信封', build: k => { const { g, box, cyl, mesh, THREE, PAL, A } = k;
    g.add(box(.5, 1.2, .5, '#2f8a63', -.4, 0, 0)); g.add(mesh(new THREE.CylinderGeometry(.25, .25, .5, 12, 1, false, 0, Math.PI), '#2f8a63', -.4, 1.2, 0)).rotation.z = Math.PI / 2; g.children.at(-1).rotation.set(0, 0, Math.PI / 2);
    g.add(box(.5, 1.2, .5, '#e05a47', .25, 0, 0)); g.add(box(.3, .04, .02, PAL.dark, -.4, .9, .26)); g.add(box(.3, .04, .02, PAL.dark, .25, .9, .26));
    const env = box(.6, .02, .4, PAL.white, 0, 0, 0); g.add(env); A(t => { const p = (t * .4) % 1; env.position.set(.9 - p * .65, 1.6 - p * .7, .4); env.rotation.y = p * 2; env.visible = p < .9; }); } },
  { n: 11, short: '書院涼亭', build: k => { const { g, box, cyl, cone, PAL } = k;
    g.add(box(1.8, .2, 1.8, PAL.stone, 0, 0, 0)); for (const x of [-.7, .7]) for (const z of [-.7, .7]) g.add(cyl(.07, .07, 1.2, '#c0392b', x, .2, z, 8));
    g.add(cone(1.35, .7, '#3a4a5a', 0, 1.4, 0, 4)).children; g.children.at(-1).rotation.y = Math.PI / 4; g.add(box(1.6, .12, 1.6, '#3a4a5a', 0, 1.35, 0));
    g.add(cyl(.12, .12, .8, PAL.cream, 0, .5, 0, 10)).rotation.z = Math.PI / 2; g.children.at(-1).rotation.set(0, 0, Math.PI / 2); } },
  { n: 12, short: '作家書桌', build: k => { const { g, box, cyl, ball, PAL } = k;
    g.add(box(1.6, .08, .9, PAL.wood, 0, .7, 0)); for (const x of [-.7, .7]) for (const z of [-.38, .38]) g.add(box(.08, .7, .08, PAL.woodD, x, 0, z));
    g.add(box(.7, .02, .5, PAL.white, -.2, .78, 0)); for (let i = 0; i < 4; i++) g.add(box(.5, .01, .03, '#e05a47', -.2, .8, -.15 + i * .1));
    g.add(cyl(.03, .03, .45, PAL.dark, .5, .78, -.2, 5)); g.add(ball(.13, '#fff3c4', .5, 1.28, -.2, 0)); g.add(box(.35, .5, .3, '#3d4f9a', .55, .78, .2)); } },
  { n: 13, short: '句子拼圖', build: k => { const { g, box, cyl } = k;
    [['#e05a47', -.45, -.3, .1], ['#f4c95d', .3, -.35, -.1], ['#5b8fd1', -.3, .4, -.05], ['#7fb069', .45, .35, .15]].forEach(([c, x, z, r]) => { const b = box(.7, .15, .7, c, x, 0, z); b.rotation.y = r; g.add(b); g.add(cyl(.12, .12, .15, c, x + .35, 0, z, 10)); });
    const lift = box(.7, .15, .7, '#8e6ad8', .1, .7, 0); lift.rotation.set(.3, .4, .1); g.add(lift); } },
  { n: 14, short: '白話文閱讀', build: k => { const { g, box, PAL, person } = k;
    g.add(box(1.5, .08, .45, PAL.wood, 0, .4, 0)); g.add(box(1.5, .45, .06, PAL.wood, 0, .48, -.2)); for (const x of [-.65, .65]) g.add(box(.06, .4, .4, PAL.dark, x, 0, 0));
    const l = box(.45, .03, .6, PAL.white, -.22, 1, .6); l.rotation.z = .3; g.add(l); const r = box(.45, .03, .6, PAL.white, .22, 1, .6); r.rotation.z = -.3; g.add(r); g.add(box(.1, .05, .6, '#2f8a63', 0, .95, .6)); } },
  { n: 15, short: '竹簡', build: k => { const { g, box, cyl, PAL } = k;
    for (let i = 0; i < 9; i++) { const s = box(.14, .04, 1.4, '#d9b98c', -.65 + i * .16, 0, 0); s.rotation.x = 0; g.add(s); g.add(box(.06, .045, .9, '#5a3e2b', -.65 + i * .16, .01, 0)); }
    g.add(cyl(.18, .18, .9, '#c9a77a', 1.05, 0, 0, 10)).rotation.x = Math.PI / 2; g.children.at(-1).rotation.set(Math.PI / 2, 0, 0); g.children.at(-1).position.set(.85, .18, 0);
    for (const z of [-.45, .45]) g.add(box(1.6, .02, .03, '#8a5a2b', 0, .04, z)); } },
  { n: 16, short: '圖表告示板', build: k => { const { g, box, PAL } = k;
    for (const x of [-.75, .75]) g.add(box(.08, 1.6, .08, PAL.woodD, x, 0, 0));
    g.add(box(1.7, 1.1, .08, PAL.white, 0, 1, 0)); [['#e05a47', .35], ['#f4c95d', .6], ['#5b8fd1', .85], ['#2f8a63', .5]].forEach(([c, h], i) => g.add(box(.25, h, .04, c, -.5 + i * .33, 1.1, .06)));
    g.add(box(1.4, .02, .04, PAL.dark, 0, 1.1, .07)); } },
  { n: 17, short: '鉛筆與稿紙', build: k => { const { g, box, cyl, cone, PAL, A } = k;
    g.add(box(1.4, .03, 1.7, PAL.white, -.1, 0, 0)); for (let i = 0; i < 6; i++) g.add(box(.02, .01, 1.5, '#e05a47', -.65 + i * .22, .03, 0));
    const p = new k.THREE.Group(); p.position.set(.3, .2, 0); g.add(p);
    p.add(cyl(.14, .14, 1.8, '#f4c95d', 0, .2, 0, 6)); p.add(cyl(.145, .145, .2, '#e05a47', 0, 1.9, 0, 6)); p.add(cone(.14, .35, '#e9c99a', 0, -.15, 0, 6)); p.children.at(-1).rotation.x = Math.PI; p.children.at(-1).position.y = .0;
    A(t => { p.rotation.z = -.5 + Math.sin(t * 3) * .06; p.position.x = .3 + Math.sin(t * 1.5) * .25; }); } },
];

// 地理：一單元一個物件
LANDMARKS.geography = [
  { n: 1, short: '地球儀與臺灣', build: k => { const { g, ball, cyl, cone, mesh, THREE, PAL, A } = k;
    g.add(cyl(.35, .5, .25, PAL.woodD, 0, 0, 0, 10)); g.add(cyl(.05, .05, .5, PAL.woodD, 0, .25, 0, 6));
    const gl = new THREE.Group(); gl.position.y = 1.4; gl.rotation.z = .4; g.add(gl);
    gl.add(ball(.7, '#6cb0d9', 0, 0, 0, 2)); gl.add(ball(.3, PAL.leaf, .35, .25, .45, 0)); gl.add(ball(.22, PAL.leaf, -.4, -.1, .45, 0));
    const pin = new THREE.Group(); pin.position.set(.15, .25, .66); gl.add(pin); pin.add(cyl(.02, .02, .3, PAL.dark, 0, 0, 0, 4)); pin.add(ball(.08, PAL.red, 0, .32, 0, 1));
    gl.add(mesh(new THREE.TorusGeometry(.82, .03, 4, 32, Math.PI), '#c9a77a', 0, 0, 0));
    A(t => { gl.rotation.y = t * .4; }); } },
  { n: 2, short: '高山與海岸', build: k => { const { g, cone, box, cyl, PAL } = k;
    g.add(cone(.9, 1.9, '#8aa86a', -.3, 0, -.2, 7)); g.add(cone(.35, .55, PAL.white, -.3, 1.4, -.2, 7)); g.add(cone(.65, 1.2, '#9fbf86', .55, 0, -.3, 7));
    g.add(box(1.8, .06, .6, '#f2e0bd', 0, 0, .75)); g.add(box(1.8, .05, .35, '#6cb0d9', 0, 0, 1.15));
    g.add(cyl(.12, .16, .9, PAL.white, .75, 0, .7, 8)); g.add(cyl(.17, .17, .18, PAL.red, .75, .4, .7, 8)); } },
  { n: 3, short: '雨雲與水庫', build: k => { const { g, ball, box, PAL, A, THREE } = k;
    g.add(box(1.8, .5, .3, PAL.stone, 0, 0, .3)); g.add(box(1.6, .25, 1, '#6cb0d9', 0, 0, -.4));
    const cl = new THREE.Group(); cl.position.set(0, 2, -.3); g.add(cl); for (const [x, r] of [[-.4, .35], [0, .45], [.4, .35]]) cl.add(ball(r, PAL.white, x, 0, 0, 1));
    for (let i = 0; i < 6; i++) { const d = ball(.05, '#5b8fd1', 0, 0, 0, 0); cl.add(d); A(t => { const p = (t * .9 + i / 6) % 1; d.position.set(-.5 + i * .2, -.35 - p * 1.4, 0); }); } } },
  { n: 4, short: '多元族群', build: k => { const { g, person, house, PAL } = k;
    g.add(house(0, -.5, 0, .7, PAL.cream, '#b8701f'));
    [['#e05a47', -.7, .4], ['#f4c95d', -.25, .6], ['#5b8fd1', .2, .55], ['#2f8a63', .65, .35], ['#8e6ad8', .05, .95]].forEach(([c, x, z]) => g.add(person(x, z, c, 1.3))); } },
  { n: 5, short: '科學園區', build: k => { const { g, box, cyl, PAL, A } = k;
    g.add(box(1.6, .9, 1, '#d9dee6', 0, 0, -.2)); for (let i = 0; i < 4; i++) g.add(box(.3, .3, .02, '#6cb0d9', -.55 + i * .37, .4, .31));
    g.add(cyl(.1, .14, .9, '#9aa3ac', .6, .9, -.4, 8));
    const w = cyl(.5, .5, .05, '#c0c8d8', -.1, 0, 0, 24); w.position.set(-.1, 1.4, .3); w.rotation.x = -1.1; g.add(w); A(t => { w.rotation.z = t; }); } },
  { n: 6, short: '高鐵與城鎮', build: k => { const { g, box, cyl, cone, PAL } = k;
    g.add(box(2.4, .05, .5, PAL.stoneD, 0, 0, .4)); const tr = box(1.6, .45, .4, PAL.white, -.1, .05, .4); g.add(tr);
    g.add(cone(.22, .5, PAL.white, .85, .27, .4, 8)).children; g.children.at(-1).rotation.z = -Math.PI / 2; g.children.at(-1).position.set(.95, .28, .4);
    g.add(box(1.6, .06, .41, '#e2673c', -.1, .25, .4)); for (const [x, h] of [[-.7, .9], [-.2, 1.3], [.4, .7]]) g.add(box(.4, h, .4, ['#cfd7e3', '#e9e3da', '#f2e0bd'][Math.round(x * 2 + 2) % 3], x, 0, -.4)); } },
  { n: 7, short: '黃土梯田', build: k => { const { g, box, PAL } = k;
    ['#d9b98c', '#cfae7f', '#c4a274', '#b99668'].forEach((c, i) => g.add(box(2 - i * .4, .3, 1.8 - i * .35, c, 0, i * .3, 0)));
    for (let i = 0; i < 3; i++) g.add(box(1.9 - i * .4, .04, .12, PAL.leaf, 0, (i + 1) * .3, .82 - i * .17)); } },
  { n: 8, short: '貨櫃碼頭', build: k => { const { g, box, PAL } = k;
    const cs = ['#e05a47', '#5b8fd1', '#f4c95d', '#2f8a63', '#e2673c', '#8e6ad8'];
    for (let r = 0; r < 2; r++) for (let i = 0; i < 3; i++) g.add(box(.85, .4, .38, cs[(r * 3 + i) % 6], -.45 + r * .9 - .45 + .45, i * .4, -.4 + r * .1 + (i % 2) * .02));
    g.add(box(.08, 2, .08, '#f4c95d', .9, 0, .5)); g.add(box(1.4, .08, .08, '#f4c95d', .35, 2, .5)); g.add(box(.05, .6, .05, PAL.dark, -.1, 1.4, .5)); } },
  { n: 9, short: '富士山與鳥居', build: k => { const { g, cone, box, cyl, PAL } = k;
    g.add(cone(1, 1.5, '#7f9fb8', -.2, 0, -.4, 10)); g.add(cone(.38, .55, PAL.white, -.2, .97, -.4, 10));
    for (const x of [.35, 1.0]) g.add(cyl(.06, .07, 1.1, '#d0533f', x, 0, .5, 8)); g.add(box(.95, .1, .12, '#d0533f', .675, .9, .5)); g.add(box(1.1, .1, .14, PAL.dark, .675, 1.08, .5)); } },
  { n: 10, short: '高腳屋與椰子樹', build: k => { const { g, box, cyl, cone, ball, prism, PAL } = k;
    for (const x of [-.65, -.05]) for (const z of [-.35, .25]) g.add(cyl(.04, .04, .6, PAL.woodD, x, 0, z, 5));
    g.add(box(.9, .5, .8, '#d9b98c', -.35, .6, -.05)); g.add(prism(1.1, .55, .95, '#b98f62', -.35, 1.1, -.05));
    const tr = cyl(.07, .1, 1.6, '#9c6a40', .65, 0, .3, 6); tr.rotation.z = -.15; g.add(tr);
    for (let i = 0; i < 5; i++) { const l = box(.7, .03, .18, PAL.leafD, .78 + Math.cos(i * 1.26) * .3, 1.62, .3 + Math.sin(i * 1.26) * .3); l.rotation.y = -i * 1.26; l.rotation.z = -.35; g.add(l); }
    g.add(ball(.08, '#8c6239', .75, 1.5, .35, 0)); } },
  { n: 11, short: '駱駝與油井', build: k => { const { g, box, cyl, ball, PAL, A, THREE } = k;
    const c = '#d9a86a'; const cm = new THREE.Group(); cm.position.set(-.35, 0, .2); g.add(cm);
    cm.add(box(.9, .4, .35, c, 0, .55, 0)); cm.add(ball(.22, c, -.1, 1.05, 0, 0)); cm.add(box(.12, .5, .12, c, .5, .75, 0)); cm.add(box(.3, .15, .15, c, .6, 1.2, 0));
    for (const x of [-.3, .3]) for (const z of [-.1, .1]) cm.add(box(.08, .55, .08, c, x, 0, z));
    const dr = new THREE.Group(); dr.position.set(.75, 0, -.4); g.add(dr); dr.add(box(.5, .1, .3, PAL.dark, 0, 0, 0)); dr.add(box(.08, .9, .08, PAL.dark, 0, .1, 0));
    const beam = box(.9, .1, .08, PAL.dark, 0, 0, 0); beam.position.y = 1; dr.add(beam); A(t => { beam.rotation.z = Math.sin(t * 2) * .3; }); } },
  { n: 12, short: '猴麵包樹與長頸鹿', build: k => { const { g, cyl, ball, box, PAL } = k;
    g.add(cyl(.32, .45, 1.4, '#a98a6a', -.4, 0, -.2, 9)); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; g.add(ball(.28, '#7f9f5a', -.4 + Math.cos(a) * .35, 1.55, -.2 + Math.sin(a) * .35, 0)); }
    const y = '#e8b94a'; g.add(box(.5, .3, .22, y, .55, .7, .4)); g.add(box(.1, .9, .1, y, .75, .9, .4)); g.add(box(.25, .14, .14, y, .85, 1.8, .4));
    for (const x of [.37, .72]) for (const z of [.32, .48]) g.add(box(.06, .7, .06, y, x, 0, z));
    for (let i = 0; i < 4; i++) g.add(box(.08, .08, .23, '#8c5a2b', .45 + i * .08, .85, .4)); } },
  { n: 13, short: '風車與洋蔥頂', build: k => { const { g, box, cyl, cone, ball, PAL, A, THREE } = k;
    g.add(cyl(.3, .45, 1.6, PAL.cream, -.45, 0, 0, 8)); g.add(cone(.42, .5, '#9c6a40', -.45, 1.6, 0, 8));
    const hub = new THREE.Group(); hub.position.set(-.45, 1.5, .45); g.add(hub);
    for (let i = 0; i < 4; i++) { const p = new THREE.Group(); p.rotation.z = i * Math.PI / 2; const b = box(.18, .9, .03, PAL.white, 0, 0, 0); b.position.y = .45; p.add(b); hub.add(p); }
    A(t => { hub.rotation.z = t * 1.2; });
    g.add(cyl(.3, .3, .9, PAL.white, .6, 0, -.1, 10)); const d = ball(.38, '#2f8a63', .6, 1.15, -.1, 1); d.scale.y = 1.2; g.add(d); g.add(cone(.08, .35, PAL.yellow, .6, 1.5, -.1, 6)); } },
  { n: 14, short: '摩天大樓與仙人掌', build: k => { const { g, box, cyl, PAL } = k;
    g.add(box(.5, 2.2, .5, '#9fb8d0', -.5, 0, -.3)); g.add(box(.4, 1.5, .4, '#c9d6e3', .05, 0, -.45)); g.add(cyl(.03, .03, .5, PAL.dark, -.5, 2.2, -.3, 4));
    const c = '#5f9450'; g.add(cyl(.13, .15, 1.1, c, .65, 0, .45, 8)); g.add(cyl(.08, .08, .4, c, .48, .55, .45, 6)); g.add(cyl(.08, .08, .35, c, .82, .4, .45, 6)); } },
  { n: 15, short: '冰山與企鵝', build: k => { const { g, cone, ball, box, PAL, A, THREE } = k;
    g.add(box(2, .15, 1.6, '#e8f4fa', 0, 0, 0)); g.add(cone(.7, 1.6, '#f4fbff', -.4, 0, -.3, 5));
    for (const [x, z] of [[.4, .3], [.8, .1]]) { const p = new THREE.Group(); p.position.set(x, .15, z); g.add(p);
      const b = ball(.2, PAL.dark, 0, .25, 0, 1); b.scale.y = 1.4; p.add(b); const f = ball(.15, PAL.white, 0, .22, .08, 1); f.scale.y = 1.3; p.add(f); p.add(cone(.05, .1, PAL.yellow, 0, .4, .17, 4)).children; p.children.at(-1).rotation.x = Math.PI / 2;
      A(t => { p.rotation.z = Math.sin(t * 3 + x * 5) * .12; }); } } },
  { n: 16, short: '稻田與稻草人', build: k => { const { g, box, cyl, ball, cone, PAL, textTex, THREE, M } = k;
    g.add(box(1.8, .12, 1.4, '#8c6239', 0, 0, 0)); for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) g.add(cone(.07, .35, '#c9b44a', -.7 + i * .35, .12, -.5 + j * .33, 4));
    const sc = new THREE.Group(); sc.position.set(.55, 0, .3); g.add(sc); sc.add(cyl(.04, .04, 1.4, PAL.woodD, 0, 0, 0, 4)); sc.add(box(.9, .06, .06, PAL.woodD, 0, 1, 0));
    sc.add(box(.45, .45, .2, '#5b8fd1', 0, .7, 0)); sc.add(ball(.18, '#f2e0bd', 0, 1.2, 0, 1)); sc.add(cone(.3, .2, '#e0c060', 0, 1.3, 0, 10));
    const sign = new THREE.Mesh(new THREE.BoxGeometry(.8, .3, .04), [M(PAL.wood), M(PAL.wood), M(PAL.wood), M(PAL.wood), new THREE.MeshBasicMaterial({ map: textTex('地名', { w: 128, h: 48, size: 34, bg: '#2f6d3a', fg: '#fff' }) }), M(PAL.wood)]);
    sign.position.set(-.6, 1, .75); g.add(sign); g.add(cyl(.03, .03, 1, PAL.dark, -.6, 0, .73, 4)); } },
];

// 理化：一單元一個物件
const glassM = k => new k.THREE.MeshStandardMaterial({ color: '#d8eef6', transparent: true, opacity: .45, roughness: .15 });
LANDMARKS.physchem = [
  { n: 1, short: '量筒與尺', build: k => { const { g, cyl, box, PAL } = k;
    g.add(cyl(.35, .4, .1, PAL.stoneD, -.3, 0, 0, 12)); const t = cyl(.24, .24, 1.8, '#d8eef6', -.3, .1, 0, 14); t.material = glassM(k); g.add(t); g.add(cyl(.22, .22, 1.1, '#5b8fd1', -.3, .1, 0, 14));
    for (let i = 0; i < 8; i++) g.add(box(.12, .015, .02, PAL.dark, -.12, .25 + i * .2, .2));
    const r = box(.18, .04, 1.6, '#f4c95d', .55, 0, .1); g.add(r); for (let i = 0; i < 9; i++) g.add(box(.08, .045, .015, PAL.dark, .5, 0, -.6 + i * .18)); } },
  { n: 2, short: '燒杯與冰塊', build: k => { const { g, cyl, box, PAL } = k;
    const b = cyl(.5, .45, 1, '#d8eef6', 0, 0, 0, 14); b.material = glassM(k); g.add(b); g.add(cyl(.44, .42, .55, '#9fd8e6', 0, .02, 0, 14));
    const ice = box(.3, .3, .3, '#f4fbff', .1, .45, .05); ice.rotation.y = .5; g.add(ice); g.add(box(.25, .25, .25, '#f4fbff', .8, 0, .3)).children; } },
  { n: 3, short: '音叉與聲波', build: k => { const { g, box, cyl, mesh, THREE, PAL, A } = k;
    g.add(box(.6, .25, .4, PAL.woodD, 0, 0, 0)); g.add(cyl(.05, .05, .5, '#9aa3ac', 0, .25, 0, 6));
    for (const x of [-.12, .12]) g.add(box(.06, 1, .06, '#c0c8d0', x, .75, 0)); g.add(box(.3, .06, .06, '#c0c8d0', 0, .72, 0));
    const ws = [0, 1, 2].map(i => { const w = mesh(new THREE.TorusGeometry(.3, .025, 4, 24, Math.PI * .7), '#6a4fb0', 0, 1.3, 0); w.rotation.y = Math.PI / 2; w.rotation.x = -Math.PI * .35 + Math.PI / 2; g.add(w); return w; });
    A(t => ws.forEach((w, i) => { const p = (t * .8 + i / 3) % 1; w.scale.setScalar(1 + p * 2.2); w.position.x = .2 + p * .6; w.material.transparent = true; w.material.opacity = 1 - p; })); } },
  { n: 4, short: '三稜鏡與彩虹', build: k => { const { g, box, prism, PAL } = k;
    const pr = prism(1, 1, .8, '#d8eef6', 0, 0, 0); pr.material = glassM(k); g.add(pr);
    g.add(box(1.2, .06, .08, PAL.white, -1, .5, 0));
    ['#e05a47', '#f39b5b', '#f4c95d', '#7fb069', '#5b8fd1', '#8e6ad8'].forEach((c, i) => { const b = box(1.1, .05, .08, c, .95, .55 - i * .07, 0); b.rotation.z = -.15 - i * .05; g.add(b); }); } },
  { n: 5, short: '酒精燈與溫度計', build: k => { const { g, cyl, cone, ball, box, PAL, A } = k;
    const lamp = cyl(.35, .4, .5, '#d8eef6', -.35, 0, 0, 12); lamp.material = glassM(k); g.add(lamp); g.add(cyl(.32, .37, .3, '#f2a7b5', -.35, 0, 0, 12)); g.add(cyl(.06, .06, .15, PAL.dark, -.35, .5, 0, 6));
    const fl = cone(.12, .45, '#ffb347', -.35, .65, 0, 8); g.add(fl); A(t => { fl.scale.set(1, .85 + Math.sin(t * 12) * .15, 1); });
    g.add(box(.5, .15, .4, PAL.stoneD, .5, 0, 0)); g.add(cyl(.07, .07, 1.6, PAL.white, .5, .15, 0, 8)); g.add(ball(.13, PAL.red, .5, .2, 0, 1)); g.add(cyl(.035, .035, .9, PAL.red, .5, .2, .02, 6)); } },
  { n: 6, short: '原子模型', build: k => { const { g, ball, cyl, mesh, THREE, PAL, A } = k;
    g.add(cyl(.4, .5, .3, PAL.stoneD, 0, 0, 0, 10)); const at = new THREE.Group(); at.position.y = 1.4; g.add(at);
    [[.1, .05, 0, PAL.red], [-.1, 0, .05, '#9aa3ac'], [0, .12, -.08, PAL.red], [0, -.1, .02, '#9aa3ac']].forEach(([x, y, z, c]) => at.add(ball(.13, c, x, y, z, 1)));
    for (let i = 0; i < 3; i++) { const o = new THREE.Group(); o.rotation.set(i * 1.05, i * .6, 0); at.add(o); o.add(mesh(new THREE.TorusGeometry(.75, .015, 4, 40), PAL.dark, 0, 0, 0)); const e = ball(.07, '#5b8fd1', .75, 0, 0, 0); o.add(e); A(t => { const a = t * (1.5 + i * .4); e.position.set(Math.cos(a) * .75, Math.sin(a) * .75, 0); }); } } },
  { n: 7, short: '錐形瓶反應', build: k => { const { g, cyl, ball, PAL, A, THREE } = k;
    const f = cyl(.15, .6, 1, '#d8eef6', 0, 0, 0, 14); f.material = glassM(k); g.add(f); g.add(cyl(.15, .15, .4, '#d8eef6', 0, 1, 0, 10)).children; g.children.at(-1).material = glassM(k);
    g.add(cyl(.3, .56, .45, '#f39b5b', 0, .02, 0, 14));
    for (let i = 0; i < 6; i++) { const b = ball(.05, '#fff', 0, 0, 0, 0); g.add(b); A(t => { const p = (t * .7 + i / 6) % 1; b.position.set(Math.sin(i * 2) * .2 * (1 - p), .1 + p * 1.4, Math.cos(i * 2) * .2 * (1 - p)); b.visible = p < .95; }); } } },
  { n: 8, short: '酸鹼試管架', build: k => { const { g, box, cyl } = k;
    g.add(box(1.8, .1, .5, '#9c6a40', 0, 0, 0)); g.add(box(1.8, .08, .5, '#9c6a40', 0, .55, 0)); for (const x of [-.85, .85]) g.add(box(.08, .6, .5, '#9c6a40', x, 0, 0));
    ['#e05a47', '#f39b5b', '#f4c95d', '#7fb069', '#5b8fd1', '#8e6ad8'].forEach((c, i) => { const x = -.62 + i * .25; const t = cyl(.08, .08, .9, '#d8eef6', x, .1, 0, 10); t.material = glassM(k); g.add(t); g.add(cyl(.075, .075, .45, c, x, .12, 0, 10)); }); } },
  { n: 9, short: '碼錶（反應速率）', build: k => { const { g, cyl, box, PAL, A } = k;
    const face = cyl(.7, .7, .2, PAL.white, 0, 0, 0, 24); face.rotation.x = Math.PI / 2; face.position.set(0, 1.1, 0); g.add(face);
    const rim = cyl(.75, .75, .16, '#6a4fb0', 0, 0, 0, 24); rim.rotation.x = Math.PI / 2; rim.position.set(0, 1.1, -.03); g.add(rim);
    g.add(cyl(.1, .1, .25, '#6a4fb0', 0, 1.82, 0, 8)); g.add(box(.5, .35, .4, PAL.stoneD, 0, 0, 0)); g.add(box(.15, .4, .15, '#6a4fb0', 0, .35, 0));
    const h = box(.04, .55, .03, PAL.red, 0, 0, 0); h.geometry.translate(0, .275, 0); h.position.set(0, 1.1, .12); g.add(h); A(t => { h.rotation.z = -t * 2; }); } },
  { n: 10, short: '有機分子', build: k => { const { g, ball, cyl, PAL, A, THREE } = k;
    g.add(cyl(.4, .5, .3, PAL.stoneD, 0, 0, 0, 10)); const m = new THREE.Group(); m.position.y = 1.3; g.add(m);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, x = Math.cos(a) * .55, y = Math.sin(a) * .55; m.add(ball(.13, PAL.dark, x, y, 0, 1)); m.add(ball(.08, PAL.white, x * 1.6, y * 1.6, 0, 1));
      const b = cyl(.025, .025, .55, '#9aa3ac', 0, 0, 0, 4); b.position.set((x + Math.cos(a + 1.047) * .55) / 2, (y + Math.sin(a + 1.047) * .55) / 2, 0); b.rotation.z = a + 1.047 + Math.PI; m.add(b); }
    A(t => { m.rotation.y = t * .5; }); } },
  { n: 11, short: '彈簧秤', build: k => { const { g, box, cyl, mesh, THREE, PAL, A } = k;
    g.add(box(.1, 2.2, .1, PAL.woodD, -.5, 0, 0)); g.add(box(.9, .1, .1, PAL.woodD, -.1, 2.2, 0));
    const sp = new THREE.Group(); sp.position.set(.25, 2.2, 0); g.add(sp);
    const coil = mesh(new THREE.CylinderGeometry(.12, .12, 1, 10, 1, true), '#9aa3ac', 0, -.5, 0); sp.add(coil); for (let i = 0; i < 8; i++) sp.add(mesh(new THREE.TorusGeometry(.12, .02, 4, 12), '#7a848c', 0, -.1 - i * .12, 0)).children; sp.children.forEach((c, i) => { if (i > 0) c.rotation.x = Math.PI / 2; });
    const wt = box(.4, .35, .4, '#6a4fb0', 0, 0, 0); sp.add(wt); A(t => { const s = 1 + Math.sin(t * 3) * .12; sp.scale.y = s; wt.position.y = -1.3; wt.scale.y = 1 / s; }); } },
  { n: 12, short: '斜坡小車', build: k => { const { g, box, cyl, PAL, A, THREE } = k;
    const ramp = box(2.2, .08, .6, PAL.wood, 0, 0, 0); ramp.rotation.z = .3; ramp.position.y = .35; g.add(ramp); g.add(box(.1, .7, .6, PAL.woodD, .95, 0, 0));
    const car = new THREE.Group(); g.add(car); car.add(box(.4, .2, .3, '#e05a47', 0, .1, 0)); for (const x of [-.13, .13]) for (const z of [-.17, .17]) { const w = cyl(.07, .07, .04, PAL.dark, x, 0, z, 8); w.rotation.x = Math.PI / 2; w.position.y = .07; car.add(w); }
    A(t => { const p = (t * .35) % 1; const x = .85 - p * 1.7; car.position.set(x, .38 + x * Math.tan(.3) + .02, 0); car.rotation.z = .3; }); } },
  { n: 13, short: '牛頓擺', build: k => { const { g, box, cyl, ball, PAL, A, THREE } = k;
    g.add(box(1.6, .1, .7, PAL.dark, 0, 0, 0)); for (const x of [-.75, .75]) for (const z of [-.3, .3]) g.add(cyl(.03, .03, 1.5, '#c0c8d0', x, .1, z, 4)); for (const z of [-.3, .3]) g.add(box(1.55, .04, .04, '#c0c8d0', 0, 1.6, z));
    const bs = [-.4, -.2, 0, .2, .4].map((x, i) => { const p = new THREE.Group(); p.position.set(x, 1.6, 0); g.add(p); p.add(cyl(.008, .008, 1, '#4a443e', 0, -1, 0, 3)); p.add(ball(.1, '#c0c8d0', 0, -1.05, 0, 1)); return p; });
    A(t => { const s = Math.sin(t * 3); bs[0].rotation.z = s < 0 ? s * .6 : 0; bs[4].rotation.z = s > 0 ? s * .6 : 0; }); } },
  { n: 14, short: '滑輪（功與能）', build: k => { const { g, box, cyl, PAL, A } = k;
    g.add(box(.1, 2.3, .1, PAL.woodD, -.6, 0, 0)); g.add(box(1, .1, .1, PAL.woodD, -.15, 2.3, 0));
    const wh = cyl(.25, .25, .1, '#9aa3ac', 0, 0, 0, 16); wh.rotation.x = Math.PI / 2; wh.position.set(.25, 2.05, 0); g.add(wh);
    const r1 = box(.02, 1, .02, PAL.dark, 0, 0, 0), r2 = box(.02, 1, .02, PAL.dark, 0, 0, 0); g.add(r1, r2);
    const wt = box(.35, .35, .35, '#6a4fb0', 0, 0, 0), hand = box(.15, .15, .15, PAL.yellow, 0, 0, 0); g.add(wt, hand);
    A(t => { const y = 1 + Math.sin(t * 1.2) * .5; wt.position.set(.5, y - .18, 0); hand.position.set(0, 2.6 - y - .3, 0); r1.scale.y = 2.05 - y; r1.position.set(.5, (2.05 + y) / 2, 0); r2.scale.y = y - .25; r2.position.set(0, 2.05 - (y - .25) / 2, 0); wh.rotation.z = -y * 3; }); } },
  { n: 15, short: '電池與燈泡', build: k => { const { g, box, cyl, ball, PAL, M, A } = k;
    g.add(box(1.8, .08, 1, PAL.wood, 0, 0, 0)); g.add(cyl(.18, .18, .7, '#2b2b2b', -.5, .08, .2, 12)).children; g.children.at(-1).rotation.z = Math.PI / 2; g.children.at(-1).position.set(-.5, .26, .2); g.add(box(.08, .1, .1, '#c0c8d0', -.11, .22, .2));
    g.add(cyl(.08, .1, .25, '#9aa3ac', .55, .08, .2, 8)); const bulb = ball(.25, '#fff3c4', .55, .55, .2, 1); bulb.material = M('#fff3c4', { emissive: '#ffd34d', emissiveIntensity: .8 }); g.add(bulb);
    for (const [x1, x2] of [[-.85, .45], [-.15, .65]]) g.add(box(Math.abs(x2 - x1), .02, .02, '#e05a47', (x1 + x2) / 2, .1, -.25));
    A(t => { bulb.material.emissiveIntensity = .6 + Math.sin(t * 2) * .25; }); } },
  { n: 16, short: '電風扇與插座', build: k => { const { g, box, cyl, PAL, A, THREE } = k;
    g.add(cyl(.35, .4, .1, PAL.white, 0, 0, 0, 12)); g.add(cyl(.05, .05, 1.2, PAL.white, 0, .1, 0, 6));
    const head = new THREE.Group(); head.position.set(0, 1.4, .1); g.add(head); head.add(cyl(.12, .12, .25, PAL.white, 0, 0, -.1, 8)).children; head.children.at(-1).rotation.x = Math.PI / 2;
    const bl = new THREE.Group(); bl.position.z = .1; head.add(bl); for (let i = 0; i < 3; i++) { const b = box(.16, .5, .02, '#5b8fd1', 0, .25, 0); const p = new THREE.Group(); p.rotation.z = i * 2.094; p.add(b); bl.add(p); }
    A(t => { bl.rotation.z = t * 10; head.rotation.y = Math.sin(t * .6) * .5; });
    g.add(box(.4, .5, .08, PAL.white, .8, 0, -.3)); g.add(box(.04, .12, .02, PAL.dark, .73, .25, -.25)); g.add(box(.04, .12, .02, PAL.dark, .87, .25, -.25)); } },
  { n: 17, short: '大電池', build: k => { const { g, cyl, box, PAL } = k;
    g.add(cyl(.45, .45, 1.6, '#2f8a63', 0, 0, 0, 16)); g.add(cyl(.46, .46, .5, '#f4c95d', 0, 1.1, 0, 16)); g.add(cyl(.15, .15, .15, '#c0c8d0', 0, 1.6, 0, 10));
    g.add(box(.3, .08, .02, PAL.white, 0, .5, .46)); g.add(box(.08, .3, .02, PAL.white, 0, .5, .46));
    g.add(cyl(.25, .25, .5, '#f4e04d', .8, 0, .3, 10)).children; } },
  { n: 18, short: '馬蹄形磁鐵', build: k => { const { g, mesh, box, cyl, THREE, PAL, A } = k;
    const u = mesh(new THREE.TorusGeometry(.5, .17, 8, 20, Math.PI), '#e05a47', 0, 1.4, 0); u.rotation.z = 0; g.add(u);
    g.add(box(.34, .7, .34, '#e05a47', -.5, .7, 0)); g.add(box(.34, .7, .34, '#5b8fd1', .5, .7, 0)); g.add(box(.36, .2, .36, '#d8d8d8', -.5, .5, 0)); g.add(box(.36, .2, .36, '#d8d8d8', .5, .5, 0));
    const cp = new THREE.Group(); cp.position.set(0, 0, .8); g.add(cp); cp.add(cyl(.3, .3, .08, PAL.white, 0, 0, 0, 16)); const nd = box(.05, .02, .45, PAL.red, 0, .1, 0); cp.add(nd); A(t => { nd.rotation.y = Math.sin(t * 1.5) * .6; }); } },
  { n: 19, short: '太陽能板', build: k => { const { g, box, cyl, ball, PAL, M, A } = k;
    g.add(box(.1, .8, .1, '#9aa3ac', 0, 0, 0)); const p = box(1.8, .06, 1.1, '#2b3a73', 0, .8, 0); p.rotation.x = -.5; g.add(p);
    for (let i = 0; i < 4; i++) { const l = box(.02, .07, 1.1, '#9fb8e6', -.68 + i * .45, .8, 0); l.rotation.x = -.5; g.add(l); }
    const sun = ball(.3, '#ffd34d', -.6, 2.3, -.6, 1); sun.material = M('#ffd34d', { emissive: '#ffb300', emissiveIntensity: .5 }); g.add(sun); A(t => { sun.position.y = 2.3 + Math.sin(t) * .1; }); } },
  { key: 'valence', short: '價數表', title: '價數表（離子與原子團）', href: '../physchem/#valence', desc: '常見離子與原子團的價數、化學式寫法與命名，可遮住符號自我測驗。',
    build: k => { const { g, box, PAL } = k;
      g.add(box(.08, 1.6, .08, PAL.woodD, -.8, 0, 0)); g.add(box(.08, 1.6, .08, PAL.woodD, .8, 0, 0));
      const rows = ['#d0533f', '#d0533f', '#d0533f', '#3b6fb6', '#3b6fb6'];
      rows.forEach((c, r) => { g.add(box(.3, .22, .06, c, -.55, 1.55 - r * .27, 0)); for (let i = 0; i < 4 - (r === 2 ? 2 : 0); i++) g.add(box(.22, .22, .05, r % 3 === 1 ? '#ebe4f7' : PAL.white, -.22 + i * .26, 1.55 - r * .27, 0)); });
      g.add(box(1.7, 1.45, .04, '#f7f3ea', 0, .32 + .3, -.04)); } },
];

// 數學：一單元一個物件
const triShape = (k, pts) => { const s = new k.THREE.Shape(); s.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(([x, y]) => s.lineTo(x, y)); s.closePath(); return s; };
const extrude = (k, pts, d, c, x, y, z) => { const geo = new k.THREE.ExtrudeGeometry(triShape(k, pts), { depth: d, bevelEnabled: false }); geo.translate(0, 0, -d / 2); return k.mesh(geo, c, x, y, z); };
const signFace = (k, text, w, h, bg, size) => { const { THREE, M, PAL, textTex } = k; return new THREE.Mesh(new THREE.BoxGeometry(w, h, .05), [M(PAL.wood), M(PAL.wood), M(PAL.wood), M(PAL.wood), new THREE.MeshBasicMaterial({ map: textTex(text, { w: 256, h: Math.round(256 * h / w), size, bg, fg: '#fff' }) }), M(PAL.wood)]); };
LANDMARKS.math = [
  { n: 1, short: '數線', build: k => { const { g, box, cone, ball, PAL } = k;
    for (const x of [-1, 1]) g.add(box(.1, .5, .1, PAL.woodD, x, 0, 0));
    g.add(box(2.5, .08, .1, PAL.dark, 0, .5, 0)); const ar = cone(.12, .26, PAL.dark, 0, 0, 0, 6); ar.rotation.z = -Math.PI / 2; ar.position.set(1.32, .54, 0); g.add(ar);
    for (let i = -4; i <= 4; i++) g.add(box(.04, .26, .05, i === 0 ? PAL.red : PAL.dark, i * .27, .42, 0));
    g.add(ball(.11, PAL.blue, -.81, .74, 0, 1)); g.add(ball(.11, PAL.blue, .81, .74, 0, 1)); } },
  { n: 2, short: '分數派', build: k => { const { g, mesh, THREE, PAL, A } = k;
    g.add(mesh(new THREE.CylinderGeometry(.95, .95, .3, 24, 1, false, 0, Math.PI * 1.5), PAL.yellow, 0, .15, 0));
    const sl = mesh(new THREE.CylinderGeometry(.95, .95, .3, 8, 1, false, Math.PI * 1.5, Math.PI * .5), PAL.red, -.22, .15, .22); g.add(sl);
    A(t => { sl.position.y = .2 + Math.abs(Math.sin(t * 1.5)) * .35; }); } },
  { n: 3, short: '天平（方程式）', build: k => { const { g, box, cyl, THREE, PAL, A } = k;
    g.add(box(1, .12, .5, PAL.woodD, 0, 0, 0)); g.add(cyl(.06, .06, 1.45, PAL.dark, 0, .12, 0, 6));
    const bm = new THREE.Group(); bm.position.y = 1.6; g.add(bm); bm.add(box(2, .07, .07, PAL.dark, 0, -.035, 0));
    for (const x of [-.9, .9]) { bm.add(cyl(.01, .01, .5, PAL.dark, x, -.5, 0, 3)); bm.add(cyl(.36, .3, .06, '#c0c8d0', x, -.56, 0, 12)); }
    bm.add(box(.26, .26, .26, PAL.blue, -.9, -.5, 0)); bm.add(box(.18, .18, .18, PAL.red, .8, -.5, 0)); bm.add(box(.18, .18, .18, PAL.red, 1, -.5, 0));
    A(t => { bm.rotation.z = Math.sin(t * 1.2) * .06; }); } },
  { n: 4, short: '兩直線交點', build: k => { const { g, box, ball, PAL } = k;
    for (const x of [-.8, .8]) g.add(box(.08, .3, .08, PAL.woodD, x, 0, 0));
    g.add(box(1.9, 1.6, .06, PAL.white, 0, .3, -.1));
    const l1 = box(2, .07, .05, PAL.blue, 0, 0, 0); l1.position.set(0, 1.1, -.05); l1.rotation.z = .5; g.add(l1);
    const l2 = box(2, .07, .05, PAL.red, 0, 0, 0); l2.position.set(0, 1.1, -.04); l2.rotation.z = -.35; g.add(l2);
    g.add(ball(.1, PAL.yellow, 0, 1.1, 0, 1)); } },
  { n: 5, short: '坐標平面', build: k => { const { g, box, cyl, ball, PAL } = k;
    g.add(box(2.2, .06, 2.2, PAL.white, 0, 0, 0));
    for (let i = -4; i <= 4; i++) { g.add(box(2.2, .01, .015, PAL.gray, 0, .06, i * .25)); g.add(box(.015, .01, 2.2, PAL.gray, i * .25, .06, 0)); }
    g.add(box(2.3, .03, .05, PAL.dark, 0, .07, 0)); g.add(box(.05, .03, 2.3, PAL.dark, 0, .07, 0));
    g.add(cyl(.02, .02, .8, PAL.dark, .5, .06, -.5, 4)); g.add(box(.32, .18, .02, PAL.red, .67, .68, -.5)); g.add(ball(.08, PAL.red, .5, .1, -.5, 1)); } },
  { n: 6, short: '齒輪（比例）', build: k => { const { g, box, cyl, THREE, PAL, A } = k;
    g.add(box(2, .15, .5, PAL.stoneD, 0, 0, 0)); g.add(box(.12, 1, .12, PAL.dark, -.35, .15, -.15)); g.add(box(.12, .9, .12, PAL.dark, .67, .15, -.15));
    const gear = (r, n, c, x) => { const G = new THREE.Group(); G.position.set(x, 1.15, 0); G.rotation.x = Math.PI / 2; G.add(cyl(r, r, .2, c, 0, -.1, 0, 20));
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, t = box(.14, .2, .14, c, Math.cos(a) * (r + .06), -.1, Math.sin(a) * (r + .06)); t.rotation.y = -a; G.add(t); } g.add(G); return G; };
    const g1 = gear(.6, 12, PAL.blue, -.35), g2 = gear(.3, 6, PAL.yellow, .67); g2.position.y = 1.05;
    A(t => { g1.rotation.y = t * .8; g2.rotation.y = -t * 1.6; }); } },
  { n: 7, short: '不等號', build: k => { const { g, box, cyl, PAL } = k;
    g.add(cyl(.5, .55, .2, PAL.stoneD, 0, 0, 0, 12));
    const a = box(.9, .2, .2, PAL.red, 0, 0, 0); a.position.set(0, 1.5, 0); a.rotation.z = -.42; g.add(a);
    const b = box(.9, .2, .2, PAL.red, 0, 0, 0); b.position.set(0, 1.12, 0); b.rotation.z = .42; g.add(b);
    g.add(cyl(.05, .05, .75, PAL.dark, -.35, .2, 0, 6)); } },
  { n: 8, short: '積木三視圖', build: k => { const { g, box, PAL, THREE, M } = k;
    for (const [x, y, z, c] of [[-.35, 0, 0, PAL.blue], [0, 0, 0, PAL.blue], [.35, 0, 0, PAL.blue], [-.35, 0, .35, PAL.yellow], [-.35, .35, 0, PAL.red], [0, .35, 0, PAL.red]]) g.add(box(.33, .33, .33, c, x, y, z));
    const mir = new THREE.Mesh(new THREE.BoxGeometry(.03, 1.3, 1.3), new THREE.MeshStandardMaterial({ color: '#d8eef6', transparent: true, opacity: .45, roughness: .15 })); mir.position.set(.8, .65, .15); g.add(mir); } },
  { n: 9, short: '長條圖', build: k => { const { g, box, PAL } = k;
    g.add(box(2, .08, .8, PAL.white, 0, 0, 0)); g.add(box(.06, 1.6, .06, PAL.dark, -.95, .08, -.35)); g.add(box(1.95, .06, .06, PAL.dark, 0, .08, -.35));
    [.6, 1.2, .9, 1.45, .4].forEach((h, i) => g.add(box(.26, h, .4, [PAL.blue, PAL.red, PAL.yellow, PAL.leaf, PAL.pink][i], -.6 + i * .32, .08, 0))); } },
  { n: 10, short: '(a＋b)² 方塊', build: k => { const { g, box, PAL } = k;
    g.add(box(1.1, .35, 1.1, PAL.blue, -.3, 0, -.3)); g.add(box(.6, .2, .6, PAL.red, .58, 0, .58));
    g.add(box(.6, .27, 1.1, PAL.yellow, .58, 0, -.3)); g.add(box(1.1, .27, .6, PAL.yellow, -.3, 0, .58)); } },
  { n: 11, short: '畢氏定理', build: k => { const { g, box, PAL } = k;
    g.add(box(1.6, .2, .6, PAL.stoneD, 0, 0, .2)); g.add(extrude(k, [[0, 0], [1.2, 0], [0, .9]], .2, PAL.yellow, -.6, .2, .3));
    for (const x of [-.75, .75]) g.add(box(.07, 1.7, .07, PAL.woodD, x, 0, -.35)); const s = signFace(k, 'a²＋b²＝c²', 1.6, .55, '#a8326e', 46); s.position.set(0, 1.6, -.33); g.add(s); } },
  { n: 12, short: '代數磚', build: k => { const { g, box, PAL } = k;
    g.add(box(1, .16, 1, PAL.blue, -.45, 0, -.2));
    for (let i = 0; i < 2; i++) g.add(box(.25, .16, 1, PAL.leaf, .2 + i * .27, 0, -.2));
    g.add(box(1, .16, .25, PAL.leaf, -.45, 0, .45));
    for (let i = 0; i < 2; i++) g.add(box(.25, .16, .25, PAL.yellow, .2 + i * .27, 0, .45)); } },
  { n: 13, short: '等差階梯', build: k => { const { g, box, PAL } = k;
    for (let i = 0; i < 5; i++) for (let j = 0; j <= i; j++) g.add(box(.36, .3, .6, i % 2 ? PAL.blue : PAL.red, -.8 + i * .4, j * .3, 0)); } },
  { n: 14, short: '函數圖形板', build: k => { const { g, box, ball, PAL, A } = k;
    for (const x of [-.8, .8]) g.add(box(.08, .3, .08, PAL.woodD, x, 0, 0));
    g.add(box(1.9, 1.5, .06, PAL.white, 0, .3, -.1));
    for (let i = 0; i < 6; i++) { g.add(box(1.8, .01, .02, PAL.gray, 0, .4 + i * .26, -.06)); g.add(box(.01, 1.4, .02, PAL.gray, -.85 + i * .34, .35, -.06)); }
    const ln = box(1.9, .06, .05, PAL.blue, 0, 0, 0); ln.position.set(0, 1.05, -.03); ln.rotation.z = .55; g.add(ln);
    const p = ball(.09, PAL.red, 0, 1.05, 0, 1); g.add(p); A(t => { const x = Math.sin(t * .9) * .7; p.position.set(x, 1.05 + x * Math.tan(.55), 0); }); } },
  { n: 15, short: '圓規與三角形', build: k => { const { g, box, cyl, ball, THREE, PAL, A } = k;
    const tr = extrude(k, [[-.8, 0], [.8, 0], [.1, 1.1]], .1, PAL.yellow, 0, 0, 0); tr.rotation.x = -Math.PI / 2; tr.position.set(0, .05, .55); g.add(tr);
    const cp = new THREE.Group(); cp.position.set(0, 1.6, -.1); g.add(cp); cp.add(ball(.08, PAL.dark, 0, 0, 0, 1)); cp.add(cyl(.03, .03, .25, PAL.dark, 0, 0, 0, 6));
    const legs = [-1, 1].map(s => { const l = box(.05, 1.5, .05, s < 0 ? '#9aa3ac' : PAL.red, 0, -1.5, 0); const p = new THREE.Group(); p.add(l); cp.add(p); return [p, s]; });
    A(t => { const a = .3 + Math.sin(t) * .08; legs.forEach(([p, s]) => { p.rotation.z = s * a; }); cp.rotation.y = t * .5; }); } },
  { n: 16, short: '平行四邊形', build: k => { const { g, box, PAL } = k;
    for (const z of [-.6, .6]) g.add(box(2.4, .08, .08, PAL.dark, 0, 0, z));
    const pg = extrude(k, [[-1, 0], [.4, 0], [1, 1], [-.4, 1]], .25, PAL.blue, 0, 0, 0); pg.rotation.x = -Math.PI / 2; pg.position.set(0, .2, .5); g.add(pg); } },
  { n: 17, short: '相似三角形', build: k => { const { g, box, PAL } = k;
    g.add(box(2.4, .12, .5, PAL.stoneD, 0, 0, 0));
    [[.45, -.85, PAL.red], [.75, -.2, PAL.yellow], [1.05, .65, PAL.blue]].forEach(([s, x, c]) => g.add(extrude(k, [[0, 0], [s, 0], [0, s * 1.3]], .15, c, x - s / 2, .12, 0))); } },
  { n: 18, short: '圓與扇形', build: k => { const { g, box, cyl, mesh, THREE, PAL, A } = k;
    g.add(box(1.2, .12, .5, PAL.stoneD, 0, 0, 0)); for (const x of [-.35, .35]) { const l = box(.07, 1.3, .07, PAL.dark, 0, 0, 0); l.position.set(x * .6, .75, 0); l.rotation.z = -x * .7; g.add(l); }
    const w = new THREE.Group(); w.position.set(0, 1.35, .1); g.add(w); w.add(mesh(new THREE.TorusGeometry(.85, .05, 6, 36), PAL.dark, 0, 0, 0));
    for (let i = 0; i < 8; i++) { const s = box(.03, .85, .03, '#9aa3ac', 0, 0, 0); s.geometry.translate(0, .425, 0); s.rotation.z = i / 8 * Math.PI * 2; w.add(s); }
    const sec = mesh(new THREE.CircleGeometry(.83, 16, 0, Math.PI / 4), PAL.red, 0, 0, .02); w.add(sec);
    A(t => { w.rotation.z = t * .4; }); } },
  { n: 19, short: '三角形的內心', build: k => { const { g, box, ball, mesh, THREE, PAL } = k;
    g.add(box(1.9, .3, .4, PAL.stoneD, 0, 0, 0));
    const bar = (cx, cy, rz) => { const b = box(1.6, .07, .07, '#a8326e', 0, 0, 0); b.position.set(cx, cy, 0); b.rotation.z = rz; g.add(b); };
    bar(0, .33, 0); bar(-.4, 1.023, 1.047); bar(.4, 1.023, -1.047);
    g.add(mesh(new THREE.TorusGeometry(.43, .03, 6, 36), PAL.blue, 0, .792, 0)); g.add(ball(.07, PAL.red, 0, .792, 0, 1)); } },
  { n: 20, short: '拋物線噴泉', build: k => { const { g, cyl, ball, PAL, A } = k;
    g.add(cyl(1, 1.05, .25, PAL.stoneD, 0, 0, 0, 20)); g.add(cyl(.9, .9, .12, '#9fd8e6', 0, .14, 0, 20)); g.add(cyl(.12, .14, .5, PAL.stone, 0, .2, 0, 10));
    for (let i = 0; i <= 16; i++) { const x = -.8 + i * .1; g.add(ball(.045, '#5b8fd1', x, 2 - 2.4 * x * x, 0, 0)); }
    const d = ball(.08, '#9fd8e6', 0, 0, 0, 1); g.add(d); A(t => { const x = ((t * .4) % 1) * 1.6 - .8; d.position.set(x, 2 - 2.4 * x * x, 0); }); } },
  { n: 21, short: '骰子（機率）', build: k => { const { g, box, ball, THREE, PAL, A } = k;
    const dice = (x, z, s) => { const D = new THREE.Group(); D.position.set(x, s / 2 + .02, z); g.add(D); D.add(box(s, s, s, PAL.white, 0, -s / 2, 0)); const h = s / 2 + .005, r = s * .09;
      D.add(ball(r, PAL.red, 0, h, 0, 0)); for (const o of [-1, 1]) D.add(ball(r, PAL.dark, o * s * .25, o * s * .25, h, 0)); for (const o of [-1, 0, 1]) D.add(ball(r, PAL.dark, h, o * s * .25, o * s * .25, 0)); return D; };
    const d1 = dice(-.45, 0, .75); dice(.55, .3, .55).rotation.y = .6; A(t => { d1.rotation.y = t * .6; }); } },
  { n: 22, short: '柱體與錐體', build: k => { const { g, box, cyl, cone, PAL } = k;
    g.add(box(2.3, .1, .9, PAL.stone, 0, 0, 0));
    g.add(cyl(.35, .35, 1.1, PAL.blue, -.75, .1, 0, 16)); g.add(cone(.42, 1.3, PAL.red, 0, .1, 0, 16));
    const py = cone(.45, 1.1, PAL.yellow, .78, .1, 0, 4); py.rotation.y = Math.PI / 4; g.add(py); } },
];
