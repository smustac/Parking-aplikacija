import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

Given('otvorim stranicu {string}', async function (url) {
  await this.page.goto(url)
})

When('unesem username {string}', async function (username) {
  const inputs = this.page.locator('.q-input input')
  await inputs.nth(0).fill(username)
})

When('unesem email {string} i lozinku {string}', async function (email, password) {
  // pokriva i login i adminlogin (oba imaju q-input)
  const inputs = this.page.locator('.q-input input')
  await inputs.nth(0).fill(email)
  await inputs.nth(1).fill(password)
})



When('kliknem gumb {string}', async function (label) {
  await this.page.locator(`button:has-text("${label}")`).first().click()
})

Then('trebam biti preusmjeren na {string}', async function (path) {
  await this.page.waitForURL(`**${path}`, { timeout: 5000 })
  expect(this.page.url()).toContain(path)
})

Then('vidim poruku {string}', async function (message) {
  await expect(this.page.locator('body')).toContainText(message, { timeout: 5000 })
})

Then('vidim parking mjesta na stranici', async function () {
  await this.page.waitForSelector('.q-card', { timeout: 5000 })
  const spots = await this.page.locator('.q-card').count()
  expect(spots).toBeGreaterThan(0)
})