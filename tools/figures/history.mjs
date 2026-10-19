// 歷史附圖（自行繪製的示意地圖與圖表；底圖為 Natural Earth 公開資料）
import { C, svg, T, TV, R, O, E, P, L, G, A, AQ, B, callout, smooth, legend, note, geomap } from './lib.mjs';

const F = {};
const fig = (k, cap, fn) => { F[k] = { cap, svg: fn }; };
const done = (m, s) => svg(m.w, m.h, s + m.frame());
const badge = (x, y, t, c = C.ink) => R(x, y, [...t].length * 15 + 16, 26, { fill: c, stroke: 'none', r: 6 }) + T(x + ([...t].length * 15 + 16) / 2, y + 13, t, { size: 14, weight: 700, fill: '#fff' });

// 臺灣常用地點
const TW = {
  臺北: [121.52, 25.04], 基隆: [121.74, 25.13], 淡水: [121.44, 25.17], 桃園: [121.3, 24.99], 新竹: [120.97, 24.8], 苗栗: [120.82, 24.56],
  臺中: [120.68, 24.14], 彰化: [120.54, 24.08], 鹿港: [120.43, 24.06], 南投: [120.68, 23.91], 埔里: [120.97, 23.97], 霧社: [121.13, 24.02],
  斗六: [120.54, 23.71], 嘉義: [120.45, 23.48], 臺南: [120.2, 22.99], 安平: [120.16, 23.0], 高雄: [120.3, 22.62], 屏東: [120.49, 22.67],
  枋寮: [120.59, 22.37], 恆春: [120.74, 22.0], 宜蘭: [121.75, 24.75], 蘇澳: [121.86, 24.6], 花蓮: [121.6, 23.98], 臺東: [121.14, 22.76],
  澎湖: [119.58, 23.57], 澳底: [121.92, 25.05], 玉井: [120.46, 23.12], 布袋: [120.16, 23.38], 甲仙: [120.59, 23.08],
};
const twmap = (w = 560) => geomap({ bbox: [118.3, 21.8, 123.1, 25.45], w, res: '10m', borders: false });

fig('u1-s2', '紀年方式的比較（以西元 1 年與 1912 年為例）', () => {
  const w = 780, h = 320;
  let s = '';
  const rows = [['西元紀年', C.red], ['帝王紀年', C.orange], ['干支紀年', C.purple], ['民國紀年', C.blue]];
  const x1 = 330, x2 = 640;
  rows.forEach(([n, c], i) => {
    const y = 50 + i * 68;
    s += B(20, y - 18, 110, 36, n, { fill: c, stroke: 'none', color: '#fff', weight: 700 });
    s += R(140, y - 10, 620, 20, { fill: c, stroke: 'none', r: 10, op: .25 });
  });
  s += L(x1, 20, x1, 300, { stroke: C.muted, dash: '4 4', sw: 1 }) + L(x2, 20, x2, 300, { stroke: C.muted, dash: '4 4', sw: 1 });
  const pt = (x, y, t) => O(x, y, 7, { fill: '#fff', stroke: C.ink, sw: 2 }) + T(x, y + 24, t, { size: 13, weight: 700 });
  s += T(230, 50, '西元前（B.C.）', { size: 12, fill: C.muted }) + T(450, 50, '西元（A.D.）', { size: 12, fill: C.muted });
  s += pt(x1, 50, '西元 1 年（元年）') + pt(x2, 50, '1912 年');
  s += pt(x1, 118, '漢平帝元始元年');
  s += pt(x1, 186, '辛酉年') + pt(x2, 186, '壬子年');
  s += pt(x2, 254, '民國元年');
  s += T(390, 305, '西元前沒有「西元 0 年」；民國紀年＝西元年－1911', { size: 13, fill: C.teal, weight: 700 });
  return svg(w, h, s);
});

fig('u1-s4', '臺灣重要的史前文化遺址', () => {
  const m = twmap(440);
  let s = m.base();
  const site = (ll, name, era, c, dx, dy) => m.dot(ll, '', { fill: c }) + callout(...m.p(ll), m.p(ll)[0] + dx, m.p(ll)[1] + dy, `${name}\n${era}`, { size: 12, weight: 700, color: c, anchor: dx < 0 ? 'end' : 'start' });
  s += site([121.4, 23.39], '長濱文化（八仙洞）', '舊石器：打製石器、用火', C.brown, 60, 0);
  s += site([121.4, 25.14], '大坌坑文化', '新石器早期：繩紋陶、農耕', C.green, -110, 50);
  s += site([121.42, 25.17], '十三行文化', '金屬器：煉鐵、對外貿易', C.purple, -130, 0);
  s += site([121.52, 25.08], '圓山文化', '新石器：貝塚', C.green, 70, 25);
  s += site([121.13, 22.79], '卑南文化', '新石器：石板棺、玉器', C.green, 40, 10);
  s += site([120.4, 23.06], '左鎮人', '舊石器時代人類化石', C.brown, -60, 20);
  s += legend(10, m.h - 92, [['dot', C.brown, '舊石器時代'], ['dot', C.green, '新石器時代'], ['dot', C.purple, '金屬器時代']], { w: 130, size: 12 });
  return done(m, s);
});

fig('u1-s6', '南島語族的分布範圍（示意）', () => {
  const m = geomap({ bbox: [30, -50, 290, 32], w: 820, res: '110m', proj: 'equirect', rotate: [-160, 0], borders: false });
  let s = m.base();
  const area = [[43, -11], [45, -26], [51, -24], [70, -14], [100, -9], [115, -11], [128, -10], [142, -10], [150, -15], [162, -26], [166, -46], [179, -48], [-172, -30], [-110, -30], [-105, -24], [-138, -8], [-150, 8], [-152, 24], [-162, 23], [-175, 12], [158, 12], [142, 20], [125, 24.5], [121.8, 25.6], [119.5, 22.5], [109, 13], [101, 7], [97, 4], [70, -4]];
  s += m.region(area, { fill: C.red, op: .14 }) + m.region(area, { fill: 'none', stroke: C.red, sw: 2, op: .9 });
  const lb = [['臺灣', [121, 23.7], '（可能的起源地）'], ['馬達加斯加', [46.5, -19]], ['夏威夷群島', [-157, 20.5]], ['復活節島', [-109.4, -27.1]], ['紐西蘭', [173, -41]]];
  for (const [t, ll, sub] of lb) s += m.dot(ll, t + (sub ? sub : ''), { color: t === '臺灣' ? C.red : C.ink, fill: t === '臺灣' ? C.red : C.ink, weight: 700, dx: t === '復活節島' ? -8 : 8 });
  s += m.label([75, -20], '印度洋', { size: 15, fill: C.blue, italic: true }) + m.label([-150, -10], '太平洋', { size: 15, fill: C.blue, italic: true });
  s += m.label([134, -25], '澳洲', { size: 13, fill: C.muted });
  s += legend(10, m.h - 40, [['line', C.red, '南島語族分布範圍']], { w: 160, size: 12 });
  return done(m, s);
});

fig('u1-s7', '臺灣原住民族的分布（政府認定 16 族，示意）', () => {
  const m = twmap(460);
  let s = m.base();
  const tribes = [['泰雅族', [121.3, 24.62], -1], ['賽夏族', [121.0, 24.62], -1], ['太魯閣族', [121.45, 24.2], 1], ['賽德克族', [121.15, 24.05], -1], ['噶瑪蘭族', [121.75, 24.7], 1],
    ['撒奇萊雅族', [121.58, 23.92], 1], ['邵族', [120.92, 23.85], -1], ['布農族', [121.0, 23.4], -1], ['鄒族', [120.75, 23.47], -1], ['阿美族', [121.4, 23.4], 1],
    ['拉阿魯哇族', [120.68, 23.18], -1], ['卡那卡那富族', [120.62, 23.05], -1], ['卑南族', [121.1, 22.8], 1], ['魯凱族', [120.75, 22.75], -1], ['排灣族', [120.72, 22.4], -1], ['達悟族（雅美族）', [121.55, 22.05], 1]];
  const byY = (a, b) => b[1][1] - a[1][1];
  const left = tribes.filter(t => t[2] < 0).sort(byY), right = tribes.filter(t => t[2] > 0).sort(byY);
  left.forEach(([n, ll], i) => { const [x, y] = m.p(ll); s += O(x, y, 4, { fill: C.orange, stroke: '#fff', sw: 1.2 }) + callout(x, y, 150, 40 + i * (m.h - 70) / left.length, n, { anchor: 'end', size: 13, weight: 700, dot: false }); });
  right.forEach(([n, ll], i) => { const [x, y] = m.p(ll); s += O(x, y, 4, { fill: C.orange, stroke: '#fff', sw: 1.2 }) + callout(x, y, m.w - 150, 70 + i * (m.h - 140) / right.length, n, { anchor: 'start', size: 13, weight: 700, dot: false }); });
  return done(m, s);
});

fig('u2-s1', '17 世紀東亞海域的各方勢力', () => {
  const m = geomap({ bbox: [96, -9, 142, 38], w: 600, res: '50m' });
  let s = m.base();
  s += m.dot([113.55, 22.2], '澳門（葡萄牙）', { fill: C.green, color: C.green, weight: 700, dx: -8 });
  s += m.dot([120.98, 14.6], '馬尼拉（西班牙）', { fill: C.purple, color: C.purple, weight: 700 });
  s += m.dot([121.74, 25.13], '雞籠（西班牙）', { fill: C.purple, color: C.purple, size: 12 });
  s += m.dot([106.8, -6.2], '巴達維亞（荷蘭）', { fill: C.orange, color: C.orange, weight: 700 });
  s += m.dot([120.16, 23.0], '大員（荷蘭）', { fill: C.orange, color: C.orange, size: 12, dx: -8 });
  s += m.dot([129.87, 32.75], '長崎（日本對外貿易港）', { fill: C.ink, size: 12, dx: -8 });
  s += m.label([110, 33], '明', { size: 26, weight: 700, fill: C.red });
  s += m.label([136, 36], '日本', { size: 16, weight: 700 }) + m.label([125, 12], '菲律賓', { size: 13, fill: C.muted });
  s += legend(10, 10, [['dot', C.green, '葡萄牙據點'], ['dot', C.purple, '西班牙據點'], ['dot', C.orange, '荷蘭據點']], { w: 130, size: 12 });
  s += note(m.w - 200, m.h - 64, '東亞海域成為貿易轉運站\n各國以據點經營轉口貿易', { size: 12 });
  return done(m, s);
});

fig('u2-s2', '荷蘭與西班牙在臺灣的據點與競爭', () => {
  const m = twmap(460);
  let s = m.base();
  s += m.dot(TW.安平, '1624 荷蘭占領大員\n建熱蘭遮城', { fill: C.orange, color: C.orange, weight: 700, dx: -10 });
  s += m.dot(TW.臺南, '普羅民遮城', { fill: C.orange, size: 11, dx: 8 });
  s += m.dot(TW.基隆, '1626 西班牙\n占領雞籠', { fill: C.purple, color: C.purple, weight: 700, dx: 10 }).replace(/y="([\d.]+)"/, (a, b) => `y="${+b - 18}"`);
  s += m.dot(TW.淡水, '1628 西班牙\n占領滬尾（淡水）', { fill: C.purple, color: C.purple, weight: 700, dx: -10 });
  s += m.route([[120.1, 23.15], [119.9, 23.9], [120.4, 24.8], [121.1, 25.3], [121.65, 25.2]], { stroke: C.orange, sw: 3, curve: true });
  s += m.label([119.95, 24.3], '1642 荷蘭北上\n驅逐西班牙', { size: 13, weight: 700, fill: C.orange });
  s += m.label([121.0, 23.6], '臺灣', { size: 16, weight: 700, fill: C.muted });
  s += note(10, m.h - 70, '荷蘭以臺灣為轉運站\n輸出鹿皮、蔗糖；轉口絲、瓷器', { size: 12 });
  return done(m, s);
});

fig('u2-s4', '鄭氏時期臺灣的貿易（示意）', () => {
  const m = geomap({ bbox: [104, 8, 142, 37], w: 620, res: '50m' });
  let s = m.base();
  const tw = m.p([120.6, 23.5]);
  const arr = (a, b, c) => A([m.p(a), m.p(b)], { stroke: c, sw: 3 });
  s += arr([128, 31], [121.6, 24.2], C.blue) + arr([121.9, 24.6], [129, 32.2], C.red);
  s += note(...m.p([129, 29.3]), '日本 → 臺灣\n銀、銅、軍用品', { size: 12, stroke: C.blue });
  s += note(...m.p([123.5, 27.2]).map((v, i) => v - [0, 0][i]), '臺灣 → 日本\n蔗糖、鹿皮', { size: 12, stroke: C.red });
  s += arr([117, 25.5], [119.9, 24.0], C.blue) + T(...m.p([113.8, 27.4]), '中國沿海（走私貿易）→ 臺灣\n絲、瓷器、民生用品', { size: 12, halo: true });
  s += arr([119.8, 22.6], [113, 12], C.red) + T(...m.p([110, 15.5]), '臺灣 → 東南亞\n蔗糖、鹿皮、瓷器', { size: 12, halo: true });
  s += arr([127, 15], [121.2, 22.4], C.blue) + T(...m.p([131, 17]), '英國商人 → 臺灣\n棉布、軍用品', { size: 12, halo: true });
  s += O(...tw, 6, { fill: C.red, stroke: '#fff', sw: 1.5 }) + m.label([120.5, 22.4], '臺灣（東寧）', { size: 13, weight: 700, fill: C.red });
  s += m.label([111, 32], '清', { size: 24, weight: 700 }) + m.label([137, 35.5], '日本', { size: 15, weight: 700 });
  s += legend(10, 10, [['arrow', C.red, '出口'], ['arrow', C.blue, '進口']], { w: 100, size: 12 });
  return done(m, s);
});

