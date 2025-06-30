
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const messageDiv = document.getElementById('message');
const counterDiv = document.getElementById('counter');

const ctx = wheel.getContext('2d');
const size = wheel.width;
const center = size / 2;
const radius = center - 10;

const segments = [
  { label: "Você é o rei da zoeira! 🎉", color: "#4f6d7a" },
  { label: " Você é meu maior presente! 💖", color: "#355c7d" },
  { label: "Te amar é uma aventura maravilhosa, e hoje eu só quero celebrar o privilégio que é ter você comigo. Feliz aniversário, meu bem", color: "#6c5b7b" },
  { label: "Hoje você pode zoar à vontade! 😜", color: "#34495e" },
  { label: "Mensagem especial: Te amo bem muitão! ❤️", color: "#2c3e50" },
  { label: "Você é incrível! ", color: "#3c6382" },
  { label: "Você merece tudo de melhor! 🎁", color: "#0a3d62" },
  { label: "Que seu dia seja tão especial quanto você", color: "#1e3799" },
  { label: "Grata por ter você na minha vida! 🌟", color: "#2f3640" },
  { label: "Voce é Meu melhor amigo e parceiro! 🤗", color: "#3b3b98" },
  { label: "Você é especial demais! 💫", color: "#576574" },
  { label: "A zoeira nunca para com você! 😂🔥", color: "#1e272e" }
];

let startAngle = 0;
let spinTimeout = null;
let spinTime = 0;
let spinTimeTotal = 0;

const totalRounds = segments.length;
let currentRound = 0;
let shownSegments = [];

function drawSegment(index, angle, arc) {
  const segment = segments[index];
  const startAngleRad = angle;
  const endAngleRad = angle + arc;

  ctx.fillStyle = segment.color;
  ctx.beginPath();
  ctx.moveTo(center, center);
  ctx.arc(center, center, radius, startAngleRad, endAngleRad, false);
  ctx.lineTo(center, center);
  ctx.fill();

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.translate(center, center);
  ctx.rotate(angle + arc / 2);
  ctx.textAlign = "right";
  ctx.font = "bold 14px 'Segoe UI'";
  wrapText(ctx, segment.label, radius - 10, 10, 110, 18);
  ctx.restore();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const testWidth = context.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, currentY);
}

function drawWheel() {
  const arc = (2 * Math.PI) / segments.length;
  ctx.clearRect(0, 0, size, size);

  for (let i = 0; i < segments.length; i++) {
    drawSegment(i, startAngle + i * arc, arc);
  }

  // Ponteiro
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(center - 10, 10);
  ctx.lineTo(center + 10, 10);
  ctx.lineTo(center, 30);
  ctx.closePath();
  ctx.fill();
}

function chooseSegmentIndex() {
  const availableIndexes = segments.map((_, i) => i).filter(i => !shownSegments.includes(i));
  if (availableIndexes.length === 0) return -1;
  const randIdx = Math.floor(Math.random() * availableIndexes.length);
  return availableIndexes[randIdx];
}

function spin() {
  if (shownSegments.length === segments.length) {
    return;
  }

  spinTime = 0;
  spinTimeTotal = Math.random() * 4000 + 4000;

  const nextSegment = chooseSegmentIndex();
  if (nextSegment === -1) return;

  spin.nextSegmentIndex = nextSegment;
  spin.stopAngle = (2 * Math.PI) - (nextSegment * ((2 * Math.PI) / segments.length)) - ((2 * Math.PI) / segments.length / 2);

  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;

  if (spinTime >= spinTimeTotal) {
    startAngle = spin.stopAngle;
    drawWheel();
    stopRotateWheel();
    return;
  }

  const ease = easeOut(spinTime, 0, 1, spinTimeTotal);
  const fullRotation = 2 * Math.PI * 4;
  startAngle = (fullRotation * ease + spin.stopAngle) % (2 * Math.PI);

  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);

  const index = spin.nextSegmentIndex;
  if (!shownSegments.includes(index)) shownSegments.push(index);

  currentRound++;
  const roundsLeft = totalRounds - currentRound;
  counterDiv.textContent = `Giro ${currentRound} de ${totalRounds} - Faltam ${roundsLeft} giro${roundsLeft !== 1 ? 's' : ''}`;
  spinBtn.disabled = false;

  messageDiv.textContent = segments[index].label;
  messageDiv.classList.remove("hidden");

  if (currentRound === totalRounds) {
    spinBtn.disabled = true;
    setTimeout(() => {
      messageDiv.innerHTML += `<br><br>🎉 <strong>Feliz aniversário, meu amor!</strong> 🎂<br>Você já viu todas as surpresas! 🎁🎊<br><br><em>"Entre todos os caminhos que a vida poderia me levar, ela me trouxe até você — e não existe destino melhor."</em>`;
      counterDiv.textContent = `Todos os giros completos! Parabéns! 🎉`;
    }, 2000);
  }
}

function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  messageDiv.classList.add("hidden");
  spin();
});

drawWheel();
