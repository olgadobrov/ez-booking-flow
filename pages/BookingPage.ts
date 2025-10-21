import { Page, expect } from '@playwright/test';
import { labels, sel } from '../utils/selectors';

export class BookingPage {
  constructor(private page: Page) {}

  async startBooking() {
    await this.page.getByRole('button', { name: labels.bookScan }).click();
  }

  async selectScanCard() {
    const card = this.page.getByText(labels.scanCardText).nth(1);
    await expect(card).toBeVisible();
    await card.click();
  }

  async continue() {
    const btn = this.page.locator(sel.continueOrSubmit);
    await btn.waitFor({ state: 'visible', timeout: 10000 });
    await btn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectRecommendedLocation() {
    await this.page.getByText('AMRIC').click();
  }

  async selectFirstAvailableDate() {
    const calendar = this.page.locator('.vuecal__flex[wrap="true"]').first();
    await calendar.waitFor({ state: 'visible', timeout: 20000 });

    const enabledDays = calendar.locator(
      '.vuecal__cell:not(.vuecal__cell--disabled):not(.vuecal__cell--out-of-scope) ' +
      '.vc-day-content[role="button"][aria-disabled="false"]'
    );

    await enabledDays.first().waitFor({ state: 'visible', timeout: 20000 });
    const count = await enabledDays.count();
    const target = count >= 2 ? enabledDays.nth(1) : enabledDays.first();

    await target.click();
    await this.page.waitForTimeout(1500); // allows time grid hydration
  }

  async waitForTimeGrid() {
    await this.page.locator('.appointments__individual-appointment')
      .first()
      .waitFor({ state: 'visible', timeout: 20000 });
  }


 async selectTimeSlotByIndex(index: number): Promise<string> {
    const visibleSlots = this.page.locator('.appointments__individual-appointment:visible');
    const slot = visibleSlots.nth(index);
    const label = slot.locator('div.b3--bold');
    const text = (await label.innerText()).trim();
    await slot.locator('label').click();
    return text;
  }

  slotByLabel(label: string) {
    return this.page
      .locator('.appointments__individual-appointment:visible')
      .filter({ has: this.page.locator(`div.b3--bold:text-is("${label}")`) });
  }

  async navigateToTimeSlots() {
    await this.startBooking();
    await this.selectScanCard();
    await this.continue();
    await this.selectRecommendedLocation();
    await this.selectFirstAvailableDate();
    await this.waitForTimeGrid();
  }

  async bookUntilPaymentHold(): Promise<string> {
    await this.startBooking();
    await this.selectScanCard();
    await this.continue();
    await this.selectRecommendedLocation();
    await this.selectFirstAvailableDate();
    await this.waitForTimeGrid();
    const selectedSlotLabel = await this.selectTimeSlotByIndex(0);
    await this.continue();
    return selectedSlotLabel;
  }
}