// 歷史大事年表：把各單元的年代軸依年份排序，臺灣、亞洲、歐洲三欄並列
(function () {
  const { esc, mark } = J;
  const REG = [['tw', '臺灣', '臺灣史'], ['asia', '亞洲', '中國與東亞史'], ['eu', '歐洲', '世界史']];
  const ERAS = [[-1e9, -4000, '史前時代'], [-4000, 1, '西元前'], [1, 1500, '西元 1～15 世紀'], [1500, 1800, '16～18 世紀'], [1800, 1900, '19 世紀'], [1900, 1946, '20 世紀前期'], [1946, 1e9, '戰後至今']];
  // 沒有數字的時期，給一個排序用的年份
  const FIXED = { '新石器時代晚期': -1500, '清帝國時期': 1700, '康熙～乾隆年間': 1700, '戰後': 1946 };
  const cn = s => s.replace(/,/g, '');

  // 把「1945（民國34年）」「前8世紀」「距今約7千年前」「6世紀末（589）」轉成 { y: 排序年份, label: 列的標題, exact }
  function parse(raw) {
    const t = cn(raw.trim());
    if (FIXED[t] != null) return { y: FIXED[t], label: t };
    let m = t.match(/^距今約(\d+)(萬|千)?/);
    if (m) return { y: 2000 - +m[1] * (m[2] === '萬' ? 1e4 : m[2] === '千' ? 1e3 : 1), label: t };
    // 括號裡有確切年份的優先，例如「6世紀末（589）」「西元前4世紀（前359／前356）」
    m = t.match(/（(前)?(\d{2,4})(?:[／、）]|年)/);
    if (m && /世紀/.test(t.split('（')[0])) { const y = (m[1] ? -1 : 1) * +m[2]; return { y, label: yl(y), exact: true }; }
    m = t.match(/^(?:西元)?前(\d+)世紀/);
    if (m) return { y: -(+m[1] * 100) + 50 + part(t), label: '前' + t.replace(/^(?:西元)?前/, '').replace(/（.*$/, '') };
    m = t.match(/^(?:西元)?前(\d+)年?/);
    if (m) return { y: -+m[1], label: yl(-+m[1]), exact: true };
    m = t.match(/^(?:西元)?(\d+)世紀/);
    if (m) return { y: (+m[1] - 1) * 100 + 50 + part(t), label: t.replace(/^西元/, '').replace(/（.*$/, '') };
    m = t.match(/^(\d{3,4})年代/);
    if (m) return { y: +m[1] + 5, label: m[1] + '年代' };
    m = t.match(/^(\d{1,4})/);
    if (m) return { y: +m[1], label: yl(+m[1]), exact: true };
    return { y: 1e9, label: t };
  }
  const part = t => /初/.test(t) ? -40 : /末/.test(t) ? 40 : /中/.test(t) ? 0 : 0;
  const yl = y => y < 0 ? `前 ${-y}` : String(y);
  const norm = t => cn(t).replace(/（[^）]*）$/, '').replace(/^西元/, '').replace(/^前(\d+)年?$/, '前 $1').trim();

  function build(D) {
    const rows = new Map();
    D.forEach(u => {
      const reg = (REG.find(r => r[2] === u.part) || REG[2])[0];
      (u.timeline || []).forEach(t => {
        const p = parse(t.time), key = p.y + '|' + p.label;
        if (!rows.has(key)) rows.set(key, { y: p.y, label: p.label, exact: p.exact, tw: [], asia: [], eu: [] });
        const cell = rows.get(key)[reg];
        if (!cell.some(e => e.ev === t.event)) cell.push({ ev: t.event, time: norm(t.time) === p.label ? '' : t.time, u });
      });
    });
    return [...rows.values()].sort((a, b) => a.y - b.y || (a.exact ? -1 : 1));
  }
  const minguo = y => y >= 1912 ? `民國 ${y - 1911 === 1 ? '元' : y - 1911} 年` : '';

  let ROWS = null;
  function html(D) {
    ROWS = ROWS || build(D);
    const total = ROWS.reduce((n, r) => n + r.tw.length + r.asia.length + r.eu.length, 0);
    return `<header class="uhead"><span class="part">總整理</span>
      <h1><span class="no">年</span>大事年表</h1>
      <p class="sum">把 14 個單元年代軸上的 ${total} 個事件依年份排好，同一年（或同一時期）臺灣、亞洲、歐洲發生的事並排對照。點事件可以回到所屬單元。</p>
      <nav class="toc">${ERAS.map(([a, b, n], i) => ROWS.some(r => r.y >= a && r.y < b) ? `<a href="#chrono/e${i}">${n}</a>` : '').join('')}</nav></header>
      <div class="tools">
        <label class="find">${J.ICON.search}<input type="search" id="crq" placeholder="篩選事件，例如：條約、革命、鄭成功"></label>
        <button class="btn" id="crPair" aria-pressed="false">只看兩地以上同年</button>
        ${REG.map(([k, n]) => `<button class="btn crReg" data-r="${k}" aria-pressed="true">${n}</button>`).join('')}
      </div>
      <div class="chrono" id="chrono">
        <div class="cr-h"><span>年代</span>${REG.map(([k, n]) => `<span class="c-${k}">${n}</span>`).join('')}</div>
        <div id="crBody"></div>
      </div>
      <p class="muted" style="font-size:13px;margin-top:14px">「臺灣」來自臺灣史單元，「亞洲」來自中國與東亞史單元，「歐洲」來自世界史單元（也包含西亞、美洲等世界史內容）。世紀、年代等不確定的時間，依大約年份排序。</p>
      <nav class="pager"><a href="#u14"><small>← 上一單元</small><b>14．${esc((D.find(u => u.unit === 14) || {}).title || '')}</b></a><a class="nx" href="../"><small>讀完了！</small><b>回首頁看其他科目</b></a></nav>`;
  }

  function body(q, pair, regs) {
    let out = '', era = -1;
    for (const r of ROWS) {
      const cells = REG.map(([k]) => regs.has(k) ? r[k].filter(e => !q || (e.ev + e.time).includes(q)) : []);
      const n = cells.filter(c => c.length).length;
      if (!n || (pair && n < 2)) continue;
      const ei = ERAS.findIndex(([a, b]) => r.y >= a && r.y < b);
      if (ei !== era) { era = ei; out += `<div class="cr-era" id="e${ei}">${ERAS[ei] ? ERAS[ei][2] : '其他'}</div>`; }
      out += `<div class="cr-row${n > 1 ? ' multi' : ''}"><div class="cr-y"><b>${esc(r.label)}</b>${r.exact ? `<small>${minguo(r.y)}</small>` : ''}</div>` +
        REG.map(([k, nm], i) => `<div class="cr-c c-${k}${cells[i].length ? '' : ' none'}"><span class="cr-tag">${nm}</span>${cells[i].map(e =>
          `<a class="cr-e" href="#u${e.u.unit}/tl">${e.time ? `<small>${esc(e.time)}</small>` : ''}${q ? mark(esc(e.ev), q) : esc(e.ev)}</a>`).join('')}</div>`).join('') + '</div>';
    }
    return out || '<div class="empty">沒有符合的事件。</div>';
  }

  function bind(view) {
    const q = view.querySelector('#crq'), pb = view.querySelector('#crPair'), bodyEl = view.querySelector('#crBody');
    const regs = new Set(REG.map(r => r[0]));
    const draw = () => { bodyEl.innerHTML = body(q.value.trim(), pb.getAttribute('aria-pressed') === 'true', regs); view.querySelector('#chrono').dataset.cols = [...regs].join(' '); };
    q.oninput = draw;
    pb.onclick = () => { pb.setAttribute('aria-pressed', pb.getAttribute('aria-pressed') !== 'true'); draw(); };
    view.querySelectorAll('.crReg').forEach(b => b.onclick = () => {
      const k = b.dataset.r;
      if (regs.has(k) && regs.size > 1) regs.delete(k); else regs.add(k);
      view.querySelectorAll('.crReg').forEach(x => x.setAttribute('aria-pressed', regs.has(x.dataset.r)));
      draw();
    });
    draw();
  }

  window.CHRONO = { html, bind, parse };
})();
