import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BookingPage } from '../pages/BookingPage';
import { PaymentPage } from '../pages/PaymentPage';
import { memberA } from '../fixtures/testData';

test('TC-003: Apple Pay is offered on WebKit (macOS) and not on Chromium/Firefox', async ({ page, browserName }) => {
    const login = new LoginPage(page);
    const booking = new BookingPage(page);
    const payment = new PaymentPage(page);

    // Use centralized credentials
    await login.goto();
    await login.login(memberA.email, memberA.password);

    // Booking steps
    await booking.startBooking();
    await booking.selectScanCard();
    await booking.continue();

    await booking.selectRecommendedLocation();
    await booking.selectFirstAvailableDate();
    await booking.selectTimeSlotByIndex(2);
    await booking.continue();

    await payment.assertVisible();

    // Small pause for UI rendering
    await page.waitForTimeout(800);

    const applePayVisible = await payment.isApplePayVisible();

    if (browserName === 'webkit') {
      expect(applePayVisible, 'Apple Pay should be visible on WebKit/macOS').toBeTruthy();
    } else {
      expect(applePayVisible, 'Apple Pay should not be visible on Chromium/Firefox').toBeFalsy();
    }
  });
