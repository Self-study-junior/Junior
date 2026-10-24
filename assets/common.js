// 共用：主題切換、上方列、小工具
(function () {
  const store = {
    get(k, d) { try { const v = localStorage.getItem('junior.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('junior.' + k, JSON.stringify(v)); } catch (e) {} },
  };
  const theme = store.get('theme', null);
  if (theme) document.documentElement.dataset.theme = theme;

  const ICON = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><path d="M6 14h12v7H6z"/></svg>',
  };

  function isDark() {
    const t = document.documentElement.dataset.theme;
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function themeButton() {
    const b = document.createElement('button');
    b.className = 'iconbtn';
    const paint = () => { b.innerHTML = isDark() ? ICON.sun : ICON.moon; b.title = b.ariaLabel = isDark() ? '切換成淺色' : '切換成深色'; };
    b.onclick = () => { const t = isDark() ? 'light' : 'dark'; document.documentElement.dataset.theme = t; store.set('theme', t); paint(); };
    paint();
    return b;
  }

  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // 「名詞：說明」這種格式，把冒號前的短詞加粗
  const point = s => {
    const m = String(s).match(/^([^：:，。；,]{1,14})[：:]([\s\S]+)$/);
    return m ? `<span class="kw">${esc(m[1])}</span>：${esc(m[2])}` : esc(s);
  };
  const mark = (html, q) => {
    if (!q) return html;
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return html.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, txt) => tag || txt.replace(re, '<mark class="f">$1</mark>'));
  };

  // 讀過的單元：學習島用來蓋「已探索」印章。key 例如 u4、chrono、vocab、gram-3、strat-閱讀
  function visit(id, key) {
    const v = store.get('visited', {}); const list = v[id] || (v[id] = []);
    if (!list.includes(key)) { list.push(key); store.set('visited', v); }
  }

  // 筆記頁右下角的浮動鈕：回到科目島、群島全景，或飛到這個單元的物件
  function islandFab(getKey) {
    const id = document.body.dataset.subject, s = (window.SUBJECTS || []).find(x => x.id === id);
    if (!id || !s) return;
    const wrap = document.createElement('div'); wrap.className = 'fab';
    wrap.innerHTML = `<div class="fab-menu" hidden>
        <a data-k="unit" href="#"><span>📍</span><b>${id === "english" ? "看這個主題" : "看這個單元"}的島上物件</b></a>
        <a href="../island/#${id}"><span>🏝️</span><b>回到${esc(s.name)}島</b></a>
        <a href="../island/"><span>🗺️</span><b>群島全景</b></a>
      </div>
      <button class="fab-btn" type="button" aria-expanded="false" aria-label="回到學習島">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7 38.7 15.5v17L24 41 9.3 32.5v-17Z" fill="#b5d69a" stroke="#fff" stroke-width="2.5"/><path d="M24 41 9.3 32.5v3L24 44l14.7-8.5v-3Z" fill="#f2e0bd"/><circle cx="19" cy="22" r="4.5" fill="#5f9450"/><rect x="25.5" y="17" width="7" height="9" fill="#fffaf2" stroke="#c4532e" stroke-width="1.4"/><path d="M24.5 17.5 29 13l4.5 4.5Z" fill="#e2673c"/></svg>
        <span>學習島</span>
      </button>`;
    document.body.appendChild(wrap);
    const btn = wrap.querySelector('.fab-btn'), menu = wrap.querySelector('.fab-menu'), unit = wrap.querySelector('[data-k="unit"]');
    const sync = () => { const k = getKey(); unit.hidden = !k; if (k) unit.href = `../island/#${id}/${encodeURIComponent(k)}`; };
    const open = on => { menu.hidden = !on; btn.setAttribute('aria-expanded', on); wrap.classList.toggle('open', on); if (on) sync(); };
    btn.onclick = e => { e.stopPropagation(); open(menu.hidden); };
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) open(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') open(false); });
    addEventListener('hashchange', sync); sync();
  }

  window.J = { store, ICON, esc, point, mark, themeButton, visit, islandFab };
})();
