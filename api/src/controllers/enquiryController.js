import Enquiry from '../models/Enquiry.js';
import { validateEnquiry } from '../utils/validators.js';
import { pushToCRM } from '../utils/crm.js';
import { sendEnquiryAcknowledgement, sendAdmissionTeamAlert } from '../utils/mailer.js';

export async function createEnquiry(req, res) {
  const errors = validateEnquiry(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  const { parentName, studentName, classAppliedFor, mobile, email, message } = req.body;
  const cleanMobile = String(mobile).trim();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const duplicate = await Enquiry.findOne({
    mobile: cleanMobile,
    classAppliedFor: classAppliedFor.trim(),
    createdAt: { $gte: since },
  });

  if (duplicate) {
    return res.status(409).json({ error: 'We have already received your enquiry.' });
  }

  const enquiry = await Enquiry.create({
    parentName: parentName.trim(),
    studentName: studentName.trim(),
    classAppliedFor: classAppliedFor.trim(),
    mobile: cleanMobile,
    email: email?.trim() || undefined,
    message: message?.trim() || undefined,
  });

  const crmStatus = await pushToCRM(enquiry);
  enquiry.crmStatus = crmStatus;
  await enquiry.save();

  sendEnquiryAcknowledgement(enquiry);
  sendAdmissionTeamAlert(enquiry);

  res.status(201).json({ message: 'Thank you. We will get in touch with you soon.' });
}
