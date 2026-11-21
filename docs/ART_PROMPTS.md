# Gemini 生圖規劃

完整、可直接複製的 prompt 清單已移到 **[GEMINI_PROMPTS.md](GEMINI_PROMPTS.md)**（由 `tools/gen_prompts.py` 產生）。

每個角色需要的圖：

| 類別 | 檔案 | 說明 |
|---|---|---|
| 角色設定圖 | （自己留著） | 先生這張，之後每張都上傳它當參考 |
| 基本動作 18 組 | `assets/characters/<id>/<動作>.png` | idle、walk、run、jump、attack1～3、jump_attack、run_attack、defend、hurt、fall、down、getup、dizzy、roll、catch、victory |
| 技能 3 組＋大絕 | `assets/characters/<id>/special_fwd/up/down.png`、`super.png` | 三招技能各自的動作；只生一組 `special` 也可以三招共用 |
| 頭像 | `assets/portraits/<id>.png` | 血條、選角卡片、大絕橫幅的圓形頭像 |
| 大絕金句橫幅 | `assets/posters/<id>.png` | 4:1 超寬，臉在左邊 1/3，金句由遊戲疊上 |
| 選角／VS 立繪 | `assets/select/<id>.png` | 2:3 全身立繪 |

共用：三個場景背景、首頁主視覺、五張開場插畫。
