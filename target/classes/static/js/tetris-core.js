// js/tetris-core.js
// 俄罗斯方块纯函数核心算法（可被Jest测试）

export const COLS = 10;
export const ROWS = 20;

/**
 * 碰撞检测
 * @param {number[][]} shape 方块形状矩阵
 * @param {number} offsetX 方块左上角x坐标
 * @param {number} offsetY 方块左上角y坐标
 * @param {number[][]} grid 游戏区域（ROWS x COLS）
 * @returns {boolean}
 */
export function collision(shape, offsetX, offsetY, grid) {
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

/**
 * 将当前方块固定到网格中
 * @param {number[][]} grid 游戏区域（会被修改）
 * @param {Object} piece 当前方块 { shape, x, y }
 */
export function mergePiece(grid, piece) {
    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[0].length; j++) {
            if (piece.shape[i][j] !== 0) {
                const x = piece.x + j;
                const y = piece.y + i;
                if (y >= 0 && y < ROWS) {
                    grid[y][x] = 1;
                }
            }
        }
    }
}

/**
 * 消除满行并返回消除的行数
 * @param {number[][]} grid 游戏区域（会被修改）
 * @returns {number} 消除的行数
 */
export function clearLines(grid) {
    let linesCleared = 0;
    for (let i = ROWS - 1; i >= 0; i--) {
        if (grid[i].every(cell => cell !== 0)) {
            // 移除第i行，并在顶部插入新空行
            grid.splice(i, 1);
            grid.unshift(new Array(COLS).fill(0));
            linesCleared++;
            i++; // 继续检查同一索引（原上一行）
        }
    }
    return linesCleared;
}

/**
 * 根据消除行数计算得分（与后端一致）
 * @param {number} linesCleared
 * @returns {number}
 */
export function calculateScore(linesCleared) {
    switch (linesCleared) {
        case 1: return 100;
        case 2: return 300;
        case 3: return 500;
        case 4: return 800;
        default: return 0;
    }
}

/**
 * 旋转方块（顺时针90度）
 * @param {number[][]} shape
 * @returns {number[][]} 新形状
 */
export function rotateShape(shape) {
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