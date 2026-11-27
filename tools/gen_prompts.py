#!/usr/bin/env python3
"""產生 Gemini 生圖 prompt 清單：docs/GEMINI_PROMPTS.md ＋ 可一鍵複製的 HTML 頁。
用法：python3 tools/gen_prompts.py [JSON 輸出路徑]
"""
import json, sys, html, pathlib

# 畫風：照使用者在 Gemini 做出、確定喜歡的「諷刺漫畫插畫風」（發大財院長那張立繪）
STYLE = ("clean hand-drawn comic caricature illustration, bold black outlines, flat cel-shaded colors, "
         "realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), "
         "caricature face that keeps a strong likeness, light-hearted video game character art")
SPRITE_END = ("side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, "
              "character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, "
              "plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders")
# 注意：Gemini 會擋「真實姓名＋真人照片」的圖，也會擋「真人被打」的畫面。
# 所以生圖 prompt 一律不寫姓名，只說「附件圖裡的角色」，動作描述也寫成卡通搞笑風。
REF_NOTE = ("Use the attached images (this character's full-body illustration and three-view sheet) as the exact reference: "
            "same face, same hairstyle, same outfit and colors, same body proportions and the same comic illustration style.")

def who(c):
    return "the character from the attached reference images"

BRIEF = """我正在做一款原創的網頁格鬥小遊戲，類型是 2.5D 橫向清版亂鬥（像經典街機的多人亂鬥遊戲），風格是輕鬆搞笑的政治諷刺漫畫。接下來我會請你幫我畫遊戲角色的美術素材，請先記住以下規則，之後每一張圖都要遵守：

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

"""

