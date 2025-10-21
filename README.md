# Ezra Booking Flow — Playwright E2E (POM)

This repository automates the **3 highest-risk/impact** test cases for Ezra’s booking flow:

1. **TC-001** — Member self-booking > card payment > begin Medical Questionnaire (MQ)  
2. **TC-002** — Double-booking prevention (concurrent slot contention: Member A vs Member B)  
3. **TC-003** — Apple Pay gating: visible for Mac/WebKit users (ensures key payment method is offered)  

All tests are written in **TypeScript**, use the **Page Object Model**, and run against **staging** with **Stripe test data**.

---

**1) Prerequisites**

```bash
# Node.js ≥ 18 (tested on Node 22.x)
# node -v
# npm or pnpm
# git --version
# Network access to staging


**2) Setup / Installation**
https://playwright.dev/docs/intro

# Clone the repository
git clone https://github.com/olgadobrov/ez-booking-flow.git

cd ez-booking-flow

# Install dependencies
npm ci

# Install Playwright & browsers
npm install -D @playwright/test
npx playwright install


Running Tests

npx playwright test               # run all tests
npx playwright test --headed      # run with browser UI
npx playwright test --debug       # debug mode
npx playwright show-report        # view test report
npx playwright test tests/booking.happypath.spec.ts # run specific test file

**3) Fixtures / Test Data**
# Update testData.ts with member credentials
# Path: /fixtures/testData.ts
# Example values:
MEMBER_A_EMAIL = 'your-member-a-email@example.com';
MEMBER_A_PASSWORD = 'your-member-a-password';

MEMBER_B_EMAIL = 'your-member-b-email@example.com';
MEMBER_B_PASSWORD = 'your-member-b-password';


Security & Privacy:
Use staging accounts only.
Do not put real PHI/PII or real payment data in tests
Stripe test cards are used (e.g., 4242 4242 4242 4242)
This submission **prioritizes safety (HIPAA/PHI), payment reliability, and booking integrity** with clear, risk-based coverage.  
The provided **Playwright POM** repo is designed to scale with minimal flakiness.


Future Work:
Refactor the code to use Playwright test fixtures for better test data management.
Continue implementing P1-P2 test cases for full booking flow coverage.
Extend test coverage to include edge cases and negative scenarios.
Visual regression (Playwright snapshots) for confirmation & errors.
