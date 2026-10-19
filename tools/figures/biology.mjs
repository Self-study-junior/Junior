// 生物附圖（自行繪製的示意圖）
import { C, svg, T, TV, R, O, E, P, L, G, A, AQ, B, callout, smooth, legend, note } from './lib.mjs';

const F = {};
const fig = (k, cap, fn) => { F[k] = { cap, svg: fn }; };

// 小工具：簡化的人形輪廓（中心 x，頭頂 y，比例 s）
function body(cx, y, s = 1, fill = '#fbe9dd') {
  const p = (x, yy) => `${cx + x * s} ${y + yy * s}`;
  return P(`M${p(-22, 0)}C${p(-22, -30)} ${p(22, -30)} ${p(22, 0)}C${p(22, 22)} ${p(12, 34)} ${p(8, 40)}L${p(8, 48)}C${p(40, 52)} ${p(62, 60)} ${p(66, 80)}L${p(80, 200)}L${p(64, 202)}L${p(50, 100)}L${p(48, 200)}L${p(42, 340)}L${p(12, 340)}L${p(4, 210)}L${p(-4, 210)}L${p(-12, 340)}L${p(-42, 340)}L${p(-48, 200)}L${p(-50, 100)}L${p(-64, 202)}L${p(-80, 200)}L${p(-66, 80)}C${p(-62, 60)} ${p(-40, 52)} ${p(-8, 48)}L${p(-8, 40)}C${p(-12, 34)} ${p(-22, 22)} ${p(-22, 0)}Z`,
    { fill, stroke: '#d9b9a3', sw: 1.5 });
}

fig('u1-s2', '生物圈的範圍與生物分布：愈接近海平面，生物種類與數量愈多', () => {
  const w = 760, h = 360;
  let s = R(0, 0, 300, 150, { fill: '#e4f1fb', stroke: 'none', r: 0 }) + R(0, 150, 300, 210, { fill: '#cfe5f5', stroke: 'none', r: 0 });
  s += P('M0 150 L60 150 L120 40 L170 110 L210 70 L270 150 L300 150 L300 360 L0 360Z', { fill: '#c9b48f', stroke: 'none' });
  s += P('M0 150 L60 150 L80 150 L95 260 L110 330 L130 260 L150 150 L300 150', { fill: 'none', stroke: 'none' });
  s += P('M60 150 L90 250 L110 330 L135 250 L160 150Z', { fill: '#3d6f9e' });
  s += P('M0 150H60M160 150H300', { stroke: C.blue, sw: 2 });
  s += P('M120 40 L132 58 L108 58Z', { fill: '#fff' });
  s += T(20, 150, '海平面', { size: 12, anchor: 'start', fill: C.blue, halo: true }).replace('y="150"', 'y="140"');
  // 生物量箭頭
  s += A([[330, 150], [330, 30]], { stroke: C.red, sw: 6 }) + A([[330, 150], [330, 330]], { stroke: C.red, sw: 6 });
  s += T(330, 20, '少', { size: 14, fill: C.red, weight: 700 }) + T(330, 345, '少', { size: 14, fill: C.red, weight: 700 }) + T(352, 150, '多', { size: 15, fill: C.red, weight: 700 });
  s += T(312, 95, '約 10 公里', { size: 12, fill: C.muted, rotate: -90 }) + T(312, 245, '約 10 公里', { size: 12, fill: C.muted, rotate: -90 });
  const row = (y, t, c) => R(390, y, 360, 52, { fill: c, stroke: 'none', r: 8 }) + T(405, y + 26, t, { anchor: 'start', size: 14 });
  s += row(24, '高空：空氣稀薄、溫度低 → 生物稀少', C.grayS);
  s += row(96, '高山：空氣稀薄、氣溫低 → 生物種類、數量少', C.greenS);
  s += row(168, '熱帶雨林、珊瑚礁海域：溫暖、陽光充足\n→ 生物種類、數量最多', '#c9e7d4');
  s += row(272, '深海：陽光不足、水壓大 → 生物種類、數量少', C.blueS);
  return svg(w, h, s);
});

fig('u1-s3', '動物細胞與植物細胞的構造比較', () => {
  const w = 780, h = 380;
  let s = '';
  // 動物細胞
  s += P(smooth([[70, 120], [150, 70], [250, 90], [300, 170], [270, 280], [170, 320], [80, 280], [50, 200]]), { fill: '#fde6d6', stroke: '#d48a66', sw: 3 });
  s += O(170, 190, 42, { fill: '#e7d3f2', stroke: C.purple, sw: 2 }) + O(178, 182, 12, { fill: C.purple, stroke: 'none', op: .6 });
  for (const [x, y, r] of [[100, 150, 0], [240, 240, 30], [230, 130, -20], [110, 250, 40]]) s += E(x, y, 20, 10, { fill: '#f6b98d', stroke: '#c97a46', sw: 1.5 }).replace('/>', ` transform="rotate(${r} ${x} ${y})"/>`);
  s += O(250, 190, 9, { fill: '#fff', stroke: '#c9a', sw: 1 });
  s += T(175, 30, '動物細胞', { size: 18, weight: 700, fill: '#c0603c' });
  // 植物細胞
  s += R(470, 70, 260, 260, { fill: '#bfe3b5', stroke: '#5d9c4f', sw: 7, r: 14 });
  s += R(478, 78, 244, 244, { fill: '#e6f6df', stroke: '#7bb26b', sw: 2, r: 10 });
  s += R(540, 130, 150, 150, { fill: '#d6ecf7', stroke: '#7fb5d6', sw: 1.5, r: 40 });
  s += O(515, 120, 30, { fill: '#e7d3f2', stroke: C.purple, sw: 2 }) + O(520, 115, 9, { fill: C.purple, stroke: 'none', op: .6 });
  for (const [x, y] of [[505, 210], [510, 285], [610, 300], [700, 110], [700, 300], [600, 100]]) s += E(x, y, 15, 8, { fill: '#5aa24a', stroke: '#2f6d2a', sw: 1.2 });
  s += E(570, 300, 14, 7, { fill: '#f6b98d', stroke: '#c97a46', sw: 1.2 });
  s += T(600, 30, '植物細胞', { size: 18, weight: 700, fill: '#3f7f34' });
  // 共同構造（中間）
  const mid = 380;
  s += T(mid, 70, '兩者都有', { size: 13, weight: 700, fill: C.purple });
  s += callout(205, 170, mid - 30, 100, '細胞核', { anchor: 'start' }) + callout(470 + 45, 120, mid + 30, 100, '', { dot: true });
  s += callout(296, 175, mid - 30, 155, '細胞膜', { anchor: 'start' }) + callout(478, 160, mid + 30, 155, '', {});
  s += callout(240, 240, mid - 30, 210, '粒線體', { anchor: 'start' }) + callout(570, 300, mid + 30, 210, '', {});
  s += callout(200, 270, mid - 30, 265, '細胞質', { anchor: 'start' }) + callout(500, 250, mid + 30, 265, '', {});
  s += T(mid + 10, 300, '植物細胞特有', { size: 13, weight: 700, fill: C.green });
  s += callout(470, 330, mid + 30, 330, '細胞壁', { anchor: 'end' }) + callout(505, 210, mid + 30, 355, '葉綠體', { anchor: 'end' });
  s += callout(640, 250, 700, 355, '液胞', { anchor: 'middle' });
  s += T(170, 355, '動物細胞也可能有小液胞，但不明顯', { size: 12, fill: C.muted });
  return svg(w, h, s);
});

fig('u1-s4', '物質進出細胞膜：小分子可直接通過，部分分子需特殊蛋白質協助，大分子無法通過', () => {
  const w = 760, h = 300;
  let s = R(20, 130, 720, 60, { fill: '#fbe3c8', stroke: 'none', r: 4 });
  for (let x = 28; x < 740; x += 16) s += O(x, 136, 5, { fill: '#e8a25c', stroke: 'none' }) + O(x, 184, 5, { fill: '#e8a25c', stroke: 'none' });
  s += T(10, 80, '細胞外', { anchor: 'start', size: 13, fill: C.muted }) + T(10, 240, '細胞內', { anchor: 'start', size: 13, fill: C.muted });
  // 小分子
  const sm = [['氧氣', 120], ['二氧化碳', 210], ['水', 300]];
  for (const [t, x] of sm) s += A([[x - 10, 60], [x - 10, 260]], { stroke: C.teal, sw: 2.5, both: true }) + T(x - 10, 40, t, { size: 14, weight: 700, fill: C.teal });
  // 蛋白質通道
  for (const [t, x] of [['葡萄糖', 440], ['胺基酸', 560]]) {
    s += R(x - 22, 116, 44, 88, { fill: '#9b7cc9', stroke: '#6c4fa0', r: 14 }) + R(x - 5, 116, 10, 88, { fill: '#fbe3c8', stroke: 'none', r: 0 });
    s += A([[x, 60], [x, 260]], { stroke: C.purple, sw: 2.5 }) + T(x, 40, t, { size: 14, weight: 700, fill: C.purple });
  }
  s += T(500, 280, '需特殊蛋白質協助', { size: 12, fill: C.purple });
  s += T(210, 280, '小分子：可直接通過', { size: 12, fill: C.teal });
  // 大分子
  for (const [t, x] of [['澱粉', 660], ['蛋白質', 720]]) s += A([[x, 60], [x, 115]], { stroke: C.red, sw: 2.5 }) + T(x, 40, t, { size: 14, weight: 700, fill: C.red }) + T(x, 105, '✕', { size: 22, fill: C.red, weight: 700 }).replace(`x="${x}"`, `x="${x + 16}"`);
  s += T(690, 230, '大分子\n無法通過', { size: 12, fill: C.red });
  return svg(w, h, s);
});

fig('u1-s5', '複式顯微鏡的構造', () => {
  const w = 800, h = 470;
  let s = '<g transform="translate(70 0)">';
  const g = '#5d6670', gl = '#8d97a1';
  s += P('M200 430 L420 430 L400 395 L230 395Z', { fill: g }); // 鏡座
  s += P('M360 395 C420 330 420 230 360 150 L335 165 C385 235 385 320 330 390Z', { fill: gl, stroke: g, sw: 2 }); // 鏡臂
  s += R(220, 268, 160, 14, { fill: g, r: 3 }); // 載物台
  s += R(240, 262, 50, 6, { fill: '#cfd6dd', stroke: g, sw: 1, r: 1 }) + R(300, 262, 34, 5, { fill: '#cfd6dd', stroke: g, sw: 1, r: 1 });
  s += E(285, 295, 26, 6, { fill: '#9aa3ac', stroke: g }); // 光圈
  s += O(285, 345, 20, { fill: '#e9f2f8', stroke: g, sw: 3 }); // 反光鏡/燈
  s += P('M245 85 L285 85 L292 190 L238 190Z', { fill: '#9aa3ac', stroke: g, sw: 2 }).replace('M245 85', 'M250 85'); // 鏡筒
  s += R(252, 40, 36, 50, { fill: g, r: 4 }); // 目鏡
  s += P('M226 190 L310 190 L318 208 L218 208Z', { fill: '#7b858f', stroke: g, sw: 1.5 }); // 旋轉盤
  s += R(232, 208, 14, 34, { fill: '#aab3bb', stroke: g, sw: 1, r: 2 }) + R(262, 208, 14, 46, { fill: '#aab3bb', stroke: g, sw: 1, r: 2 }) + R(292, 208, 12, 26, { fill: '#aab3bb', stroke: g, sw: 1, r: 2 });
  s += O(390, 300, 22, { fill: '#7b858f', stroke: g, sw: 2 }) + O(390, 300, 10, { fill: '#aab3bb', stroke: g, sw: 2 });
  s += P('M335 165 L360 150', { stroke: g, sw: 2 });
  const lt = (x, y, tx, ty, a, b) => callout(x, y, tx, ty, a, { anchor: tx < x ? 'end' : 'start', size: 14, weight: 700 }) + T(tx, ty + 18, b, { anchor: tx < x ? 'end' : 'start', size: 12, fill: C.muted });
  s += lt(270, 60, 150, 50, '目鏡', '放大物體影像（看長度倍率）');
  s += lt(248, 130, 150, 115, '鏡筒', '');
  s += lt(228, 198, 150, 170, '旋轉盤', '轉換物鏡');
  s += lt(238, 235, 150, 225, '物鏡', '放大影像；愈長倍率愈高');
  s += lt(250, 264, 150, 270, '玻片夾', '固定玻片');
  s += lt(222, 275, 150, 310, '載物台', '放置標本');
  s += lt(262, 296, 150, 350, '光圈', '調整光的通過量');
  s += lt(270, 350, 150, 395, '反光鏡（燈源）', '反射光線或發光');
  s += lt(400, 360, 480, 395, '鏡臂', '拿取時握住');
  s += lt(405, 288, 480, 255, '粗調節輪', '大幅調整物鏡與玻片距離');
  s += lt(395, 305, 480, 310, '細調節輪', '小幅調整，使影像清晰');
  s += lt(410, 425, 480, 440, '鏡座', '');
  s += T(560, 60, '放大倍率 ＝\n目鏡倍率 × 物鏡倍率', { size: 14, weight: 700, fill: C.teal });
  return svg(w, h, s + '</g>');
});

