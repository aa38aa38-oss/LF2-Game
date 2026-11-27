// 角色資料：稱號、金句、能力值、外型（給程式繪圖用）
// 注意：遊戲中不出現真實姓名，只用稱號與造型辨識。

export const CHARS = [
  {
    id: 'su',
    title: '衝衝院長',
    type: '速度衝撞型',
    quote: '在那叫什麼！',
    specials: [
      { cmd: '防→攻', name: '光頭閃光', desc: '光頭反射強光，讓前方對手暈眩' },
      { cmd: '防↑攻', name: '衝天頭槌', desc: '往上衝的頭槌，把人頂飛' },
      { cmd: '防↓攻', name: '衝刺頭槌', desc: '低頭往前暴衝撞人' },
    ],
    superMove: { name: '衝衝衝', desc: '自動衝向最近的對手，撞到就連續頭槌再頂飛' },
    color: '#f28c28',
    color2: '#5a2a00',
    stats: { pow: 3, spd: 5, def: 3 },
    mul: { pow: 0.95, spd: 1.1, def: 0.98 },
    look: {
      skin: '#f0bd8c', hair: 'bald', hairColor: '#5b4636', glasses: 'rect', brows: 'angry',
      mask: '#f39a2b', top: 'suit', topColor: '#2a2e38', shirt: '#eeeeee', tie: '#9aa3b5',
      bottom: '#23262e', shoes: '#111111', tw: 20, hr: 13.5,
    },
  },
  {
    id: 'wang',
    title: '堅哥',
    type: '情緒爆發型',
    quote: 'Over my dead body！',
    specials: [
      { cmd: '防→攻', name: '指指點點', desc: '激動手指發出音波，遠距攻擊' },
      { cmd: '防↑攻', name: '拍案而起', desc: '拍桌震波，震開身邊所有人' },
      { cmd: '防↓攻', name: '躺地抗議', desc: '躺下不走，踩到他的人會跌倒' },
    ],
    superMove: { name: '除非踏過我的屍體', desc: '左右兩道震波打倒附近的人，期間刀槍不入' },
    color: '#c9a227',
    color2: '#2a2000',
    stats: { pow: 4, spd: 3, def: 4 },
    mul: { pow: 1.12, spd: 1.02, def: 1.1 },
    look: {
      skin: '#eab78a', hair: 'long', hairColor: '#1c1a1e', glasses: null, brows: 'intense',
      top: 'suit', topColor: '#161618', shirt: '#f4f4f4', tie: '#111111',
      bottom: '#161618', shoes: '#0b0b0b', tw: 21, hr: 13.5,
    },
  },
  {
    id: 'han',
    title: '發大財議長',
    type: '重量範圍型',
    quote: '放馬過來，林北蛋你！',
    specials: [
      { cmd: '防→攻', name: '議事槌', desc: '大槌敲地，震倒前方對手' },
      { cmd: '防↑攻', name: '貨出得去', desc: '丟出貨箱，砸中就倒' },
      { cmd: '防↓攻', name: '滷肉飯補血', desc: '吃一碗滷肉飯回血' },
    ],
    superMove: { name: '發大財', desc: '每個對手頭上下金幣雨，最後砸金元寶' },
    color: '#2f6fd6',
    color2: '#0a1a40',
    stats: { pow: 5, spd: 2, def: 4 },
    mul: { pow: 1.3, spd: 0.94, def: 1.15 },
    look: {
      skin: '#f2c49a', hair: 'baldSides', hairColor: '#b8b8b8', glasses: null, brows: 'soft',
      top: 'shirt', topColor: '#f6f6f2', shirt: '#f6f6f2', tie: null, belly: true,
      bottom: '#1f2b45', shoes: '#2a1a10', tw: 25, hr: 15, prop: 'gavel',
    },
  },
  {
    id: 'ma',
    title: '慢跑總統',
    type: '遊擊陷阱型',
    quote: '我是很喜歡吃香蕉的人',
    specials: [
      { cmd: '防→攻', name: '香蕉皮', desc: '丟出香蕉皮，踩到就滑倒' },
      { cmd: '防↑攻', name: '香蕉迴力鏢', desc: '丟出會飛回來的香蕉' },
      { cmd: '防↓攻', name: '慢跑閃避', desc: '無敵衝刺，閃過攻擊' },
    ],
    superMove: { name: '香蕉大放送', desc: '六根追蹤香蕉，先定住再打倒' },
    color: '#38b6e8',
    color2: '#06324a',
    stats: { pow: 2, spd: 5, def: 3 },
    mul: { pow: 0.95, spd: 1.1, def: 1.0 },
    look: {
      skin: '#f1c39a', hair: 'side', hairColor: '#17140f', glasses: null, brows: 'soft', headband: '#e23b3b',
      top: 'tee', topColor: '#ffffff', trim: '#2a7fd0', shorts: '#2a7fd0',
      bottom: '#f1c39a', shoes: '#f4f4f4', tw: 19, hr: 13,
    },
  },
  {
    id: 'ko',
    title: '阿北',
    type: '技術續航型',
    quote: '賴祥德，沒有用的！',
    specials: [
      { cmd: '防→攻', name: '飛刀手術', desc: '一次丟出三把手術刀' },
      { cmd: '防↑攻', name: '電擊器', desc: '近身電擊，讓對手暈眩' },
      { cmd: '防↓攻', name: '單車環島', desc: '騎單車往前衝撞' },
    ],
    superMove: { name: '葉克膜', desc: '先回一點血，再電擊畫面上所有對手' },
    color: '#2ec4b6',
    color2: '#053a35',
    stats: { pow: 3, spd: 3, def: 3 },
    mul: { pow: 1.16, spd: 1.04, def: 1.1 },
    look: {
      skin: '#f0c29a', hair: 'short', hairColor: '#3b3b40', glasses: 'round', brows: 'flat', expr: 'flat',
      top: 'coat', topColor: '#fbfbfb', shirt: '#4b7bd1', tie: null,
      bottom: '#3a3f4b', shoes: '#1a1a1a', tw: 21, hr: 14,
    },
  },
  {
    id: 'guan',
    title: '館長',
    type: '近身摔投型',
    quote: 'RRR！幫我開直播！',
    specials: [
      { cmd: '防→攻', name: '過肩摔', desc: '抓住眼前對手，往後狠摔' },
      { cmd: '防↑攻', name: '館長上勾拳', desc: '跳起上勾拳，把人打上天' },
      { cmd: '防↓攻', name: '啞鈴投擲', desc: '丟出啞鈴砸人' },
    ],
    superMove: { name: '開直播', desc: '撲向對手狂打再上勾拳，近身打中傷害最高' },
    color: '#e0393e',
    color2: '#3a0608',
    stats: { pow: 5, spd: 3, def: 5 },
    mul: { pow: 1.08, spd: 0.98, def: 1.06 },
    look: {
      skin: '#d9a173', hair: 'bald', hairColor: '#222', glasses: null, brows: 'angry', beard: '#1d1712',
      top: 'tank', topColor: '#141414', tie: null, muscle: true,
      bottom: '#4d5a36', shoes: '#141414', tw: 27, hr: 13.5,
    },
  },
  {
    id: 'shen',
    title: '黑熊教授',
    type: '遠距控場型',
    quote: '台北順起來！',
    specials: [
      { cmd: '防→攻', name: '演講音波', desc: '對著麥克風演講，音波往前推' },
      { cmd: '防↑攻', name: '黑熊撲擊', desc: '召喚黑熊往前撲，把人撲倒' },
      { cmd: '防↓攻', name: '丟防衛手冊', desc: '丟出厚厚的防衛手冊砸人' },
    ],
    superMove: { name: '洋流', desc: '召喚巨大洋流，一波波大浪往前橫掃全場' },
    color: '#3b7dd8',
    color2: '#0a1c3a',
    stats: { pow: 3, spd: 3, def: 3 },
    mul: { pow: 1.04, spd: 1.02, def: 1.04 },
    look: {
      skin: '#f0c29a', hair: 'long', hairColor: '#141414', glasses: 'rect', brows: 'soft',
      top: 'suit', topColor: '#263a66', shirt: '#151515', tie: null,
      bottom: '#23262e', shoes: '#111111', tw: 21, hr: 14.5,
    },
  },
  {
    id: 'chiang',
    title: '帥氣市長',
    type: '帥氣速攻型',
    quote: '輝達、牛奶、大巨蛋！',
    specials: [
      { cmd: '防→攻', name: '帥氣閃光', desc: '比讚放出閃光，讓前方對手暈眩' },
      { cmd: '防↑攻', name: '白皮書連發', desc: '一次甩出三本市政白皮書' },
      { cmd: '防↓攻', name: '晨跑衝刺', desc: '往前衝刺撞人' },
    ],
    superMove: { name: '團結向前', desc: '滿天煙火落在每個對手頭上' },
    color: '#5aa9ff',
    color2: '#0a2a50',
    stats: { pow: 3, spd: 5, def: 2 },
    mul: { pow: 1.0, spd: 1.1, def: 0.98 },
    look: {
      skin: '#f2c49a', hair: 'side', hairColor: '#111111', glasses: null, brows: 'intense',
      top: 'suit', topColor: '#1e2f5c', shirt: '#bcd8f5', tie: null,
      bottom: '#1e2f5c', shoes: '#0b0b0b', tw: 20, hr: 13.5,
    },
  },
  {
    id: 'tsai',
    title: '辣台妹總統',
    type: '冷靜控場型',
    quote: '不錯喔，你們畢竟是死忠的！',
    specials: [
      { cmd: '防→攻', name: '貓咪出擊', desc: '放出貓咪往前撲，抓傷對手' },
      { cmd: '防↑攻', name: '辣椒火焰', desc: '推出一道辣椒火焰' },
      { cmd: '防↓攻', name: '眼鏡閃光', desc: '推眼鏡反光，讓附近對手暈眩' },
    ],
    superMove: { name: '綠鳥出巢', desc: '一大群綠色小鳥飛出，啄住再撞飛對手' },
    color: '#e05a8a',
    color2: '#3a0a1e',
    stats: { pow: 3, spd: 3, def: 4 },
    mul: { pow: 1.04, spd: 1.0, def: 1.1 },
    look: {
      skin: '#f2c8a0', hair: 'long', hairColor: '#1a1414', glasses: 'round', brows: 'soft', expr: 'smile',
      top: 'suit', topColor: '#141414', shirt: '#f2ead8', tie: null,
      bottom: '#141414', shoes: '#0b0b0b', tw: 19, hr: 13.5,
    },
  },
  {
    id: 'hsieh',
    title: '龍介仙',
    type: '戲劇爆發型',
    quote: '一生監督你一人！',
    specials: [
      { cmd: '防→攻', name: '布袋戲掌', desc: '戲偶打出金色掌風' },
      { cmd: '防↑攻', name: '台語大聲公', desc: '用台語大喊，震開身邊所有人' },
      { cmd: '防↓攻', name: '丟虱目魚', desc: '丟出一尾虱目魚砸人' },
    ],
    superMove: { name: '愛的監督', desc: '放出滿天粉紅愛心，追著對手跑' },
    color: '#e0a020',
    color2: '#3a2600',
    stats: { pow: 4, spd: 3, def: 3 },
    mul: { pow: 1.12, spd: 1.0, def: 1.04 },
    look: {
      skin: '#e8b88c', hair: 'side', hairColor: '#111111', glasses: 'rect', brows: 'angry', expr: 'shout',
      top: 'shirt', topColor: '#f6f6f2', shirt: '#f6f6f2', tie: null,
      bottom: '#1e2330', shoes: '#0b0b0b', tw: 21, hr: 14,
    },
  },
];

