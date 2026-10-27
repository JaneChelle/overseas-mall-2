import { defineConfig } from '@playwright/test'

const PRODUCTION_PORT = 4173
const PROJECT_PATH = '/overseas-mall-2/'

export default defineConfig({
  testDir: './tests',
  testMatch: 'production.spec.ts',
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PRODUCTION_PORT}${PROJECT_PATH}`,
    channel: 'chrome',
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npm run preview -- --port ${PRODUCTION_PORT} --strictPort`,
    url: `http://localhost:${PRODUCTION_PORT}${PROJECT_PATH}`,
    reuseExistingServer: false,
  },
})