// 清代行政區（以緯度帶示意，只塗在西部平原）
function qing(m, parts, extra = '') {
  let body = '';
  for (const [s0, n0, c] of parts) body += m.poly([[119.9, s0], [121.05, s0], [121.05, n0], [119.9, n0]], { fill: c, op: .55 });
  return m.onLand(body + extra);
}
fig('u3-s1', '清帝國時期臺灣行政區劃的演變（示意）', () => {
  const tw3 = () => geomap({ bbox: [119.25, 21.85, 122.15, 25.4], w: 260, res: '10m', borders: false });
  const ms = [tw3(), tw3(), tw3()];
  const COL = { 鳳山: '#f6c08a', 臺灣: '#f3a2a2', 諸羅: '#a9d18e', 彰化: '#9ec9e8', 淡水: '#c9b3e6', 噶瑪蘭: '#f2d67a' };
  const out = [];
  // 1684
  let s = ms[0].base() + qing(ms[0], [[21.9, 22.95, COL.鳳山], [22.95, 23.2, COL.臺灣], [23.2, 25.35, COL.諸羅]]);
  s += ms[0].label([120.45, 22.6], '鳳山縣', { size: 12, weight: 700 }) + ms[0].label([120.35, 23.07], '臺灣縣', { size: 12, weight: 700 }) + ms[0].label([120.7, 24.1], '諸羅縣', { size: 12, weight: 700 });
  out.push(s + badge(8, 8, '1684 一府三縣', C.red));
  s = ms[1].base() + qing(ms[1], [[21.9, 22.95, COL.鳳山], [22.95, 23.2, COL.臺灣], [23.2, 23.75, COL.諸羅], [23.75, 24.3, COL.彰化], [24.3, 25.35, COL.淡水]]);
  s += ms[1].label([120.45, 22.6], '鳳山縣', { size: 12, weight: 700 }) + ms[1].label([120.35, 23.07], '臺灣縣', { size: 12, weight: 700 }) + ms[1].label([120.4, 23.5], '諸羅縣', { size: 12, weight: 700 });
  s += ms[1].label([120.55, 24.0], '彰化縣', { size: 12, weight: 700 }) + ms[1].label([121.0, 24.85], '淡水廳', { size: 12, weight: 700 }) + ms[1].label([119.55, 23.85], '澎湖廳', { size: 12, weight: 700 });
  out.push(s + badge(8, 8, '1727 一府四縣二廳', C.orange));
  s = ms[2].base() + qing(ms[2], [[21.9, 22.95, COL.鳳山], [22.95, 23.2, COL.臺灣], [23.2, 23.75, COL.諸羅], [23.75, 24.3, COL.彰化], [24.3, 25.35, COL.淡水]],
    ms[2].poly([[121.55, 24.45], [122, 24.45], [122, 25.0], [121.55, 25.0]], { fill: COL.噶瑪蘭, op: .75 }));
  s += ms[2].label([120.45, 22.6], '鳳山縣', { size: 12, weight: 700 }) + ms[2].label([120.35, 23.07], '臺灣縣', { size: 12, weight: 700 }) + ms[2].label([120.4, 23.5], '嘉義縣', { size: 12, weight: 700 });
  s += ms[2].label([120.55, 24.0], '彰化縣', { size: 12, weight: 700 }) + ms[2].label([121.0, 24.85], '淡水廳', { size: 12, weight: 700 }) + ms[2].label([119.55, 23.85], '澎湖廳', { size: 12, weight: 700 }) + ms[2].label([121.55, 24.3], '噶瑪蘭廳', { size: 12, weight: 700 });
  out.push(s + badge(8, 8, '1812 一府四縣三廳', C.purple));
  const W = ms[0].w, H = ms[0].h;
  let all = out.map((x, i) => G(x + ms[i].frame(), `translate(${i * (W + 10)} 0)`)).join('');
  all += T((W * 3 + 20) / 2, H + 22, '均隸屬臺灣府、福建省；1787 年林爽文事件後，諸羅改名嘉義；東部山區未設治', { size: 13, fill: C.teal, weight: 700 });
  return svg(W * 3 + 20, H + 40, all);
});

fig('u3-s4', '開港通商後臺灣的主要出口商品', () => {
  const m = twmap(470);
  let s = m.base();
  s += m.onLand(m.region([[121.2, 25.2], [121.9, 25.1], [121.8, 24.75], [121.2, 24.65], [120.85, 24.75], [121.0, 25.05]], { fill: '#7fbf6a', op: .5 })
    + m.region([[120.75, 24.6], [121.25, 24.55], [121.15, 23.75], [120.85, 23.7], [120.7, 24.1]], { fill: '#c9a978', op: .55 })
    + m.region([[120.1, 23.3], [120.55, 23.3], [120.7, 22.5], [120.35, 22.4], [120.1, 22.9]], { fill: '#f3a2c0', op: .55 }));
  for (const [n, ll] of [['淡水', TW.淡水], ['雞籠', TW.基隆], ['安平', TW.安平], ['打狗', TW.高雄]]) s += m.dot(ll, n, { mark: 'cap', size: 13, weight: 700, dx: n === '雞籠' ? 8 : -8 });
  s += note(m.w - 165, 10, '茶：北部丘陵\n淡水出口，銷往美國等\n出口值最高', { size: 12, stroke: C.green });
  s += note(...m.p([121.5, 24.35]), '樟腦：中北部山區\n淡水出口，銷往歐美\n（製造賽璐珞）', { size: 12, stroke: C.brown });
  s += note(...m.p([119.25, 22.55]), '糖：南部平原\n安平、打狗出口\n銷往中國、日本', { size: 12, stroke: C.red });
  s += legend(10, 10, [['box', '#7fbf6a', '茶產區'], ['box', '#c9a978', '樟腦產區'], ['box', '#f3a2c0', '蔗糖產區'], ['sq', C.red, '通商口岸']], { w: 120, size: 12 }).replace(/<rect x="10" y="10"/, '<rect x="10" y="10"');
  s += note(m.w - 225, m.h - 52, '經濟重心逐漸北移，臺北地位提升', { size: 12, stroke: C.teal });
  return done(m, s);
});

fig('u3-s7', '清代平埔族群的遷徙（示意）', () => {
  const m = twmap(440);
  let s = m.base();
  s += m.route([[120.75, 24.45], [120.95, 24.15], [120.97, 24.0]], { stroke: C.blue, sw: 3, curve: true }) + m.route([[120.55, 24.1], [120.8, 24.0], [120.95, 23.98]], { stroke: C.blue, sw: 3, curve: true });
  s += m.label([120.25, 24.35], '中部平埔族群\n→ 埔里盆地', { size: 12, weight: 700, fill: C.blue });
  s += m.route([[121.75, 24.7], [121.8, 24.3], [121.6, 23.95], [121.45, 23.5]], { stroke: C.orange, sw: 3, curve: true });
  s += m.label([122.0, 23.9], '噶瑪蘭族\n→ 花蓮、臺東', { size: 12, weight: 700, fill: C.orange, anchor: 'end' }).replace(/x="([\d.]+)"/, (a, b) => `x="${+b - 2}"`);
  s += m.route([[120.25, 23.05], [120.45, 23.1], [120.6, 23.05]], { stroke: C.green, sw: 3, curve: true }) + m.route([[120.65, 23.0], [120.9, 22.85], [121.1, 23.0], [121.25, 23.3]], { stroke: C.green, sw: 3, curve: true });
  s += m.label([120.2, 22.75], '西拉雅等族群\n→ 內山（甲仙）\n→ 花東縱谷', { size: 12, weight: 700, fill: C.green });
  s += m.dot(TW.埔里, '埔里', { size: 12, dx: 8 }) + m.dot(TW.甲仙, '甲仙', { size: 11, dx: 6 });
  s += note(10, 10, '漢人入墾後，平埔族群土地流失\n逐漸向山區與東部遷移', { size: 12 });
  return done(m, s);
});

fig('u4-s1', '1895 年日軍接收臺灣的進軍路線（示意）', () => {
  const m = twmap(450);
  let s = m.base();
  const north = [TW.澳底, TW.基隆, TW.臺北, TW.新竹, TW.苗栗, TW.臺中, TW.彰化, TW.嘉義, TW.臺南];
  s += m.route([[122.1, 25.1], TW.澳底], { stroke: C.red, sw: 3 });
  s += m.route(north, { stroke: C.red, sw: 3, curve: true });
  s += m.route([[120.4, 22.15], TW.枋寮, TW.高雄, [120.25, 22.9]], { stroke: C.red, sw: 3, curve: true });
  s += m.route([[119.9, 23.4], TW.布袋, [120.3, 23.2]], { stroke: C.red, sw: 2.5 });
  s += m.dot(TW.澎湖, '澎湖（先占領）', { dx: -8, size: 12 });
  for (const [n, ll, dx] of [['澳底（登陸）', TW.澳底, 8], ['基隆', TW.基隆, 8], ['臺北', TW.臺北, -8], ['新竹', TW.新竹, -8], ['苗栗', TW.苗栗, -8], ['臺中', TW.臺中, 8], ['彰化（八卦山之役）', TW.彰化, -8], ['嘉義', TW.嘉義, 8], ['臺南', TW.臺南, -8], ['枋寮（登陸）', TW.枋寮, 8], ['布袋（登陸）', TW.布袋, -8]]) s += m.dot(ll, n, { dx, size: 12, weight: 700 });
  s += legend(10, m.h - 40, [['arrow', C.red, '日軍進軍路線']], { w: 130, size: 12 });
  s += note(10, 10, '日軍遭遇各地義軍抵抗\n歷時約 5 個月才控制全臺', { size: 12 });
  return done(m, s);
});

fig('u4-s2', '日治時期重要的武裝抗日事件', () => {
  const m = twmap(440);
  let s = m.base();
  const ev = (ll, t, sub, nx, y) => { const [x, yy] = m.p(ll); return L(x, yy, nx + 90, y + 22, { stroke: C.muted, sw: 1 }) + O(x, yy, 6, { fill: C.red, stroke: '#fff', sw: 1.5 }) + note(nx, y, t + '\n' + sub, { size: 12, w: 180, stroke: C.purple }); };
  s += ev(TW.臺北, '1895　臺灣民主國', '唐景崧、丘逢甲、劉永福', 20, 30);
  s += ev(TW.霧社, '1930　霧社事件', '莫那．魯道領導賽德克族', m.w - 190, 200);
  s += ev(TW.玉井, '1915　西來庵事件', '余清芳領導（噍吧哖事件）', 20, 230);
  s += m.label(TW.臺北, '臺北', { size: 12, dy: -14 }).replace(/y="([\d.]+)"/, (a, b) => `y="${+b - 14}"`) + m.label(TW.霧社, '霧社', { size: 12 }).replace(/y="([\d.]+)"/, (a, b) => `y="${+b - 14}"`) + m.label(TW.玉井, '噍吧哖（玉井）', { size: 12 }).replace(/y="([\d.]+)"/, (a, b) => `y="${+b + 16}"`);
  s += note(20, m.h - 60, '西來庵事件是最後一次大規模漢人武裝抗日\n之後轉向非武裝的政治社會運動', { size: 12 });
  return done(m, s);
});

fig('u4-s3', '日治時期的交通與經濟建設', () => {
  const m = twmap(460);
  let s = m.base();
  const rail = [TW.基隆, TW.臺北, TW.桃園, TW.新竹, TW.苗栗, TW.臺中, TW.彰化, TW.斗六, TW.嘉義, TW.臺南, TW.高雄];
  s += m.route(rail, { stroke: C.red, sw: 3.5, curve: true, arrow: false }) + m.route(rail, { stroke: '#fff', sw: 1.2, curve: true, arrow: false, dash: '5 5' });
  s += m.route([TW.嘉義, [120.65, 23.5], [120.8, 23.51]], { stroke: C.brown, sw: 3, arrow: false, dash: '6 3' });
  s += m.route([TW.宜蘭, TW.蘇澳], { stroke: C.red, sw: 2.5, arrow: false }) + m.route([TW.花蓮, [121.35, 23.3], TW.臺東], { stroke: C.red, sw: 2.5, arrow: false, curve: true });
  s += m.dot(TW.基隆, '基隆港', { mark: 'cap', dx: 8, weight: 700 }) + m.dot(TW.高雄, '高雄港', { mark: 'cap', dx: -8, weight: 700 });
  s += m.dot([120.91, 23.86], '日月潭水力發電', { fill: C.blue, color: C.blue, weight: 700, dx: 10 });
  s += m.dot([120.39, 23.2], '嘉南大圳（烏山頭水庫）', { fill: C.teal, color: C.teal, weight: 700, dx: -10 }).replace(/y="([\d.]+)"/, (a, b) => `y="${+b}"`);
  s += m.label([120.95, 23.42], '阿里山森林鐵路', { size: 12, fill: C.brown, weight: 700 });
  s += m.label([120.1, 24.45], '西部縱貫鐵路\n（1908 年全線通車）', { size: 12, fill: C.red, weight: 700 });
  s += legend(10, 10, [['line', C.red, '鐵路'], ['dash', C.brown, '森林鐵路'], ['sq', C.red, '港口']], { w: 110, size: 12 });
  return done(m, s);
});

