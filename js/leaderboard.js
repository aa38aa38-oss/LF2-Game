// 排行榜。目前存在瀏覽器本機（localStorage）。
// 之後要改成全球排行榜：把 config.js 的 provider 改成 'firebase' 並填入設定（教學見 README）。
import { store } from './util.js';
import { CONFIG } from './config.js';

const KEY = 'tpb_leaderboard_v1';
const MAX = 50;

const local = {
  async top(n = 10) {
    return store.get(KEY, []).slice(0, n);
  },
  async submit(entry) {
    const list = store.get(KEY, []);
    list.push(entry);
    list.sort((a, b) => b.score - a.score);
    store.set(KEY, list.slice(0, MAX));
    return list.indexOf(entry);
  },
};

// Firebase Firestore（REST API，不需要額外 SDK）
const firebase = {
  base() {
    const c = CONFIG.firebase;
    return `https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents`;
  },
  async top(n = 10) {
    const c = CONFIG.firebase;
    const r = await fetch(`${this.base()}:runQuery?key=${c.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: { from: [{ collectionId: 'scores' }], orderBy: [{ field: { fieldPath: 'score' }, direction: 'DESCENDING' }], limit: n },
      }),
    });
    const rows = await r.json();
    return rows
      .filter((x) => x.document)
      .map((x) => {
        const f = x.document.fields;
        return { name: f.name.stringValue, score: +f.score.integerValue, char: f.char.stringValue, mode: f.mode.stringValue, date: f.date.stringValue };
      });
  },
  async submit(e) {
    const c = CONFIG.firebase;
    await fetch(`${this.base()}/scores?key=${c.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: { name: { stringValue: e.name }, score: { integerValue: String(e.score) }, char: { stringValue: e.char }, mode: { stringValue: e.mode }, date: { stringValue: e.date } },
      }),
    });
    return -1;
  },
};

function provider() {
  return CONFIG.leaderboard === 'firebase' && CONFIG.firebase && CONFIG.firebase.apiKey ? firebase : local;
}

export const Leaderboard = {
  get isOnline() {
    return provider() === firebase;
  },
  async top(n = 10) {
    try {
      return await provider().top(n);
    } catch (e) {
      console.warn('排行榜讀取失敗，改用本機資料', e);
      return local.top(n);
    }
  },
  async submit(entry) {
    try {
      await local.submit(entry);
      if (provider() !== local) await provider().submit(entry);
    } catch (e) {
      console.warn('排行榜上傳失敗', e);
    }
  },
  async qualifies(score) {
    if (score <= 0) return false;
    const list = await this.top(10);
    return list.length < 10 || score > list[list.length - 1].score;
  },
};
