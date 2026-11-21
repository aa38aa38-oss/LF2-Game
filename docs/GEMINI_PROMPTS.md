# Gemini 生圖 Prompt（可直接複製貼上）

> 這份是 `tools/gen_prompts.py` 自動產生的，要改內容請改那支程式再重跑。

## 怎麼用

1. **每個角色先生「角色設定圖」**，挑一張最像的存起來。
2. 之後這個角色的每一張圖，都**先上傳設定圖，再貼 prompt**，長相才會一致。
3. 動作圖是「一整條動作條」：一張圖裡由左到右排好幾格。格子要等寬，遊戲會自動平均切開。Gemini 排不整齊時，可以改成一格一張（檔名 `idle_1.png`、`idle_2.png`…）。
4. 綠色背景 `#00FF00` 會被遊戲自動去背，所以角色身上不要有亮綠色。
5. 生好的圖照「存檔」那欄的路徑放進 repo，再登記到 `assets/manifest.json`（最下面有範例）。一個角色的動作建議**全部生完再一起登記**，不然會圖和程式畫的混在一起。
6. Gemini 若因為「像真人」拒絕，把 prompt 裡的 `Taiwanese man in politics` 改成 `cartoon man`，或多強調 `caricature, cartoon`。

---

## 衝衝院長（`su`）　金句：「在那叫什麼！」

### 第一步：角色設定圖（先做這張，之後每張都上傳它當參考）

**角色設定圖**　存檔：`assets/ref/su.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, character reference sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, three views side by side: front view, side view facing right, back view, full body, the same character in all views, plain solid pure green background (#00FF00), no text
```

### 基本動作

**站立待機**　存檔：`assets/characters/su/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, fighting stance, fists raised, slight breathing bob, looping idle animation, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**走路**　存檔：`assets/characters/su/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, walking forward cycle, arms swinging, looping walk animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**奔跑**　存檔：`assets/characters/su/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, running fast cycle, body leaning forward, big strides, looping run animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**跳躍**　存檔：`assets/characters/su/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, jumping: first frame pushing off, second frame in the air with knees tucked and arms up, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第一下**　存檔：`assets/characters/su/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, quick straight jab punch with the front arm: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第二下**　存檔：`assets/characters/su/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, cross punch with the back arm, torso twisting: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第三下（重擊）**　存檔：`assets/characters/su/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, powerful finisher kick: chamber, kick fully extended, impact, recover, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**空中攻擊**　存檔：`assets/characters/su/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, flying kick downward-forward in mid-air, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**衝刺攻擊**　存檔：`assets/characters/su/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, running shoulder tackle, body leaning far forward, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**防禦**　存檔：`assets/characters/su/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, blocking with both forearms crossed in front of the face, crouched slightly, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打**　存檔：`assets/characters/su/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, getting hit, head snapped back, pained expression, body recoiling, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打飛**　存檔：`assets/characters/su/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, knocked off his feet, flying backward through the air, body tilting to horizontal, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**倒地**　存檔：`assets/characters/su/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, lying flat on the ground on his back, dazed, horizontal pose, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**起身／撿東西**　存檔：`assets/characters/su/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, getting up from the ground: kneeling on one knee, then rising, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**暈眩**　存檔：`assets/characters/su/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, dizzy and wobbling, swirly eyes, looping, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/su/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, doing a forward somersault roll, curled into a ball, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**抓住對手揍**　存檔：`assets/characters/su/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, holding an invisible opponent by the collar with one hand and punching with the other (draw only him, no opponent), 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**勝利**　存檔：`assets/characters/su/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, victory pose animation: arms crossed, chin up, bald head shining, proud stern look, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 技能與大絕動作

**技1 光頭閃光**　存檔：`assets/characters/su/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, leaning his head forward and down, his shiny bald head emitting a blinding cone of white-yellow light forward, light rays, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技2 衝天頭槌**　存檔：`assets/characters/su/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, crouching down then launching straight upward head-first like a rocket, a rising headbutt with motion lines, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技3 衝刺頭槌**　存檔：`assets/characters/su/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, lowering his head and charging forward head-first like a battering ram, body almost horizontal, dust and speed lines, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕 衝衝衝**　存檔：`assets/characters/su/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, three explosive forward dashes: crouch, burst forward at full speed with body leaning far forward and a fiery orange aura, brief stop, burst again, shouting angrily, strong motion lines, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 畫面用圖

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/su.png`　尺寸：正方形 1:1（512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, head and shoulders portrait of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, facing slightly right, expressive face, simple orange and dark brown gradient background, square image, character fills the frame, no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「在那叫什麼！」）**　存檔：`assets/posters/su.png`　尺寸：超寬橫式 4:1（1600×400）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, fighting game super move cut-in banner, extreme close-up of the face of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, shouting furiously with mouth wide open behind the mask, leaning toward the viewer, one fist punching toward the camera, bald head gleaming, face placed in the LEFT third of the image, the right two thirds is empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**選角／VS 畫面全身立繪**　存檔：`assets/select/su.png`　尺寸：直式 2:3（800×1200）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, full body character select illustration of a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude, heroic confident pose facing slightly right, dynamic low angle, larger and more detailed than a sprite, feet touching the bottom edge, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

