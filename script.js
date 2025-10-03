// ⭐ Sao trời
const starCanvas = document.getElementById('stars');
const ctx = starCanvas.getContext('2d');
function resizeStars() {
  starCanvas.width = innerWidth;
  starCanvas.height = innerHeight;
  drawStars();
}
function drawStars() {
  const count = Math.min(400, Math.floor(innerWidth * innerHeight / 4200));
  ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * starCanvas.width;
    const y = Math.random() * starCanvas.height;
    const r = Math.random() * 1.3 + 0.2;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.3})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
}
addEventListener('resize', resizeStars);
resizeStars();

// 🎐 Đèn lồng
const field = document.getElementById('field');
function spawnLantern({x = Math.random()*innerWidth, delay = Math.random()*-20, scale, drift, speed}) {
  const el = document.createElement('div');
  el.className = 'lantern';
  el.style.left = (x - 20) + 'px';
  el.style.setProperty('--x', (Math.random()*60-30) + 'px');
  el.style.setProperty('--drift', (drift ?? (Math.random()*140-70)) + 'px');
  el.style.setProperty('--s', (scale ?? (Math.random()*0.8+0.6)).toFixed(2));
  el.style.animationDuration = (speed ?? (Math.random()*28+24)) + 's';
  el.style.animationDelay = delay + 's';
  field.appendChild(el);
  el.addEventListener('animationiteration', () => {
    el.style.left = (Math.random()*innerWidth - 20) + 'px';
    el.style.setProperty('--drift', (Math.random()*140-70) + 'px');
    el.style.setProperty('--s', (Math.random()*0.8+0.6).toFixed(2));
  });
  return el;
}
for (let i=0; i<60; i++) spawnLantern({});

// Thả thêm đèn lồng
document.getElementById('release').addEventListener('click', () => {
  const el = spawnLantern({ x: innerWidth/2, delay:0, scale:1.2, drift: Math.random()>0.5?120:-120, speed:42 });
  el.style.filter = 'drop-shadow(0 0 12px #ffdca0) drop-shadow(0 0 22px #ffcf8a88)';
});

// 💌 Lời nhắn gõ chữ
const typeEl = document.getElementById('type');
const messages = [
  "Bé Nguyên à, Trung Thu này nếu bận thì thôi...",
  "…nhưng nếu rảnh thì cho anh cơ hội đi dạo cùng em nhé? 🌙",
  "Anh hứa sẽ mang theo thật nhiều đèn lồng và nụ cười 😗",
  "Chỉ cần em cần, anh sẽ đến. ❤"
];
let msgIndex = 0, charIndex = 0;
function typeEffect() {
  if (msgIndex >= messages.length) { msgIndex = 0; }
  const text = messages[msgIndex];
  if (charIndex < text.length) {
    typeEl.textContent += text.charAt(charIndex);
    charIndex++;
    setTimeout(typeEffect, 60);
  } else {
    setTimeout(() => {
      typeEl.textContent = "";
      charIndex = 0; msgIndex++;
      typeEffect();
    }, 2200);
  }
}
typeEffect();

// ▶ Nhạc
const playBtn = document.getElementById('play');
const bgm = document.getElementById('bgm');
playBtn.addEventListener('click', () => {
  bgm.paused ? bgm.play() : bgm.pause();
});
