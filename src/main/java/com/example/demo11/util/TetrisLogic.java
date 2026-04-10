package com.example.demo11.util;

/**
 * 俄罗斯方块核心算法类（纯静态方法，便于单元测试）
 * 包含计分规则和消除行算法。
 */
public class TetrisLogic {

    // 游戏区域尺寸（与前端保持一致）
    public static final int WIDTH = 10;
    public static final int HEIGHT = 20;

    /**
     * 根据消除行数计算得分
     * @param linesCleared 消除的行数（1-4）
     * @return 得分
     */
    public static int calculateScore(int linesCleared) {
        switch (linesCleared) {
            case 1: return 100;
            case 2: return 300;
            case 3: return 500;
            case 4: return 800;
            default: return 0;
        }
    }

    /**
     * 消除满行并返回消除的行数
     * @param grid 游戏区域二维数组（20行x10列），会被原地修改
     * @return 消除的行数
     */
    public static int clearLines(int[][] grid) {
        int linesCleared = 0;
        for (int i = HEIGHT - 1; i >= 0; i--) {
            boolean full = true;
            for (int j = 0; j < WIDTH; j++) {
                if (grid[i][j] == 0) {
                    full = false;
                    break;
                }
            }
            if (full) {
                // 将上面的行下移
                for (int k = i; k > 0; k--) {
                    System.arraycopy(grid[k - 1], 0, grid[k], 0, WIDTH);
                }
                // 最上面一行清零
                for (int j = 0; j < WIDTH; j++) {
                    grid[0][j] = 0;
                }
                linesCleared++;
                i++; // 重新检查当前行（新移下来的行）
            }
        }
        return linesCleared;
    }

    /**
     * 碰撞检测（简化版，仅用于后端测试，实际前端碰撞检测更复杂）
     * @param shape 方块形状二维数组
     * @param offsetX 方块左上角X坐标
     * @param offsetY 方块左上角Y坐标
     * @param grid 当前棋盘
     * @return 是否碰撞
     */
    public static boolean collision(int[][] shape, int offsetX, int offsetY, int[][] grid) {
        for (int i = 0; i < shape.length; i++) {
            for (int j = 0; j < shape[0].length; j++) {
                if (shape[i][j] != 0) {
                    int x = offsetX + j;
                    int y = offsetY + i;
                    if (x < 0 || x >= WIDTH) return true;
                    if (y >= HEIGHT) return true;
                    if (y >= 0 && grid[y][x] != 0) return true;
                }
            }
        }
        return false;
    }
}