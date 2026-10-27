import { expect, test } from '@playwright/test'

const PROJECT_PATH = '/overseas-mall-2/'

for (const width of [1440, 390]) {
  test(`production assets and shopping work under the Pages project path at ${width}px`, async ({ page }) => {
    const errors: string[] = []
    const assetRequests: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('requestfailed', request => errors.push(`${request.url()} ${request.failure()?.errorText}`))
    page.on('request', request => {
      if (['script', 'stylesheet', 'image', 'font'].includes(request.resourceType())) {
        assetRequests.push(new URL(request.url()).pathname)
      }
    })
    page.on('response', response => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
    })
    await page.setViewportSize({ width, height: 900 })
    await page.goto('./')
    await expect(page.locator('script[type="module"]')).toHaveAttribute('src', /^\/overseas-mall-2\/assets\/.+\.js$/)
    await expect(page.locator('.product-card')).toHaveCount(12)
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(image => { image.loading = 'eager' })
      await Promise.all(Array.from(document.images).map(image => image.decode()))
      await document.fonts.ready
    })
    expect(assetRequests.length).toBeGreaterThan(12)
    expect(assetRequests.filter(path => !path.startsWith(PROJECT_PATH))).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.getByRole('link', { name: 'Form and Field home' })).toHaveAttribute('href', PROJECT_PATH)
    await page.getByRole('searchbox', { name: 'Search products' }).fill('headphones')
    await expect(page.locator('.product-card')).toHaveCount(1)
    await page.getByRole('button', { name: 'View Studio wireless headphones' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Select Oat' }).click()
    await page.getByRole('button', { name: 'Add to bag', exact: true }).click()
    await page.getByRole('button', { name: 'View bag', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Your shopping bag' })).toContainText('Oat')
    await expect(page.getByRole('dialog').locator('.cart-total')).toContainText('$129.00')
    await page.reload()
    await expect(page.getByRole('button', { name: 'Shopping bag, 1 items' })).toBeVisible()
    expect(errors).toEqual([])
  })
}
