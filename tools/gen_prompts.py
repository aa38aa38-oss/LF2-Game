#!/usr/bin/env python3
"""產生 Gemini 生圖 prompt 清單：docs/GEMINI_PROMPTS.md ＋ 可一鍵複製的 HTML 頁。
用法：python3 tools/gen_prompts.py [JSON 輸出路徑]
"""
import json, sys, html, pathlib

STYLE = ("16-bit pixel art, retro arcade beat 'em up game art, chibi proportions (head about one third of body height), "
         "thick dark outlines, vibrant saturated colors, cel shading, comedic caricature style, original cartoon character")
SPRITE_END = ("side view facing right, full body, the same single character in every frame, feet touching the bottom edge of each frame, "
              "character centered in each frame and the same size in every frame, frames evenly spaced with equal widths, "
              "plain solid pure green background (#00FF00), no ground shadow, no text, no numbers, no watermark, no frame borders")
REF_NOTE = "Use the attached reference image for the character's exact look (face, hair, glasses, clothes, colors)."

CHARS = [
  dict(id='su', title='衝衝院長', quote='在那叫什麼！', color='orange and dark brown',
    desc="a bald elderly Taiwanese man in politics, very shiny bald head with a bright white highlight, thin rectangular glasses, thick stern angry eyebrows, orange surgical face mask, dark charcoal suit, white shirt, grey-blue tie, black shoes, fierce hot-tempered energetic attitude",
    skills=[
      ('special_fwd', '技1 光頭閃光', 4, "leaning his head forward and down, his shiny bald head emitting a blinding cone of white-yellow light forward, light rays"),
      ('special_up', '技2 衝天頭槌', 4, "crouching down then launching straight upward head-first like a rocket, a rising headbutt with motion lines"),
      ('special_down', '技3 衝刺頭槌', 4, "lowering his head and charging forward head-first like a battering ram, body almost horizontal, dust and speed lines"),
      ('super', '大絕 衝衝衝', 6, "three explosive forward dashes: crouch, burst forward at full speed with body leaning far forward and a fiery orange aura, brief stop, burst again, shouting angrily, strong motion lines"),
    ],
    poster="shouting furiously with mouth wide open behind the mask, leaning toward the viewer, one fist punching toward the camera, bald head gleaming",
    victory="arms crossed, chin up, bald head shining, proud stern look"),
  dict(id='wang', title='堅哥', quote='Over my dead body！', color='gold and black',
    desc="a middle-aged Taiwanese man in politics with shoulder-length straight black hair swept back, intense passionate eyes, thick dark eyebrows, black suit, white shirt, black tie, very emotional and dramatic expression",
    skills=[
      ('special_fwd', '技1 指指點點', 4, "aggressively pointing his index finger forward while shouting, yellow sound-wave rings shooting out from his fingertip"),
      ('special_up', '技2 拍案而起', 4, "slamming both palms down hard, then springing up furious with arms raised, a golden shockwave ring spreading on the floor around him"),
      ('special_down', '技3 躺地抗議', 4, "lying down flat on his back on the floor in stubborn protest, arms crossed on his chest, refusing to move, defiant face"),
      ('super', '大絕 除非踏過我的屍體', 6, "spreading his arms wide and roaring dramatically, a tall pillar of golden light around him, hair blowing upward, then slamming fists down sending golden shockwaves"),
    ],
    poster="pointing his finger straight at the viewer, shouting with fiery passion, hair flowing dramatically, golden light behind him",
    victory="fist raised high, eyes closed, deeply moved and emotional, tears of passion"),
  dict(id='han', title='發大財議長', quote='放馬過來，林北蛋你！', color='royal blue and navy',
    desc="a chubby round-faced elderly Taiwanese man, bald on top with short grey hair only on the sides, big warm friendly smile, rosy cheeks, white dress shirt with rolled-up sleeves, slight round belly, dark navy trousers, brown shoes, holding a wooden judge's gavel",
    skills=[
      ('special_fwd', '技1 議事槌', 4, "raising a giant wooden gavel high overhead with both hands, then slamming it onto the ground, a shockwave and dust burst"),
      ('special_up', '技2 貨出得去', 4, "lifting a big cardboard fruit shipping crate and hurling it forward with both hands"),
      ('special_down', '技3 滷肉飯補血', 4, "happily eating a bowl of braised pork rice with chopsticks, cheeks full, small green sparkles of healing"),
      ('super', '大絕 發大財', 6, "raising both arms joyfully and laughing loudly, golden coins and gold ingots raining down around him, golden sparkles"),
    ],
    poster="laughing heartily, raising a wooden gavel high, gold coins flying in the air, cheerful but daring expression",
    victory="giving a big thumbs up with a wide grin, gold coins sparkling"),
  dict(id='ma', title='慢跑總統', quote='我是很喜歡吃香蕉的人', color='sky blue and white',
    desc="a slim elderly Taiwanese gentleman with neat black side-parted hair, gentle polite smile, red-and-white sweatband on his forehead, white running t-shirt with blue trim, blue running shorts, white running shoes, athletic jogger",
    skills=[
      ('special_fwd', '技1 香蕉皮', 4, "tossing a banana peel low and forward onto the ground with a polite smile"),
      ('special_up', '技2 香蕉迴力鏢', 4, "throwing a yellow banana sidearm like a boomerang, spinning"),
      ('special_down', '技3 慢跑閃避', 4, "jogging quickly and lightly, a nimble sidestep dodge, sweat drops, cheerful polite face"),
      ('super', '大絕 香蕉大放送', 6, "happily jogging in place then tossing many yellow bananas up into the air one after another, bananas flying"),
    ],
    poster="smiling politely while holding up a yellow banana next to his face, sweatband on, jogging pose",
    victory="jogging in place happily, waving with one hand, holding a banana in the other"),
  dict(id='ko', title='阿北', quote='賴祥德，沒有用的！', color='teal and dark green',
    desc="a middle-aged Taiwanese man who is a doctor, short dark grey hair, round black glasses, expressionless deadpan face, white doctor's lab coat over a light blue shirt, dark grey trousers",
    skills=[
      ('special_fwd', '技1 飛刀手術', 4, "flicking his wrist to throw three small silver surgical scalpels forward in a fan, calm deadpan face"),
      ('special_up', '技2 電擊器', 4, "thrusting two defibrillator paddles forward, crackling blue electric sparks"),
      ('special_down', '技3 單車環島', 4, "riding a road bicycle at high speed, leaning forward over the handlebars, wheels with motion blur"),
      ('super', '大絕 葉克膜', 6, "standing calmly surrounded by a green healing glow, then raising both arms as blue lightning bolts strike down around him"),
    ],
    poster="deadpan expression, pushing up his round glasses with one finger, the glasses glinting, holding a scalpel",
    victory="adjusting his glasses with a tiny satisfied smirk, arms behind his back"),
  dict(id='guan', title='館長', quote='RRR！幫我開直播！', color='red and dark maroon',
    desc="a huge muscular bald Taiwanese man with a full thick black beard, fierce angry eyes, black tank top, enormous muscular arms, camo green cargo pants, black boots, gym owner and livestreamer",
    skills=[
      ('special_fwd', '技1 過肩摔', 4, "a wrestling suplex motion: reaching forward to grab, lifting with both arms, then swinging over his shoulder and slamming down (draw only him, no opponent)"),
      ('special_up', '技2 館長上勾拳', 4, "a powerful rising uppercut, jumping slightly off the ground with the fist high above, impact burst"),
      ('special_down', '技3 啞鈴投擲', 4, "winding up and throwing a heavy black dumbbell forward in a high arc"),
      ('super', '大絕 開直播', 6, "holding a smartphone up to livestream with a red LIVE light, shouting, then a rapid punching flurry with many fist afterimages"),
    ],
    poster="roaring with mouth wide open, flexing huge muscles, holding a smartphone up as if livestreaming, red LIVE light",
    victory="double biceps flex, roaring proudly"),
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
  ('hurt', '被打', 2, "getting hit, head snapped back, pained expression, body recoiling"),
  ('fall', '被打飛', 3, "knocked off his feet, flying backward through the air, body tilting to horizontal"),
  ('down', '倒地', 1, "lying flat on the ground on his back, dazed, horizontal pose"),
  ('getup', '起身／撿東西', 2, "getting up from the ground: kneeling on one knee, then rising"),
  ('dizzy', '暈眩', 3, "dizzy and wobbling, swirly eyes, looping"),
  ('roll', '翻滾閃避／空中翻身', 4, "doing a forward somersault roll, curled into a ball"),
  ('catch', '抓住對手揍', 2, "holding an invisible opponent by the collar with one hand and punching with the other (draw only him, no opponent)"),
  ('victory', '勝利', 4, None),
]
ATTACK_OVERRIDE = {
  'han': {'attack1': "swinging a wooden gavel down from above: raise, strike, recover",
          'attack3': "big overhead two-handed gavel slam onto the ground: raise high, slam, impact dust, recover"},
}

