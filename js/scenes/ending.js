// 劇情模式全破的結局：
//  1. 主角登上總統府前的舞台，參加升旗典禮
//  2. 主角握緊拳頭，俯視狼狽不堪、挑戰失敗的對手們
//  3. 全劇終 → 結算畫面
// 有 Gemini 畫的結局圖（assets/stages/ending1_<角色>.webp、ending2_<角色>.webp）就用圖，沒有就用角色圖拼出來
import { CHAR_BY_ID } from '../characters.js';
import { ASSETS, charFrame } from '../assets.js';
import { drawArt, drawStar } from '../sprites.js';
import { txt, pixelText, blink } from '../ui.js';
import { easeOut, clamp } from '../util.js';

const DUR = [7.5, 7.5, 5];

// 畫角色某個動作的某一格（腳底對齊 x, y；高度 h）
function drawPose(ctx, id, anim, i, x, y, h, facing = 1, alpha = 1) {
  const arr = ASSETS.chars[id] && ASSETS.chars[id][anim];
  const img = arr && arr.length ? arr[Math.min(i, arr.length - 1)] : charFrame(id, 'idle', 0);
  if (!img) return drawArt(ctx, CHAR_BY_ID[id], x, y, h, facing);
  const w = (img.width * h) / img.height;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();
  return true;
}
function cover(ctx, im, ox, CW) {
  const s = Math.max(CW / im.width, 540 / im.height);
  ctx.drawImage(im, -ox + (CW - im.width * s) / 2, (540 - im.height * s) / 2, im.width * s, im.height * s);
}

export class EndingScene {
  constructor(g, d) {
    this.g = g;
    this.d = d;
    this.t = 0;
    this.page = 0;
  }
  enter() {
    document.body.dataset.scene = 'menu';
    this.g.audio.playBgm('title');
  }
  next() {
    this.page++;
    this.t = 0;
    this.g.audio.sfx('confirm');
    if (this.page >= DUR.length) this.g.goResult(this.d.result);
  }
  update(dt) {
    this.t += dt;
    if (this.page >= DUR.length) return;
    if ((this.t > 1 && this.g.input.p1.confirm) || this.t > DUR[this.page]) this.next();
  }
  onPointer() {
    if (this.t > 1) this.next();
  }

  draw() {
    const ctx = this.g.ctx;
    if (this.page === 0) this.drawFlag(ctx);
    else if (this.page === 1) this.drawStare(ctx);
    else this.drawEnd(ctx);
    // 淡入
    if (this.t < 0.5) {
      ctx.fillStyle = `rgba(0,0,0,${1 - this.t / 0.5})`;
      ctx.fillRect(-this.g.ox, 0, this.g.CW, 540);
    }
    if (this.page < 2 && this.t > 1.5 && blink(this.t, 1.2)) txt(ctx, '按確定繼續 ▶', 940, 524, { size: 13, color: '#ffffff', align: 'right', stroke: '#000', sw: 4 });
  }

