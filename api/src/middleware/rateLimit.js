import rateLimit from 'express-rate-limit';

export const enquiryRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many enquiries submitted. Please try again in a minute.' },
});
