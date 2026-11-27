# Gemini 生圖 Prompt（可直接複製貼上）

> 這份是 `tools/gen_prompts.py` 自動產生的，要改內容請改那支程式再重跑。

## 怎麼用

**畫風**：照發大財議長那張成功的立繪（手繪諷刺漫畫風、約六頭身）。**Gemini 會擋**：寫真實姓名又附真人照片的圖，以及真人「被打」的畫面，所以 prompt 都不寫姓名，被打、倒地也寫成卡通搞笑的反應。

1. **每個角色開一個新對話**，先貼「第零步」（遊戲說明＋角色說明），等 Gemini 回「了解」。
2. **第一步・立繪**：上傳 2～3 張清楚的照片（正面、側面、全身，自己上網找），貼「做法 A」。不夠像就貼「不夠像時」那段修。滿意後存成 `assets/select/<角色>.png`，這張直接當選角立繪。被拒絕就開新對話改用「做法 B」。
3. **第二步・三視圖**：上傳立繪，貼「三視圖」。
4. **之後每一張**：上傳**立繪＋三視圖**（不要再傳真人照片），一次只貼一段、只生一張。某張被拒絕就開新對話，貼第零步、上傳兩張參考圖，再貼那一張。
5. 動作圖是「一整條動作條」：一張圖裡由左到右排好幾格。格子要等寬，遊戲會自動平均切開。排不整齊時，可以改成一格一張（檔名 `idle_1.png`、`idle_2.png`…）。
6. 綠色背景 `#00FF00` 會被遊戲自動去背。
7. 生好的圖照「存檔」那欄的路徑整理好（或直接壓成 zip 傳給 Claude），再執行 `python3 tools/prep_assets.py <資料夾>`：會自動去背、切格對齊、統一大小、壓縮，並更新 `assets/manifest.json`。

---

