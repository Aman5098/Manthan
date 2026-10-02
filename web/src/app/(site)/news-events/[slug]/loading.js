import { Skeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <main className="bg-[var(--color-cream)] px-6 py-24 sm:px-10">
      <article className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-xl text-center">
          <Skeleton className="mx-auto h-3 w-40" />
          <Skeleton className="mx-auto mt-4 h-10 w-full" />
          <Skeleton className="mx-auto mt-2 h-10 w-2/3" />
        </div>

        <Skeleton className="mt-14 aspect-video w-full" />

        <div className="mx-auto mt-14 max-w-none space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </article>
    </main>
  );
}
