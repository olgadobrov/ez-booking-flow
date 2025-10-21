import { Page, expect } from '@playwright/test';
import { labels } from '../utils/selectors';

export class ConfirmationPage {
  constructor(private page: Page) {}

  async beginMQ() {
    const btn = this.page.getByRole('button', { name: labels.beginMq });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(this.page).toHaveURL(/medical-questionnaire/i);
  }
}
