import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BookingPage } from '../pages/BookingPage';
import { PaymentPage } from '../pages/PaymentPage';
import { memberA, memberB } from '../fixtures/testData';

test('TC-002: Member A holds slot at payment; Member B cannot book the same time', async ({ browser }) => {
  const ctxA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const ctxB = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  const loginA = new LoginPage(pageA);
  const bookingA = new BookingPage(pageA);
  const paymentA = new PaymentPage(pageA);
  const loginB = new LoginPage(pageB);
  const bookingB = new BookingPage(pageB);

  try {
    // ---------- Member A flow ----------
    await loginA.goto();
    await loginA.login(memberA.email, memberA.password);
    const timeLabel = await bookingA.bookUntilPaymentHold();
    expect.soft(timeLabel, 'Time label not found on Member A’s first slot').toBeTruthy();

    // ---------- Member B flow ----------
    await loginB.goto();
    await loginB.login(memberB.email, memberB.password);
    await bookingB.navigateToTimeSlots();

    const sameTimeSlot = bookingB.slotByLabel(timeLabel);
    const count = await sameTimeSlot.count();

    if (count === 0) {
      test.info().annotations.push({ type: 'info', description: `Slot "${timeLabel}" not visible for Member B — PASS` });
      return;
    }

    await expect(
      sameTimeSlot.locator('input[type="radio"]:enabled'),
      `Slot "${timeLabel}" should not be selectable for Member B`
    ).toHaveCount(0);

  } finally {
    await Promise.allSettled([ctxA.close(), ctxB.close()]);
  }
});
