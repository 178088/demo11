import { test, expect } from '@playwright/test';

test('full game flow', async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForSelector('#gameCanvas');

    // 等待初始化
    await page.waitForTimeout(1000);

    // 通过暴露的 API 强制得分
    const newScore = await page.evaluate(() => {
        return window.__tetrisTest.addScoreByFillingRow();
    });
    expect(newScore).toBeGreaterThan(0);

    const scoreElement = page.locator('#score');
    await expect(scoreElement).not.toHaveText('0');

    await page.click('#resetBtn');
    await expect(scoreElement).toHaveText('0');
});