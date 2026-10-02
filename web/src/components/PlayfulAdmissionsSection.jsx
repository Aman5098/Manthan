'use client';

import { useState } from 'react';
import { EnquiryForm } from '@/components/EnquiryForm';

const FAQS = [
  {
    question: 'What is the minimum age for Nursery admission?',
    answer: 'A child must turn 3 years old on or before 31st March of the admission year.',
  },
  {
    question: 'What are the school timings for each programme?',
    answer: 'Toddlers and Pre-Nursery run 9 AM–12 PM; Nursery and Kindergarten run 8:30 AM–1:30 PM.',
  },
  {
    question: 'What is the fee structure?',
    answer: 'Fees vary by programme — download the brochure or ask our admissions team for the current fee card.',
  },
  {
    question: 'How many children are in a group and how many adults?',
    answer: 'Each group has a maximum of 16 children with one teacher and one caregiver.',
  },
  {
    question: 'Is transport available and which sectors does it cover?',
    answer: 'Yes, our buses cover Noida and Greater Noida West; share your sector and we will confirm the route.',
  },
  {
    question: 'What does my child need to bring each day?',
    answer: 'Just a school bag, water bottle and tiffin — we provide all learning materials.',
  },
  {
    question: 'How do you settle a child who cries in the first week?',
    answer: 'Our settling-in week pairs every new child with a dedicated caregiver and lets parents stay close by.',
  },
  {
    question: 'Is The Manthan School affiliated to CBSE?',
    answer: 'Yes, The Manthan School follows the CBSE curriculum framework from Nursery onward.',
  },
];

export function PlayfulAdmissionsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative overflow-hidden bg-[#e4136f] px-6 py-20 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-white sm:text-4xl" style={{ fontWeight: 800 }}>
            Questions Parents Ask
          </h2>

          <div className="mt-8 divide-y divide-white/25">
            {FAQS.map(({ question, answer }, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={question} className="py-4">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 text-left text-white"
                  >
                    <span className="text-base font-semibold">{question}</span>
                    <span className="text-xl leading-none">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <p className="mt-2 text-sm text-white/80">{answer}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl text-white sm:text-4xl" style={{ fontWeight: 800 }}>
            Book a Campus Visit
          </h2>

          <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl sm:p-10">
            <p className="text-xl font-extrabold text-[#e4136f]">Tell us about your child</p>
            <p className="mt-2 text-sm text-slate-500">
              Five fields. We map age to programme, so you do not have to guess.
            </p>

            <div className="mt-6">
              <EnquiryForm variant="playful" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
