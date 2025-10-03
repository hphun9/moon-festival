/* ===== Stars ===== */
const starCanvas = document.getElementById('stars');
const sctx = starCanvas.getContext('2d');
function resizeStars(){
  starCanvas.width = innerWidth;
  starCanvas.height = innerHeight;
  drawStars();
}
function drawStars(){
  const count = Math.min(420, Math.floor(innerWidth*innerHeight/4200));
  sctx.clearRect(0,0,starCanvas.width,starCanvas.height);
  for(let i=0;i<count;i++){
    const x = Math.random()*starCanvas.width;
    const y = Math.random()*starCanvas.height;
    const r = Math.random()*1.3 + 0.2;
    sctx.fillStyle = `rgba(255,255,255,${Math.random()*0.7+0.25})`;
    sctx.beginPath(); sctx.arc(x,y,r,0,Math.PI*2); sctx.fill();
  }
}
addEventListener('resize', resizeStars);
resizeStars();

/* ===== Meteors (shooting stars) ===== */
const meteorCanvas = document.getElementById('meteors');
const mctx = meteorCanvas.getContext('2d');
function resizeM(){ meteorCanvas.width = innerWidth; meteorCanvas.height = innerHeight; }
addEventListener('resize', resizeM); resizeM();

let meteors = [];
function spawnMeteor(){
  const startX = Math.random()*innerWidth*0.7;
  const startY = Math.random()*innerHeight*0.35;
  const speed = Math.random()*3 + 3.2;
  const len = Math.random()*120 + 80;
  const angle = (-Math.PI/4) + (Math.random()*0.18 - 0.09);
  meteors.push({ x:startX, y:startY, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, life:0, maxLife:Math.random()*500+550, len });
  setTimeout(spawnMeteor, Math.random()*5000 + 5000);
}
setTimeout(spawnMeteor, 1500);

function drawMeteors(){
  mctx.clearRect(0,0,meteorCanvas.width, meteorCanvas.height);
  for(let i=meteors.length-1;i>=0;i--){
    const m = meteors[i];
    m.x += m.vx; m.y += m.vy; m.life += 16;
    const tx = m.x - m.vx*(m.len/10);
    const ty = m.y - m.vy*(m.len/10);
    const g = mctx.createLinearGradient(m.x,m.y,tx,ty);
    g.addColorStop(0,'rgba(255,255,255,0.9)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    mctx.strokeStyle = g; mctx.lineWidth = 2;
    mctx.beginPath(); mctx.moveTo(m.x,m.y); mctx.lineTo(tx,ty); mctx.stroke();
    if(m.life>m.maxLife || m.x>innerWidth+120 || m.y>innerHeight+120) meteors.splice(i,1);
  }
  requestAnimationFrame(drawMeteors);
}
requestAnimationFrame(drawMeteors);

/* ===== Lanterns with depth & spacing ===== */
const field = document.getElementById('field');

function columnX(cols, i){
  const w = innerWidth/cols;
  const left = i*w;
  return left + w*0.18 + Math.random()*w*0.64;
}

function spawnLantern({layer='mid', colIndex=0, cols=12}={}){
  const el = document.createElement('div');
  el.className = `lantern ${layer}`;

  const baseScale = layer==='near'? 1.22 : layer==='mid'? 0.96 : 0.72;
  const depth = layer==='near'? 70 : layer==='mid'? 24 : -40;
  const opacity = layer==='near'? .96 : layer==='mid'? .86 : .72;

  const x = columnX(cols, colIndex);
  el.style.left = (x - 31) + 'px';

  el.style.setProperty('--drift', (Math.random()*160 - 80) + 'px');
  el.style.setProperty('--x', (Math.random()*40 - 20) + 'px');
  el.style.setProperty('--scale', baseScale + (Math.random()*0.15 - 0.07));
  el.style.setProperty('--depth', depth + 'px');
  el.style.setProperty('--opa', opacity);
  el.style.setProperty('--tiltY', (Math.random()*14 - 10) + 'deg');
  el.style.setProperty('--tiltX', (Math.random()*6 - 2) + 'deg');

  // speed per layer
  const speed = layer==='near'? 56 : layer==='mid'? 66 : 80;
  el.style.animationDuration = `${speed}s, 7.6s, 2.4s`;

  // start at random progress
  el.style.animationDelay = `${Math.random()*-speed}s, ${Math.random()*-7.6}s, ${Math.random()*-2.4}s`;

  field.appendChild(el);

  el.addEventListener('animationiteration', (e)=>{
    if(e.animationName!=='float') return;
    const newCol = Math.floor(Math.random()*cols);
    const nx = columnX(cols,newCol);
    el.style.left = (nx - 31) + 'px';
    el.style.setProperty('--drift', (Math.random()*160 - 80) + 'px');
    el.style.setProperty('--tiltY', (Math.random()*14 - 10) + 'deg');
    el.style.setProperty('--tiltX', (Math.random()*6 - 2) + 'deg');
  });
}

function populate(){
  field.innerHTML = '';
  const colsNear=9, colsMid=14, colsFar=18;
  for(let i=0;i<colsFar;i++) spawnLantern({layer:'far', cols:colsFar, colIndex:i});
  for(let i=0;i<colsMid;i++) spawnLantern({layer:'mid', cols:colsMid, colIndex:i});
  for(let i=0;i<colsNear;i++) spawnLantern({layer:'near', cols:colsNear, colIndex:i});
}
populate();
addEventListener('resize', populate);

/* ===== Typing message ===== */
const typeEl = document.getElementById('type');
const messages = [
  "Bé Nguyên à, Trung Thu này nếu bận thì thôi...",
  "…nhưng nếu rảnh thì cho anh cơ hội đi dạo cùng em nhé? 🌙",
  "Anh hứa sẽ mang theo thật nhiều đèn lồng và nụ cười 😗",
  "Chỉ cần em cần, anh sẽ đến. ❤"
];
let msgIndex=0,charIndex=0;
function typeEffect(){
  if(msgIndex>=messages.length) msgIndex=0;
  const text = messages[msgIndex];
  if(charIndex<text.length){
    typeEl.textContent += text.charAt(charIndex++);
    setTimeout(typeEffect,65);
  }else{
    setTimeout(()=>{ typeEl.textContent=""; charIndex=0; msgIndex++; typeEffect(); },2200);
  }
}
typeEffect();
