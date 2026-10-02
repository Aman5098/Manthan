export const MOBILE_REGEX = /^[6-9]\d{9}$/;

export function validateEnquiry(body) {
  const errors = {};
  const { parentName, studentName, classAppliedFor, mobile, email } = body;

  if (!parentName || !parentName.trim()) errors.parentName = 'Parent name is required';
  if (!studentName || !studentName.trim()) errors.studentName = 'Student name is required';
  if (!classAppliedFor || !classAppliedFor.trim()) errors.classAppliedFor = 'Class applying for is required';

  if (!mobile || !MOBILE_REGEX.test(String(mobile).trim())) {
    errors.mobile = 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9';
  }

  if (email && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) errors.email = 'Enter a valid email address';
  }

  return errors;
}