fig('u2-s1', '澱粉與糖類的檢驗', () => {
  const w = 760, h = 300;
  let s = '';
  s += B(20, 40, 120, 44, '澱粉液', { fill: '#fff' }) + T(160, 62, '＋', { size: 22 }) + B(180, 40, 110, 44, '碘液（黃褐色）', { fill: '#f6e0b5', size: 13 });
  s += A([[300, 62], [345, 62]], { stroke: C.ink }) + B(355, 40, 120, 44, '藍黑色', { fill: '#2b3a73', color: '#fff', weight: 700 });
  s += T(510, 62, '→ 含澱粉', { anchor: 'start', size: 14, fill: C.muted });
  s += B(20, 140, 120, 44, '糖液（葡萄糖、\n麥芽糖等）', { fill: '#fff', size: 13 }) + T(160, 162, '＋', { size: 22 }) + B(180, 140, 110, 44, '本氏液（藍色）', { fill: '#7fb3e3', size: 13 });
  s += A([[300, 162], [345, 162]], { stroke: C.ink }) + T(322, 145, '隔水加熱', { size: 11, fill: C.red });
  s += T(355, 162, '綠 → 黃 → 橙 → 紅', { anchor: 'start', size: 15, weight: 700, fill: C.orange });
  s += T(355, 190, '糖量愈多，顏色愈偏紅', { anchor: 'start', size: 12, fill: C.muted });
  const cols = ['#7fb3e3', '#7cc47a', '#e5d34c', '#eb9a3c', '#d4473b'], lab = ['無糖', '極少', '少', '中', '多'];
  cols.forEach((c, i) => {
    const x = 530 + i * 44;
    s += P(`M${x} 130 L${x} 230 A12 12 0 0 0 ${x + 24} 230 L${x + 24} 130`, { fill: 'none', stroke: C.ink, sw: 1.5 });
    s += P(`M${x + 1} 180 L${x + 1} 230 A11 11 0 0 0 ${x + 23} 230 L${x + 23} 180Z`, { fill: c, stroke: 'none' });
    s += T(x + 12, 262, lab[i], { size: 12 });
  });
  s += T(640, 285, '糖量', { size: 12, fill: C.muted });
  return svg(w, h, s);
});

fig('u2-s2', '溫度與酸鹼值對酵素活性的影響', () => {
  const w = 780, h = 320;
  let s = '';
  const axes = (x, y, ww, hh, xl, yl) => A([[x, y + hh], [x, y - 10]], { sw: 1.5 }) + A([[x, y + hh], [x + ww + 10, y + hh]], { sw: 1.5 }) + T(x + ww + 6, y + hh + 22, xl, { size: 12, anchor: 'end' }) + TV(x - 18, y + hh / 2, yl, { size: 12 });
  s += axes(50, 40, 300, 220, '溫度（°C）', '酵素活性');
  s += R(51, 40, 185, 219, { fill: C.blueS, stroke: 'none', r: 0 }) + R(236, 40, 114, 219, { fill: C.redS, stroke: 'none', r: 0 });
  s += P('M55 250 C120 240 190 120 236 70 C255 110 270 220 300 255', { stroke: C.red, sw: 3 });
  s += L(236, 70, 236, 260, { stroke: C.muted, dash: '4 4', sw: 1 }) + T(236, 276, '37', { size: 12 });
  s += T(140, 70, '一定範圍內\n溫度升高，活性增加', { size: 12 }) + T(296, 70, '溫度過高\n酵素構造破壞\n永久失去活性', { size: 12, fill: C.red });
  s += T(200, 305, '人體酵素最適溫度約 37°C', { size: 13, weight: 700 });
  s += axes(440, 40, 300, 220, '', '酵素活性') + T(600, 296, '酸鹼值（pH）', { size: 12 });
  const curve = (x0, c, lab) => P(`M${x0 - 40} 255 C${x0 - 20} 250 ${x0 - 15} 80 ${x0} 80 C${x0 + 15} 80 ${x0 + 20} 250 ${x0 + 40} 255`, { stroke: c, sw: 3 }) + T(x0, 66, lab, { size: 12, fill: c, weight: 700 });
  s += curve(490, C.teal, '胃液酵素') + curve(620, C.orange, '唾液酵素') + curve(670, C.purple, '小腸酵素');
  s += L(620, 260, 620, 266, {}) + T(620, 278, '7（中性）', { size: 11 });
  s += T(480, 278, '酸性 ←', { size: 11 }) + T(735, 278, '→ 鹼性', { size: 11 });
  s += T(590, 316, '不同酵素的最適 pH 值不同', { size: 13, weight: 700 });
  return svg(w, h, s);
});

fig('u2-s3', '葉片的橫切面構造', () => {
  const w = 760, h = 360;
  let s = '';
  const X0 = 40, X1 = 520;
  s += R(X0, 40, X1 - X0, 8, { fill: '#f4e7a8', stroke: 'none', r: 0 }); // 角質層
  for (let x = X0; x < X1; x += 30) s += R(x, 48, 30, 22, { fill: '#e8f4d8', stroke: '#8fbf7a', sw: 1, r: 3 });
  for (let x = X0 + 2; x < X1 - 10; x += 20) { s += R(x, 72, 17, 78, { fill: '#a9d98f', stroke: '#5e9e48', sw: 1, r: 7 }); for (let k = 0; k < 4; k++) s += O(x + 8.5, 84 + k * 18, 3.2, { fill: '#3e8a33', stroke: 'none' }); }
  const sp = [[60, 175], [100, 165], [140, 185], [190, 170], [330, 175], [380, 190], [430, 168], [480, 185], [70, 215], [130, 225], [360, 222], [420, 228], [490, 220], [230, 225], [300, 228]];
  for (const [x, y] of sp) s += E(x, y, 22, 15, { fill: '#c9e8b5', stroke: '#6aa555', sw: 1 }) + O(x - 5, y, 2.5, { fill: '#3e8a33', stroke: 'none' }) + O(x + 6, y + 3, 2.5, { fill: '#3e8a33', stroke: 'none' });
  // 葉脈
  s += O(265, 195, 38, { fill: '#f2e6c9', stroke: '#b59a5a', sw: 1.5 });
  s += P('M232 182 A38 38 0 0 1 298 182 L265 195Z', { fill: '#b9d3ef', stroke: '#5f8fbf', sw: 1 });
  s += P('M236 214 A38 38 0 0 0 294 214 L265 200Z', { fill: '#f4c79f', stroke: '#c98a4d', sw: 1 });
  for (let x = X0; x < X1; x += 30) if (x < 140 || x > 160) s += R(x, 250, 30, 22, { fill: '#e8f4d8', stroke: '#8fbf7a', sw: 1, r: 3 });
  s += R(X0, 272, X1 - X0, 8, { fill: '#f4e7a8', stroke: 'none', r: 0 });
  // 氣孔
  s += E(140, 262, 10, 12, { fill: '#7fc06a', stroke: '#2f6d2a', sw: 1 }) + E(162, 262, 10, 12, { fill: '#7fc06a', stroke: '#2f6d2a', sw: 1 });
  s += A([[151, 300], [151, 240]], { stroke: C.blue, sw: 1.8, both: true });
  const lb = (y, ty, a, b, c = C.ink) => callout(X1 - 2, y, 560, ty, a, { anchor: 'start', size: 14, weight: 700, color: c }) + T(560, ty + 18, b, { anchor: 'start', size: 12, fill: C.muted });
  s += lb(44, 25, '角質層', '防止水分散失');
  s += lb(60, 68, '上表皮', '透明、排列緊密，保護');
  s += lb(110, 115, '葉肉（柵狀組織）', '含大量葉綠體，光合作用主要場所', C.green);
  s += lb(200, 165, '葉肉（海綿組織）', '排列疏鬆，有空隙利於氣體流通', C.green);
  s += lb(262, 222, '下表皮', '氣孔多分布在下表皮');
  s += lb(276, 276, '角質層', '');
  s += callout(265, 175, 300, 22, '葉脈：木質部（運水）', { anchor: 'start', size: 12, color: C.blue }) + callout(265, 222, 300, 320, '葉脈：韌皮部（運送養分）', { anchor: 'start', size: 12, color: C.orange });
  s += callout(151, 275, 100, 330, '氣孔（由保衛細胞控制開閉）', { anchor: 'middle', size: 12, color: C.teal });
  return svg(w, h, s);
});

fig('u2-s4', '人體的消化系統：消化管與消化腺', () => {
  const w = 840, h = 520;
  let s = '<g transform="translate(80 0)">' + body(300, 40, 1.3);
  const red = '#e98a8a';
  s += P('M300 92 Q300 105 300 120', { stroke: '#f5a3a3', sw: 8 }); // 口腔
  s += P('M300 120 L300 200', { stroke: red, sw: 7 }); // 食道
  s += P('M300 200 C330 190 350 210 345 235 C340 265 300 268 285 255', { fill: '#f3a2a2', stroke: '#c75a5a', sw: 2 }); // 胃
  s += P('M215 215 C240 190 300 192 300 210 C295 235 260 250 220 245Z', { fill: '#b45a45', stroke: '#8b3f2e', sw: 1.5, op: .9 }); // 肝
  s += E(262, 250, 8, 6, { fill: '#5aa24a', stroke: '#2f6d2a', sw: 1 }); // 膽囊
  s += P('M280 268 C300 262 330 266 345 258', { stroke: '#e8b25c', sw: 10 }); // 胰
  s += P('M235 300 L235 390 L365 390 L365 300 Z', { fill: 'none', stroke: '#c9875a', sw: 14, op: .8 }); // 大腸
  s += P('M260 310 C330 300 340 320 260 330 C200 340 340 350 260 360 C210 368 340 372 280 380', { stroke: '#f0b5a8', sw: 9 }); // 小腸
  s += P('M300 390 L300 420', { stroke: '#c9875a', sw: 10 });
  const left = [[300, 105, '口腔', '唾液腺分泌唾液：澱粉 → 麥芽糖'], [300, 160, '食道', '蠕動，把食物送入胃'], [230, 225, '肝臟', '分泌膽汁（不含酵素），乳化脂肪'], [262, 252, '膽囊', '儲存膽汁']];
  const right = [[335, 225, '胃', '胃液含酸，初步分解蛋白質'], [335, 262, '胰臟', '胰液可分解澱粉、蛋白質、脂質'], [300, 345, '小腸', '腸液；消化與吸收的主要場所'], [365, 330, '大腸', '吸收水分，形成糞便'], [300, 418, '肛門', '排出糞便']];
  left.forEach(([x, y, a, b], i) => { const ty = 80 + i * 80; s += callout(x, y, 180, ty, a, { anchor: 'end', size: 15, weight: 700 }) + T(180, ty + 20, b, { anchor: 'end', size: 12, fill: C.muted }); });
  right.forEach(([x, y, a, b], i) => { const ty = 110 + i * 80; s += callout(x, y, 450, ty, a, { anchor: 'start', size: 15, weight: 700 }) + T(450, ty + 20, b, { anchor: 'start', size: 12, fill: C.muted }); });
  s += T(340, 500, '消化管：口腔→咽→食道→胃→小腸→大腸→肛門　　消化腺：唾液腺、胃腺、肝臟、胰臟、腸腺', { size: 13, fill: C.teal, weight: 700 });
  return svg(w, h, s + '</g>');
});

