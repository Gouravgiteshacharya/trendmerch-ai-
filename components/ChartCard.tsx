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
          <h2 className="editorial-serif text-[19px] font-semibold tracking-[-0.02em] text-[#40362c]">{title}</h2>
          <p className="mt-1 text-xs text-[#887b6e]">{subtitle}</p>
        </div>
        {badge ? (
          <span className="rounded-full border border-[#d3c6ae] bg-[#eee8dc] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#697052]">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </article>
  );
}
