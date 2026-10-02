import { Skeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <main className="bg-[var(--color-cream)] px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto mt-6 h-10 w-full" />
          <Skeleton className="mx-auto mt-6 h-4 w-2/3" />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="mt-5 h-3 w-24" />
              <Skeleton className="mt-2 h-5 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
