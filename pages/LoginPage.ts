import { Page, expect } from '@playwright/test';
import { labels } from '../utils/selectors';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/sign-in');
    await expect(this.page.getByLabel(labels.email)).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.page.getByLabel(labels.email).fill(email);
    await this.page.getByLabel(labels.password, { exact: true }).fill(password);
    await this.page.getByRole('button', { name: labels.submit }).click();

    
    await this.page
      .getByRole('button', { name: labels.bookScan })
      .waitFor({ state: 'visible', timeout: 30000 }); // wait for navigation to complete and the booking button to appear
  }
}
