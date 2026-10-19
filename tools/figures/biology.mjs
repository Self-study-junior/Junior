// 生物附圖（自行繪製的示意圖）
import { C, svg, T, TV, R, O, E, P, L, G, A, AQ, B, callout, smooth, legend } from './lib.mjs';

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

export default F;
