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

## 要生哪些圖（精簡版，以省用量為主）

遊戲有「缺的動作自動用最接近的頂替」，所以敵人只要生關鍵的幾張：
- `idle` 頂替暈眩、起身、勝利；`walk` 頂替跑步
- `attack1` 頂替第二、三下攻擊和特技；`hurt` 頂替被打飛、倒地
- 一定要有 `idle`（其他動作的大小以它為基準）

| 敵人 | ID | 要生的圖 | 狀態 |
|---|---|---|---|
| 陣頭小弟（小怪） | `gang` | 三視圖、idle、walk、attack1、hurt | ✅ 已完成 |
| 抗議群眾（小怪） | `protester` | 三視圖、idle、walk、attack1、hurt | |
| 偷拍狗仔（小王） | `paparazzi` | 三視圖、idle、walk、attack1、hurt、special_fwd（閃光偷拍） | |
| 角頭樁腳王（Boss） | `kingpin` | 三視圖、idle、walk、attack1、hurt、special_fwd（鞭炮陣）、special_up（衝撞）、super（鞭炮雨）、頭像 | |

prompt 都在 `docs/GEMINI_PROMPTS.md` 對應的「第 1 關」各節，照抄不要改。

### 之後（可選）：六位主角的「迴旋攻擊」
每人一張 `spin.png`（4 格），目前借用踢腿圖，不補也能玩。
角色 ID：`su`（衝衝院長）、`wang`（堅哥）、`han`（發大財議長）、`ma`（慢跑總統）、`ko`（阿北）、`guan`（館長）。
只補單張動作也沒關係，`prep_assets.py` 會拿遊戲裡現有的站立圖當大小基準。