---

## 堅哥（`wang`）　金句：「Over my dead body！」

### 第一步：角色設定圖（先做這張，之後每張都上傳它當參考）

**角色設定圖**　存檔：`assets/ref/wang.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, character reference sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, three views side by side: front view, side view facing right, back view, full body, the same character in all views, plain solid pure green background (#00FF00), no text
```

### 基本動作

**站立待機**　存檔：`assets/characters/wang/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, fighting stance, fists raised, slight breathing bob, looping idle animation, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**走路**　存檔：`assets/characters/wang/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, walking forward cycle, arms swinging, looping walk animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**奔跑**　存檔：`assets/characters/wang/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, running fast cycle, body leaning forward, big strides, looping run animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**跳躍**　存檔：`assets/characters/wang/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, jumping: first frame pushing off, second frame in the air with knees tucked and arms up, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第一下**　存檔：`assets/characters/wang/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, quick straight jab punch with the front arm: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第二下**　存檔：`assets/characters/wang/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, cross punch with the back arm, torso twisting: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第三下（重擊）**　存檔：`assets/characters/wang/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, powerful finisher kick: chamber, kick fully extended, impact, recover, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**空中攻擊**　存檔：`assets/characters/wang/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, flying kick downward-forward in mid-air, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**衝刺攻擊**　存檔：`assets/characters/wang/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, running shoulder tackle, body leaning far forward, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**防禦**　存檔：`assets/characters/wang/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, blocking with both forearms crossed in front of the face, crouched slightly, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打**　存檔：`assets/characters/wang/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, getting hit, head snapped back, pained expression, body recoiling, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打飛**　存檔：`assets/characters/wang/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, knocked off his feet, flying backward through the air, body tilting to horizontal, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**倒地**　存檔：`assets/characters/wang/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, lying flat on the ground on his back, dazed, horizontal pose, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**起身／撿東西**　存檔：`assets/characters/wang/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, getting up from the ground: kneeling on one knee, then rising, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**暈眩**　存檔：`assets/characters/wang/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, dizzy and wobbling, swirly eyes, looping, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/wang/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, doing a forward somersault roll, curled into a ball, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**抓住對手揍**　存檔：`assets/characters/wang/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, holding an invisible opponent by the collar with one hand and punching with the other (draw only him, no opponent), 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**勝利**　存檔：`assets/characters/wang/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, victory pose animation: fist raised high, eyes closed, deeply moved and emotional, tears of passion, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 技能與大絕動作

**技1 指指點點**　存檔：`assets/characters/wang/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, aggressively pointing his index finger forward while shouting, yellow sound-wave rings shooting out from his fingertip, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技2 拍案而起**　存檔：`assets/characters/wang/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, slamming both palms down hard, then springing up furious with arms raised, a golden shockwave ring spreading on the floor around him, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技3 躺地抗議**　存檔：`assets/characters/wang/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, lying down flat on his back on the floor in stubborn protest, arms crossed on his chest, refusing to move, defiant face, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕 除非踏過我的屍體**　存檔：`assets/characters/wang/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, spreading his arms wide and roaring dramatically, a tall pillar of golden light around him, hair blowing upward, then slamming fists down sending golden shockwaves, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 畫面用圖

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/wang.png`　尺寸：正方形 1:1（512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, head and shoulders portrait of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, facing slightly right, expressive face, simple gold and black gradient background, square image, character fills the frame, no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「Over my dead body！」）**　存檔：`assets/posters/wang.png`　尺寸：超寬橫式 4:1（1600×400）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, fighting game super move cut-in banner, extreme close-up of the face of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, pointing his finger straight at the viewer, shouting with fiery passion, hair flowing dramatically, golden light behind him, face placed in the LEFT third of the image, the right two thirds is empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**選角／VS 畫面全身立繪**　存檔：`assets/select/wang.png`　尺寸：直式 2:3（800×1200）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, full body character select illustration of a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression, heroic confident pose facing slightly right, dynamic low angle, larger and more detailed than a sprite, feet touching the bottom edge, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

