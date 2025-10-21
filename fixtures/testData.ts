export const memberA = {
  email: process.env.MEMBER_A_EMAIL ?? 'your-member-a-email@example.com',
  password: process.env.MEMBER_A_PASSWORD ?? 'your-member-a-password'
};

export const memberB = {
  email: process.env.MEMBER_B_EMAIL && process.env.MEMBER_B_EMAIL.trim().length > 0
    ? process.env.MEMBER_B_EMAIL
    : (process.env.MEMBER_A_EMAIL ?? 'your-member-b-email@example.com'),
  password: process.env.MEMBER_B_PASSWORD && process.env.MEMBER_B_PASSWORD.trim().length > 0
    ? process.env.MEMBER_B_PASSWORD
    : (process.env.MEMBER_A_PASSWORD ?? 'your-member-a-password')
};

export const bookingInput = {
  scanLabel: process.env.BOOKING_SCAN_LABEL ?? 'MRI Scan with Spine',
  locationLabel: process.env.BOOKING_LOCATION_LABEL ?? 'AMRIC New York, city, NY, 10022 (Recommended)',
  slotId: process.env.BOOKING_SLOT_ID || undefined
};

export const payment = {
  successCard: process.env.CARD_NUMBER ?? '4242 4242 4242 4242',
  exp: process.env.CARD_EXP ?? '1134',
  cvc: process.env.CARD_CVC ?? '444',
  postal: process.env.CARD_POSTAL ?? '10001'
};