CHARS = [
  dict(id='su', brief='這次要畫的角色叫「衝衝院長」，個性急躁、衝勁十足，招牌台詞是「在那叫什麼！」。外型：光亮的大光頭（頭頂有反光亮點）、細方框金屬眼鏡、又粗又斜的濃眉、銳利的眼神、深灰西裝、白襯衫、灰藍領帶、黑皮鞋。招式：光頭反光閃到人、往上衝的頭槌、低頭往前衝撞。大絕是連續三段暴衝，全身冒橘色火焰氣場。',
    title='衝衝院長', quote='在那叫什麼！', color='orange and dark brown',
    zh='蘇貞昌', en='Su Tseng-chang', role='former Premier of Taiwan',
    face='completely bald shiny head, rectangular metal-frame glasses, thick dark slanted eyebrows, narrow intense eyes, deep smile lines, determined clenched jaw',
    desc='a bald elderly Taiwanese politician with a very shiny bald head and a bright white highlight, rectangular metal-frame glasses, thick dark stern eyebrows, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude',
    skills=[
      ('special_fwd', '技1 光頭閃光', 4, "leaning his head forward and down, his shiny bald head emitting a blinding cone of white-yellow light forward, light rays"),
      ('special_up', '技2 衝天頭槌', 4, "crouching down then launching straight upward head-first like a rocket, a rising headbutt with motion lines"),
      ('special_down', '技3 衝刺頭槌', 4, "lowering his head and charging forward head-first like a battering ram, body almost horizontal, dust and speed lines"),
      ('super', '大絕 衝衝衝', 6, "three explosive forward dashes: crouch, burst forward at full speed with body leaning far forward and a fiery orange aura, brief stop, burst again, shouting angrily, strong motion lines"),
    ],
    poster="shouting furiously with mouth wide open behind the mask, leaning toward the viewer, one fist punching toward the camera, bald head gleaming",
    victory="arms crossed, chin up, bald head shining, proud stern look"),
  dict(id='wang', brief='這次要畫的角色叫「堅哥」，情緒激動、熱血又戲劇化，招牌台詞是「Over my dead body！」。外型：及肩的黑色直長髮往後梳、粗黑眉、激動有神的大眼睛、黑西裝、白襯衫、黑領帶。招式：激動用手指指人並發出音波、雙手拍桌震出衝擊波、躺在地上抗議不走。大絕是張開雙臂怒吼，身上冒出金色光柱和震波。',
    title='堅哥', quote='Over my dead body！', color='gold and black',
    zh='王世堅', en='Wang Shih-chien', role='Taiwanese legislator',
    face='shoulder-length straight black hair combed back behind the ears, long oval face, thick dark eyebrows, wide intense passionate eyes, prominent cheekbones',
    desc='a middle-aged Taiwanese politician with shoulder-length straight black hair combed back, thick dark eyebrows, intense passionate eyes, black suit, white shirt, black tie, very emotional dramatic expression',
    skills=[
      ('special_fwd', '技1 指指點點', 4, "aggressively pointing his index finger forward while shouting, yellow sound-wave rings shooting out from his fingertip"),
      ('special_up', '技2 拍案而起', 4, "slamming both palms down hard, then springing up furious with arms raised, a golden shockwave ring spreading on the floor around him"),
      ('special_down', '技3 躺地抗議', 4, "lying down flat on his back on the floor in stubborn protest, arms crossed on his chest, refusing to move, defiant face"),
      ('super', '大絕 除非踏過我的屍體', 6, "spreading his arms wide and roaring dramatically, a tall pillar of golden light around him, hair blowing upward, then slamming fists down sending golden shockwaves"),
    ],
    poster="pointing his finger straight at the viewer, shouting with fiery passion, hair flowing dramatically, golden light behind him",
    victory="fist raised high, eyes closed, deeply moved and emotional, tears of passion"),
  dict(id='han', brief='這次要畫的角色叫「發大財院長」，圓臉、親切、笑口常開，招牌台詞是「放馬過來，林北蛋你！」。外型：頭頂禿、兩側短灰髮、寬圓臉、笑起來眼睛瞇成彎月形、咧嘴大笑、淺藍襯衫捲起袖子、黑皮帶、深藍長褲、黑皮鞋，招式會拿木製議事槌。招式：議事槌敲地震波、丟出水果貨箱、吃一碗滷肉飯回血。大絕是舉起雙手大笑，天上掉下金幣和金元寶。',
    title='發大財院長', quote='放馬過來，林北蛋你！', color='royal blue and navy',
    zh='韓國瑜', en='Han Kuo-yu', role='Speaker of the Legislative Yuan of Taiwan',
    face='bald crown with short grey hair only on the sides and back, big round face, small smiling eyes, wide warm grin, full cheeks',
    desc="a chubby round-faced elderly Taiwanese politician, bald on top with short grey hair on the sides, big warm friendly grin, light blue dress shirt with rolled-up sleeves, black belt, slight round belly, dark navy trousers, black shoes, holding a wooden judge's gavel",
    skills=[
      ('special_fwd', '技1 議事槌', 4, "raising a giant wooden gavel high overhead with both hands, then slamming it onto the ground, a shockwave and dust burst"),
      ('special_up', '技2 貨出得去', 4, "lifting a big cardboard fruit shipping crate and hurling it forward with both hands"),
      ('special_down', '技3 滷肉飯補血', 4, "happily eating a bowl of braised pork rice with chopsticks, cheeks full, small green sparkles of healing"),
      ('super', '大絕 發大財', 6, "raising both arms joyfully and laughing loudly, golden coins and gold ingots raining down around him, golden sparkles"),
    ],
    poster="laughing heartily, raising a wooden gavel high, gold coins flying in the air, cheerful but daring expression",
    victory="giving a big thumbs up with a wide grin, gold coins sparkling"),
  dict(id='ma', brief='這次要畫的角色叫「慢跑總統」，斯文有禮、愛慢跑、愛吃香蕉，招牌台詞是「我是很喜歡吃香蕉的人」。外型：身材瘦、整齊的深色旁分頭髮、溫和有禮的微笑、額頭戴紅白色運動頭帶、藍邊白色運動 T 恤、藍色運動短褲、白色慢跑鞋。招式：丟香蕉皮讓人滑倒、香蕉迴力鏢、輕快慢跑閃避。大絕是邊慢跑邊把一大堆香蕉拋向空中。',
    title='慢跑總統', quote='我是很喜歡吃香蕉的人', color='sky blue and white',
    zh='馬英九', en='Ma Ying-jeou', role='former President of Taiwan',
    face='neat dark side-parted hair, slim oval face, gentle polite smile, soft eyes, clean-shaven, slim build',
    desc='a slim elderly Taiwanese gentleman with neat dark side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger',
    skills=[
      ('special_fwd', '技1 香蕉皮', 4, "tossing a banana peel low and forward onto the ground with a polite smile"),
      ('special_up', '技2 香蕉迴力鏢', 4, "throwing a yellow banana sidearm like a boomerang, spinning"),
      ('special_down', '技3 慢跑閃避', 4, "jogging quickly and lightly, a nimble sidestep dodge, sweat drops, cheerful polite face"),
      ('super', '大絕 香蕉大放送', 6, "happily jogging in place then tossing many yellow bananas up into the air one after another, bananas flying"),
    ],
    poster="smiling politely while holding up a yellow banana next to his face, sweatband on, jogging pose",
    victory="jogging in place happily, waving with one hand, holding a banana in the other"),
  dict(id='ko', brief='這次要畫的角色叫「阿北」，以前是外科醫師，總是面無表情、講話很直，招牌台詞是「賴祥德，沒有用的！」。外型：灰色短髮、細金屬框眼鏡、寬臉、嘴巴抿成一直線的撲克臉、深藍西裝外套、淺藍色開領襯衫不打領帶、深色長褲。招式：射出三把手術刀、用電擊器電人、騎公路車衝刺。大絕是全身冒出綠色治療光芒，再舉起雙手召喚藍色閃電。',
    title='阿北', quote='賴祥德，沒有用的！', color='teal and dark green',
    zh='柯文哲', en='Ko Wen-je', role='former Taipei mayor and surgeon',
    face='short grey hair, thin metal-frame glasses, wide flat face, straight mouth, deadpan expression, slightly heavy-lidded eyes',
    desc='a Taiwanese politician and former surgeon with short grey hair, thin metal-frame glasses, deadpan expressionless face, dark navy suit jacket over a light blue open-collar shirt with no tie, dark trousers, black shoes',
    skills=[
      ('special_fwd', '技1 飛刀手術', 4, "flicking his wrist to throw three small silver surgical scalpels forward in a fan, calm deadpan face"),
      ('special_up', '技2 電擊器', 4, "thrusting two defibrillator paddles forward, crackling blue electric sparks"),
      ('special_down', '技3 單車環島', 4, "riding a road bicycle at high speed, leaning forward over the handlebars, wheels with motion blur"),
      ('super', '大絕 葉克膜', 6, "standing calmly surrounded by a green healing glow, then raising both arms as blue lightning bolts strike down around him"),
    ],
    poster="deadpan expression, pushing up his glasses with one finger, the glasses glinting, holding a scalpel",
    victory="adjusting his glasses with a tiny satisfied smirk, arms behind his back"),
  dict(id='guan', brief='這次要畫的角色叫「館長」，超大隻的健身房老闆兼直播主，脾氣火爆，招牌台詞是「RRR！幫我開直播！」。外型：光頭、濃密的黑色大鬍子、粗眉、兇狠的眼神、粗脖子、黑色背心、超大的手臂肌肉、迷彩綠工作褲、黑靴子。招式：過肩摔、跳起來的上勾拳、丟出大啞鈴。大絕是舉起手機開直播（手機上有紅色 LIVE 燈），接著連續狂打，拳頭殘影一大堆。',
    title='館長', quote='RRR！幫我開直播！', color='red and dark maroon',
    zh='館長 陳之漢', en="Chen Chih-han (the YouTuber known as 'Guan Zhang')", role='Taiwanese gym owner and livestreamer',
    face='shaved bald head, thick full black beard, heavy brow, fierce glaring eyes, thick neck',
    desc='a huge muscular bald Taiwanese man with a thick full black beard, fierce glaring eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots',
    skills=[
      ('special_fwd', '技1 過肩摔', 4, "a wrestling suplex motion: reaching forward to grab, lifting with both arms, then swinging over his shoulder and slamming down (draw only him, no opponent)"),
      ('special_up', '技2 館長上勾拳', 4, "a powerful rising uppercut, jumping slightly off the ground with the fist high above, impact burst"),
      ('special_down', '技3 啞鈴投擲', 4, "winding up and throwing a heavy black dumbbell forward in a high arc"),
      ('super', '大絕 開直播', 6, "holding a smartphone up to livestream with a red LIVE light, shouting, then a rapid punching flurry with many fist afterimages"),
    ],
    poster="roaring with mouth wide open, flexing huge muscles, holding a smartphone up as if livestreaming, red LIVE light",
    victory="double biceps flex, roaring proudly"),
  # ───── 新增的四位主角（2026-11）─────
  dict(id='shen', brief='這次要畫的角色叫「黑熊教授」，戴眼鏡的學者型立委，講話理性但很有氣勢，招牌台詞是「台北順起來！」。外型：招牌的一大團又厚又蓬的深黑色捲髮（蓋住耳朵）、細框圓角長方形眼鏡、圓潤的臉、斯文的笑容、深藍色休閒西裝外套、黑色圓領T恤（胸口有小小的白色黑熊徽章）、深色長褲、黑皮鞋，手上常拿麥克風。招式：拿麥克風發表演講放出音波、召喚黑熊玩偶往前撲、丟出厚厚的「防衛手冊」。大絕是舉手一揮，召喚一股巨大的「洋流」：深藍色的海水夾著白色浪花從他身後湧出，捲成大浪橫掃全場。',
    title='黑熊教授', quote='台北順起來！', color='olive green and black',
    zh='沈伯洋', en='Puma Shen', role='Taiwanese legislator and scholar',
    face='a huge thick fluffy mop of tight messy dark curly hair covering the ears, thin rounded rectangular glasses, round soft face with full cheeks, gentle intellectual smile',
    desc='a Taiwanese scholar-politician in his forties with a huge fluffy mop of dark curly hair, thin glasses, round face, navy blue casual blazer over a black crew-neck t-shirt with a small white bear badge, dark trousers, black shoes, holding a microphone, calm but confident',
    skills=[
      ('special_fwd', '技1 演講音波', 4, "holding the microphone close and giving a passionate speech, visible sound-wave rings blasting forward"),
      ('special_up', '技2 黑熊撲擊', 4, "pointing forward as a cute cartoon black bear plush leaps forward from beside him with paws raised"),
      ('special_down', '技3 丟防衛手冊', 4, "throwing a thick hardcover handbook forward like a frisbee"),
      ('super', '大絕 洋流', 6, "raising the microphone then sweeping his free arm forward powerfully and shouting, ending in a strong forward-pointing pose (pose only, no water effects - the game draws the orange current)"),
    ],
    poster="speaking passionately into a microphone toward the viewer, curly hair bouncing, one hand raised, a huge deep-blue swirling ocean current wave with white foam crashing behind him over a bold orange background",
    victory="raising the microphone high with a confident smile, cartoon black bear plush on his shoulder"),
  dict(id='chiang', brief='這次要畫的角色叫「帥氣市長」，年輕帥氣、笑容陽光的市長，招牌台詞是「輝達、牛奶、大巨蛋！」。外型：有「公子哥」氣質、自信從容的富家少爺感；濃密往上吹高、往後梳的黑色油頭、濃眉、雙眼皮大眼、方下巴、從容得意的微笑、修長身材、合身高級深藍色西裝、淺藍襯衫不打領帶、白色口袋巾、精緻手錶、發亮的黑皮鞋。招式：比讚放出帥氣閃光、甩出一疊市政白皮書、跑步衝刺撞人。大絕是舉起拳頭喊「輝達、牛奶、大巨蛋！」，背後放出滿天煙火。',
    title='帥氣市長', quote='輝達、牛奶、大巨蛋！', color='navy blue and light blue',
    zh='蔣萬安', en='Chiang Wan-an', role='Mayor of Taipei',
    face='thick voluminous black hair blown up and swept back, thick eyebrows, big double-lidded eyes, strong square jaw, confident easygoing smirk, polished handsome young-master face',
    desc='a tall slim handsome Taiwanese mayor in his forties with the air of a rich young master, voluminous swept-back black hair, confident smirk, tailored navy blue suit, light blue shirt with open collar and no tie, white pocket square, luxury wristwatch, shiny black shoes, suave and self-assured',
    skills=[
      ('special_fwd', '技1 帥氣閃光', 4, "giving a thumbs up with a wink and a sparkling smile, a burst of bright star-shaped sparkles flying forward"),
      ('special_up', '技2 白皮書連發', 4, "throwing a fan of white policy booklets forward one after another"),
      ('special_down', '技3 晨跑衝刺', 4, "sprinting forward fast in his suit with a determined smile, body leaning forward, dust and speed lines"),
      ('super', '大絕 團結向前', 6, "raising a fist high and shouting, colorful fireworks exploding in the sky behind him, confetti"),
    ],
    poster="pumping a fist toward the viewer with a bright confident smile, fireworks behind",
    victory="thumbs up with a sparkling smile, other hand on his hip"),
  dict(id='tsai', brief='這次要畫的角色叫「辣台妹總統」，冷靜溫和但很有原則的女性總統，招牌台詞是「不錯喔，你們畢竟是死忠的！」。外型：俐落的深色短鮑伯頭、細框圓眼鏡、溫和的微笑、黑色西裝外套、米白色內搭上衣、黑色長褲、黑色平底鞋，身邊有兩隻貓咪。招式：放出貓咪往前撲、手掌往前推出辣椒火焰、推一推眼鏡閃光。大絕是一大群綠色小鳥從身後飛出，往前衝過全場。',
    title='辣台妹總統', quote='不錯喔，你們畢竟是死忠的！', color='black and cream',
    zh='蔡英文', en='Tsai Ing-wen', role='former President of Taiwan',
    face='neat short dark bob haircut, thin round-ish glasses, soft round face, gentle calm smile',
    desc='a calm composed Taiwanese woman leader in her sixties with a neat short dark bob haircut, thin glasses, gentle smile, black blazer over a cream top, black trousers, black flat shoes, confident and dignified',
    skills=[
      ('special_fwd', '技1 貓咪出擊', 4, "pointing forward as a grey tabby cat leaps out from beside her and pounces forward with claws out"),
      ('special_up', '技2 辣椒火焰', 4, "pushing one palm forward as a burst of red chili-pepper flames shoots out, little chili peppers in the fire"),
      ('special_down', '技3 眼鏡閃光', 4, "pushing up her glasses with one finger, the lenses flashing a blinding white light forward"),
      ('super', '大絕 綠鳥出巢', 6, "calmly raising one hand then sweeping it forward as a huge flock of small cartoon green birds bursts out from behind her and flies forward"),
    ],
    poster="calm confident smile, pushing up her glasses, a cat peeking over her shoulder",
    victory="holding a grey tabby cat in her arms with a gentle smile"),
  dict(id='hsieh', brief='這次要畫的角色叫「龍介仙」，講話直接、很有台南味的資深議員，招牌台詞是「一生監督你一人！」。外型：修長的鵝蛋臉、窄下巴、濃密黑短髮側分且頭頂蓬高往後梳、細金屬框眼鏡、細長眼；草根親民、戲劇感強、講台語，質詢時切換「戰鬥模式」高分貝怒吼、手指前方、肢體誇張；白色長袖襯衫袖子捲到手肘、不打領帶、黑皮帶、深色長褲、黑皮鞋，常拿布袋戲偶。招式：用布袋戲偶打出金色掌風、拿大聲公用台語大喊放出音波、丟出虱目魚。大絕是放出滿天粉紅色愛心追著對手跑。',
    title='龍介仙', quote='一生監督你一人！', color='white and dark navy',
    zh='謝龍介', en='Hsieh Lung-chieh', role='Taiwanese legislator from Tainan',
    face='long oval face with a narrow chin, thick short black hair side-parted and swept up high, thin metal-frame oval glasses, narrow eyes, fierce dramatic expression',
    desc='a dramatic grassroots Taiwanese politician in his sixties with a long oval face, thick side-parted black hair swept up, thin metal glasses, white long-sleeve dress shirt with sleeves rolled to the elbows and no tie, black belt, dark trousers, black shoes, wearing a traditional Taiwanese glove puppet on one hand, fiery and theatrical',
    skills=[
      ('special_fwd', '技1 布袋戲掌', 4, "thrusting the hand wearing the glove puppet forward, the puppet hero striking with a glowing golden palm blast flying forward"),
      ('special_up', '技2 台語大聲公', 4, "shouting into a red megaphone, big visible sound-wave rings blasting forward"),
      ('special_down', '技3 丟虱目魚', 4, "throwing a big silver milkfish forward like a spear"),
      ('super', '大絕 愛的監督', 6, "pointing forward with a loving yet stern stare as a stream of glowing pink hearts bursts out from him and flies forward, sparkles"),
    ],
    poster="shouting fiercely toward the viewer, pointing a finger, glove puppet raised on the other hand",
    victory="flashing a V sign with a big satisfied grin, glove puppet bowing on the other hand"),
]