fig('u5-s1', '二二八事件後國軍增援臺灣的路線（示意）', () => {
  const m = twmap(440);
  let s = m.base();
  s += m.route([[122.1, 25.45], TW.基隆], { stroke: C.red, sw: 3.5 }) + m.route([TW.基隆, TW.臺北, TW.新竹, TW.臺中, TW.嘉義, TW.臺南], { stroke: C.red, sw: 3, curve: true });
  s += m.route([[120.5, 22.0], TW.高雄], { stroke: C.red, sw: 3 }) + m.route([TW.高雄, TW.屏東], { stroke: C.red, sw: 2.5 });
  for (const [n, ll, dx] of [['基隆（登陸）', TW.基隆, 8], ['臺北', TW.臺北, -8], ['新竹', TW.新竹, -8], ['臺中', TW.臺中, -8], ['嘉義', TW.嘉義, -8], ['臺南', TW.臺南, -8], ['高雄', TW.高雄, -8], ['屏東', TW.屏東, 8], ['花蓮', TW.花蓮, 8], ['臺東', TW.臺東, 8], ['宜蘭', TW.宜蘭, 8]]) s += m.dot(ll, n, { dx, size: 12, weight: 700 });
  s += note(m.w - 215, m.h - 80, '1947 年 2 月 27 日臺北緝菸事件\n3 月 8 日起國軍登陸基隆、高雄\n展開鎮壓與清鄉', { size: 12 });
  s += legend(10, m.h - 40, [['arrow', C.red, '國軍增援與鎮壓路線']], { w: 160, size: 12 });
  return done(m, s);
});

fig('u5-s6', '十大建設的分布', () => {
  const m = twmap(470);
  let s = m.base();
  const hw = [TW.基隆, TW.臺北, TW.桃園, TW.新竹, TW.苗栗, TW.臺中, TW.彰化, TW.斗六, TW.嘉義, TW.臺南, TW.高雄];
  s += m.route(hw.map(([a, b]) => [a + .06, b]), { stroke: C.blue, sw: 3, curve: true, arrow: false });
  s += m.route(hw.map(([a, b]) => [a - .04, b]), { stroke: C.ink, sw: 2.5, curve: true, arrow: false, dash: '6 4' });
  s += m.route([TW.蘇澳, [121.8, 24.3], TW.花蓮], { stroke: C.ink, sw: 2.5, curve: true, arrow: false, dash: '6 4' });
  const it = (ll, t, c, dx) => m.dot(ll, t, { fill: c, color: c, weight: 700, dx, size: 12 });
  s += it([121.23, 25.08], '中正國際機場', C.blue, -10) + it([120.5, 24.28], '臺中港', C.blue, -10) + it(TW.蘇澳, '蘇澳港', C.blue, 10);
  s += it([121.59, 25.29], '核能發電廠', C.orange, 10);
  s += it([120.32, 22.58], '中國造船廠、大煉鋼廠\n石油化學工業', C.red, -10);
  s += m.label([120.05, 23.85], '中山高速公路\n鐵路電氣化', { size: 12, weight: 700, fill: C.blue });
  s += m.label([122.0, 24.25], '北迴鐵路', { size: 12, weight: 700, anchor: 'end' });
  s += legend(10, 10, [['dot', C.blue, '交通建設'], ['dot', C.orange, '能源建設'], ['dot', C.red, '重工業'], ['line', C.blue, '高速公路'], ['dash', C.ink, '鐵路']], { w: 120, size: 12 });
  s += note(m.w - 215, m.h - 52, '1970 年代推動，改善基礎建設', { size: 12, stroke: C.teal });
  return done(m, s);
});

// ---------- 中國與東亞史 ----------
const CN = {
  長安: [108.94, 34.34], 西安: [108.94, 34.34], 洛陽: [112.45, 34.62], 平城: [113.3, 40.09], 建康: [118.8, 32.06], 南京: [118.8, 32.06], 北京: [116.4, 39.9],
  天津: [117.2, 39.13], 大沽: [117.7, 38.98], 上海: [121.47, 31.23], 廣州: [113.26, 23.13], 香港: [114.17, 22.3], 九龍: [114.18, 22.32], 廈門: [118.09, 24.48],
  福州: [119.3, 26.08], 寧波: [121.55, 29.87], 武漢: [114.3, 30.6], 漢口: [114.3, 30.6], 長沙: [112.94, 28.23], 南昌: [115.86, 28.68], 重慶: [106.55, 29.56],
  成都: [104.07, 30.67], 瀋陽: [123.43, 41.8], 奉天: [123.43, 41.8], 濟南: [117.0, 36.65], 延安: [109.49, 36.6], 瑞金: [116.03, 25.88], 遵義: [106.93, 27.7],
  盧溝橋: [116.21, 39.85], 敦煌: [94.66, 40.14], 撒馬爾罕: [66.96, 39.65], 怛羅斯: [71.3, 42.5], 拉薩: [91.1, 29.65], 慶州: [129.2, 35.85], 奈良: [135.8, 34.68],
  平壤: [125.75, 39.02], 漢城: [126.98, 37.57], 仁川: [126.62, 37.45], 旅順: [121.25, 38.81], 大連: [121.6, 38.91], 威海衛: [122.12, 37.5], 馬關: [130.94, 33.96],
  東京: [139.69, 35.69], 長崎: [129.87, 32.75], 廣島: [132.46, 34.39], 那霸: [127.68, 26.21], 哈爾濱: [126.63, 45.75], 齊齊哈爾: [123.96, 47.35], 吉林: [126.55, 43.84],
  牛莊: [122.24, 40.67], 登州: [120.75, 37.8], 九江: [116.0, 29.7], 鎮江: [119.45, 32.2], 潮州: [116.62, 23.66], 瓊州: [110.35, 20.0], 杭州: [120.16, 30.27],
  太原: [112.55, 37.87], 徐州: [117.2, 34.26], 臺北: [121.52, 25.04], 淡水: [121.44, 25.17], 安平: [120.16, 23.0], 雞籠: [121.74, 25.13], 打狗: [120.3, 22.62],
};
const GREAT_WALL = [[94.0, 40.3], [98.2, 39.8], [103.8, 37.5], [106.5, 38.5], [110, 39.3], [113.5, 40.3], [117.3, 40.5], [119.8, 40.0]];
const wall = m => m.route(GREAT_WALL, { stroke: '#8a5a2b', sw: 2.5, arrow: false, dash: '2 3' });
const num = (m, ll, k, c = C.red) => { const [x, y] = m.p(ll); return O(x, y, 9, { fill: c, stroke: '#fff', sw: 1.5 }) + T(x, y, k, { size: 11, weight: 700, fill: '#fff' }); };

fig('u6-s5', '漢代的絲路：張騫通西域後，東西貿易往來頻繁', () => {
  const m = geomap({ bbox: [8, 20, 124, 52], w: 860, res: '110m', borders: false });
  let s = m.base() + wall(m);
  const route = [CN.長安, [103.8, 36.06], CN.敦煌, [89.18, 42.95], [80.3, 41.2], [75.99, 39.47], CN.撒馬爾罕, [62.2, 37.6], [53, 36.2], [44.58, 33.09], [36.2, 36.2], [29, 38.5], [12.5, 41.9]];
  s += m.route(route, { stroke: C.red, sw: 3.5, curve: true, arrow: false });
  s += m.route([CN.敦煌, [87, 39], [79.92, 37.11], [75.99, 39.47]], { stroke: C.red, sw: 2.5, curve: true, arrow: false, dash: '6 4' });
  for (const [n, ll, dx] of [['長安', CN.長安, 8], ['敦煌', CN.敦煌, 8], ['撒馬爾罕', CN.撒馬爾罕, 8], ['羅馬', [12.5, 41.9], -8]]) s += m.dot(ll, n, { dx, weight: 700 });
  s += m.label([112, 31], '漢', { size: 26, weight: 700, fill: C.red }) + m.label([102, 45.5], '匈奴', { size: 18, weight: 700, fill: C.brown });
  s += m.label([84, 38.5], '西域', { size: 16, weight: 700 }) + m.label([55, 31.5], '安息', { size: 18, weight: 700 }) + m.label([22, 36.5], '大秦（羅馬帝國）', { size: 16, weight: 700 });
  s += m.label([82, 27], '天竺', { size: 15 });
  s += legend(10, m.h - 82, [['line', C.red, '絲路（主要路線）'], ['dash', C.red, '絲路（南道）'], ['dash', '#8a5a2b', '長城']], { w: 150, size: 12 });
  s += note(m.w - 250, m.h - 70, '傳出：絲綢、漆器\n傳入：葡萄、苜蓿、胡蘿蔔、胡琴', { size: 12 });
  return done(m, s);
});

fig('u6-s6', '北魏孝文帝遷都洛陽', () => {
  const m = geomap({ bbox: [96, 22, 124, 46], w: 560, res: '50m', borders: false });
  let s = m.base();
  s += m.onLand(m.region([[98, 42], [110, 44], [121, 43], [124, 40], [122, 37], [120.5, 34], [117, 33.2], [113, 32.6], [108, 33], [103, 34], [99, 37]], { fill: '#cfe3b4', op: .7 })
    + m.region([[100, 33.5], [106, 32.5], [113, 32.3], [117, 33], [121, 33.6], [122, 30], [121, 25], [116, 22.5], [110, 21.5], [104, 23], [101, 27]], { fill: '#f8dde1', op: .7 }));
  s += m.route([[103, 33.8], [110, 32.8], [114, 32.4], [118, 33.2], [120.5, 34]], { stroke: C.red, sw: 2, arrow: false, dash: '6 4', curve: true });
  s += A([m.p(CN.平城), m.p([112.6, 35])], { stroke: C.orange, sw: 4 });
  s += m.dot(CN.平城, '平城', { mark: 'cap', weight: 700, dx: 10 }) + m.dot(CN.洛陽, '洛陽', { mark: 'cap', weight: 700, dx: 10 }) + m.dot(CN.建康, '建康', { mark: 'cap', weight: 700, dx: 10 });
  s += m.label([108, 39], '北魏', { size: 24, weight: 700, fill: C.green }) + m.label([112, 27], '齊（南朝）', { size: 20, weight: 700, fill: C.red });
  s += m.label([110, 45], '柔然', { size: 15, fill: C.brown }) + m.label([100, 36.5], '吐谷渾', { size: 14, fill: C.brown });
  s += note(m.w - 215, 12, '孝文帝漢化政策\n遷都洛陽、改漢姓、穿漢服\n說漢語、與漢人通婚', { size: 12 });
  s += legend(10, m.h - 82, [['sq', C.red, '都城'], ['dash', C.red, '國界'], ['arrow', C.orange, '遷都路線']], { w: 110, size: 12 });
  return done(m, s);
});

fig('u6-s8', '唐代文化的對外交流', () => {
  const m = geomap({ bbox: [55, 5, 145, 52], w: 820, res: '110m', borders: false });
  let s = m.base();
  s += m.onLand(m.region([[73, 40], [80, 45], [95, 44], [110, 43], [122, 43], [128, 41], [122, 31], [120, 25], [110, 20], [106, 22], [102, 28], [97, 33], [86, 37], [76, 37]], { fill: '#fde6b8', op: .75 }));
  const arr = (to, c, mid) => AQ(...m.p(CN.長安), ...m.p(mid), ...m.p(to), { stroke: c, sw: 3.5 });
  s += arr(CN.怛羅斯, C.purple, [90, 46]) + arr(CN.慶州, C.orange, [120, 40]) + arr(CN.奈良, C.green, [125, 30]) + arr(CN.拉薩, C.pink, [100, 28]);
  s += AQ(...m.p(CN.長安), ...m.p([90, 32]), ...m.p([80, 25]), { stroke: C.teal, sw: 2.5, dash: '6 4' });
  s += m.dot(CN.長安, '長安', { mark: 'cap', weight: 700, dx: -8 }) + m.dot(CN.怛羅斯, '怛羅斯', { weight: 700, dx: -8 }) + m.dot(CN.慶州, '新羅', { weight: 700, dx: 8 }) + m.dot(CN.奈良, '日本', { weight: 700, dx: 8 }) + m.dot(CN.拉薩, '吐蕃', { weight: 700, dx: -8 });
  s += note(...m.p([58, 49]), '751 怛羅斯之役\n造紙術經大食（阿拉伯）西傳', { size: 12, stroke: C.purple });
  s += note(...m.p([122, 50]), '新羅、日本：學習漢字、律令\n日本派遣唐使，參考漢字創假名', { size: 12, stroke: C.green });
  s += note(...m.p([70, 30]), '吐蕃：文成公主入藏\n天竺：玄奘西行取經', { size: 12, stroke: C.pink });
  s += m.label([60, 37], '大食', { size: 15, weight: 700 }) + m.label([80, 22], '天竺（印度）', { size: 15, weight: 700 });
  s += legend(10, m.h - 40, [['box', '#fde6b8', '盛唐時期疆域（約略）']], { w: 170, size: 12 });
  return done(m, s);
});

