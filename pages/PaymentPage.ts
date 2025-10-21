import { Page, expect } from '@playwright/test';
import { sel } from '../utils/selectors';

export class PaymentPage {
  constructor(private page: Page) {}

  async assertVisible() {
    await this.page.waitForLoadState('domcontentloaded');
    // Assert either the Stripe iframe or the Continue button is visible
    const stripeIframe = this.page.locator('iframe[src*="js.stripe.com"]').first();
    if (await stripeIframe.count()) {
      await expect(stripeIframe).toBeVisible();
    } else {
      await expect(this.page.locator(sel.continueOrSubmit)).toBeVisible();
    }
  }

// Enter card details by locating input fields via their placeholders
async enterCardByPlaceholders(cardNumber: string, exp: string, cvc: string, zip: string) {
  const clickAndType = async (selector: string, value: string, emulateTyping = false): Promise<boolean> => {
    const tryInFrame = async (frame: any) => {
      const loc = frame.locator(selector).first();
      if (!(await loc.count())) return false;
      await loc.waitFor({ state: 'visible', timeout: 7000 }).catch(() => {});
      if (!(await loc.isVisible().catch(() => false))) return false;
      await loc.scrollIntoViewIfNeeded().catch(() => {});
      await loc.click({ timeout: 2000 }).catch(() => {});
      await loc.fill('').catch(() => {});
      await frame.waitForTimeout(150);
      try {
        if (emulateTyping) await loc.type(value, { delay: 35 });
        else await loc.fill(value);
        await frame.waitForTimeout(120);
        return true;
      } catch {
        try { await loc.type(value, { delay: 30 }).catch(() => {}); return true; }
        catch { return false; }
      }
    };

    if (await tryInFrame(this.page.mainFrame())) return true;
    for (const f of this.page.frames()) if (await tryInFrame(f)) return true;
    return false;
  };

  const out = { card: false, exp: false, cvc: false, zip: false };

  // timeout before card data entry
  await this.page.waitForTimeout(200);
  out.card = await clickAndType('.p-CardNumberInput input, input[placeholder="Card number"]', cardNumber, true);
  await this.page.waitForTimeout(120);
  out.exp  = await clickAndType('input[name="expiry"], input[placeholder="MM / YY"]', exp);
  await this.page.waitForTimeout(80);
  out.cvc  = await clickAndType('input[name="cvc"], input[placeholder="CVC"]', cvc);
  await this.page.waitForTimeout(80);
  out.zip  = await clickAndType('input[name="postalCode"], input[name="postal"], input[name="zip"]', zip);

  return out;
}

  async continue() {
    const btn = this.page.locator(sel.continueOrSubmit);
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled({ timeout: 15000 });
    await btn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async acceptIfPrompted() {
    const accept = this.page.getByRole('button', { name: /accept/i });
    if (await accept.isVisible().catch(() => false)) {
      await accept.click();
    }
  }

  // Detect whether Apple Pay is offered in the list of payment methods
async isApplePayVisible(): Promise<boolean> {
  const mainApple = this.page.locator('.p-PaymentAccordionButtonText', { hasText: /Apple Pay/i }).first();
  if (await mainApple.count()) {
    if (await mainApple.isVisible().catch(() => false)) return true;
  }

  for (const f of this.page.frames()) {
    if (!/js\.stripe\.com/i.test(f.url() || '')) continue;
    const inFrame = f.locator('.p-PaymentAccordionButtonText', { hasText: /Apple Pay/i }).first();
    if ((await inFrame.count()) && (await inFrame.isVisible().catch(() => false))) {
      return true;
    }
  }

  return false;
}
}