## 衝衝院長（`su`）　金句：「在那叫什麼！」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「衝衝院長」，個性急躁、衝勁十足，招牌台詞是「在那叫什麼！」。外型：光亮的大光頭（頭頂有反光亮點）、細方框金屬眼鏡、又粗又斜的濃眉、銳利的眼神、深灰西裝、白襯衫、灰藍領帶、黑皮鞋。招式：光頭反光閃到人、往上衝的頭槌、低頭往前衝撞。大絕是連續三段暴衝，全身冒橘色火焰氣場。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/su.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/su.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: completely bald shiny head, rectangular metal-frame glasses, thick dark slanted eyebrows, narrow intense eyes, deep smile lines, determined clenched jaw; a bald elderly Taiwanese politician with a very shiny bald head and a bright white highlight, rectangular metal-frame glasses, thick dark stern eyebrows, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/su.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/su/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/su/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/su/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/su/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/su/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: quick straight jab punch with the front arm: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/su/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/su/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: powerful finisher kick: chamber, kick fully extended, impact, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/su/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/su/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/su/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/su/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/su/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/su/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/su/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/su/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/su/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/su/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/su/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/su/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: arms crossed, chin up, bald head shining, proud stern look. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 光頭閃光**　存檔：`assets/characters/su/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: leaning his head forward and down, his shiny bald head emitting a blinding cone of white-yellow light forward, light rays. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 衝天頭槌**　存檔：`assets/characters/su/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: crouching down then launching straight upward head-first like a rocket, a rising headbutt with motion lines. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 衝刺頭槌**　存檔：`assets/characters/su/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lowering his head and charging forward head-first like a battering ram, body almost horizontal, dust and speed lines. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 衝衝衝**　存檔：`assets/characters/su/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: three explosive forward dashes: crouch, burst forward at full speed with body leaning far forward and a fiery orange aura, brief stop, burst again, shouting angrily, strong motion lines. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/su.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple orange and dark brown gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「在那叫什麼！」）**　存檔：`assets/posters/su.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, shouting furiously with mouth wide open behind the mask, leaning toward the viewer, one fist punching toward the camera, bald head gleaming, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 堅哥（`wang`）　金句：「Over my dead body！」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「堅哥」，情緒激動、熱血又戲劇化，招牌台詞是「Over my dead body！」。外型：及肩的黑色直長髮往後梳、粗黑眉、激動有神的大眼睛、黑西裝、白襯衫、黑領帶。招式：激動用手指指人並發出音波、雙手拍桌震出衝擊波、躺在地上抗議不走。大絕是張開雙臂怒吼，身上冒出金色光柱和震波。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/wang.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/wang.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: shoulder-length straight black hair combed back behind the ears, long oval face, thick dark eyebrows, wide intense passionate eyes, prominent cheekbones; a middle-aged Taiwanese politician with shoulder-length straight black hair combed back, thick dark eyebrows, intense passionate eyes, black suit, white shirt, black tie, very emotional dramatic expression. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/wang.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/wang/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/wang/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/wang/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/wang/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/wang/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: quick straight jab punch with the front arm: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/wang/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/wang/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: powerful finisher kick: chamber, kick fully extended, impact, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/wang/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/wang/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/wang/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/wang/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/wang/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/wang/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/wang/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/wang/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/wang/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/wang/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/wang/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/wang/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: fist raised high, eyes closed, deeply moved and emotional, tears of passion. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 指指點點**　存檔：`assets/characters/wang/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: aggressively pointing his index finger forward while shouting, yellow sound-wave rings shooting out from his fingertip. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 拍案而起**　存檔：`assets/characters/wang/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: slamming both palms down hard, then springing up furious with arms raised, a golden shockwave ring spreading on the floor around him. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 躺地抗議**　存檔：`assets/characters/wang/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying down flat on his back on the floor in stubborn protest, arms crossed on his chest, refusing to move, defiant face. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 除非踏過我的屍體**　存檔：`assets/characters/wang/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: spreading his arms wide and roaring dramatically, a tall pillar of golden light around him, hair blowing upward, then slamming fists down sending golden shockwaves. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/wang.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple gold and black gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「Over my dead body！」）**　存檔：`assets/posters/wang.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, pointing his finger straight at the viewer, shouting with fiery passion, hair flowing dramatically, golden light behind him, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 發大財議長（`han`）　金句：「放馬過來，林北蛋你！」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「發大財議長」，圓臉、親切、笑口常開，招牌台詞是「放馬過來，林北蛋你！」。外型：頭頂禿、兩側短灰髮、寬圓臉、笑起來眼睛瞇成彎月形、咧嘴大笑、淺藍襯衫捲起袖子、黑皮帶、深藍長褲、黑皮鞋，招式會拿木製議事槌。招式：議事槌敲地震波、丟出水果貨箱、吃一碗滷肉飯回血。大絕是舉起雙手大笑，天上掉下金幣和金元寶。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/han.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/han.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: bald crown with short grey hair only on the sides and back, big round face, small smiling eyes, wide warm grin, full cheeks; a chubby round-faced elderly Taiwanese politician, bald on top with short grey hair on the sides, big warm friendly grin, light blue dress shirt with rolled-up sleeves, black belt, slight round belly, dark navy trousers, black shoes, holding a wooden judge's gavel. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/han.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/han/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/han/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/han/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/han/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/han/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: swinging a wooden gavel down from above: raise, strike, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/han/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/han/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: big overhead two-handed gavel slam onto the ground: raise high, slam, impact dust, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/han/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/han/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/han/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/han/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/han/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/han/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/han/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/han/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/han/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/han/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/han/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/han/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: giving a big thumbs up with a wide grin, gold coins sparkling. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 議事槌**　存檔：`assets/characters/han/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: raising a giant wooden gavel high overhead with both hands, then slamming it onto the ground, a shockwave and dust burst. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 貨出得去**　存檔：`assets/characters/han/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lifting a big cardboard fruit shipping crate and hurling it forward with both hands. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 滷肉飯補血**　存檔：`assets/characters/han/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: happily eating a bowl of braised pork rice with chopsticks, cheeks full, small green sparkles of healing. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 發大財**　存檔：`assets/characters/han/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: raising both arms joyfully and laughing loudly, golden coins and gold ingots raining down around him, golden sparkles. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/han.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple royal blue and navy gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「放馬過來，林北蛋你！」）**　存檔：`assets/posters/han.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, laughing heartily, raising a wooden gavel high, gold coins flying in the air, cheerful but daring expression, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 慢跑總統（`ma`）　金句：「我是很喜歡吃香蕉的人」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「慢跑總統」，斯文有禮、愛慢跑、愛吃香蕉，招牌台詞是「我是很喜歡吃香蕉的人」。外型：身材瘦、整齊的深色旁分頭髮、溫和有禮的微笑、額頭戴紅白色運動頭帶、藍邊白色運動 T 恤、藍色運動短褲、白色慢跑鞋。招式：丟香蕉皮讓人滑倒、香蕉迴力鏢、輕快慢跑閃避。大絕是邊慢跑邊把一大堆香蕉拋向空中。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/ma.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/ma.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: neat dark side-parted hair, slim oval face, gentle polite smile, soft eyes, clean-shaven, slim build; a slim elderly Taiwanese gentleman with neat dark side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/ma.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/ma/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/ma/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/ma/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/ma/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/ma/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: quick straight jab punch with the front arm: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/ma/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/ma/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: powerful finisher kick: chamber, kick fully extended, impact, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/ma/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/ma/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/ma/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/ma/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/ma/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/ma/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/ma/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/ma/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/ma/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/ma/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/ma/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/ma/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: jogging in place happily, waving with one hand, holding a banana in the other. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 香蕉皮**　存檔：`assets/characters/ma/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: tossing a banana peel low and forward onto the ground with a polite smile. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 香蕉迴力鏢**　存檔：`assets/characters/ma/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: throwing a yellow banana sidearm like a boomerang, spinning. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 慢跑閃避**　存檔：`assets/characters/ma/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jogging quickly and lightly, a nimble sidestep dodge, sweat drops, cheerful polite face. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 香蕉大放送**　存檔：`assets/characters/ma/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: happily jogging in place then tossing many yellow bananas up into the air one after another, bananas flying. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/ma.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple sky blue and white gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「我是很喜歡吃香蕉的人」）**　存檔：`assets/posters/ma.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, smiling politely while holding up a yellow banana next to his face, sweatband on, jogging pose, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 阿北（`ko`）　金句：「賴祥德，沒有用的！」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「阿北」，以前是外科醫師，總是面無表情、講話很直，招牌台詞是「賴祥德，沒有用的！」。外型：灰色短髮、細金屬框眼鏡、寬臉、嘴巴抿成一直線的撲克臉、深藍西裝外套、淺藍色開領襯衫不打領帶、深色長褲。招式：射出三把手術刀、用電擊器電人、騎公路車衝刺。大絕是全身冒出綠色治療光芒，再舉起雙手召喚藍色閃電。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/ko.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/ko.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: short grey hair, thin metal-frame glasses, wide flat face, straight mouth, deadpan expression, slightly heavy-lidded eyes; a Taiwanese politician and former surgeon with short grey hair, thin metal-frame glasses, deadpan expressionless face, dark navy suit jacket over a light blue open-collar shirt with no tie, dark trousers, black shoes. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/ko.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/ko/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/ko/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/ko/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/ko/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/ko/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: quick straight jab punch with the front arm: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/ko/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/ko/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: powerful finisher kick: chamber, kick fully extended, impact, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/ko/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/ko/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/ko/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/ko/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/ko/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/ko/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/ko/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/ko/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/ko/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/ko/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/ko/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/ko/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: adjusting his glasses with a tiny satisfied smirk, arms behind his back. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 飛刀手術**　存檔：`assets/characters/ko/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flicking his wrist to throw three small silver surgical scalpels forward in a fan, calm deadpan face. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 電擊器**　存檔：`assets/characters/ko/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: thrusting two defibrillator paddles forward, crackling blue electric sparks. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 單車環島**　存檔：`assets/characters/ko/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: riding a road bicycle at high speed, leaning forward over the handlebars, wheels with motion blur. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 葉克膜**　存檔：`assets/characters/ko/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: standing calmly surrounded by a green healing glow, then raising both arms as blue lightning bolts strike down around him. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/ko.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple teal and dark green gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「賴祥德，沒有用的！」）**　存檔：`assets/posters/ko.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, deadpan expression, pushing up his glasses with one finger, the glasses glinting, holding a scalpel, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 館長（`guan`）　金句：「RRR！幫我開直播！」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「館長」，超大隻的健身房老闆兼直播主，脾氣火爆，招牌台詞是「RRR！幫我開直播！」。外型：光頭、濃密的黑色大鬍子、粗眉、兇狠的眼神、粗脖子、黑色背心、超大的手臂肌肉、迷彩綠工作褲、黑靴子。招式：過肩摔、跳起來的上勾拳、丟出大啞鈴。大絕是舉起手機開直播（手機上有紅色 LIVE 燈），接著連續狂打，拳頭殘影一大堆。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/guan.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/guan.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: shaved bald head, thick full black beard, heavy brow, fierce glaring eyes, thick neck; a huge muscular bald Taiwanese man with a thick full black beard, fierce glaring eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/guan.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/guan/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/guan/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/guan/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/guan/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/guan/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: quick straight jab punch with the front arm: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/guan/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/guan/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: powerful finisher kick: chamber, kick fully extended, impact, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/guan/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/guan/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/guan/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/guan/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/guan/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/guan/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/guan/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/guan/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/guan/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/guan/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/guan/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/guan/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: double biceps flex, roaring proudly. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 過肩摔**　存檔：`assets/characters/guan/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a wrestling suplex motion: reaching forward to grab, lifting with both arms, then swinging over his shoulder and slamming down (draw only him, no opponent). 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 館長上勾拳**　存檔：`assets/characters/guan/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a powerful rising uppercut, jumping slightly off the ground with the fist high above, impact burst. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 啞鈴投擲**　存檔：`assets/characters/guan/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: winding up and throwing a heavy black dumbbell forward in a high arc. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 開直播**　存檔：`assets/characters/guan/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: holding a smartphone up to livestream with a red LIVE light, shouting, then a rapid punching flurry with many fist afterimages. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/guan.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple red and dark maroon gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「RRR！幫我開直播！」）**　存檔：`assets/posters/guan.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, roaring with mouth wide open, flexing huge muscles, holding a smartphone up as if livestreaming, red LIVE light, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 黑熊教授（`shen`）　金句：「台北順起來！」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「黑熊教授」，戴眼鏡的學者型立委，講話理性但很有氣勢，招牌台詞是「台北順起來！」。外型：招牌的一大團又厚又蓬的深黑色捲髮（蓋住耳朵）、細框圓角長方形眼鏡、圓潤的臉、斯文的笑容、深藍色休閒西裝外套、黑色圓領T恤（胸口有小小的白色黑熊徽章）、深色長褲、黑皮鞋，手上常拿麥克風。招式：拿麥克風發表演講放出音波、召喚黑熊玩偶往前撲、丟出厚厚的「防衛手冊」。大絕是舉手一揮，召喚一股巨大的「洋流」：深藍色的海水夾著白色浪花從他身後湧出，捲成大浪橫掃全場。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/shen.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/shen.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: a huge thick fluffy mop of tight messy dark curly hair covering the ears, thin rounded rectangular glasses, round soft face with full cheeks, gentle intellectual smile; a Taiwanese scholar-politician in his forties with a huge fluffy mop of dark curly hair, thin glasses, round face, navy blue casual blazer over a black crew-neck t-shirt with a small white bear badge, dark trousers, black shoes, holding a microphone, calm but confident. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/shen.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/shen/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/shen/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/shen/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/shen/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/shen/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: quick straight jab punch with the front arm: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/shen/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/shen/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: powerful finisher kick: chamber, kick fully extended, impact, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/shen/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/shen/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/shen/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/shen/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/shen/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/shen/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/shen/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/shen/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/shen/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/shen/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/shen/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/shen/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: raising the microphone high with a confident smile, cartoon black bear plush on his shoulder. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 演講音波**　存檔：`assets/characters/shen/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: holding the microphone close and giving a passionate speech, visible sound-wave rings blasting forward. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 黑熊撲擊**　存檔：`assets/characters/shen/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: pointing forward as a cute cartoon black bear plush leaps forward from beside him with paws raised. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 丟防衛手冊**　存檔：`assets/characters/shen/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: throwing a thick hardcover handbook forward like a frisbee. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 洋流**　存檔：`assets/characters/shen/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: sweeping his arm forward as a gigantic swirling ocean current of deep blue sea water and white foam surges out from behind him and sweeps across the ground in front of him, huge curling waves. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/shen.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple olive green and black gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「台北順起來！」）**　存檔：`assets/posters/shen.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, speaking passionately into a microphone toward the viewer, curly hair bouncing, one hand raised, a huge deep-blue swirling ocean current wave with white foam crashing behind him over a bold orange background, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 帥氣市長（`chiang`）　金句：「輝達、牛奶、大巨蛋！」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「帥氣市長」，年輕帥氣、笑容陽光的市長，招牌台詞是「輝達、牛奶、大巨蛋！」。外型：有「公子哥」氣質、自信從容的富家少爺感；濃密往上吹高、往後梳的黑色油頭、濃眉、雙眼皮大眼、方下巴、從容得意的微笑、修長身材、合身高級深藍色西裝、淺藍襯衫不打領帶、白色口袋巾、精緻手錶、發亮的黑皮鞋。招式：比讚放出帥氣閃光、甩出一疊市政白皮書、跑步衝刺撞人。大絕是舉起拳頭喊「輝達、牛奶、大巨蛋！」，背後放出滿天煙火。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/chiang.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/chiang.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: thick voluminous black hair blown up and swept back, thick eyebrows, big double-lidded eyes, strong square jaw, confident easygoing smirk, polished handsome young-master face; a tall slim handsome Taiwanese mayor in his forties with the air of a rich young master, voluminous swept-back black hair, confident smirk, tailored navy blue suit, light blue shirt with open collar and no tie, white pocket square, luxury wristwatch, shiny black shoes, suave and self-assured. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/chiang.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/chiang/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/chiang/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/chiang/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/chiang/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/chiang/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: quick straight jab punch with the front arm: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/chiang/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/chiang/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: powerful finisher kick: chamber, kick fully extended, impact, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/chiang/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/chiang/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/chiang/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/chiang/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/chiang/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/chiang/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/chiang/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/chiang/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/chiang/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/chiang/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/chiang/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/chiang/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: thumbs up with a sparkling smile, other hand on his hip. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 帥氣閃光**　存檔：`assets/characters/chiang/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: giving a thumbs up with a wink and a sparkling smile, a burst of bright star-shaped sparkles flying forward. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 白皮書連發**　存檔：`assets/characters/chiang/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: throwing a fan of white policy booklets forward one after another. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 晨跑衝刺**　存檔：`assets/characters/chiang/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: sprinting forward fast in his suit with a determined smile, body leaning forward, dust and speed lines. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 團結向前**　存檔：`assets/characters/chiang/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: raising a fist high and shouting, colorful fireworks exploding in the sky behind him, confetti. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/chiang.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple navy blue and light blue gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「輝達、牛奶、大巨蛋！」）**　存檔：`assets/posters/chiang.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, pumping a fist toward the viewer with a bright confident smile, fireworks behind, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 辣台妹總統（`tsai`）　金句：「不錯喔，你們畢竟是死忠的！」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「辣台妹總統」，冷靜溫和但很有原則的女性總統，招牌台詞是「不錯喔，你們畢竟是死忠的！」。外型：俐落的深色短鮑伯頭、細框圓眼鏡、溫和的微笑、黑色西裝外套、米白色內搭上衣、黑色長褲、黑色平底鞋，身邊有兩隻貓咪。招式：放出貓咪往前撲、手掌往前推出辣椒火焰、推一推眼鏡閃光。大絕是兩隻貓咪變得超巨大，衝過全場。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/tsai.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/tsai.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: neat short dark bob haircut, thin round-ish glasses, soft round face, gentle calm smile; a calm composed Taiwanese woman leader in her sixties with a neat short dark bob haircut, thin glasses, gentle smile, black blazer over a cream top, black trousers, black flat shoes, confident and dignified. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/tsai.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/tsai/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/tsai/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/tsai/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/tsai/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/tsai/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: quick straight jab punch with the front arm: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/tsai/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/tsai/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: powerful finisher kick: chamber, kick fully extended, impact, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/tsai/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/tsai/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/tsai/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/tsai/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/tsai/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/tsai/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/tsai/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/tsai/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/tsai/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/tsai/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/tsai/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/tsai/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: holding a grey tabby cat in her arms with a gentle smile. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 貓咪出擊**　存檔：`assets/characters/tsai/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: pointing forward as a grey tabby cat leaps out from beside her and pounces forward with claws out. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 辣椒火焰**　存檔：`assets/characters/tsai/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: pushing one palm forward as a burst of red chili-pepper flames shoots out, little chili peppers in the fire. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 眼鏡閃光**　存檔：`assets/characters/tsai/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: pushing up her glasses with one finger, the lenses flashing a blinding white light forward. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 巨貓衝鋒**　存檔：`assets/characters/tsai/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: two giant cartoon cats (a grey tabby and a white-and-ginger cat) charging forward past her, she calmly points ahead. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/tsai.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple black and cream gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「不錯喔，你們畢竟是死忠的！」）**　存檔：`assets/posters/tsai.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, calm confident smile, pushing up her glasses, a cat peeking over her shoulder, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 龍介仙（`hsieh`）　金句：「一生監督你一人！」

