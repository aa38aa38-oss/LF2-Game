// 劇情模式「最快通關」線上排行榜（Google 試算表 + Apps Script）
// 是蓋在遊戲上面的 HTML 視窗，手機才叫得出鍵盤輸入暱稱。網址設定在 config.js 的 speedboardUrl。
import { CONFIG } from './config.js';
import { store } from './util.js';

const DIFFS = [['easy', '簡單'], ['normal', '普通'], ['hard', '困難']];
const DIFF_NAME = Object.fromEntries(DIFFS);
const NAME_MAX = 12;

export function fmtClear(sec) {
  const m = Math.floor(sec / 60), s = sec - m * 60;
  return `${m}:${s.toFixed(1).padStart(4, '0')}`;
}

const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const SpeedBoard = {
  url: new URLSearchParams(location.search).get('lb') || CONFIG.speedboardUrl || '',
  get enabled() {
    return !!this.url;
  },
  el: null,
  diff: 'normal',
  board: null,
  mine: null,
  submitted: false,
  isOpen: false,
  onLocal: null,
  async req(opts) {
    const ac = new AbortController(), tm = setTimeout(() => ac.abort(), 15000);
    try {
      const r = await fetch(this.url, { signal: ac.signal, redirect: 'follow', ...opts });
      return await r.json();
    } finally {
      clearTimeout(tm);
    }
  },
  build() {
    if (this.el) return;
    const el = (this.el = document.createElement('div'));
    el.id = 'sb';
    el.hidden = true;
    el.innerHTML = `<div class="box"><div class="head"><b>🏆 劇情模式・最快通關榜</b><button class="x" aria-label="關閉">✕</button></div>
      <div class="mineWrap"></div>
      <div class="tabs">${DIFFS.map(([d, n]) => `<button data-d="${d}">${n}</button>`).join('')}</div>
      <div class="list"></div>
      <div class="foot"><span>同一個暱稱只留最快的一次</span><button class="loc">本機分數榜 ▶</button></div></div>`;
    (document.getElementById('wrap') || document.body).appendChild(el);
    // 視窗裡的點擊、按鍵不要傳到遊戲
    for (const ev of ['pointerdown', 'touchstart']) el.addEventListener(ev, (e) => e.stopPropagation(), { passive: true });
    el.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') this.close();
    });
    el.querySelector('.x').onclick = () => this.close();
    el.addEventListener('click', (e) => e.target === el && this.close());
    el.querySelectorAll('.tabs button').forEach((b) => (b.onclick = () => {
      this.diff = b.dataset.d;
      this.renderList();
    }));
    el.querySelector('.loc').onclick = () => {
      this.close();
      if (this.onLocal) this.onLocal();
    };
  },
  // mine = { diff, time, char, cheat } 代表剛破關、可以上傳；onClose 關掉視窗時呼叫
  open(mine, onClose) {
    this.build();
    if (mine !== this.mine) this.submitted = false;
    this.mine = mine || null;
    if (mine) this.diff = mine.diff;
    this.onClose = onClose || null;
    this.isOpen = true;
    this.el.hidden = false;
    this.el.querySelector('.loc').hidden = !!mine;
    this.renderMine();
    this.renderList();
    this.load();
  },
  close() {
    if (!this.isOpen) return;
    this.el.hidden = true;
    this.isOpen = false;
    const a = document.activeElement;
    if (a && this.el.contains(a)) a.blur();
    const f = this.onClose;
    this.onClose = null;
    if (f) f();
  },
  async load() {
    this.loading = true;
    this.err = '';
    this.renderList();
    try {
      const j = await this.req({ method: 'GET' });
      if (j && j.board) this.board = j.board;
      else this.err = '讀取失敗';
    } catch (e) {
      this.err = '連不上排行榜，請檢查網路';
    }
    this.loading = false;
    this.renderList();
  },
  renderMine() {
    const w = this.el.querySelector('.mineWrap'), m = this.mine;
    if (!m) {
      w.innerHTML = '';
      return;
    }
    const head = `<p>🎉 你的通關時間：${DIFF_NAME[m.diff]}・<b>${fmtClear(m.time)}</b>（${esc(m.char)}）</p>`;
    if (m.cheat) {
      w.innerHTML = `<div class="mine">${head}<div class="st">這次有開密技或測試模式，成績不能上榜喔！</div></div>`;
      return;
    }
    if (this.submitted) {
      w.innerHTML = `<div class="mine">${head}<div class="st ok">✅ 已上傳成績！</div></div>`;
      return;
    }
    w.innerHTML = `<div class="mine">${head}<div class="row"><input maxlength="${NAME_MAX}" placeholder="輸入暱稱（最多 ${NAME_MAX} 字）" autocomplete="off" value="${esc(store.get('tpb_lastname', ''))}"><button class="go">上傳</button></div><div class="st"></div></div>`;
    const inp = w.querySelector('input'), go = w.querySelector('.go'), st = w.querySelector('.st');
    inp.addEventListener('keydown', (e) => e.key === 'Enter' && go.click());
    go.onclick = async () => {
      const name = inp.value.trim().slice(0, NAME_MAX);
      if (!name) {
        st.textContent = '請先輸入暱稱';
        inp.focus();
        return;
      }
      go.disabled = true;
      st.className = 'st';
      st.textContent = '上傳中…';
      try {
        const j = await this.req({
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // 用 text/plain 才不會被 CORS 預檢擋掉
          body: JSON.stringify({ name, diff: m.diff, time: Math.round(m.time * 10) / 10, char: m.char }),
        });
        if (!j || !j.ok) throw new Error((j && j.error) || '上傳失敗');
        store.set('tpb_lastname', name);
        this.myName = name;
        this.submitted = true;
        if (j.board) this.board = j.board;
        this.diff = m.diff;
        inp.blur();
        this.renderMine();
        this.renderList();
        if (this.onSubmit) this.onSubmit();
      } catch (e) {
        go.disabled = false;
        st.className = 'st bad';
        st.textContent = e.name === 'AbortError' || e instanceof TypeError ? '連不上排行榜，請稍後再試' : e.message;
      }
    };
  },
  renderList() {
    if (!this.el) return;
    this.el.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.d === this.diff));
    const box = this.el.querySelector('.list');
    if (this.loading && !this.board) return void (box.innerHTML = '<div class="msg">讀取中…</div>');
    if (this.err && !this.board) return void (box.innerHTML = `<div class="msg">${esc(this.err)}</div>`);
    const rows = (this.board && this.board[this.diff]) || [];
    if (!rows.length) return void (box.innerHTML = '<div class="msg">還沒有人上榜，快來搶第一！</div>');
    const medal = ['🥇', '🥈', '🥉'];
    box.innerHTML =
      '<ol>' +
      rows
        .map(
          (r, i) =>
            `<li class="${this.myName && r.name === this.myName ? 'me' : ''}"><span class="rk">${medal[i] || i + 1}</span><span class="nm">${esc(r.name)}</span><span class="ch">${esc(r.char || '')}</span><span class="tm">${fmtClear(r.time)}</span><span class="dt">${esc(r.date || '')}</span></li>`,
        )
        .join('') +
      '</ol>';
  },
};
