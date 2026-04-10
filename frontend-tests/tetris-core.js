// tetris-core.js (CommonJS 版本)
const COLS = 10;
const ROWS = 20;

function collision(shape, offsetX, offsetY, grid) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
            if (shape[i][j] !== 0) {
                const x = offsetX + j;
                const y = offsetY + i;
                if (x < 0 || x >= COLS) return true;
                if (y >= ROWS) return true;
                if (y >= 0 && grid[y][x] !== 0) return true;
            }
        }
    }
    return false;
}

function mergePiece(grid, piece) {
    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[0].length; j++) {
            if (piece.shape[i][j] !== 0) {
                const x = piece.x + j;
                const y = piece.y + i;
                if (y >= 0 && y < ROWS) grid[y][x] = 1;
            }
        }
    }
}

function clearLines(grid) {
    let linesCleared = 0;
    for (let i = ROWS - 1; i >= 0; i--) {
        if (grid[i].every(cell => cell !== 0)) {
            grid.splice(i, 1);
            grid.unshift(new Array(COLS).fill(0));
            linesCleared++;
            i++; // 继续检查同一行
        }
    }
    return linesCleared;
}

function calculateScore(linesCleared) {
    switch (linesCleared) {
        case 1: return 100;
        case 2: return 300;
        case 3: return 500;
        case 4: return 800;
        default: return 0;
    }
}

function rotateShape(shape) {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            rotated[j][rows - 1 - i] = shape[i][j];
        }
    }
    return rotated;
}

module.exports = {
    COLS,
    ROWS,
    collision,
    mergePiece,
    clearLines,
    calculateScore,
    rotateShape
};