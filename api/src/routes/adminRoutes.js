import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import * as newsEvents from '../controllers/adminNewsEventController.js';
import * as enquiries from '../controllers/adminEnquiryController.js';
import { getStats } from '../controllers/adminStatsController.js';
import { getActiveTheme, setActiveTheme } from '../controllers/themeController.js';

const router = Router();

router.post('/login', login);
router.get('/stats', requireAdmin, getStats);

router.get('/news-events', requireAdmin, newsEvents.list);
router.get('/news-events/:id', requireAdmin, newsEvents.getOne);
router.post('/news-events', requireAdmin, upload.single('image'), newsEvents.create);
router.put('/news-events/:id', requireAdmin, upload.single('image'), newsEvents.update);
router.delete('/news-events/:id', requireAdmin, newsEvents.remove);

router.get('/enquiries', requireAdmin, enquiries.list);
router.patch('/enquiries/:id/status', requireAdmin, enquiries.updateStatus);
router.post('/enquiries/:id/retry-crm', requireAdmin, enquiries.retryCRM);

router.get('/theme', requireAdmin, getActiveTheme);
router.put('/theme', requireAdmin, setActiveTheme);

export default router;
