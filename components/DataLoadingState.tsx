export function DataLoadingState() {
  return (
    <section className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading analytics">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-36 rounded-3xl bg-white/55 shadow-[0_12px_36px_rgba(58,48,82,0.04)]" />
      ))}
    </section>
  );
}