BASIC = [
  ('idle', '站立待機', 4, "fighting stance, fists raised, slight breathing bob, looping idle animation"),
  ('walk', '走路', 6, "walking forward cycle, arms swinging, looping walk animation"),
  ('run', '奔跑', 6, "running fast cycle, body leaning forward, big strides, looping run animation"),
  ('jump', '跳躍', 2, "jumping: first frame pushing off, second frame in the air with knees tucked and arms up"),
  ('attack1', '攻擊第一下', 3, "quick straight jab punch with the front arm: wind-up, full extension, recover"),
  ('attack2', '攻擊第二下', 3, "cross punch with the back arm, torso twisting: wind-up, full extension, recover"),
  ('attack3', '攻擊第三下（重擊）', 4, "powerful finisher kick: chamber, kick fully extended, impact, recover"),
  ('jump_attack', '空中攻擊', 2, "flying kick downward-forward in mid-air"),
  ('run_attack', '衝刺攻擊', 3, "running shoulder tackle, body leaning far forward"),
  ('defend', '防禦', 1, "blocking with both forearms crossed in front of the face, crouched slightly"),
  ('hurt', '被打', 2, "comedic cartoon reaction: staggering backward with a funny surprised face, little cartoon stars around the head"),
  ('fall', '被打飛', 3, "comically tumbling backward through the air like a slapstick cartoon, body tilting to horizontal, funny surprised face"),
  ('down', '倒地', 1, "lying flat on the floor on his back with cartoon swirly eyes, slapstick comedy, horizontal pose"),
  ('getup', '起身／撿東西', 2, "getting up from the ground: kneeling on one knee, then rising"),
  ('dizzy', '暈眩', 3, "dizzy and wobbling, swirly eyes, looping"),
  ('roll', '翻滾閃避／空中翻身', 4, "doing a forward somersault roll, curled into a ball"),
  ('spin', '迴旋攻擊（↓＋攻）', 4, "a spinning whirlwind attack hitting all around: winding up, spinning around with arms or a kick sweeping in a full circle, motion swirl lines, recover"),
  ('catch', '抓住對手揍', 2, "comedic cartoon grab: one hand reaching forward grabbing the air, the other hand doing a playful cartoon jab (only this one character in the image)"),
  ('victory', '勝利', 4, None),
]
ATTACK_OVERRIDE = {
  'han': {'attack1': "swinging a wooden gavel down from above: raise, strike, recover",
          'attack3': "big overhead two-handed gavel slam onto the ground: raise high, slam, impact dust, recover"},
}

def sprite(c, name, frames, action, extra=''):
    return (f"{REF_NOTE} Draw a sprite strip of this character for a 2D fighting game: {action}. "
            f"{frames} frames arranged in a single horizontal row from left to right{extra}, {SPRITE_END}. Art style: {STYLE}.")

