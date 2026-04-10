// game.js
import { COLS, ROWS, collision, mergePiece, clearLines, calculateScore, rotateShape } from './js/tetris-core.js';

const BLOCK_SIZE = 25;
const TICK_INTERVAL = 600;

let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let nextCanvas = document.getElementById('nextCanvas');
let nextCtx = nextCanvas.getContext('2d');

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

let grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let currentPiece = null;
let nextPiece = null;
let score = 0;
let gameLoop = null;
let gameActive = true;

const PIECES = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[0,1,1],[1,1,0]],
    [[1,1,0],[0,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]]
];

function randomPiece() {
    let shape = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
        shape: shape.map(row => [...row]),
        x: Math.floor((COLS - shape[0].length) / 2),
        y: 0
    };
}

function initGame() {
    grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    score = 0;
    updateScoreUI();
    nextPiece = randomPiece();
    spawnNewPiece();
    gameActive = true;
    draw();
}

function spawnNewPiece() {
    if (nextPiece) {
        currentPiece = nextPiece;
    } else {
        currentPiece = randomPiece();
    }
    nextPiece = randomPiece();
    drawNext();
    if (collision(currentPiece.shape, currentPiece.x, currentPiece.y, grid)) {
        gameActive = false;
        clearInterval(gameLoop);
        alert("游戏结束！得分：" + score);
        submitScore(score);
    }
}

function moveLeft() {
    if (!gameActive) return;
    if (!collision(currentPiece.shape, currentPiece.x - 1, currentPiece.y, grid)) {
        currentPiece.x--;
        draw();
    }
}

function moveRight() {
    if (!gameActive) return;
    if (!collision(currentPiece.shape, currentPiece.x + 1, currentPiece.y, grid)) {
        currentPiece.x++;
        draw();
    }
}

function moveDown() {
    if (!gameActive) return;
    if (!collision(currentPiece.shape, currentPiece.x, currentPiece.y + 1, grid)) {
        currentPiece.y++;
        draw();
    } else {
        mergePiece(grid, currentPiece);
        const lines = clearLines(grid);
        if (lines > 0) {
            score += calculateScore(lines);
            updateScoreUI();
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "score", score: score }));
            }
        }
        spawnNewPiece();
        draw();
    }
}

function rotatePiece() {
    if (!gameActive) return;
    const rotatedShape = rotateShape(currentPiece.shape);
    if (!collision(rotatedShape, currentPiece.x, currentPiece.y, grid)) {
        currentPiece.shape = rotatedShape;
        draw();
    }
}

function hardDrop() {
    if (!gameActive) return;
    while (!collision(currentPiece.shape, currentPiece.x, currentPiece.y + 1, grid)) {
        currentPiece.y++;
    }
    mergePiece(grid, currentPiece);
    const lines = clearLines(grid);
    if (lines > 0) {
        score += calculateScore(lines);
        updateScoreUI();
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "score", score: score }));
        }
    }
    spawnNewPiece();
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (grid[i][j] !== 0) {
                ctx.fillStyle = "#3498db";
                ctx.fillRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        }
    }
    if (currentPiece) {
        for (let i = 0; i < currentPiece.shape.length; i++) {
            for (let j = 0; j < currentPiece.shape[0].length; j++) {
                if (currentPiece.shape[i][j] !== 0) {
                    ctx.fillStyle = "#f1c40f";
                    ctx.fillRect((currentPiece.x + j) * BLOCK_SIZE, (currentPiece.y + i) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                }
            }
        }
    }
}

function drawNext() {
    nextCtx.clearRect(0, 0, 120, 120);
    if (nextPiece) {
        const shape = nextPiece.shape;
        const blockSize = 120 / shape.length;
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[0].length; j++) {
                if (shape[i][j]) {
                    nextCtx.fillStyle = "#e67e22";
                    nextCtx.fillRect(j * blockSize, i * blockSize, blockSize - 2, blockSize - 2);
                }
            }
        }
    }
}

function updateScoreUI() {
    document.getElementById('score').innerText = score;
}

// 键盘控制（无节流，但阻止页面滚动）
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft();
    else if (e.key === 'ArrowRight') moveRight();
    else if (e.key === 'ArrowDown') moveDown();
    else if (e.key === 'ArrowUp') rotatePiece();
    else if (e.key === ' ') {
        e.preventDefault();
        hardDrop();
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    clearInterval(gameLoop);
    initGame();
    gameLoop = setInterval(() => { if (gameActive) moveDown(); }, TICK_INTERVAL);
});

let ws = new WebSocket("ws://localhost:8081/game");
ws.onopen = () => console.log("WebSocket 连接成功");
ws.onmessage = (event) => {
    try {
        let data = JSON.parse(event.data);
        if (data.type === "score") console.log("广播分数:", data.score);
    } catch(e) {}
};

function submitScore(finalScore) {
    fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player: "玩家", score: finalScore })
    }).then(() => loadLeaderboard());
}

function loadLeaderboard() {
    fetch("/api/leaderboard")
        .then(res => res.json())
        .then(data => {
            let ul = document.getElementById("rankList");
            ul.innerHTML = "";
            data.slice(0, 10).forEach(entry => {
                let li = document.createElement("li");
                li.textContent = `${entry.player}: ${entry.score}`;
                ul.appendChild(li);
            });
        });
}

initGame();
gameLoop = setInterval(() => { if (gameActive) moveDown(); }, TICK_INTERVAL);
loadLeaderboard();
// ========== 暴露给自动化测试的全局 API ==========
window.__tetrisTest = {
    getScore: () => score,
    addScoreByFillingRow: () => {
        // 强制填满最后一行
        for (let j = 0; j < COLS; j++) {
            if (grid[ROWS-1][j] === 0) grid[ROWS-1][j] = 1;
        }
        const lines = clearLines(grid);
        if (lines > 0) {
            score += calculateScore(lines);
            updateScoreUI();
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "score", score: score }));
            }
        }
        return score;
    },
    resetGame: () => {
        clearInterval(gameLoop);
        initGame();
        gameLoop = setInterval(() => { if (gameActive) moveDown(); }, TICK_INTERVAL);
    }
};