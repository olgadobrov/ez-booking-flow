import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BookingPage } from '../pages/BookingPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { memberA, payment } from '../fixtures/testData';

test('TC-001 (POM): member booking > slot selection > card payment > begin MQ', async ({ page }) => {
  const login = new LoginPage(page);
  const booking = new BookingPage(page);
  const paymentPage = new PaymentPage(page);
  const confirm = new ConfirmationPage(page);

  await login.goto();
  await login.login(memberA.email, memberA.password);

  // Booking steps
  await booking.startBooking();
  await booking.selectScanCard();
  await booking.continue();

  await booking.selectRecommendedLocation();
  await booking.selectFirstAvailableDate();
  await booking.selectTimeSlotByIndex(1);
  await booking.continue();   // to payment

  // Prepare card details
  const cardNumber = (payment.successCard ?? '').toString().replace(/\s+/g, '');
  let exp = (payment.exp ?? '').toString();
  if (exp.length === 4 && !exp.includes('/')) exp = `${exp.slice(0,2)}/${exp.slice(2)}`;

  const cvc = (payment.cvc ?? '').toString();
  const postal = (payment.postal ?? '').toString();

  // Payment
  await paymentPage.assertVisible();
  await paymentPage.enterCardByPlaceholders(cardNumber, exp, cvc, postal);
  await paymentPage.continue();
  await paymentPage.acceptIfPrompted();

  // MQ
  await confirm.beginMQ();
});
