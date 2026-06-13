export function DataLoadingState() {
  return (
    <section className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading analytics">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-36 rounded-3xl border border-[#d6c7b0] bg-[#faf6ee]/70 shadow-[0_12px_30px_rgba(70,55,38,0.04)]" />
      ))}
    </section>
  );
}
