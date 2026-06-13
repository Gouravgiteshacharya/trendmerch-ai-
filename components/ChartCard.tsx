type ChartCardProps = {
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
};

export function ChartCard({
  title,
  subtitle,
  badge,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <article className={`soft-card rounded-3xl p-5 sm:p-6 ${className}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold tracking-[-0.02em] text-[#363142]">{title}</h2>
          <p className="mt-1 text-xs text-[#98929f]">{subtitle}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-[#f0ebf6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#806d9e]">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </article>
  );
}
