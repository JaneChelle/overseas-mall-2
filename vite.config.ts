import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const GITHUB_PAGES_BASE = '/overseas-mall-2/'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? GITHUB_PAGES_BASE : '/',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
}))
