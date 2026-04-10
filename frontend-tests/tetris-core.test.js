const { collision, clearLines, calculateScore, rotateShape, COLS, ROWS } = require('./tetris-core');

test('collision detects left wall', () => {
    const grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    const shape = [[1,1]];
    expect(collision(shape, -1, 0, grid)).toBe(true);
});

test('collision no collision', () => {
    const grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    const shape = [[1,1]];
    expect(collision(shape, 0, 0, grid)).toBe(false);
});

test('clearLines removes full row', () => {
    let grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    grid[19] = Array(COLS).fill(1);
    const lines = clearLines(grid);
    expect(lines).toBe(1);
    expect(grid[19].every(cell => cell === 0)).toBe(true);
});

test('calculateScore returns correct points', () => {
    expect(calculateScore(1)).toBe(100);
    expect(calculateScore(2)).toBe(300);
    expect(calculateScore(3)).toBe(500);
    expect(calculateScore(4)).toBe(800);
    expect(calculateScore(0)).toBe(0);
});

test('rotateShape rotates 90 degrees clockwise', () => {
    const shape = [[1,0],[1,1]];
    const rotated = rotateShape(shape);
    expect(rotated).toEqual([[1,1],[1,0]]);
});