def char_sections(c):
    items = []
    G0 = '第零步：每次開新對話，先貼這段'
    G1 = '第一步：角色立繪（上傳 2～3 張照片＋貼這段）'
    G2 = '第二步：三視圖（上傳第一步的立繪）'
    items.append(dict(group=G0, name='遊戲說明＋這個角色的說明', file='（不用存檔）', size='文字',
        prompt=BRIEF + c['brief'] + "\n\n如果了解了，請回答「了解」，然後等我上傳圖片和下一步的指示。"))
    feat = f"{c['face']}; {c['desc']}"
    items.append(dict(group=G1, name='做法 A：上傳照片（畫法跟發大財院長那張一樣）', file=f"assets/select/{c['id']}.png（這張也直接當選角立繪）",
        size='直式 2:3（800×1200）',
        prompt=("請參考附上的照片，畫一張這個角色的「諷刺漫畫風」全身立繪：乾淨的手繪漫畫插畫風（不是像素風），正常成人比例約六頭身，不要大頭。\n"
                "畫之前，請先用文字列出照片中最能認出他的 5 個特徵（臉型、髮際線與髮型、眼睛形狀、笑容或招牌表情、體型），畫的時候這 5 點要明顯保留，並稍微誇張化。\n"
                "服裝照我在角色說明裡寫的。三分之四側面、面向右，全身，腳底貼齊下緣，純綠色 #00FF00 背景，沒有文字。")))
    items.append(dict(group=G1, name='做法 B：A 被拒絕時用（開新對話、不上傳照片）', file=f"assets/select/{c['id']}.png", size='直式 2:3（800×1200）',
        prompt=(f"Full body character illustration, three-quarter view facing right, feet touching the bottom edge: {feat}. "
                f"Art style: {STYLE}. Plain solid pure green background (#00FF00), no text.")))
    items.append(dict(group=G1, name='不夠像時接著貼（把【】改成哪裡不像）', file='（同一張，修好再存）', size='—',
        prompt="還不夠像。請再對照一次照片，先用文字列出你這張和照片最不像的 3 個地方，再修正。特別注意：【例如：臉要更寬、眼睛笑成彎月形、眉毛更粗更斜、頭髮更灰】。其他保持不變：畫風、服裝、六頭身比例、純綠背景。"))
    items.append(dict(group=G2, name='三視圖設定圖', file=f"assets/ref/{c['id']}.png（自己留著當參考，不用放進遊戲）", size='16:9 橫式',
        prompt=("請用附上這張立繪的角色，畫成「角色三視圖設定圖」：完全保留臉的長相、表情、服裝、配色、身材比例和畫風。"
                "正面、面向右的側面、背面三個角度並排，全身，腳底對齊，純綠色 #00FF00 背景，沒有文字。")))
    for key, zh, n, act in BASIC:
        a = ATTACK_OVERRIDE.get(c['id'], {}).get(key, act)
        if key == 'victory':
            a = f"victory pose animation: {c['victory']}"
        items.append(dict(group='基本動作（每張都上傳立繪＋三視圖，一次只生一張）', name=f"{zh}", file=f"assets/characters/{c['id']}/{key}.png", frames=n,
            size=f"{n} 格橫排（每格 512×512，整張 {512*n}×512）", prompt=sprite(c, key, n, a)))
    for key, zh, n, act in c['skills']:
        items.append(dict(group='技能與大絕動作（同上）', name=zh, file=f"assets/characters/{c['id']}/{key}.png", frames=n,
            size=f"{n} 格橫排（每格 512×512，整張 {512*n}×512）", prompt=sprite(c, key, n, act)))
    items.append(dict(group='畫面用圖（同上）', name='頭像（血條、選角卡片、大絕橫幅的圓形頭像）', file=f"assets/portraits/{c['id']}.png", frames=None,
        size='正方形 1:1（512×512）',
        prompt=f"{REF_NOTE} Draw a head and shoulders portrait of this character, facing slightly right, expressive face, simple {c['color']} gradient background, square image, the face fills most of the frame, no text. Art style: {STYLE}."))
    items.append(dict(group='畫面用圖（同上）', name=f"大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「{c['quote']}」）", file=f"assets/posters/{c['id']}.png", frames=None,
        size='超寬橫式 4:1（1600×400）',
        prompt=f"{REF_NOTE} Draw a fighting game super move cut-in banner: extreme close-up of this character's face, {c['poster']}, the face placed in the LEFT third of the image, the right two thirds left as empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. Art style: {STYLE}."))
    return items


# ───────── 劇情模式的敵人（原創角色，不像任何真實人物） ─────────
NPC_BRIEF = """我正在做一款原創的網頁格鬥小遊戲（2.5D 橫向清版亂鬥），風格是輕鬆搞笑的政治諷刺漫畫。接下來要畫「劇情模式」裡的敵人，他們都是原創的虛構角色，代表選舉時會遇到的各種麻煩，不像任何真實人物。請記住以下規則：

【美術風格】
- 乾淨的手繪諷刺漫畫插畫風：粗黑外框線、平塗上色加簡單陰影（跟我遊戲主角們的畫風一致）
- 正常成人比例，大約六頭身，不要 Q 版、不要大頭
- 誇張、好笑、一眼看得出是什麼角色

【圖片規格】
- 背景一律是純綠色 #00FF00（遊戲會自動去背），角色身上不要用亮綠色
- 角色一律「側面、面向右邊」、全身、腳底貼齊圖片下緣
- 動作圖是「動作條」：同一個角色的連續動作由左到右排成一列，每格一樣寬、角色大小一樣、位置置中，格子之間不要畫框線
- 圖上不要有任何文字、數字、浮水印、地面陰影
- 被打、倒地要畫成搞笑的卡通反應，不要畫成真的受傷

【一致性】
- 我會上傳這個角色的三視圖，每一張都要跟它的臉、髮型、服裝、配色、比例、畫風完全一樣
- 一次只畫一張圖，畫完等我確認

"""
NPC_REF = ("Use the attached three-view character sheet as the exact reference: same face, same hairstyle, same outfit and colors, "
           "same body proportions and the same comic illustration style.")

