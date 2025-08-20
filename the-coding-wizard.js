const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// ===== Globals =====
let frm = 0;
const rad = 0.25;
const snake = [];
const numSegments = 60;
const segmentLength = 12;

// pointer position
const Pointer = { x: width / 2, y: height / 2 };
window.addEventListener("mousemove", (e) => {
  Pointer.x = e.clientX;
  Pointer.y = e.clientY;
});

// ===== Initialize Snake =====
for (let i = 0; i < numSegments; i++) {
  snake.push({
    x: width / 2,
    y: height / 2,
  });
}

// ===== Animation Loop =====
const run = () => {
  requestAnimationFrame(run);
  frm += 0.03;

  // clear with transparent black (trails look magical)
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, width, height);

  // Snake head movement (wavy magic)
  let head = snake[0];
  const ax = (Math.cos(3 * frm) * rad * width) / height;
  const ay = (Math.sin(4 * frm) * rad * height) / width;

  head.x += (Pointer.x + ax - head.x) / 5;
  head.y += (Pointer.y + ay - head.y) / 5;

  // Follow effect for the rest of the body
  for (let i = 1; i < snake.length; i++) {
    let seg = snake[i];
    let prev = snake[i - 1];

    let dx = prev.x - seg.x;
    let dy = prev.y - seg.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > segmentLength) {
      seg.x = prev.x - (dx / dist) * segmentLength;
      seg.y = prev.y - (dy / dist) * segmentLength;
    }
  }

  // Draw snake
  for (let i = snake.length - 1; i >= 0; i--) {
    let seg = snake[i];

    let size = 8 + (i * 0.5); // tail gets smaller
    let hue = (frm * 50 + i * 10) % 360; // rainbow colors

    ctx.beginPath();
    ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.8)`;
    ctx.shadowBlur = 20;
    ctx.shadowColor = `hsla(${hue}, 100%, 70%, 1)`;
    ctx.arc(seg.x, seg.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
};

run();