fig('u3-s1', '莖的橫切面：維管束排列方式', () => {
  const w = 760, h = 330;
  let s = '';
  // 雙子葉
  s += O(170, 150, 110, { fill: '#eef6dc', stroke: '#7a9c4a', sw: 3 });
  s += O(170, 150, 74, { fill: 'none', stroke: '#2f8a63', sw: 2.5, dash: '0' });
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, x = 170 + 74 * Math.cos(a), y = 150 + 74 * Math.sin(a);
    s += E(170 + 86 * Math.cos(a), 150 + 86 * Math.sin(a), 11, 7, { fill: '#f4c79f', stroke: '#c98a4d', sw: 1 }).replace('/>', ` transform="rotate(${a * 180 / Math.PI} ${170 + 86 * Math.cos(a)} ${150 + 86 * Math.sin(a)})"/>`);
    s += E(170 + 62 * Math.cos(a), 150 + 62 * Math.sin(a), 13, 8, { fill: '#b9d3ef', stroke: '#5f8fbf', sw: 1 }).replace('/>', ` transform="rotate(${a * 180 / Math.PI} ${170 + 62 * Math.cos(a)} ${150 + 62 * Math.sin(a)})"/>`); }
  s += T(170, 20, '雙子葉植物的莖', { size: 16, weight: 700, fill: C.green });
  s += callout(170 + 86, 150, 330, 100, '韌皮部（外）', { anchor: 'start', color: C.orange, weight: 700 });
  s += callout(170 + 74 * Math.cos(.3), 150 + 74 * Math.sin(.3), 330, 150, '形成層', { anchor: 'start', color: C.green, weight: 700 });
  s += callout(170 + 62 * Math.cos(.55), 150 + 62 * Math.sin(.55), 330, 200, '木質部（內）', { anchor: 'start', color: C.blue, weight: 700 });
  s += T(170, 295, '維管束環狀排列；有形成層，莖可逐年加粗', { size: 13 });
  // 單子葉
  s += O(580, 150, 110, { fill: '#eef6dc', stroke: '#7a9c4a', sw: 3 });
  const pts = [[540, 90], [600, 80], [640, 120], [520, 150], [575, 140], [630, 175], [545, 205], [600, 215], [660, 140], [500, 110], [585, 250], [520, 245], [650, 225], [610, 110], [560, 175]];
  for (const [x, y] of pts) s += O(x, y, 9, { fill: '#f4c79f', stroke: '#c98a4d', sw: 1 }) + O(x, y + 4, 5, { fill: '#b9d3ef', stroke: '#5f8fbf', sw: 1 });
  s += T(580, 20, '單子葉植物的莖', { size: 16, weight: 700, fill: C.green });
  s += T(580, 295, '維管束散生；沒有形成層，莖不會明顯加粗', { size: 13 });
  return svg(w, h, s);
});

fig('u3-s2', '保衛細胞控制氣孔開閉', () => {
  const w = 700, h = 300;
  let s = '';
  const guard = (cx, open) => {
    const g = open ? 22 : 4;
    let o = P(`M${cx - g} 60 C${cx - 90} 70 ${cx - 90} 230 ${cx - g} 240 C${cx - g - 30} 190 ${cx - g - 30} 110 ${cx - g} 60Z`, { fill: '#9ed38a', stroke: '#3f7f34', sw: 2.5 });
    o += P(`M${cx + g} 60 C${cx + 90} 70 ${cx + 90} 230 ${cx + g} 240 C${cx + g + 30} 190 ${cx + g + 30} 110 ${cx + g} 60Z`, { fill: '#9ed38a', stroke: '#3f7f34', sw: 2.5 });
    if (open) o += P(`M${cx - g} 60 C${cx - g - 30} 110 ${cx - g - 30} 190 ${cx - g} 240 L${cx + g} 240 C${cx + g + 30} 190 ${cx + g + 30} 110 ${cx + g} 60Z`, { fill: '#e8f3fb', stroke: 'none' });
    o += O(cx - 52, 150, 10, { fill: '#8e7cc3', stroke: 'none' }) + O(cx + 52, 150, 10, { fill: '#8e7cc3', stroke: 'none' });
    for (const [dx, dy] of [[-60, 100], [-48, 200], [-58, 175], [60, 100], [48, 200], [58, 175], [-45, 120], [45, 120]]) o += O(cx + dx, dy, 3.5, { fill: '#2f8a3a', stroke: 'none' });
    return o;
  };
  s += guard(180, true) + T(180, 275, '氣孔張開', { size: 17, weight: 700 });
  s += guard(520, false) + T(520, 275, '氣孔關閉', { size: 17, weight: 700 });
  s += callout(128, 120, 30, 40, '保衛細胞', { anchor: 'start', weight: 700 });
  s += callout(180, 150, 290, 40, '氣孔', { anchor: 'start', weight: 700 });
  s += T(350, 150, '保衛細胞含葉綠體\n是表皮中能行光合作用的細胞\n\n氣孔是水分、氧氣、\n二氧化碳進出的通道', { size: 12, fill: C.muted });
  return svg(w, h, s);
});