def sprite(c, name, frames, action, extra=''):
    return (f"{STYLE}, sprite sheet of {c['desc']}, {action}, {frames} frames arranged in a single horizontal row from left to right"
            f"{extra}, {SPRITE_END}. {REF_NOTE}")

def char_sections(c):
    items = []
    items.append(dict(group='第一步：角色設定圖（先做這張，之後每張都上傳它當參考）', file=f"assets/ref/{c['id']}.png（自己留著當參考，不用放進遊戲）",
        size='16:9 橫式', use='讓 Gemini 記住長相', frames=None,
        prompt=f"{STYLE}, character reference sheet of {c['desc']}, three views side by side: front view, side view facing right, back view, full body, the same character in all views, plain solid pure green background (#00FF00), no text"))
    for key, zh, n, act in BASIC:
        a = ATTACK_OVERRIDE.get(c['id'], {}).get(key, act)
        if key == 'victory':
            a = f"victory pose animation: {c['victory']}"
        items.append(dict(group='基本動作', name=f"{zh}", file=f"assets/characters/{c['id']}/{key}.png", frames=n,
            size=f"{n} 格橫排（每格 512×512，整張 {512*n}×512）", prompt=sprite(c, key, n, a)))
    for key, zh, n, act in c['skills']:
        items.append(dict(group='技能與大絕動作', name=zh, file=f"assets/characters/{c['id']}/{key}.png", frames=n,
            size=f"{n} 格橫排（每格 512×512，整張 {512*n}×512）", prompt=sprite(c, key, n, act)))
    items.append(dict(group='畫面用圖', name='頭像（血條、選角卡片、大絕橫幅的圓形頭像）', file=f"assets/portraits/{c['id']}.png", frames=None,
        size='正方形 1:1（512×512）',
        prompt=f"{STYLE}, head and shoulders portrait of {c['desc']}, facing slightly right, expressive face, simple {c['color']} gradient background, square image, character fills the frame, no text. {REF_NOTE}"))
    items.append(dict(group='畫面用圖', name=f"大絕金句橫幅（放大絕時上方跳出，遊戲會在右邊疊上「{c['quote']}」）", file=f"assets/posters/{c['id']}.png", frames=None,
        size='超寬橫式 4:1（1600×400）',
        prompt=f"{STYLE}, fighting game super move cut-in banner, extreme close-up of the face of {c['desc']}, {c['poster']}, face placed in the LEFT third of the image, the right two thirds is empty plain green for text, dramatic speed lines behind the face, very wide 4:1 horizontal strip, plain solid pure green background (#00FF00), no text. {REF_NOTE}"))
    items.append(dict(group='畫面用圖', name='選角／VS 畫面全身立繪', file=f"assets/select/{c['id']}.png", frames=None,
        size='直式 2:3（800×1200）',
        prompt=f"{STYLE}, full body character select illustration of {c['desc']}, heroic confident pose facing slightly right, dynamic low angle, larger and more detailed than a sprite, feet touching the bottom edge, plain solid pure green background (#00FF00), no text. {REF_NOTE}"))
    return items

