const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 初始化恶魔圈
let demonCircle = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20, // 将初始半径调整为20
  color: 'black',
  isDragging: false
};

let balls = [];

// 生成随机颜色
function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 生成随机半径
function randomRadius() {
  return Math.floor(Math.random() * 10) + 5;
}

// 生成随机位置
function randomPosition() {
  return {
    x: Math.random() * (canvas.width - 2 * randomRadius()) + randomRadius(),
    y: Math.random() * (canvas.height - 2 * randomRadius()) + randomRadius()
  };
}

// 生成随机速度
function randomVelocity() {
  return {
    dx: (Math.random() - 0.5) * 4,
    dy: (Math.random() - 0.5) * 4
  };
}

// 小球构造函数
function Ball() {
  this.x = randomPosition().x;
  this.y = randomPosition().y;
  this.dx = randomVelocity().dx;
  this.dy = randomVelocity().dy;
  this.radius = randomRadius();
  this.color = randomColor();
}

// 绘制小球
function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// 绘制恶魔圈
function drawDemonCircle() {
  ctx.beginPath();
  ctx.arc(demonCircle.x, demonCircle.y, demonCircle.radius, 0, Math.PI * 2);
  ctx.fillStyle = demonCircle.color;
  ctx.fill();
  ctx.closePath();
}

// 移动小球
function moveBall(ball) {
  // 碰撞边界检测
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  }
  
  // 更新小球位置
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// 检查恶魔圈和小球的碰撞
function checkCollision(ball) {
   
    const dx = ball.x - demonCircle.x;
    const dy = ball.y - demonCircle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 如果发生碰撞
    if (distance < ball.radius + demonCircle.radius) {
      // 增大恶魔圈半径
      demonCircle.radius += 2;
      // 重新生成小球
      ball.x = randomPosition().x;
      ball.y = randomPosition().y;
      ball.dx = randomVelocity().dx;
      ball.dy = randomVelocity().dy;
      ball.radius = randomRadius();
      ball.color = randomColor();
    }
  }

// 绘制函数
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach(ball => {
    drawBall(ball);
    moveBall(ball);
    checkCollision(ball);
  });
  drawDemonCircle();
  requestAnimationFrame(draw);
}

// 鼠标按下事件
function onMouseDown(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const dx = mouseX - demonCircle.x;
  const dy = mouseY - demonCircle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 如果鼠标在恶魔圈上，则设置为可拖动
  if (distance < demonCircle.radius) {
    demonCircle.isDragging = true;
  }
}

/// 鼠标释放事件
function onMouseUp() {
    demonCircle.isDragging = false;
  }
  
  // 鼠标移动事件
  function onMouseMove(event) {
    if (demonCircle.isDragging) {
      const rect = canvas.getBoundingClientRect();
      demonCircle.x = event.clientX - rect.left;
      demonCircle.y = event.clientY - rect.top;
    }
  }
  
  // 绑定事件监听器
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp); // 添加鼠标释放事件监听器
  canvas.addEventListener('mousemove', onMouseMove);

// 复原恶魔圈按钮点击事件
resetButton.addEventListener('click', () => {
    demonCircle.radius = 20; // 重置半径为初始值
  });
  
  

// 初始化小球
for (let i = 0; i < 50; i++) {
  balls.push(new Ball());
}

// 启动游戏循环
draw();