fig('u3-s3', '心臟的構造（縱切面，左右以本人為準）', () => {
  const w = 720, h = 455;
  let s = '';
  s += P('M360 110 C300 70 200 90 200 190 C200 290 300 350 360 400 C420 350 520 290 520 190 C520 90 420 70 360 110Z', { fill: '#f3b3ad', stroke: '#b5473e', sw: 3 });
  // 腔室（圖的左側＝本人右側）
  s += P('M225 170 C230 130 290 120 330 140 L330 210 L230 210Z', { fill: '#a9c4ea', stroke: '#4e6fa5', sw: 2 }); // 右心房
  s += P('M232 222 L330 222 L345 360 C300 330 245 290 232 222Z', { fill: '#8fb0e2', stroke: '#4e6fa5', sw: 2 }); // 右心室
  s += P('M390 140 C430 120 490 130 495 170 L490 210 L390 210Z', { fill: '#f08c84', stroke: '#b5473e', sw: 2 }); // 左心房
  s += P('M390 222 L490 222 C480 300 420 340 375 365Z', { fill: '#e76d64', stroke: '#b5473e', sw: 3.5 }); // 左心室（壁最厚）
  // 血管
  s += P('M290 20 L290 150', { stroke: '#4e6fa5', sw: 22 }) + P('M250 420 C250 380 260 340 270 300', { stroke: '#4e6fa5', sw: 18, op: .9 });
  s += P('M330 230 C330 120 360 80 300 50', { stroke: '#7b9ad0', sw: 16 }); // 肺動脈
  s += P('M380 230 C380 80 420 40 470 50 C510 55 520 90 520 110', { stroke: '#d9534a', sw: 20 }); // 主動脈
  s += P('M495 165 L600 140M495 185 L600 195', { stroke: '#e57f78', sw: 9 }); // 肺靜脈
  // 瓣膜
  for (const [x, y] of [[280, 216], [440, 216]]) s += P(`M${x - 22} ${y - 6} L${x} ${y + 12} L${x + 22} ${y - 6}`, { stroke: '#fff', sw: 3 });
  const lb = (x, y, tx, ty, t, c = C.ink) => callout(x, y, tx, ty, t, { size: 14, weight: 700, color: c });
  s += lb(290, 30, 160, 30, '上大靜脈', C.blue) + lb(255, 400, 160, 410, '下大靜脈', C.blue);
  s += lb(330, 70, 160, 80, '肺動脈', C.blue) + lb(260, 175, 160, 170, '右心房', C.blue) + lb(270, 280, 160, 290, '右心室', C.blue) + lb(260, 216, 160, 230, '瓣膜');
  s += lb(500, 65, 610, 60, '主動脈', C.red) + lb(600, 140, 610, 110, '肺靜脈', C.red) + lb(460, 170, 610, 175, '左心房', C.red) + lb(455, 270, 610, 270, '左心室', C.red) + lb(462, 214, 610, 222, '瓣膜');
  s += T(610, 300, '壁最厚：把血液\n送往全身', { size: 12, fill: C.muted, anchor: 'start' });
  s += T(360, 442, '心房接靜脈（血液回心）、心室接動脈（血液離心）；瓣膜防止血液倒流', { size: 13, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

fig('u3-s4', '血液循環：肺循環與體循環', () => {
  const w = 720, h = 460;
  let s = '';
  s += B(240, 20, 240, 60, '肺部微血管\n排出 CO₂、獲得 O₂', { fill: '#fde7e2', stroke: C.red });
  s += B(240, 380, 240, 60, '全身組織微血管\n交換養分、氧氣與廢物', { fill: '#fde7e2', stroke: C.red });
  s += B(200, 160, 120, 50, '右心房', { fill: '#dbe6f7', stroke: C.blue, weight: 700 }) + B(200, 250, 120, 50, '右心室', { fill: '#dbe6f7', stroke: C.blue, weight: 700 });
  s += B(400, 160, 120, 50, '左心房', { fill: '#f9d6d3', stroke: C.red, weight: 700 }) + B(400, 250, 120, 50, '左心室', { fill: '#f9d6d3', stroke: C.red, weight: 700 });
  s += A([[260, 212], [260, 248]], { stroke: C.blue }) + A([[460, 212], [460, 248]], { stroke: C.red });
  // 肺循環
  s += A([[200, 275], [130, 275], [130, 50], [238, 50]], { stroke: C.blue, sw: 4 }) + T(112, 160, '肺動脈', { size: 14, weight: 700, fill: C.blue, rotate: -90 });
  s += A([[482, 50], [590, 50], [590, 185], [522, 185]], { stroke: C.red, sw: 4 }) + T(610, 118, '肺靜脈', { size: 14, weight: 700, fill: C.red, rotate: 90 });
  // 體循環
  s += A([[520, 275], [650, 275], [650, 410], [482, 410]], { stroke: C.red, sw: 4 }) + T(670, 340, '主動脈', { size: 14, weight: 700, fill: C.red, rotate: 90 });
  s += A([[238, 410], [70, 410], [70, 185], [198, 185]], { stroke: C.blue, sw: 4 }) + T(52, 300, '大靜脈', { size: 14, weight: 700, fill: C.blue, rotate: -90 });
  s += T(360, 115, '肺循環：右心室 → 肺動脈 → 肺 → 肺靜脈 → 左心房', { size: 13, fill: C.muted });
  s += T(360, 340, '體循環：左心室 → 主動脈 → 全身 → 大靜脈 → 右心房', { size: 13, fill: C.muted });
  s += legend(560, 4, [['line', C.red, '充氧血'], ['line', C.blue, '缺氧血']], { w: 110, gap: 20 }).replace(/<rect[^>]*?\/>/, '');
  return svg(w, h, s);
});

fig('u3-s5', '血液的組成（靜置或離心後分層）', () => {
  const w = 640, h = 330;
  let s = '';
  s += P('M110 30 L110 260 A40 40 0 0 0 190 260 L190 30', { fill: 'none', stroke: C.ink, sw: 2 });
  s += R(111, 60, 78, 110, { fill: '#f7d9a3', stroke: 'none', r: 0 });
  s += R(111, 170, 78, 12, { fill: '#f2efe8', stroke: 'none', r: 0 });
  s += P('M111 182 L111 260 A39 39 0 0 0 189 260 L189 182Z', { fill: '#9b1c22', stroke: 'none' });
  s += P('M90 60 L80 60 L80 170 L90 170', { stroke: C.ink, sw: 1.5 }) + T(62, 115, '血漿', { size: 15, weight: 700, rotate: -90 });
  s += P('M90 182 L80 182 L80 295 L90 295', { stroke: C.ink, sw: 1.5 }) + T(62, 240, '血球', { size: 15, weight: 700, rotate: -90 });
  s += callout(190, 115, 240, 80, '血漿（淡黃色液體，約占 55%）', { anchor: 'start', size: 15, weight: 700 });
  s += T(240, 104, '約 90% 是水，含養分、二氧化碳、廢物（如尿素）、\n激素和抗體等，負責運輸', { anchor: 'start', size: 12, fill: C.muted });
  s += callout(190, 176, 240, 165, '白血球、血小板（薄薄一層）', { anchor: 'start', size: 15, weight: 700 });
  s += T(240, 189, '白血球：吞噬病原體、產生抗體　血小板：幫助血液凝固', { anchor: 'start', size: 12, fill: C.muted });
  s += callout(190, 240, 240, 245, '紅血球（最多）', { anchor: 'start', size: 15, weight: 700, color: '#9b1c22' });
  s += T(240, 269, '含血紅素，負責運送氧氣；成熟時沒有細胞核', { anchor: 'start', size: 12, fill: C.muted });
  return svg(w, h, s);
});

fig('u3-s6', '微血管、組織液與淋巴管', () => {
  const w = 700, h = 340;
  let s = R(60, 50, 580, 250, { fill: '#f6ecd4', stroke: '#d9c393', r: 120 });
  for (let i = 0; i < 40; i++) { const x = 100 + (i * 73) % 500, y = 80 + (i * 47) % 190; s += O(x, y, 9, { fill: '#efdcae', stroke: '#c9ad72', sw: 1 }); }
  s += P('M30 210 C150 210 200 120 330 140 C450 160 500 230 670 200', { stroke: '#d9534a', sw: 18, op: .85 });
  s += P('M330 140 C450 160 500 230 670 200', { stroke: '#6a8fd0', sw: 18, op: .85 });
  s += P('M200 300 C260 230 330 210 420 120 C460 80 520 60 600 40', { stroke: '#f2d65c', sw: 14 });
  for (const [x, y, a] of [[250, 175, -60], [300, 190, -70], [380, 190, 20], [430, 170, 0]]) s += A([[x, y], [x + 30 * Math.cos(a * Math.PI / 180), y + 30 * Math.sin(a * Math.PI / 180)]], { stroke: C.green, sw: 2 });
  s += callout(70, 210, 70, 30, '小動脈', { anchor: 'middle', weight: 700, color: C.red });
  s += callout(640, 205, 640, 320, '小靜脈', { anchor: 'middle', weight: 700, color: C.blue });
  s += callout(330, 140, 330, 26, '微血管', { anchor: 'middle', weight: 700 });
  s += callout(560, 52, 560, 26, '淋巴管', { anchor: 'middle', weight: 700, color: '#b08d00' });
  s += callout(150, 260, 30, 320, '組織細胞', { anchor: 'start', weight: 700 });
  s += T(360, 320, '血漿滲出微血管成為組織液 → 部分進入淋巴管成為淋巴 → 最後流回靜脈', { size: 13, fill: C.green, weight: 700 });
  return svg(w, h, s);
});

fig('u3-s7', '注射疫苗與二次感染的防禦反應', () => {
  const w = 720, h = 320;
  let s = A([[60, 270], [60, 30]], { sw: 1.5 }) + A([[60, 270], [690, 270]], { sw: 1.5 }) + TV(36, 150, '專一性防禦強度', { size: 12 }) + T(690, 292, '時間', { size: 12, anchor: 'end' });
  s += P('M70 268 C140 266 170 160 220 150 C270 145 290 250 330 255', { stroke: C.blue, sw: 3, fill: C.blueS });
  s += P('M380 262 C410 250 420 60 470 50 C540 45 600 70 680 90', { stroke: C.orange, sw: 3, fill: 'none' });
  s += P('M380 262 C410 250 420 60 470 50 C540 45 600 70 680 90 L680 270 L380 270Z', { fill: C.orangeS, stroke: 'none' });
  s += P('M330 255 C345 258 360 268 380 262', { stroke: C.muted, sw: 2, dash: '4 4' });
  s += A([[80, 60], [80, 250]], { stroke: C.teal, sw: 2 }) + T(90, 50, '注射疫苗（初次感染）', { anchor: 'start', size: 13, fill: C.teal, weight: 700 });
  s += A([[385, 60], [385, 245]], { stroke: C.red, sw: 2 }) + T(395, 32, '病原體入侵（再次感染）', { anchor: 'start', size: 13, fill: C.red, weight: 700 });
  s += B(160, 105, 120, 36, '第一次防禦反應', { fill: C.blue, stroke: 'none', color: '#fff', size: 13 });
  s += T(220, 215, '反應慢、強度較弱', { size: 13 });
  s += B(500, 80, 120, 36, '第二次防禦反應', { fill: C.orange, stroke: 'none', color: '#fff', size: 13 });
  s += T(560, 160, '反應快、強度更強', { size: 13 });
  s += T(360, 305, '疫苗讓身體預先產生記憶，再遇到相同病原體時能迅速產生大量抗體', { size: 13, fill: C.muted });
  return svg(w, h, s);
});

fig('u4-s2', '人體神經系統的組成', () => {
  const w = 780, h = 440;
  let s = body(250, 40, 1.15, '#fbefe6');
  s += P(smooth([[225, 18], [250, 8], [275, 18], [280, 45], [250, 58], [220, 45]]), { fill: '#f4c7b5', stroke: '#c98a73', sw: 1.5 });
  s += L(250, 58, 250, 270, { stroke: C.orange, sw: 6 }); // 脊髓
  for (let i = 0; i < 9; i++) { const y = 90 + i * 20; s += P(`M250 ${y} C230 ${y + 8} 200 ${y + 20} ${170 - i * 2} ${y + 40}`, { stroke: C.teal, sw: 1.4 }) + P(`M250 ${y} C270 ${y + 8} 300 ${y + 20} ${330 + i * 2} ${y + 40}`, { stroke: C.teal, sw: 1.4 }); }
  s += P('M250 260 C240 320 230 360 225 420M250 260 C260 320 270 360 275 420', { stroke: C.teal, sw: 1.6 });
  s += P('M232 40 C210 50 205 70 200 80M268 40 C290 50 295 70 300 80', { stroke: C.purple, sw: 1.6 });
  // 架構圖
  const X = 420;
  s += B(X, 40, 120, 40, '神經系統', { fill: C.ink, stroke: 'none', color: '#fff', weight: 700 });
  s += B(X - 40, 130, 130, 40, '中樞神經系統', { fill: C.orangeS, stroke: C.orange, weight: 700 }) + B(X + 130, 130, 130, 40, '周圍神經系統', { fill: C.tealS, stroke: C.teal, weight: 700 });
  s += A([[X + 50, 80], [X + 25, 128]]) + A([[X + 70, 80], [X + 195, 128]]);
  s += B(X - 60, 220, 70, 36, '腦', { fill: '#fff', stroke: C.orange }) + B(X + 30, 220, 70, 36, '脊髓', { fill: '#fff', stroke: C.orange });
  s += A([[X + 10, 170], [X - 25, 218]]) + A([[X + 40, 170], [X + 65, 218]]);
  s += B(X + 125, 220, 70, 36, '腦神經', { fill: '#fff', stroke: C.teal }) + B(X + 215, 220, 70, 36, '脊神經', { fill: '#fff', stroke: C.teal });
  s += A([[X + 180, 170], [X + 160, 218]]) + A([[X + 210, 170], [X + 250, 218]]);
  s += T(X - 60, 320, '大腦：意識、思考、記憶\n小腦：平衡、協調動作\n腦幹：控制心跳、呼吸', { size: 12, anchor: 'start' });
  s += T(X - 60, 385, '脊髓：連絡腦與周圍神經，是反射中樞', { size: 12, anchor: 'start' });
  s += T(X + 205, 290, '腦神經連接腦\n脊神經連接脊髓', { size: 12 });
  s += callout(250, 30, 140, 30, '腦', { anchor: 'end', weight: 700, color: C.orange }) + callout(250, 160, 140, 120, '脊髓', { anchor: 'end', weight: 700, color: C.orange });
  s += callout(205, 75, 140, 75, '腦神經', { anchor: 'end', weight: 700, color: C.purple }) + callout(195, 205, 140, 220, '脊神經', { anchor: 'end', weight: 700, color: C.teal });
  return svg(w, h, s);
});

fig('u4-s4', '人體主要的內分泌腺', () => {
  const w = 760, h = 470;
  let s = body(380, 40, 1.2);
  const gland = (x, y, rx, ry, c) => E(x, y, rx, ry, { fill: c, stroke: '#7a4b2a', sw: 1.2 });
  s += gland(380, 30, 7, 5, '#b77dd9') + gland(380, 98, 14, 7, '#e8a24c') + O(372, 98, 2.5, { fill: '#c0503c', stroke: 'none' }) + O(388, 98, 2.5, { fill: '#c0503c', stroke: 'none' });
  s += E(362, 255, 9, 15, { fill: '#c98a8a', stroke: '#8b4a4a' }) + E(398, 255, 9, 15, { fill: '#c98a8a', stroke: '#8b4a4a' });
  s += gland(362, 238, 7, 4, '#f2c94c') + gland(398, 238, 7, 4, '#f2c94c') + P('M362 228 C380 222 400 226 412 232', { stroke: '#e8b25c', sw: 7 });
  s += gland(366, 330, 7, 5, '#f29aa6') + gland(394, 330, 7, 5, '#f29aa6');
  const L1 = [[380, 30, 60, '腦垂腺', '生長激素：促進生長'], [380, 98, 140, '甲狀腺', '甲狀腺素：調節代謝、生長發育'], [372, 98, 220, '副甲狀腺', '調節血鈣濃度'], [362, 238, 300, '腎上腺', '腎上腺素：心跳加快、血糖升高']];
  const R1 = [[412, 232, 150, '胰島（位於胰臟）', '胰島素：降低血糖\n升糖素：提高血糖'], [394, 330, 250, '性腺', '卵巢（女）：動情素\n睪丸（男）：睪固酮\n促進第二性徵']];
  L1.forEach(([x, y, ty, a, b]) => s += callout(x, y, 260, ty, a, { anchor: 'end', size: 15, weight: 700, color: C.purple }) + T(260, ty + 20, b, { anchor: 'end', size: 12, fill: C.muted }));
  R1.forEach(([x, y, ty, a, b]) => s += callout(x, y, 500, ty, a, { anchor: 'start', size: 15, weight: 700, color: C.purple }) + T(500, ty + 30, b, { anchor: 'start', size: 12, fill: C.muted }));
  s += T(380, 450, '內分泌腺沒有導管，激素直接分泌到血液中，隨血液運送到全身', { size: 13, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

fig('u5-s1', '不同動物的氣體交換構造', () => {
  const w = 780, h = 300;
  let s = '';
  const panel = (x, t, sub) => R(x, 20, 240, 260, { fill: '#fff', stroke: C.line, sw: 1, r: 12 }) + T(x + 120, 45, t, { size: 16, weight: 700 }) + T(x + 120, 255, sub, { size: 12, fill: C.muted });
  s += panel(15, '魚類：鰓', '鰓絲布滿微血管，與水中的氧交換');
  for (let i = 0; i < 6; i++) s += P(`M${50 + i * 30} 90 C${40 + i * 30} 140 ${60 + i * 30} 180 ${50 + i * 30} 220`, { stroke: '#d9534a', sw: 9 });
  s += A([[40, 75], [220, 75]], { stroke: C.blue, sw: 2 }) + T(130, 65, '水流', { size: 12, fill: C.blue });
  s += panel(270, '兩生類：皮膚＋肺', '皮膚薄而濕潤，布滿微血管');
  s += R(300, 110, 180, 30, { fill: '#c9e3a7', stroke: '#6e9b45', r: 4 }) + R(300, 140, 180, 60, { fill: '#f6d6c8', stroke: '#c98a73', r: 4 });
  for (let x = 310; x < 480; x += 28) s += P(`M${x} 200 C${x + 8} 160 ${x + 14} 160 ${x + 22} 200`, { stroke: '#d9534a', sw: 2 });
  s += A([[340, 80], [340, 125]], { stroke: C.teal, sw: 2 }) + T(355, 80, 'O₂', { size: 13, fill: C.teal, anchor: 'start' });
  s += A([[440, 125], [440, 80]], { stroke: C.muted, sw: 2 }) + T(455, 80, 'CO₂', { size: 13, fill: C.muted, anchor: 'start' });
  s += panel(525, '昆蟲：氣管', '氣門→氣管分支，直接送氣到細胞');
  s += E(645, 150, 95, 40, { fill: '#cfe8a8', stroke: '#6e9b45' });
  for (const x of [580, 620, 660, 700]) { s += O(x, 188, 4, { fill: '#fff', stroke: C.ink }); s += P(`M${x} 184 L${x} 150 M${x} 160 L${x - 12} 130 M${x} 160 L${x + 12} 128`, { stroke: C.brown, sw: 1.8 }); }
  s += P('M570 150 L720 150', { stroke: C.brown, sw: 3 }) + callout(620, 188, 600, 225, '氣門', { anchor: 'end', size: 12 }) + callout(660, 150, 700, 90, '氣管', { anchor: 'start', size: 12 });
  return svg(w, h, s);
});

fig('u5-s2', '呼吸運動與鐘形罩模型', () => {
  const w = 780, h = 380;
  let s = '';
  const tbl = [['', '吸氣', '呼氣'], ['肋骨', '上舉', '下降'], ['橫膈', '收縮下降', '舒張上升'], ['胸腔', '變大', '變小'], ['肺', '擴張', '回縮'], ['肺內壓力', '變小 → 空氣進入', '變大 → 空氣排出']];
  tbl.forEach((r, i) => r.forEach((c, j) => { const x = 20 + [0, 90, 240][j], ww = [90, 150, 150][j], y = 30 + i * 40;
    s += R(x, y, ww, 40, { fill: i === 0 ? (j === 1 ? C.blueS : j === 2 ? C.orangeS : C.soft) : j === 0 ? C.soft : '#fff', stroke: C.line, sw: 1, r: 0 }) + T(x + ww / 2, y + 20, c, { size: 13, weight: i === 0 || j === 0 ? 700 : 400 }); }));
  s += T(185, 300, '口訣：吸氣時「肋上膈下、胸大壓小」', { size: 14, weight: 700, fill: C.teal });
  // 鐘形罩
  const bell = (x, pull) => {
    let o = P(`M${x} 70 L${x} 90 C${x - 70} 100 ${x - 75} 160 ${x - 75} 250 L${x + 75} 250 C${x + 75} 160 ${x + 70} 100 ${x} 90`, { fill: '#eef6fb', stroke: '#6e93ad', sw: 2 });
    o += L(x, 60, x, 130, { stroke: C.ink, sw: 3 }) + P(`M${x} 130 L${x - 25} 150 M${x} 130 L${x + 25} 150`, { stroke: C.ink, sw: 3 });
    const r = pull ? 26 : 16;
    o += O(x - 25, 150 + r, r, { fill: '#f6a7a7', stroke: '#c75a5a' }) + O(x + 25, 150 + r, r, { fill: '#f6a7a7', stroke: '#c75a5a' });
    o += P(pull ? `M${x - 75} 250 Q${x} 300 ${x + 75} 250` : `M${x - 75} 250 Q${x} 240 ${x + 75} 250`, { stroke: '#7a5bb5', sw: 3, fill: '#e5dcf3' });
    o += A([[x, pull ? 285 : 275], [x, pull ? 320 : 248]], { stroke: C.red, sw: 2.5 });
    return o;
  };
  s += bell(480, true) + T(480, 350, '橡皮膜往下拉＝吸氣', { size: 13, weight: 700, fill: C.blue });
  s += bell(660, false) + T(660, 350, '放鬆＝呼氣', { size: 13, weight: 700, fill: C.orange });
  s += T(570, 25, '玻璃管＝氣管　氣球＝肺　鐘形罩＝胸腔　橡皮膜＝橫膈', { size: 12, fill: C.muted });
  return svg(w, h, s);
});

fig('u5-s3', '體溫的恆定：由腦的體溫調節中樞控制', () => {
  const w = 780, h = 300;
  let s = '';
  s += B(300, 115, 160, 60, '腦\n（體溫調節中樞）', { fill: C.purpleS, stroke: C.purple, weight: 700 });
  s += B(30, 40, 170, 50, '環境溫度低\n（體溫下降）', { fill: C.blueS, stroke: C.blue, weight: 700 });
  s += B(30, 200, 170, 50, '環境溫度高\n（體溫上升）', { fill: C.redS, stroke: C.red, weight: 700 });
  s += A([[200, 65], [298, 130]], { stroke: C.blue }) + A([[200, 225], [298, 160]], { stroke: C.red });
  s += A([[462, 130], [520, 65]], { stroke: C.blue }) + A([[462, 160], [520, 225]], { stroke: C.red });
  s += B(525, 20, 235, 100, '減少散熱、增加產熱\n・皮膚微血管收縮\n・減少流汗\n・肌肉顫抖、代謝增加', { fill: C.blueS, stroke: C.blue, size: 13 });
  s += B(525, 170, 235, 100, '增加散熱、減少產熱\n・皮膚微血管舒張\n・流汗增加\n・代謝減緩', { fill: C.redS, stroke: C.red, size: 13 });
  s += T(380, 285, '鳥類與哺乳類是恆溫動物，可維持體溫恆定', { size: 13, fill: C.muted });
  return svg(w, h, s);
});

fig('u5-s4', '一天中血糖濃度的變化與激素調節', () => {
  const w = 780, h = 340;
  let s = '';
  const X = v => 70 + (v - 6) * 42, Y = v => 280 - (v - 60) * 2;
  s += A([[70, 280], [70, 50]], { sw: 1.5 }) + A([[70, 280], [740, 280]], { sw: 1.5 });
  for (const v of [70, 90, 110, 130, 150]) s += L(66, Y(v), 70, Y(v), {}) + T(60, Y(v), v, { size: 11, anchor: 'end' });
  for (let t = 7; t <= 21; t += 2) s += T(X(t), 296, t + '時', { size: 11 });
  s += T(28, 165, '血糖濃度（毫克／100毫升）', { size: 11, rotate: -90 });
  s += R(71, Y(110), 668, Y(80) - Y(110), { fill: C.greenS, stroke: 'none', r: 0 }) + T(735, Y(95), '正常範圍', { size: 11, anchor: 'end', fill: C.green });
  const pts = [[7, 88], [8, 90], [8.6, 140], [9.5, 105], [10.5, 92], [12, 86], [12.6, 138], [13.5, 100], [15, 88], [16, 80], [16.6, 95], [17.5, 90], [18.6, 142], [19.5, 105], [21, 90]];
  s += P(smooth(pts.map(([a, b]) => [X(a), Y(b)]), false), { stroke: C.red, sw: 3 });
  for (const t of [8.6, 12.6, 18.6]) s += T(X(t), Y(150), '🍚', { size: 16 });
  s += note(150, 50, '進食後血糖升高\n→ 胰島素分泌增加，血糖下降', { size: 12, stroke: C.red });
  s += note(460, 305, '運動或空腹時血糖下降\n→ 升糖素、腎上腺素分泌增加，血糖上升', { size: 12, stroke: C.blue });
  s += A([[X(16), Y(78)], [X(16), 300]], { stroke: C.blue, sw: 1.2, dash: '3 3' });
  return svg(w, h + 50, s);
});

fig('u5-s5', '人體的泌尿系統', () => {
  const w = 840, h = 420;
  let s = '<g transform="translate(80 0)">';
  s += P('M330 30 L330 400', { stroke: '#d9534a', sw: 14 }) + P('M380 30 L380 400', { stroke: '#5f80c4', sw: 14 });
  for (const [x, d] of [[250, -1], [460, 1]]) {
    s += P(`M${x} 80 C${x - 60 * d} 70 ${x - 70 * d} 200 ${x} 190 C${x + 20 * d} 180 ${x + 10 * d} 150 ${x + 20 * d} 135 C${x + 10 * d} 120 ${x + 20 * d} 90 ${x} 80Z`, { fill: '#c0504d', stroke: '#8b2f2d', sw: 2 });
    s += P(`M${x + 20 * d} 120 L${330 + (d > 0 ? 50 : 0)} 120`, { stroke: d < 0 ? '#d9534a' : '#5f80c4', sw: 6 });
    s += P(`M${x + 20 * d} 145 L${d < 0 ? 380 : 330} 145`, { stroke: d < 0 ? '#5f80c4' : '#d9534a', sw: 6 });
    s += P(`M${x + 15 * d} 160 C${x + 30 * d} 230 ${355 - 30 * d} 280 ${355 - 15 * d} 320`, { stroke: '#e8c34c', sw: 6 });
  }
  s += P('M320 315 C300 315 300 370 355 375 C410 370 410 315 390 315Z', { fill: '#f2d784', stroke: '#b89a3a', sw: 2 });
  s += L(355, 375, 355, 410, { stroke: '#e8c34c', sw: 6 });
  s += callout(215, 130, 120, 100, '腎臟', { anchor: 'end', size: 15, weight: 700 }) + T(120, 132, '過濾血液中的尿素、\n多餘水分與鹽類，形成尿液', { anchor: 'end', size: 12, fill: C.muted });
  s += callout(270, 240, 120, 240, '輸尿管', { anchor: 'end', size: 15, weight: 700 }) + T(120, 262, '輸送尿液到膀胱', { anchor: 'end', size: 12, fill: C.muted });
  s += callout(320, 345, 120, 330, '膀胱', { anchor: 'end', size: 15, weight: 700 }) + T(120, 352, '暫時儲存尿液', { anchor: 'end', size: 12, fill: C.muted });
  s += callout(355, 400, 120, 395, '尿道', { anchor: 'end', size: 15, weight: 700 }) + T(120, 415, '排出尿液', { anchor: 'end', size: 12, fill: C.muted });
  s += callout(500, 120, 560, 100, '腎動脈（尿素多）', { anchor: 'start', weight: 700, color: C.red });
  s += callout(500, 145, 560, 150, '腎靜脈（尿素少）', { anchor: 'start', weight: 700, color: C.blue });
  s += T(560, 40, '主動脈　大靜脈', { size: 12, anchor: 'start', fill: C.muted }) + L(400, 40, 555, 40, { stroke: C.muted, sw: 1, dash: '3 3' });
  s += T(560, 230, '肝臟：把胺基酸分解產生的\n氨轉變成毒性較低的尿素', { size: 12, anchor: 'start', fill: C.muted });
  return svg(w, h + 10, s + '</g>');
});

fig('u5-s6', '體內水分的恆定', () => {
  const w = 780, h = 250;
  let s = '';
  const row = (y, a, b, c, d, col) => B(10, y, 140, 46, a, { fill: col, stroke: 'none', weight: 700 }) + A([[150, y + 23], [180, y + 23]]) + B(180, y, 140, 46, b, { fill: '#fff', stroke: C.line }) + A([[320, y + 23], [350, y + 23]]) + B(350, y, 100, 46, '腦', { fill: C.purpleS, stroke: C.purple, weight: 700 }) + c + d;
  s += row(30, '體內水分缺乏', '血液濃度變高', A([[450, 45], [490, 20], [520, 20]], { stroke: C.blue }) + T(525, 20, '產生口渴感 → 喝水', { anchor: 'start', size: 13 }), A([[450, 62], [520, 80]], { stroke: C.blue }) + T(525, 80, '激素作用於腎臟 → 尿量減少', { anchor: 'start', size: 13 }), C.blueS);
  s += row(160, '體內水分過多', '血液濃度變低', '', A([[450, 183], [520, 183]], { stroke: C.orange }) + T(525, 183, '不口渴、尿量增加', { anchor: 'start', size: 13 }), C.orangeS);
  s += T(390, 235, '流汗多時尿量少、喝水多時尿量多，維持體內水分平衡', { size: 13, fill: C.muted });
  return svg(w, h, s);
});

const chrom = (x, y, hgt, c, wd = 7) => R(x - wd / 2, y - hgt / 2, wd, hgt, { fill: c, stroke: 'none', r: wd / 2 });
fig('u6-s1', '果蠅的體細胞與卵細胞的染色體', () => {
  const w = 720, h = 330;
  let s = '';
  const pairs = [[60, '#e5a33c'], [55, '#7cbf5c'], [40, '#5aa0d8'], [14, '#7a5bb5']];
  s += O(200, 165, 120, { fill: '#fdf6e6', stroke: '#c9ad72', sw: 2 }) + T(200, 25, '體細胞（2n＝8）', { size: 16, weight: 700 });
  pairs.forEach(([hh, c], i) => { const y = 95 + i * 45; s += chrom(170, y + hh / 4, hh * .7, c) + chrom(200, y + hh / 4, hh * .7, c); });
  s += T(200, 310, '4 對同源染色體（成對存在，形狀大小相似）', { size: 13 });
  s += O(530, 165, 90, { fill: '#fdf6e6', stroke: '#c9ad72', sw: 2 }) + T(530, 25, '卵細胞（n＝4）', { size: 16, weight: 700 });
  pairs.forEach(([hh, c], i) => s += chrom(530, 100 + i * 42 + hh / 4, hh * .7, c));
  s += T(530, 310, '每對只有一條，染色體數目為體細胞的一半', { size: 13 });
  s += A([[340, 165], [430, 165]], { stroke: C.red, sw: 2.5 }) + T(385, 148, '減數分裂', { size: 13, fill: C.red });
  return svg(w, h, s);
});

fig('u6-s2', '細胞分裂與減數分裂的比較', () => {
  const w = 800, h = 380;
  let s = '';
  const cell = (x, y, r, chs) => O(x, y, r, { fill: '#fdf6e6', stroke: '#c9ad72', sw: 1.5 }) + chs.map(([dx, c, dbl]) => dbl ? chrom(x + dx - 3, y, 26, c, 5) + chrom(x + dx + 3, y, 26, c, 5) : chrom(x + dx, y, 26, c, 5)).join('');
  const P2 = [[-12, C.red], [12, C.blue]];
  s += T(20, 30, '細胞分裂（體細胞）', { size: 15, weight: 700, anchor: 'start', fill: C.teal });
  s += cell(90, 100, 34, [[-12, C.red], [-4, C.red], [4, C.blue], [12, C.blue]].map(([d, c]) => [d * 1.5, c]));
  s += A([[130, 100], [175, 100]]) + T(152, 82, '複製', { size: 12 });
  s += cell(220, 100, 34, [[-18, C.red, 1], [-6, C.red, 1], [6, C.blue, 1], [18, C.blue, 1]]);
  s += A([[260, 90], [310, 65]]) + A([[260, 110], [310, 135]]) + T(285, 100, '分裂 1 次', { size: 12, anchor: 'start' }).replace('x="285"', 'x="262"');
  for (const y of [60, 140]) s += cell(350, y, 30, [[-15, C.red], [-5, C.red], [5, C.blue], [15, C.blue]]);
  s += T(470, 100, '產生 2 個子細胞\n染色體數目與母細胞相同（2n → 2n）', { size: 13, anchor: 'start' });
  s += L(20, 185, 780, 185, { stroke: C.line, dash: '6 5' });
  s += T(20, 210, '減數分裂（生殖細胞）', { size: 15, weight: 700, anchor: 'start', fill: C.red });
  s += cell(90, 290, 34, [[-18, C.red], [-6, C.red], [6, C.blue], [18, C.blue]]);
  s += A([[130, 290], [175, 290]]) + T(152, 272, '複製', { size: 12 });
  s += cell(220, 290, 34, [[-18, C.red, 1], [-6, C.blue, 1], [6, C.red, 1], [18, C.blue, 1]]);
  s += A([[260, 280], [305, 250]]) + A([[260, 300], [305, 330]]) + T(282, 220, '第 1 次分裂\n同源染色體分離', { size: 11 });
  s += cell(340, 245, 28, [[-8, C.red, 1], [8, C.blue, 1]]) + cell(340, 335, 28, [[-8, C.red, 1], [8, C.blue, 1]]);
  s += A([[372, 240], [420, 225]]) + A([[372, 250], [420, 265]]) + A([[372, 330], [420, 315]]) + A([[372, 340], [420, 355]]);
  for (const y of [222, 268, 312, 358]) s += cell(445, y, 20, [[-5, C.red], [5, C.blue]]);
  s += T(395, 205, '第 2 次分裂', { size: 11 });
  s += T(490, 290, '產生 4 個子細胞（精子或卵）\n染色體數目減半（2n → n）', { size: 13, anchor: 'start' });
  return svg(w, h, s);
});

fig('u6-s3', '植物組織培養（無性生殖）的過程', () => {
  const w = 800, h = 230;
  let s = '';
  const steps = ['取植物組織\n消毒後切成小塊', '放入含養分與\n植物激素的培養基', '細胞分裂\n形成細胞團', '細胞團長出\n根、莖、葉', '移植到盆中\n長成新植株'];
  const flask = (x, inner) => P(`M${x - 12} 60 L${x - 12} 95 L${x - 40} 150 L${x + 40} 150 L${x + 12} 95 L${x + 12} 60`, { fill: '#eef7fb', stroke: '#6e93ad', sw: 2 }) + P(`M${x - 33} 135 L${x + 33} 135 L${x + 40} 150 L${x - 40} 150Z`, { fill: '#f7e7a8', stroke: 'none' }) + inner;
  steps.forEach((t, i) => {
    const x = 80 + i * 160;
    if (i === 0) s += P(`M${x} 150 L${x} 90`, { stroke: C.green, sw: 4 }) + E(x - 18, 100, 16, 7, { fill: '#8cc56b', stroke: C.green }) + E(x + 18, 85, 16, 7, { fill: '#8cc56b', stroke: C.green }) + O(x, 70, 9, { fill: '#e98fd0', stroke: '#b05a9e' }) + R(x - 30, 150, 60, 10, { fill: '#b98a5a', stroke: 'none', r: 2 });
    else if (i === 1) s += flask(x, R(x - 6, 126, 12, 9, { fill: '#8cc56b', stroke: C.green, r: 2 }));
    else if (i === 2) s += flask(x, O(x, 125, 12, { fill: '#cfe3a0', stroke: C.green }));
    else if (i === 3) s += flask(x, O(x, 125, 10, { fill: '#cfe3a0', stroke: C.green }) + P(`M${x} 118 L${x} 100 M${x} 108 L${x - 10} 100 M${x} 104 L${x + 10} 96 M${x} 133 L${x - 6} 140 M${x} 133 L${x + 6} 140`, { stroke: C.green, sw: 2 }));
    else s += P(`M${x - 30} 120 L${x + 30} 120 L${x + 22} 160 L${x - 22} 160Z`, { fill: '#c97a4a', stroke: '#8b4a2a' }) + P(`M${x} 120 L${x} 80`, { stroke: C.green, sw: 3 }) + E(x - 14, 92, 13, 6, { fill: '#8cc56b', stroke: C.green }) + E(x + 14, 84, 13, 6, { fill: '#8cc56b', stroke: C.green }) + O(x, 72, 8, { fill: '#e98fd0', stroke: '#b05a9e' });
    s += T(x, 195, t, { size: 12 });
    if (i < 4) s += A([[x + 52, 115], [x + 105, 115]], { stroke: C.orange, sw: 2.5 });
  });
  s += T(400, 25, '新植株的遺傳性狀與原植株相同，可快速大量繁殖', { size: 13, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

fig('u6-s4', '雞蛋的構造', () => {
  const w = 680, h = 320;
  let s = E(300, 160, 200, 125, { fill: '#fbf3e3', stroke: '#c9a978', sw: 4 });
  s += E(300, 160, 192, 117, { fill: '#f4f8f3', stroke: '#e0d5c0', sw: 1.5 });
  s += P('M484 125 C470 140 470 180 484 195 C496 180 496 140 484 125Z', { fill: '#fff', stroke: '#c9a978', sw: 1.5 });
  s += O(300, 160, 70, { fill: '#f6c445', stroke: '#d9a21b', sw: 2 }) + O(300, 112, 8, { fill: '#fff8e0', stroke: '#e5c46a' });
  s += P('M230 160 C210 150 190 172 160 160 C140 152 130 168 120 160', { stroke: '#e0d5c0', sw: 4 }) + P('M370 160 C390 150 410 172 440 160', { stroke: '#e0d5c0', sw: 4 });
  s += callout(300, 112, 330, 30, '胚盤（小白點，含細胞核）', { anchor: 'start', weight: 700, color: C.orange });
  s += callout(300, 190, 300, 300, '卵黃：提供胚胎發育的養分', { anchor: 'middle', weight: 700 });
  s += callout(160, 160, 60, 40, '繫帶：固定卵黃', { anchor: 'start', weight: 700 });
  s += callout(420, 230, 520, 290, '卵白：提供水分與養分', { anchor: 'start', weight: 700 });
  s += callout(484, 160, 560, 150, '氣室', { anchor: 'start', weight: 700 });
  s += callout(140, 245, 30, 290, '卵殼與卵殼膜：保護', { anchor: 'start', weight: 700 });
  s += T(560, 172, '提供氧氣', { size: 12, anchor: 'start', fill: C.muted });
  return svg(w, h, s);
});

fig('u6-s5', '人類的受精與著床', () => {
  const w = 760, h = 340;
  let s = '';
  s += P('M380 300 L380 250 C320 240 300 170 330 130 L430 130 C460 170 440 240 380 250', { fill: '#f6c0c4', stroke: '#c75a6a', sw: 3 });
  s += P('M330 135 C280 110 220 90 170 110 M430 135 C480 110 540 90 590 110', { stroke: '#e98fa0', sw: 12 });
  s += E(150, 150, 30, 20, { fill: '#f2a9b4', stroke: '#c75a6a', sw: 2 }) + E(610, 150, 30, 20, { fill: '#f2a9b4', stroke: '#c75a6a', sw: 2 });
  s += O(140, 150, 5, { fill: '#fff', stroke: '#c75a6a' }) + A([[160, 132], [185, 108]], { stroke: C.orange, sw: 1.5 });
  s += O(240, 95, 6, { fill: '#fff', stroke: C.red, sw: 2 }) + O(295, 108, 7, { fill: '#fde68a', stroke: C.orange, sw: 2 }) + O(340, 170, 9, { fill: '#fde68a', stroke: C.orange, sw: 2 });
  s += AQ(245, 90, 275, 80, 290, 102, { stroke: C.muted, sw: 1.5 }) + AQ(300, 116, 320, 135, 336, 162, { stroke: C.muted, sw: 1.5 });
  s += callout(150, 150, 80, 230, '卵巢：產生卵', { anchor: 'middle', weight: 700 });
  s += callout(240, 95, 210, 40, '受精（在輸卵管）', { anchor: 'middle', weight: 700, color: C.red });
  s += callout(500, 110, 560, 50, '輸卵管', { anchor: 'start', weight: 700 });
  s += callout(340, 170, 210, 300, '著床：受精卵發育成胚\n附著在子宮內壁', { anchor: 'middle', weight: 700, color: C.orange });
  s += callout(420, 220, 560, 260, '子宮：胚胎發育的場所', { anchor: 'start', weight: 700 });
  return svg(w, h, s);
});

fig('u6-s6', '開花植物的有性生殖', () => {
  const w = 800, h = 270;
  let s = '';
  const stp = (x, t) => T(x, 245, t, { size: 12 });
  // 花
  let x = 80;
  s += P(`M${x} 200 L${x} 110`, { stroke: C.green, sw: 4 });
  for (const a of [-60, -20, 20, 60]) s += E(x + Math.sin(a * Math.PI / 180) * 30, 95 - Math.cos(a * Math.PI / 180) * 10, 18, 28, { fill: '#f6b6cf', stroke: '#c96a90', sw: 1.5 }).replace('/>', ` transform="rotate(${a} ${x + Math.sin(a * Math.PI / 180) * 30} ${95 - Math.cos(a * Math.PI / 180) * 10})"/>`);
  s += P(`M${x - 8} 115 C${x - 12} 80 ${x + 12} 80 ${x + 8} 115Z`, { fill: '#a7d58a', stroke: C.green }) + L(x + 20, 115, x + 26, 70, { stroke: '#e8b23c', sw: 2 }) + O(x + 26, 68, 4, { fill: '#e8b23c', stroke: 'none' });
  s += stp(x, '花：雄蕊產生花粉\n雌蕊的子房內有胚珠');
  s += A([[135, 120], [185, 120]], { stroke: C.orange, sw: 2.5 }) + T(160, 105, '授粉', { size: 12, fill: C.orange });
  x = 270;
  s += P(`M${x - 25} 200 C${x - 30} 160 ${x - 10} 150 ${x - 6} 110 L${x - 6} 60 L${x + 6} 60 L${x + 6} 110 C${x + 10} 150 ${x + 30} 160 ${x + 25} 200Z`, { fill: '#cfe8b4', stroke: C.green, sw: 1.5 });
  s += O(x, 55, 3, { fill: '#e8b23c', stroke: 'none' }) + P(`M${x} 58 C${x + 2} 100 ${x - 4} 140 ${x} 168`, { stroke: '#e8b23c', sw: 1.5 }) + E(x, 175, 9, 12, { fill: '#fde6ad', stroke: C.orange });
  s += stp(x, '花粉在柱頭萌發\n長出花粉管到胚珠');
  s += A([[315, 120], [365, 120]], { stroke: C.orange, sw: 2.5 }) + T(340, 105, '受精', { size: 12, fill: C.orange });
  x = 440;
  s += E(x, 140, 40, 50, { fill: '#f19a6b', stroke: '#c0603c', sw: 2 }) + E(x, 145, 10, 14, { fill: '#8b5a2b', stroke: 'none' });
  s += stp(x, '子房發育成果實\n胚珠發育成種子');
  s += A([[495, 120], [545, 120]], { stroke: C.orange, sw: 2.5 }) + T(520, 105, '萌發', { size: 12, fill: C.orange });
  x = 620;
  s += R(x - 40, 180, 80, 20, { fill: '#b98a5a', stroke: 'none', r: 3 }) + P(`M${x} 180 L${x} 110`, { stroke: C.green, sw: 3 }) + E(x - 14, 110, 14, 6, { fill: '#8cc56b', stroke: C.green }) + E(x + 14, 104, 14, 6, { fill: '#8cc56b', stroke: C.green });
  s += P(`M${x} 182 L${x - 8} 198 M${x} 182 L${x + 6} 200`, { stroke: '#8b5a2b', sw: 1.5 });
  s += stp(x, '種子內的胚\n發育成幼苗');
  s += T(720, 90, '受精卵\n→ 胚', { size: 12, fill: C.muted });
  return svg(w, h, s);
});

fig('u7-s1', '孟德爾豌豆莖高度的遺傳（T：高莖，t：矮莖）', () => {
  const w = 740, h = 400;
  let s = '';
  const g = (x, y, a, c) => O(x, y, 15, { fill: c === 'T' ? '#cfe8f2' : '#fbd9e3', stroke: c === 'T' ? C.teal : C.pink, sw: 1.5 }) + T(x, y, a, { size: 14, weight: 700 });
  const pair = (x, y, a) => g(x - 16, y, a[0], a[0]) + g(x + 16, y, a[1], a[1]);
  s += T(60, 60, '親代', { size: 14, weight: 700 }) + T(260, 30, '純品系高莖', { size: 13 }) + T(460, 30, '純品系矮莖', { size: 13 });
  s += pair(260, 60, 'TT') + T(360, 60, '×', { size: 22 }) + pair(460, 60, 'tt');
  s += T(60, 120, '配子', { size: 14, weight: 700 }) + g(260, 120, 'T', 'T') + g(460, 120, 't', 't') + L(260, 78, 260, 104, { stroke: C.muted }) + L(460, 78, 460, 104, { stroke: C.muted });
  s += T(60, 185, '第一代', { size: 14, weight: 700 }) + pair(360, 185, 'Tt') + L(272, 132, 345, 170, { stroke: C.muted }) + L(448, 132, 375, 170, { stroke: C.muted });
  s += T(470, 185, '全部高莖（T 為顯性）', { size: 13, anchor: 'start', fill: C.teal });
  s += T(360, 220, '自花授粉', { size: 12, fill: C.orange });
  s += T(60, 260, '第二代', { size: 14, weight: 700 });
  const G2 = [['TT', '高莖'], ['Tt', '高莖'], ['Tt', '高莖'], ['tt', '矮莖']];
  G2.forEach(([a, b], i) => { const x = 210 + i * 100; s += pair(x, 260, a) + T(x, 290, b, { size: 13 }); });
  s += P('M360 200 L360 235 M210 235 L510 235', { stroke: C.muted, sw: 1 });
  s += R(150, 315, 420, 64, { fill: C.tealS, stroke: 'none', r: 10 }) + T(360, 347, '基因型 TT：Tt：tt＝1：2：1\n表現型 高莖：矮莖＝3：1', { size: 14, weight: 700 });
  return svg(w, h, s);
});

fig('u7-s2', '同源染色體上的等位基因', () => {
  const w = 680, h = 300;
  let s = '';
  const cr = (x, c, genes) => R(x - 12, 40, 24, 200, { fill: c, stroke: 'none', r: 12 }) + genes.map(([y, l, col]) => R(x - 12, y - 8, 24, 16, { fill: col, stroke: 'none', r: 0 }) + T(x + (x < 200 ? -26 : 26), y, l, { size: 15, weight: 700, anchor: x < 200 ? 'end' : 'start' })).join('');
  s += cr(150, '#f4b6c2', [[80, 'A', '#c0303f'], [150, 'B', '#3b6fb6'], [200, 'd', '#e8b23c']]);
  s += cr(210, '#a9c8ef', [[80, 'a', '#c0303f'], [150, 'B', '#3b6fb6'], [200, 'D', '#e8b23c']]);
  s += T(180, 270, '一對同源染色體（一條來自父方、一條來自母方）', { size: 13 });
  s += T(320, 70, 'A 與 a：位在同源染色體相同位置，控制同一性狀\n→ 稱為一對等位基因', { size: 13, anchor: 'start' });
  s += T(320, 140, '基因位在染色體上，染色體由 DNA 與蛋白質組成', { size: 13, anchor: 'start' });
  s += T(320, 200, '大寫：顯性基因　小寫：隱性基因\nAa：只表現顯性性狀', { size: 13, anchor: 'start' });
  return svg(w, h, s);
});

fig('u7-s4', '人類性別的遺傳', () => {
  const w = 740, h = 365;
  let s = '';
  const bb = (x, y, t, c) => B(x, y, 110, 40, t, { fill: c, stroke: 'none', weight: 700, size: 15 });
  s += T(70, 60, '父親', { size: 15, weight: 700, fill: C.blue }) + bb(110, 40, '44＋XY', C.blueS);
  s += T(70, 250, '母親', { size: 15, weight: 700, fill: C.red }) + bb(110, 230, '44＋XX', C.redS);
  s += A([[222, 60], [270, 35]]) + A([[222, 60], [270, 95]]) + A([[222, 250], [270, 225]]) + A([[222, 250], [270, 285]]);
  s += bb(275, 15, '22＋X', '#eef3fb') + bb(275, 75, '22＋Y', '#eef3fb') + bb(275, 205, '22＋X', '#fbeef0') + bb(275, 265, '22＋X', '#fbeef0');
  s += T(330, 135, '精子（2 種）', { size: 12, fill: C.muted }) + T(330, 325, '卵（1 種）', { size: 12, fill: C.muted });
  const kids = [['44＋XX', '女', C.redS], ['44＋XX', '女', C.redS], ['44＋XY', '男', C.blueS], ['44＋XY', '男', C.blueS]];
  kids.forEach(([a, b, c], i) => { const y = 30 + i * 70; s += bb(560, y, a, c) + T(690, y + 20, b, { size: 16, weight: 700, fill: b === '女' ? C.red : C.blue }); });
  for (const [sy, ty] of [[35, 50], [35, 120], [95, 190], [95, 260], [225, 50], [285, 120], [225, 190], [285, 260]]) s += L(385, sy, 558, ty, { stroke: C.muted, sw: 1 });
  s += T(470, 350, '生男生女機率各 1/2，由精子帶 X 或 Y 決定', { size: 13, weight: 700, fill: C.teal });
  return svg(w, h, s);
});

fig('u7-s7', '複製羊桃莉的產生過程', () => {
  const w = 800, h = 280;
  let s = '';
  const sheep = (x, y, c = '#fff') => E(x, y, 34, 22, { fill: c, stroke: C.ink, sw: 1.5 }) + E(x + 34, y - 10, 12, 9, { fill: '#555', stroke: 'none' }) + L(x - 18, y + 18, x - 18, y + 36, { sw: 3 }) + L(x + 18, y + 18, x + 18, y + 36, { sw: 3 });
  s += sheep(70, 60) + T(70, 20, '甲羊', { size: 14, weight: 700 }) + T(70, 115, '提供乳腺細胞\n（取細胞核）', { size: 12 });
  s += sheep(70, 200, '#eee') + T(70, 160, '乙羊', { size: 14, weight: 700 }) + T(70, 255, '提供卵細胞\n（去除細胞核）', { size: 12 });
  s += A([[125, 65], [215, 115]]) + A([[125, 195], [215, 150]]);
  s += O(250, 135, 26, { fill: '#fde6ad', stroke: C.orange, sw: 2 }) + O(250, 135, 9, { fill: C.red, stroke: 'none' });
  s += T(250, 185, '細胞融合\n（電擊）', { size: 12 });
  s += A([[285, 135], [345, 135]]);
  for (const [dx, dy] of [[-8, -8], [8, -8], [-8, 8], [8, 8], [0, 0]]) s += O(380 + dx, 135 + dy, 9, { fill: '#fde6ad', stroke: C.orange });
  s += T(380, 185, '分裂成胚', { size: 12 });
  s += A([[410, 135], [470, 135]]);
  s += sheep(520, 135, '#ddd') + T(520, 95, '丙羊', { size: 14, weight: 700 }) + T(520, 195, '植入代理孕母子宮', { size: 12 });
  s += A([[575, 135], [635, 135]]);
  s += sheep(690, 135) + T(690, 95, '桃莉羊', { size: 14, weight: 700, fill: C.red }) + T(690, 200, '外表與甲羊相同', { size: 12 });
  s += T(400, 260, '桃莉的遺傳物質主要來自甲羊的細胞核，屬於無性生殖', { size: 13, weight: 700, fill: C.teal });
  return svg(w, h, s);
});

fig('u8-s1', '馬的演化：由化石推論的變化趨勢（示意）', () => {
  const w = 800, h = 300;
  let s = '';
  const horses = [['始新馬', 16, 4], ['漸新馬', 21, 3], ['中新馬', 27, 3], ['上新馬', 33, 1], ['現代馬', 40, 1]];
  horses.forEach(([n, sz, toes], i) => {
    const x = 80 + i * 160, base = 200;
    s += E(x, base - sz * 1.4, sz * 1.1, sz * .55, { fill: '#c99a6b', stroke: '#8a5a2b', sw: 1.5 });
    s += P(`M${x + sz} ${base - sz * 1.6} L${x + sz * 1.4} ${base - sz * 2.4} L${x + sz * 1.9} ${base - sz * 2.2}`, { stroke: '#8a5a2b', sw: sz * .3 });
    for (const dx of [-.7, -.4, .5, .8]) s += L(x + dx * sz, base - sz * 1.1, x + dx * sz, base, { stroke: '#8a5a2b', sw: Math.max(2, sz * .14) });
    s += T(x, 225, n, { size: 14, weight: 700 });
    // 腳趾
    for (let t = 0; t < toes; t++) s += R(x - toes * 6 + t * 12, 250, 8, 22, { fill: '#e8d9c4', stroke: C.brown, sw: 1, r: 3 });
    s += T(x, 285, `前腳 ${toes} 趾`, { size: 12, fill: C.muted });
  });
  s += A([[40, 30], [760, 30]], { stroke: C.teal, sw: 2 }) + T(400, 18, '年代：古 → 今', { size: 13, fill: C.teal });
  s += T(400, 55, '體型變大、腳趾數目減少、臼齒變得較大較複雜', { size: 14, weight: 700 });
  return svg(w, h, s);
});

fig('u8-s2', '生物的五界分類', () => {
  const w = 780, h = 380;
  let s = '';
  s += R(40, 300, 700, 60, { fill: '#fbe3ec', stroke: C.pink, r: 14 }) + T(390, 318, '原核生物界', { size: 16, weight: 700 }) + T(390, 342, '細菌、藍綠菌（無核膜、無細胞核）', { size: 13 });
  s += R(120, 220, 540, 60, { fill: '#e7e2f6', stroke: C.purple, r: 14 }) + T(390, 238, '原生生物界', { size: 16, weight: 700 }) + T(390, 262, '藻類（如矽藻）、原生動物（如草履蟲、變形蟲）、原生菌類', { size: 13 });
  const k = [[150, '植物界', '#dcefd2', C.green, '苔蘚、蕨類\n裸子植物、被子植物\n多細胞、能行光合作用'], [390, '真菌界', '#e3eef8', C.blue, '黴菌、蕈類、酵母菌\n細胞有細胞壁\n不能行光合作用'], [630, '動物界', '#fbe9d3', C.orange, '無脊椎動物\n脊椎動物\n多細胞、須攝食']];
  for (const [x, n, f, c, d] of k) s += R(x - 110, 30, 220, 170, { fill: f, stroke: c, r: 14 }) + T(x, 58, n, { size: 17, weight: 700, fill: c }) + T(x, 130, d, { size: 13 });
  s += L(40, 290, 740, 290, { stroke: C.ink, sw: 1, dash: '5 4' });
  s += T(760, 210, '真核\n生物', { size: 12, anchor: 'end', fill: C.purple }).replace('x="760"', 'x="776"');
  s += T(776, 330, '原核\n生物', { size: 12, anchor: 'end', fill: C.red });
  return svg(w, h, s);
});

fig('u8-s5', '單子葉植物與雙子葉植物的比較', () => {
  const w = 780, h = 290;
  let s = '';
  const cols = ['', '子葉', '莖的維管束', '葉脈', '根', '花瓣數目'];
  const rows = [['單子葉', '1 枚', '散生', '平行脈', '鬚根', '3 或 3 的倍數'], ['雙子葉', '2 枚', '環狀排列', '網狀脈', '軸根（主根＋側根）', '4、5 或其倍數']];
  const xs = [20, 120, 220, 350, 470, 620], ws = [100, 100, 130, 120, 150, 140];
  cols.forEach((c, j) => s += R(xs[j], 20, ws[j], 40, { fill: C.soft, stroke: C.line, sw: 1, r: 0 }) + T(xs[j] + ws[j] / 2, 40, c, { size: 14, weight: 700 }));
  rows.forEach((r, i) => r.forEach((c, j) => { const y = 60 + i * 110;
    s += R(xs[j], y, ws[j], 110, { fill: j === 0 ? (i ? C.orangeS : C.greenS) : '#fff', stroke: C.line, sw: 1, r: 0 }) + T(xs[j] + ws[j] / 2, y + 88, c, { size: 13, weight: j === 0 ? 700 : 400 }); }));
  // 小圖示
  const y1 = 105, y2 = 215;
  s += E(170, y1, 14, 22, { fill: '#f6d78a', stroke: C.brown }) + E(160, y2, 12, 20, { fill: '#f6d78a', stroke: C.brown }) + E(182, y2, 12, 20, { fill: '#f6d78a', stroke: C.brown });
  s += O(285, y1, 24, { fill: '#eef6dc', stroke: C.green }) + [[275, 95], [295, 98], [285, 112], [272, 115], [298, 116]].map(([x, y]) => O(x, y, 3.5, { fill: C.orange, stroke: 'none' })).join('');
  s += O(285, y2, 24, { fill: '#eef6dc', stroke: C.green }) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => O(285 + 16 * Math.cos(i * Math.PI / 4), y2 + 16 * Math.sin(i * Math.PI / 4), 3, { fill: C.orange, stroke: 'none' })).join('');
  s += E(410, y1, 12, 32, { fill: '#a7d58a', stroke: C.green }) + [-6, 0, 6].map(d => L(410 + d, y1 - 28, 410 + d, y1 + 28, { stroke: C.green, sw: 1 })).join('');
  s += E(410, y2, 22, 30, { fill: '#a7d58a', stroke: C.green }) + P(`M410 ${y2 - 28} L410 ${y2 + 28} M410 ${y2 - 10} L396 ${y2 - 20} M410 ${y2 - 10} L424 ${y2 - 20} M410 ${y2 + 6} L394 ${y2 - 4} M410 ${y2 + 6} L426 ${y2 - 4}`, { stroke: C.green, sw: 1 });
  s += [-14, -7, 0, 7, 14].map(d => P(`M545 ${y1 - 25} C${545 + d} ${y1} ${545 + d * 1.4} ${y1 + 10} ${545 + d * 1.6} ${y1 + 25}`, { stroke: C.brown, sw: 1.5 })).join('');
  s += P(`M545 ${y2 - 25} L545 ${y2 + 28} M545 ${y2 - 8} L528 ${y2 + 4} M545 ${y2 - 8} L562 ${y2 + 4} M545 ${y2 + 8} L530 ${y2 + 20} M545 ${y2 + 8} L560 ${y2 + 20}`, { stroke: C.brown, sw: 2 });
  for (const [cy, n] of [[y1, 3], [y2, 5]]) for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n - Math.PI / 2; s += E(690 + 14 * Math.cos(a), cy + 14 * Math.sin(a), 9, 14, { fill: '#f6b6cf', stroke: '#c96a90', sw: 1 }).replace('/>', ` transform="rotate(${a * 180 / Math.PI + 90} ${690 + 14 * Math.cos(a)} ${cy + 14 * Math.sin(a)})"/>`); }
  s += T(70, 115, '例：稻、麥、\n玉米、百合', { size: 11, fill: C.muted }).replace('y="115"', 'y="100"');
  s += T(70, 210, '例：菊、玫瑰、\n榕樹、向日葵', { size: 11, fill: C.muted });
  return svg(w, h, s);
});

fig('u9-s1', '生物圈的範圍：海平面上下各約 10 公里', () => {
  const w = 800, h = 320;
  let s = R(0, 0, 340, 150, { fill: '#e4f1fb', stroke: 'none', r: 0 }) + R(0, 150, 340, 170, { fill: '#7fb3dd', stroke: 'none', r: 0 });
  s += P('M0 150 L40 150 L100 50 L150 100 L190 150 L230 150 L250 300 L280 150 L340 150 L340 320 L0 320Z', { fill: '#b98f62', stroke: 'none' });
  s += P('M230 150 L250 300 L280 150Z', { fill: '#356a9a', stroke: 'none' });
  s += L(0, 150, 340, 150, { stroke: C.blue, sw: 2 }) + T(20, 140, '海平面', { size: 12, anchor: 'start', fill: C.blue, halo: true });
  s += A([[360, 150], [360, 20]], { stroke: C.ink, sw: 1.5, both: true }) + A([[360, 150], [360, 300]], { stroke: C.ink, sw: 1.5, both: true });
  s += T(375, 85, '約 10 公里', { size: 12, anchor: 'start' }) + T(375, 225, '約 10 公里（海溝）', { size: 12, anchor: 'start' });
  const row = (y, dot, c, t) => O(490, y, 11, { fill: c, stroke: 'none' }) + T(490, y, dot, { size: 11, fill: '#fff', weight: 700 }) + T(508, y, t, { anchor: 'start', size: 13 });
  s += row(40, '少', '#9aa3ac', '高空：空氣稀薄、溫度低、紫外線強');
  s += row(110, '多', C.green, '近地面：適合大部分生物生存');
  s += row(190, '多', C.green, '海面下 200 公尺內：光線充足，生物多');
  s += row(270, '少', '#9aa3ac', '深海：缺乏光線、水壓大，沒有綠色植物');
  return svg(w, h, s);
});

fig('u9-s2', '族群大小的變化與環境負荷量', () => {
  const w = 780, h = 300;
  let s = A([[60, 240], [60, 30]], { sw: 1.5 }) + A([[60, 240], [750, 240]], { sw: 1.5 }) + T(36, 135, '族群大小', { size: 12, rotate: -90 }) + T(745, 258, '時間', { size: 12, anchor: 'end' });
  s += L(60, 90, 700, 90, { stroke: C.red, dash: '6 5', sw: 1.5 }) + T(705, 82, '環境負荷量', { size: 12, anchor: 'start', fill: C.red }).replace('x="705"', 'x="560"');
  s += P('M62 230 C180 225 210 70 290 60 C360 52 380 115 450 118 C500 120 510 85 540 92 C560 98 570 82 590 90 C610 98 620 84 640 90 C660 96 670 86 700 90', { stroke: C.green, sw: 3 });
  s += L(290, 40, 290, 240, { stroke: C.line }) + L(450, 40, 450, 240, { stroke: C.line });
  s += B(110, 250, 160, 40, '族群變大\n出生＋遷入 ＞ 死亡＋遷出', { fill: C.greenS, stroke: 'none', size: 11 });
  s += B(295, 250, 150, 40, '族群變小\n出生＋遷入 ＜ 死亡＋遷出', { fill: C.redS, stroke: 'none', size: 11 });
  s += B(470, 250, 230, 40, '族群達到平衡（在負荷量附近波動）\n出生＋遷入 ≒ 死亡＋遷出', { fill: C.blueS, stroke: 'none', size: 11 });
  return svg(w, h, s);
});

fig('u9-s4', '生態系中的碳循環', () => {
  const w = 760, h = 400;
  let s = '';
  s += B(230, 20, 300, 46, '大氣中的二氧化碳', { fill: '#fde6b8', stroke: C.orange, weight: 700, size: 16 });
  s += B(80, 150, 180, 90, '生產者\n光合作用合成\n葡萄糖等有機物', { fill: C.greenS, stroke: C.green, size: 13 });
  s += B(500, 150, 180, 90, '消費者\n攝食並分解、\n合成養分', { fill: C.redS, stroke: C.red, size: 13 });
  s += B(80, 320, 180, 60, '化石燃料\n（煤、石油、天然氣）', { fill: C.blueS, stroke: C.blue, size: 13 });
  s += B(500, 320, 180, 60, '分解者\n（細菌、真菌）', { fill: C.blueS, stroke: C.blue, size: 13 });
  s += B(280, 255, 200, 36, '遺體、排遺物', { fill: '#fff', stroke: C.line, size: 13 });
  s += A([[260, 66], [170, 148]], { stroke: C.green, sw: 2.5 }) + T(185, 95, '① 光合作用', { size: 13, anchor: 'end', fill: C.green, weight: 700 });
  s += A([[262, 195], [498, 195]], { stroke: C.red, sw: 2.5 }) + T(380, 182, '② 攝食', { size: 13, fill: C.red, weight: 700 });
  s += A([[590, 148], [500, 68]], { stroke: C.orange, sw: 2.5 }) + A([[200, 148], [300, 68]], { stroke: C.orange, sw: 2.5 }) + T(555, 95, '③ 呼吸作用', { size: 13, anchor: 'start', fill: C.orange, weight: 700 });
  s += A([[170, 242], [300, 270]], { stroke: C.muted, sw: 1.8, dash: '5 4' }) + A([[590, 242], [460, 270]], { stroke: C.muted, sw: 1.8, dash: '5 4' }) + A([[460, 292], [540, 318]], { stroke: C.muted, sw: 1.8, dash: '5 4' });
  s += A([[690, 340], [730, 340], [730, 43], [532, 43]], { stroke: C.blue, sw: 2.5 }) + T(745, 200, '④ 分解作用', { size: 13, fill: C.blue, weight: 700, rotate: 90 });
  s += A([[78, 350], [30, 350], [30, 43], [228, 43]], { stroke: C.purple, sw: 2.5 }) + T(15, 200, '⑤ 燃燒作用', { size: 13, fill: C.purple, weight: 700, rotate: -90 });
  s += L(170, 242, 170, 318, { stroke: C.muted, sw: 1.5, dash: '5 4' });
  return svg(w, h, s);
});

fig('u9-s5', '海洋生態系的分區', () => {
  const w = 780, h = 330;
  let s = R(0, 0, 780, 60, { fill: '#eaf4fb', stroke: 'none', r: 0 });
  s += P('M0 60 L780 60 L780 330 L0 330Z', { fill: '#2f6fa8', stroke: 'none' });
  s += P('M0 60 L780 60 L780 140 L0 140Z', { fill: '#6fb0dd', stroke: 'none' });
  s += P('M0 40 L90 50 L130 60 L170 72 L330 95 L380 120 L430 230 L480 320 L780 320 L780 330 L0 330Z', { fill: '#b98f62', stroke: 'none' });
  s += P('M90 50 L130 60', { stroke: '#e9d29a', sw: 6 });
  s += L(0, 140, 780, 140, { stroke: '#fff', sw: 1.5, dash: '6 5' }) + T(770, 125, '透光區（約 200 公尺內）', { size: 13, anchor: 'end', fill: '#fff', weight: 700 }) + T(770, 160, '無光區', { size: 13, anchor: 'end', fill: '#fff', weight: 700 });
  s += P('M90 20 L90 30 M170 20 L170 30 M380 20 L380 30', { stroke: C.ink, sw: 1.5 }) + A([[95, 25], [165, 25]], { both: true, sw: 1.2 }) + A([[175, 25], [375, 25]], { both: true, sw: 1.2 }) + A([[385, 25], [775, 25]], { both: true, sw: 1.2 });
  s += T(130, 12, '潮間帶', { size: 13, weight: 700 }) + T(275, 12, '淺海區（大陸棚）', { size: 13, weight: 700 }) + T(580, 12, '大洋區', { size: 13, weight: 700 });
  s += T(250, 112, '大陸棚', { size: 14, fill: C.brown, weight: 700, halo: true }) + T(620, 250, '深海', { size: 16, fill: '#fff', weight: 700 });
  s += T(130, 300, '潮間帶：漲潮淹沒、退潮露出\n生物需適應乾溼與溫度變化', { size: 12, fill: C.ink });
  s += T(275, 48, '陽光充足、養分多，生物種類最多', { size: 11, fill: C.green });
  return svg(w, h, s);
});

fig('u9-s6', '生物放大作用：難分解的汙染物沿食物鏈累積', () => {
  const w = 780, h = 290;
  let s = '';
  const st = [['水', '1 ppm', 2], ['藻類', '5 ppm', 6], ['小魚', '10 ppm', 10], ['大魚', '20 ppm', 16], ['人類', '40 ppm', 26]];
  st.forEach(([n, v, k], i) => {
    const x = 75 + i * 155;
    s += T(x, 30, n, { size: 16, weight: 700 });
    if (i === 0) for (let j = 0; j < 5; j++) s += P(`M${x - 20 + j * 10} ${90 + (j % 2) * 30} q4 -10 8 0 q-4 10 -8 0`, { fill: '#7fb3e3', stroke: 'none' });
    else if (i === 1) for (let j = 0; j < 4; j++) s += O(x - 15 + (j % 2) * 30, 90 + Math.floor(j / 2) * 40, 12, { fill: '#9ed38a', stroke: C.green });
    else if (i < 4) s += E(x, 120, 22 + i * 8, 13 + i * 4, { fill: '#9ec3e6', stroke: '#3b6fb6' }) + P(`M${x - 22 - i * 8} 120 l-16 -12 l0 24Z`, { fill: '#9ec3e6', stroke: '#3b6fb6' }) + O(x + 12 + i * 4, 116, 2.5, { fill: C.ink, stroke: 'none' });
    else s += O(x, 70, 14, { fill: '#fbe9dd', stroke: '#c98a73' }) + R(x - 18, 86, 36, 70, { fill: '#fbe9dd', stroke: '#c98a73', r: 10 });
    for (let j = 0; j < Math.min(k, 26); j++) s += O(x - 22 + (j % 6) * 9, 190 + Math.floor(j / 6) * 9, 3, { fill: C.red, stroke: 'none' });
    s += B(x - 45, 245, 90, 32, v, { fill: C.yellowS, stroke: 'none', weight: 700 });
    if (i < 4) s += A([[x + 55, 120], [x + 86, 120]], { stroke: C.purple, sw: 2.5 });
  });
  s += T(390, 170, '營養階層愈高，體內汙染物（如 DDT、重金屬）濃度愈高', { size: 13, fill: C.red, weight: 700 }).replace('y="170"', 'y="168"');
  return svg(w, h, s);
});

export default F;