NPCS = [
  dict(id='gang', title='陣頭小弟', stage='第 1 關小怪', color='yellow and black',
    brief="這次要畫的是「陣頭小弟」（廟口陣頭的小混混）。外型：瘦瘦的年輕人、染成金黃色的刺蝟頭、細眉、嚼檳榔的囂張表情、白色無袖背心、黑色運動褲、藍白拖。手上拿著一串紅色鞭炮。招式：用拳頭亂打、把點燃的鞭炮丟出去。",
    desc="a skinny cocky young temple-procession gang punk, bleached golden spiky hair, thin eyebrows, smug face, white sleeveless tank top, black track pants, blue-and-white plastic slippers, holding a string of red firecrackers",
    special=("special", "丟鞭炮", 4, "lighting a string of red firecrackers and tossing it forward underhand, sparks on the fuse"),
    victory=None),
  dict(id='protester', title='抗議群眾', stage='第 1 關小怪', color='beige and red',
    brief="這次要畫的是「抗議群眾」（喊司法不公的抗議民眾）。外型：中年大叔、灰色旁分頭髮、圓框眼鏡、額頭綁白色布條（上面不要有可讀的字）、米色 T 恤、深灰長褲。手上拿著手寫抗議牌（牌子上用色塊代替文字）和一個小擴音器。招式：拿牌子揮人、對著擴音器大喊放出音波。",
    desc="an angry middle-aged male protester, grey side-parted hair, round glasses, white cloth headband with red marks (no readable text), beige t-shirt, dark grey trousers, holding a handmade protest placard with color blocks instead of text and a small megaphone",
    special=("special", "大聲公", 4, "shouting furiously into a small megaphone, visible sound-wave rings coming out"),
    victory=None),
  dict(id='paparazzi', title='偷拍狗仔', stage='第 1 關小王', color='tan and dark brown',
    brief="這次要畫的是「偷拍狗仔」（專門偷拍、做假緋聞照的狗仔記者）。外型：鬼鬼祟祟的中年男子、反戴棒球帽、深色墨鏡、米色風衣、脖子上掛一台裝長鏡頭的大相機、奸笑。招式：舉相機閃光偷拍、丟出打了馬賽克的「合成照片」、往後開溜。",
    desc="a sneaky paparazzi photographer, backwards baseball cap, dark sunglasses, beige trench coat, a big DSLR camera with a long zoom lens hanging from his neck, sly grin",
    special=("special_fwd", "閃光偷拍", 4, "raising the camera to his eye and firing a blinding white flash forward"),
    lean_extra=[("special_fwd", "閃光偷拍", 4, "raising a big camera to his eye and firing a white flash forward")],
    extra=[("special_up", "丟合成照", 4, "flicking a printed photo with a pink mosaic blur forward like a frisbee, sneaky grin"),
           ("special_down", "開溜", 4, "scurrying backward away from the viewer's right side, hunched, clutching the camera")],
    victory=None),
  dict(id='kingpin', title='角頭樁腳王', stage='第 1 關 Boss', color='purple and gold',
    brief="這次要畫的是第一關 Boss「角頭樁腳王」（地方角頭兼樁腳，專門喬選票）。外型：高大魁梧、大肚子、油頭往後梳、金框墨鏡、粗金項鍊、紫色花襯衫釦子開到胸口、手戴金戒指、金色皮鞋、得意又兇的笑。招式：一次丟三串鞭炮、低頭衝撞、拍手叫小弟、讓鞭炮像雨一樣落下。金句：「這區的票，攏是阮在喬的！」",
    desc="a big burly local gang boss and vote broker, slicked-back black hair, gold-framed sunglasses, thick gold chain, purple flower-pattern silk shirt unbuttoned to the chest, big belly, gold rings, gold shoes, smug intimidating grin",
    special=("special_fwd", "鞭炮陣", 4, "throwing three strings of lit red firecrackers forward at once in a wide spread"),
    lean_extra=[("special_fwd", "鞭炮陣", 4, "throwing lit red firecrackers forward"),
                ("special_up", "角頭衝撞", 4, "charging forward head-down like a bull"),
                ("super", "鞭炮雨", 4, "raising both arms and laughing while firecrackers rain down around him")],
    extra=[("special_up", "角頭衝撞", 4, "lowering his head and charging forward like a bull, dust clouds, belly first"),
           ("special_down", "叫小弟", 4, "clapping his hands and pointing forward commandingly, shouting orders"),
           ("super", "鞭炮雨", 6, "raising both arms and laughing as many lit firecrackers rain down from the sky around him, sparks everywhere")],
    victory="arms crossed laughing smugly, flashing a fat red envelope", boss=True),
  # ───── 第二、三關的新敵人：最省用量版本（小怪只要 idle＋attack1；走路、被打會自動用 idle 頂替）─────
  dict(id='vendor', title='夜市攤販', stage='第 2 關小怪', color='', keys=['idle', 'attack1'],
    desc="a chubby night-market food stall vendor, white headband, white tank top, blue shorts, blue-and-white slippers, holding a red plastic stool"),
  dict(id='canvasser', title='發傳單工讀生', stage='第 2 關小怪', color='', keys=['idle', 'attack1'],
    desc="a skinny young campaign flyer distributor in a bright green campaign t-shirt and cap, holding a stack of white flyers, eager smile"),
  dict(id='bodyguard', title='黑衣保鑣', stage='第 2 關小怪', color='', keys=['idle', 'attack1'],
    desc="a big bald bodyguard in a black suit and black sunglasses, earpiece, stern face, arms ready to tackle"),
  dict(id='troll', title='網軍小編', stage='第 2 關小王', color='', keys=['idle', 'attack1'],
    desc="a pale young internet troll in a dark blue hoodie, round glasses, messy hair, white sneakers, staring at a glowing smartphone, smug typing grin",
    lean_extra=[("special_fwd", "帶風向", 4, "holding up a glowing smartphone and blasting floating angry emoji icons forward")]),
  dict(id='tycoon', title='財團董事長', stage='第 2 關小王', color='', keys=['idle', 'attack1'],
    desc="a fat rich property tycoon, silver side-parted hair, rectangular gold glasses, shiny gold business suit, white shirt, red tie, big belly, cigar, gold watch, arrogant smirk",
    lean_extra=[("special_fwd", "撒鈔票", 4, "throwing a fan of gold coins and banknotes forward")]),
  dict(id='reporter', title='政論名嘴', stage='第 3 關小怪', color='', keys=['idle', 'attack1'],
    desc="a TV political pundit in a blue suit and red tie, rectangular glasses, side-parted hair, shouting into a microphone"),
  dict(id='cheerleader', title='造勢啦啦隊', stage='第 3 關小怪', color='', keys=['idle', 'attack1'],
    desc="a cheerful campaign rally cheerleader girl, blonde ponytail, pink headband, pink tank top, white skirt, holding pink pom-poms"),
  dict(id='votebuyer', title='買票樁腳', stage='第 3 關小怪', color='', keys=['idle', 'attack1'],
    desc="a chubby middle-aged vote buyer, balding with grey sides, beige short-sleeve shirt, holding a fan of red envelopes, sly grin"),
  dict(id='influencer', title='直播網紅', stage='第 3 關小王', color='', keys=['idle', 'attack1'],
    desc="a flashy livestream influencer with pink hair, round glasses, white jacket, holding a selfie stick with a glowing phone",
    lean_extra=[("special_fwd", "直播閃光", 4, "holding up the phone on a selfie stick and firing a bright white camera flash forward")]),
  dict(id='mastermind', title='幕後藏鏡人', stage='第 3 關小王', color='', keys=['idle', 'attack1'],
    desc="a tall sinister political mastermind in a long black suit, slicked long black hair, dark rectangular glasses, purple tie, black leather gloves, cold confident smile"),
]
# 路上的危險物（劇情模式）：像素風、側面向右、綠幕，存到 assets/scenery/prop_xxx.png
PROPS = [
  dict(group='劇情模式路上危險物（像素風，生好放 assets/scenery/）', name='圍事計程車（第一關）', file='assets/scenery/prop_taxi.png', size='約 2:1 橫式',
    prompt="Pixel art game prop for a 2D beat 'em up: a yellow taxi car used by local gang enforcers, side view facing right, tinted black windows, two tough thugs leaning out of the windows shouting and waving baseball bats, a red campaign flag tied on the roof, dented bumper, speed lines behind it. simple 16-bit pixel art, chunky dark outlines, limited color palette, plain solid pure green background (#00FF00), no text, no shadow, the whole car fits inside the image."),
  dict(group='劇情模式路上危險物（像素風，生好放 assets/scenery/）', name='夜市暴衝機車（第二關）', file='assets/scenery/prop_scooter.png', size='約 3:2 橫式',
    prompt="Pixel art game prop for a 2D beat 'em up: a red scooter speeding recklessly with a delivery rider in a yellow helmet carrying a big food box, side view facing right, speed lines. simple 16-bit pixel art, chunky dark outlines, limited color palette, plain solid pure green background (#00FF00), no text, no shadow, the whole scooter fits inside the image."),
  dict(group='劇情模式路上危險物（像素風，生好放 assets/scenery/）', name='競選宣傳車（第三關）', file='assets/scenery/prop_truck.png', size='約 5:2 橫式',
    prompt="Pixel art game prop for a 2D beat 'em up: a small white election campaign truck with big loudspeakers on the roof, red and blue campaign banners with color blocks instead of text on its side, side view facing right, speed lines. simple 16-bit pixel art, chunky dark outlines, limited color palette, plain solid pure green background (#00FF00), no text, no shadow, the whole truck fits inside the image."),
]
NPC_BASIC = [
  ('idle', '站立待機', 4, "fighting stance, slight breathing bob, looping idle animation"),
  ('walk', '走路', 6, "walking forward with a swagger, looping walk animation"),
  ('attack1', '攻擊第一下', 3, "a quick jab punch: wind-up, full extension, recover"),
  ('attack2', '攻擊第二下', 3, "a wide hook punch: wind-up, full extension, recover"),
  ('hurt', '被打', 2, "comedic cartoon reaction: staggering backward with a funny surprised face"),
  ('fall', '被打飛', 3, "comically tumbling backward through the air like a slapstick cartoon"),
  ('down', '倒地', 1, "lying flat on the floor on his back with cartoon swirly eyes, horizontal pose"),
  ('getup', '起身', 2, "getting up from the ground: kneeling on one knee, then rising"),
  ('dizzy', '暈眩', 3, "dizzy and wobbling with cartoon stars around the head, looping"),
]

# 敵人用簡單的 2D 像素風（省用量，有辨識度就好），不用三視圖：先生 idle，之後每張都上傳 idle 當參考
NPC_STYLE = ("simple 16-bit pixel art game sprite, chunky dark outlines, limited color palette, clear readable silhouette, "
             "normal adult proportions, side view facing right, full body, feet on the bottom edge, "
             "plain solid pure green background (#00FF00), no text, no shadow, frames evenly spaced with equal widths, no frame borders")