### 第零步：每次開新對話，先貼這段

**遊戲說明＋這個角色的說明**　存檔：`（不用存檔）`　尺寸：文字

```
我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 臉要保留本人的臉型、五官比例、髮際線和招牌表情，只把最有特色的地方稍微誇張，看一眼就要認得出是誰

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作，由左到右排成一列，每一格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 動作要誇張好懂；被打、倒地這類動作要畫成搞笑的卡通反應（驚訝表情、頭上冒星星），不要畫成真的受傷

【一致性】
- 我會上傳這個角色的全身立繪和三視圖，每一張都要和它的臉、髮型、服裝、配色、身材比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認再畫下一張

這次要畫的角色叫「龍介仙」，講話直接、很有台南味的資深議員，招牌台詞是「一生監督你一人！」。外型：修長的鵝蛋臉、窄下巴、濃密黑短髮側分且頭頂蓬高往後梳、細金屬框眼鏡、細長眼；草根親民、戲劇感強、講台語，質詢時切換「戰鬥模式」高分貝怒吼、手指前方、肢體誇張；白色長袖襯衫袖子捲到手肘、不打領帶、黑皮帶、深色長褲、黑皮鞋，常拿布袋戲偶。招式：用布袋戲偶打出金色掌風、拿大聲公用台語大喊放出音波、丟出虱目魚。大絕是一條金色的龍盤旋衝出去。

如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。
```

