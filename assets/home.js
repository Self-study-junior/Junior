(function () {
  const { esc, store, mark } = J;
  document.getElementById('themeSlot').append(J.themeButton());
  const S = window.SUMMARY || {};
  const ready = SUBJECTS.filter(s => s.ready);

  // ---------- 統計 ----------
  let units = 0, secs = 0, terms = 0;
  ready.forEach(s => { const x = S[s.id] || {}; units += x.units || 0; secs += x.sections || 0; terms += x.terms || 0; });
  const en = S.english || {};
  document.getElementById('stats').innerHTML = [
    [ready.length, '個科目'], [units + 15, '個單元與文法主題'], [secs + (en.grammar || 0), '則重點'], [terms, '個關鍵名詞'], [en.vocab || 0, '個英文單字片語'],
  ].map(([n, t]) => `<div><b>${n.toLocaleString()}</b><span>${t}</span></div>`).join('');

  // ---------- 繼續閱讀 ----------
  const last = store.get('last', null);
  const ls = last && SUBJECTS.find(s => s.id === last.id);
  if (ls) document.getElementById('cont').innerHTML =
    `<a class="continue" data-subject="${ls.id}" href="${ls.id}/${last.hash || ''}">接著讀　<b>${esc(ls.name)}</b>　${esc(last.title || '')} →</a>`;

  // ---------- 科目卡片 ----------
  const GROUPS = [['語文', 'Language'], ['數學', 'Mathematics'], ['自然', 'Science'], ['社會', 'Social Studies']];
  document.getElementById('groups').innerHTML = GROUPS.map(([g, ge]) => {
    const list = SUBJECTS.filter(s => s.group === g);
    if (!list.length) return '';
    return `<section class="group"><div class="group-h"><h2>${g}</h2><span class="en">${ge}</span></div><div class="cards">${list.map(card).join('')}</div></section>`;
  }).join('');

  function card(s) {
    if (!s.ready) return `<div class="subj soon" data-subject="soon"><div class="top"><span class="badge">${esc(s.mark)}</span><h3>${esc(s.name)}<small>${esc(s.en)}</small></h3></div><div class="meta"><span class="pill">整理中</span></div></div>`;
    const x = S[s.id] || {};
    const pills = s.id === 'english'
      ? [`${x.vocab} 單字片語`, `${x.polysemy} 一字多義`, `15 文法主題`]
      : [`${x.units} 單元`, `${x.sections} 重點`, `${x.terms} 名詞`];
    return `<a class="subj" data-subject="${s.id}" href="${s.id}/">
      <span class="mk">${esc(s.mark)}</span><span class="go">→</span>
      <div class="top"><span class="badge">${esc(s.mark)}</span><h3>${esc(s.name)}<small>${esc(s.en)}</small></h3></div>
      <p>${esc(s.desc)}</p>
      <div class="meta">${pills.map(p => `<span class="pill">${esc(p)}</span>`).join('')}</div></a>`;
  }

  // ---------- 全站搜尋（第一次輸入時才載入筆記） ----------
  const q = document.getElementById('q'), out = document.getElementById('results');
  let index = null, loading = null;
  function load() {
    if (loading) return loading;
    loading = Promise.all(ready.map(s => new Promise(res => {
      const el = document.createElement('script'); el.src = `data/${s.id}.js`; el.onload = el.onerror = res; document.head.append(el);
    }))).then(() => { index = build(); });
    return loading;
  }
  function build() {
    const rows = [];
    for (const s of ready) {
      const d = (window.NOTES || {})[s.id]; if (!d) continue;
      if (Array.isArray(d)) d.forEach(u => {
        const at = `${s.name}．單元 ${u.unit} ${u.title}`;
        u.sections.forEach((x, i) => rows.push({ s, at: at + '．' + x.heading, text: [x.heading, ...x.points, x.example || ''].join('　'), href: `${s.id}/#u${u.unit}/s${i + 1}` }));
        u.terms.forEach(t => rows.push({ s, at: at + '．名詞', text: t.term + '：' + t.def, href: `${s.id}/#u${u.unit}/terms` }));
        u.confusions.forEach(c => rows.push({ s, at: at + '．易混淆', text: `${c.a} vs. ${c.b}：${c.diff}`, href: `${s.id}/#u${u.unit}/conf` }));
      });
      else {
        d.vocab.forEach(v => rows.push({ s, at: `英語．單字．${v.topic}`, text: `${v.w}（${v.pos}）${v.zh}`, href: `english/#vocab/${encodeURIComponent(v.topic)}` }));
        d.grammar.forEach(g => rows.push({ s, at: `英語．文法．${g.heading}`, text: [g.heading, ...g.points].join('　'), href: `english/#gram/${g.gt}` }));
      }
    }
    return rows;
  }
  function snippet(t, k) {
    const i = t.toLowerCase().indexOf(k.toLowerCase());
    const a = Math.max(0, i - 24), b = Math.min(t.length, i + k.length + 60);
    return (a ? '…' : '') + t.slice(a, b) + (b < t.length ? '…' : '');
  }
  let timer;
  q.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const k = q.value.trim();
      if (!k) { out.innerHTML = ''; return; }
      if (!index) { out.innerHTML = '<div class="muted">載入筆記中…</div>'; await load(); }
      if (q.value.trim() !== k) return;
      const kl = k.toLowerCase();
      const hit = index.filter(r => r.text.toLowerCase().includes(kl));
      out.innerHTML = hit.length
        ? hit.slice(0, 30).map(r => `<a class="res" data-subject="${r.s.id}" href="${r.href}"><div class="rt">${esc(r.at)}</div><div class="rb">${mark(esc(snippet(r.text, k)), k)}</div></a>`).join('')
          + (hit.length > 30 ? `<div class="muted" style="font-size:14px">共 ${hit.length} 筆，只列前 30 筆，可以再多打幾個字縮小範圍。</div>` : '')
        : '<div class="muted">找不到符合的筆記。</div>';
    }, 150);
  });
  q.addEventListener('focus', load, { once: true });
})();
