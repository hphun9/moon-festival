// script.js — cleaned, readable, no redirects, no obfuscation
// Features:
//  - starfield + meteors canvas
//  - animated sentence display
//  - lanterns float and clickable for wishes
//  - invite popup with Ok / Không behavior
//  - supports ?id=1..5 to choose message template (default 2)
//  - plays bg music after first user interaction

(function () {
  // helper
  const $ = id => document.getElementById(id);

  // ---------- audio autoplay handling ----------
  const bg = $("bg-music");
  let musicStarted = false;
  function tryPlayMusic() {
    if (!musicStarted && bg) {
      bg.play().catch(() => { /* ignore autoplay block */ });
      musicStarted = true;
    }
  }
  document.addEventListener("click", tryPlayMusic, { passive: true });
  document.addEventListener("touchstart", tryPlayMusic, { passive: true });

  // ---------- canvas: stars + meteors ----------
  const canvas = $("starfield");
  const ctx = canvas.getContext && canvas.getContext("2d");
  let W = 0, H = 0;
  let stars = [], meteors = [];

  function resize() {
    if (!canvas || !ctx) return;
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = [];
    const count = Math.max(40, Math.floor(W * H / 2400));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.9 + 0.15,
        a: Math.random() * 0.8 + 0.1,
        tw: Math.random() * 0.02 + 0.003
      });
    }
  }
  window.addEventListener("resize", resize);
  resize();

  function drawStars() {
    if (!ctx) return;
    stars.forEach(s => {
      s.a += (Math.random() > 0.5 ? 1 : -1) * s.tw;
      s.a = Math.max(0.1, Math.min(1, s.a));
      ctx.beginPath();
      ctx.globalAlpha = s.a;
      ctx.fillStyle = "white";
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function addMeteor() {
    meteors.push({
      x: Math.random() * W,
      y: Math.random() * (H / 3),
      vx: Math.random() * 8 + 8,
      vy: Math.random() * 5 + 2,
      len: Math.random() * 120 + 120,
      a: 1
    });
  }

  function drawMeteors() {
    if (!ctx) return;
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const x2 = m.x - m.len;
      const y2 = m.y - m.len / 2;
      const g = ctx.createLinearGradient(m.x, m.y, x2, y2);
      g.addColorStop(0, `rgba(255,255,255,${m.a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      m.x += m.vx;
      m.y += m.vy;
      m.a -= 0.015;
      if (m.a <= 0 || m.x > W + 200 || m.y > H + 200) meteors.splice(i, 1);
    }
  }

  (function loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    drawStars();
    drawMeteors();
    if (Math.random() < 0.013) addMeteor();
    requestAnimationFrame(loop);
  })();

  // ---------- messages, invites, wishes ----------
  const messageBox = $("message");
  const inviteBox = $("invite-box");
  const wishPopup = $("wish-popup");
  const lanternWrap = $("lantern-container");

  // Templates for various id values (1..5)
  const TEMPLATES = {
    1: {
      sentences: [
        "Cậu ơi, Trung Thu đến rồi...",
        "Tớ muốn cùng cậu đi dạo dưới ánh đèn lồng lung linh.",
        "Trung Thu có cậu thì mới thật sự trọn vẹn."
      ],
      invite: "Đi chơi với tớ nhé?",
      wishes: [
        "Mong em luôn gặp nhiều may mắn và hạnh phúc.",
        "Ước mọi dự định của cậu đều thuận lợi.",
        "Nếu mệt, mình dựa vào nhau một chút nhé."
      ],
      noTexts: [
        "Thôi mà, đi với tớ đi 😢",
        "Đi một lần thôi mà 😩",
        "Không đi là tớ giận đó 😭"
      ]
    },
    2: {
      sentences: [
        "Bé Nguyên ơi,",
        "Trung Thu này nếu bận thì thôi…",
        "…nhưng nếu rảnh, cho anh cơ hội đi dạo cùng em nhé? 🌙",
        "Anh hứa sẽ mang theo thật nhiều đèn lồng và nụ cười 😗",
        "Chỉ cần em cần, anh sẽ đến. ❤"
      ],
      invite: "Nàng thơ đi chơi với anh nhé?",
      wishes: [
        "Mong em luôn khỏe, bình an và rực rỡ như trăng rằm.",
        "Ước mọi dự định của em đều thuận lợi.",
        "Đèn lồng có thể tắt — tình cảm này thì không.",
        "Nếu em mỏi, cứ tựa vào anh một chút nhé."
      ],
      noTexts: [
        "Thôi mà, cho anh đặt lịch một buổi thôi được không? 🥺",
        "Nếu em bận hôm nay, mình hẹn ngày em rảnh nhé?",
        "Hứa sẽ đưa em về trước khi trăng tàn 😆",
        "Không đi là anh nhớ lắm đó! 😭"
      ]
    },
    3: {
      sentences: [
        "Anh ơi, Trung Thu này em muốn đi dạo cùng anh...",
        "Em muốn được ngồi cạnh anh, nghe kể chuyện xưa 😘",
        "Ngắm trăng, nắm tay, kể chuyện hồi nhỏ..."
      ],
      invite: "Đi chơi với em nhé?",
      wishes: [
        "Mong em luôn an yên và rạng rỡ.",
        "Ước mơ của em sẽ bay cao.",
        "Có anh bên cạnh, mọi thứ trở nên ấm áp."
      ],
      noTexts: [
        "Anh không đi cùng em thật sao? 🥺",
        "Em muốn đi với anh lắm á 😩",
        "Nếu không đi, em buồn lắm."
      ]
    },
    4: {
      sentences: [
        "Chồng ơi, Trung Thu này mình ra ngoài dạo phố nhé...",
        "Có chồng bên cạnh, vợ thấy Trung Thu nào cũng đẹp.",
        "Mình cùng nhau ăn bánh, thả đèn, kể chuyện nhỏ."
      ],
      invite: "Đi chơi với vợ nhé?",
      wishes: [
        "Chúc chồng sức khỏe và công việc thuận lợi.",
        "Mong chồng luôn được bình an.",
        "Những niềm vui nhỏ sẽ là động lực lớn."
      ],
      noTexts: [
        "Không đi với vợ hả chồng? 🥺",
        "Thôi mà, vợ buồn á 😢",
        "Không đi là vợ giận đó 😭"
      ]
    },
    5: {
      sentences: [
        "Vợ ơi, Trung Thu này em muốn cùng chồng đi dạo...",
        "Chồng muốn thấy nụ cười của vợ trong ánh đèn lồng 🌟",
        "Cùng nhau ta sẽ lưu giữ kỷ niệm đẹp."
      ],
      invite: "Đi chơi với chồng nhé?",
      wishes: [
        "Mong vợ luôn an yên và hạnh phúc.",
        "Chúc vợ gặp nhiều may mắn.",
        "Mãi bên nhau nhé."
      ],
      noTexts: [
        "Nếu vợ không đi, chồng buồn lắm 😭",
        "Đi với chồng đi mà 😢",
        "Thôi mà, vợ buồn á 😢"
      ]
    }
  };

  // Read id param
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10) || 2;
  const template = TEMPLATES[id] || TEMPLATES[2];
  const sentences = template.sentences;
  const wishes = template.wishes;
  const noTexts = template.noTexts;
  const inviteText = template.invite;

  // Put invite text
  const inviteP = inviteBox.querySelector("p");
  if (inviteP) inviteP.textContent = inviteText;

  // animate sentences
  let currentSentence = 0;
  function showSentence(s) {
    if (!messageBox) return;
    messageBox.innerHTML = "";
    const words = s.split(" ");
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexWrap = "wrap";
    row.style.justifyContent = "center";
    words.forEach((w, i) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      row.appendChild(span);
      setTimeout(() => span.classList.add("show"), 260 * i);
    });
    messageBox.appendChild(row);

    const stay = 260 * words.length + 1400;
    setTimeout(() => {
      const spans = Array.from(row.children);
      spans.forEach((el, i) => setTimeout(() => el.classList.add("hide"), 140 * i));
      setTimeout(() => {
        currentSentence++;
        if (currentSentence < sentences.length) {
          showSentence(sentences[currentSentence]);
        } else {
          if (inviteBox) inviteBox.style.display = "block";
        }
      }, 160 * spans.length + 650);
    }, stay);
  }
  showSentence(sentences[currentSentence]);

  // lantern creation
  let lanternClickable = false;
  function makeLantern() {
    const img = new Image();
    img.src = "den.png";
    img.className = "lantern";
    const sizeType = Math.floor(Math.random() * 3) + 1;
    let w, duration, op;
    if (sizeType === 1) { w = 16 + Math.random() * 16; duration = 14000 + Math.random() * 6000; op = 0.55; }
    else if (sizeType === 2) { w = 26 + Math.random() * 26; duration = 10500 + Math.random() * 5500; op = 0.8; }
    else { w = 36 + Math.random() * 36; duration = 8500 + Math.random() * 4500; op = 0.95; }
    img.style.width = w + "px";
    img.style.left = (Math.random() * 90) + "vw";
    img.style.opacity = op.toString();
    lanternWrap.appendChild(img);

    const dx = (Math.random() * 100 - 40);
    img.animate(
      [{ transform: "translate(0,0)", opacity: op },
       { transform: `translate(${dx}vw, -120vh)`, opacity: 0 }],
      { duration, easing: "linear", fill: "forwards" }
    );
    setTimeout(() => img.remove(), duration);

    if (lanternClickable) {
      img.style.cursor = "pointer";
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        const wish = wishes[Math.floor(Math.random() * wishes.length)];
        if (wishPopup) {
          wishPopup.textContent = wish;
          wishPopup.style.display = "block";
          setTimeout(() => {
            const close = () => { wishPopup.style.display = "none"; document.removeEventListener("click", close); };
            document.addEventListener("click", close);
          }, 60);
        }
      });
    }
  }
  setInterval(makeLantern, 360);

  // invite buttons behavior
  const btnOk = $("btn-ok");
  const btnNo = $("btn-no");
  let noIdx = 0;
  if (btnOk) {
    btnOk.addEventListener("click", () => {
      if (inviteBox) inviteBox.style.display = "none";
      lanternClickable = true;
      const h = document.createElement("div");
      h.id = "hint";
      h.textContent = "Biết ngay sẽ đồng ý mà\nChạm vào đèn trời có điều bất ngờ";
      document.body.appendChild(h);
      setTimeout(() => { h.style.opacity = "1"; }, 80);
      setTimeout(() => { h.style.opacity = "0"; setTimeout(() => h.remove(), 800); }, 5200);
    });
  }
  if (btnNo) {
    btnNo.addEventListener("click", () => {
      btnNo.classList.add("shake");
      btnNo.textContent = noTexts[noIdx];
      noIdx = (noIdx + 1) % noTexts.length;
      setTimeout(() => btnNo.classList.remove("shake"), 520);
    });
  }

  // Safety: do NOT redirect anywhere. (We explicitly removed any redirect logic.)
  // End of script
})();
