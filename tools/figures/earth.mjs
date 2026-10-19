// 地科附圖（自行繪製的示意圖）
import { C, svg, T, TV, R, O, E, P, L, G, A, AQ, B, callout, smooth, legend, note, geomap } from './lib.mjs';

const F = {};
const fig = (k, cap, fn) => { F[k] = { cap, svg: fn }; };
const ROCK = { sand: '#f1d9a0', shale: '#c9b8a3', gravel: '#d8c4a0', soil: '#b98f62' };

fig('u1-s2', '地下水的分布：地下水面以下為飽和帶', () => {
  const w = 780, h = 360;
  let s = R(0, 0, w, 100, { fill: '#e8f3fb', stroke: 'none', r: 0 });
  s += P('M0 120 C120 100 200 90 300 105 C380 118 420 140 470 150 L560 150 C620 140 700 110 780 100 L780 360 L0 360Z', { fill: '#cfa978', stroke: 'none' });
  s += P('M0 200 C200 190 380 180 470 175 L560 175 C650 170 720 165 780 160 L780 300 L0 300Z', { fill: '#a9cfe8', stroke: 'none', op: .85 }); // 飽和帶
  s += L(0, 200, 470, 175, { stroke: C.blue, sw: 2, dash: '7 5' }) + L(560, 175, 780, 160, { stroke: C.blue, sw: 2, dash: '7 5' });
  s += R(0, 300, w, 60, { fill: '#8f7c68', stroke: 'none', r: 0 });
  for (let x = 10; x < w; x += 40) s += L(x, 318, x + 24, 318, { stroke: '#6f5f50', sw: 1.5 }) + L(x + 14, 340, x + 38, 340, { stroke: '#6f5f50', sw: 1.5 });
  s += P('M470 150 C490 175 540 175 560 150Z', { fill: '#5d9fd4', stroke: 'none' }); // 湖
  s += R(200, 60, 30, 40, { fill: '#c97a4a', stroke: '#8b4a2a', r: 2 }) + P('M195 60 L215 45 L235 60Z', { fill: '#8b4a2a' });
  s += R(240, 92, 10, 150, { fill: '#7a8a96', stroke: 'none', r: 1 }) + R(241, 196, 8, 46, { fill: C.blue, stroke: 'none', r: 0 }); // 井
  s += P('M640 128 C650 140 660 148 690 150', { stroke: C.blue, sw: 3 }) + O(640, 128, 5, { fill: C.blue, stroke: 'none' }); // 泉
  s += T(100, 150, '不飽和帶（未飽和帶）', { size: 14, weight: 700 }) + T(100, 170, '孔隙中有空氣與水', { size: 12, fill: C.muted });
  s += T(110, 245, '飽和帶：孔隙充滿地下水', { size: 14, weight: 700, fill: '#1f4f7a' });
  s += callout(380, 182, 380, 230, '地下水面', { anchor: 'middle', weight: 700, color: C.blue });
  s += callout(245, 120, 110, 40, '水井：須挖到地下水面以下', { anchor: 'middle', size: 12 });
  s += callout(515, 160, 470, 40, '湖泊、河流：地下水面\n高於地表處', { anchor: 'middle', size: 12 });
  s += callout(640, 128, 670, 50, '泉水：地下水面與\n地表相交處湧出', { anchor: 'middle', size: 12 });
  s += T(390, 330, '不透水層（如頁岩、黏土層）：孔隙小，阻擋地下水往下流', { size: 13, fill: '#fff', weight: 700 });
  s += T(640, 230, '透水層：砂岩、礫岩\n孔隙大，容易儲存地下水', { size: 12 });
  return svg(w, h, s);
});

fig('u1-s4', '岩石循環：三大岩類可以互相轉變', () => {
  const w = 760, h = 430;
  let s = '';
  const node = (x, y, t, sub, c, f) => O(x, y, 52, { fill: f, stroke: c, sw: 3 }) + T(x, y - 8, t, { size: 17, weight: 700, fill: c }) + T(x, y + 16, sub, { size: 11, fill: C.muted });
  s += node(380, 70, '岩漿', '地底熔融的物質', '#c0392b', '#fde0d6');
  s += node(130, 230, '火成岩', '玄武岩、花岡岩', '#8a5a2b', '#f3e6d6');
  s += node(380, 230, '變質岩', '大理岩、板岩', '#6c4fa0', '#ece4f6');
  s += node(630, 230, '沉積岩', '砂岩、頁岩、石灰岩', '#2f8a63', '#e2f2e9');
  s += node(380, 375, '沉積物', '砂、泥、礫', '#7a6a55', '#f1ece2');
  const lab = (x, y, t, c) => T(x, y, t, { size: 13, weight: 700, fill: c, halo: true });
  s += A([[340, 110], [170, 190]], { stroke: C.blue, sw: 3 }) + lab(230, 135, '冷卻凝固', C.blue);
  s += A([[175, 280], [330, 360]], { stroke: C.green, sw: 2.5 }) + lab(220, 335, '風化、侵蝕', C.green);
  s += A([[595, 268], [428, 348]], { stroke: C.green, sw: 2.5 }) + lab(500, 290, '風化、侵蝕', C.green);
  s += A([[432, 395], [640, 284]], { stroke: C.brown, sw: 2.5 }) + lab(610, 370, '搬運、沉積\n膠結固化', C.brown);
  s += A([[185, 230], [325, 230]], { stroke: C.purple, sw: 2.5 }) + lab(255, 215, '高溫高壓', C.purple) + lab(255, 245, '變質作用', C.purple);
  s += A([[575, 230], [435, 230]], { stroke: C.purple, sw: 2.5 }) + lab(505, 215, '高溫高壓', C.purple) + lab(505, 245, '變質作用', C.purple);
  s += A([[380, 175], [380, 125]], { stroke: C.red, sw: 2.5 }) + lab(400, 152, '熔融', C.red).replace('text-anchor="middle"', 'text-anchor="start"');
  s += A([[610, 185], [425, 100]], { stroke: C.red, sw: 2.5, dash: '6 4' }) + lab(560, 125, '熔融', C.red);
  s += A([[150, 180], [330, 95]], { stroke: C.red, sw: 2.5, dash: '6 4' }) + lab(200, 110, '熔融', C.red);
  return svg(w, h, s);
});

fig('u1-s6', '河流上、中、下游的地形與沉積物', () => {
  const w = 800, h = 340;
  let s = '';
  s += P('M20 60 L220 60 L320 230 L780 300 L20 300Z', { fill: '#d9e8c4', stroke: 'none' });
  s += P('M20 40 L120 40 L160 100 L20 100Z', { fill: '#a9c78a', stroke: 'none' });
  s += P('M40 70 C100 80 160 120 220 160 C270 190 280 200 330 205 C390 210 380 250 440 240 C500 230 480 270 560 268 C640 266 700 285 780 290', { stroke: '#4f94cf', sw: 6 });
  s += P('M640 280 L780 270 L780 300 L600 300Z', { fill: '#4f94cf', stroke: 'none' }) + T(740, 315, '海平面（最終侵蝕基準面）', { size: 12, anchor: 'end', fill: C.blue });
  s += P('M600 280 L660 268 L720 285 L650 296Z', { fill: '#e9d9a8', stroke: '#c9b07a' });
  const box = (x, t1, t2, t3, rocks) => R(x, 20, 230, 34, { fill: C.soft, stroke: 'none', r: 6 }) + T(x + 115, 37, t1, { size: 15, weight: 700 }) + T(x + 115, 75, t2, { size: 12, halo: true }) + T(x + 115, 95, t3, { size: 12, fill: C.muted, halo: true }) + rocks;
  s += box(20, '上游', '坡度大、流速快，向下侵蝕', '形成 V 形谷；顆粒大、稜角多', O(60, 125, 14, { fill: '#a39a8f', stroke: C.ink, sw: 1 }).replace('<circle', '<circle'));
  s += box(285, '中游', '坡度變緩，側向侵蝕', '形成曲流；顆粒較小', '');
  s += box(550, '下游', '坡度小、流速慢，以堆積為主', '沖積平原、三角洲；顆粒小、較圓', '');
  s += P('M60 140 L45 175 L75 175Z', { fill: '#8a7d70' }) + P('M85 150 L80 172 L100 168Z', { fill: '#8a7d70' });
  s += O(370, 160, 9, { fill: '#a39a8f', stroke: C.ink, sw: 1 }) + O(392, 168, 7, { fill: '#a39a8f', stroke: C.ink, sw: 1 });
  s += O(640, 140, 5, { fill: '#a39a8f', stroke: C.ink, sw: 1 }) + O(654, 144, 4, { fill: '#a39a8f', stroke: C.ink, sw: 1 }) + O(666, 140, 3.5, { fill: '#a39a8f', stroke: C.ink, sw: 1 });
  s += callout(160, 120, 200, 140, 'V 形谷', { anchor: 'start', weight: 700 }) + callout(440, 240, 470, 200, '曲流', { anchor: 'start', weight: 700 }) + callout(660, 282, 620, 230, '三角洲', { anchor: 'end', weight: 700 });
  s += T(20, 325, '由上游到下游：沉積物顆粒由大變小、由有稜角變圓滑', { size: 12, fill: C.muted, anchor: 'start' });
  return svg(w, h, s);
});

