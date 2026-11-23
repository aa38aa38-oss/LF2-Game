# 在自己電腦上用 Gemini Pro 自動生圖、放進遊戲

這份是給「跑在使用者電腦上的 Claude」看的工作說明。使用者只要說「照 docs/LOCAL_GEMINI_WORKFLOW.md 生 ○○ 的圖」，Claude 就照下面做。

用的是使用者在 Chrome 裡已登入的 **Gemini Pro 網頁版**（gemini.google.com），不用 API、不另外付費。

---

## 一、環境（第一次做）

- 這個專案已經 clone 在本機（`git clone https://github.com/aa38aa38-oss/LF2-Game.git`）
- 需要 Python 3，以及兩個套件：`pip install pillow numpy`
- 推上 GitHub 需要使用者的 GitHub 帳號有這個 repo 的寫入權限（第一次 push 時瀏覽器會跳出 GitHub 登入）
- 瀏覽器控制用 **Claude in Chrome** 擴充功能，使用者已在同一個 Chrome 登入 Gemini

## 二、每一批圖的流程

1. **先列清單給使用者確認**：要生哪些圖、各自的 prompt（從 `docs/GEMINI_PROMPTS.md` 複製，不要自己改寫規格）。使用者說 OK 才開始。
2. **每個角色開一個新的 Gemini 對話**：
   - 先貼該角色的「第零步」說明，等 Gemini 回「了解」
   - 上傳參考圖：
     - 可選角色：`assets/select/<id>.webp`（有的話）＋ `assets/characters/<id>/idle.webp`
     - 敵人：先生「三視圖」，之後每張都上傳那張三視圖
   - 每次只貼**一段** prompt、只生**一張**
3. **下載**：在 Gemini 的圖上按下載。Chrome 會存到「下載」資料夾（檔案是 JFIF／JPG 格式），
   請到「下載」資料夾找到最新那張，**用 pillow 轉成真正的 PNG**（`Image.open(...).convert('RGB').save(....png)`，不要只改副檔名），放到
   `incoming/<批次名稱>/assets/characters/<id>/<動作名>.png`
   （頭像放 `assets/portraits/<id>.png`、大絕橫幅放 `assets/posters/<id>.png`）。
   三視圖另外存一份到專案的 `assets/ref/<id>.jpg`（縮到寬 1600、JPG 品質 85，檔案小），以後補圖可以重用。
   動作名照 `docs/GEMINI_PROMPTS.md` 的「存檔」欄位，例如 `spin.png`、`idle.png`。
4. **給使用者看**：三視圖和前一兩張先給使用者看，畫風 OK 之後就連續做完（使用者偏好省 Gemini 和 Claude 的用量）。不滿意就在同一個 Gemini 對話裡請它修，或重生。
   過程中不用每一步都回報，整批做完回報一次就好。
5. **被拒絕時**：Gemini 若說「涉及第三方權益」之類的拒絕 → 開新對話、重貼第零步、只上傳參考圖（不要上傳真人照片、prompt 裡不寫真實姓名），再試一次。
6. **整理進遊戲**：
   ```
   python3 tools/prep_assets.py incoming/<批次名稱>
   ```
   會自動去背、切格、對齊、統一大小、壓縮，並更新 `assets/manifest.json`。
   - 如果 Gemini 畫的格數跟規格不同（例如走路畫了 8 格），在 `tools/prep_assets.py` 的 `FRAMES_HINT` 加上 `'<id>/<動作>': 格數`
   - 如果有幾格人形疊在一起切不開，用 `FRAME_PICK` 只挑好的格子
7. **本機測試**：`python3 -m http.server 8123`，用瀏覽器開 `http://localhost:8123/`，進遊戲看新圖有沒有正常（不會跳動、大小一致、沒有綠邊）。
8. **上線**：
   ```
   git add -A
   git commit -m "加入 ○○ 的 Gemini 圖"
   git push origin HEAD:main
   git push origin HEAD:gh-pages
   ```
   約 1 分鐘後 https://aa38aa38-oss.github.io/LF2-Game/ 就會更新。

## 三、注意

- Gemini Pro 有每日用量上限，一次生很多張可能要分幾天
- 生圖時 Chrome 不能關、電腦不要睡眠
- 不要把真實姓名寫進 prompt，也不要上傳真人照片（除了「第一步・立繪」那種使用者明確要求的情況）
- `incoming/` 資料夾不需要 commit（已在 .gitignore）

---

## 自動模式（使用者已同意）