### 第一步：角色立繪（上傳 2～3 張照片＋貼這段）

**做法 A：上傳照片（畫法跟發大財議長那張一樣）**　存檔：`assets/select/hsieh.png（這張也直接當選角立繪）`　尺寸：直式 2:3（800×1200）

```
請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。
畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。
服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。
```

**做法 B：A 被拒絕時用（開新對話、不上傳照片）**　存檔：`assets/select/hsieh.png`　尺寸：直式 2:3（800×1200）

```
Full body character illustration, three-quarter view facing right, feet touching the bottom edge: long oval face with a narrow chin, thick short black hair side-parted and swept up high, thin metal-frame oval glasses, narrow eyes, fierce dramatic expression; a dramatic grassroots Taiwanese politician in his sixties with a long oval face, thick side-parted black hair swept up, thin metal glasses, white long-sleeve dress shirt with sleeves rolled to the elbows and no tie, black belt, dark trousers, black shoes, wearing a traditional Taiwanese glove puppet on one hand, fiery and theatrical. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art. Plain solid pure green background (#00FF00), no text.
```

**不夠像時接著貼（把【】改成哪裡不像）**　存檔：`（同一張，修好再存）`　尺寸：—

```
還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。
```

### 第二步：三視圖（上傳第一步的立繪）

**三視圖設定圖**　存檔：`assets/ref/hsieh.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。
```

### 基本動作（每張都上傳立繪＋三視圖，一次只生一張）

**站立待機**　存檔：`assets/characters/hsieh/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: fighting stance, fists raised, slight breathing bob, looping idle animation. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**走路**　存檔：`assets/characters/hsieh/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: walking forward cycle, arms swinging, looping walk animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**奔跑**　存檔：`assets/characters/hsieh/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running fast cycle, body leaning forward, big strides, looping run animation. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**跳躍**　存檔：`assets/characters/hsieh/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: jumping: first frame pushing off, second frame in the air with knees tucked and arms up. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第一下**　存檔：`assets/characters/hsieh/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: quick straight jab punch with the front arm: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第二下**　存檔：`assets/characters/hsieh/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: cross punch with the back arm, torso twisting: wind-up, full extension, recover. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**攻擊第三下（重擊）**　存檔：`assets/characters/hsieh/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: powerful finisher kick: chamber, kick fully extended, impact, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**空中攻擊**　存檔：`assets/characters/hsieh/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: flying kick downward-forward in mid-air. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**衝刺攻擊**　存檔：`assets/characters/hsieh/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: running shoulder tackle, body leaning far forward. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**防禦**　存檔：`assets/characters/hsieh/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: blocking with both forearms crossed in front of the face, crouched slightly. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打**　存檔：`assets/characters/hsieh/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**被打飛**　存檔：`assets/characters/hsieh/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**倒地**　存檔：`assets/characters/hsieh/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose. 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**起身／撿東西**　存檔：`assets/characters/hsieh/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: getting up from the ground: kneeling on one knee, then rising. 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**暈眩**　存檔：`assets/characters/hsieh/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: dizzy and wobbling, swirly eyes, looping. 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/hsieh/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: doing a forward somersault roll, curled into a ball. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**迴旋攻擊（↓＋攻）**　存檔：`assets/characters/hsieh/spin.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**抓住對手揍**　存檔：`assets/characters/hsieh/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image). 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**勝利**　存檔：`assets/characters/hsieh/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: victory pose animation: flashing a V sign with a big satisfied grin, glove puppet bowing on the other hand. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 技能與大絕動作（同上）

**技1 布袋戲掌**　存檔：`assets/characters/hsieh/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: thrusting the hand wearing the glove puppet forward, the puppet hero striking with a glowing golden palm blast flying forward. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技2 台語大聲公**　存檔：`assets/characters/hsieh/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: shouting into a red megaphone, big visible sound-wave rings blasting forward. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**技3 丟虱目魚**　存檔：`assets/characters/hsieh/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: throwing a big silver milkfish forward like a spear. 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕 金龍出海**　存檔：`assets/characters/hsieh/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a sprite strip of this character for a 2D fighting game: thrusting both palms forward as a long golden Chinese dragon spirals out and charges ahead, glowing. 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

### 畫面用圖（同上）

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/hsieh.png`　尺寸：正方形 1:1（512×512）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple white and dark navy gradient background, square image, the face fills most of the frame, no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「一生監督你一人！」）**　存檔：`assets/posters/hsieh.png`　尺寸：超寬橫式 4:1（1600×400）

```
Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style. Draw a fighting game super move cut-in banner: extreme close-up of this character's face, shouting fiercely toward the viewer, pointing a finger, glove puppet raised on the other hand, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art.
```

---

## 第 1 關小怪：陣頭小弟（`gang`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/gang/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a skinny cocky young temple-procession gang punk, bleached golden spiky hair, thin eyebrows, smug face, white sleeveless tank top, black track pants, blue-and-white plastic slippers, holding a string of red firecrackers. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**走路**　存檔：`assets/characters/gang/walk.png`　尺寸：6 格橫排

```
Same character as the attached image, same pixel art style and colors. walking forward, 6 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/gang/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**被打**　存檔：`assets/characters/gang/hurt.png`　尺寸：2 格橫排

```
Same character as the attached image, same pixel art style and colors. staggering backward with a funny surprised face, 2 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 1 關小怪：抗議群眾（`protester`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/protester/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: an angry middle-aged male protester, grey side-parted hair, round glasses, white cloth headband with red marks (no readable text), beige t-shirt, dark grey trousers, holding a handmade protest placard with color blocks instead of text and a small megaphone. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**走路**　存檔：`assets/characters/protester/walk.png`　尺寸：6 格橫排

```
Same character as the attached image, same pixel art style and colors. walking forward, 6 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/protester/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**被打**　存檔：`assets/characters/protester/hurt.png`　尺寸：2 格橫排

