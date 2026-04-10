// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:8081',
        headless: false,   // 设为 false 可以看到浏览器操作过程
        viewport: { width: 1280, height: 720 },
    },
    timeout: 30000,
    retries: 0,
});