fig('u1-s8', '河道泥砂量與海岸線的平衡', () => {
  const w = 760, h = 300;
  let s = '';
  const panel = (x, title, cause, result, adv) => {
    let o = R(x, 20, 350, 260, { fill: '#fff', stroke: C.line, sw: 1, r: 10 }) + R(x, 20, 350, 40, { fill: C.purpleS, stroke: 'none', r: 10 }) + T(x + 175, 40, title, { size: 15, weight: 700 });
    o += T(x + 175, 85, cause, { size: 13 });
    const sea = adv ? 200 : 255;
    o += P(`M${x + 30} 180 L${x + sea} 180 L${x + sea + 40} 240 L${x + 30} 240Z`, { fill: '#c9b07a', stroke: 'none' });
    o += P(`M${x + sea} 180 L${x + 320} 180 L${x + 320} 240 L${x + sea + 40} 240Z`, { fill: '#7fb3dd', stroke: 'none' });
    o += P(`M${x + 40} 180 L${x + 90} 140 L${x + 140} 180Z`, { fill: '#7cb36a', stroke: 'none' });
    o += adv ? A([[x + 300, 165], [x + 230, 165]], { stroke: C.blue, sw: 3 }) + T(x + 270, 150, '海進', { size: 15, weight: 700, fill: C.blue })
      : A([[x + 230, 165], [x + 300, 165]], { stroke: C.orange, sw: 3 }) + T(x + 270, 150, '海退', { size: 15, weight: 700, fill: C.orange });
    o += T(x + 175, 262, result, { size: 14, weight: 700 });
    return o;
  };
  s += panel(20, '泥砂沉積量 ＞ 侵蝕量', '例：坡地開發、濫伐\n→ 河川泥砂量變多', '陸地增加，海岸線向海推進', false);
  s += panel(390, '泥砂沉積量 ＜ 侵蝕量', '例：盜採砂石、興建水庫\n→ 河川供應泥砂減少', '陸地縮小，海岸線後退', true);
  return svg(w, h, s);
});

