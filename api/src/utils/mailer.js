import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendEnquiryAcknowledgement(enquiry) {
  if (!enquiry.email) return;

  const transport = getTransporter();
  if (!transport) {
    console.warn('SMTP not configured; skipping acknowledgement email.');
    return;
  }

  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: enquiry.email,
      subject: 'We received your enquiry — The Manthan School',
      text: `Dear ${enquiry.parentName},\n\nThank you for reaching out to The Manthan School regarding admission for ${enquiry.studentName} (${enquiry.classAppliedFor}). Our admissions team has received your enquiry and will get in touch with you shortly.\n\nWarm regards,\nThe Manthan School`,
      html: `<p>Dear ${enquiry.parentName},</p><p>Thank you for reaching out to <strong>The Manthan School</strong> regarding admission for <strong>${enquiry.studentName}</strong> (${enquiry.classAppliedFor}). Our admissions team has received your enquiry and will get in touch with you shortly.</p><p>Warm regards,<br/>The Manthan School</p>`,
    });
  } catch (err) {
    console.error('Failed to send enquiry acknowledgement email:', err.message);
  }
}
