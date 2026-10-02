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

export async function sendAdmissionTeamAlert(enquiry) {
  const recipients = process.env.ADMISSION_TEAM_EMAIL;
  if (!recipients) return;

  const transport = getTransporter();
  if (!transport) {
    console.warn('SMTP not configured; skipping admission team alert.');
    return;
  }

  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: recipients,
      subject: `New Enquiry: ${enquiry.studentName} (${enquiry.classAppliedFor})`,
      text: `A new admission enquiry has been received.\n\nParent: ${enquiry.parentName}\nStudent: ${enquiry.studentName}\nClass applied for: ${enquiry.classAppliedFor}\nMobile: ${enquiry.mobile}\nEmail: ${enquiry.email || '-'}\nMessage: ${enquiry.message || '-'}\n\nView it in the admin panel to follow up.`,
      html: `<p>A new admission enquiry has been received.</p><table cellpadding="6" style="border-collapse:collapse"><tr><td><strong>Parent</strong></td><td>${enquiry.parentName}</td></tr><tr><td><strong>Student</strong></td><td>${enquiry.studentName}</td></tr><tr><td><strong>Class applied for</strong></td><td>${enquiry.classAppliedFor}</td></tr><tr><td><strong>Mobile</strong></td><td>${enquiry.mobile}</td></tr><tr><td><strong>Email</strong></td><td>${enquiry.email || '-'}</td></tr><tr><td><strong>Message</strong></td><td>${enquiry.message || '-'}</td></tr></table><p>View it in the admin panel to follow up.</p>`,
    });
  } catch (err) {
    console.error('Failed to send admission team alert email:', err.message);
  }
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