fig('u2-s1', '固體地球的分層（未依實際比例繪製）', () => {
  const w = 760, h = 420;
  let s = '';
  const cx = 230, cy = 400, R0 = 360;
  const ring = (r, a1, a2) => { const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x1, y1] = p(a1), [x2, y2] = p(a2); return `L${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`; };
  const a1 = -Math.PI * .72, a2 = -Math.PI * .28;
  const layers = [[360, '#f6dc8d'], [335, '#bfe0ee'], [300, '#f5d2d6'], [190, '#f6b77c'], [95, '#e46b4f']];
  for (const [r, c] of layers) s += P(`M${cx} ${cy}${ring(r, a1, a2)}Z`, { fill: c, stroke: '#9a7b5a', sw: 1.2 });
  const lab = (r, t, c = C.ink) => T(cx, cy - r, t, { size: 13, weight: 700, fill: c });
  s += lab(348, '岩石圈（剛性）') + lab(318, '軟流圈（可緩慢流動）') + lab(245, '中下部地函（剛性）') + lab(140, '外核（液態）') + lab(50, '內核（固態）', '#fff');
  const dep = (r, t) => L(cx + r * Math.cos(a2), cy + r * Math.sin(a2), 430, cy - r * .99, { stroke: C.muted, sw: 1, dash: '3 3' }) + T(440, cy - r * .99, t, { size: 13, anchor: 'start' });
  s += dep(360, '地表 0 km') + dep(335, '約 100 km') + dep(300, '約 250 km') + dep(190, '約 2900 km　← 古氏不連續面（地函／地核）') + dep(95, '約 5100 km') + T(cx, cy + 10, '6371 km（地心）', { size: 12 }).replace(`y="${cy + 10}"`, `y="${cy - 12}"`);
  s += T(590, 340, '地殼／地函交界：莫氏不連續面\n（地殼厚度：大陸約 35 km、海洋約 7 km）', { size: 12, fill: C.muted });
  s += T(590, 385, '岩石圈 ＝ 地殼 ＋ 上部地函頂部\n破裂成大小板塊，在軟流圈上移動', { size: 12, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

// 主要板塊邊界（約略位置）
const RIDGE = [
  [[-35, -57], [-15, -50], [-13, -35], [-14, -15], [-15, 0], [-30, 5], [-38, 15], [-45, 22], [-40, 35], [-30, 42], [-28, 52], [-30, 58], [-20, 64], [-12, 70], [0, 75]],
  [[-109, 23], [-105, 10], [-102, 0], [-110, -20], [-115, -35], [-112, -45], [-118, -55], [-140, -60], [-170, -63], [160, -61]],
  [[57, 14], [60, 10], [66, 0], [68, -10], [70, -25], [57, -32], [35, -45], [15, -52], [-5, -54], [-15, -50]],
  [[70, -25], [90, -40], [110, -48], [140, -55], [160, -61]],
  [[33, 28], [38, 20], [43, 13], [50, 13], [57, 14]], [[43, 12], [38, 5], [36, -5], [35, -15]],
];
const TRENCH = [
  [[-145, 59], [-155, 56], [-170, 52], [175, 51], [162, 54]], [[162, 54], [150, 45], [143, 40], [142, 35], [142, 25], [145, 15], [140, 10]],
  [[138, 34], [131, 31], [127, 26], [122, 23.5]], [[120, 22], [119.3, 16], [120, 13]], [[127, 13], [127, 6]],
  [[93, 14], [94, 5], [97, 0], [102, -6], [110, -10], [120, -11], [128, -9]], [[140, -4], [152, -6], [160, -10], [167, -15]],
  [[-173, -15], [-176, -25], [-178, -35], [175, -40]], [[-125, 50], [-125, 42]], [[-105, 19], [-95, 15], [-88, 12], [-83, 8]],
  [[-80, 2], [-81, -8], [-75, -18], [-71, -30], [-74, -45], [-75, -52]],
  [[-10, 36], [0, 37], [12, 38], [25, 35], [35, 36], [45, 35], [55, 28], [65, 26], [73, 33], [80, 30], [88, 27], [95, 27], [97, 18], [93, 14]],
];
const TRANSFORM = [[[-125, 42], [-122, 37], [-116, 32], [-109, 23]]];

fig('u2-s2', '全球主要板塊與板塊邊界（約略位置）', () => {
  const m = geomap({ bbox: [-29.9, -62, 329.9, 78], w: 820, res: '110m', proj: 'equirect', rotate: [-150, 0], borders: false });
  let s = m.base();
  for (const l of RIDGE) s += m.lines(l, { stroke: C.red, sw: 2.5 });
  for (const l of TRENCH) s += m.lines(l, { stroke: C.blue, sw: 2.5 });
  for (const l of TRANSFORM) s += m.lines(l, { stroke: C.green, sw: 2.5 });
  const lab = [['歐亞板塊', [90, 55]], ['北美板塊', [-100, 52]], ['南美板塊', [-60, -15]], ['非洲板塊', [18, 5]], ['印澳板塊', [95, -28]], ['太平洋板塊', [-150, 5]], ['南極板塊', [100, -58]], ['菲律賓海板塊', [137, 14]], ['納茲卡板塊', [-92, -15]]];
  for (const [t, ll] of lab) s += m.label(ll, t, { size: 14, weight: 700, fill: '#5a3e2b' });
  s += m.dot([121, 23.7], '臺灣', { color: C.red, fill: C.red, size: 12, weight: 700 });
  s += legend(10, m.h - 82, [['line', C.red, '張裂性邊界（中洋脊、裂谷）'], ['line', C.blue, '聚合性邊界（海溝、造山帶）'], ['line', C.green, '錯動性邊界（轉形斷層）']], { w: 230, gap: 22, size: 12 });
  return svg(m.w, m.h, s + m.frame());
});

fig('u2-s3', '張裂性板塊邊界的發展：裂谷 → 狹長海洋 → 大洋與中洋脊', () => {
  const w = 800, h = 300;
  let s = '';
  const stage = (x, title, ex, kind) => {
    let o = R(x, 10, 250, 34, { fill: C.soft, stroke: 'none', r: 6 }) + T(x + 125, 27, title, { size: 15, weight: 700 });
    o += R(x, 150, 250, 60, { fill: '#f3b98a', stroke: 'none', r: 0 }); // 地函
    if (kind === 0) o += P(`M${x} 110 L${x + 105} 110 L${x + 115} 130 L${x + 135} 130 L${x + 145} 110 L${x + 250} 110 L${x + 250} 150 L${x} 150Z`, { fill: '#c9a978', stroke: '#8a6a45' }) + P(`M${x + 120} 150 L${x + 125} 128 L${x + 130} 150Z`, { fill: '#e04b2b' });
    if (kind === 1) o += P(`M${x} 105 L${x + 95} 105 L${x + 105} 135 L${x + 145} 135 L${x + 155} 105 L${x + 250} 105 L${x + 250} 150 L${x} 150Z`, { fill: '#c9a978', stroke: '#8a6a45' }) + R(x + 105, 120, 40, 15, { fill: '#6fb0dd', stroke: 'none', r: 0 });
    if (kind === 2) o += P(`M${x} 105 L${x + 35} 105 L${x + 50} 140 L${x + 200} 140 L${x + 215} 105 L${x + 250} 105 L${x + 250} 150 L${x} 150Z`, { fill: '#c9a978', stroke: '#8a6a45' }) + R(x + 45, 112, 160, 28, { fill: '#6fb0dd', stroke: 'none', r: 0 }) + P(`M${x + 100} 140 L${x + 125} 124 L${x + 150} 140Z`, { fill: '#7a5a3a' });
    o += A([[x + 110, 180], [x + 40, 180]], { stroke: C.red, sw: 2 }) + A([[x + 140, 180], [x + 210, 180]], { stroke: C.red, sw: 2 });
    o += AQ(x + 125, 205, x + 125, 160, x + 125, 150, { stroke: C.red, sw: 2 });
    o += T(x + 125, 240, ex, { size: 13 });
    return o;
  };
  s += stage(10, '① 大陸地殼裂開', '裂谷：東非大裂谷', 0);
  s += stage(275, '② 海水進入', '狹長海洋：紅海', 1);
  s += stage(540, '③ 形成大洋', '中洋脊：大西洋中洋脊', 2);
  s += T(400, 285, '地函熱對流上升處，板塊向兩側分離；岩漿上湧冷卻，形成新的海洋地殼（玄武岩）', { size: 13, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

fig('u2-s4', '三種板塊邊界的地形', () => {
  const w = 800, h = 320;
  let s = R(0, 0, w, 110, { fill: '#e8f3fb', stroke: 'none', r: 0 });
  s += P('M0 120 L800 120 L800 320 L0 320Z', { fill: '#f3b98a', stroke: 'none' });
  s += P('M0 110 L300 110 L300 120 L0 120Z', { fill: '#6fb0dd', stroke: 'none' });
  s += P('M0 120 L140 120 L150 110 L160 120 L330 120 L380 150 L420 230 L400 240 L360 160 L320 130 L0 130Z', { fill: '#7d8a96', stroke: '#4e5a66', sw: 1 });
  s += P('M330 110 L360 112 L420 60 L470 30 L520 60 L580 80 L800 85 L800 135 L420 135 L380 125Z', { fill: '#c9a978', stroke: '#8a6a45', sw: 1 });
  s += P('M300 110 L330 110 L345 125 L330 118Z', { fill: '#2f6fa8', stroke: 'none' });
  s += P('M470 30 L480 15 L490 30', { fill: '#e04b2b', stroke: 'none' }) + P('M478 40 C470 80 440 140 400 200', { stroke: '#e04b2b', sw: 2, dash: '4 3' });
  s += A([[40, 160], [120, 160]], { stroke: C.ink, sw: 2 }) + A([[260, 160], [320, 160]], { stroke: C.ink, sw: 2 }) + A([[720, 160], [620, 160]], { stroke: C.ink, sw: 2 });
  s += callout(150, 110, 150, 40, '中洋脊\n（張裂性）', { anchor: 'middle', weight: 700, color: C.red });
  s += callout(330, 116, 290, 50, '海溝', { anchor: 'middle', weight: 700, color: C.blue });
  s += callout(475, 25, 560, 25, '火山、造山帶（聚合性）', { anchor: 'start', weight: 700, color: C.blue });
  s += T(160, 220, '海洋板塊', { size: 14, weight: 700, fill: '#fff' }) + T(650, 115, '大陸板塊', { size: 14, weight: 700 });
  s += T(420, 270, '隱沒帶：密度大的海洋板塊隱沒到大陸板塊之下，常有深源地震', { size: 12 });
  // 錯動
  s += R(600, 200, 180, 100, { fill: '#fff', stroke: C.line, r: 8 }) + R(620, 220, 70, 60, { fill: '#d9c9a8', stroke: '#8a6a45', r: 0 }) + R(690, 235, 70, 60, { fill: '#c9b48f', stroke: '#8a6a45', r: 0 });
  s += A([[655, 290], [655, 225]], { sw: 1.8 }) + A([[725, 225], [725, 290]], { sw: 1.8 });
  s += T(690, 213, '錯動性：板塊水平錯開', { size: 11, weight: 700, fill: C.green });
  return svg(w, h, s);
});

fig('u2-s5', '斷層的種類與受力', () => {
  const w = 800, h = 330;
  let s = '';
  const blk = (x, y, dy, c1, c2) => {
    // 斜斷層面：左塊（下盤）與右塊（上盤）
    let o = P(`M${x} ${y} L${x + 70} ${y} L${x + 100} ${y + 80} L${x} ${y + 80}Z`, { fill: c1, stroke: C.ink, sw: 1.5 });
    o += P(`M${x + 70} ${y + dy} L${x + 170} ${y + dy} L${x + 170} ${y + 80 + dy} L${x + 100} ${y + 80 + dy}Z`, { fill: c2, stroke: C.ink, sw: 1.5 });
    for (const k of [25, 50]) o += L(x, y + k, x + 70 + 30 * k / 80, y + k, { stroke: '#8a6a45', sw: 1 }) + L(x + 70 + 30 * k / 80, y + k + dy, x + 170, y + k + dy, { stroke: '#8a6a45', sw: 1 });
    return o;
  };
  s += T(110, 25, '正斷層', { size: 16, weight: 700 }) + blk(25, 70, 30, '#e8d9b8', '#d6c08f');
  s += A([[60, 175], [15, 175]], { stroke: C.red, sw: 3 }) + A([[195, 175], [235, 175]], { stroke: C.red, sw: 3 });
  s += T(110, 225, '受張力（拉力）\n上盤相對下滑', { size: 13 }) + T(70, 115, '下盤', { size: 12 }) + T(160, 145, '上盤', { size: 12 });
  s += T(380, 25, '逆斷層', { size: 16, weight: 700 }) + blk(295, 70, -25, '#e8d9b8', '#d6c08f');
  s += A([[260, 120], [290, 120]], { stroke: C.blue, sw: 3 }) + A([[500, 100], [470, 100]], { stroke: C.blue, sw: 3 });
  s += T(380, 225, '受壓力（擠壓）\n上盤相對上升', { size: 13 }) + T(340, 115, '下盤', { size: 12 }) + T(430, 90, '上盤', { size: 12 });
  // 平移
  s += T(650, 25, '平移斷層', { size: 16, weight: 700 });
  s += P('M560 90 L650 90 L650 180 L560 180Z', { fill: '#e8d9b8', stroke: C.ink, sw: 1.5 }) + P('M650 70 L740 70 L740 160 L650 160Z', { fill: '#d6c08f', stroke: C.ink, sw: 1.5 });
  s += L(560, 135, 650, 135, { stroke: C.green, sw: 3 }) + L(650, 115, 740, 115, { stroke: C.green, sw: 3 });
  s += A([[605, 195], [605, 160]], { stroke: C.green, sw: 2.5 }) + A([[695, 60], [695, 95]], { stroke: C.green, sw: 2.5 }).replace('', '');
  s += T(650, 225, '受剪力，兩側水平錯動', { size: 13 });
  s += L(20, 260, 780, 260, { stroke: C.line });
  s += T(400, 295, '判斷上盤：站在斷層面上方的岩塊為上盤；上盤下移＝正斷層、上盤上移＝逆斷層\n岩層受擠壓而彎曲但未斷裂＝褶皺', { size: 13, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

fig('u2-s6', '震源、震央與地震波', () => {
  const w = 780, h = 400;
  let s = P('M80 90 L480 90 L560 50 L160 50Z', { fill: '#9cc77e', stroke: '#5d8a45' });
  s += P('M80 90 L480 90 L480 330 L80 330Z', { fill: '#c9a978', stroke: '#8a6a45' }) + P('M480 90 L560 50 L560 290 L480 330Z', { fill: '#b8956a', stroke: '#8a6a45' });
  for (let k = 1; k < 5; k++) s += L(80, 90 + k * 48, 480, 90 + k * 48, { stroke: '#a88a60', sw: 1 });
  s += P('M330 50 L290 90 L200 330', { stroke: '#5a3e2b', sw: 2.5, dash: '6 4' });
  for (const r of [30, 60, 95, 130]) s += P(`M${255 - r} 210 A${r} ${r} 0 0 1 ${255 + r} 210`, { stroke: '#e04b2b', sw: 1.5, op: .7 });
  s += O(255, 210, 7, { fill: '#e04b2b', stroke: '#fff' }) + O(255, 72, 6, { fill: C.yellow, stroke: C.ink });
  s += L(255, 72, 255, 210, { stroke: C.ink, sw: 1.5, dash: '3 3' });
  s += callout(255, 210, 300, 370, '震源：地下岩層錯動、釋放能量的地方', { anchor: 'start', weight: 700, color: C.red });
  s += callout(255, 72, 255, 20, '震央：震源垂直投影到地表的位置', { anchor: 'middle', weight: 700 });
  s += callout(255, 140, 380, 145, '震源深度', { anchor: 'start', size: 12 });
  s += callout(240, 260, 160, 300, '斷層', { anchor: 'end', size: 12 });
  s += callout(355, 210, 420, 230, '地震波向四周傳播', { anchor: 'start', size: 12 });
  const rows = [['極淺源', '0～30 km'], ['淺源', '30～70 km'], ['中源', '70～300 km'], ['深源', '300～700 km']];
  s += R(590, 120, 170, 160, { fill: '#fff', stroke: C.line, r: 8 }) + T(675, 140, '依震源深度分類', { size: 13, weight: 700 });
  rows.forEach(([a, b], i) => s += T(605, 170 + i * 28, a, { size: 13, anchor: 'start', weight: 700 }) + T(745, 170 + i * 28, b, { size: 13, anchor: 'end' }));
  return svg(w, h, s);
});

fig('u2-s7', '臺灣附近的板塊構造', () => {
  const m = geomap({ bbox: [116.5, 19.2, 127.5, 27.2], w: 760, res: '10m', borders: false });
  let s = m.base();
  s += m.trench([[122.3, 23.3], [123.8, 23.7], [125.5, 24.2], [127.4, 25.4]], { color: C.blue, side: -1, step: 26 });
  s += m.trench([[120.2, 21.9], [119.7, 21], [119.6, 19.3]], { color: C.blue, side: -1, step: 26 });
  s += m.lines([[121.75, 24.1], [121.35, 23.3], [121.1, 22.75]], { stroke: C.red, sw: 3, dash: '6 4' });
  s += A([m.p([124.3, 21.2]), m.p([122.8, 22.1])], { stroke: C.orange, sw: 5 });
  s += m.label([118.4, 25.1], '歐亞板塊', { size: 20, weight: 700, fill: '#5a3e2b' });
  s += m.label([124.6, 20.6], '菲律賓海板塊', { size: 20, weight: 700, fill: '#5a3e2b' });
  s += m.label([125.5, 23.4], '琉球海溝', { size: 13, fill: C.blue, weight: 700 });
  s += m.label([125.4, 22.7], '菲律賓海板塊隱沒到\n歐亞板塊之下', { size: 12 });
  s += m.label([118.7, 20.8], '馬尼拉海溝', { size: 13, fill: C.blue, weight: 700 });
  s += m.label([118.2, 20.1], '歐亞板塊隱沒到\n菲律賓海板塊之下', { size: 12 });
  s += m.dot([121.35, 23.3], '花東縱谷：\n兩板塊交界', { dx: -14, color: C.red, size: 13, weight: 700, mark: 'none' });
  s += m.label([123.9, 21.8], '每年約 7～8 公分\n往西北推擠', { size: 12, fill: C.orange, weight: 700 });
  s += m.dot([126.3, 26.3], '琉球島弧', { mark: 'none', size: 12 }) + m.dot([121.5, 22.66], '綠島', { dx: 8, size: 11 }) + m.dot([121.55, 22.05], '蘭嶼', { dx: 8, size: 11 });
  s += m.label([121.0, 20.7], '呂宋島弧', { size: 12 });
  s += legend(10, 10, [['line', C.blue, '海溝（三角形在上覆板塊側）'], ['dash', C.red, '板塊交界'], ['arrow', C.orange, '菲律賓海板塊移動方向']], { w: 240, size: 12, gap: 21 });
  return svg(m.w, m.h, s + m.frame());
});

fig('u2-s8', '地層的形成順序（疊置定律與截切定律）', () => {
  const w = 780, h = 320;
  let s = '';
  const cols = ['#e7d39b', '#c9b8a3', '#efe1b7', '#bfa98a', '#e2cf9a'];
  for (let i = 0; i < 5; i++) s += P(`M40 ${250 - i * 40} L360 ${250 - i * 40} L360 ${210 - i * 40} L40 ${210 - i * 40}Z`, { fill: cols[i], stroke: '#8a6a45', sw: 1 });
  s += T(80, 230, 'A', { size: 15, weight: 700 }) + T(80, 190, 'B', { size: 15, weight: 700 }) + T(80, 150, 'C', { size: 15, weight: 700 }) + T(80, 110, 'D', { size: 15, weight: 700 }) + T(80, 70, 'E', { size: 15, weight: 700 });
  s += P('M200 250 L215 150 L230 120 L245 150 L250 250Z', { fill: '#e46b4f', stroke: '#9a3a26', sw: 1.5 }) + T(225, 215, 'F', { size: 15, weight: 700, fill: '#fff' });
  s += P('M300 50 L330 250', { stroke: C.ink, sw: 3 }) + A([[290, 160], [285, 130]], { sw: 1.5 }) + A([[340, 130], [345, 160]], { sw: 1.5 });
  s += T(320, 280, '斷層 G', { size: 13, weight: 700 });
  s += P('M40 50 C120 40 200 60 360 45', { stroke: '#5a3e2b', sw: 2, dash: '5 3' }) + T(200, 30, '侵蝕面', { size: 12 });
  s += T(410, 50, '疊置定律：未受擾動的地層，下面先沉積、上面後沉積', { size: 13, anchor: 'start' });
  s += T(410, 85, '→ 先後順序 A → B → C → D → E', { size: 13, anchor: 'start', fill: C.muted });
  s += T(410, 130, '截切定律：切過其他岩層的構造比被切的岩層新', { size: 13, anchor: 'start' });
  s += T(410, 165, '→ 火成岩 F 切過 A～C，比 C 新', { size: 13, anchor: 'start', fill: C.muted });
  s += T(410, 195, '→ 斷層 G 切過所有地層，最晚發生', { size: 13, anchor: 'start', fill: C.muted });
  s += R(410, 225, 350, 60, { fill: C.tealS, stroke: 'none', r: 8 }) + T(585, 255, '化石可用來判斷地層年代與當時的環境', { size: 13, weight: 700 });
  return svg(w, h, s);
});

fig('u3-s1', '太陽系的八大行星（大小與距離未依比例）', () => {
  const w = 820, h = 330;
  let s = R(0, 0, w, h, { fill: '#121a2b', stroke: 'none', r: 0 });
  s += O(-60, 120, 140, { fill: '#f7b733', stroke: 'none' }) + T(30, 120, '太陽', { size: 16, weight: 700, fill: '#5a2e00' });
  const pl = [['水星', 7, '#b7b2a8'], ['金星', 11, '#e9c98a'], ['地球', 12, '#4f94cf'], ['火星', 9, '#d0623c'], ['木星', 34, '#d9a877'], ['土星', 28, '#e6cf96'], ['天王星', 18, '#93d6dd'], ['海王星', 17, '#4f7fd8']];
  let x = 120;
  pl.forEach(([n, r, c], i) => {
    x += i < 4 ? 40 : i === 4 ? 70 : 85;
    s += O(x, 120, r, { fill: c, stroke: 'none' });
    if (n === '土星') s += E(x, 120, r * 1.8, r * .45, { fill: 'none', stroke: '#e6cf96', sw: 3 });
    s += T(x, 175, n, { size: 13, fill: '#fff' });
  });
  s += R(130, 210, 230, 110, { fill: 'rgba(255,255,255,.92)', stroke: 'none', r: 10 }) + T(245, 228, '類地行星', { size: 14, weight: 700, fill: C.brown });
  s += T(245, 280, '水星、金星、地球、火星\n體積小、密度大（約 5 g/cm³）\n由岩石與金屬組成，有固體表面\n衛星少或沒有', { size: 12 });
  s += R(420, 210, 380, 110, { fill: 'rgba(255,255,255,.92)', stroke: 'none', r: 10 }) + T(610, 228, '類木行星', { size: 14, weight: 700, fill: C.blue });
  s += T(610, 280, '木星、土星、天王星、海王星\n體積大、密度小（約 1 g/cm³）\n主要由氣體（氫、氦）組成\n都有環，衛星數量多', { size: 12 });
  s += T(410, 25, '小行星帶位於火星與木星之間', { size: 12, fill: '#c9d3e6' });
  for (let i = 0; i < 20; i++) s += O(256 + (i * 7) % 18, 70 + (i * 37) % 100, 1.5, { fill: '#c9b8a3', stroke: 'none' });
  return svg(w, h, s);
});

fig('u3-s2', '銀河系的結構與太陽系的位置', () => {
  const w = 800, h = 340;
  let s = R(0, 0, w, h, { fill: '#0f1626', stroke: 'none', r: 0 });
  // 俯視
  for (let k = 0; k < 2; k++) { const pts = []; for (let t = 0; t < 4.2 * Math.PI; t += .2) { const r = 12 + t * 9; pts.push([200 + r * Math.cos(t + k * Math.PI), 150 + r * Math.sin(t + k * Math.PI) * .9]); } s += P(smooth(pts, false), { stroke: '#a9c3ff', sw: 10, op: .35 }) + P(smooth(pts, false), { stroke: '#dfe8ff', sw: 3, op: .6 }); }
  s += O(200, 150, 22, { fill: '#fff4cf', stroke: 'none', op: .9 });
  s += O(285, 190, 5, { fill: '#ffd34d', stroke: 'none' }) + T(300, 205, '太陽系', { size: 13, fill: '#ffd34d', anchor: 'start', weight: 700 });
  s += A([[90, 30], [310, 30]], { stroke: '#fff', sw: 1.2, both: true }) + T(200, 18, '直徑約 10 萬光年', { size: 12, fill: '#fff' });
  s += T(200, 310, '俯視：螺旋狀（棒旋星系）', { size: 13, fill: '#fff', weight: 700 });
  // 側視
  s += E(590, 160, 180, 18, { fill: '#7f9be0', stroke: 'none', op: .5 }) + E(590, 160, 45, 30, { fill: '#fff4cf', stroke: 'none', op: .9 });
  s += O(680, 158, 5, { fill: '#ffd34d', stroke: 'none' }) + T(680, 125, '太陽系', { size: 13, fill: '#ffd34d', weight: 700 });
  s += A([[590, 200], [680, 200]], { stroke: '#fff', sw: 1.2, both: true }) + T(635, 215, '距中心約 3 萬光年', { size: 12, fill: '#fff' });
  s += T(590, 310, '側視：中央突起的盤狀', { size: 13, fill: '#fff', weight: 700 });
  s += T(590, 260, '夜空中的銀河，是從盤面方向看去\n眾多恆星聚集的帶狀光芒', { size: 12, fill: '#c9d3e6' });
  return svg(w, h, s);
});

fig('u3-s3', '地球自轉與晝夜：由北極上空看，地球逆時針自轉', () => {
  const w = 720, h = 330;
  let s = '';
  s += O(240, 165, 120, { fill: '#2b4a7a', stroke: 'none' });
  s += P('M240 45 A120 120 0 0 1 240 285Z', { fill: '#7ec0ee', stroke: 'none' });
  s += P(smooth([[220, 120], [260, 105], [300, 130], [285, 175], [240, 200], [200, 180], [195, 140]]), { fill: '#7cb36a', stroke: 'none', op: .9 });
  s += O(240, 165, 4, { fill: C.ink, stroke: 'none' }) + T(240, 182, '北極', { size: 12, fill: '#fff' });
  s += AQ(345, 230, 300, 300, 200, 292, { stroke: C.orange, sw: 3 }) + T(330, 300, '自西向東自轉', { size: 13, fill: C.orange, weight: 700, anchor: 'start' });
  s += T(295, 95, '白天', { size: 16, weight: 700, fill: '#1f4f7a' }) + T(185, 95, '黑夜', { size: 16, weight: 700, fill: '#fff' });
  s += T(370, 165, '中午 12:00', { size: 12, anchor: 'start' }) + T(105, 165, '午夜 24:00', { size: 12, anchor: 'end' });
  s += T(240, 30, '黃昏 18:00', { size: 12 }) + T(240, 305, '清晨 06:00', { size: 12 }).replace('y="305"', 'y="316"');
  for (let y = 70; y <= 260; y += 38) s += A([[640, y], [480, y]], { stroke: C.red, sw: 2 });
  s += T(660, 165, '太陽光', { size: 14, fill: C.red, weight: 700, rotate: 90 });
  s += T(560, 300, '自轉一圈約 24 小時\n→ 晝夜交替、太陽東升西落', { size: 12, fill: C.muted });
  return svg(w, h, s);
});

fig('u3-s4', '地球公轉與四季（北半球）', () => {
  const w = 800, h = 420;
  let s = E(400, 210, 290, 130, { fill: 'none', stroke: C.line, sw: 2, dash: '6 5' });
  s += O(400, 210, 36, { fill: '#f7b733', stroke: '#e08a2c', sw: 3 }) + T(400, 210, '太陽', { size: 14, weight: 700 });
  const earth = (x, y, lit) => {
    let o = O(x, y, 26, { fill: '#2b4a7a', stroke: 'none' }) + P(`M${x + 26 * Math.cos(lit + Math.PI / 2)} ${y + 26 * Math.sin(lit + Math.PI / 2)} A26 26 0 0 1 ${x - 26 * Math.cos(lit + Math.PI / 2)} ${y - 26 * Math.sin(lit + Math.PI / 2)}Z`, { fill: '#7ec0ee', stroke: 'none' });
    o += L(x - 12, y + 30, x + 12, y - 30, { stroke: C.ink, sw: 2 });
    return o;
  };
  // 夏至在左（太陽在右，北半球朝向太陽）
  s += earth(110, 210, 0) + T(110, 150, '夏至（6/21 前後）', { size: 14, weight: 700, fill: C.red }) + T(110, 265, '太陽直射北回歸線\n北半球晝長夜短', { size: 12 });
  s += earth(690, 210, Math.PI) + T(690, 150, '冬至（12/22 前後）', { size: 14, weight: 700, fill: C.blue }) + T(690, 265, '太陽直射南回歸線\n北半球晝短夜長', { size: 12 });
  s += earth(400, 80, Math.PI / 2) + T(400, 30, '春分（3/21 前後）', { size: 14, weight: 700, fill: C.green }).replace('y="30"', 'y="22"') + T(560, 70, '太陽直射赤道\n晝夜等長', { size: 12 });
  s += earth(400, 340, -Math.PI / 2) + T(400, 395, '秋分（9/23 前後）', { size: 14, weight: 700, fill: C.orange }) + T(560, 345, '太陽直射赤道\n晝夜等長', { size: 12 });
  s += AQ(250, 100, 180, 120, 140, 170, { stroke: C.muted, sw: 2 }) + AQ(150, 260, 200, 320, 300, 335, { stroke: C.muted, sw: 2 });
  s += AQ(520, 335, 620, 320, 660, 260, { stroke: C.muted, sw: 2 }) + AQ(660, 160, 620, 105, 520, 90, { stroke: C.muted, sw: 2 });
  s += T(400, 428, '四季成因：地軸傾斜約 23.5° 且方向固定，公轉時太陽直射位置在南北回歸線間移動', { size: 13, fill: C.teal, weight: 700 });
  s += T(110, 300, '遠日點約 7 月初', { size: 11, fill: C.muted }).replace('y="300"', 'y="303"') + T(690, 300, '近日點約 1 月初', { size: 11, fill: C.muted }).replace('y="300"', 'y="303"');
  return svg(w, h + 25, s);
});

fig('u3-s5', '月相的變化（陽光由右方照來）', () => {
  const w = 760, h = 520;
  let s = O(330, 260, 190, { fill: 'none', stroke: C.line, sw: 2, dash: '6 5' });
  s += O(330, 260, 40, { fill: '#2b4a7a', stroke: 'none' }) + P('M330 220 A40 40 0 0 1 330 300Z', { fill: '#7ec0ee', stroke: 'none' }) + T(330, 260, '地球', { size: 12, fill: '#fff' });
  for (let y = 60; y <= 460; y += 50) s += A([[740, y], [650, y]], { stroke: C.orange, sw: 2 });
  s += T(720, 495, '太陽光', { size: 13, fill: C.orange, weight: 700 });
  const names = [['新月（朔）', '農曆初一'], ['眉月', ''], ['上弦月', '初七、八'], ['盈凸月', ''], ['滿月（望）', '十五、十六'], ['虧凸月', ''], ['下弦月', '廿二、廿三'], ['殘月', '']];
  for (let i = 0; i < 8; i++) {
    const a = -i * Math.PI / 4, x = 330 + 190 * Math.cos(a), y = 260 + 190 * Math.sin(a);
    // 軌道上的月球：右半亮
    s += O(x, y, 16, { fill: '#3a3f47', stroke: 'none' }) + P(`M${x} ${y - 16} A16 16 0 0 1 ${x} ${y + 16}Z`, { fill: '#f4ecc8', stroke: 'none' });
    // 從地球看到的樣子
    const f = (1 - Math.cos(i * Math.PI / 4)) / 2; // 被照亮比例
    const ox = 330 + 112 * Math.cos(a), oy = 260 + 112 * Math.sin(a), r = 18;
    const k = (1 - 2 * f) * r; // 明暗交界橢圓半徑
    const waxing = i <= 4;
    let face = O(ox, oy, r, { fill: '#3a3f47', stroke: '#888', sw: .6 });
    if (f > .02) {
      const side = waxing ? 1 : 0; // 盈：右側亮
      face += `<path d="M${ox} ${oy - r} A${r} ${r} 0 0 ${side} ${ox} ${oy + r} A${Math.abs(k)} ${r} 0 0 ${k > 0 ? (side ? 0 : 1) : side} ${ox} ${oy - r}Z" fill="#f4ecc8"/>`;
    }
    s += face;
    const lx = 330 + 238 * Math.cos(a), ly = 260 + 238 * Math.sin(a);
    s += T(lx, ly, names[i][0] + (names[i][1] ? '\n' + names[i][1] : ''), { size: 12, weight: 700 });
  }
  s += T(330, 540, '內圈為從地球看到的月相；月球繞地球公轉一圈約 29.5 天（一個朔望月）', { size: 12, fill: C.muted });
  return svg(w, h + 40, s);
});

fig('u3-s6', '日食與月食的成因', () => {
  const w = 780, h = 360;
  let s = '';
  const row = (y, title, order, note2) => {
    let o = T(20, y - 55, title, { size: 16, weight: 700, anchor: 'start' });
    o += O(70, y, 45, { fill: '#f7b733', stroke: '#e08a2c', sw: 2 }) + T(70, y, '太陽', { size: 13, weight: 700 });
    const [mx, ex] = order === 'sun' ? [360, 560] : [600, 420];
    const er = 30, mr = 11;
    o += P(`M70 ${y - 45} L${ex} ${y - er} L${ex} ${y + er} L70 ${y + 45}Z`, { fill: '#fff3c4', stroke: 'none', op: .5 });
    if (order === 'sun') o += P(`M${mx} ${y - mr} L${ex + 10} ${y - 4} L${ex + 10} ${y + 4} L${mx} ${y + mr}Z`, { fill: '#555', stroke: 'none', op: .6 });
    else o += P(`M${ex} ${y - er} L${ex + 230} ${y - 10} L${ex + 230} ${y + 10} L${ex} ${y + er}Z`, { fill: '#555', stroke: 'none', op: .45 });
    o += O(ex, y, er, { fill: '#4f94cf', stroke: 'none' }) + T(ex, y + 48, '地球', { size: 12 });
    o += O(mx, y, mr, { fill: order === 'sun' ? '#888' : '#a3443a', stroke: 'none' }) + T(mx, y + 30, '月球', { size: 12 });
    o += T(760, y + 48, note2, { size: 12, anchor: 'end' });
    return o;
  };
  s += row(90, '日食：太陽－月球－地球排成一直線', 'sun', '發生在新月（朔）\n白天、月影所到之處才看得到');
  s += row(250, '月食：太陽－地球－月球排成一直線', 'moon', '發生在滿月（望）\n夜晚、面向月球的半球都看得到');
  s += T(390, 345, '月球公轉軌道與地球公轉軌道約有 5° 夾角，所以不是每個月都會發生日食、月食', { size: 12, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

fig('u3-s7', '大潮與小潮的成因', () => {
  const w = 780, h = 330;
  let s = '';
  const panel = (x, title, moonPos, sub) => {
    let o = R(x, 10, 370, 310, { fill: '#fff', stroke: C.line, r: 10 }) + T(x + 185, 35, title, { size: 16, weight: 700 });
    o += O(x + 50, 170, 28, { fill: '#f7b733', stroke: 'none' }) + T(x + 50, 215, '太陽', { size: 12 });
    const ex = x + 230, ey = 170;
    const along = moonPos !== 'side';
    o += E(ex, ey, along ? 62 : 44, along ? 44 : 62, { fill: '#cfe6f7', stroke: '#7fb3dd' });
    o += O(ex, ey, 34, { fill: '#4f94cf', stroke: 'none' }) + T(ex, ey, '地球', { size: 12, fill: '#fff' });
    const [mx, my] = moonPos === 'side' ? [ex, ey - 110] : [ex + 110, ey];
    o += O(mx, my, 12, { fill: '#c9c9c9', stroke: C.ink, sw: 1 }) + T(mx + (moonPos === 'side' ? 30 : 0), my + (moonPos === 'side' ? 0 : 28), '月球', { size: 12 });
    o += A([[ex - 70, ey], [x + 90, ey]], { stroke: C.orange, sw: 2.5 }) + T(x + 130, ey - 14, '太陽引力', { size: 12, fill: C.orange });
    o += moonPos === 'side' ? A([[ex, ey - 70], [ex, ey - 95]], { stroke: C.purple, sw: 2.5 }) + T(ex + 30, ey - 82, '月球引力', { size: 12, fill: C.purple, anchor: 'start' }).replace(`x="${ex + 30}"`, `x="${ex + 8}"`)
      : A([[ex + 66, ey], [ex + 95, ey]], { stroke: C.purple, sw: 2.5 }) + T(ex + 80, ey - 14, '月球引力', { size: 12, fill: C.purple });
    o += T(x + 185, 285, sub, { size: 13 });
    return o;
  };
  s += panel(10, '大潮', 'line', '新月、滿月時（農曆初一、十五前後）\n日月引力方向一致，潮差最大');
  s += panel(400, '小潮', 'side', '上弦、下弦月時（農曆初八、廿三前後）\n日月引力互相垂直，潮差最小');
  return svg(w, h, s);
});

fig('u4-s2', '大氣的垂直分層與溫度變化', () => {
  const w = 780, h = 420;
  let s = '';
  const X = t => 60 + (t + 100) * 3.6, Y = km => 390 - km * 3.1;
  const bands = [[0, 12, '對流層', '#e4f1fb'], [12, 50, '平流層', '#d6e9f6'], [50, 85, '中氣層', '#c8def0'], [85, 120, '增溫層', '#bcd4ea']];
  for (const [a, b, n, c] of bands) s += R(60, Y(b), 520, Y(a) - Y(b), { fill: c, stroke: 'none', r: 0 }) + T(80, n === '平流層' ? Y(44) : (Y(a) + Y(b)) / 2, n, { size: 15, weight: 700, anchor: 'start' });
  s += A([[60, 390], [60, 15]], { sw: 1.5 }) + A([[60, 390], [600, 390]], { sw: 1.5 });
  for (const km of [0, 12, 50, 85, 120]) s += L(56, Y(km), 60, Y(km), {}) + T(52, Y(km), km, { size: 11, anchor: 'end' });
  for (const t of [-80, -40, 0, 40]) s += T(X(t), 405, t + '°C', { size: 11 });
  s += T(30, 200, '高度（公里）', { size: 12, rotate: -90 });
  const prof = [[15, 0], [-56, 12], [-56, 20], [-2, 50], [-90, 85], [-60, 100], [20, 120]];
  s += P('M' + prof.map(([t, km]) => `${X(t)} ${Y(km)}`).join('L'), { stroke: C.red, sw: 3 });
  s += T(590, Y(6), '每升高 1 公里\n氣溫約下降 6.5°C\n有雲、雨等天氣現象', { size: 12, anchor: 'start' });
  s += T(590, Y(30), '臭氧層吸收紫外線\n→ 溫度隨高度上升\n大氣穩定，適合飛機飛行', { size: 12, anchor: 'start' });
  s += T(590, Y(68), '溫度隨高度下降\n約 85 km 處氣溫最低', { size: 12, anchor: 'start' });
  s += T(590, Y(103), '吸收太陽輻射\n溫度隨高度上升', { size: 12, anchor: 'start' });
  s += R(70, Y(32), 500, 20, { fill: '#9fd3a9', stroke: 'none', r: 4, op: .7 }) + T(320, Y(32) + 10, '臭氧層（約 20～30 公里濃度最高）', { size: 12, weight: 700 });
  return svg(w, h, s);
});

fig('u4-s5', '北半球高氣壓與低氣壓的風向', () => {
  const w = 780, h = 330;
  let s = '';
  const sys = (cx, H) => {
    let o = E(cx, 220, 150, 60, { fill: H ? '#dce8f6' : '#f8dde1', stroke: H ? C.blue : C.red, sw: 1.5, op: .8 });
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3, x1 = cx + 40 * Math.cos(a), y1 = 220 + 16 * Math.sin(a), x2 = cx + 125 * Math.cos(a + (H ? .5 : -.5)), y2 = 220 + 50 * Math.sin(a + (H ? .5 : -.5));
      o += H ? AQ(x1, y1, (x1 + x2) / 2 + 10 * Math.sin(a), (y1 + y2) / 2, x2, y2, { stroke: C.blue, sw: 2 }) : AQ(x2, y2, (x1 + x2) / 2 - 10 * Math.sin(a), (y1 + y2) / 2, x1, y1, { stroke: C.red, sw: 2 });
    }
    o += T(cx, 220, H ? 'H' : 'L', { size: 26, weight: 700, fill: H ? C.blue : C.red });
    o += H ? A([[cx, 60], [cx, 185]], { stroke: C.blue, sw: 6 }) : A([[cx, 185], [cx, 60]], { stroke: C.red, sw: 6 });
    o += T(cx, 35, H ? '高氣壓：空氣下沉 → 天氣晴朗' : '低氣壓：空氣上升 → 多雲、降雨', { size: 14, weight: 700, fill: H ? C.blue : C.red });
    o += T(cx, 305, H ? '地面風：順時針方向向外吹出' : '地面風：逆時針方向向內吹入', { size: 13 });
    return o;
  };
  s += sys(200, true) + sys(580, false);
  return svg(w, h, s);
});

fig('u4-s6', '鋒面的種類與符號', () => {
  const w = 800, h = 340;
  let s = '';
  const kinds = [['冷鋒', '冷空氣推擠暖空氣\n暖空氣被迫快速上升\n→ 雷雨、陣雨，過後氣溫下降', 'cold'], ['暖鋒', '暖空氣沿冷空氣上滑\n上升較緩慢\n→ 層狀雲、連續性降雨', 'warm'], ['滯留鋒', '冷暖空氣勢力相當\n鋒面移動緩慢、停留\n→ 梅雨（5～6 月）', 'stat']];
  kinds.forEach(([n, d, k], i) => {
    const x = 15 + i * 262;
    s += R(x, 15, 250, 315, { fill: '#fff', stroke: C.line, r: 10 }) + T(x + 125, 40, n, { size: 17, weight: 700 });
    // 符號
    const y0 = 75; s += L(x + 25, y0, x + 225, y0, { stroke: k === 'cold' ? C.blue : k === 'warm' ? C.red : C.purple, sw: 3 });
    for (let j = 0; j < 5; j++) { const cx = x + 45 + j * 40;
      const blue = k === 'cold' || (k === 'stat' && j % 2 === 0);
      if (blue) s += P(`M${cx - 9} ${y0} L${cx} ${y0 - 14} L${cx + 9} ${y0}Z`, { fill: C.blue }).replace('stroke="#1f2630"', 'stroke="none"');
      else s += P(`M${cx - 9} ${y0} A9 9 0 0 ${k === 'stat' ? 0 : 1} ${cx + 9} ${y0}Z`.replace('A9 9 0 0 0', 'A9 9 0 0 0'), { fill: C.red, stroke: 'none' }).replace(`M${cx - 9} ${y0} A9 9 0 0 0 ${cx + 9} ${y0}Z`, `M${cx - 9} ${y0} A9 9 0 0 0 ${cx + 9} ${y0}Z`);
    }
    if (k === 'stat') s = s; // 滯留鋒：三角形與半圓分在兩側
    // 剖面
    const by = 200;
    if (k === 'cold') s += P(`M${x + 20} ${by + 60} L${x + 20} ${by - 10} C${x + 70} ${by + 10} ${x + 110} ${by + 50} ${x + 130} ${by + 60}Z`, { fill: '#bcd6f2', stroke: C.blue }) + AQ(x + 140, by + 50, x + 130, by - 10, x + 150, by - 50, { stroke: C.red, sw: 2 }) + P(`M${x + 120} ${by - 60} C${x + 130} ${by - 85} ${x + 175} ${by - 85} ${x + 180} ${by - 60}Z`, { fill: '#9aa3ac', stroke: 'none' });
    if (k === 'warm') s += P(`M${x + 230} ${by + 60} L${x + 230} ${by - 20} C${x + 170} ${by - 10} ${x + 80} ${by + 40} ${x + 30} ${by + 60}Z`, { fill: '#bcd6f2', stroke: C.blue }) + AQ(x + 40, by + 45, x + 120, by + 10, x + 200, by - 40, { stroke: C.red, sw: 2 }) + R(x + 120, by - 70, 100, 18, { fill: '#c5cbd1', stroke: 'none', r: 9 });
    if (k === 'stat') s += P(`M${x + 20} ${by + 60} L${x + 20} ${by - 10} C${x + 90} ${by} ${x + 150} ${by + 40} ${x + 230} ${by + 55} L${x + 230} ${by + 60}Z`, { fill: '#bcd6f2', stroke: C.blue }) + R(x + 60, by - 50, 150, 18, { fill: '#c5cbd1', stroke: 'none', r: 9 });
    s += T(x + 60, by + 40, '冷空氣', { size: 11, fill: C.blue }) + T(x + 190, by + (k === 'warm' ? -40 : 20), '暖空氣', { size: 11, fill: C.red });
    s += T(x + 125, 295, d, { size: 12 });
  });
  return svg(w, h, s);
});

fig('u4-s8', '颱風的構造與氣壓、風速變化', () => {
  const w = 780, h = 420;
  let s = '';
  const cx = 360;
  s += P(`M${cx - 300} 150 C${cx - 250} 60 ${cx - 120} 40 ${cx - 40} 50 L${cx - 30} 160 L${cx - 300} 160Z`, { fill: '#e3e8ee', stroke: '#9aa3ac' });
  s += P(`M${cx + 300} 150 C${cx + 250} 60 ${cx + 120} 40 ${cx + 40} 50 L${cx + 30} 160 L${cx + 300} 160Z`, { fill: '#e3e8ee', stroke: '#9aa3ac' });
  s += P(`M${cx - 40} 50 L${cx - 30} 160 L${cx - 60} 160 L${cx - 75} 45Z`, { fill: '#b9c3cd', stroke: 'none' }) + P(`M${cx + 40} 50 L${cx + 30} 160 L${cx + 60} 160 L${cx + 75} 45Z`, { fill: '#b9c3cd', stroke: 'none' });
  s += A([[cx, 55], [cx, 145]], { stroke: C.blue, sw: 2 }) + T(cx, 35, '颱風眼：下沉氣流\n風小、天氣較晴朗', { size: 12, weight: 700 }).replace('y="35"', 'y="22"');
  s += A([[cx - 55, 150], [cx - 62, 60]], { stroke: C.red, sw: 2 }) + A([[cx + 55, 150], [cx + 62, 60]], { stroke: C.red, sw: 2 });
  s += callout(cx - 62, 100, cx - 170, 100, '眼牆：上升氣流最強\n雲最厚、雨最大', { anchor: 'end', weight: 700 }).replace(`x="${cx - 170}"`, `x="${cx - 110}"`);
  s += T(cx + 200, 130, '螺旋雲帶', { size: 12, fill: C.muted });
  s += L(60, 160, 660, 160, { stroke: C.ink, sw: 1.5 }) + T(680, 160, '地面', { size: 12, anchor: 'start' });
  // 氣壓與風速
  const gy = 240, gy2 = 340;
  s += T(30, gy, '氣壓', { size: 12, anchor: 'start' }) + P(`M60 ${gy - 20} C${cx - 120} ${gy - 18} ${cx - 50} ${gy} ${cx} ${gy + 40} C${cx + 50} ${gy} ${cx + 120} ${gy - 18} 660 ${gy - 20}`, { stroke: C.green, sw: 3 });
  s += T(cx, gy + 58, '中心氣壓最低', { size: 12, fill: C.green, weight: 700 });
  s += T(30, gy2, '風速', { size: 12, anchor: 'start' }) + P(`M60 ${gy2 + 30} C${cx - 150} ${gy2 + 20} ${cx - 80} ${gy2 - 40} ${cx - 55} ${gy2 - 40} C${cx - 40} ${gy2 - 40} ${cx - 20} ${gy2 + 30} ${cx} ${gy2 + 32} C${cx + 20} ${gy2 + 30} ${cx + 40} ${gy2 - 40} ${cx + 55} ${gy2 - 40} C${cx + 80} ${gy2 - 40} ${cx + 150} ${gy2 + 20} 660 ${gy2 + 30}`, { stroke: C.purple, sw: 3 });
  s += T(cx + 120, gy2 - 40, '眼牆附近風速最大', { size: 12, fill: C.purple, weight: 700, anchor: 'start' });
  s += L(cx - 55, 160, cx - 55, gy2 - 40, { stroke: C.muted, sw: 1, dash: '3 3' }) + L(cx + 55, 160, cx + 55, gy2 - 40, { stroke: C.muted, sw: 1, dash: '3 3' });
  s += T(390, 405, '北半球颱風：低氣壓，地面風以逆時針方向吹入；地面天氣圖上為密集的封閉等壓線', { size: 12, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

fig('u5-s1', '洋流與大氣環流把熱量由低緯度送往高緯度', () => {
  const w = 760, h = 300;
  let s = R(0, 190, w, 110, { fill: '#5d9fd4', stroke: 'none', r: 0 }) + R(0, 0, w, 190, { fill: '#eef6fb', stroke: 'none', r: 0 });
  for (let x = 0; x < w; x += 40) s += P(`M${x} 192 q10 -8 20 0 q10 8 20 0`, { stroke: '#fff', sw: 1.5 });
  s += A([[160, 170], [160, 80], [600, 80], [600, 150]], { stroke: C.red, sw: 4 });
  s += T(380, 65, '盛行風：水氣隨大氣向高緯度輸送', { size: 14, weight: 700 });
  s += T(160, 190, '蒸發（吸熱）', { size: 14, weight: 700, fill: C.red, halo: true });
  s += T(600, 170, '凝結成雲致雨（放熱）', { size: 14, weight: 700, fill: C.blue, halo: true });
  for (const x of [580, 600, 620]) s += L(x, 125, x - 6, 145, { stroke: C.blue, sw: 1.5 });
  s += A([[160, 245], [600, 245]], { stroke: '#ffd34d', sw: 5 }) + T(380, 270, '暖流：海水把熱量由低緯度帶往高緯度', { size: 14, weight: 700, fill: '#fff' });
  s += T(60, 225, '低緯度\n（熱量多）', { size: 13, fill: '#fff', weight: 700 }) + T(700, 225, '高緯度\n（熱量少）', { size: 13, fill: '#fff', weight: 700 });
  return svg(w, h, s);
});

const SEA = (m, season) => {
  let s = m.base();
  const KURO = [[122.4, 19.8], [122, 21.5], [122, 23], [122.5, 24.5], [123.6, 25.8], [125.5, 27], [126.8, 27.8]];
  s += m.route(KURO, { stroke: C.red, sw: 4, curve: true });
  s += m.label([123.6, 22.7], '黑潮（暖流）', { size: 14, weight: 700, fill: C.red });
  if (season === 'summer') {
    s += m.route([[115.5, 20.5], [117.5, 21.7], [119, 22.8], [120, 24], [121, 25.5], [122, 27]], { stroke: C.orange, sw: 4, curve: true });
    s += m.label([117.2, 22.6], '南海海流\n（夏季，向北）', { size: 13, weight: 700, fill: C.orange });
  } else {
    s += m.route([[122.3, 27.6], [121, 26.7], [120, 25.8], [119.3, 24.8], [118.5, 23.8], [117.3, 23]], { stroke: C.blue, sw: 4, curve: true });
    s += m.label([118.4, 25.8], '中國沿岸流\n（冬季，向南）', { size: 13, weight: 700, fill: C.blue });
    s += m.route([[120.6, 21.6], [120, 22.4], [119.8, 23.3], [120, 24.2]], { stroke: C.red, sw: 3, curve: true });
    s += m.label([118.9, 21.8], '黑潮支流', { size: 12, weight: 700, fill: C.red });
  }
  s += m.label([121.1, 23.7], '臺灣', { size: 13, weight: 700 }) + m.label([119.4, 23.55], '澎湖', { size: 11 });
  s += m.label([123.4, 27.6], '東海', { size: 12, fill: C.blue }) + m.label([116.6, 19.7], '南海', { size: 12, fill: C.blue });
  return s + m.frame();
};
fig('u5-s2', '臺灣附近的洋流：夏季與冬季', () => {
  const a = geomap({ bbox: [115, 19.3, 127, 28.2], w: 390, res: '10m', borders: false });
  const b = geomap({ bbox: [115, 19.3, 127, 28.2], w: 390, res: '10m', borders: false });
  let s = G(SEA(a, 'summer') + R(8, 8, 76, 26, { fill: C.orange, stroke: 'none', r: 6 }) + T(46, 21, '夏季', { size: 14, weight: 700, fill: '#fff' }));
  s += G(SEA(b, 'winter') + R(8, 8, 76, 26, { fill: C.blue, stroke: 'none', r: 6 }) + T(46, 21, '冬季', { size: 14, weight: 700, fill: '#fff' }), `translate(${a.w + 10} 0)`);
  return svg(a.w * 2 + 10, a.h, s);
});

fig('u5-s3', '溫室效應', () => {
  const w = 780, h = 360;
  let s = R(0, 0, w, h, { fill: '#eaf3fb', stroke: 'none', r: 0 });
  s += P('M0 300 C200 285 500 290 780 300 L780 360 L0 360Z', { fill: '#9cc77e', stroke: 'none' });
  s += R(0, 90, w, 40, { fill: '#b9a3d9', stroke: 'none', r: 0, op: .35 }) + T(770, 110, '溫室氣體：水氣、二氧化碳、甲烷等', { size: 12, anchor: 'end', weight: 700, fill: C.purple });
  s += O(60, 40, 30, { fill: '#f7b733', stroke: 'none' });
  s += A([[90, 60], [300, 290]], { stroke: '#f2a33a', sw: 6 }) + T(150, 175, '太陽輻射\n（短波，可穿透大氣）', { size: 12, weight: 700, fill: '#b5651d' });
  s += A([[200, 170], [260, 20]], { stroke: '#f2c94c', sw: 4 }) + T(300, 30, '約 30% 被雲、地表反射回太空', { size: 12, anchor: 'start' });
  s += A([[420, 290], [440, 125]], { stroke: C.red, sw: 4 }) + T(470, 200, '地表放出紅外線（長波）', { size: 12, anchor: 'start', fill: C.red, weight: 700 });
  s += A([[450, 110], [500, 20]], { stroke: C.red, sw: 2, dash: '5 4' }) + T(510, 40, '少部分散失到太空', { size: 12, anchor: 'start' });
  s += A([[470, 110], [560, 285]], { stroke: C.red, sw: 4 }) + T(580, 250, '溫室氣體吸收後\n再放出，使地表增溫', { size: 12, anchor: 'start', fill: C.red, weight: 700 });
  s += T(390, 335, '若沒有溫室效應，地表平均溫度約 －18°C；目前約 15°C。溫室氣體增加 → 全球暖化', { size: 13, weight: 700 });
  return svg(w, h, s);
});

fig('u5-s5', '順向坡與逆向坡', () => {
  const w = 760, h = 330;
  let s = '';
  s += P('M40 290 C150 200 280 80 380 70 C470 75 600 180 720 290Z', { fill: '#cfe3b4', stroke: 'none' });
  for (let k = 0; k < 6; k++) s += P(`M${60 + k * 70} 300 L${300 + k * 70} 40`, { stroke: ['#d8b67a', '#b98f62', '#e3cc9a', '#a77d55'][k % 4], sw: 26 });
  s += P('M40 290 C150 200 280 80 380 70 C470 75 600 180 720 290 L760 290 L760 0 L0 0 L0 290Z', { fill: '#fffdf8', stroke: 'none' });
  s += R(0, 290, w, 40, { fill: '#fffdf8', stroke: 'none', r: 0 }) + P('M40 290 C150 200 280 80 380 70 C470 75 600 180 720 290', { stroke: '#5d8a45', sw: 3 });
  s += L(0, 290, 760, 290, { stroke: C.ink, sw: 1.5 });
  s += A([[230, 130], [130, 230]], { stroke: C.red, sw: 6 }) + T(110, 30, '順向坡', { size: 18, weight: 700, fill: C.red });
  s += T(110, 80, '坡面與岩層傾斜方向相同\n岩層容易沿層面滑動\n→ 較易發生山崩', { size: 12 });
  s += T(650, 80, '逆向坡', { size: 18, weight: 700, fill: C.green }) + T(650, 120, '坡面與岩層傾斜方向相反\n較穩定，但仍可能落石', { size: 12 });
  s += A([[400, 40], [300, 100]], { stroke: C.ink, sw: 2 }) + T(470, 30, '岩層傾斜方向', { size: 13, weight: 700 });
  s += R(110, 262, 30, 24, { fill: '#c97a4a', stroke: '#8b4a2a', r: 2 }) + P('M105 262 L125 248 L145 262Z', { fill: '#8b4a2a' });
  s += T(380, 315, '山坡地開發、豪雨使岩層含水量增加，都會提高山崩與土石流的風險', { size: 13, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

fig('u5-s6', '臭氧濃度隨高度的變化', () => {
  const w = 790, h = 360;
  let s = '';
  const X = v => 90 + v * 22, Y = km => 320 - km * 6.5;
  s += R(91, Y(40), 440, Y(12) - Y(40), { fill: '#e7f1fb', stroke: 'none', r: 0 }) + R(91, Y(12), 440, Y(0) - Y(12), { fill: '#f6efe0', stroke: 'none', r: 0 });
  s += A([[90, 320], [90, 40]], { sw: 1.5 }) + A([[90, 320], [540, 320]], { sw: 1.5 });
  for (const km of [0, 10, 20, 30, 40]) s += T(84, Y(km), km, { size: 11, anchor: 'end' });
  for (const v of [0, 5, 10, 15]) s += T(X(v), 336, v, { size: 11 });
  s += T(310, 352, '臭氧濃度（ppm）', { size: 12 }) + T(50, 180, '高度（公里）', { size: 12, rotate: -90 });
  const pts = [[0.05, 0], [0.1, 8], [0.5, 12], [3, 17], [7, 21], [9.5, 25], [8, 30], [5, 35], [2.5, 40]];
  s += P(smooth(pts.map(([v, km]) => [X(v), Y(km)]), false), { stroke: C.teal, sw: 3 });
  s += L(90, Y(12), 540, Y(12), { stroke: C.ink, sw: 1, dash: '5 4' });
  s += T(420, Y(28), '平流層', { size: 16, weight: 700 }) + T(420, Y(5), '對流層', { size: 16, weight: 700 });
  s += callout(X(9.5), Y(25), 560, Y(25), '臭氧層：約 20～30 公里\n濃度最高，吸收紫外線', { anchor: 'start', weight: 700, color: C.teal });
  s += T(560, Y(8), '氟氯碳化物（冷媒）\n會破壞臭氧層', { size: 12, anchor: 'start', fill: C.red });
  return svg(w, h, s);
});

export default F;
