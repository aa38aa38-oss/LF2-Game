# Gemini 生圖規劃與 Prompt 清單

這份文件列出遊戲需要的**所有圖檔**：規格、檔名，以及可以直接貼進 Gemini 的 prompt。
圖放進 `assets/` 並在 `assets/manifest.json` 登記後，遊戲就會改用圖檔；沒登記的部分繼續用程式畫的暫時素材，所以可以**一張一張慢慢換**。

---

## 0. 生圖流程（建議照這個順序）

1. **先做每個角色的「設定圖」**（第 2 節），挑一張最滿意的當作「標準長相」
2. 之後每一個動作，都**把設定圖一起上傳給 Gemini 當參考**，再貼動作的 prompt，長相才會一致
3. 動作圖建議**一次生成一整條動作條**（同一張圖裡由左到右排好幾格），比一格一格生更一致
4. 背景一律用**純綠色 `#00FF00`**，遊戲會自動把綠色去背。Gemini 很難直接給透明背景
5. 存成 PNG，照下面的檔名放進資料夾，再改 `manifest.json`

> 💡 Prompt 用英文，Gemini 生圖的效果通常比較穩。Prompt 裡**不要寫真實姓名**，只寫外型描述。部分 AI 對真人肖像有限制，用外型描述做漫畫式誇張比較不會被擋。

---

## 1. 共用風格前綴（每個 prompt 開頭都貼這段）

```
16-bit pixel art, retro arcade beat 'em up game sprite, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style,
```

角色動作圖再加上這段結尾：

```
side view facing right, full body, single character, centered, feet touching the bottom edge, plain solid pure green background (#00FF00), no ground shadow, no text, no watermark, no border
```

---

## 2. 角色外型描述（【角色描述】）

| 角色 ID | 稱號 | 【角色描述】（貼在 prompt 裡） |
|---|---|---|
| `su` | 衝衝院長 | `a bald elderly Taiwanese male politician, very shiny bald head with a bright highlight, thin rectangular glasses, thick stern eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce energetic attitude` |
| `wang` | 堅哥 | `a middle-aged Taiwanese male politician with shoulder-length straight black hair swept back, intense passionate eyes, thick eyebrows, black suit, white shirt, black tie, very emotional dramatic expression` |
| `han` | 發大財議長 | `a chubby round-faced elderly Taiwanese man, bald on top with grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight belly, dark navy trousers, brown shoes, holding a wooden judge's gavel` |
| `ma` | 慢跑總統 | `a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger` |
| `ko` | 阿北 | `a middle-aged Taiwanese male doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a blue shirt, dark grey trousers` |
| `guan` | 館長 | `a huge muscular bald Taiwanese man with a full black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym bodybuilder livestreamer` |

### 角色設定圖 prompt（每人一張，當作之後的參考圖）

```
[共用風格前綴] character reference sheet of 【角色描述】, three views side by side: front view, side view facing right, back view, full body, same character, plain solid pure green background (#00FF00), no text
```

---

## 3. 角色動作圖

### 3.1 規格
- **一條動作條**：所有格子橫向排成一列，**每格一樣寬**，例如 4 格就是 2048×512（每格 512×512）
- 每一格：角色**面向右**、**腳底貼齊下緣**、身體左右置中、每格**角色大小一致**
- 遊戲顯示時每格高度約 128px，所以細節不用太多，輪廓清楚最重要
- 存檔：`assets/characters/<角色ID>/<動作名>.png`，例如 `assets/characters/su/idle.png`

### 3.2 動作清單（每個角色都要這 20 組）

