# 政壇大亂鬥 TAIWAN POLITICS BRAWL

搞笑二創同人網頁格鬥遊戲。台灣政壇人物 2.5D 大亂鬥（玩法類似小朋友齊打交）。
**角色與劇情純屬虛構，與真實人物無關；遊戲中不出現真實姓名。**

純 HTML5 Canvas + JavaScript，不需要編譯、不需要安裝任何套件，可以直接放在 GitHub Pages。

## 怎麼玩

| 按鍵 | 功能 |
|---|---|
| 方向鍵 / WASD | 移動（2.5D，可前後走）；連按兩下 ← → 奔跑 |
| J / Z | 攻擊（連按三下打出連段） |
| K / 空白鍵 | 跳躍（空中可以再按攻擊） |
| L / X | 防禦（按住；擋不住大絕） |
| U / C | 特技（消耗氣力） |
| I / V | 大絕（氣力滿時；會跳出角色海報與金句） |
| P / Esc | 暫停 |
| M | 靜音 |
| R | 首頁開排行榜 |

手機會自動顯示觸控按鈕（左邊十字鍵，右邊「攻／跳／防／特／絕」）。

### 模式
- **單挑模式**：自己挑一位對手 1v1
- **四人大亂鬥**：玩家 + 3 位電腦混戰，最後站著的贏
- **連戰生存**：一波接一波，第 4 波起一次來 2 個、第 7 波起 3 個，分數上排行榜

### 角色（第一版 6 位）
| 稱號 | 類型 | 特技 | 大絕 | 金句 |
|---|---|---|---|---|
| 衝衝院長 | 速度衝撞 | 光頭閃光（暈眩） | 衝衝衝 | 在那叫什麼！ |
| 堅哥 | 情緒爆發 | 指指點點（音波） | 除非踏過我的屍體 | Over my dead body！ |
| 發大財議長 | 重量範圍 | 議事槌 | 發大財（金幣雨） | 放馬過來，林北蛋你！ |
| 慢跑總統 | 遊擊陷阱 | 香蕉皮 | 環場馬拉松 | 我是很喜歡吃香蕉的人 |
| 阿北 | 技術續航 | 飛刀手術 | 葉克膜（回血＋電擊） | 賴祥德，沒有用的！ |
| 館長 | 近身摔投 | 過肩摔 | 開直播 | RRR！幫我開直播！ |

## 在自己電腦上跑

因為用了 ES modules，不能直接雙擊 `index.html`，要開一個本機伺服器：

```bash
python3 -m http.server 8000
```

然後打開瀏覽器到 http://localhost:8000

## 發布到 GitHub Pages

1. 把程式碼合併到 `main` 分支（或你想發布的分支）
2. 到 GitHub repo 頁面 → **Settings** → 左邊選單 **Pages**
3. **Source** 選 `Deploy from a branch`，**Branch** 選 `main`、資料夾選 `/ (root)`，按 **Save**
4. 等 1～2 分鐘，頁面上方會出現網址，通常是 `https://<你的帳號>.github.io/<repo 名稱>/`

repo 根目錄已經放了 `.nojekyll`，GitHub 不會亂處理檔案。

## 換成 Gemini 生成的美術圖

目前所有角色、背景、大絕海報都是**程式畫的暫時素材**。生圖規格、檔名、每個角色每個動作的 prompt 都在 [`docs/ART_PROMPTS.md`](docs/ART_PROMPTS.md)。

圖放進 `assets/` 之後，在 `assets/manifest.json` 登記，遊戲就會自動改用圖檔；沒登記的部分繼續用程式畫的。

## 排行榜

目前存在**瀏覽器本機**（localStorage），只有自己看得到。
要改成全球排行榜，之後申請 Firebase，把設定填進 `js/config.js` 就好（程式已經寫好，用 Firestore REST API，不需要額外套件）。申請步驟之後再一起做。

## 專案結構

```
index.html          入口
css/style.css       版面與觸控按鈕
js/main.js          遊戲迴圈、場景切換
js/battle.js        對戰場景（HUD、大絕插圖、勝負判定）
js/fighter.js       角色狀態機與物理
js/moves.js         每個角色的特技與大絕
js/characters.js    角色資料（稱號、金句、能力、外型）
js/ai.js            電腦 AI
js/sprites.js       程式繪製的角色（有圖檔時改用圖檔）
js/stages.js        三個場景背景
js/fx.js            特效
js/audio.js         8-bit 音效與音樂（程式產生）
js/input.js         鍵盤／觸控輸入（之後手機搖桿也接這裡）
js/leaderboard.js   排行榜（本機 / Firebase）
js/assets.js        外部圖檔載入
js/scenes/          開場、首頁、操作說明、選模式、選角、選場地、VS、結算、排行榜
assets/             放 Gemini 生成的圖
docs/               設計文件與生圖 prompt
```