fig('u7-s2', '蒙古帝國的三次西征與四大汗國', () => {
  const m = geomap({ bbox: [-5, 15, 142, 64], w: 860, res: '110m', borders: false });
  let s = m.base();
  const reg = [['欽察汗國', [[30, 47], [45, 44], [60, 45], [70, 50], [70, 56], [55, 58], [38, 57], [28, 53]], '#f8dde1'], ['察合台汗國', [[62, 37], [72, 36], [80, 37], [90, 42], [88, 47], [76, 46], [64, 44]], '#dce8f6'],
    ['伊兒汗國', [[35, 36], [44, 30], [55, 25], [65, 27], [66, 35], [60, 40], [48, 40], [40, 39]], '#fbe9d3'], ['窩闊台汗國', [[84, 46], [92, 45], [95, 50], [88, 52], [82, 50]], '#e7e2f6'],
    ['元', [[90, 43], [98, 50], [110, 52], [122, 53], [132, 48], [126, 40], [122, 30], [118, 23], [108, 21], [100, 22], [97, 28], [92, 33], [88, 37]], '#dcefe4']];
  s += m.onLand(reg.map(([, p, c]) => m.region(p, { fill: c, op: .85 })).join(''));
  for (const [n, p] of reg) { const c = p.reduce((a, q) => [a[0] + q[0] / p.length, a[1] + q[1] / p.length], [0, 0]); s += m.label(c, n, { size: 14, weight: 700 }); }
  const HQ = [102.8, 47.2];
  s += m.route([HQ, [85, 45], [70, 42], [60, 40], [50, 41]], { stroke: C.red, sw: 3, curve: true });
  s += m.route([HQ, [85, 51], [65, 53], [45, 53], [28, 51], [20, 49]], { stroke: C.blue, sw: 3, curve: true });
  s += m.route([HQ, [85, 41], [68, 36], [54, 34], [44.6, 33.4]], { stroke: C.green, sw: 3, curve: true });
  s += m.dot(HQ, '和林', { mark: 'cap', weight: 700, dx: 8 }) + m.dot(CN.北京, '大都', { mark: 'cap', weight: 700, dx: 8 }) + m.dot([44.4, 33.3], '巴格達', { weight: 700, dx: -8 });
  s += legend(10, m.h - 82, [['arrow', C.red, '第一次西征（1219，成吉思汗）'], ['arrow', C.blue, '第二次西征（1235，拔都）'], ['arrow', C.green, '第三次西征（1252，旭烈兀）']], { w: 245, size: 12 });
  s += note(m.w - 260, m.h - 70, '1258 攻陷巴格達，滅阿拔斯王朝\n1279 忽必烈滅南宋，統一中國', { size: 12 });
  return done(m, s);
});

fig('u7-s6', '鄭和下西洋的航線（1405～1433）', () => {
  const m = geomap({ bbox: [30, -10, 125, 36], w: 820, res: '110m', borders: false });
  let s = m.base();
  const main = [CN.南京, [121.8, 30.5], [119.52, 25.96], [114, 18], [109.2, 13.8], [106, 8], [104.75, -2.0], [102.25, 2.19], [97, 6], [88, 6], [79.86, 6.93], [76.5, 9], [75.78, 11.25], [66, 20], [56.27, 26.6]];
  s += m.route(main, { stroke: C.red, sw: 3, curve: true });
  s += m.route([[75.78, 11.25], [60, 12], [45.03, 12.5], [43, 4], [40.12, -3.22]], { stroke: C.red, sw: 3, curve: true });
  s += m.route([[45.03, 12.5], [42, 17], [39.4, 21.3]], { stroke: C.red, sw: 2, curve: true, dash: '5 4' });
  s += m.route([[106, 8], [107, -2], [106.8, -6]], { stroke: C.red, sw: 2, dash: '5 4' });
  for (const [n, ll, dx] of [['南京', CN.南京, 8], ['占城', [109.2, 13.8], 8], ['爪哇', [106.8, -6.2], 8], ['麻六甲', [102.25, 2.19], -8], ['錫蘭', [79.86, 6.93], 8], ['古里', [75.78, 11.25], -8], ['忽魯謨斯', [56.27, 27.0], 8], ['天方（麥加）', [39.83, 21.42], -8], ['麻林地', [40.12, -3.22], -8]]) s += m.dot(ll, n, { dx, size: 12, weight: 700 });
  s += m.label([112, 30], '明', { size: 26, weight: 700, fill: C.red }) + m.label([78, 22], '印度', { size: 15 }) + m.label([48, 30], '阿拉伯', { size: 14 }) + m.label([34, 6], '非洲', { size: 15 });
  s += note(10, m.h - 92, '明成祖派鄭和七次下西洋\n宣揚國威、建立朝貢關係\n最遠抵達非洲東岸', { size: 12 });
  return done(m, s);
});

fig('u8-s1', '鴉片戰爭與南京條約的五口通商', () => {
  const m = geomap({ bbox: [106, 19, 127, 35], w: 520, res: '50m', borders: false });
  let s = m.base();
  for (const [n, ll, dx] of [['上海', CN.上海, 8], ['寧波', CN.寧波, 8], ['福州', CN.福州, 8], ['廈門', CN.廈門, 8], ['廣州', CN.廣州, -8]]) s += m.dot(ll, n, { fill: C.orange, color: C.orange, weight: 700, dx });
  s += m.dot(CN.香港, '香港（割讓）', { fill: C.red, color: C.red, weight: 700, dx: 8 }).replace(/y="([\d.]+)"/g, (a, b) => a);
  s += m.dot(CN.南京, '南京（1842 簽約）', { mark: 'star', weight: 700, dx: -12 });
  s += m.label([112, 30], '清', { size: 24, weight: 700 });
  s += legend(10, 10, [['dot', C.orange, '五口通商'], ['dot', C.red, '割讓']], { w: 110, size: 12 });
  // 三角貿易
  const X = m.w + 20;
  let t = R(X, 10, 250, m.h - 20, { fill: '#fff', stroke: C.line, r: 10 }) + T(X + 125, 34, '英國的三角貿易', { size: 15, weight: 700 });
  const pts = { 英國: [X + 125, 90], 印度: [X + 45, 260], 中國: [X + 205, 260] };
  for (const [n, [x, y]] of Object.entries(pts)) t += B(x - 30, y - 18, 60, 36, n, { fill: C.soft, stroke: C.ink, weight: 700 });
  t += A([[X + 110, 110], [X + 55, 240]], { stroke: C.blue, sw: 2.5 }) + T(X + 52, 170, '棉織品', { size: 12, fill: C.blue, weight: 700 });
  t += A([[X + 78, 262], [X + 172, 262]], { stroke: C.red, sw: 2.5 }) + T(X + 125, 285, '鴉片', { size: 13, fill: C.red, weight: 700 });
  t += A([[X + 195, 240], [X + 140, 110]], { stroke: C.green, sw: 2.5 }) + T(X + 200, 170, '茶葉、絲', { size: 12, fill: C.green, weight: 700 });
  t += T(X + 125, 320, '鴉片大量輸入，白銀外流\n→ 林則徐禁菸 → 鴉片戰爭', { size: 12 });
  return svg(X + 270, m.h, s + m.frame() + t);
});

const PORTS2 = [['牛莊', CN.牛莊, 8], ['天津', CN.天津, -8], ['登州', CN.登州, 8], ['南京', CN.南京, -8], ['鎮江', CN.鎮江, 8], ['漢口', CN.漢口, -8], ['九江', CN.九江, -8], ['潮州', CN.潮州, -8], ['瓊州', CN.瓊州, 8], ['淡水', CN.淡水, -8], ['雞籠', CN.雞籠, 8], ['安平', CN.安平, -8], ['打狗', CN.打狗, 8]];
fig('u8-s2', '英法聯軍與天津條約、北京條約', () => {
  const m = geomap({ bbox: [104, 17, 128, 43], w: 560, res: '50m', borders: false });
  let s = m.base();
  s += m.route([[113.5, 22.3], [118, 24.5], [123, 31], [123.5, 37], [118.5, 38.6], CN.大沽], { stroke: C.red, sw: 3.5, curve: true });
  s += m.route([CN.大沽, CN.天津, CN.北京], { stroke: C.red, sw: 3.5, curve: true });
  for (const [n, ll, dx] of PORTS2) s += m.dot(ll, n, { fill: C.purple, color: C.purple, size: 12, weight: 700, dx });
  s += m.dot(CN.北京, '北京（1860 北京條約、火燒圓明園）', { mark: 'cap', weight: 700, dx: -8 });
  s += m.dot(CN.廣州, '廣州（1857 遭攻占）', { mark: 'none', size: 12, dx: -8 }) + m.dot(CN.九龍, '割讓九龍', { fill: C.red, color: C.red, size: 12, weight: 700, dx: 8 });
  s += legend(10, m.h - 64, [['arrow', C.red, '英法聯軍進軍路線'], ['dot', C.purple, '新開放的通商口岸']], { w: 170, size: 12 });
  s += note(m.w - 215, m.h - 92, '1858 天津條約：增開口岸\n（含臺灣）、外國人可入內地\n1860 北京條約：加開天津', { size: 12 });
  return done(m, s);
});

fig('u8-s3', '明治維新後日本的對外擴張', () => {
  const m = geomap({ bbox: [115, 20, 150, 50], w: 560, res: '50m' });
  let s = m.base();
  s += m.country(['Japan'], { fill: '#f6c0c4' }) + m.country(['North Korea', 'South Korea'], { fill: '#f9dde0' }) + m.country(['Taiwan'], { fill: '#f9dde0' });
  s += num(m, CN.那霸, '1') + note(...m.p([129, 26.5]), '1879 年　日本併吞琉球', { size: 12 });
  s += num(m, [124, 38.5], '2') + note(...m.p([116.5, 37]), '1894～1895 甲午戰爭\n日本擊敗清帝國', { size: 12 });
  s += num(m, [121, 23.6], '3') + note(...m.p([123, 23]), '1895 年　臺灣成為日本殖民地', { size: 12 });
  s += num(m, CN.旅順, '4') + note(...m.p([131, 47]), '1904～1905 日俄戰爭\n日本擊敗俄國', { size: 12 });
  s += num(m, [127.5, 37.2], '5') + note(...m.p([128.5, 35]).map((v, i) => v + [10, 0][i]), '1910 年　朝鮮成為日本殖民地', { size: 12 });
  s += m.label([119, 44], '清', { size: 22, weight: 700 }) + m.label([137, 37], '日本', { size: 18, weight: 700, fill: C.red });
  s += m.label([140, 48], '俄國', { size: 15 });
  return done(m, s);
});

fig('u8-s4', '甲午戰爭形勢圖（1894～1895）', () => {
  const m = geomap({ bbox: [115, 30, 135, 43], w: 560, res: '50m' });
  let s = m.base();
  s += m.route([[129.7, 33.5], [127, 35], [126.2, 37.2], CN.仁川], { stroke: C.blue, sw: 3, curve: true });
  s += m.route([CN.仁川, CN.平壤, [124.4, 40.1], [122.5, 40], CN.旅順], { stroke: C.red, sw: 3, curve: true });
  s += m.route([[125.5, 38], [124, 39.3]], { stroke: C.blue, sw: 3 }) + m.dot([123.8, 39.4], '黃海海戰', { mark: 'star', size: 12, weight: 700, dx: -12 });
  s += m.route([[124, 38], [122.8, 37.2], CN.威海衛], { stroke: C.blue, sw: 3, curve: true });
  s += m.dot(CN.平壤, '平壤', { weight: 700, dx: 8 }) + m.dot(CN.旅順, '旅順', { weight: 700, dx: -8 }) + m.dot(CN.威海衛, '威海衛（北洋艦隊覆沒）', { weight: 700, dx: -8 });
  s += m.dot(CN.馬關, '馬關（簽約處）', { mark: 'star', weight: 700, dx: 10 });
  s += m.label([118, 38.5], '清', { size: 24, weight: 700 }) + m.label([127.5, 40.2], '朝鮮', { size: 16, weight: 700 }) + m.label([134, 35.5], '日本', { size: 16, weight: 700, anchor: 'end' });
  s += legend(10, 10, [['arrow', C.blue, '日本海軍進攻路線'], ['arrow', C.red, '日本陸軍進攻路線']], { w: 165, size: 12 });
  s += note(10, m.h - 92, '1895 馬關條約：承認朝鮮獨立自主\n割讓遼東半島（後歸還）、臺灣、澎湖\n賠款白銀 2 億兩', { size: 12 });
  return done(m, s);
});

