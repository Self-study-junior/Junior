// 單元式科目（公民、歷史、生物、地科）的筆記頁
(function () {
  const { esc, point, mark, store, ICON } = J;
  const ID = document.body.dataset.subject;
  const SUBJ = SUBJECTS.find(s => s.id === ID);
  const D = window.NOTES[ID];
  const view = document.getElementById('view');
  const side = document.getElementById('side');
  const pick = document.getElementById('pick');

  document.title = `${SUBJ.name}．國中自學筆記`;
  document.getElementById('cur').innerHTML = `${esc(SUBJ.name)}<span class="label">重點筆記</span>`;
  document.getElementById('themeSlot').append(J.themeButton());
  const pr = document.createElement('button');
  pr.className = 'iconbtn'; pr.innerHTML = ICON.print + '<span class="label">列印本單元</span>'; pr.title = '列印本單元';
  pr.onclick = () => { document.querySelectorAll('.term.hide').forEach(t => t.classList.remove('hide')); print(); };
  document.getElementById('themeSlot').before(pr);

  // ---------- 單元清單 ----------
  const parts = [...new Set(D.map(u => u.part))];
  side.innerHTML = parts.map(p => `<h2>${esc(p)}</h2>` + D.filter(u => u.part === p)
    .map(u => `<a class="ulink" href="#u${u.unit}" data-u="${u.unit}"><span class="n">${u.unit}</span><span>${esc(u.title)}</span></a>`).join('')).join('')
    + (window.CHRONO ? `<h2>總整理</h2><a class="ulink" href="#chrono" data-u="chrono"><span class="n">年</span><span>大事年表（臺灣・亞洲・歐洲）</span></a>` : '');
  pick.innerHTML = `<select aria-label="選擇單元">${parts.map(p => `<optgroup label="${esc(p)}">${D.filter(u => u.part === p)
    .map(u => `<option value="${u.unit}">單元 ${u.unit}　${esc(u.title)}</option>`).join('')}</optgroup>`).join('')}${window.CHRONO ? '<optgroup label="總整理"><option value="chrono">大事年表</option></optgroup>' : ''}</select>`;
  pick.querySelector('select').onchange = e => { location.hash = e.target.value === 'chrono' ? 'chrono' : 'u' + e.target.value; };

  // ---------- 單元內容 ----------
  function unitHTML(u) {
    const blocks = [['secs', '重點整理']];
    if (u.experiments) blocks.push(['exp', '重要實驗']);
    if (u.timeline) blocks.push(['tl', '年代軸']);
    if (u.sources) blocks.push(['srcs', '史料判讀']);
    if (u.confusions.length) blocks.push(['conf', '易混淆觀念']);
    if (u.terms.length) blocks.push(['terms', '關鍵名詞']);
    const i = D.indexOf(u), prev = D[i - 1], next = D[i + 1];
    return `<header class="uhead"><span class="part">${esc(u.part)}</span>
      <h1><span class="no">${u.unit}</span>${esc(u.title)}</h1><p class="sum">${esc(u.summary)}</p>
      <nav class="toc">${blocks.map(([k, t]) => `<a href="#u${u.unit}/${k}">${t}</a>`).join('')}</nav></header>

      <h2 class="blk-h" id="secs">重點整理 <small>${u.sections.length} 節</small></h2>
      <div class="secs">${u.sections.map((s, k) => `<section class="sec" id="s${k + 1}"><h3><span class="i">${String(k + 1).padStart(2, '0')}</span>${esc(s.heading)}</h3>
        <ul>${s.points.map(p => `<li>${point(p)}</li>`).join('')}</ul>
        ${s.fig ? `<figure class="fig"><img src="${esc(s.fig.src)}" alt="${esc(s.fig.cap)}" loading="lazy"><figcaption>${esc(s.fig.cap)}</figcaption></figure>` : ''}
        ${s.img ? `<figure class="fig"><img src="${esc(s.img)}" alt="${esc(s.heading)}附圖" loading="lazy"></figure>` : ''}
        ${s.example ? `<div class="eg"><b>例</b>${esc(s.example)}</div>` : ''}</section>`).join('')}</div>

      ${u.experiments ? `<h2 class="blk-h" id="exp">重要實驗 <small>${u.experiments.length} 個</small></h2>
      <div class="exps">${u.experiments.map(x => `<article class="exp"><h3>${esc(x.name)}</h3><dl>
        <dt>目的</dt><dd>${esc(x.purpose)}</dd><dt>步驟</dt><dd>${esc(x.steps)}</dd><dt>結果</dt><dd>${esc(x.result)}</dd><dt>易錯提醒</dt><dd class="pit">${esc(x.pitfall)}</dd></dl></article>`).join('')}</div>` : ''}

      ${u.timeline ? `<h2 class="blk-h" id="tl">年代軸</h2>
      <ol class="tl">${u.timeline.map(t => `<li><span class="t">${esc(t.time)}</span><span class="e">${esc(t.event)}</span></li>`).join('')}</ol>` : ''}

      ${u.sources ? `<h2 class="blk-h" id="srcs">史料判讀 <small>看到關鍵字就想到答案</small></h2>
      <div class="srcs">${u.sources.map(s => `<div class="src"><b>${esc(s.name)}</b><p>${esc(s.gist)}</p><div class="clue">${esc(s.clue)}</div></div>`).join('')}</div>` : ''}

      ${u.confusions.length ? `<h2 class="blk-h" id="conf">易混淆觀念</h2>
      <div class="tblwrap"><table class="cf"><thead><tr><th>觀念</th><th>差別</th><th>判斷關鍵</th></tr></thead><tbody>
      ${u.confusions.map(c => `<tr><td><b>${esc(c.a)}</b><span class="vs">vs.</span><b>${esc(c.b)}</b></td><td>${esc(c.diff)}</td><td class="tip">${esc(c.tip)}</td></tr>`).join('')}</tbody></table></div>` : ''}

      ${u.terms.length ? `<h2 class="blk-h" id="terms">關鍵名詞 <small>${u.terms.length} 個</small></h2>
      <div class="tools"><button class="btn" id="hideDef" aria-pressed="false">遮住定義自我測驗</button><span class="muted" style="font-size:13px">遮住後點卡片翻開</span></div>
      <div class="terms">${u.terms.map(t => `<button class="term"><b>${esc(t.term)}</b><span>${esc(t.def)}</span></button>`).join('')}</div>` : ''}

      <nav class="pager">${prev ? `<a href="#u${prev.unit}"><small>← 上一單元</small><b>${prev.unit}．${esc(prev.title)}</b></a>` : '<span></span>'}
      ${next ? `<a class="nx" href="#u${next.unit}"><small>下一單元 →</small><b>${next.unit}．${esc(next.title)}</b></a>` : window.CHRONO ? `<a class="nx" href="#chrono"><small>總整理 →</small><b>大事年表</b></a>` : `<a class="nx" href="../"><small>讀完了！</small><b>回首頁看其他科目</b></a>`}</nav>`;
  }

  // ---------- 科目內搜尋 ----------
  const finder = document.getElementById('find');
  finder.innerHTML = `${ICON.search}<input type="search" placeholder="搜尋${esc(SUBJ.name)}筆記" aria-label="搜尋${esc(SUBJ.name)}筆記">`;
  const fin = finder.querySelector('input');
  const rows = [];
  D.forEach(u => {
    u.sections.forEach((s, k) => rows.push({ u, where: s.heading, text: [s.heading, ...s.points, s.example || ''].join('　'), to: `s${k + 1}` }));
    u.terms.forEach(t => rows.push({ u, where: '關鍵名詞', text: t.term + '：' + t.def, to: 'terms' }));
    u.confusions.forEach(c => rows.push({ u, where: '易混淆觀念', text: `${c.a} vs. ${c.b}：${c.diff}；${c.tip}`, to: 'conf' }));
    (u.experiments || []).forEach(x => rows.push({ u, where: '重要實驗', text: [x.name, x.purpose, x.steps, x.result, x.pitfall].join('　'), to: 'exp' }));
    (u.timeline || []).forEach(t => rows.push({ u, where: '年代軸', text: t.time + '　' + t.event, to: 'tl' }));
    (u.sources || []).forEach(s => rows.push({ u, where: '史料判讀', text: [s.name, s.gist, s.clue].join('　'), to: 'srcs' }));
  });
  function search(k) {
    const kl = k.toLowerCase(), hit = rows.filter(r => r.text.toLowerCase().includes(kl));
    view.innerHTML = `<header class="uhead"><h1>搜尋「${esc(k)}」</h1><p class="sum">在${esc(SUBJ.name)}筆記中找到 ${hit.length} 筆</p></header>
      <div class="results" style="max-width:none">${hit.slice(0, 80).map(r => {
        const t = r.text, i = t.toLowerCase().indexOf(kl), a = Math.max(0, i - 30), b = Math.min(t.length, i + k.length + 80);
        return `<a class="res" href="#u${r.u.unit}/${r.to}"><div class="rt">單元 ${r.u.unit} ${esc(r.u.title)}．${esc(r.where)}</div><div class="rb">${mark(esc((a ? '…' : '') + t.slice(a, b) + (b < t.length ? '…' : '')), k)}</div></a>`;
      }).join('') || '<div class="empty">找不到符合的筆記，換個關鍵字試試。</div>'}</div>`;
  }
  let timer, lastQ = '';
  fin.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => { const k = fin.value.trim(); if (k) { lastQ = k; search(k); } else { lastQ = ''; route(); } }, 150);
  });

  // ---------- 路由：#u3、#u3/s2、#u3/terms ----------
  let shown = null;
  function route() {
    if (window.CHRONO && /^#chrono/.test(location.hash)) return routeChrono();
    const m = location.hash.match(/^#u(\d+)(?:\/(\w+))?/);
    const saved = store.get('unit.' + ID, D[0].unit);
    if (!m && saved === 'chrono' && window.CHRONO) return routeChrono();
    const u = D.find(x => x.unit == (m ? m[1] : saved)) || D[0];
    if (shown !== u || lastQ) {
      view.innerHTML = unitHTML(u);
      shown = u;
      bind();
      side.querySelectorAll('.ulink').forEach(a => a.toggleAttribute('aria-current', false));
      const cur = side.querySelector(`[data-u="${u.unit}"]`);
      if (cur) { cur.setAttribute('aria-current', 'page'); cur.scrollIntoView({ block: 'nearest' }); }
      pick.querySelector('select').value = u.unit;
      if (lastQ) { lastQ = ''; fin.value = ''; }
      if (!m || !m[2]) window.scrollTo(0, 0);
    }
    store.set('unit.' + ID, u.unit);
    store.set('last', { id: ID, hash: '#u' + u.unit, title: `單元 ${u.unit}　${u.title}` });
    J.visit(ID, 'u' + u.unit);
    if (m && m[2]) {
      const el = document.getElementById(m[2]);
      if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
    }
  }
  // 大事年表：#chrono、#chrono/e3（跳到某個時期）
  function routeChrono() {
    const anchor = location.hash.split('/')[1];
    if (shown !== 'chrono' || lastQ) {
      view.innerHTML = CHRONO.html(D);
      CHRONO.bind(view);
      shown = 'chrono';
      side.querySelectorAll('.ulink').forEach(a => a.toggleAttribute('aria-current', a.dataset.u === 'chrono'));
      pick.querySelector('select').value = 'chrono';
      if (lastQ) { lastQ = ''; fin.value = ''; }
      if (!anchor) window.scrollTo(0, 0);
    }
    store.set('unit.' + ID, 'chrono');
    store.set('last', { id: ID, hash: '#chrono', title: '大事年表' });
    J.visit(ID, 'chrono');
    if (anchor) { const el = document.getElementById(anchor); if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' })); }
  }
  function bind() {
    const hb = document.getElementById('hideDef');
    if (hb) hb.onclick = () => {
      const on = hb.getAttribute('aria-pressed') !== 'true';
      hb.setAttribute('aria-pressed', on);
      hb.textContent = on ? '顯示全部定義' : '遮住定義自我測驗';
      view.querySelectorAll('.term').forEach(t => t.classList.toggle('hide', on));
    };
    view.querySelectorAll('.term').forEach(t => t.onclick = () => t.classList.toggle('hide'));
  }
  addEventListener('hashchange', route);
  route();
  J.islandFab(() => shown === 'chrono' ? 'chrono' : shown && shown.unit ? 'u' + shown.unit : '');
})();
