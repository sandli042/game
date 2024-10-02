  const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let score = 0;
let gameOver = false; // Add this flag

// Paddle properties
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 30,
    width: 80,
    height: 10,
    speed: 10,
    dx: 0
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 6,
    size: 10,
    speed: 2,
    dx: 2,
    dy: 2
};

// Draw paddle
function drawPaddle() {
    ctx.fillStyle = '#0095DD';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// Move paddle using arrow keys
function movePaddleWithKeys() {
    paddle.x += paddle.dx;

    // Wall detection
    if (paddle.x < 0) {
        paddle.x = 0;
    }

    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

// Move paddle using mouse or touch
function movePaddleWithTouch(positionX) {
    paddle.x = positionX - paddle.width / 2;

    // Wall detection
    if (paddle.x < 0) {
        paddle.x = 0;
    }

    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall detection (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // Wall detection (top)
    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.y + ball.size > paddle.y) {
        ball.dy = -Math.abs(ball.dy); // Ensure the ball bounces upward
        score++;
        document.getElementById('score').textContent = 'Score: ${score}';

        // Increase ball height (dy) slightly on every collision with the paddle
        ball.dy -= 0.5;
    }

    // Game over (ball touches bottom)
    if (ball.y + ball.size > canvas.height && !gameOver) { // Only show Game Over once
        gameOver = true; // Set game over flag
        alert('Game Over');
        document.location.reload(); // Reload the page
    }
}

// Keydown event for arrow key movement
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

// Keyup event to stop moving the paddle when arrow keys are released
function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
}

// Mouse move event for paddle
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    movePaddleWithTouch(relativeX);
}

// Touch move event for paddle
function touchMoveHandler(e) {
    const relativeX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    movePaddleWithTouch(relativeX);
}

// Update canvas drawing and animation
function update() {
    if (!gameOver) { // Check if the game is still active
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw everything
        drawPaddle();
        drawBall();

        // Move everything
        movePaddleWithKeys(); // Move paddle with arrow keys
        moveBall(); // Move the ball

        requestAnimationFrame(update);
    }
}

// Event listeners for paddle movement via arrow keys, mouse, and touch
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
canvas.addEventListener('mousemove', mouseMoveHandler);
canvas.addEventListener('touchmove', touchMoveHandler, { passive: true });

// Start game
update();
