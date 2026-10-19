// 英語筆記頁：主題單字、一字多義、文法、學習策略
(function () {
  const { esc, point, mark, store, ICON } = J;
  const D = window.NOTES.english;
  const view = document.getElementById('view');
  const side = document.getElementById('side');
  const pick = document.getElementById('pick');
  document.getElementById('cur').innerHTML = '英語<span class="label">重點筆記</span>';
  document.getElementById('find').hidden = true;
  document.getElementById('themeSlot').append(J.themeButton());

  const GT = ['', '名詞、代名詞', '現在／過去簡單式', '進行式、未來式', 'Wh- 疑問詞', '形容詞', '副詞', '介系詞', '連接詞', '助動詞', '動詞', '被動語態', '不定詞、動名詞、分詞', '現在／過去完成式', '關係代名詞', '特殊句構'];
  const TOP = {};
  D.vocab.forEach((v, i) => { v.i = i; (TOP[v.topic] = TOP[v.topic] || []).push(v); });
  const topics = Object.keys(TOP).sort((a, b) => TOP[b].length - TOP[a].length);
  const AREAS = ['單字', '閱讀', '聽力'];

  // ---------- 語音（瀏覽器內建） ----------
  const tts = 'speechSynthesis' in window;
  function speak(t) {
    if (!tts) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .9;
    const v = speechSynthesis.getVoices().find(v => /^en[-_]US/i.test(v.lang)); if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  const sayBtn = w => tts ? `<button class="say" data-say="${esc(w)}" aria-label="朗讀 ${esc(w)}">🔊</button>` : '';

  // ---------- 側欄 ----------
  side.innerHTML = `<h2>單字</h2><a class="ulink" href="#vocab" data-k="vocab"><span class="n">A</span><span>主題單字 ${D.vocab.length}</span></a>
    <a class="ulink" href="#poly" data-k="poly"><span class="n">B</span><span>一字多義 ${D.polysemy.length}</span></a>
    <h2>文法</h2>${GT.slice(1).map((t, i) => `<a class="ulink" href="#gram/${i + 1}" data-k="gram/${i + 1}"><span class="n">${i + 1}</span><span>${t}</span></a>`).join('')}
    <h2>學習策略</h2>${AREAS.map(a => `<a class="ulink" href="#strat/${encodeURIComponent(a)}" data-k="strat/${a}"><span class="n">★</span><span>${a}策略</span></a>`).join('')}`;
  pick.innerHTML = `<select aria-label="選擇主題"><option value="vocab">主題單字</option><option value="poly">一字多義</option>
    <optgroup label="文法">${GT.slice(1).map((t, i) => `<option value="gram/${i + 1}">${i + 1}．${t}</option>`).join('')}</optgroup>
    <optgroup label="學習策略">${AREAS.map(a => `<option value="strat/${a}">${a}策略</option>`).join('')}</optgroup></select>`;
  pick.querySelector('select').onchange = e => { location.hash = e.target.value; };

  const tabs = cur => `<nav class="subnav">${[['vocab', '主題單字'], ['poly', '一字多義'], ['gram', '文法'], ['strat', '學習策略']]
    .map(([k, t]) => `<a href="#${k}" ${cur === k ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`;
  const head = (kicker, title, sum) => `<header class="uhead"><span class="part">${kicker}</span><h1>${title}</h1>${sum ? `<p class="sum">${sum}</p>` : ''}</header>`;

  function vtable(list, q) {
    return `<div class="tblwrap"><table class="vt" id="vt">${list.map(v => `<tr><td class="w">${mark(esc(v.w), q)}</td><td class="p">${esc(v.pos)}</td>
      <td class="z"><span>${mark(esc(v.zh), q)}${v.note ? `<span class="zhn">${esc(v.note)}</span>` : ''}</span></td><td class="s">${sayBtn(v.w)}</td></tr>`).join('')}</table></div>`;
  }

  // ---------- 各頁 ----------
  const pages = {
    vocab(topic) {
      if (topic && TOP[topic]) {
        const list = TOP[topic];
        return { title: `單字．${topic}`, html: tabs('vocab') + head('主題單字', esc(topic), `${list.length} 個單字片語`) +
          `<div class="tools"><a class="btn" href="#vocab" style="text-decoration:none">← 全部主題</a><button class="btn" id="hideZh" aria-pressed="false">遮住中文自我測驗</button>${tts ? '<span class="muted" style="font-size:13px">🔊 用瀏覽器內建語音朗讀</span>' : ''}</div>` + vtable(list) };
      }
      return { title: '主題單字', html: tabs('vocab') + head('Vocabulary', '主題單字', `共 ${D.vocab.length} 個單字片語，依主題分成 ${topics.length} 組。也可以直接搜尋英文或中文。`) +
        `<div class="tools"><label class="find">${ICON.search}<input type="search" id="vs" placeholder="查單字：輸入英文或中文"></label></div><div id="vsr"></div>
        <div class="tiles" id="tiles">${topics.map(k => `<a class="tile" href="#vocab/${encodeURIComponent(k)}"><b>${esc(k)}</b><span>${TOP[k].length} 個</span></a>`).join('')}</div>` };
    },
    poly() {
      return { title: '一字多義', html: tabs('poly') + head('Polysemy', '一字多義', `會考常考的一字多義，共 ${D.polysemy.length} 個字。`) +
        `<div class="tools"><label class="find">${ICON.search}<input type="search" id="ps" placeholder="篩選單字"></label></div>
        <div class="secs" id="pl">${D.polysemy.map(p => `<section class="sec" data-w="${esc(p.w.toLowerCase())}"><h3><span class="en" style="font-size:20px">${esc(p.w)}</span> ${sayBtn(p.w)}</h3>
        <ul>${p.senses.map(s => `<li><b>${esc(s.pos || '')} ${esc(s.zh)}</b>${s.ex ? `<div><span class="en">${esc(s.ex)}</span> ${sayBtn(s.ex)}<span class="zhn">${esc(s.exzh || '')}</span></div>` : ''}</li>`).join('')}</ul></section>`).join('')}</div>` };
    },
    gram(n) {
      n = +n;
      if (!GT[n]) {
        return { title: '文法', html: tabs('gram') + head('Grammar', '文法', '依 15 個文法主題整理，康軒、南一、翰林三個版本已整併。') +
          `<div class="tiles">${GT.slice(1).map((t, i) => `<a class="tile" href="#gram/${i + 1}"><b>${i + 1}．${t}</b><span>${D.grammar.filter(g => g.gt === i + 1).length} 則重點</span></a>`).join('')}</div>` };
      }
      const notes = D.grammar.filter(g => g.gt === n);
      return { title: `文法 ${n}．${GT[n]}`, html: tabs('gram') + head(`文法主題 ${n}`, `<span class="no">${n}</span>${esc(GT[n])}`, `${notes.length} 則重點`) +
        `<nav class="toc" style="margin:-6px 0 18px">${notes.map((g, i) => `<a href="#gram/${n}/g${i + 1}">${esc(g.heading)}</a>`).join('')}</nav>
        <div class="secs">${notes.map((g, i) => `<section class="sec" id="g${i + 1}"><h3><span class="i">${String(i + 1).padStart(2, '0')}</span>${esc(g.heading)}</h3>
          <ul>${g.points.map(p => `<li>${point(p)}</li>`).join('')}</ul>
          ${g.examples.length ? `<ul class="gx">${g.examples.map(e => `<li><span class="ex">${esc(e.en)}</span> ${sayBtn(e.en)}<span class="zh">${esc(e.zh)}</span></li>`).join('')}</ul>` : ''}
          <div class="cite">${esc(g.src)}</div></section>`).join('')}</div>
        <nav class="pager">${n > 1 ? `<a href="#gram/${n - 1}"><small>← 上一個主題</small><b>${n - 1}．${GT[n - 1]}</b></a>` : '<span></span>'}
        ${n < 15 ? `<a class="nx" href="#gram/${n + 1}"><small>下一個主題 →</small><b>${n + 1}．${GT[n + 1]}</b></a>` : '<a class="nx" href="#strat"><small>文法讀完了</small><b>看學習策略 →</b></a>'}</nav>` };
    },
    strat(area) {
      area = AREAS.includes(area) ? area : null;
      const list = area ? AREAS.filter(a => a === area) : AREAS;
      return { title: area ? area + '策略' : '學習策略', html: tabs('strat') + head('Strategies', area ? area + '策略' : '學習策略', '背單字、讀文章、聽聽力的方法與解題步驟。') +
        `<div class="tools">${AREAS.map(a => `<a class="btn" style="text-decoration:none" href="#strat/${encodeURIComponent(a)}" aria-pressed="${a === area}">${a}</a>`).join('')}</div>` +
        list.map(a => `<h2 class="blk-h">${a}策略 <small>${D.strategies.filter(s => s.area === a).length} 則</small></h2>
        <div class="secs">${D.strategies.filter(s => s.area === a).map(s => `<section class="sec"><h3>${esc(s.name)}</h3><ul>${s.steps.map(x => `<li>${point(x)}</li>`).join('')}</ul></section>`).join('')}</div>`).join('') };
    },
  };

  function bind() {
    view.querySelectorAll('[data-say]').forEach(b => b.onclick = e => { e.stopPropagation(); speak(b.dataset.say); });
    const hz = document.getElementById('hideZh'), vt = document.getElementById('vt');
    if (hz) hz.onclick = () => {
      const on = hz.getAttribute('aria-pressed') !== 'true';
      hz.setAttribute('aria-pressed', on); hz.textContent = on ? '顯示全部中文' : '遮住中文自我測驗';
      vt.classList.toggle('hidezh', on); vt.querySelectorAll('td.z').forEach(td => td.classList.remove('show'));
    };
    if (vt) vt.querySelectorAll('td.z').forEach(td => td.onclick = () => vt.classList.contains('hidezh') && td.classList.toggle('show'));
    const vs = document.getElementById('vs');
    if (vs) vs.oninput = () => {
      const k = vs.value.trim().toLowerCase();
      document.getElementById('tiles').hidden = !!k;
      const r = k ? D.vocab.filter(v => v.w.toLowerCase().includes(k) || v.zh.includes(k)) : [];
      document.getElementById('vsr').innerHTML = k ? (r.length ? `<p class="muted">找到 ${r.length} 個${r.length > 100 ? '，只列前 100 個' : ''}</p>` + vtable(r.slice(0, 100), vs.value.trim()) : '<div class="empty">單字表裡沒有這個字。</div>') : '';
      bind.say();
    };
    const ps = document.getElementById('ps');
    if (ps) ps.oninput = () => { const k = ps.value.trim().toLowerCase(); view.querySelectorAll('#pl .sec').forEach(s => s.hidden = k && !s.dataset.w.includes(k)); };
  }
  bind.say = () => view.querySelectorAll('#vsr [data-say]').forEach(b => b.onclick = () => speak(b.dataset.say));

  function route() {
    let h = decodeURIComponent(location.hash.slice(1));
    if (!h) h = store.get('unit.english', 'vocab');
    const [k, a, anchor] = h.split('/');
    const page = (pages[k] || pages.vocab)(a);
    view.innerHTML = page.html;
    document.title = `${page.title}．英語．國中自學筆記`;
    bind();
    const key = anchor ? `${k}/${a}` : h;
    side.querySelectorAll('.ulink').forEach(x => x.toggleAttribute('aria-current', false));
    const cur = side.querySelector(`[data-k="${CSS.escape(a ? k + '/' + a : k)}"]`) || side.querySelector(`[data-k="${k}"]`);
    if (cur) { cur.setAttribute('aria-current', 'page'); cur.scrollIntoView({ block: 'nearest' }); }
    const sel = pick.querySelector('select'); if ([...sel.options].some(o => o.value === (a ? k + '/' + a : k))) sel.value = a ? k + '/' + a : k;
    store.set('unit.english', key);
    store.set('last', { id: 'english', hash: '#' + key.split('/').map(encodeURIComponent).join('/'), title: page.title });
    if (anchor) { const el = document.getElementById(anchor); if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' })); }
    else window.scrollTo(0, 0);
  }
  addEventListener('hashchange', route);
  route();
})();
