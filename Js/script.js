const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")


let score = 0
let bscore = 10
let lives = 3;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = -2;
let dy = -2;

const ballRadius = 10;
let ballColor = "green"
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

// make break 
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

var bricks = []

for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD"
                ctx.fill();
                ctx.closePath()
            }

        }

    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();



}


function drawPaddle() {

    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath()

    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth)

    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0)
    }

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBall()
    x += dx;
    y += dy
        // bounce the ball
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx
        ballColor = "red"
    }
    if (y + dy < ballRadius) {
        dy = -dy
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
                // increase speed
            dx *= 1.1;
            dy *= 1.1
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER😂");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    drawPaddle()
    collisionDetection()
    drawBricks()
    drawScore()
    drawLives()
    requestAnimationFrame(draw);

}






document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchmove", touchMoveHandler, false)
    // when the person click button
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true
    }
}

// when the person relise the button
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false
    } else if (e.key == "Left" || e.key === "ArrowLeft") {
        leftPressed = false
    }
}

// mouse movement

function mouseMoveHandler(e) {
    const relativex = e.clientX - canvas.offsetLeft
    if (relativex > 0 && relativex < canvas.width) {
        paddleX = relativex - paddleWidth / 2
    }
}

// touch movment
function touchMoveHandler(e) {
    // Prevent default touch event behavior (e.g., scrolling)
    e.preventDefault();

    // Get the first touch object from the event
    const touch = e.touches[0];

    // Calculate the relative x-coordinate of the touch within the canvas
    const relativeX = touch.clientX - canvas.offsetLeft;

    // Update the paddle position based on the touch position
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// detect collison between ball and breakss
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    dx *= 1.1;
                    dy *= 1.1
                    b.status = 0;
                    score += bscore
                    if (score === brickRowCount * brickColumnCount * bscore) {
                        alert("YOU WIN, CONGRATULATIONS ")
                        document.location.reload();
                        clearInterval(interval)
                    }
                }
            }
        }
    }
}

// count score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`score:${score}`, 8, 20)
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}


draw()