  // ① 升旗典禮
  drawFlag(ctx) {
    const { ox, CW } = this.g, T = this.t, id = this.d.player, ch = CHAR_BY_ID[id];
    const art = ASSETS.stages[`ending1_${id}`];
    if (art) cover(ctx, art, ox, CW);
    else {
      // 清晨的天空
      const sky = ctx.createLinearGradient(0, 0, 0, 540);
      sky.addColorStop(0, '#5aa8ff');
      sky.addColorStop(0.6, '#ffd8a0');
      sky.addColorStop(1, '#ffb070');
      ctx.fillStyle = sky;
      ctx.fillRect(-ox, 0, CW, 540);
      // 總統府（有第三關的圖就用）
      const pal = ASSETS.scenery.s3_palace;
      if (pal) {
        const w = 760, h = (pal.height * w) / pal.width;
        ctx.drawImage(pal, 480 - w / 2, 400 - h, w, h);
      } else {
        ctx.fillStyle = '#b8603a';
        ctx.fillRect(160, 200, 640, 200);
        ctx.fillRect(430, 80, 100, 130);
        ctx.fillStyle = '#e8e0d0';
        for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) ctx.fillRect(180 + i * 52, 220 + j * 56, 22, 34);
      }
      // 典禮舞台＋紅地毯
      ctx.fillStyle = '#8a1020';
      ctx.fillRect(-ox, 400, CW, 140);
      ctx.fillStyle = '#c8202a';
      ctx.beginPath();
      ctx.moveTo(400, 400);
      ctx.lineTo(560, 400);
      ctx.lineTo(680, 540);
      ctx.lineTo(280, 540);
      ctx.fill();
      ctx.fillStyle = '#ffd84a';
      ctx.fillRect(-ox, 398, CW, 6);
    }
    // 旗桿＋國旗慢慢升上去
    const fx = 780, top = 70;
    ctx.fillStyle = '#e8e8f0';
    ctx.fillRect(fx - 3, top, 6, 340);
    ctx.fillStyle = '#ffd84a';
    ctx.beginPath();
    ctx.arc(fx, top - 4, 7, 0, Math.PI * 2);
    ctx.fill();
    const fy = top + 6 + (1 - easeOut(clamp(T / 5.5, 0, 1))) * 250;
    const wave = (x) => Math.sin(T * 5 + x * 0.08) * 4 * (x / 90);
    ctx.save();
    ctx.translate(fx + 3, fy);
    ctx.fillStyle = '#d8202a';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x <= 90; x += 10) ctx.lineTo(x, wave(x));
    for (let x = 90; x >= 0; x -= 10) ctx.lineTo(x, 60 + wave(x));
    ctx.fill();
    ctx.fillStyle = '#1a3aa8';
    ctx.fillRect(0, wave(20), 45, 30);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(22, 15 + wave(20), 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // 主角站在舞台上敬禮（勝利動作）
    if (!art) {
      drawPose(ctx, id, 'victory', Math.floor(T * 6) % 4, 480, 470, 250, 1);
      // 台下的群眾揮旗
      for (let i = 0; i < 30; i++) {
        const x = -ox + 20 + i * (CW / 30), b = Math.abs(Math.sin(T * 5 + i)) * 6;
        ctx.fillStyle = '#2a1a1a';
        ctx.beginPath();
        ctx.arc(x, 520 - b, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x - 16, 532 - b, 32, 20);
        if (i % 3 === 0) {
          ctx.fillStyle = '#d8202a';
          ctx.fillRect(x + 10, 480 - b - Math.sin(T * 8 + i) * 6, 18, 12);
          ctx.fillStyle = '#222';
          ctx.fillRect(x + 9, 480 - b, 2, 30);
        }
      }
    }
    // 文字
    const a = clamp((T - 1) / 0.6, 0, 1);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(-ox, 18, CW, 84);
    txt(ctx, '總統就職典禮・升旗', 480, 46, { size: 30, weight: 900, color: '#ffd84a', align: 'center', stroke: '#000', sw: 6 });
    txt(ctx, `${ch.title}，從立委一路當選總統！`, 480, 84, { size: 20, weight: 900, color: '#ffffff', align: 'center', stroke: '#000', sw: 5 });
    ctx.restore();
    // 紙花
    for (let i = 0; i < 50; i++) {
      const x = ((i * 97) % 1100) - 70 + Math.sin(T * 2 + i) * 20;
      const y = ((T * (100 + (i % 7) * 30) + i * 53) % 640) - 60;
      ctx.fillStyle = ['#ff5a3c', '#ffd84a', '#5cff7a', '#5cc8ff', '#ff7ad8'][i % 5];
      ctx.fillRect(x, y, 7, 11);
    }
  }

  // ② 握緊拳頭，俯視落敗的對手
  drawStare(ctx) {
    const { ox, CW } = this.g, T = this.t, id = this.d.player;
    const art = ASSETS.stages[`ending2_${id}`];
    if (art) cover(ctx, art, ox, CW);
    else {
      const bg = ctx.createRadialGradient(640, 200, 40, 640, 200, 700);
      bg.addColorStop(0, '#8a1a1a');
      bg.addColorStop(0.5, '#3a0808');
      bg.addColorStop(1, '#0a0204');
      ctx.fillStyle = bg;
      ctx.fillRect(-ox, 0, CW, 540);
      // 集中線
      ctx.strokeStyle = 'rgba(255,220,200,0.12)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2 + T * 0.05;
        ctx.beginPath();
        ctx.moveTo(640 + Math.cos(a) * 160, 220 + Math.sin(a) * 160);
        ctx.lineTo(640 + Math.cos(a) * 900, 220 + Math.sin(a) * 900);
        ctx.stroke();
      }
      // 地面
      ctx.fillStyle = '#1a0a0a';
      ctx.fillRect(-ox, 470, CW, 70);
      // 落敗的對手們：倒在地上、頭冒金星、灰頭土臉
      const rv = this.d.rivals.slice(0, 3);
      rv.forEach((rid, i) => {
        const x = 120 + i * 150, y = 500 - (i % 2) * 14;
        drawPose(ctx, rid, 'down', 0, x, y, 120, i % 2 ? -1 : 1, 0.9);
        // 灰塵＋OK 繃
        ctx.fillStyle = 'rgba(120,100,90,0.35)';
        ctx.beginPath();
        ctx.ellipse(x, y - 10, 70, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        for (let k = 0; k < 3; k++) {
          const a = T * 4 + (k * Math.PI * 2) / 3 + i;
          drawStar(ctx, x + Math.cos(a) * 26, y - 70 + Math.sin(a) * 6, 6, '#ffe14a');
        }
        txt(ctx, CHAR_BY_ID[rid].title, x, y + 22, { size: 13, weight: 900, color: '#aa8a8a', align: 'center' });
      });
      // 主角：巨大、站得高高的往下看，握緊拳頭（慢慢往前逼近）
      const k = easeOut(clamp(T / 1.2, 0, 1));
      const h = 400 + k * 40;
      ctx.save();
      ctx.shadowColor = 'rgba(255,80,40,0.8)';
      ctx.shadowBlur = 30;
      drawPose(ctx, id, 'idle', 0, 700 + (1 - k) * 80, 540, h, -1);
      ctx.restore();
    }
    const a = clamp((T - 1.5) / 0.6, 0, 1);
    ctx.save();
    ctx.globalAlpha = a;
    txt(ctx, '「想跟我搶位子？」', 30, 90, { size: 34, weight: 900, color: '#ffffff', stroke: '#000', sw: 7 });
    txt(ctx, '挑戰者們，全數落選。', 30, 140, { size: 22, weight: 900, color: '#ff9a7a', stroke: '#000', sw: 5 });
    ctx.restore();
    if (T < 0.25) {
      ctx.fillStyle = `rgba(255,255,255,${1 - T / 0.25})`;
      ctx.fillRect(-ox, 0, CW, 540);
    }
  }

  // ③ 全劇終
  drawEnd(ctx) {
    const { ox, CW } = this.g, T = this.t;
    ctx.fillStyle = '#000';
    ctx.fillRect(-ox, 0, CW, 540);
    const a = clamp(T / 1.2, 0, 1);
    ctx.save();
    ctx.globalAlpha = a;
    txt(ctx, '全　劇　終', 480, 230, { size: 64, weight: 900, color: '#ffffff', align: 'center' });
    pixelText(ctx, 'THE END', 480, 310, { size: 24, scale: 2, font: 'px', color: '#ffd84a', outline: '#000' });
    txt(ctx, '本遊戲純屬虛構，與真實人物、團體無關', 480, 380, { size: 14, color: '#888', align: 'center' });
    ctx.restore();
  }
}