---

## 發大財議長（`han`）　金句：「放馬過來，林北蛋你！」

### 第一步：角色設定圖（先做這張，之後每張都上傳它當參考）

**角色設定圖**　存檔：`assets/ref/han.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, character reference sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, three views side by side: front view, side view facing right, back view, full body, the same character in all views, plain solid pure green background (#00FF00), no text
```

### 基本動作

**站立待機**　存檔：`assets/characters/han/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, fighting stance, fists raised, slight breathing bob, looping idle animation, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**走路**　存檔：`assets/characters/han/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, walking forward cycle, arms swinging, looping walk animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**奔跑**　存檔：`assets/characters/han/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, running fast cycle, body leaning forward, big strides, looping run animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**跳躍**　存檔：`assets/characters/han/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, jumping: first frame pushing off, second frame in the air with knees tucked and arms up, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第一下**　存檔：`assets/characters/han/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, swinging a wooden gavel down from above: raise, strike, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第二下**　存檔：`assets/characters/han/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, cross punch with the back arm, torso twisting: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第三下（重擊）**　存檔：`assets/characters/han/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, big overhead two-handed gavel slam onto the ground: raise high, slam, impact dust, recover, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**空中攻擊**　存檔：`assets/characters/han/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, flying kick downward-forward in mid-air, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**衝刺攻擊**　存檔：`assets/characters/han/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, running shoulder tackle, body leaning far forward, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**防禦**　存檔：`assets/characters/han/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, blocking with both forearms crossed in front of the face, crouched slightly, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打**　存檔：`assets/characters/han/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, getting hit, head snapped back, pained expression, body recoiling, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打飛**　存檔：`assets/characters/han/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, knocked off his feet, flying backward through the air, body tilting to horizontal, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**倒地**　存檔：`assets/characters/han/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, lying flat on the ground on his back, dazed, horizontal pose, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**起身／撿東西**　存檔：`assets/characters/han/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, getting up from the ground: kneeling on one knee, then rising, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**暈眩**　存檔：`assets/characters/han/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, dizzy and wobbling, swirly eyes, looping, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/han/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, doing a forward somersault roll, curled into a ball, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**抓住對手揍**　存檔：`assets/characters/han/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, holding an invisible opponent by the collar with one hand and punching with the other (draw only him, no opponent), 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**勝利**　存檔：`assets/characters/han/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, victory pose animation: giving a big thumbs up with a wide grin, gold coins sparkling, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 技能與大絕動作

**技1 議事槌**　存檔：`assets/characters/han/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, raising a giant wooden gavel high overhead with both hands, then slamming it onto the ground, a shockwave and dust burst, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技2 貨出得去**　存檔：`assets/characters/han/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, lifting a big cardboard fruit shipping crate and hurling it forward with both hands, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技3 滷肉飯補血**　存檔：`assets/characters/han/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, happily eating a bowl of braised pork rice with chopsticks, cheeks full, small green sparkles of healing, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕 發大財**　存檔：`assets/characters/han/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, raising both arms joyfully and laughing loudly, golden coins and gold ingots raining down around him, golden sparkles, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 畫面用圖

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/han.png`　尺寸：正方形 1:1（512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, head and shoulders portrait of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, facing slightly right, expressive face, simple royal blue and navy gradient background, square image, character fills the frame, no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「放馬過來，林北蛋你！」）**　存檔：`assets/posters/han.png`　尺寸：超寬橫式 4:1（1600×400）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, fighting game super move cut-in banner, extreme close-up of the face of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, laughing heartily, raising a wooden gavel high, gold coins flying in the air, cheerful but daring expression, face placed in the LEFT third of the image, the right two thirds is empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**選角／VS 畫面全身立繪**　存檔：`assets/select/han.png`　尺寸：直式 2:3（800×1200）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, full body character select illustration of a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel, heroic confident pose facing slightly right, dynamic low angle, larger and more detailed than a sprite, feet touching the bottom edge, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

