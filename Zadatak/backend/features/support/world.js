import {
  setWorldConstructor,
  World,
  Before,
  After
} from '@cucumber/cucumber'

import { chromium } from 'playwright'

class CustomWorld extends World {
  async openBrowser() {
    this.browser = await chromium.launch({
      headless: false
    })

    this.page = await this.browser.newPage()
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

setWorldConstructor(CustomWorld)

Before(async function () {
  await this.openBrowser()
})

After(async function () {
  await this.closeBrowser()
})