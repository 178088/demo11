package com.example.demo11.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TetrisLogicTest {

    @Test
    void calculateScore_ShouldReturnCorrectPoints() {
        assertEquals(100, TetrisLogic.calculateScore(1));
        assertEquals(300, TetrisLogic.calculateScore(2));
        assertEquals(500, TetrisLogic.calculateScore(3));
        assertEquals(800, TetrisLogic.calculateScore(4));
        assertEquals(0, TetrisLogic.calculateScore(0));
        assertEquals(0, TetrisLogic.calculateScore(5));
    }

    @Test
    void clearLines_ShouldRemoveFullRows() {
        int[][] grid = new int[20][10];
        // 填满最后一行
        for (int j = 0; j < 10; j++) grid[19][j] = 1;
        int lines = TetrisLogic.clearLines(grid);
        assertEquals(1, lines);
        // 检查最后一行是否已清空
        for (int j = 0; j < 10; j++) assertEquals(0, grid[19][j]);
    }

    @Test
    void collision_ShouldDetectWallAndOverlap() {
        int[][] grid = new int[20][10];
        int[][] shape = {{1,1}};
        // 左墙碰撞
        assertTrue(TetrisLogic.collision(shape, -1, 0, grid));
        // 正常位置无碰撞
        assertFalse(TetrisLogic.collision(shape, 0, 0, grid));
        // 重叠碰撞
        grid[0][0] = 1;
        assertTrue(TetrisLogic.collision(shape, 0, 0, grid));
    }
}