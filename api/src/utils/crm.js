export async function pushToCRM(enquiry) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return 'Failed';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parentName: enquiry.parentName,
        studentName: enquiry.studentName,
        classAppliedFor: enquiry.classAppliedFor,
        mobile: enquiry.mobile,
        email: enquiry.email,
        message: enquiry.message,
        createdAt: enquiry.createdAt,
      }),
      signal: controller.signal,
    });
    return res.ok ? 'Sent' : 'Failed';
  } catch {
    return 'Failed';
  } finally {
    clearTimeout(timeout);
  }
}