fig('u8-s5', '八國聯軍進攻路線與俄國占領東北', () => {
  const m = geomap({ bbox: [102, 30, 134, 52], w: 560, res: '50m', borders: false });
  let s = m.base();
  s += m.region([[114.5, 38], [118.5, 38.5], [121, 37.5], [119.5, 35], [115.5, 35]], { fill: C.redS, op: .9 }) + m.label([117.2, 36.4], '義和團\n起源地', { size: 12, weight: 700, fill: C.red });
  s += m.route([[121.5, 38.5], CN.大沽, CN.天津, CN.北京], { stroke: C.red, sw: 3.5, curve: true });
  s += m.route([CN.北京, [113.5, 39.5], CN.太原, [110.5, 35.5], CN.西安], { stroke: C.blue, sw: 3, curve: true, dash: '6 4' });
  for (const [a, b] of [[[123.9, 51], CN.齊齊哈爾], [[129.5, 49], CN.哈爾濱], [[131.5, 44.8], CN.吉林], [[122, 43.5], CN.奉天]]) s += m.route([a, b], { stroke: C.green, sw: 3 });
  for (const [n, ll, dx] of [['北京（1901 辛丑和約）', CN.北京, -8], ['天津', CN.天津, 8], ['太原', CN.太原, -8], ['西安', CN.西安, -8], ['齊齊哈爾', CN.齊齊哈爾, 8], ['哈爾濱', CN.哈爾濱, 8], ['吉林', CN.吉林, 8], ['奉天', CN.奉天, -8]]) s += m.dot(ll, n, { size: 12, weight: 700, dx });
  s += m.label([117.5, 48.5], '俄國趁機占領東北', { size: 13, weight: 700, fill: C.green });
  s += legend(10, 10, [['arrow', C.red, '八國聯軍進攻路線'], ['dash', C.blue, '慈禧、光緒出逃路線'], ['arrow', C.green, '俄軍進攻方向']], { w: 170, size: 12 });
  s += note(m.w - 210, m.h - 50, '東南各省督撫與列強「東南互保」', { size: 12 });
  return done(m, s);
});

fig('u8-s6', '晚清開放的通商口岸', () => {
  const m = geomap({ bbox: [104, 17, 128, 43], w: 560, res: '50m', borders: false });
  let s = m.base();
  for (const [n, ll, dx] of [['上海', CN.上海, 8], ['寧波', CN.寧波, 8], ['福州', CN.福州, 8], ['廈門', CN.廈門, -8], ['廣州', CN.廣州, -8]]) s += m.dot(ll, n, { fill: C.orange, color: C.orange, weight: 700, dx });
  for (const [n, ll, dx] of PORTS2) s += m.dot(ll, n, { fill: C.purple, color: C.purple, size: 12, weight: 700, dx });
  s += legend(10, 10, [['dot', C.orange, '南京條約開放（1842）'], ['dot', C.purple, '天津、北京條約開放（1858～1860）']], { w: 245, size: 12 });
  s += note(m.w - 230, m.h - 92, '通商口岸成為西方文化傳入的窗口\n報紙、新式學堂、西式建築\n電報、輪船等陸續出現', { size: 12 });
  return done(m, s);
});

fig('u9-s1', '武昌起事後各省紛紛宣布獨立（1911）', () => {
  const m = geomap({ bbox: [95, 18, 128, 46], w: 560, res: '50m', borders: false });
  let s = m.base();
  const ind = [['長沙', CN.長沙], ['西安', CN.西安], ['南昌', CN.南昌], ['太原', CN.太原], ['昆明', [102.7, 25.04]], ['貴陽', [106.63, 26.65]], ['杭州', CN.杭州], ['桂林', [110.29, 25.27]], ['安慶', [117.05, 30.52]], ['福州', CN.福州], ['廣州', CN.廣州], ['成都', CN.成都], ['上海', CN.上海]];
  for (const [n, ll] of ind) s += m.dot(ll, n, { fill: C.green, size: 12, dx: 7 });
  s += m.dot([120.62, 31.3], '', { fill: C.green });
  s += m.dot([114.3, 30.55], '武昌起事\n（1911.10.10）', { mark: 'star', weight: 700, dx: -12, color: C.red });
  s += m.dot(CN.南京, '', { mark: 'cap' }) + callout(...m.p(CN.南京), ...m.p([123.3, 35]), '南京：中華民國臨時政府\n（1912.1.1 成立）', { anchor: 'middle', weight: 700, size: 12 });
  s += m.dot(CN.北京, '北京（清廷）', { mark: 'cap', weight: 700, dx: 8 });
  s += note(...m.p([96, 33]), '四川保路運動\n（成都）', { size: 12, stroke: C.orange });
  s += legend(10, m.h - 64, [['dot', C.green, '宣布獨立的省分（省會）'], ['sq', C.red, '政府所在地']], { w: 195, size: 12 });
  return done(m, s);
});

fig('u9-s5', '北伐統一（1926～1928）', () => {
  const m = geomap({ bbox: [104, 20, 127, 44], w: 560, res: '50m', borders: false });
  let s = m.base();
  s += m.route([CN.廣州, CN.長沙, CN.武漢], { stroke: C.red, sw: 3.5, curve: true });
  s += m.route([CN.廣州, [115, 26], CN.南昌, CN.南京], { stroke: C.red, sw: 3.5, curve: true });
  s += m.route([CN.廣州, [116.5, 23.4], CN.福州, CN.杭州, CN.上海], { stroke: C.red, sw: 3, curve: true });
  s += m.route([CN.南京, CN.徐州, CN.濟南, CN.北京], { stroke: C.red, sw: 3.5, curve: true });
  const ev = [[CN.廣州, '1', '1925 國民政府成立（廣州）', [109, 21.5]], [CN.長沙, '2', '1926 北伐開始', [106, 27]], [CN.武漢, '3', '1927 國民政府遷武漢', [105, 31.5]],
    [CN.上海, '4', '1927 清黨（上海）', [122.5, 28.5]], [CN.南京, '5', '1927 定都南京', [121.5, 34]], [CN.瀋陽, '6', '1928 東北易幟，全國統一', [115, 42.5]]];
  for (const [ll, k, t, at] of ev) s += num(m, ll, k) + T(...m.p(at), t, { size: 12, weight: 700, halo: true, anchor: 'start' });
  s += legend(m.w - 140, m.h - 40, [['arrow', C.red, '北伐路線']], { w: 120, size: 12 });
  return done(m, s);
});

fig('u9-s6', '中共長征與西安事變', () => {
  const m = geomap({ bbox: [99, 22, 120, 40], w: 560, res: '50m', borders: false });
  let s = m.base();
  const lm = [CN.瑞金, [114, 25.5], [111, 25.8], [108.5, 26.4], CN.遵義, [105.5, 26.8], [103.5, 25.8], [102.4, 26.8], [102.3, 28.4], [102.2, 29.9], [102.6, 31.6], [103.3, 33.2], [104.3, 34.6], [106.4, 36], [108.17, 36.93]];
  s += m.route(lm, { stroke: C.red, sw: 3.5, curve: true });
  s += m.dot(CN.瑞金, '瑞金', { weight: 700, dx: 8 }) + m.dot(CN.遵義, '遵義', { weight: 700, dx: 8 }) + m.dot([108.17, 36.93], '吳起鎮', { weight: 700, dx: -8 }) + m.dot(CN.延安, '延安', { weight: 700, dx: 8 }) + m.dot(CN.西安, '西安', { mark: 'star', weight: 700, dx: 10 });
  s += note(...m.p([113.5, 24]), '1934 第五次圍剿\n中共撤離瑞金，開始長征', { size: 12, stroke: C.red });
  s += note(...m.p([110, 39.5]), '1935 抵達陝北\n之後以延安為根據地', { size: 12, stroke: C.red });
  s += note(...m.p([110.5, 33.6]), '1936 西安事變\n張學良、楊虎城挾持蔣中正\n→ 停止剿共、一致抗日', { size: 12, stroke: C.purple });
  s += legend(10, m.h - 40, [['arrow', C.red, '中共長征路線']], { w: 130, size: 12 });
  return done(m, s);
});

const MANCHUKUO = [[119, 41], [121.5, 40.6], [124.3, 40], [128, 42], [130.5, 42.5], [131.2, 45], [134.5, 48], [127.5, 49.8], [122, 53], [118, 49], [116.5, 46], [116.5, 43]];
fig('u9-s7', '日本侵略東亞', () => {
  const m = geomap({ bbox: [108, 26, 146, 52], w: 580, res: '50m' });
  let s = m.base();
  s += m.country(['Japan', 'North Korea', 'South Korea', 'Taiwan'], { fill: '#f6c0c4' }) + m.onLand(m.region(MANCHUKUO, { fill: '#f9dde0', op: .9 }));
  s += m.route([[129.5, 35], [127, 37.5]], { stroke: C.red, sw: 3 }) + m.route([[126, 40.5], CN.瀋陽], { stroke: C.red, sw: 3 }) + m.route([[121, 40.5], CN.北京], { stroke: C.red, sw: 3 }) + m.route([[124.5, 31.5], CN.上海], { stroke: C.red, sw: 3 });
  const ev = [[[127.2, 37.3], '1', '1910 日本併吞朝鮮', [131, 39]], [CN.瀋陽, '2', '1931 九一八事變', [125, 44]], [[125.5, 46], '3', '1932 成立滿洲國', [124, 47.5]], [CN.盧溝橋, '4', '1937 七七事變（北平盧溝橋）', [108.5, 42]], [CN.上海, '5', '1937 淞滬會戰 → 南京大屠殺', [111, 29]]];
  for (const [ll, k, t, at] of ev) s += num(m, ll, k) + T(...m.p(at), t, { size: 12, weight: 700, halo: true, anchor: 'start' });
  s += m.dot(CN.南京, '南京', { size: 12, dx: -8 });
  s += legend(m.w - 170, m.h - 64, [['box', '#f6c0c4', '日本領土及殖民地'], ['arrow', C.red, '日軍侵略方向']], { w: 160, size: 12 });
  return done(m, s);
});

fig('u9-s8', '太平洋戰爭：日本最大勢力範圍（約 1942 年）', () => {
  const m = geomap({ bbox: [85, -15, 215, 54], w: 860, res: '110m', proj: 'equirect', rotate: [-150, 0] });
  let s = m.base();
  const jp = [[120, 53], [135, 55], [142, 51], [156, 51], [172, 53], [176, 45], [162, 30], [173, 18], [176, 0], [162, -10], [150, -11], [140, -9], [128, -10], [116, -10], [104, -7], [95, 5], [92, 15], [96, 27], [99, 22], [105, 22.5], [110, 25], [114, 30], [113, 36], [114, 40], [117, 42], [118, 48]];
  s += m.region(jp, { fill: C.red, op: .14 }) + m.region(jp, { fill: 'none', stroke: C.red, sw: 2, op: .9 });
  s += m.dot([-157.95, 21.35], '1941.12 偷襲珍珠港', { mark: 'star', weight: 700, dx: -12 });
  s += m.dot([120.98, 14.6], '1942.1 日本占領馬尼拉', { size: 12, weight: 700, dx: 8 });
  s += m.dot([-177.37, 28.2], '1942.6 中途島戰役（轉捩點）', { mark: 'star', size: 12, weight: 700, dx: -12 });
  s += m.dot(CN.廣島, '1945.8 廣島、長崎遭原子彈轟炸', { mark: 'star', size: 12, weight: 700, dx: 12 }).replace(/y="([\d.]+)"/, a => a);
  s += m.dot(CN.重慶, '重慶（國民政府）', { mark: 'cap', size: 12, dx: -8 });
  s += m.label([105, 2], '荷屬東印度', { size: 12 }) + m.label([170, -25], '太平洋', { size: 16, italic: true, fill: C.blue }) + m.label([135, -25], '澳洲', { size: 14 });
  s += legend(10, m.h - 40, [['line', C.red, '日本最大勢力範圍']], { w: 160, size: 12 });
  return done(m, s);
});

