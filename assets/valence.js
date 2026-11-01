// 理化「價數表」總整理頁。主表出處：翰林 p.99（單元 6）；第 4 欄＝表外補充，取自哪個單元筆記
(function () {
  const { esc } = J;
  const VAL = [
    ['＋1 價', [['氫離子', 'H', '+'], ['鋰離子', 'Li', '+'], ['鈉離子', 'Na', '+'], ['鉀離子', 'K', '+'], ['銀離子', 'Ag', '+']], [['銨根', 'NH4', '+']]],
    ['＋2 價', [['鎂離子', 'Mg', '2+'], ['鈣離子', 'Ca', '2+'], ['鋇離子', 'Ba', '2+'], ['鋅離子', 'Zn', '2+'], ['銅離子', 'Cu', '2+']], []],
    ['＋3 價', [['鋁離子', 'Al', '3+'], ['鐵離子', 'Fe', '3+']], []],
    ['－1 價', [['氟離子', 'F', '-'], ['氯離子', 'Cl', '-'], ['溴離子', 'Br', '-'], ['碘離子', 'I', '-']], [['氫氧根', 'OH', '-'], ['硝酸根', 'NO3', '-'], ['醋酸根', 'CH3COO', '-'], ['碳酸氫根', 'HCO3', '-', 8]]],
    ['－2 價', [['氧離子', 'O', '2-'], ['硫離子', 'S', '2-']], [['碳酸根', 'CO3', '2-'], ['硫酸根', 'SO4', '2-'], ['鉻酸根', 'CrO4', '2-'], ['二鉻酸根', 'Cr2O7', '2-', 9]]],
  ];
  // [名稱, 陽離子, 陰離子, 化學式, 說明]
  const VALEX = [
    ['氯化鈣', 'Ca|2+', 'Cl|-', 'CaCl2', '＋2＝2×（－1），Cl 要 2 個'],
    ['氧化鎂', 'Mg|2+', 'O|2-', 'MgO', '2 和 2 交叉得 Mg₂O₂，要約成最簡'],
    ['氧化鋁', 'Al|3+', 'O|2-', 'Al2O3', '2×（＋3）＝3×（－2）＝6'],
    ['碳酸鈉', 'Na|+', 'CO3|2-', 'Na2CO3', 'Na 要 2 個；原子團只有 1 個不用括號'],
    ['氫氧化鈣', 'Ca|2+', 'OH|-', 'Ca(OH)2', '原子團超過 1 個要加括號'],
    ['硫酸銨', 'NH4|+', 'SO4|2-', '(NH4)2SO4', '銨根是正價原子團，寫在前面'],
    ['硝酸銀', 'Ag|+', 'NO3|-', 'AgNO3', '＋1 和 －1，各 1 個'],
    ['硫酸鐵', 'Fe|3+', 'SO4|2-', 'Fe2(SO4)3', '2×（＋3）＝3×（－2）'],
  ];
  const chem = s => esc(s).replace(/(\d+)/g, '<sub>$1</sub>');
  const ion = (sym, q) => `${chem(sym)}<sup>${q.replace('-', '−')}</sup>`;
  const ix = s => { const [a, b] = s.split('|'); return ion(a, b); };
  const cell = (c, grp) => `<button class="vc${grp ? ' grp' : ''}" type="button"><span class="vn">${esc(c[0])}${c[3] ? `<i title="表外補充，見單元 ${c[3]}">＊</i>` : ''}</span><span class="vs">${ion(c[1], c[2])}</span></button>`;

  function html() {
    return `<header class="uhead"><span class="part">總整理</span>
      <h1><span class="no">價</span>價數表</h1>
      <p class="sum">常見離子與原子團（根）的價數，寫化學式、判斷反應產物時用。點「遮住符號」可以自我測驗。</p>
      <nav class="toc"><a href="#valence/vt">價數表</a><a href="#valence/vw">怎麼寫化學式</a><a href="#valence/vx">容易搞混</a></nav></header>

      <h2 class="blk-h" id="vt">常見離子與原子團</h2>
      <div class="tools"><button class="btn" id="vHide" aria-pressed="false" type="button">遮住符號自我測驗</button>
        <span class="vleg"><span class="vc mini">離子</span><span class="vc mini grp">原子團（根）</span></span></div>
      <div class="vtab" id="vtab">${VAL.map(r => `<div class="vrow"><div class="vq ${r[0][0] === '＋' ? 'pos' : 'neg'}">${r[0]}</div><div class="vcells">${r[1].map(c => cell(c)).join('')}${r[2].map(c => cell(c, 1)).join('')}</div></div>`).join('')}</div>
      <p class="vnote">主表整理自翰林 p.99（單元 6）。＊表外補充：碳酸氫根見<a href="#u8">單元 8</a>（含 CO<sub>3</sub><sup>2−</sup> 或 HCO<sub>3</sub><sup>−</sup> 的鹽遇酸產生 CO<sub>2</sub>），二鉻酸根見<a href="#u9">單元 9</a>（鉻酸根平衡）。</p>

      <h2 class="blk-h" id="vw">怎麼寫化學式</h2>
      <ol class="vrule">
        <li><b>正價在前、負價在後</b>：金屬、氫、銨根寫前面；非金屬、負價原子團寫後面。</li>
        <li><b>中文名稱和化學式的順序相反</b>：氯化鈉 NaCl、碳酸鈣 CaCO<sub>3</sub>。</li>
        <li><b>正價總和＝負價總和</b>：價數交叉當個數，再約成最簡整數比。</li>
        <li><b>原子團超過 1 個要加括號</b>：Ca(OH)<sub>2</sub>、(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>。</li>
        <li><b>命名</b>：單原子陰離子叫「□化□」（氯化鈉、氧化鎂）；酸根叫「□酸□」（硫酸鈉、硝酸銀）；OH<sup>−</sup> 叫「氫氧化□」。</li>
      </ol>
      <div class="fmls">${VALEX.map(e => `<article class="fml"><b>${esc(e[0])}</b><div class="eq">${ix(e[1])} ＋ ${ix(e[2])} → <span class="vf">${chem(e[3])}</span></div><div class="fn">💡 ${esc(e[4])}</div></article>`).join('')}</div>

      <h2 class="blk-h" id="vx">容易搞混</h2>
      <ul class="vrule">
        <li>硫離子 S<sup>2−</sup> ≠ 硫酸根 SO<sub>4</sub><sup>2−</sup>；碳酸根 CO<sub>3</sub><sup>2−</sup>（－2）≠ 碳酸氫根 HCO<sub>3</sub><sup>−</sup>（－1）。</li>
        <li>氫離子 H<sup>+</sup>（酸）和氫氧根 OH<sup>−</sup>（鹼）價數相反。</li>
        <li>銨根 NH<sub>4</sub><sup>+</sup> 是表中唯一帶正電的原子團，寫在化學式前面。</li>
        <li>原子團在反應中常整團不拆開，數個數時要整團算。</li>
      </ul>
      <nav class="pager"><a href="#u19"><small>← 上一單元</small><b>19．跨科主題：能源</b></a><a class="nx" href="../"><small>讀完了！</small><b>回首頁看其他科目</b></a></nav>`;
  }
  function bind(view) {
    const tab = view.querySelector('#vtab'), hb = view.querySelector('#vHide');
    hb.onclick = () => {
      const on = tab.classList.toggle('hide');
      tab.querySelectorAll('.vc.show').forEach(b => b.classList.remove('show'));
      hb.textContent = on ? '顯示全部符號' : '遮住符號自我測驗'; hb.setAttribute('aria-pressed', on);
    };
    tab.querySelectorAll('.vc').forEach(b => b.onclick = () => { if (tab.classList.contains('hide')) b.classList.toggle('show'); });
  }
  window.EXTRA = { key: 'valence', mark: '價', side: '價數表（離子與原子團）', title: '價數表', html, bind };
})();
