import Link from 'next/link';
import { getLatestNewsEvents, getActiveTheme } from '@/lib/api';
import { NewsEventCard } from '@/components/NewsEventCard';
import { EnquiryForm } from '@/components/EnquiryForm';
import { PlayfulAdmissionsSection } from '@/components/PlayfulAdmissionsSection';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [latest, theme] = await Promise.all([getLatestNewsEvents(), getActiveTheme()]);

  const isPlayful = theme === 'playful';

  return (
    <main className={isPlayful ? 'theme-playful' : undefined}>
      {isPlayful ? (
        <section className="bg-[#0f1b3d] px-6 py-28 text-center sm:px-10 sm:py-36">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#e4136f]">The Manthan School</p>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-4xl leading-[1.15] text-white sm:text-5xl lg:text-6xl" style={{ fontWeight: 800 }}>
            A little world of big beginnings
          </h1>
          <Link
            href="/#enquiry"
            className="mt-10 inline-block rounded-full bg-[#e4136f] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#c71062]"
          >
            Book a Campus Visit
          </Link>
        </section>
      ) : (
        <section className="bg-[var(--color-cream)] px-6 py-28 text-center sm:px-10 sm:py-36">
          <p className="eyebrow text-[var(--color-gold)]">The Manthan School</p>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-4xl leading-[1.15] text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
            A little world of <em className="italic">big beginnings</em>
          </h1>
          <div className="gold-rule mx-auto mt-8" />
        </section>
      )}

      {!isPlayful && <section className="hairline" />}

      <section className={isPlayful ? 'bg-white px-6 py-24 sm:px-10' : 'bg-[var(--color-cream)] px-6 py-24 sm:px-10'}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={isPlayful ? 'text-sm font-bold uppercase tracking-[0.22em] text-[#e4136f]' : 'eyebrow text-[var(--color-gold)]'}>
                {isPlayful ? 'The Event Diary' : 'The Journal'}
              </p>
              <h2 className={isPlayful ? 'font-display mt-3 text-3xl text-[#0f1b3d] sm:text-4xl' : 'font-display mt-3 text-3xl text-[var(--color-ink)] sm:text-4xl'} style={isPlayful ? { fontWeight: 800 } : undefined}>
                News &amp; Events
              </h2>
            </div>
            <Link
              href="/news-events"
              className={
                isPlayful
                  ? 'rounded-full bg-[#0f1b3d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#182852]'
                  : 'eyebrow border-b border-[var(--color-ink)] pb-1 text-[var(--color-ink)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]'
              }
            >
              View all &rarr;
            </Link>
          </div>

          <div className={isPlayful ? 'mt-16 grid grid-cols-1 gap-8 md:grid-cols-3' : 'mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3'}>
            {latest.map((item, index) => (
              <NewsEventCard key={item._id} item={item} theme={theme} priority={index === 0} />
            ))}
          </div>
        </div>
      </section>

      {!isPlayful && <section className="hairline" />}

      {theme === 'playful' ? (
        <PlayfulAdmissionsSection />
      ) : (
        <section className="bg-[var(--color-ink)] px-6 py-24 sm:px-10" id="enquiry">
          <div className="mx-auto grid max-w-5xl items-start gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="text-[var(--color-cream)]">
              <p className="eyebrow text-[var(--color-gold-light)]">Admissions</p>
              <h2 className="font-display mt-4 text-3xl leading-tight sm:text-4xl">
                Book a campus visit
              </h2>
              <div className="gold-rule mt-6" />
              <p className="mt-6 max-w-sm text-white/70">
                Share a few details about your child, and our admissions team will be in touch to
                arrange a visit at a time that suits you.
              </p>
            </div>

            <div className="frame-corners bg-[var(--color-cream)] p-8 sm:p-10">
              <p className="eyebrow text-[var(--color-gold)]">Tell us about your child</p>
              <div className="mt-6">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
