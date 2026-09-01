// ---------- Slide navigation ----------
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let current = 0;

function goTo(index){
  if(index < 0 || index >= slides.length) return;
  slides[current].classList.remove("active");
  dots[current].classList.remove("active");
  current = index;
  slides[current].classList.add("active");
  dots[current].classList.add("active");

  if(current === slides.length - 1){
    launchConfetti();
  }
}

document.querySelectorAll("[data-next]").forEach(btn=>{
  btn.addEventListener("click", ()=> goTo(current + 1));
});

dots.forEach(dot=>{
  dot.addEventListener("click", ()=> goTo(parseInt(dot.dataset.index, 10)));
});

document.getElementById("replayBtn").addEventListener("click", ()=> goTo(0));

// keyboard arrows for convenience
window.addEventListener("keydown", (e)=>{
  if(e.key === "ArrowRight") goTo(current + 1);
  if(e.key === "ArrowLeft") goTo(current - 1);
});

// show first slide on load
slides[0].classList.add("active");

// ---------- Candle blow interaction ----------
const flame = document.getElementById("flame");
const cake = document.getElementById("cake");
const cakeHint = document.getElementById("cakeHint");
const toClosing = document.getElementById("toPromise");

flame.addEventListener("click", ()=>{
  if(flame.classList.contains("out")) return;
  flame.classList.add("out");
  cakeHint.textContent = "Your wish is on its way ✨";
  toClosing.disabled = false;

  // little smoke puffs
  for(let i=0;i<4;i++){
    setTimeout(()=>{
      const smoke = document.createElement("span");
      smoke.className = "smoke";
      smoke.style.left = (50 + (Math.random()*10 - 5)) + "%";
      cake.appendChild(smoke);
      setTimeout(()=> smoke.remove(), 1300);
    }, i * 150);
  }
});

// ---------- Confetti ----------
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const confettiColors = ["#ffcf6b", "#ff7fa3", "#b79cff", "#fff6ea"];

function createConfetti(){
  confettiPieces = [];
  const count = 140;
  for(let i=0;i<count;i++){
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      size: 6 + Math.random() * 6,
      color: confettiColors[Math.floor(Math.random()*confettiColors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8
    });
  }
}

function drawConfetti(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let stillActive = false;

  confettiPieces.forEach(p=>{
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;

    if(p.y < canvas.height + 20) stillActive = true;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
    ctx.restore();
  });

  if(stillActive){
    requestAnimationFrame(drawConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function launchConfetti(){
  if(confettiRunning) return;
  confettiRunning = true;
  createConfetti();
  requestAnimationFrame(drawConfetti);
}