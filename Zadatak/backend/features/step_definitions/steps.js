import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

Given('otvorim stranicu {string}', async function (url) {
  await this.page.goto(url)
})

When('unesem username {string} i email {string} i lozinku {string}', async function (username,email, password) {
  // pokriva i login i adminlogin (oba imaju q-input)
  const inputs = this.page.locator('.q-input input')
  await inputs.nth(0).fill(username)
  await inputs.nth(1).fill(email)
  await inputs.nth(2).fill(password)
})

When('unesem email {string} i lozinku {string}', async function (email, password) {
  // pokriva i login i adminlogin (oba imaju q-input)
  const inputs = this.page.locator('.q-input input')
  await inputs.nth(0).fill(email)
  await inputs.nth(1).fill(password)
  await this.page.waitForTimeout(300);
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

Then('rezerviram', async function () {
  const badge = this.page.locator('.q-card .q-badge').first().click();

});

Then('vidim rezervaciju', async function () {
  const badge = this.page.locator('.q-card .q-badge').first();

  await expect(badge).toHaveClass(/bg-red-5/);
});

Then('oslobodim', async function () {
  const badge = this.page.locator('.q-card .q-badge').first().click();

  
});

Then('vidim slobodno', async function () {
  const badge = this.page.locator('.q-card .q-badge').first();

  await expect(badge).toHaveClass(/bg-green-5/);
});

Then('vidim korisnike', async function () {
  const korisnici = this.page.locator('.q-table').first();
  await expect(korisnici).toBeVisible();

  
});

Then('promjena uloge', async function () {

  const row = this.page.locator('.q-table tbody tr').nth(1);
  const select = row.locator('.q-select');

  // IMPORTANT: set dialog handler BEFORE action
  this.page.once('dialog', async dialog => {
    await dialog.accept();
  });

  await select.click();
  await this.page.getByRole('option', { name: 'student' }).click();
});

Then('obriši korisnika', async function () {

  const row = this.page.locator('.q-table tbody tr').nth(2);

  // handle confirm dialog BEFORE click
  this.page.once('dialog', async dialog => {
    await dialog.accept();
  });

  await row.locator('[data-test="delete-user"]').click();
});
