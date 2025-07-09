const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const message = document.getElementById("message");

let rightPressed = false;
let leftPressed = false;
let ball, paddle;
let bricks = [];
let brickRowCount;
let brickColumnCount;
let brickPadding = 5;
let currentStage = 0;
let stages = [
  { img: './images/game2/stage1.png' },
  { img: './images/game2/stage2.png' },
  { img: './images/game2/stage3.png' },
];
let stageImage = new Image();
let gameLoopId;
let ballSpeed;
let stageCleared = false;

document.addEventListener("keydown", e => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

startBtn.addEventListener("click", () => {
  overlay.style.display = 'none';
  startStage();
});

function startStage() {
  if (currentStage >= stages.length) {
    showOverlay("ゲームクリア！おめでとう！", "最初から");
    currentStage = 0;
    return;
  }

  stageCleared = false;
  loadStageImage(stages[currentStage].img, () => {
    initGameParameters();
    buildBricks();
    resetBallAndPaddle();
    gameLoop();
  });
}

function loadStageImage(src, callback) {
  stageImage = new Image();
  stageImage.onload = callback;
  stageImage.src = src;
}

function initGameParameters() {
  brickRowCount = 5 + currentStage;
  brickColumnCount = 8 + currentStage;
  ballSpeed = 3 + currentStage;
}

function buildBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { status: 1 };
    }
  }
}

function resetBallAndPaddle() {
  ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    dx: ballSpeed,
    dy: -ballSpeed,
    radius: 8
  };
  paddle = {
    width: 100,
    height: 12,
    x: (canvas.width - 100) / 2
  };
}

function getFittedImageRect(imgW, imgH, canvasW, canvasH) {
  // 常にパドルとの間を150ピクセル開ける
  const RESERVED_SPACE_BELOW = 150 + paddle.height + 20; // 20はボールの余裕

  const usableHeight = canvasH - RESERVED_SPACE_BELOW;
  const imgAspect = imgW / imgH;
  let drawW, drawH, offsetX, offsetY;

  if (imgAspect > canvasW / usableHeight) {
    drawW = canvasW;
    drawH = canvasW / imgAspect;
  } else {
    drawH = usableHeight;
    drawW = drawH * imgAspect;
  }

  offsetX = (canvasW - drawW) / 2;
  offsetY = 0; // 上寄せ固定

  return { drawW, drawH, offsetX, offsetY };
}

function drawBricks() {
  const fit = getFittedImageRect(stageImage.width, stageImage.height, canvas.width, canvas.height);
  const regionW = fit.drawW;
  const regionH = fit.drawH;
  const offsetX = fit.offsetX;
  const offsetY = fit.offsetY;

  const targetBrickW = regionW / brickColumnCount;
  const targetBrickH = regionH / brickRowCount;

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = offsetX + c * targetBrickW;
        let brickY = offsetY + r * targetBrickH;

        let sx = c * (stageImage.width / brickColumnCount);
        let sy = r * (stageImage.height / brickRowCount);
        let sw = stageImage.width / brickColumnCount;
        let sh = stageImage.height / brickRowCount;

        ctx.drawImage(stageImage, sx, sy, sw, sh, brickX, brickY, targetBrickW, targetBrickH);
      }
    }
  }
}

function collisionDetection() {
  const fit = getFittedImageRect(stageImage.width, stageImage.height, canvas.width, canvas.height);
  const regionW = fit.drawW;
  const regionH = fit.drawH;
  const offsetX = fit.offsetX;
  const offsetY = fit.offsetY;

  const targetBrickW = regionW / brickColumnCount;
  const targetBrickH = regionH / brickRowCount;

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        let brickX = offsetX + c * targetBrickW;
        let brickY = offsetY + r * targetBrickH;
        if (
          ball.x > brickX &&
          ball.x < brickX + targetBrickW &&
          ball.y > brickY &&
          ball.y < brickY + targetBrickH
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
        }
      }
    }
  }

  if (isStageCleared() && !stageCleared) {
    stageCleared = true;
    cancelAnimationFrame(gameLoopId);
    currentStage++;
    showOverlay("ステージクリア！", "次へ");
  }
}

function isStageCleared() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) return false;
    }
  }
  return true;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
  ctx.fillStyle = "#0f0";
  ctx.fill();
  ctx.closePath();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    } else {
      cancelAnimationFrame(gameLoopId);
      showOverlay("ゲームオーバー", "リトライ");
      return;
    }
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += 6;
  else if (leftPressed && paddle.x > 0) paddle.x -= 6;

  gameLoopId = requestAnimationFrame(gameLoop);
}

function showOverlay(text, btnText) {
  message.textContent = text;
  startBtn.textContent = btnText;
  overlay.style.display = 'flex';
}

canvas.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;

  paddle.x = mouseX - paddle.width / 2;

  // 画面端ではみ出さない
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}