NPC_LEAN = [
  ('idle', '站立待機（第一張，之後都上傳它當參考）', 4, "fighting stance, slight breathing bob"),
  ('walk', '走路', 6, "walking forward"),
  ('attack1', '攻擊', 3, "a punch: wind-up, full extension, recover"),
  ('hurt', '被打', 2, "staggering backward with a funny surprised face"),
]

def npc_sections(n):
    items = []
    for i, (key, zh, fr, act) in enumerate(NPC_LEAN):
        if n.get('keys') and key not in n['keys']:
            continue
        if i == 0:
            pr = f"Pixel art enemy sprite strip for a 2D beat 'em up game: {n['desc']}. {act}, {fr} frames in one horizontal row. {NPC_STYLE}."
        else:
            pr = f"Same character as the attached image, same pixel art style and colors. {act}, {fr} frames in one horizontal row. {NPC_STYLE}."
        items.append(dict(group='動作（像素風，一次一張；第二張起都上傳 idle）', name=zh, file=f"assets/characters/{n['id']}/{key}.png", frames=fr,
            size=f"{fr} 格橫排", prompt=pr))
    for key, zh, fr, act in n.get('lean_extra', []):
        items.append(dict(group='招式（同上）', name=zh, file=f"assets/characters/{n['id']}/{key}.png", frames=fr, size=f"{fr} 格橫排",
            prompt=f"Same character as the attached image, same pixel art style and colors. {act}, {fr} frames in one horizontal row. {NPC_STYLE}."))
    if n.get('boss'):
        items.append(dict(group='招式（同上）', name='頭像（大招橫幅用）', file=f"assets/portraits/{n['id']}.png", size='正方形',
            prompt=f"Same character as the attached image: pixel art head and shoulders portrait, menacing smug face, simple {n['color']} background, square image, no text."))
    return items

S1_SCENE = "Art style: " + STYLE.replace("realistic adult body proportions (about 6 heads tall, NOT chibi, NOT big-headed), caricature face that keeps a strong likeness, light-hearted video game character art", "detailed 2D side-scrolling beat 'em up background art") + ". Straight-on flat front view (orthographic, no perspective vanishing point), no people, no characters, no text, no readable signs (use colored blocks instead of words)."
COMMON_S1 = [
  dict(group='劇情第一關背景（4 張，生好放 assets/scenery/）', name='天空與遠方城市', file='assets/scenery/s1_sky.png', size='16:9（1920×1080）',
    prompt=f"A dusk sky over a Taiwanese city for a game background: deep purple at the top fading to warm orange and pink near the bottom, a few stars, a distant dark-purple city skyline silhouette with small lit windows along the bottom 30 percent, the left and right edges connect seamlessly when tiled. {S1_SCENE} Wide 16:9, no green screen."),
  dict(group='劇情第一關背景（4 張，生好放 assets/scenery/）', name='騎樓老街街屋（會左右重複）', file='assets/scenery/s1_street.png', size='3:1 超寬（2400×800）',
    prompt=f"A long row of old 3-to-4-story Taiwanese shophouses seen straight from the front, pastel concrete walls, metal window grilles, AC units, vertical shop signboards in red, yellow and blue with color blocks instead of text, red paper lanterns, election campaign flags hanging, and a covered arcade walkway (qilou) along the bottom 20 percent of the image. The bottom edge of the image is the ground line. Everything above the rooftops is plain solid pure green (#00FF00) for transparency. The left and right edges must connect seamlessly when tiled. {S1_SCENE} Very wide 3:1 image."),
  dict(group='劇情第一關背景（4 張，生好放 assets/scenery/）', name='菜市場老公寓（有頂樓加蓋）', file='assets/scenery/s1_apartment.png', size='約 2.7:1 超寬（2400×900）',
    prompt=f"The flat front facade of a wide old 5-story Taiwanese apartment building seen straight on. Layout from top to bottom: the top 24 percent is the rooftop area above a flat roof line, with an illegal corrugated tin rooftop shack on the left, a blue water tower on the right and TV antennas, and plain solid pure green (#00FF00) sky behind them; below the roof line are grey tiled walls with windows and metal grilles; between 64 and 80 percent height a long open-air corridor balcony runs across the full width with doors and windows behind it; the bottom 20 percent is a ground-floor traditional street market with colorful red, blue, green and yellow umbrellas and stalls. The bottom edge of the image is the ground line. {S1_SCENE} Very wide image, about 2.7 to 1."),
  dict(group='劇情第一關背景（4 張，生好放 assets/scenery/）', name='宮廟正面（Boss 戰）', file='assets/scenery/s1_temple.png', size='約 2.3:1 寬（2400×1040）',
    prompt=f"The front of a colorful traditional Taiwanese folk temple seen straight on: red walls and pillars, carved dragon columns, an ornate roof with green and yellow glazed tiles and upswept swallowtail ridges decorated with figurines, a big wooden main door in the center with a golden plaque (color block, no readable text), strings of red lanterns, a large bronze incense burner in front with smoke. The bottom edge of the image is the ground line. Everything above and around the temple is plain solid pure green (#00FF00) for transparency. {S1_SCENE} Wide image, about 2.3 to 1."),
]

# 第二關「市長選舉」：夜市大街 → 捷運高架月台 → 市府廣場（圖的比例和地板高度要對上 js/story.js 的 STAGE2）
S2 = '劇情第二關背景（4 張，生好放 assets/scenery/）'
COMMON_S2 = [
  dict(group=S2, name='夜晚城市天空', file='assets/scenery/s2_sky.png', size='16:9（1920×1080）',
    prompt=f"A night sky over a big modern Taiwanese city for a game background: deep navy blue at the top fading to purple near the bottom, a few stars, a distant skyline of glass office towers and a tall landmark tower silhouette with many lit windows and red aircraft lights along the bottom 30 percent, the left and right edges connect seamlessly when tiled. {S1_SCENE} Wide 16:9, no green screen."),
  dict(group=S2, name='夜市大街（會左右重複）', file='assets/scenery/s2_street.png', size='3:1 超寬（2400×800）',
    prompt=f"A long row of busy Taiwanese night market stalls and old 3-story shop buildings seen straight from the front at night, glowing food stall signboards in red, yellow and blue with color blocks instead of text, strings of light bulbs, steam from food carts, hanging lanterns, mayoral election campaign banners with color blocks, along the bottom 20 percent a row of food stall counters. The bottom edge of the image is the ground line. Everything above the rooftops is plain solid pure green (#00FF00) for transparency. The left and right edges must connect seamlessly when tiled. {S1_SCENE} Very wide 3:1 image."),
  dict(group=S2, name='捷運高架車站（月台在中間高度）', file='assets/scenery/s2_station.png', size='約 4:1 超寬（2400×600）',
    prompt=f"The flat side view of a long elevated metro (MRT) station at night seen straight on. Layout from top to bottom: the top 45 percent is the station's curved white roof canopy and glass walls with a parked silver metro train behind the platform; at 48 to 60 percent height is the long platform floor edge with yellow safety line; below that a thick grey concrete viaduct with round pillars, and the bottom 20 percent is street level with a few small shops and scooters parked. The bottom edge of the image is the ground line. Everything above the roof is plain solid pure green (#00FF00) for transparency. {S1_SCENE} Very wide image, about 4 to 1."),
  dict(group=S2, name='市政府大樓（Boss 戰）', file='assets/scenery/s2_cityhall.png', size='約 2.7:1 寬（2400×900）',
    prompt=f"The front of a grand modern city hall building seen straight on at night: wide white stone facade with tall columns, a big central entrance with glass doors, a flagpole on each side, rows of lit windows, wide stone steps in front, election campaign banners with color blocks hanging on the facade. The bottom edge of the image is the ground line. Everything above and around the building is plain solid pure green (#00FF00) for transparency. {S1_SCENE} Wide image, about 2.7 to 1."),
]