---

## 慢跑總統（`ma`）　金句：「我是很喜歡吃香蕉的人」

### 第一步：角色設定圖（先做這張，之後每張都上傳它當參考）

**角色設定圖**　存檔：`assets/ref/ma.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, character reference sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, three views side by side: front view, side view facing right, back view, full body, the same character in all views, plain solid pure green background (#00FF00), no text
```

### 基本動作

**站立待機**　存檔：`assets/characters/ma/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, fighting stance, fists raised, slight breathing bob, looping idle animation, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**走路**　存檔：`assets/characters/ma/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, walking forward cycle, arms swinging, looping walk animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**奔跑**　存檔：`assets/characters/ma/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, running fast cycle, body leaning forward, big strides, looping run animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**跳躍**　存檔：`assets/characters/ma/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, jumping: first frame pushing off, second frame in the air with knees tucked and arms up, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第一下**　存檔：`assets/characters/ma/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, quick straight jab punch with the front arm: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第二下**　存檔：`assets/characters/ma/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, cross punch with the back arm, torso twisting: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第三下（重擊）**　存檔：`assets/characters/ma/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, powerful finisher kick: chamber, kick fully extended, impact, recover, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**空中攻擊**　存檔：`assets/characters/ma/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, flying kick downward-forward in mid-air, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**衝刺攻擊**　存檔：`assets/characters/ma/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, running shoulder tackle, body leaning far forward, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**防禦**　存檔：`assets/characters/ma/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, blocking with both forearms crossed in front of the face, crouched slightly, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打**　存檔：`assets/characters/ma/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, getting hit, head snapped back, pained expression, body recoiling, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打飛**　存檔：`assets/characters/ma/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, knocked off his feet, flying backward through the air, body tilting to horizontal, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**倒地**　存檔：`assets/characters/ma/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, lying flat on the ground on his back, dazed, horizontal pose, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**起身／撿東西**　存檔：`assets/characters/ma/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, getting up from the ground: kneeling on one knee, then rising, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**暈眩**　存檔：`assets/characters/ma/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, dizzy and wobbling, swirly eyes, looping, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/ma/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, doing a forward somersault roll, curled into a ball, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**抓住對手揍**　存檔：`assets/characters/ma/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, holding an invisible opponent by the collar with one hand and punching with the other (draw only him, no opponent), 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**勝利**　存檔：`assets/characters/ma/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, victory pose animation: jogging in place happily, waving with one hand, holding a banana in the other, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 技能與大絕動作

**技1 香蕉皮**　存檔：`assets/characters/ma/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, tossing a banana peel low and forward onto the ground with a polite smile, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技2 香蕉迴力鏢**　存檔：`assets/characters/ma/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, throwing a yellow banana sidearm like a boomerang, spinning, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技3 慢跑閃避**　存檔：`assets/characters/ma/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, jogging quickly and lightly, a nimble sidestep dodge, sweat drops, cheerful polite face, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕 香蕉大放送**　存檔：`assets/characters/ma/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, happily jogging in place then tossing many yellow bananas up into the air one after another, bananas flying, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 畫面用圖

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/ma.png`　尺寸：正方形 1:1（512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, head and shoulders portrait of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, facing slightly right, expressive face, simple sky blue and white gradient background, square image, character fills the frame, no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「我是很喜歡吃香蕉的人」）**　存檔：`assets/posters/ma.png`　尺寸：超寬橫式 4:1（1600×400）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, fighting game super move cut-in banner, extreme close-up of the face of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, smiling politely while holding up a yellow banana next to his face, sweatband on, jogging pose, face placed in the LEFT third of the image, the right two thirds is empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**選角／VS 畫面全身立繪**　存檔：`assets/select/ma.png`　尺寸：直式 2:3（800×1200）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, full body character select illustration of a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger, heroic confident pose facing slightly right, dynamic low angle, larger and more detailed than a sprite, feet touching the bottom edge, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