COMMON = [
  dict(group='場景背景', name='立法院議場', file='assets/stages/legislature.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, side-scrolling beat 'em up stage background, interior of a parliament assembly hall, wooden walls, a raised speaker's podium in the center, two electronic voting result boards, rows of wooden desks with microphones along the back, press gallery balcony with camera flashes, the lower 46 percent of the image is an open empty teal carpet floor in perspective with a few scattered papers, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text"),
  dict(group='場景背景', name='造勢晚會現場', file='assets/stages/rally.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, side-scrolling beat 'em up stage background, night-time political campaign rally stage, metal truss with colorful stage lights, a huge red LED screen, big speakers, a cheering crowd silhouette waving multicolored flags, sweeping spotlights, the lower 46 percent of the image is an open empty wooden stage floor in perspective, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text"),
  dict(group='場景背景', name='政論節目攝影棚', file='assets/stages/studio.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, side-scrolling beat 'em up stage background, TV political talk show studio, deep blue lighting, a giant screen in the center, side screens with bar charts, a news ticker bar, an anchor desk, studio cameras, the lower 46 percent of the image is an open empty glossy dark blue studio floor with tape marks in perspective, the left and right edges should connect seamlessly when tiled, wide 16:9, no characters, no text"),
  dict(group='首頁與開場', name='首頁主視覺', file='assets/stages/title.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, epic arcade game key art, night sky over a city, a glowing government building in the center with golden light rays, six caricature politicians posing heroically in a row in front: " + "; ".join(c['desc'] for c in CHARS) + ". Keep the top third of the image empty dark sky for a logo and the bottom fifth simple, wide 16:9, no text. Use the attached reference images for each character's look."),
  dict(group='首頁與開場', name='開場 1：議場', file='assets/stages/intro_1.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, wide shot of an empty parliament assembly hall interior, tense quiet atmosphere, dramatic lighting, wide 16:9, no characters, no text"),
  dict(group='首頁與開場', name='開場 2：警報', file='assets/stages/intro_2.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, parliament hall flashing red alarm lights, a big screen showing a red breaking-news banner with no readable words, the voting board glitching, chaos, wide 16:9, no text"),
  dict(group='首頁與開場', name='開場 3：剪影', file='assets/stages/intro_3.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, six mysterious black silhouettes of politicians standing in a row under spotlights in a dark hall, one bald, one with long hair, one chubby, one with a sweatband, one with round glasses, one huge muscular bearded, dramatic, wide 16:9, no text"),
  dict(group='首頁與開場', name='開場 4：對峙', file='assets/stages/intro_4.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, split screen face-off, versus fighting game style: on the left {CHARS[2]['desc']} shouting, on the right {CHARS[0]['desc']} shouting, lightning between them, wide 16:9, no text. Use the attached reference images."),
  dict(group='首頁與開場', name='開場 5：衝鋒', file='assets/stages/intro_5.png', size='16:9（1920×1080）',
    prompt=f"{STYLE}, six caricature politicians charging forward together on a campaign rally stage, speed lines, explosive energy, fighting game opening screen, wide 16:9, no text. Use the attached reference images for each character's look."),
]

def build():
    data = {'chars': [], 'common': COMMON}
    for c in CHARS:
        data['chars'].append({'id': c['id'], 'title': c['title'], 'quote': c['quote'], 'items': char_sections(c)})
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
    L.append("1. **每個角色先生「角色設定圖」**，挑一張最像的存起來。")
    L.append("2. 之後這個角色的每一張圖，都**先上傳設定圖，再貼 prompt**，長相才會一致。")
    L.append("3. 動作圖是「一整條動作條」：一張圖裡由左到右排好幾格。格子要等寬，遊戲會自動平均切開。Gemini 排不整齊時，可以改成一格一張（檔名 `idle_1.png`、`idle_2.png`…）。")
    L.append("4. 綠色背景 `#00FF00` 會被遊戲自動去背，所以角色身上不要有亮綠色。")
    L.append("5. 生好的圖照「存檔」那欄的路徑放進 repo，再登記到 `assets/manifest.json`（最下面有範例）。一個角色的動作建議**全部生完再一起登記**，不然會圖和程式畫的混在一起。")
    L.append("6. Gemini 若因為「像真人」拒絕，把 prompt 裡的 `Taiwanese man in politics` 改成 `cartoon man`，或多強調 `caricature, cartoon`。\n")
    for c in data['chars']:
        L.append(f"---\n\n## {c['title']}（`{c['id']}`）　金句：「{c['quote']}」\n")
        g = None
        for it in c['items']:
            if it['group'] != g:
                g = it['group']; L.append(f"### {g}\n")
            nm = it.get('name') or '角色設定圖'
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