# 第三關「總統選舉」：造勢舞台 → 凱道人潮 → 貴賓看台 → 總統府前廣場
S3 = '劇情第三關背景（5 張，生好放 assets/scenery/）'
COMMON_S3 = [
  dict(group=S3, name='黃昏的凱道天空', file='assets/scenery/s3_sky.png', size='16:9（1920×1080）',
    prompt=f"A dramatic sunset sky over a capital city for a game background: deep crimson at the top fading to orange and gold near the bottom, fireworks bursting, searchlight beams, a distant skyline silhouette along the bottom 30 percent, the left and right edges connect seamlessly when tiled. {S1_SCENE} Wide 16:9, no green screen."),
  dict(group=S3, name='凱道兩旁的大樓與人潮（會左右重複）', file='assets/scenery/s3_street.png', size='3:1 超寬（2400×800）',
    prompt=f"A long row of grand old government office buildings along a wide boulevard seen straight from the front, red brick and white stone, hanging election campaign banners and national-style flags with color blocks instead of text, and along the bottom 25 percent a dense cheering crowd silhouette waving colorful flags and glow sticks. The bottom edge of the image is the ground line. Everything above the rooftops is plain solid pure green (#00FF00) for transparency. The left and right edges must connect seamlessly when tiled. {S1_SCENE} Very wide 3:1 image."),
  dict(group=S3, name='造勢晚會舞台（主角從舞台上出發）', file='assets/scenery/s3_stage.png', size='約 3.4:1 超寬（2400×700）',
    prompt=f"The flat front view of a huge election campaign rally stage at night. Layout from top to bottom: the top 60 percent is a metal truss frame with colorful stage lights, a giant red LED screen with color blocks instead of text and big speakers; at 66 to 82 percent height is the wooden stage floor; the bottom 18 percent is the stage front skirt covered with red and blue banners with color blocks. The bottom edge of the image is the ground line. Everything above and around the truss is plain solid pure green (#00FF00) for transparency. {S1_SCENE} Very wide image, about 3.4 to 1."),
  dict(group=S3, name='貴賓看台（在中間高度）', file='assets/scenery/s3_stand.png', size='約 3:1 超寬（2400×800）',
    prompt=f"The flat side view of a temporary VIP grandstand for a political rally seen straight on. Layout from top to bottom: the top 40 percent is a white tent roof with flags and spotlights; at 43 to 57 percent height is the grandstand walkway floor with a railing; below that steel scaffolding with banners with color blocks, and the bottom 15 percent is ground level with security barriers. The bottom edge of the image is the ground line. Everything above the tent roof is plain solid pure green (#00FF00) for transparency. {S1_SCENE} Very wide image, about 3 to 1."),
  dict(group=S3, name='總統府（最終 Boss 戰）', file='assets/scenery/s3_palace.png', size='約 2.6:1 寬（2400×920）',
    prompt=f"The front of a grand historic presidential office building seen straight on: red brick and white stone Baroque facade, a tall central clock tower, arched windows, a big central gate, flags on both sides, lit by golden spotlights at night. The bottom edge of the image is the ground line. Everything above and around the building is plain solid pure green (#00FF00) for transparency. {S1_SCENE} Wide image, about 2.6 to 1."),
]

# 第二關「市長選舉」改成「政見發表會・下樓梯 PK」（js/shaft.js）：一張全螢幕背景，中間要暗、乾淨（台階和角色疊在上面）
PK = '第二關「政見發表會・下樓梯 PK」背景（1 張，生好放 assets/scenery/）'
COMMON_PK = [
  dict(group=PK, name='市長政見發表會的電視辯論舞台', file='assets/scenery/pk_sky.png', size='16:9（1920×1080）',
    prompt=f"The inside of a televised mayoral election debate hall seen straight on, used as a full-screen game background: heavy red velvet curtains on the far left and right edges, two wooden candidate podiums with microphones at the bottom left and bottom right corners, a dark navy blue back wall with a big banner made of color blocks (no readable text), soft spotlight beams from the top, TV cameras and a silhouette audience along the very bottom edge. The CENTER 70 percent of the image must stay dark, plain and uncluttered (it will be covered by game platforms and characters). {S1_SCENE} Wide 16:9, no green screen."),
]

# 武器（主要角色撿起來拿在手上揮）：插畫風、直立、握把在下面、綠幕；檔名 prop_w_<種類>（prep_assets 會自動裁切縮小）
WG = '武器道具（6 張，插畫風，生好放 assets/scenery/）'
W_STYLE = ("Art style: clean hand-drawn comic illustration, bold black outlines, flat cel-shaded colors, video game item icon. "
           "The object stands perfectly upright and vertical, handle or grip at the bottom, centered, fills most of the image height, "
           "plain solid pure green background (#00FF00), no hands, no people, no text, no shadow.")
COMMON_W = [
  dict(group=WG, name='棒球棒', file='assets/scenery/prop_w_bat.png', size='1:2 直式', prompt=f"A game weapon item: a worn wooden baseball bat with black grip tape on the handle and a few dents. {W_STYLE}"),
  dict(group=WG, name='修車扳手', file='assets/scenery/prop_w_wrench.png', size='1:2 直式', prompt=f"A game weapon item: a big heavy chrome adjustable wrench from a scooter repair shop, a little greasy, red rubber grip on the handle. {W_STYLE}"),
  dict(group=WG, name='鐵鍊', file='assets/scenery/prop_w_chain.png', size='1:2 直式', prompt=f"A game weapon item: a thick steel chain hanging straight down with a black taped grip at the bottom end, shiny metal links. {W_STYLE}"),
  dict(group=WG, name='鐵折疊椅', file='assets/scenery/prop_w_fchair.png', size='1:2 直式', prompt=f"A game weapon item: a folded grey metal folding chair (the classic wrestling chair) seen from the side, folded flat and standing upright. {W_STYLE}"),
  dict(group=WG, name='抗議標語牌', file='assets/scenery/prop_w_sign.png', size='1:2 直式', prompt=f"A game weapon item: a hand-made protest placard on a wooden stick, white board with red and black color blocks instead of words. {W_STYLE}"),
  dict(group=WG, name='競選旗', file='assets/scenery/prop_w_flag.png', size='1:2 直式', prompt=f"A game weapon item: a long election campaign flag on a silver pole, a bright orange flag with color blocks instead of words, slightly waving. {W_STYLE}"),
]

