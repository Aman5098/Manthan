import NewsEvent from '../models/NewsEvent.js';
import Enquiry from '../models/Enquiry.js';

export async function getStats(req, res) {
  const [totalNewsEvents, published, totalEnquiries, newEnquiries, crmFailed] = await Promise.all([
    NewsEvent.countDocuments({}),
    NewsEvent.countDocuments({ published: true }),
    Enquiry.countDocuments({}),
    Enquiry.countDocuments({ status: 'New' }),
    Enquiry.countDocuments({ crmStatus: 'Failed' }),
  ]);

  const recentEnquiries = await Enquiry.find({}).sort({ createdAt: -1 }).limit(5);

  res.json({
    totalNewsEvents,
    published,
    draft: totalNewsEvents - published,
    totalEnquiries,
    newEnquiries,
    crmFailed,
    recentEnquiries,
  });
}