fig('u10-s1', '國共內戰與中共勢力擴張（1945～1949）', () => {
  const m = geomap({ bbox: [96, 18, 135, 53], w: 580, res: '50m' });
  let s = m.base();
  s += m.onLand(m.region(MANCHUKUO, { fill: '#f6c0b0', op: .8 }));
  for (const [a, b] of [[[118, 52], [120, 48]], [[128, 51], [127, 46.5]], [[133, 47], [129.5, 45]], [[132, 44], [129, 43]]]) s += m.route([a, b], { stroke: C.blue, sw: 3 });
  s += m.route([[124, 43], [120, 41], CN.北京], { stroke: C.red, sw: 3.5, curve: true }) + m.route([CN.北京, CN.濟南, CN.徐州, CN.南京], { stroke: C.red, sw: 3.5, curve: true });
  s += m.route([CN.南京, CN.南昌, CN.廣州], { stroke: C.red, sw: 3, curve: true }) + m.route([CN.武漢, CN.重慶, CN.成都], { stroke: C.red, sw: 3, curve: true });
  s += m.route([CN.成都, [112, 24], CN.臺北], { stroke: C.purple, sw: 2.5, curve: true, dash: '6 4' });
  s += num(m, [123, 45], '1', C.blue) + T(...m.p([124, 49.6]), '1945 蘇聯進軍東北', { size: 12, weight: 700, halo: true, anchor: 'start' });
  s += num(m, CN.瀋陽, '2') + T(...m.p([125, 40.5]), '1948 遼瀋會戰', { size: 12, weight: 700, halo: true, anchor: 'start' });
  s += num(m, CN.徐州, '3') + T(...m.p([118.5, 34.6]), '1948～49 徐蚌會戰、平津會戰', { size: 12, weight: 700, halo: true, anchor: 'start' });
  s += num(m, CN.南京, '4') + T(...m.p([120, 31.2]), '1949.4 中共渡江', { size: 12, weight: 700, halo: true, anchor: 'start' });
  s += num(m, CN.北京, '5') + T(...m.p([104, 41.5]), '1949.10.1 中華人民共和國成立', { size: 12, weight: 700, halo: true, anchor: 'start' });
  s += num(m, CN.臺北, '6', C.purple) + T(...m.p([116, 22]), '1949.12 中華民國政府遷臺', { size: 12, weight: 700, halo: true, anchor: 'start', fill: C.purple });
  s += legend(10, m.h - 82, [['arrow', C.red, '中共勢力擴張方向'], ['arrow', C.blue, '蘇聯進攻方向'], ['dash', C.purple, '中華民國政府遷移']], { w: 160, size: 12 });
  return done(m, s);
});

fig('u10-s4', '冷戰時期的韓戰與越戰：南北分裂', () => {
  const a = geomap({ bbox: [124, 33, 131, 43.2], w: 330, res: '50m' });
  const b = geomap({ bbox: [101, 8, 110, 23.5], w: 330, res: '50m' });
  let s1 = a.base() + a.country(['North Korea'], { fill: C.redS }) + a.country(['South Korea'], { fill: C.blueS });
  s1 += a.lines([[124.5, 38], [129.5, 38]], { stroke: C.ink, sw: 1.5, dash: '6 4' }) + T(...a.p([129.6, 38]).map((v, i) => v + [0, -10][i]), '北緯 38 度線', { size: 11, anchor: 'end' });
  s1 += a.lines([[126.1, 37.75], [126.7, 37.95], [127.3, 38.3], [128.0, 38.3], [128.4, 38.6]], { stroke: C.red, sw: 2.5 });
  s1 += a.label([127, 40.5], '北韓', { size: 18, weight: 700, fill: C.red }) + a.label([127.6, 36], '南韓', { size: 18, weight: 700, fill: C.blue });
  s1 += note(8, a.h - 118, '北韓盟友：蘇聯、中國\n南韓盟友：美國、聯合國部隊\n1950 韓戰爆發\n1953 停戰（紅線為停戰線）', { size: 11 });
  let s2 = b.base() + b.onLand(b.poly([[100, 17], [112, 17], [112, 24], [100, 24]], { fill: C.redS, op: .9 }) + b.poly([[100, 8], [112, 8], [112, 17], [100, 17]], { fill: C.blueS, op: .9 })) + b.country(['Laos', 'Cambodia', 'Thailand', 'China'], { fill: C.land }) + b.lines([[105.5, 17], [108, 17]], { stroke: C.ink, sw: 2, dash: '6 4' }) + T(...b.p([105.3, 17]), '北緯 17 度線', { size: 11, anchor: 'end' });
  s2 += b.label([104.8, 21.2], '北越', { size: 18, weight: 700, fill: C.red }) + b.label([107, 13], '南越', { size: 18, weight: 700, fill: C.blue });
  s2 += note(b.w - 175, b.h - 100, '北越盟友：蘇聯、中國\n南越盟友：美國\n1954 日內瓦協議南北分治\n1975 北越統一越南', { size: 11 });
  return svg(a.w * 2 + 10, Math.max(a.h, b.h), G(s1 + a.frame() + badge(8, 8, '韓戰', C.ink)) + G(s2 + b.frame() + badge(8, 8, '越戰', C.ink), `translate(${a.w + 10} 0)`));
});

fig('u10-s6', '東南亞國家協會（東協）的成員國', () => {
  const m = geomap({ bbox: [90, -12, 142, 30], w: 640, res: '50m' });
  let s = m.base();
  s += m.country(['Indonesia', 'Malaysia', 'Philippines', 'Singapore', 'Thailand'], { fill: '#f6c08a' });
  s += m.country(['Brunei', 'Vietnam', 'Laos', 'Myanmar', 'Cambodia'], { fill: '#f9e3b5' }) + m.country(['Timor-Leste'], { fill: '#e7d3f2' });
  const lb = [['泰國', [100.8, 15.5]], ['緬甸', [96, 21]], ['寮國', [102.6, 19.5]], ['越南', [107.8, 14.5]], ['柬埔寨', [104.9, 12.5]], ['馬來西亞', [102, 4.5]], ['新加坡', [103.8, 1.3]], ['汶萊', [114.7, 4.5]], ['菲律賓', [122.5, 12]], ['印尼', [114, -2]], ['東帝汶', [125.8, -8.8]]];
  for (const [n, ll] of lb) s += m.label(ll, n, { size: 12, weight: 700 });
  s += m.label([112, 25], '中國', { size: 13, fill: C.muted }) + m.label([133, 0], '太平洋', { size: 13, fill: C.blue, italic: true });
  s += legend(10, m.h - 82, [['box', '#f6c08a', '1967 年創始會員國'], ['box', '#f9e3b5', '1984～1999 年加入'], ['box', '#e7d3f2', '2025 年加入（東帝汶）']], { w: 180, size: 12 });
  s += note(m.w - 180, 10, '東協＋3：中國、日本、南韓\n促進區域經濟合作', { size: 12 });
  return done(m, s);
});

// ---------- 世界史 ----------
const W = { 羅馬: [12.5, 41.9], 君士坦丁堡: [28.98, 41.01], 迦太基: [10.3, 36.85], 巴比倫: [44.42, 32.54], 巴格達: [44.4, 33.3], 麥加: [39.83, 21.42], 麥地那: [39.6, 24.47],
  大馬士革: [36.3, 33.5], 怛羅斯: [71.3, 42.5], 柏林: [13.4, 52.52], 巴黎: [2.35, 48.86], 倫敦: [-0.13, 51.5], 里斯本: [-9.14, 38.72], 凡爾賽: [2.12, 48.8] };
const EUR = { bbox: [-11, 34, 45, 62], w: 700, res: '110m' };

fig('u11-s1', '西亞古文明：肥沃月彎', () => {
  const m = geomap({ bbox: [24, 22, 62, 42], w: 640, res: '50m', borders: false });
  let s = m.base();
  const crescent = [[35.0, 31.0], [34.6, 33.5], [36.2, 36.0], [38.0, 37.2], [40.5, 37.5], [43.5, 37.0], [45.5, 34.5], [47.5, 31.5], [48.5, 30.0], [47.0, 30.5], [45.0, 31.5], [43.5, 32.8], [41.5, 34.0], [39.5, 35.0], [37.8, 35.3], [36.6, 34.0], [35.8, 32.0], [35.5, 30.8]];
  s += m.onLand(m.region(crescent, { fill: '#7fbf6a', op: .55 }));
  const river = l => m.route(l, { stroke: '#4f94cf', sw: 2.2, arrow: false, curve: true });
  s += river([[38.5, 39.5], [38.8, 37.5], [38.2, 36], [40.1, 35], [41.4, 34.4], [43.3, 33.4], [44.4, 32.5], [45.5, 31.4], [46.8, 31], [47.6, 30.6], [48.4, 30]]);
  s += river([[40.5, 38.2], [42.0, 37.2], [43.1, 36.3], [43.6, 34.9], [44.4, 33.3], [45.6, 32.5], [46.9, 31.3], [47.6, 30.6]]);
  s += river([[31.3, 30.4], [31.0, 28], [30.9, 26.5], [32.6, 25.7], [32.9, 24.1], [31.5, 22]]);
  s += m.label([40.3, 33.2], '幼發拉底河', { size: 11, fill: C.blue, rotate: -30 }) + m.label([42.6, 35.6], '底格里斯河', { size: 11, fill: C.blue, rotate: -55 }) + m.label([32.3, 27.5], '尼羅河', { size: 11, fill: C.blue });
  s += m.dot(W.巴比倫, '巴比倫人', { fill: C.purple, color: '#fff', weight: 700, dx: 8 }).replace(/(<text[^>]*?)fill="#fff"/, '$1fill="#5b3e99"');
  s += m.label([46.6, 30.2], '蘇美人', { size: 14, weight: 700, fill: C.purple }) + m.label([34.4, 31.3], '希伯來人', { size: 13, weight: 700, fill: C.purple, anchor: 'end' }) + m.label([34.9, 34.4], '腓尼基人', { size: 13, weight: 700, fill: C.purple, anchor: 'end' });
  s += m.label([54, 30], '波斯人', { size: 14, weight: 700, fill: C.purple }) + m.label([29, 26.5], '埃及', { size: 14, weight: 700 });
  s += m.label([31.5, 39.2], '小亞細亞', { size: 14 }) + m.label([55.5, 34], '伊朗高原', { size: 14 }) + m.label([44, 25], '阿拉伯半島', { size: 14 }) + m.label([29, 34], '地中海', { size: 13, fill: C.blue, italic: true });
  s += legend(10, m.h - 40, [['box', '#a9d498', '肥沃月彎']], { w: 110, size: 12 });
  return done(m, s);
});

fig('u11-s4', '亞歷山大東征與帝國範圍', () => {
  const m = geomap({ bbox: [12, 20, 80, 46], w: 820, res: '110m', borders: false });
  let s = m.base();
  const emp = [[20, 41], [26, 42], [30, 41.5], [36, 41.5], [42, 41], [48, 42], [55, 40], [60, 42], [68, 41.5], [72, 38], [75, 34], [73, 29], [66, 25], [60, 25.5], [56, 26], [50, 29], [48, 30], [44, 29], [38, 28], [34, 24], [30, 24], [25, 30], [29, 31.5], [34, 31.5], [35, 36], [30, 36], [26, 37], [22, 37.5], [20, 39]];
  s += m.onLand(m.region(emp, { fill: '#fde6b8', op: .85 })) + m.region(emp, { fill: 'none', stroke: C.orange, sw: 1.5, dash: '5 4' });
  s += m.route([[22.5, 40.75], [26.5, 40.1], [30, 38.5], [36.2, 36.8], [35.2, 33.3], [31.25, 29.85], [29.9, 31.2], [34, 31], [40, 34.5], [43.5, 36.4], [44.4, 32.5], [48.25, 32.2], [52.9, 29.9], [48.5, 34.8], [55, 36.5], [62, 36], [67, 36.7], [66.96, 39.65], [69, 35], [73.3, 32.8]], { stroke: C.red, sw: 3, curve: true });
  s += m.route([[73.3, 32.8], [69, 27], [62, 25.6], [57, 27.5], [52.9, 29.9], [48, 31.5], [44.6, 32.6]], { stroke: C.red, sw: 2.5, curve: true, dash: '6 4' });
  for (const [n, ll, dx] of [['馬其頓', [22.5, 40.75], -8], ['亞歷山大港', [29.9, 31.2], -8], ['巴比倫（西元前 323 年逝世）', W.巴比倫, 8], ['波斯波利斯', [52.9, 29.9], 8], ['撒馬爾罕', [66.96, 39.65], 8]]) s += m.dot(ll, n, { size: 12, weight: 700, dx });
  s += m.label([74, 31], '印度河流域', { size: 13 }) + m.label([20, 34.5], '地中海', { size: 13, fill: C.blue, italic: true }) + m.label([28, 26], '埃及', { size: 13 }) + m.label([56, 33], '波斯', { size: 15, weight: 700 });
  s += legend(10, m.h - 82, [['arrow', C.red, '東征路線（西元前 334 年起）'], ['dash', C.red, '回程路線'], ['box', '#fde6b8', '亞歷山大帝國範圍']], { w: 215, size: 12 });
  s += note(m.w - 255, 10, '推廣希臘文化，與東方文化融合\n形成「希臘化文化」\n死後帝國分裂（如埃及托勒密王朝）', { size: 12 });
  return done(m, s);
});

