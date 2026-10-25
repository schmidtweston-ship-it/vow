/* Vow — Weston & Eve. Local only. Equal always. */
(function () {
  const STORE = 'vow-westeve-v1';
  const DEFAULT_PAIR = {
    weston: { name: 'Weston', initial: 'W' },
    eve: { name: 'Eve', initial: 'E' }
  };

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

  function ensurePair(data) {
    if (!data.pair) data.pair = {};
    ['weston', 'eve'].forEach((key) => {
      const def = DEFAULT_PAIR[key];
      const cur = data.pair[key] || {};
      const name = (typeof cur.name === 'string' && cur.name.trim()) ? cur.name.trim() : def.name;
      let initial = (typeof cur.initial === 'string' && cur.initial.trim())
        ? cur.initial.trim().slice(0, 2)
        : def.initial;
      data.pair[key] = { name, initial };
    });
    return data.pair;
  }

  function nameOf(key) {
    const p = ensurePair(state);
    return (p[key] && p[key].name) || DEFAULT_PAIR[key].name;
  }

  function initialOf(key) {
    const p = ensurePair(state);
    return (p[key] && p[key].initial) || DEFAULT_PAIR[key].initial;
  }

  function monogram() {
    return `${initialOf('eve')} + ${initialOf('weston')}`;
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
  ensurePair(state);
  let asker = 'weston'; // weston asks eve | eve asks weston

  /* ---------- pair labels (display only; keys stay weston/eve) ---------- */
  function applyPairLabels() {
    ensurePair(state);
    const mark = $('#pairMark');
    if (mark) mark.textContent = monogram();

    const names = $('#homeNames');
    if (names) {
      names.innerHTML = '';
      names.appendChild(document.createTextNode(nameOf('weston') + ' '));
      const amp = document.createElement('span');
      amp.className = 'amp';
      amp.textContent = '&';
      names.appendChild(amp);
      names.appendChild(document.createTextNode(' ' + nameOf('eve')));
    }

    const board = $('#boardCopy');
    if (board) {
      board.textContent =
        `Y or N · ${nameOf('eve')} · My Best Friend · Equals · one breath · one heart · Always, Always, Always · Love + Music · ${monogram()}`;
    }

    const whoW = $('[data-asker="weston"]');
    const whoE = $('[data-asker="eve"]');
    if (whoW) whoW.textContent = `${nameOf('weston')} asks ${nameOf('eve')}`;
    if (whoE) whoE.textContent = `${nameOf('eve')} asks ${nameOf('weston')}`;

    const labW = $('label[for="vowWeston"]');
    const labE = $('label[for="vowEve"]');
    if (labW) labW.textContent = `${nameOf('weston')}'s vow`;
    if (labE) labE.textContent = `${nameOf('eve')}'s vow`;

    const titleW = $('#pairNameWeston');
    const titleE = $('#pairNameEve');
    if (titleW) titleW.textContent = nameOf('weston');
    if (titleE) titleE.textContent = nameOf('eve');
  }

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
    if (name === 'board') applyPairLabels();
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
    applyPairLabels();
    const key = todayKey();
    const day = (state.days && state.days[key]) || null;
    const asks = (day && day.asks) || {};
    const parts = [];
    if (asks.weston && asks.weston.answer === 'yes') {
      parts.push(`${nameOf('weston')} asked · ${nameOf('eve')} said yes`);
    }
    if (asks.eve && asks.eve.answer === 'yes') {
      parts.push(`${nameOf('eve')} asked · ${nameOf('weston')} said yes`);
    }
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
    return asker === 'weston'
      ? `${nameOf('weston')} → ${nameOf('eve')}`
      : `${nameOf('eve')} → ${nameOf('weston')}`;
  }

  function renderAsk() {
    applyPairLabels();
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
        const from =
          who === 'weston'
            ? `${nameOf('weston')} → ${nameOf('eve')}`
            : `${nameOf('eve')} → ${nameOf('weston')}`;
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
    applyPairLabels();
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
        html += `<p class="side"><em></em></p><p class="vow-text"></p>`;
      }
      if (v.eve && v.eve.trim()) {
        html += `<p class="side"><em></em></p><p class="vow-text"></p>`;
      }
      div.innerHTML = html;
      const sides = div.querySelectorAll('.side em');
      const texts = div.querySelectorAll('.vow-text');
      let i = 0;
      if (v.weston && v.weston.trim()) {
        sides[i].textContent = nameOf('weston');
        texts[i].textContent = v.weston;
        i += 1;
      }
      if (v.eve && v.eve.trim()) {
        sides[i].textContent = nameOf('eve');
        texts[i].textContent = v.eve;
      }
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

  /* ---------- pair settings (tap monogram) ---------- */
  function openPairSettings() {
    ensurePair(state);
    $('#editNameEve').value = nameOf('eve');
    $('#editInitialEve').value = initialOf('eve');
    $('#editNameWeston').value = nameOf('weston');
    $('#editInitialWeston').value = initialOf('weston');
    const panel = $('#pairSettings');
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    $('#editInitialEve').focus();
  }

  function closePairSettings() {
    const panel = $('#pairSettings');
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
  }

  function savePairSettings() {
    const nE = ($('#editNameEve').value || '').trim() || DEFAULT_PAIR.eve.name;
    const iE = ($('#editInitialEve').value || '').trim().slice(0, 2) || DEFAULT_PAIR.eve.initial;
    const nW = ($('#editNameWeston').value || '').trim() || DEFAULT_PAIR.weston.name;
    const iW = ($('#editInitialWeston').value || '').trim().slice(0, 2) || DEFAULT_PAIR.weston.initial;
    state.pair = {
      eve: { name: nE, initial: iE },
      weston: { name: nW, initial: iW }
    };
    save(state);
    applyPairLabels();
    closePairSettings();
    const active = $('.view.on');
    if (active && active.id === 'view-ask') renderAsk();
    if (active && active.id === 'view-vows') renderVows();
    if (active && active.id === 'view-home') renderHome();
  }

  $('#pairMark').addEventListener('click', openPairSettings);
  $('#pairMark').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPairSettings();
    }
  });
  $('#pairSettingsCancel').addEventListener('click', closePairSettings);
  $('#pairSettingsSave').addEventListener('click', savePairSettings);
  $('#pairSettingsBackdrop').addEventListener('click', closePairSettings);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#pairSettings').hidden) closePairSettings();
  });

  /* ---------- PWA ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  applyPairLabels();
  showView('home');
})();