```
Same character as the attached image, same pixel art style and colors. staggering backward with a funny surprised face, 2 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 1 關小王：偷拍狗仔（`paparazzi`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/paparazzi/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a sneaky paparazzi photographer, backwards baseball cap, dark sunglasses, beige trench coat, a big DSLR camera with a long zoom lens hanging from his neck, sly grin. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**走路**　存檔：`assets/characters/paparazzi/walk.png`　尺寸：6 格橫排

```
Same character as the attached image, same pixel art style and colors. walking forward, 6 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/paparazzi/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**被打**　存檔：`assets/characters/paparazzi/hurt.png`　尺寸：2 格橫排

```
Same character as the attached image, same pixel art style and colors. staggering backward with a funny surprised face, 2 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

### 招式（同上）

**閃光偷拍**　存檔：`assets/characters/paparazzi/special_fwd.png`　尺寸：4 格橫排

```
Same character as the attached image, same pixel art style and colors. raising a big camera to his eye and firing a white flash forward, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 1 關 Boss：角頭樁腳王（`kingpin`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/kingpin/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a big burly local gang boss and vote broker, slicked-back black hair, gold-framed sunglasses, thick gold chain, purple flower-pattern silk shirt unbuttoned to the chest, big belly, gold rings, gold shoes, smug intimidating grin. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**走路**　存檔：`assets/characters/kingpin/walk.png`　尺寸：6 格橫排

```
Same character as the attached image, same pixel art style and colors. walking forward, 6 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/kingpin/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**被打**　存檔：`assets/characters/kingpin/hurt.png`　尺寸：2 格橫排

```
Same character as the attached image, same pixel art style and colors. staggering backward with a funny surprised face, 2 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

### 招式（同上）

**鞭炮陣**　存檔：`assets/characters/kingpin/special_fwd.png`　尺寸：4 格橫排

```
Same character as the attached image, same pixel art style and colors. throwing lit red firecrackers forward, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**角頭衝撞**　存檔：`assets/characters/kingpin/special_up.png`　尺寸：4 格橫排

```
Same character as the attached image, same pixel art style and colors. charging forward head-down like a bull, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**鞭炮雨**　存檔：`assets/characters/kingpin/super.png`　尺寸：4 格橫排

```
Same character as the attached image, same pixel art style and colors. raising both arms and laughing while firecrackers rain down around him, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**頭像（大招橫幅用）**　存檔：`assets/portraits/kingpin.png`　尺寸：正方形

```
Same character as the attached image: pixel art head and shoulders portrait, menacing smug face, simple purple and gold background, square image, no text.
```

---

## 第 2 關小怪：夜市攤販（`vendor`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/vendor/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a chubby night-market food stall vendor, white headband, white tank top, blue shorts, blue-and-white slippers, holding a red plastic stool. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/vendor/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 2 關小怪：發傳單工讀生（`canvasser`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/canvasser/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a skinny young campaign flyer distributor in a bright green campaign t-shirt and cap, holding a stack of white flyers, eager smile. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/canvasser/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 2 關小怪：黑衣保鑣（`bodyguard`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/bodyguard/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a big bald bodyguard in a black suit and black sunglasses, earpiece, stern face, arms ready to tackle. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/bodyguard/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 2 關小王：網軍小編（`troll`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/troll/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a pale young internet troll in a dark blue hoodie, round glasses, messy hair, white sneakers, staring at a glowing smartphone, smug typing grin. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/troll/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

### 招式（同上）

**帶風向**　存檔：`assets/characters/troll/special_fwd.png`　尺寸：4 格橫排

```
Same character as the attached image, same pixel art style and colors. holding up a glowing smartphone and blasting floating angry emoji icons forward, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 2 關小王：財團董事長（`tycoon`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/tycoon/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a fat rich property tycoon, silver side-parted hair, rectangular gold glasses, shiny gold business suit, white shirt, red tie, big belly, cigar, gold watch, arrogant smirk. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/tycoon/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

### 招式（同上）

**撒鈔票**　存檔：`assets/characters/tycoon/special_fwd.png`　尺寸：4 格橫排

```
Same character as the attached image, same pixel art style and colors. throwing a fan of gold coins and banknotes forward, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 3 關小怪：政論名嘴（`reporter`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/reporter/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a TV political pundit in a blue suit and red tie, rectangular glasses, side-parted hair, shouting into a microphone. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/reporter/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 3 關小怪：造勢啦啦隊（`cheerleader`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/cheerleader/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a cheerful campaign rally cheerleader girl, blonde ponytail, pink headband, pink tank top, white skirt, holding pink pom-poms. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/cheerleader/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 3 關小怪：買票樁腳（`votebuyer`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/votebuyer/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a chubby middle-aged vote buyer, balding with grey sides, beige short-sleeve shirt, holding a fan of red envelopes, sly grin. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/votebuyer/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 3 關小王：直播網紅（`influencer`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/influencer/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a flashy livestream influencer with pink hair, round glasses, white jacket, holding a selfie stick with a glowing phone. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/influencer/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

### 招式（同上）

**直播閃光**　存檔：`assets/characters/influencer/special_fwd.png`　尺寸：4 格橫排

```
Same character as the attached image, same pixel art style and colors. holding up the phone on a selfie stick and firing a bright white camera flash forward, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 第 3 關小王：幕後藏鏡人（`mastermind`）

### 動作（像素風，一次一張；第二張起都上傳 idle）

**站立待機（第一張，之後都上傳它當參考）**　存檔：`assets/characters/mastermind/idle.png`　尺寸：4 格橫排

