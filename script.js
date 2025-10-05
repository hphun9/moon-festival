// --- Canvas animation: stars and meteors ---
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let w, h, stars = [], meteors = [];

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = [];
  const count = Math.floor(w * h / 2000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 0.6 * Math.random() + 0.15,
      alpha: 0.8 * Math.random() + 0.1,
      twinkle: 0.02 * Math.random() + 0.003
    });
  }
}

function drawStars() {
  stars.forEach(s => {
    s.alpha += (Math.random() > 0.5 ? 1 : -1) * s.twinkle;
    s.alpha = Math.max(0.1, Math.min(1, s.alpha));
    ctx.beginPath();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = "white";
    ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function createMeteor() {
  const x = Math.random() * w;
  const y = Math.random() * (h / 3);
  const speed = 8 * Math.random() + 6;
  meteors.push({
    x, y,
    vx: speed + 2,
    vy: speed / 2,
    len: 100 * Math.random() + 120,
    alpha: 1
  });
}

function drawMeteors() {
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y - m.len / 2);
    grad.addColorStop(0, `rgba(255,255,255,${m.alpha})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.len, m.y - m.len / 2);
    ctx.stroke();
    m.x += m.vx;
    m.y += m.vy;
    m.alpha -= 0.015;
    if (m.alpha <= 0 || m.x > w + 200 || m.y > h + 200) meteors.splice(i, 1);
  }
}

function loop() {
  ctx.clearRect(0, 0, w, h);
  drawStars();
  drawMeteors();
  if (Math.random() < 0.01) createMeteor();
  requestAnimationFrame(loop);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
loop();

// --- UI logic ---
const messageBox = document.getElementById("message");
const inviteBox = document.getElementById("invite-box");
const wishPopup = document.getElementById("wish-popup");
const lanternContainer = document.getElementById("lantern-container");

let lanternClickable = false;

function showSentence(sentences) {
  messageBox.innerHTML = "";
  const words = sentences.split(" ");
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexWrap = "wrap";
  wrapper.style.justifyContent = "center";

  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = word;
    wrapper.appendChild(span);
    setTimeout(() => span.classList.add("show"), 300 * i);
  });

  messageBox.appendChild(wrapper);

  const delay = 300 * words.length + 1600;
  setTimeout(() => {
    const spans = document.querySelectorAll(".word");
    spans.forEach((s, i) =>
      setTimeout(() => s.classList.remove("show"), 200 * i)
    );
    setTimeout(() => {
      currentSentence++;
      if (currentSentence < sentencesList.length) showSentence(sentencesList[currentSentence]);
      else inviteBox.style.display = "block";
    }, 200 * words.length + 700);
  }, delay);
}

function createLantern() {
  const lantern = document.createElement("img");
  lantern.src = "./den.png";
  lantern.className = "lantern";
  const size = 20 + 30 * Math.random();
  const duration = 10000 + 5000 * Math.random();
  lantern.style.width = `${size}px`;
  lantern.style.left = `${Math.random() * 90}vw`;
  lantern.style.opacity = 0.9;
  lanternContainer.appendChild(lantern);

  const xOffset = 100 * Math.random() - 40;
  lantern.animate(
    [
      { transform: "translate(0, 0)", opacity: 0.9 },
      { transform: `translate(${xOffset}px, -120vh)`, opacity: 0 }
    ],
    { duration, easing: "linear", fill: "forwards" }
  );

  setTimeout(() => lantern.remove(), duration);

  if (lanternClickable) {
    lantern.addEventListener("click", (e) => {
      e.stopPropagation();
      const wish = wishes[Math.floor(Math.random() * wishes.length)];
      wishPopup.textContent = wish;
      wishPopup.style.display = "block";
      const hide = () => {
        wishPopup.style.display = "none";
        document.removeEventListener("click", hide);
      };
      setTimeout(() => document.addEventListener("click", hide), 50);
    });
  }
}

setInterval(createLantern, 350);

document.getElementById("btn-ok").addEventListener("click", () => {
  inviteBox.style.display = "none";
  lanternClickable = true;
  const hint = document.createElement("div");
  hint.id = "hint";
  hint.textContent = "Biết ngay sẽ đồng ý mà!\nChạm vào đèn trời có điều bất ngờ ✨";
  document.body.appendChild(hint);
  setTimeout(() => (hint.style.opacity = "1"), 100);
  setTimeout(() => {
    hint.style.opacity = "0";
    setTimeout(() => hint.remove(), 1000);
  }, 5000);
});

const btnNo = document.getElementById("btn-no");
let noIndex = 0;
btnNo.addEventListener("click", () => {
  btnNo.classList.add("shake");
  btnNo.textContent = noList[noIndex];
  noIndex = (noIndex + 1) % noList.length;
  setTimeout(() => btnNo.classList.remove("shake"), 500);
});

// --- Text Config ---
let currentSentence = 0;

const sentencesList = [
  "Bé Nguyên à, Trung Thu này nếu bận thì thôi...",
  "…nhưng nếu rảnh thì cho anh cơ hội đi dạo cùng em nhé? 🌙",
  "Anh hứa sẽ mang theo thật nhiều đèn lồng và nụ cười 😗",
  "Chỉ cần em cần, anh sẽ đến. ❤"
];

const wishes = [
  "Anh chúc em luôn vui vẻ và hạnh phúc.",
  "Mong em có một mùa trăng thật ấm áp và tràn ngập yêu thương.",
  "Anh mong em sẽ luôn giữ nụ cười ấy, vì nó khiến anh thấy bình yên.",
  "Cảm ơn em đã xuất hiện trong thế giới của anh 🌕"
];

const noList = [
  "Không đi là anh buồn đó 😢",
  "Thôi mà, đi với anh nha 🥺",
  "Đi một chút thôi mà 😩",
  "Nếu em không đi, anh giận thật đó 😭"
];

messageBox.style.display = "flex";
showSentence(sentencesList[currentSentence]);