fig('u11-s5', '羅馬帝國的版圖與東西分裂', () => {
  const m = geomap({ bbox: [-12, 22, 50, 58], w: 780, res: '110m', borders: false });
  let s = m.base();
  const emp = [[-9.5, 37], [-9.5, 43.5], [-4.5, 48.5], [-5.5, 50], [-4, 53], [-3, 55.5], [2, 55.5], [1.5, 51], [4, 51.5], [6.5, 51.5], [7.5, 50], [8.5, 48.2], [13, 48.5], [17, 48.2], [20, 46], [22, 48], [26, 48], [29, 45.5], [33, 46], [37, 45.5], [41, 43.5], [44, 41], [46, 40], [45.5, 37.5], [48, 30], [45, 30], [40, 32], [36, 30], [35, 28], [33, 23], [30, 24], [25, 31], [20, 31], [15, 32], [10, 33.5], [8, 36], [2, 35.5], [-2, 35], [-6, 35]];
  s += m.onLand(m.region(emp, { fill: '#f8d6c0', op: .85 }));
  s += m.route([[17.5, 47], [19, 44], [19.5, 41], [20.5, 36], [22.5, 31]], { stroke: C.purple, sw: 3, arrow: false, dash: '8 5', curve: true });
  s += m.dot(W.羅馬, '羅馬', { mark: 'cap', weight: 700, dx: -8 }) + m.dot(W.君士坦丁堡, '君士坦丁堡（拜占庭）', { mark: 'cap', weight: 700, dx: 8 }) + m.dot(W.迦太基, '迦太基', { weight: 700, dx: -8 });
  s += m.label([2, 44], '西羅馬帝國', { size: 16, weight: 700, fill: C.red }) + m.label([33, 38.6], '東羅馬帝國', { size: 16, weight: 700, fill: C.red });
  s += m.label([12, 53], '日耳曼民族', { size: 15, weight: 700, fill: C.brown }) + m.label([16, 35.5], '地中海', { size: 14, fill: C.blue, italic: true });
  s += m.label([21, 33], '395 年分裂', { size: 13, weight: 700, fill: C.purple });
  s += legend(10, m.h - 64, [['box', '#f8d6c0', '帝國最大版圖（約 2 世紀）'], ['dash', C.purple, '東西羅馬分界']], { w: 205, size: 12 });
  s += note(m.w - 245, m.h - 70, '地中海成為羅馬的內海\n西羅馬：476 年亡於日耳曼人\n東羅馬：1453 年亡於鄂圖曼土耳其', { size: 12 });
  return done(m, s);
});

fig('u11-s8', '伊斯蘭教的擴張：8 世紀阿拉伯帝國的範圍', () => {
  const m = geomap({ bbox: [-12, 8, 80, 48], w: 820, res: '110m', borders: false });
  let s = m.base();
  const emp = [[-9, 37], [-9, 42.5], [-2, 43], [3, 42.5], [3, 40], [-1, 36], [10, 37], [11, 33], [20, 31], [25, 31.5], [30, 31.5], [33, 31], [35, 36.5], [36.5, 37], [40, 37.5], [44, 39.5], [47, 41.5], [50, 40], [55, 38], [58, 40], [62, 42], [67, 42.5], [71.5, 42.8], [72, 38], [72, 35], [71, 30], [68, 24], [62, 25], [57, 26], [56, 24], [59, 22], [55, 17], [45, 12.5], [43, 13], [38, 22], [35, 27], [33, 27], [33, 22], [25, 22], [17, 25], [10, 25], [0, 28], [-10, 28], [-9, 32]];
  s += m.onLand(m.region(emp, { fill: '#fde6b8', op: .85 }));
  s += m.onLand(m.region([[20, 42], [28, 42.5], [36, 41.5], [40, 40.5], [36, 37.2], [30, 36.5], [26, 37.5], [22, 37]], { fill: '#e3d6f2', op: .85 }));
  s += AQ(...m.p(W.麥地那), ...m.p([20, 30]), ...m.p([-5, 36]), { stroke: C.red, sw: 3 });
  s += AQ(...m.p(W.麥地那), ...m.p([40, 30]), ...m.p([38, 36]), { stroke: C.red, sw: 3 });
  s += AQ(...m.p(W.麥地那), ...m.p([55, 28]), ...m.p([70, 40]), { stroke: C.red, sw: 3 });
  for (const [n, ll, dx] of [['麥加', W.麥加, 8], ['麥地那', W.麥地那, 8], ['大馬士革', W.大馬士革, -8], ['巴格達', W.巴格達, 8], ['怛羅斯', W.怛羅斯, 8]]) s += m.dot(ll, n, { size: 12, weight: 700, dx });
  s += m.dot(W.君士坦丁堡, '君士坦丁堡', { mark: 'cap', size: 12, dx: 8 }) + m.label([31, 39.3], '拜占庭帝國', { size: 14, weight: 700, fill: C.purple });
  s += m.label([49, 20], '阿拉伯半島', { size: 14 }) + m.label([5, 15], '非洲', { size: 14 }) + m.label([-4, 40], '伊比利半島', { size: 12 });
  s += legend(10, m.h - 82, [['box', '#fde6b8', '8 世紀阿拉伯帝國範圍'], ['box', '#e3d6f2', '拜占庭帝國'], ['arrow', C.red, '伊斯蘭擴張方向']], { w: 185, size: 12 });
  s += note(m.w - 240, m.h - 70, '622 年穆罕默德由麥加遷往麥地那\n（聖遷，伊斯蘭曆元年）\n751 年怛羅斯之役勝唐軍', { size: 12 });
  return done(m, s);
});

fig('u12-s2', '16 世紀宗教改革後歐洲的宗教分布（示意）', () => {
  const m = geomap({ bbox: [-11, 35, 34, 64], w: 640, res: '110m' });
  const CAT = '#f6e3a3', LUT = '#b9d7f0', CAL = '#c9e6b8', ANG = '#f2b9c4', ORT = '#e3d6f2';
  let s = m.base();
  s += m.country(['France', 'Spain', 'Portugal', 'Italy', 'Ireland', 'Belgium', 'Austria', 'Poland', 'Lithuania', 'Czechia', 'Slovakia', 'Hungary', 'Croatia', 'Slovenia', 'Germany', 'Luxembourg'], { fill: CAT });
  s += m.country(['Denmark', 'Norway', 'Sweden', 'Finland', 'Estonia', 'Latvia'], { fill: LUT }) + m.onLand(m.poly([[6, 54.8], [14.5, 54.8], [15, 51], [12, 50.3], [8, 50.5], [6, 52]], { fill: LUT }));
  s += m.country(['Netherlands', 'Switzerland'], { fill: CAL }) + m.country(['United Kingdom'], { fill: ANG }) + m.onLand(m.poly([[-7.5, 55.1], [-1.8, 55.7], [-1.5, 59], [-7.5, 59]], { fill: CAL }));
  s += m.country(['Russia', 'Ukraine', 'Belarus', 'Romania', 'Bulgaria', 'Serbia', 'Greece', 'Moldova', 'Macedonia', 'Montenegro'], { fill: ORT });
  s += m.dot([12.65, 51.87], '威登堡：1517 路德', { size: 12, weight: 700, dx: 8 }) + m.dot([6.14, 46.2], '日內瓦：喀爾文', { size: 12, weight: 700, dx: -8 });
  s += m.dot(W.倫敦, '倫敦：1534 亨利八世', { size: 12, weight: 700, dx: -8 }) + m.dot(W.羅馬, '羅馬（教廷）', { size: 12, weight: 700, dx: 8 }) + m.dot([11.12, 46.07], '特倫特會議', { size: 11, dx: 8 });
  s += legend(10, 10, [['box', CAT, '天主教'], ['box', LUT, '路德教派'], ['box', CAL, '喀爾文教派'], ['box', ANG, '英國國教'], ['box', ORT, '東正教']], { w: 120, size: 12 });
  return done(m, s);
});

fig('u12-s3', '大航海時代的重要航線', () => {
  const m = geomap({ bbox: [-160, -58, 199.9, 66], w: 860, res: '110m', proj: 'equirect', rotate: [-20, 0], borders: false });
  let s = m.base();
  const ARR = (a, b, c) => A([m.p(a), m.p(b)], { stroke: c, sw: 2.5 });
  const dias = [W.里斯本, [-17, 14], [8, 3], [12, -15], [18.4, -34.6], [26, -33.9]];
  s += m.lines(dias, { stroke: C.green, sw: 2.5 }) + ARR([24, -34.2], [26.5, -33.7], C.green);
  const col = [[-6.9, 37.2], [-15.5, 28], [-50, 25], [-74.5, 24.1]];
  s += m.lines(col, { stroke: C.purple, sw: 2.5 }) + ARR([-70, 24.5], [-74.5, 24.1], C.purple);
  const gama = [W.里斯本, [-25, 10], [-22, -20], [10, -36], [20, -36], [35, -25], [40.1, -3.2], [60, 7], [75.78, 11.25]];
  s += m.lines(gama, { stroke: C.blue, sw: 2.5 }) + ARR([70, 10], [75.78, 11.25], C.blue);
  const mag = [[-6, 37.4], [-30, 0], [-45, -25], [-68, -52.5], [-76, -50], [-100, -30], [-140, -10], [-175, 5], [175, 10], [145, 13], [123.9, 10.3], [115, -5], [100, -12], [70, -25], [35, -38], [18.5, -35], [5, -20], [-15, 5], [-12, 28], [-6, 37.4]];
  s += m.lines(mag, { stroke: C.orange, sw: 2.5, dash: '6 4' }) + ARR([-120, -20], [-140, -10], C.orange) + ARR([60, -28], [50, -32], C.orange);
  for (const [n, ll, dx] of [['里斯本', W.里斯本, -8], ['好望角', [18.4, -34.4], 8], ['古里（印度）', [75.78, 11.25], 8], ['巴哈馬群島', [-74.5, 24.1], -8], ['麥哲倫海峽', [-70, -53], 8], ['菲律賓', [123.9, 10.3], 8]]) s += m.dot(ll, n, { size: 12, weight: 700, dx });
  s += legend(10, m.h - 104, [['line', C.green, '迪亞士（1488 抵達好望角）'], ['line', C.purple, '哥倫布（1492 抵達美洲）'], ['line', C.blue, '達伽馬（1498 抵達印度）'], ['dash', C.orange, '麥哲倫船隊（1519～1522 環球）']], { w: 245, size: 12 });
  s += note(m.w - 250, 10, '麥哲倫 1521 年死於菲律賓\n船隊於 1522 年返回西班牙\n證明地圓說', { size: 12 });
  return done(m, s);
});

fig('u13-s4', '德意志與義大利的統一', () => {
  const a = geomap({ bbox: [1.5, 46, 24, 56], w: 420, res: '50m' });
  const b = geomap({ bbox: [6, 36, 19.5, 47.5], w: 340, res: '50m' });
  let s1 = a.base() + a.country(['Germany'], { fill: '#c9d9f0' }) + a.onLand(a.poly([[14.2, 54.5], [19.5, 54.6], [22.8, 54.4], [18.2, 52.3], [18.8, 50.1], [16, 50.3], [14.5, 51]], { fill: '#c9d9f0' }));
  s1 += num(a, [9.5, 54.5], '1', C.blue) + T(...a.p([10.5, 55.4]), '1864 丹麥戰爭', { size: 11, weight: 700, halo: true, anchor: 'start' });
  s1 += num(a, [15.83, 50.21], '2', C.blue) + T(...a.p([16.5, 49.3]), '1866 普奧戰爭', { size: 11, weight: 700, halo: true, anchor: 'start' });
  s1 += num(a, [4.94, 49.7], '3', C.blue) + T(...a.p([2, 50.6]), '1870 普法戰爭', { size: 11, weight: 700, halo: true, anchor: 'start' });
  s1 += a.dot(W.凡爾賽, '', { mark: 'star' }) + T(...a.p([2.2, 47.3]), '1871 於凡爾賽宮\n成立德意志帝國', { size: 11, weight: 700, halo: true, anchor: 'start' });
  s1 += a.dot(W.柏林, '柏林', { mark: 'cap', weight: 700, dx: 8 }) + note(a.w - 160, a.h - 60, '普魯士首相俾斯麥\n推行「鐵血政策」', { size: 11 });
  let s2 = b.base() + b.country(['Italy'], { fill: '#f9dfc4' });
  s2 += b.route([[8.93, 44.4], [10.5, 40], [12.44, 37.8]], { stroke: C.red, sw: 2.5, curve: true }) + b.route([[12.44, 37.8], [15.5, 38.3], [14.27, 40.85]], { stroke: C.red, sw: 2.5, curve: true });
  s2 += num(b, [9.19, 45.46], '1', C.orange) + T(...b.p([6.3, 46.9]), '1859 取得倫巴底', { size: 11, weight: 700, halo: true, anchor: 'start' });
  s2 += num(b, [14.27, 40.85], '2', C.orange) + T(...b.p([14.9, 41.5]), '1860 加里波底\n征服兩西西里', { size: 11, weight: 700, halo: true, anchor: 'start' });
  s2 += num(b, [12.33, 45.44], '3', C.orange) + T(...b.p([13.3, 46.2]), '1866 取得威尼西亞', { size: 11, weight: 700, halo: true, anchor: 'start' });
  s2 += num(b, W.羅馬, '4', C.orange) + T(...b.p([7, 41.9]), '1870 收復羅馬\n（1871 定都）', { size: 11, weight: 700, halo: true, anchor: 'start' });
  s2 += b.dot([7.69, 45.07], '杜林（薩丁尼亞王國）', { mark: 'cap', size: 11, dx: 0, dy: 0 }).replace(/<text x="([\d.]+)" y="([\d.]+)"/, (a, x, y) => `<text x="${x}" y="${+y + 16}"`);
  const H = Math.max(a.h, b.h);
  return svg(a.w + b.w + 10, H, G(s1 + a.frame() + badge(8, 8, '德意志', C.blue)) + G(s2 + b.frame() + badge(b.w - 70, b.h - 34, '義大利', C.orange), `translate(${a.w + 10} 0)`));
});