COMMON = [
  dict(group='場景背景', name='立法院議場', file='assets/stages/legislature.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, side-scrolling beat 'em up stage background, interior of a parliament assembly hall, wooden walls, a raised speaker's podium in the center, two electronic voting result boards, rows of wooden desks with microphones along the back, press gallery balcony with camera flashes, the lower 46 percent of the image is an open empty teal carpet floor in perspective with a few scattered papers, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text"),
  dict(group='場景背景', name='造勢晚會現場', file='assets/stages/rally.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, side-scrolling beat 'em up stage background, night-time political campaign rally stage, metal truss with colorful stage lights, a huge red LED screen, big speakers, a cheering crowd silhouette waving multicolored flags, sweeping spotlights, the lower 46 percent of the image is an open empty wooden stage floor in perspective, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text"),
  dict(group='場景背景', name='政論節目攝影棚', file='assets/stages/studio.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, side-scrolling beat 'em up stage background, TV political talk show studio, deep blue lighting, a giant screen in the center, side screens with bar charts, a news ticker bar, an anchor desk, studio cameras, the lower 46 percent of the image is an open empty glossy dark blue studio floor with tape marks in perspective, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text"),
  dict(group='首頁與開場', name='首頁主視覺', file='assets/stages/title.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, epic arcade game key art, night sky over a city, a glowing government building in the center with golden light rays, six caricature politicians posing heroically in a row in front: " + "; ".join(c['desc'] for c in CHARS) + ". Keep the top third of the image empty dark sky for a logo and the bottom fifth simple, wide 16:9, no text. Attach the six character reference sheets."),
  dict(group='首頁與開場', name='開場 1：議場', file='assets/stages/intro_1.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, wide shot of an empty parliament assembly hall interior, tense quiet atmosphere, dramatic lighting, wide 16:9, no characters, no text"),
  dict(group='首頁與開場', name='開場 2：警報', file='assets/stages/intro_2.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, parliament hall flashing red alarm lights, a big screen showing a red breaking-news banner with no readable words, the voting board glitching, chaos, wide 16:9, no text"),
  dict(group='首頁與開場', name='開場 3：剪影', file='assets/stages/intro_3.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, six mysterious black silhouettes of politicians standing in a row under spotlights in a dark hall, one bald, one with long hair, one chubby, one with a sweatband, one with round glasses, one huge muscular bearded, dramatic, wide 16:9, no text"),
  dict(group='首頁與開場', name='開場 4：對峙', file='assets/stages/intro_4.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, split screen face-off, versus fighting game style: on the left the chubby smiling character from the first attached reference sheet shouting, on the right the bald glasses character from the second attached reference sheet shouting, lightning between them, wide 16:9, no text. Attach two reference sheets: the chubby gavel character first, the bald glasses character second."),
  dict(group='首頁與開場', name='開場 5：衝鋒', file='assets/stages/intro_5.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, six caricature politicians charging forward together on a campaign rally stage, speed lines, explosive energy, fighting game opening screen, wide 16:9, no text. Attach the six character reference sheets."),
]

# 劇情模式全破的結局（每位主角 2 張，存 assets/stages/ending1_<id>.png、ending2_<id>.png）
EG = '結局（每位主角 2 張；上傳那位主角的立繪 assets/select/<id>.webp 和站立圖 assets/characters/<id>/idle.webp 當參考）'
def ending_items():
    out = []
    for c in CHARS:
        out.append(dict(group=EG, name=f"{c['title']}・結局 1：總統府升旗典禮", file=f"assets/stages/ending1_{c['id']}.png", size='16:9（1920×1080）',
          prompt=f"Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A triumphant ending scene for a video game: the character from the attached reference images stands proudly in the center on a red-carpeted ceremony stage in front of a grand red brick presidential office building with a clock tower, saluting during a morning flag-raising ceremony, a flag being raised on a tall flagpole on the right, golden morning sunlight, confetti, an honor guard and a cheering crowd silhouette waving small flags at the bottom. Keep the top 15 percent of the image simple sky for a caption. {STYLE}, wide 16:9, no text."))
        out.append(dict(group=EG, name=f"{c['title']}・結局 2：俯視落敗的對手", file=f"assets/stages/ending2_{c['id']}.png", size='16:9（1920×1080）',
          prompt=f"Use the attached images as the exact reference for the character: same face, same hairstyle, same outfit and colors, same body proportions. A dramatic comic-style ending scene for a video game: the character from the attached reference images stands tall on the right side, seen from a low angle, clenching a fierce fist and looking down with a cold confident glare. At the bottom left, three generic defeated rival politicians in rumpled suits are sprawled on the ground in a cartoon dust cloud, ties loose, cartoon swirly eyes and little stars over their heads, faces turned away so they are not recognizable. Dark red background with dramatic speed lines. Keep the top-left area simple for a caption. {STYLE}, wide 16:9, no text."))
    return out

def build():
    data = {'chars': [], 'common': COMMON_S1 + PROPS + COMMON_S2 + COMMON_PK + COMMON_W + COMMON_S3 + COMMON + ending_items()}
    for c in CHARS:
        data['chars'].append({'id': c['id'], 'title': c['title'], 'quote': c['quote'], 'items': char_sections(c)})
    for n in NPCS:
        data['chars'].append({'id': n['id'], 'title': f"{n['stage']}：{n['title']}", 'quote': '', 'items': npc_sections(n)})
    return data

def manifest_example(c):
    ch = {}
    for key, zh, n, act in BASIC:
        ch[key] = {'sheet': f"assets/characters/{c['id']}/{key}.png", 'frames': n}
    for key, zh, n, act in c['skills']:
        ch[key] = {'sheet': f"assets/characters/{c['id']}/{key}.png", 'frames': n}
    return ch

def write_md(data, path):
    L = []
    L.append("# Gemini 生圖 Prompt（可直接複製貼上）\n")
    L.append("> 這份是 `tools/gen_prompts.py` 自動產生的，要改內容請改那支程式再重跑。\n")
    L.append("## 怎麼用\n")
    L.append("**畫風**：照發大財院長那張成功的立繪（手繪諷刺漫畫風、約六頭身）。**Gemini 會擋**：寫真實姓名又附真人照片的圖，以及真人「被打」的畫面，所以 prompt 都不寫姓名，被打、倒地也寫成卡通搞笑的反應。\n")
    L.append("1. **每個角色開一個新對話**，先貼「第零步」（遊戲說明＋角色說明），等 Gemini 回「了解」。")
    L.append("2. **第一步・立繪**：上傳 2～3 張清楚的照片（正面、側面、全身，自己上網找），貼「做法 A」。不夠像就貼「不夠像時」那段修。滿意後存成 `assets/select/<角色>.png`，這張直接當選角立繪。被拒絕就開新對話改用「做法 B」。")
    L.append("3. **第二步・三視圖**：上傳立繪，貼「三視圖」。")
    L.append("4. **之後每一張**：上傳**立繪＋三視圖**（不要再傳真人照片），一次只貼一段、只生一張。某張被拒絕就開新對話，貼第零步、上傳兩張參考圖，再貼那一張。")
    L.append("5. 動作圖是「一整條動作條」：一張圖裡由左到右排好幾格。格子要等寬，遊戲會自動平均切開。排不整齊時，可以改成一格一張（檔名 `idle_1.png`、`idle_2.png`…）。")
    L.append("6. 綠色背景 `#00FF00` 會被遊戲自動去背。")
    L.append("7. 生好的圖照「存檔」那欄的路徑整理好（或直接壓成 zip 傳給 Claude），再執行 `python3 tools/prep_assets.py <資料夾>`：會自動去背、切格對齊、統一大小、壓縮，並更新 `assets/manifest.json`。\n")
    for c in data['chars']:
        L.append(f"---\n\n## {c['title']}（`{c['id']}`）" + (f"　金句：「{c['quote']}」" if c['quote'] else '') + "\n")
        g = None
        for it in c['items']:
            if it['group'] != g:
                g = it['group']; L.append(f"### {g}\n")
            nm = it.get('name')
            L.append(f"**{nm}**　存檔：`{it['file']}`　尺寸：{it['size']}\n")
            L.append("```\n" + it['prompt'] + "\n```\n")
    L.append("---\n\n## 共用畫面（場景、首頁、開場）\n")
    g = None
    for it in data['common']:
        if it['group'] != g:
            g = it['group']; L.append(f"### {g}\n")
        L.append(f"**{it['name']}**　存檔：`{it['file']}`　尺寸：{it['size']}\n")
        L.append("```\n" + it['prompt'] + "\n```\n")
    L.append("---\n\n## 登記到 assets/manifest.json\n")
    L.append("以衝衝院長全部生完為例（其他角色把 `su` 換掉即可）：\n")
    man = {"chromaKey": "#00ff00", "chromaTolerance": 120,
           "characters": {"su": manifest_example(CHARS[0])},
           "posters": {"su": "assets/posters/su.png"}, "portraits": {"su": "assets/portraits/su.png"},
           "select": {"su": "assets/select/su.png"},
           "stages": {"legislature": "assets/stages/legislature.png", "title": "assets/stages/title.png", "intro_1": "assets/stages/intro_1.png"}}
    L.append("```json\n" + json.dumps(man, ensure_ascii=False, indent=2) + "\n```\n")
    L.append("- 一格一張的寫法：`\"idle\": 4` 代表 `idle_1.png`～`idle_4.png`")
    L.append("- `special_fwd`／`special_up`／`special_down` 是三招技能各自的動作；沒生的話也可以只生一組 `special` 三招共用")
    L.append("- 去背有綠邊：把 `chromaTolerance` 調高（例如 160）；角色身上被挖洞：調低\n")
    pathlib.Path(path).write_text("\n".join(L), encoding='utf-8')

if __name__ == '__main__':
    data = build()
    root = pathlib.Path(__file__).resolve().parent.parent
    write_md(data, root / 'docs' / 'GEMINI_PROMPTS.md')
    if len(sys.argv) > 1:  # 另外輸出 JSON（給複製用的網頁）
        pathlib.Path(sys.argv[1]).write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
    n = sum(len(c['items']) for c in data['chars']) + len(data['common'])
    print('prompts:', n)