---

## 阿北（`ko`）　金句：「賴祥德，沒有用的！」

### 第一步：角色設定圖（先做這張，之後每張都上傳它當參考）

**角色設定圖**　存檔：`assets/ref/ko.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, character reference sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, three views side by side: front view, side view facing right, back view, full body, the same character in all views, plain solid pure green background (#00FF00), no text
```

### 基本動作

**站立待機**　存檔：`assets/characters/ko/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, fighting stance, fists raised, slight breathing bob, looping idle animation, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**走路**　存檔：`assets/characters/ko/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, walking forward cycle, arms swinging, looping walk animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**奔跑**　存檔：`assets/characters/ko/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, running fast cycle, body leaning forward, big strides, looping run animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**跳躍**　存檔：`assets/characters/ko/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, jumping: first frame pushing off, second frame in the air with knees tucked and arms up, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第一下**　存檔：`assets/characters/ko/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, quick straight jab punch with the front arm: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第二下**　存檔：`assets/characters/ko/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, cross punch with the back arm, torso twisting: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第三下（重擊）**　存檔：`assets/characters/ko/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, powerful finisher kick: chamber, kick fully extended, impact, recover, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**空中攻擊**　存檔：`assets/characters/ko/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, flying kick downward-forward in mid-air, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**衝刺攻擊**　存檔：`assets/characters/ko/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, running shoulder tackle, body leaning far forward, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**防禦**　存檔：`assets/characters/ko/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, blocking with both forearms crossed in front of the face, crouched slightly, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打**　存檔：`assets/characters/ko/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, getting hit, head snapped back, pained expression, body recoiling, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打飛**　存檔：`assets/characters/ko/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, knocked off his feet, flying backward through the air, body tilting to horizontal, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**倒地**　存檔：`assets/characters/ko/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, lying flat on the ground on his back, dazed, horizontal pose, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**起身／撿東西**　存檔：`assets/characters/ko/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, getting up from the ground: kneeling on one knee, then rising, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**暈眩**　存檔：`assets/characters/ko/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, dizzy and wobbling, swirly eyes, looping, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/ko/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, doing a forward somersault roll, curled into a ball, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**抓住對手揍**　存檔：`assets/characters/ko/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, holding an invisible opponent by the collar with one hand and punching with the other (draw only him, no opponent), 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**勝利**　存檔：`assets/characters/ko/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, victory pose animation: adjusting his glasses with a tiny satisfied smirk, arms behind his back, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 技能與大絕動作

**技1 飛刀手術**　存檔：`assets/characters/ko/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, flicking his wrist to throw three small silver surgical scalpels forward in a fan, calm deadpan face, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技2 電擊器**　存檔：`assets/characters/ko/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, thrusting two defibrillator paddles forward, crackling blue electric sparks, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技3 單車環島**　存檔：`assets/characters/ko/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, riding a road bicycle at high speed, leaning forward over the handlebars, wheels with motion blur, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕 葉克膜**　存檔：`assets/characters/ko/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, standing calmly surrounded by a green healing glow, then raising both arms as blue lightning bolts strike down around him, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 畫面用圖

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/ko.png`　尺寸：正方形 1:1（512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, head and shoulders portrait of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, facing slightly right, expressive face, simple teal and dark green gradient background, square image, character fills the frame, no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「賴祥德，沒有用的！」）**　存檔：`assets/posters/ko.png`　尺寸：超寬橫式 4:1（1600×400）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, fighting game super move cut-in banner, extreme close-up of the face of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, deadpan expression, pushing up his round glasses with one finger, the glasses glinting, holding a scalpel, face placed in the LEFT third of the image, the right two thirds is empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**選角／VS 畫面全身立繪**　存檔：`assets/select/ko.png`　尺寸：直式 2:3（800×1200）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, full body character select illustration of a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers, heroic confident pose facing slightly right, dynamic low angle, larger and more detailed than a sprite, feet touching the bottom edge, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

