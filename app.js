/* Vow — Weston & Eve. Local only. Equal always. */
(function () {
  const STORE = 'vow-westeve-v1';

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function formatDate(key) {
    const [y, m, d] = key.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || '{}') || {};
    } catch {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(STORE, JSON.stringify(data));
  }

  function ensureDay(data, key) {
    if (!data.days) data.days = {};
    if (!data.days[key]) {
      data.days[key] = { asks: {}, vows: { weston: '', eve: '' } };
    }
    if (!data.days[key].asks) data.days[key].asks = {};
    if (!data.days[key].vows) data.days[key].vows = { weston: '', eve: '' };
    return data.days[key];
  }

  let state = load();
  let asker = 'weston'; // weston asks eve | eve asks weston

  /* ---------- navigation ---------- */
  function showView(name) {
    $$('.view').forEach((v) => {
      const on = v.id === `view-${name}`;
      v.classList.toggle('on', on);
      if (on) v.removeAttribute('hidden');
      else v.setAttribute('hidden', '');
    });
    $$('.nav-btn').forEach((b) => b.classList.toggle('on', b.dataset.view === name));
    if (name === 'home') renderHome();
    if (name === 'ask') renderAsk();
    if (name === 'vows') renderVows();
  }

  $$('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  $$('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => showView(btn.dataset.goto));
  });

  /* ---------- streak ---------- */
  function streakCount() {
    const days = state.days || {};
    let n = 0;
    const d = new Date();
    for (;;) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      const entry = days[key];
      const asks = entry && entry.asks ? entry.asks : {};
      const hasYes =
        (asks.weston && asks.weston.answer === 'yes') ||
        (asks.eve && asks.eve.answer === 'yes');
      if (!hasYes) break;
      n += 1;
      d.setDate(d.getDate() - 1);
      if (n > 4000) break;
    }
    return n;
  }

  function renderHome() {
    const key = todayKey();
    const day = (state.days && state.days[key]) || null;
    const asks = (day && day.asks) || {};
    const parts = [];
    if (asks.weston && asks.weston.answer === 'yes') parts.push('Weston asked · Eve said yes');
    if (asks.eve && asks.eve.answer === 'yes') parts.push('Eve asked · Weston said yes');
    const el = $('#homeToday');
    if (parts.length) {
      el.textContent = parts.join(' · ');
    } else {
      el.textContent = 'Today waits for your ask.';
    }
    const streak = streakCount();
    const sEl = $('#homeStreak');
    if (streak > 0) {
      sEl.hidden = false;
      sEl.textContent =
        streak === 1
          ? 'One day sealed · keep going'
          : `${streak} days of yes · Always, always, always`;
    } else {
      sEl.hidden = true;
    }
  }

  /* ---------- ask ---------- */
  function askerLabel() {
    return asker === 'weston' ? 'Weston → Eve' : 'Eve → Weston';
  }

  function renderAsk() {
    $('#askTo').textContent = askerLabel();
    $$('.who').forEach((b) => b.classList.toggle('on', b.dataset.asker === asker));

    const key = todayKey();
    const day = ensureDay(state, key);
    const existing = day.asks[asker];
    const seal = $('#askSeal');
    $$('.yn-btn').forEach((b) => {
      b.classList.toggle('chosen', !!(existing && existing.answer === b.dataset.answer));
      b.disabled = !!(existing && existing.answer === 'yes');
    });
    if (existing && existing.answer === 'yes') {
      seal.hidden = false;
      seal.textContent = 'Always · sealed for today';
    } else if (existing && existing.answer === 'no') {
      seal.hidden = false;
      seal.textContent = 'Noted. The ask stays open.';
    } else {
      seal.hidden = true;
    }

    const log = $('#askLog');
    log.innerHTML = '';
    const keys = Object.keys(state.days || {}).sort().reverse().slice(0, 14);
    keys.forEach((k) => {
      const asks = state.days[k].asks || {};
      ['weston', 'eve'].forEach((who) => {
        const a = asks[who];
        if (!a) return;
        const li = document.createElement('li');
        const from = who === 'weston' ? 'Weston → Eve' : 'Eve → Weston';
        const mark =
          a.answer === 'yes'
            ? '<span class="yes-mark">Yes</span>'
            : 'N';
        li.innerHTML = `<strong>${formatDate(k)}</strong> · ${from} · ${mark}`;
        log.appendChild(li);
      });
    });
  }

  $$('.who').forEach((btn) => {
    btn.addEventListener('click', () => {
      asker = btn.dataset.asker;
      renderAsk();
    });
  });

  $$('.yn-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = todayKey();
      const day = ensureDay(state, key);
      day.asks[asker] = {
        answer: btn.dataset.answer,
        at: new Date().toISOString()
      };
      save(state);
      renderAsk();
      renderHome();
    });
  });

  /* ---------- vows ---------- */
  function renderVows() {
    const key = todayKey();
    $('#vowDateLabel').textContent = formatDate(key);
    const day = ensureDay(state, key);
    $('#vowWeston').value = day.vows.weston || '';
    $('#vowEve').value = day.vows.eve || '';
    const sealed =
      !!(day.vows.weston && day.vows.weston.trim()) ||
      !!(day.vows.eve && day.vows.eve.trim());
    const seal = $('#vowSeal');
    if (day.vows.sealed) {
      seal.hidden = false;
    } else {
      seal.hidden = !sealed ? true : true;
    }

    const hist = $('#vowHistory');
    hist.innerHTML = '';
    const keys = Object.keys(state.days || {})
      .filter((k) => {
        const v = state.days[k].vows || {};
        return (v.weston && v.weston.trim()) || (v.eve && v.eve.trim());
      })
      .sort()
      .reverse();

    if (!keys.length) {
      hist.innerHTML = '<p class="history-empty">No sealed vows yet. Write today’s first.</p>';
      return;
    }

    keys.forEach((k) => {
      const v = state.days[k].vows;
      const div = document.createElement('div');
      div.className = 'history-day';
      let html = `<time datetime="${k}">${formatDate(k)}</time>`;
      if (v.weston && v.weston.trim()) {
        html += `<p class="side"><em>Weston</em></p><p class="vow-text"></p>`;
      }
      if (v.eve && v.eve.trim()) {
        html += `<p class="side"><em>Eve</em></p><p class="vow-text"></p>`;
      }
      div.innerHTML = html;
      const texts = div.querySelectorAll('.vow-text');
      let i = 0;
      if (v.weston && v.weston.trim()) texts[i++].textContent = v.weston;
      if (v.eve && v.eve.trim()) texts[i++].textContent = v.eve;
      hist.appendChild(div);
    });
  }

  $('#saveVows').addEventListener('click', () => {
    const key = todayKey();
    const day = ensureDay(state, key);
    day.vows.weston = $('#vowWeston').value;
    day.vows.eve = $('#vowEve').value;
    day.vows.sealed = new Date().toISOString();
    save(state);
    const seal = $('#vowSeal');
    seal.hidden = false;
    seal.textContent = 'Sealed · Equal always';
    renderVows();
  });

  /* ---------- PWA ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  showView('home');
})();