export const CHAR_BY_ID = Object.fromEntries(CHARS.map((c) => [c.id, c]));

// ───────── 劇情模式的敵人（不出現在選角畫面） ─────────
// 都是虛構的「選舉路上會遇到的麻煩」，不對應任何真實人物
export const NPCS = [
  {
    id: 'gang', title: '陣頭小弟', npc: true, quote: '', color: '#e0b040', color2: '#3a2a00',
    specials: [{ name: '丟鞭炮' }], superMove: { name: '' }, stats: { pow: 2, spd: 3, def: 1 },
    mul: { pow: 0.5, spd: 0.95, def: 0.9 },
    look: {
      skin: '#d8a070', hair: 'short', hairColor: '#e2b13c', glasses: null, brows: 'angry',
      top: 'tank', topColor: '#f2f2f2', tie: null, bottom: '#2f2f35', shoes: '#2a64c8', tw: 19, hr: 13,
    },
  },
  {
    id: 'protester', title: '抗議群眾', npc: true, quote: '', color: '#9a8c6a', color2: '#2a2618',
    specials: [{ name: '大聲公' }], superMove: { name: '' }, stats: { pow: 2, spd: 2, def: 2 },
    mul: { pow: 0.5, spd: 0.85, def: 0.95 },
    look: {
      skin: '#e8b88c', hair: 'side', hairColor: '#8a8a8a', glasses: 'round', brows: 'angry', headband: '#ffffff',
      top: 'tee', topColor: '#e9e2cc', trim: '#c0392b', bottom: '#4a4a52', shoes: '#222', tw: 20, hr: 13.5,
    },
  },
  {
    id: 'paparazzi', title: '偷拍狗仔', npc: true, quote: '獨家！明天頭版就是你！', color: '#b59a6a', color2: '#2e2414',
    specials: [{ name: '閃光偷拍' }, { name: '緋聞合成照' }, { name: '開溜' }], superMove: { name: '狗仔連拍' }, stats: { pow: 3, spd: 4, def: 2 },
    mul: { pow: 0.85, spd: 1.1, def: 0.95 },
    look: {
      skin: '#e2b088', hair: 'short', hairColor: '#2a2420', glasses: 'rect', brows: 'flat', mask: null,
      top: 'coat', topColor: '#b59a6a', shirt: '#3a3a3a', tie: null, bottom: '#3a3530', shoes: '#1a1a1a', tw: 20, hr: 13.5, prop: 'phone',
    },
  },
  {
    id: 'kingpin', title: '角頭樁腳王', npc: true, boss: true, quote: '這區的票，攏是阮在喬的！', color: '#8a1fb0', color2: '#2a0636',
    specials: [{ name: '鞭炮陣' }, { name: '角頭衝撞' }, { name: '叫小弟' }], superMove: { name: '鞭炮雨' }, stats: { pow: 5, spd: 2, def: 5 },
    mul: { pow: 1.0, spd: 0.9, def: 1.1 },
    look: {
      skin: '#c98d5e', hair: 'short', hairColor: '#141210', glasses: 'rect', brows: 'angry', beard: null,
      top: 'shirt', topColor: '#7a1fa0', shirt: '#7a1fa0', tie: null, belly: true, bottom: '#1d1d22', shoes: '#c8a030', tw: 27, hr: 15,
    },
  },
  // ───── 第二關「市長選舉」─────
  {
    id: 'troll', title: '網軍小編', npc: true, quote: '兄弟們，出征！', color: '#3a7ad8', color2: '#0e1e3a',
    specials: [{ name: '截圖帶風向' }, { name: '假新聞' }, { name: '下線' }], superMove: { name: '網軍出征' }, stats: { pow: 3, spd: 4, def: 2 },
    mul: { pow: 0.9, spd: 1.1, def: 0.95 },
    look: {
      skin: '#f0c49a', hair: 'short', hairColor: '#2a2a40', glasses: 'round', brows: 'flat',
      top: 'coat', topColor: '#3a4a6a', shirt: '#22283a', tie: null, bottom: '#2a2a32', shoes: '#eeeeee', tw: 19, hr: 13.5, prop: 'phone',
    },
  },
  {
    id: 'tycoon', title: '財團董事長', npc: true, boss: true, quote: '市政府的標案，早就內定好了！', color: '#c8a030', color2: '#2a1e04',
    specials: [{ name: '撒鈔票' }, { name: '推土機衝撞' }, { name: '叫保鑣' }], superMove: { name: '金權推土機' }, stats: { pow: 5, spd: 2, def: 5 },
    mul: { pow: 1.05, spd: 0.92, def: 1.15 },
    look: {
      skin: '#eab78a', hair: 'side', hairColor: '#d8d8d8', glasses: 'rect', brows: 'angry',
      top: 'suit', topColor: '#c8a030', shirt: '#ffffff', tie: '#b01818', belly: true, bottom: '#2a2418', shoes: '#111111', tw: 26, hr: 15,
    },
  },
  // 第二關小怪
  {
    id: 'vendor', title: '夜市攤販', npc: true, quote: '', color: '#d86a2a', color2: '#2a1408',
    specials: [{ name: '丟塑膠椅' }], superMove: { name: '' }, stats: { pow: 2, spd: 2, def: 2 },
    mul: { pow: 0.55, spd: 0.9, def: 0.95 },
    look: {
      skin: '#d8a070', hair: 'short', hairColor: '#1a1a1a', glasses: null, brows: 'angry', headband: '#ffffff',
      top: 'tank', topColor: '#f0e8d8', bottom: '#3a4a7a', shoes: '#2a64c8', belly: true, tw: 22, hr: 13.5,
    },
  },
  {
    id: 'canvasser', title: '發傳單工讀生', npc: true, quote: '', color: '#2ab86a', color2: '#062a14',
    specials: [{ name: '撒傳單' }], superMove: { name: '' }, stats: { pow: 2, spd: 4, def: 1 },
    mul: { pow: 0.45, spd: 1.05, def: 0.9 },
    look: {
      skin: '#f0c49a', hair: 'short', hairColor: '#3a2a20', glasses: null, brows: 'soft',
      top: 'tee', topColor: '#2ab86a', trim: '#ffffff', bottom: '#2a2a32', shoes: '#eeeeee', tw: 18, hr: 13.5,
    },
  },
  {
    id: 'bodyguard', title: '黑衣保鑣', npc: true, quote: '', color: '#222228', color2: '#08080a',
    specials: [{ name: '熊抱衝撞' }], superMove: { name: '' }, stats: { pow: 3, spd: 2, def: 3 },
    mul: { pow: 0.65, spd: 0.9, def: 1.0 },
    look: {
      skin: '#c98d5e', hair: 'bald', hairColor: '#141210', glasses: 'rect', brows: 'angry',
      top: 'suit', topColor: '#18181c', shirt: '#ffffff', tie: '#18181c', bottom: '#18181c', shoes: '#0b0b0b', tw: 24, hr: 14,
    },
  },
  // 第三關小怪
  {
    id: 'reporter', title: '政論名嘴', npc: true, quote: '', color: '#3a5aa8', color2: '#0a142a',
    specials: [{ name: '爆料大聲公' }], superMove: { name: '' }, stats: { pow: 2, spd: 2, def: 2 },
    mul: { pow: 0.55, spd: 0.9, def: 0.95 },
    look: {
      skin: '#eab78a', hair: 'side', hairColor: '#4a3a30', glasses: 'rect', brows: 'flat',
      top: 'suit', topColor: '#3a5aa8', shirt: '#ffffff', tie: '#d8202a', bottom: '#22283a', shoes: '#111111', tw: 20, hr: 13.5, prop: 'phone',
    },
  },
  {
    id: 'cheerleader', title: '造勢啦啦隊', npc: true, quote: '', color: '#ff5aa8', color2: '#3a0a24',
    specials: [{ name: '加油打氣（幫敵人回血）' }], superMove: { name: '' }, stats: { pow: 1, spd: 3, def: 1 },
    mul: { pow: 0.4, spd: 1.0, def: 0.85 },
    look: {
      skin: '#f6caa0', hair: 'long', hairColor: '#e8b830', glasses: null, brows: 'soft', headband: '#ff5aa8',
      top: 'tank', topColor: '#ff5aa8', bottom: '#ffffff', shoes: '#ffffff', tw: 17, hr: 13,
    },
  },
  {
    id: 'votebuyer', title: '買票樁腳', npc: true, quote: '', color: '#a8862a', color2: '#2a1e04',
    specials: [{ name: '撒買票紅包' }], superMove: { name: '' }, stats: { pow: 2, spd: 2, def: 2 },
    mul: { pow: 0.5, spd: 0.9, def: 0.95 },
    look: {
      skin: '#d9a57a', hair: 'baldSides', hairColor: '#8a8a8a', glasses: null, brows: 'flat',
      top: 'shirt', topColor: '#f0e0a0', shirt: '#f0e0a0', tie: null, belly: true, bottom: '#3a3530', shoes: '#4a2a10', tw: 24, hr: 14,
    },
  },
  // 第三關小王
  {
    id: 'influencer', title: '直播網紅', npc: true, quote: '寶寶們，愛心刷起來！', color: '#ff7ad8', color2: '#2a0a24',
    specials: [{ name: '直播閃光' }, { name: '留言轟炸' }, { name: '叫粉絲' }], superMove: { name: '抖內愛心雨' }, stats: { pow: 3, spd: 4, def: 2 },
    mul: { pow: 0.9, spd: 1.1, def: 0.95 },
    look: {
      skin: '#f6caa0', hair: 'side', hairColor: '#ff7ad8', glasses: 'round', brows: 'soft',
      top: 'coat', topColor: '#ffffff', shirt: '#ff7ad8', tie: null, bottom: '#2a2a32', shoes: '#ff7ad8', tw: 18, hr: 13.5, prop: 'phone',
    },
  },
  // ───── 第三關「總統選舉」最終 Boss ─────
  {
    id: 'mastermind', title: '幕後藏鏡人', npc: true, boss: true, quote: '這場選舉，從頭到尾都是我在操盤。', color: '#5a1a8a', color2: '#12041e',
    specials: [{ name: '黑金鞭炮陣' }, { name: '黑箱衝撞' }, { name: '動員全部人馬' }], superMove: { name: '黑手操盤' }, stats: { pow: 5, spd: 4, def: 5 },
    mul: { pow: 1.3, spd: 1.08, def: 1.3 },
    look: {
      skin: '#d9a57a', hair: 'long', hairColor: '#0e0c12', glasses: 'rect', brows: 'intense',
      top: 'suit', topColor: '#141018', shirt: '#2a0a3a', tie: '#8a1fb0', bottom: '#141018', shoes: '#0b0b0b', tw: 24, hr: 14.5,
    },
  },
];
for (const n of NPCS) CHAR_BY_ID[n.id] = n;