| 動作名（檔名） | 格數 | 用在 | 動作描述（【動作】，貼在 prompt 裡） |
|---|---|---|---|
| `idle` | 4 | 站立待機 | `fighting stance, fists raised, slight breathing bob, looping idle animation` |
| `walk` | 6 | 走路 | `walking forward cycle, arms swinging, looping walk animation` |
| `run` | 6 | 奔跑 | `running fast cycle, body leaning forward, big strides, looping run animation` |
| `jump` | 2 | 跳躍 | `jumping in the air, knees tucked, arms up` |
| `attack1` | 3 | 第一拳 | `quick straight jab punch with the front arm: wind-up, full extension, recover` |
| `attack2` | 3 | 第二拳 | `cross punch with the back arm, torso twisting: wind-up, full extension, recover` |
| `attack3` | 4 | 第三段重擊 | `powerful high kick finisher: chamber, kick fully extended, impact, recover` |
| `jump_attack` | 2 | 空中攻擊 | `flying kick downward-forward in mid-air` |
| `run_attack` | 3 | 衝刺攻擊 | `running shoulder tackle / dash punch, body leaning far forward` |
| `defend` | 1 | 防禦 | `blocking with both forearms crossed in front of face, crouched slightly` |
| `hurt` | 2 | 被打 | `getting hit, head snapped back, pained expression, body recoiling` |
| `fall` | 3 | 被打飛 | `knocked off feet, flying backward through the air, body tilting horizontal` |
| `down` | 1 | 倒地 | `lying flat on the ground on his back, dazed, horizontal pose` |
| `getup` | 2 | 起身 | `getting up from the ground: kneeling, then rising` |
| `dizzy` | 3 | 暈眩 | `dizzy and wobbling, swirly eyes, stars circling the head, looping` |
| `special` | 4 | 特技 | 見下面 3.3 |
| `super` | 4 | 大絕 | 見下面 3.3 |
| `victory` | 4 | 勝利 | `victory pose, fist pumped into the air, triumphant expression` |
| `roll` | 4 | 翻滾閃避／空中翻身 | `doing a forward somersault roll, curled into a ball` |
| `catch` | 2 | 抓住對手揍 | `holding an opponent by the collar with one hand and punching with the other (draw only him)` |

> 韓議長（`han`）的 `attack1`、`attack3` 建議改成「用議事槌敲」：`swinging a wooden gavel down`。

**動作條 prompt 範本：**

```
[共用風格前綴] sprite sheet of 【角色描述】, 【動作】, 【格數】 frames arranged in a single horizontal row from left to right, each frame the same size, same character in every frame matching the reference image, [角色動作圖結尾]
```

### 3.3 特技 / 大絕動作

> 目前每個角色有三招特技（前／上／下），動作圖共用 `special` 一組即可；之後要細分再加。

| 角色 | `special`（4 格） | `super`（4 格） |
|---|---|---|
| `su` | `leaning his head forward, his bald head emitting a blinding flash of light` | `sprinting at full speed, body leaning far forward, shouting, motion lines` |
| `wang` | `aggressively pointing his index finger forward while shouting, sound waves` | `arms spread wide then slamming down, shouting dramatically, golden aura` |
| `han` | `raising a giant wooden gavel overhead, then slamming it onto the ground` | `both arms raised joyfully, laughing, gold coins flying around him` |
| `ma` | `throwing a banana peel overhand` | `jogging happily and energetically, sweat drops, cheerful` |
| `ko` | `throwing three surgical scalpels sideways` | `standing calmly with green healing glow, then raising both arms with blue lightning` |
| `guan` | `grabbing and lifting someone overhead for a suplex, arms raised (draw only him)` | `holding a smartphone up to livestream, then a rapid punching flurry` |

---

## 4. 大絕海報（放大絕時跳出來的插圖）

- 規格：**直式 3:4**（例如 900×1200），**上半身**特寫，誇張的動態角度，綠色背景
- 不用寫字，金句由遊戲加上
- 存檔：`assets/posters/<角色ID>.png`

```
[共用風格前綴] dramatic upper-body portrait of 【角色描述】, dynamic low camera angle, extremely intense expression, 【海報姿勢】, fighting game super move cut-in art, speed lines, plain solid pure green background (#00FF00), no text
```

| 角色 | 【海報姿勢】 | 遊戲疊上的金句 |
|---|---|---|
| `su` | `shouting furiously, leaning forward, one fist punching toward the viewer, bald head gleaming` | 在那叫什麼！ |
| `wang` | `pointing his finger straight at the viewer, shouting with fiery passion, hair flowing` | Over my dead body！ |
| `han` | `laughing heartily, raising a wooden gavel high, gold coins in the air` | 放馬過來，林北蛋你！ |
| `ma` | `smiling politely while holding up a banana, wearing a sweatband, jogging pose` | 我是很喜歡吃香蕉的人 |
| `ko` | `deadpan expression, pushing up his round glasses with one finger, holding a scalpel` | 賴祥德，沒有用的！ |
| `guan` | `roaring, flexing huge muscles, holding a smartphone up as if livestreaming` | RRR！幫我開直播！ |

---

## 5. HUD／選角頭像

