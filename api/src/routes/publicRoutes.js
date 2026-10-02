import { Router } from 'express';
import { listPublished, latestPublished, getBySlug } from '../controllers/publicController.js';
import { createEnquiry } from '../controllers/enquiryController.js';
import { getActiveTheme } from '../controllers/themeController.js';

const router = Router();

router.get('/news-events', listPublished);
router.get('/news-events/latest', latestPublished);
router.get('/news-events/:slug', getBySlug);
router.post('/enquiries', createEnquiry);
router.get('/theme', getActiveTheme);

export default router;