fig('u13-s5', '帝國主義：約 1914 年列強在亞洲、非洲的殖民地', () => {
  const m = geomap({ bbox: [-20, -36, 150, 40], w: 860, res: '110m', proj: 'equirect' });
  const K = { 英國: '#f2a5a5', 法國: '#9cc3ec', 德國: '#c9c9c9', 比利時: '#f6d27a', 葡萄牙: '#a9d498', 義大利: '#d7b4e8', 西班牙: '#f7c59f', 荷蘭: '#f4a259', 美國: '#7fc8c0', 獨立: '#fffdf8' };
  let s = m.base();
  const set = (names, k) => m.country(names, { fill: K[k], stroke: '#fff', sw: .6 });
  s += set(['Egypt', 'Sudan', 'S. Sudan', 'Uganda', 'Kenya', 'Nigeria', 'Ghana', 'Sierra Leone', 'Gambia', 'South Africa', 'Botswana', 'Zimbabwe', 'Zambia', 'Malawi', 'Lesotho', 'eSwatini', 'Somaliland', 'India', 'Pakistan', 'Bangladesh', 'Myanmar', 'Sri Lanka', 'Malaysia', 'Brunei'], '英國');
  s += set(['Morocco', 'Algeria', 'Tunisia', 'Mauritania', 'Senegal', 'Mali', 'Guinea', "Côte d'Ivoire", 'Burkina Faso', 'Niger', 'Benin', 'Chad', 'Central African Rep.', 'Congo', 'Gabon', 'Madagascar', 'Djibouti', 'Vietnam', 'Laos', 'Cambodia'], '法國');
  s += set(['Tanzania', 'Rwanda', 'Burundi', 'Namibia', 'Cameroon', 'Togo'], '德國') + set(['Dem. Rep. Congo'], '比利時') + set(['Angola', 'Mozambique', 'Guinea-Bissau', 'Timor-Leste'], '葡萄牙');
  s += set(['Libya', 'Eritrea', 'Somalia'], '義大利') + set(['W. Sahara', 'Eq. Guinea'], '西班牙') + set(['Indonesia'], '荷蘭') + set(['Philippines'], '美國');
  s += m.label([39, 8.8], '衣索比亞（獨立）', { size: 11, weight: 700 }) + m.label([-9.5, 6.5], '賴比瑞亞', { size: 10, weight: 700 }) + m.label([101, 15.5], '暹羅', { size: 11, weight: 700 });
  s += m.label([105, 33], '中國（列強劃分勢力範圍）', { size: 12, weight: 700 }) + m.label([138, 37], '日本', { size: 12, weight: 700 });
  s += m.route([[31, 30.5], [33, 10], [32, -10], [24, -30]], { stroke: C.red, sw: 2.5, curve: true, dash: '6 4', arrow: false }) + m.label([40.5, -14], '英國縱貫政策\n（開羅—開普敦）', { size: 11, weight: 700, fill: C.red });
  s += m.route([[-15, 14.5], [10, 12], [43, 11.6]], { stroke: C.blue, sw: 2.5, curve: true, dash: '6 4', arrow: false }) + m.label([15, 18], '法國橫貫政策', { size: 11, weight: 700, fill: C.blue });
  s += legend(m.w - 135, m.h - 228, Object.entries(K).filter(([k]) => k !== '獨立').map(([k, c]) => ['box', c, k]), { w: 125, size: 12, gap: 21 });
  s += note(10, m.h - 50, '1884～1885 柏林會議後，列強瓜分非洲', { size: 12 });
  return done(m, s);
});

fig('u13-s6', '第一次世界大戰歐洲形勢', () => {
  const m = geomap(EUR);
  const AL = '#c9dcf2', CE = '#f2b9b0', NE = '#ece8dd';
  let s = m.base();
  s += m.country(['France', 'United Kingdom', 'Ireland', 'Russia', 'Ukraine', 'Belarus', 'Lithuania', 'Latvia', 'Estonia', 'Finland', 'Moldova', 'Italy', 'Serbia', 'Montenegro', 'Kosovo', 'Macedonia', 'Belgium', 'Romania', 'Greece', 'Portugal'], { fill: AL });
  s += m.country(['Germany', 'Austria', 'Hungary', 'Czechia', 'Slovakia', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Turkey', 'Bulgaria'], { fill: CE }) + m.label([19.5, 52], '波蘭（分屬德、奧、俄）', { size: 11 });
  s += m.country(['Spain', 'Switzerland', 'Netherlands', 'Denmark', 'Norway', 'Sweden'], { fill: NE });
  s += m.route([[2.6, 51.1], [2.9, 50.2], [3.5, 49.6], [4.9, 49.4], [5.5, 49.1], [6.5, 48.4], [7.1, 47.6]], { stroke: C.ink, sw: 3, arrow: false, dash: '4 3' });
  s += m.route([[21.5, 57], [24, 54.5], [25.5, 52], [24.5, 50], [26, 48.2], [27, 47]], { stroke: C.ink, sw: 3, arrow: false, dash: '4 3' });
  s += m.dot([18.41, 43.86], '塞拉耶佛（1914 導火線）', { mark: 'star', weight: 700, dx: 10 });
  s += m.label([-2, 49.5], '西線：壕溝戰', { size: 13, weight: 700 }) + m.label([31, 55], '東線', { size: 13, weight: 700 });
  for (const [n, ll] of [['德意志帝國', [10.5, 51.2]], ['奧匈帝國', [17, 47.7]], ['鄂圖曼帝國', [34, 39]], ['俄國', [38, 56]], ['法國', [2.5, 46.5]], ['英國', [-1.8, 53]], ['義大利', [12.5, 42.8]], ['保加利亞', [25.2, 42.7]]]) s += m.label(ll, n, { size: 13, weight: 700 });
  s += legend(10, 10, [['box', AL, '協約國'], ['box', CE, '同盟國'], ['box', NE, '中立國'], ['dash', C.ink, '主要戰線']], { w: 115, size: 12 });
  s += note(m.w - 225, m.h - 70, '1917 美國參戰（德國無限制潛艇）\n1917 俄國革命，退出大戰\n1918 同盟國戰敗', { size: 12 });
  return done(m, s);
});

fig('u13-s7', '第一次世界大戰後的歐洲：民族自決與新興國家', () => {
  const m = geomap(EUR);
  const NEW = '#f6d27a';
  let s = m.base();
  s += m.country(['Finland', 'Estonia', 'Latvia', 'Lithuania', 'Poland', 'Czechia', 'Slovakia', 'Austria', 'Hungary', 'Slovenia', 'Croatia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Kosovo', 'Macedonia'], { fill: NEW });
  s += m.country(['Russia', 'Ukraine', 'Belarus', 'Moldova'], { fill: '#f2b9b0' }) + m.country(['Germany'], { fill: '#c9d9f0' }) + m.country(['Turkey'], { fill: '#e3d6f2' });
  for (const [n, ll] of [['芬蘭', [26, 63]], ['愛沙尼亞', [25.5, 58.7]], ['拉脫維亞', [25, 56.9]], ['立陶宛', [23.8, 55.3]], ['波蘭', [19.5, 52]], ['捷克斯洛伐克', [17, 49.4]], ['奧地利', [14, 47.4]], ['匈牙利', [19.3, 47]], ['南斯拉夫', [19, 44.2]], ['德國（威瑪共和）', [10, 51.2]], ['蘇聯', [38, 55]], ['土耳其', [34, 39]]]) s += m.label(ll, n, { size: 12, weight: 700 });
  s += m.dot(W.凡爾賽, '巴黎和會（凡爾賽條約）', { mark: 'star', size: 12, weight: 700, dx: -10 });
  s += legend(10, 10, [['box', NEW, '新興國家']], { w: 110, size: 12 });
  s += note(m.w - 245, m.h - 70, '德意志、奧匈、鄂圖曼、俄羅斯\n四大帝國瓦解\n依威爾遜「民族自決」原則建國', { size: 12 });
  return done(m, s);
});

fig('u14-s5', '第二次世界大戰後期盟軍的反攻', () => {
  const m = geomap({ bbox: [-20, -12, 199.9, 64], w: 860, res: '110m', proj: 'equirect', rotate: [-90, 0], borders: false });
  let s = m.base();
  const ARR = (pts, c) => m.route(pts, { stroke: c, sw: 3, curve: true });
  s += ARR([[44.5, 48.7], [35, 50], [25, 52], [13.4, 52.5]], C.red) + ARR([[-0.6, 49.3], [5, 50], [12, 52]], C.blue) + ARR([[14, 37.5], [14.5, 41], [11.5, 44]], C.blue);
  s += ARR([[-177.4, 28.2], [165, 12], [145, 15], [125, 12]], C.blue) + ARR([[125, 12], [127.8, 26.3], [132, 33]], C.blue);
  const ev = [[[44.5, 48.7], '1', '1942～43 史達林格勒戰役', [42, 44.5]], [[14, 37.5], '2', '1943.7 盟軍登陸西西里\n1943.9 義大利投降', [6, 33]], [[-0.6, 49.3], '3', '1944.6 諾曼第登陸', [-19, 44]], [W.柏林, '4', '1945.5 德國投降', [5, 58]],
    [[-177.4, 28.2], '5', '1942.6 中途島戰役', [160, 33]], [CN.廣島, '6', '1945.8 原子彈轟炸廣島、長崎\n日本投降', [140, 42]]];
  for (const [ll, k, t, at] of ev) s += num(m, ll, k) + T(...m.p(at), t, { size: 12, weight: 700, halo: true, anchor: 'start' });
  s += legend(10, m.h - 64, [['arrow', C.blue, '英美等盟軍反攻'], ['arrow', C.red, '蘇聯反攻']], { w: 150, size: 12 });
  return done(m, s);
});

fig('u14-s6', '冷戰時期的兩大陣營（約 1950～1960 年代）', () => {
  const m = geomap({ bbox: [-169.9, -45, 189.9, 75], w: 860, res: '110m', proj: 'equirect', rotate: [-10, 0] });
  const NATO = '#9cc3ec', US = '#cfe2f6', WP = '#f2a5a5', SOV = '#f9d3d3';
  let s = m.base();
  s += m.country(['United States of America', 'Canada', 'United Kingdom', 'France', 'Belgium', 'Netherlands', 'Luxembourg', 'Denmark', 'Norway', 'Iceland', 'Italy', 'Portugal', 'Greece', 'Turkey', 'Germany'], { fill: NATO });
  s += m.country(['Japan', 'South Korea', 'Taiwan', 'Philippines', 'Australia', 'New Zealand', 'Thailand', 'Pakistan'], { fill: US });
  s += m.country(['Russia', 'Ukraine', 'Belarus', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Georgia', 'Armenia', 'Azerbaijan', 'Moldova', 'Lithuania', 'Latvia', 'Estonia', 'Poland', 'Czechia', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria', 'Albania'], { fill: WP });
  s += m.country(['China', 'North Korea', 'Vietnam', 'Mongolia', 'Cuba'], { fill: SOV });
  s += m.lines([[176, 52], [150, 46], [141, 38], [129, 33], [124.5, 27], [122, 21.5], [121, 13], [118, 7]], { stroke: C.blue, sw: 2.5, dash: '6 4' }) + m.label([150, 30], '美國圍堵防線', { size: 12, weight: 700, fill: C.blue });
  s += m.dot([-79.5, 21.8], '古巴（1962 飛彈危機）', { mark: 'star', size: 12, weight: 700, dx: 10 }) + m.dot(W.柏林, '柏林圍牆（1961）', { mark: 'star', size: 12, weight: 700, dx: -10 });
  s += m.label([85, 62], '蘇聯', { size: 15, weight: 700 }) + m.label([-100, 40], '美國', { size: 15, weight: 700 }) + m.label([104, 34], '中華人民共和國', { size: 12, weight: 700 });
  s += legend(10, m.h - 104, [['box', NATO, '北大西洋公約組織'], ['box', US, '美國盟邦'], ['box', WP, '華沙公約組織'], ['box', SOV, '蘇聯盟邦']], { w: 160, size: 12 });
  return done(m, s);
});

export default F;
