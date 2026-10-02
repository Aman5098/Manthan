'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { submitEnquiry } from '@/lib/api';

const MOBILE_REGEX = /^[6-9]\d{9}$/;

const initialValues = {
  parentName: '',
  studentName: '',
  classAppliedFor: '',
  mobile: '',
  email: '',
  message: '',
};

const validationSchema = Yup.object({
  parentName: Yup.string().trim().required('Parent name is required'),
  studentName: Yup.string().trim().required('Student name is required'),
  classAppliedFor: Yup.string().trim().required('Class applying for is required'),
  mobile: Yup.string()
    .trim()
    .matches(MOBILE_REGEX, 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9')
    .required('Mobile number is required'),
  email: Yup.string().trim().email('Enter a valid email address'),
  message: Yup.string(),
});

export function EnquiryForm({ variant = 'default' }) {
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      setStatus('submitting');
      setServerError('');

      const result = await submitEnquiry({
        parentName: values.parentName,
        studentName: values.studentName,
        classAppliedFor: values.classAppliedFor,
        mobile: values.mobile,
        email: values.email || undefined,
        message: values.message || undefined,
      });

      if (result.ok) {
        setStatus('success');
        setSuccessMessage(result.message);
        resetForm();
      } else {
        setStatus('error');
        if (result.error) setServerError(result.error);
      }
    },
  });

  const isPlayful = variant === 'playful';

  if (status === 'success') {
    return (
      <div className="py-6 text-center">
        <p className={isPlayful ? 'font-display text-xl text-[#e4136f]' : 'font-display text-xl text-[var(--color-ink)]'}>
          Thank you.
        </p>
        <div className={isPlayful ? 'mx-auto my-4 h-1 w-16 rounded-full bg-[#e4136f]' : 'gold-rule mx-auto my-4'} />
        <p className={isPlayful ? 'text-sm text-slate-600' : 'text-sm text-[var(--color-ink-soft)]'}>
          {successMessage}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className={
            isPlayful
              ? 'mt-6 border-b border-[#e4136f] pb-0.5 text-sm font-semibold text-[#e4136f]'
              : 'eyebrow mt-6 border-b border-[var(--color-ink)] pb-0.5 text-[var(--color-ink)]'
          }
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
      {serverError && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="parentName" label="Parent Name" formik={formik} variant={variant} />
        <Field name="mobile" label="Mobile Number" formik={formik} inputMode="numeric" maxLength={10} variant={variant} />
      </div>

      {isPlayful ? (
        <>
          <Field name="email" label="Email Address" formik={formik} type="email" variant={variant} />
          <Field name="studentName" label="Child's Date of Birth" formik={formik} variant={variant} />
          <Field name="classAppliedFor" label="Programme of Interest" formik={formik} variant={variant} />

          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300" />
            I agree to be contacted about admissions at the Noida campus.
          </label>
        </>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="studentName" label="Student Name" formik={formik} />
            <Field name="classAppliedFor" label="Class Applying For" formik={formik} />
          </div>

          <Field name="email" label="Email Address (optional)" formik={formik} type="email" />

          <div>
            <label className="eyebrow mb-2 block text-[var(--color-ink-soft)]">Message (optional)</label>
            <textarea
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-0 py-2 text-[var(--color-ink)] focus:border-[var(--color-gold)] focus:outline-none"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={
          isPlayful
            ? 'w-full rounded-xl bg-[#e4136f] py-4 text-sm font-bold text-white transition hover:bg-[#c71062] disabled:opacity-50'
            : 'eyebrow w-full border border-[var(--color-ink)] bg-[var(--color-ink)] py-4 text-[var(--color-cream)] transition hover:bg-transparent hover:text-[var(--color-ink)] disabled:opacity-50'
        }
      >
        {status === 'submitting' ? 'Submitting...' : 'Book My Visit'}
      </button>
    </form>
  );
}

function Field({ name, label, formik, type = 'text', inputMode, maxLength, variant = 'default' }) {
  const error = formik.touched[name] && formik.errors[name];
  const isPlayful = variant === 'playful';

  return (
    <div>
      <label className={isPlayful ? 'mb-2 block text-sm font-semibold text-slate-700' : 'eyebrow mb-2 block text-[var(--color-ink-soft)]'}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={
          isPlayful
            ? `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none ${
                error ? 'border-red-400' : 'border-slate-300 focus:border-[#e4136f]'
              }`
            : `w-full border-0 border-b bg-transparent px-0 py-2 text-[var(--color-ink)] focus:outline-none ${
                error ? 'border-red-400' : 'border-[var(--color-line)] focus:border-[var(--color-gold)]'
              }`
        }
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