使用者希望**不要一直確認**，一次自動完成整關的圖。規則：
- 不用給使用者看三視圖或任何中間結果，照清單一路做到底
- 每張生好就自己判斷：角色有沒有面向右、背景是不是純綠、格數大致對、畫風跟主角一致。明顯不對就在同一個 Gemini 對話請它重畫（同一張最多重試 2 次），還是不行就跳過、記下來
- 全部做完後：`python tools/prep_assets.py incoming/<批次>` → 開本機伺服器進遊戲跑一遍劇情模式第一關，截 3～4 張關鍵畫面（街道小怪、頂樓小王、宮廟 Boss）
- 截圖沒問題就直接 `git pull` → commit → push 到 main 和 gh-pages，最後**一次**回報：做了哪些、跳過哪些、遊戲截圖
- Gemini 當天額度用完就停，回報停在哪一張，下次從那張繼續

## 要生哪些圖（精簡版，以省用量為主）

遊戲有「缺的動作自動用最接近的頂替」，所以敵人只要生關鍵的幾張：
- `idle` 頂替暈眩、起身、勝利；`walk` 頂替跑步
- `attack1` 頂替第二、三下攻擊和特技；`hurt` 頂替被打飛、倒地
- 一定要有 `idle`（其他動作的大小以它為基準）

### 第一關（議員選舉）全部清單

| 項目 | 存檔 | 要生的圖 | 狀態 |
|---|---|---|---|
| 陣頭小弟（小怪） | `characters/gang/` | 三視圖、idle、walk、attack1、hurt | ✅ 已完成 |
| 抗議群眾（小怪） | `characters/protester/` | idle、walk、attack1、hurt | ✅ 已完成（像素風） |
| 偷拍狗仔（小王） | `characters/paparazzi/` | idle、walk、attack1、hurt、special_fwd（閃光偷拍） | ✅ 已完成（像素風） |
| 角頭樁腳王（Boss） | `characters/kingpin/`、`portraits/kingpin.png` | idle、walk、attack1、hurt、special_fwd（鞭炮陣）、special_up（衝撞）、super（鞭炮雨）、頭像 | ✅ 已完成（像素風） |
| 第一關背景 | `scenery/` | `s1_sky`（天空）、`s1_street`（騎樓街屋）、`s1_apartment`（老公寓）、`s1_temple`（宮廟） | ✅ 已完成 |

- **敵人一律用簡單的 2D 像素風**（使用者要求：有辨識度就好、省用量），**不用三視圖、不用第零步說明**：開新對話直接貼 idle 的 prompt，之後每張都上傳那張 idle 當參考。陣頭小弟已經是漫畫風，保留不用重做。
- 角色的 prompt 在 `docs/GEMINI_PROMPTS.md` 的「第 1 關」各節；背景的 prompt 在「劇情第一關背景」那一節。照抄不要改。
- 背景圖存成 `incoming/<批次>/assets/scenery/s1_xxx.png`。街屋、公寓、宮廟要有綠幕（天空部分是純綠，遊戲會去背）；天空那張不用綠幕。
- 背景不用三視圖，也不用第零步說明，直接開新對話貼 prompt 即可。

### 第二關（市長選舉）清單

劇情模式改成三關：第一關立委選舉、第二關市長選舉、第三關總統選舉（最終關）。第二、三關沿用第一關的地圖骨架（老街 → 二樓 → 頂樓 → Boss 廣場），
還沒有專屬圖時，遊戲會借第一關的背景再蓋一層色調，新敵人用程式繪圖先頂著。

| 項目 | 存檔 | 要生的圖 | 狀態 |
|---|---|---|---|
| 網軍小編（小王） | `characters/troll/` | idle、walk、attack1、hurt、special_fwd（截圖帶風向） | |
| 財團董事長（Boss） | `characters/tycoon/`、`portraits/tycoon.png` | idle、walk、attack1、hurt、special_fwd（撒鈔票）、special_up（推土機衝撞）、super（錢坑）、頭像 | |
| 第二關背景 | `scenery/` | `s2_sky`（夜晚城市）、`s2_street`（夜市大街）、`s2_apartment`（商辦大樓）、`s2_temple`（市政府大樓） | |

- 小怪沿用第一關的陣頭小弟、抗議群眾。
- 第三關最終 Boss「幕後藏鏡人」（`mastermind`）的 prompt 也已經在 `docs/GEMINI_PROMPTS.md`，第三關背景之後再加。

### 之後（可選）：六位主角的「迴旋攻擊」
每人一張 `spin.png`（4 格），目前借用踢腿圖，不補也能玩。
角色 ID：`su`、`wang`、`han`、`ma`、`ko`、`guan`。
只補單張動作也沒關係，`prep_assets.py` 會拿遊戲裡現有的站立圖當大小基準。