```
Pixel art enemy sprite strip for a 2D beat 'em up game: a tall sinister political mastermind in a long black suit, slicked long black hair, dark rectangular glasses, purple tie, black leather gloves, cold confident smile. fighting stance, slight breathing bob, 4 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

**攻擊**　存檔：`assets/characters/mastermind/attack1.png`　尺寸：3 格橫排

```
Same character as the attached image, same pixel art style and colors. a punch: wind-up, full extension, recover, 3 frames in one horizontal row. simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, normal adult proportions, side view facing right, full body, feet on the bottom edge, plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders.
```

---

## 共用畫面（場景、首頁、開場）

### 劇情第一關背景（4 張，生好放 assets/scenery/）

**天空與遠方城市**　存檔：`assets/scenery/s1_sky.png`　尺寸：16:9（1920×1080）

```
A dusk sky over a Taiwanese city for a game background: deep purple at the top fading to warm orange and pink near the bottom, a few stars, a distant dark-purple city skyline silhouette with small lit windows along the bottom 30 percent, the left and right edges connect seamlessly when tiled. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Wide 16:9, no green screen.
```

**騎樓老街街屋（會左右重複）**　存檔：`assets/scenery/s1_street.png`　尺寸：3:1 超寬（2400×800）

```
A long row of old 3-to-4-story Taiwanese shophouses seen straight from the front, pastel concrete walls, metal window grilles, AC units, vertical shop signboards in red, yellow and blue with color blocks instead of text, red paper lanterns, election campaign flags hanging, and a covered arcade walkway (qilou) along the bottom 20 percent of the image. The bottom edge of the image is the ground line. Everything above the rooftops is plain solid pure green (#00FF00) for transparency. The left and right edges must connect seamlessly when tiled. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Very wide 3:1 image.
```

**菜市場老公寓（有頂樓加蓋）**　存檔：`assets/scenery/s1_apartment.png`　尺寸：約 2.7:1 超寬（2400×900）

```
The flat front facade of a wide old 5-story Taiwanese apartment building seen straight on. Layout from top to bottom: the top 24 percent is the rooftop area above a flat roof line, with an illegal corrugated tin rooftop shack on the left, a blue water tower on the right and TV antennas, and plain solid pure green (#00FF00) sky behind them; below the roof line are grey tiled walls with windows and metal grilles; between 64 and 80 percent height a long open-air corridor balcony runs across the full width with doors and windows behind it; the bottom 20 percent is a ground-floor traditional street market with colorful red, blue, green and yellow umbrellas and stalls. The bottom edge of the image is the ground line. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Very wide image, about 2.7 to 1.
```

**宮廟正面（Boss 戰）**　存檔：`assets/scenery/s1_temple.png`　尺寸：約 2.3:1 寬（2400×1040）

```
The front of a colorful traditional Taiwanese folk temple seen straight on: red walls and pillars, carved dragon columns, an ornate roof with green and yellow glazed tiles and upswept swallowtail ridges decorated with figurines, a big wooden main door in the center with a golden plaque (color block, no readable text), strings of red lanterns, a large bronze incense burner in front with smoke. The bottom edge of the image is the ground line. Everything above and around the temple is plain solid pure green (#00FF00) for transparency. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Wide image, about 2.3 to 1.
```

### 劇情模式路上危險物（像素風，生好放 assets/scenery/）

**圍事計程車（第一關）**　存檔：`assets/scenery/prop_taxi.png`　尺寸：約 2:1 橫式

```
Pixel art game prop for a 2D beat 'em up: a yellow taxi car used by local gang enforcers, side view facing right, tinted black windows, two tough thugs leaning out of the windows shouting and waving baseball bats, a red campaign flag tied on the roof, dented bumper, speed lines behind it. simple 16-bit pixel art, chunky dark outlines, limited color palette, plain solid pure green background (#00FF00), no text, no shadow, the whole car fits inside the image.
```

**夜市暴衝機車（第二關）**　存檔：`assets/scenery/prop_scooter.png`　尺寸：約 3:2 橫式

```
Pixel art game prop for a 2D beat 'em up: a red scooter speeding recklessly with a delivery rider in a yellow helmet carrying a big food box, side view facing right, speed lines. simple 16-bit pixel art, chunky dark outlines, limited color palette, plain solid pure green background (#00FF00), no text, no shadow, the whole scooter fits inside the image.
```

**競選宣傳車（第三關）**　存檔：`assets/scenery/prop_truck.png`　尺寸：約 5:2 橫式

```
Pixel art game prop for a 2D beat 'em up: a small white election campaign truck with big loudspeakers on the roof, red and blue campaign banners with color blocks instead of text on its side, side view facing right, speed lines. simple 16-bit pixel art, chunky dark outlines, limited color palette, plain solid pure green background (#00FF00), no text, no shadow, the whole truck fits inside the image.
```

### 劇情第二關背景（4 張，生好放 assets/scenery/）

**夜晚城市天空**　存檔：`assets/scenery/s2_sky.png`　尺寸：16:9（1920×1080）

```
A night sky over a big modern Taiwanese city for a game background: deep navy blue at the top fading to purple near the bottom, a few stars, a distant skyline of glass office towers and a tall landmark tower silhouette with many lit windows and red aircraft lights along the bottom 30 percent, the left and right edges connect seamlessly when tiled. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Wide 16:9, no green screen.
```

**夜市大街（會左右重複）**　存檔：`assets/scenery/s2_street.png`　尺寸：3:1 超寬（2400×800）

```
A long row of busy Taiwanese night market stalls and old 3-story shop buildings seen straight from the front at night, glowing food stall signboards in red, yellow and blue with color blocks instead of text, strings of light bulbs, steam from food carts, hanging lanterns, mayoral election campaign banners with color blocks, along the bottom 20 percent a row of food stall counters. The bottom edge of the image is the ground line. Everything above the rooftops is plain solid pure green (#00FF00) for transparency. The left and right edges must connect seamlessly when tiled. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Very wide 3:1 image.
```

**捷運高架車站（月台在中間高度）**　存檔：`assets/scenery/s2_station.png`　尺寸：約 4:1 超寬（2400×600）

```
The flat side view of a long elevated metro (MRT) station at night seen straight on. Layout from top to bottom: the top 45 percent is the station's curved white roof canopy and glass walls with a parked silver metro train behind the platform; at 48 to 60 percent height is the long platform floor edge with yellow safety line; below that a thick grey concrete viaduct with round pillars, and the bottom 20 percent is street level with a few small shops and scooters parked. The bottom edge of the image is the ground line. Everything above the roof is plain solid pure green (#00FF00) for transparency. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Very wide image, about 4 to 1.
```

**市政府大樓（Boss 戰）**　存檔：`assets/scenery/s2_cityhall.png`　尺寸：約 2.7:1 寬（2400×900）

```
The front of a grand modern city hall building seen straight on at night: wide white stone facade with tall columns, a big central entrance with glass doors, a flagpole on each side, rows of lit windows, wide stone steps in front, election campaign banners with color blocks hanging on the facade. The bottom edge of the image is the ground line. Everything above and around the building is plain solid pure green (#00FF00) for transparency. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Wide image, about 2.7 to 1.
```

### 第二關「政見發表會・下樓梯 PK」背景（1 張，生好放 assets/scenery/）

**市長政見發表會的電視辯論舞台**　存檔：`assets/scenery/pk_sky.png`　尺寸：16:9（1920×1080）

```
The inside of a televised mayoral election debate hall seen straight on, used as a full-screen game background: heavy red velvet curtains on the far left and right edges, two wooden candidate podiums with microphones at the bottom left and bottom right corners, a dark navy blue back wall with a big banner made of color blocks (no readable text), soft spotlight beams from the top, TV cameras and a silhouette audience along the very bottom edge. The CENTER 70 percent of the image must stay dark, plain and uncluttered (it will be covered by game platforms and characters). Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Wide 16:9, no green screen.
```

### 武器道具（6 張，插畫風，生好放 assets/scenery/）

**棒球棒**　存檔：`assets/scenery/prop_w_bat.png`　尺寸：1:2 直式

```
A game weapon item: a worn wooden baseball bat with black grip tape on the handle and a few dents. Art style: clean hand-drawn comic illustration, bold black outlines, flat cel-shaded colors, video game item icon. The object stands perfectly upright and vertical, handle or grip at the bottom, centered, fills most of the image height, plain solid pure green background (#00FF00), no hands, no people, no text, no shadow.
```

**修車扳手**　存檔：`assets/scenery/prop_w_wrench.png`　尺寸：1:2 直式

```
A game weapon item: a big heavy chrome adjustable wrench from a scooter repair shop, a little greasy, red rubber grip on the handle. Art style: clean hand-drawn comic illustration, bold black outlines, flat cel-shaded colors, video game item icon. The object stands perfectly upright and vertical, handle or grip at the bottom, centered, fills most of the image height, plain solid pure green background (#00FF00), no hands, no people, no text, no shadow.
```

**鐵鍊**　存檔：`assets/scenery/prop_w_chain.png`　尺寸：1:2 直式

```
A game weapon item: a thick steel chain hanging straight down with a black taped grip at the bottom end, shiny metal links. Art style: clean hand-drawn comic illustration, bold black outlines, flat cel-shaded colors, video game item icon. The object stands perfectly upright and vertical, handle or grip at the bottom, centered, fills most of the image height, plain solid pure green background (#00FF00), no hands, no people, no text, no shadow.
```

**鐵折疊椅**　存檔：`assets/scenery/prop_w_fchair.png`　尺寸：1:2 直式

```
A game weapon item: a folded grey metal folding chair (the classic wrestling chair) seen from the side, folded flat and standing upright. Art style: clean hand-drawn comic illustration, bold black outlines, flat cel-shaded colors, video game item icon. The object stands perfectly upright and vertical, handle or grip at the bottom, centered, fills most of the image height, plain solid pure green background (#00FF00), no hands, no people, no text, no shadow.
```

**抗議標語牌**　存檔：`assets/scenery/prop_w_sign.png`　尺寸：1:2 直式

```
A game weapon item: a hand-made protest placard on a wooden stick, white board with red and black color blocks instead of words. Art style: clean hand-drawn comic illustration, bold black outlines, flat cel-shaded colors, video game item icon. The object stands perfectly upright and vertical, handle or grip at the bottom, centered, fills most of the image height, plain solid pure green background (#00FF00), no hands, no people, no text, no shadow.
```

**競選旗**　存檔：`assets/scenery/prop_w_flag.png`　尺寸：1:2 直式

```
A game weapon item: a long election campaign flag on a silver pole, a bright orange flag with color blocks instead of words, slightly waving. Art style: clean hand-drawn comic illustration, bold black outlines, flat cel-shaded colors, video game item icon. The object stands perfectly upright and vertical, handle or grip at the bottom, centered, fills most of the image height, plain solid pure green background (#00FF00), no hands, no people, no text, no shadow.
```

### 劇情第三關背景（5 張，生好放 assets/scenery/）

**黃昏的凱道天空**　存檔：`assets/scenery/s3_sky.png`　尺寸：16:9（1920×1080）

```
A dramatic sunset sky over a capital city for a game background: deep crimson at the top fading to orange and gold near the bottom, fireworks bursting, searchlight beams, a distant skyline silhouette along the bottom 30 percent, the left and right edges connect seamlessly when tiled. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Wide 16:9, no green screen.
```

**凱道兩旁的大樓與人潮（會左右重複）**　存檔：`assets/scenery/s3_street.png`　尺寸：3:1 超寬（2400×800）

```
A long row of grand old government office buildings along a wide boulevard seen straight from the front, red brick and white stone, hanging election campaign banners and national-style flags with color blocks instead of text, and along the bottom 25 percent a dense cheering crowd silhouette waving colorful flags and glow sticks. The bottom edge of the image is the ground line. Everything above the rooftops is plain solid pure green (#00FF00) for transparency. The left and right edges must connect seamlessly when tiled. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Very wide 3:1 image.
```

**造勢晚會舞台（主角從舞台上出發）**　存檔：`assets/scenery/s3_stage.png`　尺寸：約 3.4:1 超寬（2400×700）

```
The flat front view of a huge election campaign rally stage at night. Layout from top to bottom: the top 60 percent is a metal truss frame with colorful stage lights, a giant red LED screen with color blocks instead of text and big speakers; at 66 to 82 percent height is the wooden stage floor; the bottom 18 percent is the stage front skirt covered with red and blue banners with color blocks. The bottom edge of the image is the ground line. Everything above and around the truss is plain solid pure green (#00FF00) for transparency. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Very wide image, about 3.4 to 1.
```

**貴賓看台（在中間高度）**　存檔：`assets/scenery/s3_stand.png`　尺寸：約 3:1 超寬（2400×800）

```
The flat side view of a temporary VIP grandstand for a political rally seen straight on. Layout from top to bottom: the top 40 percent is a white tent roof with flags and spotlights; at 43 to 57 percent height is the grandstand walkway floor with a railing; below that steel scaffolding with banners with color blocks, and the bottom 15 percent is ground level with security barriers. The bottom edge of the image is the ground line. Everything above the tent roof is plain solid pure green (#00FF00) for transparency. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Very wide image, about 3 to 1.
```

**總統府（最終 Boss 戰）**　存檔：`assets/scenery/s3_palace.png`　尺寸：約 2.6:1 寬（2400×920）

```
The front of a grand historic presidential office building seen straight on: red brick and white stone Baroque facade, a tall central clock tower, arched windows, a big central gate, flags on both sides, lit by golden spotlights at night. The bottom edge of the image is the ground line. Everything above and around the building is plain solid pure green (#00FF00) for transparency. Art style: clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, detailed 2D side-scrolling beat 'em up background art. Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words). Wide image, about 2.6 to 1.
```

### 場景背景

**立法院議場**　存檔：`assets/stages/legislature.png`　尺寸：16:9（1920×1080）

```
clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, side-scrolling beat 'em up stage background, interior of a parliament assembly hall, wooden walls, a raised speaker's podium in the center, two electronic voting result boards, rows of wooden desks with microphones along the back, press gallery balcony with camera flashes, the lower 46 percent of the image is an open empty teal carpet floor in perspective with a few scattered papers, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text
```

**造勢晚會現場**　存檔：`assets/stages/rally.png`　尺寸：16:9（1920×1080）

```
clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, side-scrolling beat 'em up stage background, night-time political campaign rally stage, metal truss with colorful stage lights, a huge red LED screen, big speakers, a cheering crowd silhouette waving multicolored flags, sweeping spotlights, the lower 46 percent of the image is an open empty wooden stage floor in perspective, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text
```

**政論節目攝影棚**　存檔：`assets/stages/studio.png`　尺寸：16:9（1920×1080）

```
clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, side-scrolling beat 'em up stage background, TV political talk show studio, deep blue lighting, a giant screen in the center, side screens with bar charts, a news ticker bar, an anchor desk, studio cameras, the lower 46 percent of the image is an open empty glossy dark blue studio floor with tape marks in perspective, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text
```

### 首頁與開場

**首頁主視覺**　存檔：`assets/stages/title.png`　尺寸：16:9（1920×1080）

```
clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, epic arcade game key art, night sky over a city, a glowing government building in the center with golden light rays, six caricature politicians posing heroically in a row in front: a bald elderly Taiwanese politician with a very shiny bald head and a bright white highlight, rectangular metal-frame glasses, thick dark stern eyebrows, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude; a middle-aged Taiwanese politician with shoulder-length straight black hair combed back, thick dark eyebrows, intense passionate eyes, black suit, white shirt, black tie, very emotional dramatic expression; a chubby round-faced elderly Taiwanese politician, bald on top with short grey hair on the sides, big warm friendly grin, light blue dress shirt with rolled-up sleeves, black belt, slight round belly, dark navy trousers, black shoes, holding a wooden judge's gavel; a slim elderly Taiwanese gentleman with neat dark side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger; a Taiwanese politician and former surgeon with short grey hair, thin metal-frame glasses, deadpan expressionless face, dark navy suit jacket over a light blue open-collar shirt with no tie, dark trousers, black shoes; a huge muscular bald Taiwanese man with a thick full black beard, fierce glaring eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots; a Taiwanese scholar-politician in his forties with a huge fluffy mop of dark curly hair, thin glasses, round face, navy blue casual blazer over a black crew-neck t-shirt with a small white bear badge, dark trousers, black shoes, holding a microphone, calm but confident; a tall slim handsome Taiwanese mayor in his forties with the air of a rich young master, voluminous swept-back black hair, confident smirk, tailored navy blue suit, light blue shirt with open collar and no tie, white pocket square, luxury wristwatch, shiny black shoes, suave and self-assured; a calm composed Taiwanese woman leader in her sixties with a neat short dark bob haircut, thin glasses, gentle smile, black blazer over a cream top, black trousers, black flat shoes, confident and dignified; a dramatic grassroots Taiwanese politician in his sixties with a long oval face, thick side-parted black hair swept up, thin metal glasses, white long-sleeve dress shirt with sleeves rolled to the elbows and no tie, black belt, dark trousers, black shoes, wearing a traditional Taiwanese glove puppet on one hand, fiery and theatrical. Keep the top third of the image empty dark sky for a logo and the bottom fifth simple, wide 16:9, no text. Attach the six character reference sheets.
```

**開場 1：議場**　存檔：`assets/stages/intro_1.png`　尺寸：16:9（1920×1080）

```
clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide shot of an empty parliament assembly hall interior, tense quiet atmosphere, dramatic lighting, wide 16:9, no characters, no text
```

**開場 2：警報**　存檔：`assets/stages/intro_2.png`　尺寸：16:9（1920×1080）

```
clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, parliament hall flashing red alarm lights, a big screen showing a red breaking-news banner with no readable words, the voting board glitching, chaos, wide 16:9, no text
```

**開場 3：剪影**　存檔：`assets/stages/intro_3.png`　尺寸：16:9（1920×1080）

```
clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, six mysterious black silhouettes of politicians standing in a row under spotlights in a dark hall, one bald, one with long hair, one chubby, one with a sweatband, one with round glasses, one huge muscular bearded, dramatic, wide 16:9, no text
```

**開場 4：對峙**　存檔：`assets/stages/intro_4.png`　尺寸：16:9（1920×1080）

```
clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, split screen face-off, versus fighting game style: on the left the chubby smiling character from the first attached reference sheet shouting, on the right the bald glasses character from the second attached reference sheet shouting, lightning between them, wide 16:9, no text. Attach two reference sheets: the chubby gavel character first, the bald glasses character second.
```

**開場 5：衝鋒**　存檔：`assets/stages/intro_5.png`　尺寸：16:9（1920×1080）

```
clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, six caricature politicians charging forward together on a campaign rally stage, speed lines, explosive energy, fighting game opening screen, wide 16:9, no text. Attach the six character reference sheets.
```

### 結局（每位主角 2 張；上傳那位主角的立繪 assets/select/<id>.webp 和站立圖 assets/characters/<id>/idle.webp 當參考）

**衝衝院長・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_su.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**衝衝院長・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_su.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**堅哥・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_wang.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**堅哥・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_wang.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**發大財議長・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_han.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**發大財議長・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_han.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**慢跑總統・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_ma.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**慢跑總統・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_ma.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**阿北・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_ko.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**阿北・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_ko.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**館長・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_guan.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**館長・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_guan.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**黑熊教授・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_shen.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**黑熊教授・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_shen.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**帥氣市長・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_chiang.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**帥氣市長・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_chiang.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**辣台妹總統・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_tsai.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**辣台妹總統・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_tsai.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**龍介仙・結局 1：總統府升旗典禮**　存檔：`assets/stages/ending1_hsieh.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

**龍介仙・結局 2：俯視落敗的對手**　存檔：`assets/stages/ending2_hsieh.png`　尺寸：16:9（1920×1080）

```
Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art, wide 16:9, no text.
```

---

## 登記到 assets/manifest.json

以衝衝院長全部生完為例（其他角色把 `su` 換掉即可）：

```json
{
  "chromaKey": "#00ff00",
  "chromaTolerance": 120,
  "characters": {
    "su": {
      "idle": {
        "sheet": "assets/characters/su/idle.png",
        "frames": 4
      },
      "walk": {
        "sheet": "assets/characters/su/walk.png",
        "frames": 6
      },
      "run": {
        "sheet": "assets/characters/su/run.png",
        "frames": 6
      },
      "jump": {
        "sheet": "assets/characters/su/jump.png",
        "frames": 2
      },
      "attack1": {
        "sheet": "assets/characters/su/attack1.png",
        "frames": 3
      },
      "attack2": {
        "sheet": "assets/characters/su/attack2.png",
        "frames": 3
      },
      "attack3": {
        "sheet": "assets/characters/su/attack3.png",
        "frames": 4
      },
      "jump_attack": {
        "sheet": "assets/characters/su/jump_attack.png",
        "frames": 2
      },
      "run_attack": {
        "sheet": "assets/characters/su/run_attack.png",
        "frames": 3
      },
      "defend": {
        "sheet": "assets/characters/su/defend.png",
        "frames": 1
      },
      "hurt": {
        "sheet": "assets/characters/su/hurt.png",
        "frames": 2
      },
      "fall": {
        "sheet": "assets/characters/su/fall.png",
        "frames": 3
      },
      "down": {
        "sheet": "assets/characters/su/down.png",
        "frames": 1
      },
      "getup": {
        "sheet": "assets/characters/su/getup.png",
        "frames": 2
      },
      "dizzy": {
        "sheet": "assets/characters/su/dizzy.png",
        "frames": 3
      },
      "roll": {
        "sheet": "assets/characters/su/roll.png",
        "frames": 4
      },
      "spin": {
        "sheet": "assets/characters/su/spin.png",
        "frames": 4
      },
      "catch": {
        "sheet": "assets/characters/su/catch.png",
        "frames": 2
      },
      "victory": {
        "sheet": "assets/characters/su/victory.png",
        "frames": 4
      },
      "special_fwd": {
        "sheet": "assets/characters/su/special_fwd.png",
        "frames": 4
      },
      "special_up": {
        "sheet": "assets/characters/su/special_up.png",
        "frames": 4
      },
      "special_down": {
        "sheet": "assets/characters/su/special_down.png",
        "frames": 4
      },
      "super": {
        "sheet": "assets/characters/su/super.png",
        "frames": 6
      }
    }
  },
  "posters": {
    "su": "assets/posters/su.png"
  },
  "portraits": {
    "su": "assets/portraits/su.png"
  },
  "select": {
    "su": "assets/select/su.png"
  },
  "stages": {
    "legislature": "assets/stages/legislature.png",
    "title": "assets/stages/title.png",
    "intro_1": "assets/stages/intro_1.png"
  }
}
```

- 一格一張的寫法：`"idle": 4` 代表 `idle_1.png`～`idle_4.png`
- `special_fwd`／`special_up`／`special_down` 是三招技能各自的動作；沒生的話也可以只生一組 `special` 三招共用
- 去背有綠邊：把 `chromaTolerance` 調高（例如 160）；角色身上被挖洞：調低