---

## 館長（`guan`）　金句：「RRR！幫我開直播！」

### 第一步：角色設定圖（先做這張，之後每張都上傳它當參考）

**角色設定圖**　存檔：`assets/ref/guan.png（自己留著當參考，不用放進遊戲）`　尺寸：16:9 橫式

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, character reference sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, three views side by side: front view, side view facing right, back view, full body, the same character in all views, plain solid pure green background (#00FF00), no text
```

### 基本動作

**站立待機**　存檔：`assets/characters/guan/idle.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, fighting stance, fists raised, slight breathing bob, looping idle animation, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**走路**　存檔：`assets/characters/guan/walk.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, walking forward cycle, arms swinging, looping walk animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**奔跑**　存檔：`assets/characters/guan/run.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, running fast cycle, body leaning forward, big strides, looping run animation, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**跳躍**　存檔：`assets/characters/guan/jump.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, jumping: first frame pushing off, second frame in the air with knees tucked and arms up, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第一下**　存檔：`assets/characters/guan/attack1.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, quick straight jab punch with the front arm: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第二下**　存檔：`assets/characters/guan/attack2.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, cross punch with the back arm, torso twisting: wind-up, full extension, recover, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**攻擊第三下（重擊）**　存檔：`assets/characters/guan/attack3.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, powerful finisher kick: chamber, kick fully extended, impact, recover, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**空中攻擊**　存檔：`assets/characters/guan/jump_attack.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, flying kick downward-forward in mid-air, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**衝刺攻擊**　存檔：`assets/characters/guan/run_attack.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, running shoulder tackle, body leaning far forward, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**防禦**　存檔：`assets/characters/guan/defend.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, blocking with both forearms crossed in front of the face, crouched slightly, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打**　存檔：`assets/characters/guan/hurt.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, getting hit, head snapped back, pained expression, body recoiling, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**被打飛**　存檔：`assets/characters/guan/fall.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, knocked off his feet, flying backward through the air, body tilting to horizontal, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**倒地**　存檔：`assets/characters/guan/down.png`　尺寸：1 格橫排（每格 512×512，整張 512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, lying flat on the ground on his back, dazed, horizontal pose, 1 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**起身／撿東西**　存檔：`assets/characters/guan/getup.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, getting up from the ground: kneeling on one knee, then rising, 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**暈眩**　存檔：`assets/characters/guan/dizzy.png`　尺寸：3 格橫排（每格 512×512，整張 1536×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, dizzy and wobbling, swirly eyes, looping, 3 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**翻滾閃避／空中翻身**　存檔：`assets/characters/guan/roll.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, doing a forward somersault roll, curled into a ball, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**抓住對手揍**　存檔：`assets/characters/guan/catch.png`　尺寸：2 格橫排（每格 512×512，整張 1024×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, holding an invisible opponent by the collar with one hand and punching with the other (draw only him, no opponent), 2 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**勝利**　存檔：`assets/characters/guan/victory.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, victory pose animation: double biceps flex, roaring proudly, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 技能與大絕動作

**技1 過肩摔**　存檔：`assets/characters/guan/special_fwd.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, a wrestling suplex motion: reaching forward to grab, lifting with both arms, then swinging over his shoulder and slamming down (draw only him, no opponent), 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技2 館長上勾拳**　存檔：`assets/characters/guan/special_up.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, a powerful rising uppercut, jumping slightly off the ground with the fist high above, impact burst, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**技3 啞鈴投擲**　存檔：`assets/characters/guan/special_down.png`　尺寸：4 格橫排（每格 512×512，整張 2048×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, winding up and throwing a heavy black dumbbell forward in a high arc, 4 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕 開直播**　存檔：`assets/characters/guan/super.png`　尺寸：6 格橫排（每格 512×512，整張 3072×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, sprite sheet of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, holding a smartphone up to livestream with a red LIVE light, shouting, then a rapid punching flurry with many fist afterimages, 6 frames arranged in a single horizontal row from left to right, side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

### 畫面用圖

**頭像（血條、選角卡片、大絕橫幅的圓形頭像）**　存檔：`assets/portraits/guan.png`　尺寸：正方形 1:1（512×512）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, head and shoulders portrait of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, facing slightly right, expressive face, simple red and dark maroon gradient background, square image, character fills the frame, no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「RRR！幫我開直播！」）**　存檔：`assets/posters/guan.png`　尺寸：超寬橫式 4:1（1600×400）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, fighting game super move cut-in banner, extreme close-up of the face of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, roaring with mouth wide open, flexing huge muscles, holding a smartphone up as if livestreaming, red LIVE light, face placed in the LEFT third of the image, the right two thirds is empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

**選角／VS 畫面全身立繪**　存檔：`assets/select/guan.png`　尺寸：直式 2:3（800×1200）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, full body character select illustration of a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer, heroic confident pose facing slightly right, dynamic low angle, larger and more detailed than a sprite, feet touching the bottom edge, plain solid pure green background (#00FF00), no text. Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors).
```

---

## 共用畫面（場景、首頁、開場）

### 場景背景

**立法院議場**　存檔：`assets/stages/legislature.png`　尺寸：16:9（1920×1080）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, side-scrolling beat 'em up stage background, interior of a parliament assembly hall, wooden walls, a raised speaker's podium in the center, two electronic voting result boards, rows of wooden desks with microphones along the back, press gallery balcony with camera flashes, the lower 46 percent of the image is an open empty teal carpet floor in perspective with a few scattered papers, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text
```

**造勢晚會現場**　存檔：`assets/stages/rally.png`　尺寸：16:9（1920×1080）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, side-scrolling beat 'em up stage background, night-time political campaign rally stage, metal truss with colorful stage lights, a huge red LED screen, big speakers, a cheering crowd silhouette waving multicolored flags, sweeping spotlights, the lower 46 percent of the image is an open empty wooden stage floor in perspective, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text
```

**政論節目攝影棚**　存檔：`assets/stages/studio.png`　尺寸：16:9（1920×1080）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, side-scrolling beat 'em up stage background, TV political talk show studio, deep blue lighting, a giant screen in the center, side screens with bar charts, a news ticker bar, an anchor desk, studio cameras, the lower 46 percent of the image is an open empty glossy dark blue studio floor with tape marks in perspective, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text
```

### 首頁與開場

**首頁主視覺**　存檔：`assets/stages/title.png`　尺寸：16:9（1920×1080）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, epic arcade game key art, night sky over a city, a glowing government building in the center with golden light rays, six caricature politicians posing heroically in a row in front: a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude; a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression; a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel; a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger; a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers; a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer. Keep the top third of the image empty dark sky for a logo and the bottom fifth simple, wide 16:9, no text. Use the attached reference images for each character's look.
```

**開場 1：議場**　存檔：`assets/stages/intro_1.png`　尺寸：16:9（1920×1080）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, wide shot of an empty parliament assembly hall interior, tense quiet atmosphere, dramatic lighting, wide 16:9, no characters, no text
```

**開場 2：警報**　存檔：`assets/stages/intro_2.png`　尺寸：16:9（1920×1080）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, parliament hall flashing red alarm lights, a big screen showing a red breaking-news banner with no readable words, the voting board glitching, chaos, wide 16:9, no text
```

**開場 3：剪影**　存檔：`assets/stages/intro_3.png`　尺寸：16:9（1920×1080）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, six mysterious black silhouettes of politicians standing in a row under spotlights in a dark hall, one bald, one with long hair, one chubby, one with a sweatband, one with round glasses, one huge muscular bearded, dramatic, wide 16:9, no text
```

**開場 4：對峙**　存檔：`assets/stages/intro_4.png`　尺寸：16:9（1920×1080）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, split screen face-off, versus fighting game style: on the left a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel shouting, on the right a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude shouting, lightning between them, wide 16:9, no text. Use the attached reference images.
```

**開場 5：衝鋒**　存檔：`assets/stages/intro_5.png`　尺寸：16:9（1920×1080）

```
16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character, six caricature politicians charging forward together on a campaign rally stage, speed lines, explosive energy, fighting game opening screen, wide 16:9, no text. Use the attached reference images for each character's look.
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
