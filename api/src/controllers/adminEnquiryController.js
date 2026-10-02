import Enquiry from '../models/Enquiry.js';
import { pushToCRM } from '../utils/crm.js';

export async function list(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Enquiry.countDocuments(filter),
  ]);

  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function updateStatus(req, res) {
  const { status } = req.body;
  if (!['New', 'Contacted', 'Closed'].includes(status)) {
    return res.status(422).json({ error: 'Invalid status' });
  }

  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!enquiry) return res.status(404).json({ error: 'Not found' });

  res.json({ item: enquiry });
}

export async function retryCRM(req, res) {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ error: 'Not found' });

  const crmStatus = await pushToCRM(enquiry);
  enquiry.crmStatus = crmStatus;
  await enquiry.save();

  res.json({ item: enquiry });
}