- 規格：**正方形 256×256**，肩膀以上大頭，背景用角色代表色的漸層（**不去背**，所以這組不用綠幕）
- 存檔：`assets/portraits/<角色ID>.png`

```
[共用風格前綴] head and shoulders portrait of 【角色描述】, facing slightly right, expressive face, simple colored gradient background, square image, no text
```

---

## 6. 場景背景

- 規格：**16:9，1920×1080**，不去背
- 重要：畫面**上方 54%** 是背景（牆、舞台、螢幕），**下方 46%** 是角色可以走動的**地板**，要空曠、有透視感，不要放擋路的東西
- 存檔：`assets/stages/<場景ID>.png`

| 場景 ID | Prompt |
|---|---|
| `legislature` | `[共用風格前綴] side-scrolling beat 'em up stage background, interior of a parliament assembly hall, wooden walls, a raised speaker's podium in the center, two electronic voting result boards, rows of wooden legislator desks with microphones along the back, press gallery balcony with camera flashes, the lower half is an open teal carpet floor with scattered papers, wide 16:9, no characters, no text` |
| `rally` | `[共用風格前綴] side-scrolling beat 'em up stage background, night-time political campaign rally stage, metal truss with colorful stage lights, a huge red LED screen, big speakers, a cheering crowd silhouette waving multicolored flags, sweeping spotlights, the lower half is an open wooden stage floor, wide 16:9, no characters, no text` |
| `studio` | `[共用風格前綴] side-scrolling beat 'em up stage background, TV political talk show studio, deep blue lighting, a giant screen in the center, side screens with bar charts, a news ticker bar, an anchor desk, studio cameras, the lower half is an open glossy dark blue studio floor with tape marks, wide 16:9, no characters, no text` |

---

## 7. 首頁主視覺與開場插畫（16:9，1920×1080，不去背）

- 首頁：`assets/stages/title.png`。**上方 1/3 留空**放標題字，**下方 1/5 留空**放按鍵說明
- 開場：`assets/stages/intro_1.png` ～ `intro_5.png`，字幕由遊戲加上

| 檔名 | Prompt 重點（前面加共用風格前綴） |
|---|---|
| `title` | `epic arcade game key art, night sky over a city, a glowing government building in the center with golden light rays, six caricature politicians posing heroically in front (descriptions: 【六位角色描述】), empty space at the top for a logo, wide 16:9, no text` |
| `intro_1` | `wide shot of a parliament assembly hall interior, empty and tense, dramatic lighting, no text` |
| `intro_2` | `parliament hall flashing red alarm lights, big screen showing a red BREAKING news banner, voting board glitching, chaos, no other text` |
| `intro_3` | `six mysterious silhouettes of politicians standing in a row under spotlights in a dark hall, dramatic` |
| `intro_4` | `split screen face-off: on the left 【han 描述】 shouting, on the right 【su 描述】 shouting, lightning between them, versus fighting game style` |
| `intro_5` | `six caricature politicians charging forward together on a campaign rally stage, speed lines, explosive energy, fighting game opening` |

---

## 8. 登記到 `assets/manifest.json`

範例：衝衝院長換了待機、走路兩組動作條＋海報＋頭像，以及立法院背景：

```json
{
  "chromaKey": "#00ff00",
  "chromaTolerance": 120,
  "characters": {
    "su": {
      "idle": { "sheet": "assets/characters/su/idle.png", "frames": 4 },
      "walk": { "sheet": "assets/characters/su/walk.png", "frames": 6 }
    }
  },
  "posters": { "su": "assets/posters/su.png" },
  "portraits": { "su": "assets/portraits/su.png" },
  "stages": {
    "legislature": "assets/stages/legislature.png",
    "title": "assets/stages/title.png",
    "intro_1": "assets/stages/intro_1.png"
  }
}
```

- 也可以一格一張：`"idle": 4` 代表 `assets/characters/su/idle_1.png` ～ `idle_4.png`
- **注意**：一個角色只要有登記某個動作，那個動作就用圖；沒登記的動作會用程式畫的。建議一個角色的動作**全部生完再一起登記**，不然會出現圖和程式畫的混在一起
- 去背不乾淨（有綠邊）時，把 `chromaTolerance` 調高（例如 160）；角色身上的綠色被吃掉時調低

---

## 9. 道具圖（可選）

道具目前是程式畫的，之後想換圖再說。清單：便當、珍奶、抗議標語牌、麥克風、雞蛋、議場椅子。
