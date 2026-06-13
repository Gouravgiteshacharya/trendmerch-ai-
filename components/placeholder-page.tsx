import { ChartCard } from "@/components/ChartCard";
import { Icon, type IconName } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: IconName;
  accent: string;
  highlights: { label: string; value: string }[];
};

export function PlaceholderPage({
  title,
  description,
  icon,
  accent,
  highlights,
}: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <section className="grid gap-4 sm:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.label} className="soft-card rounded-3xl p-5">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#99929e]">
              {item.label}
            </p>
            <p className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#332f40]">
              {item.value}
            </p>
          </div>
        ))}
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <ChartCard
          title={`${title} workspace`}
          subtitle="Mock intelligence view · ready for data integration"
          badge="Preview"
        >
          <div
            className="subtle-grid flex min-h-[360px] items-center justify-center rounded-2xl"
            style={{ backgroundColor: accent }}
          >
            <div className="max-w-sm px-6 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/75 text-[#76628f] shadow-sm">
                <Icon name={icon} className="size-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold text-[#3d3748]">{title} intelligence</h2>
              <p className="mt-2 text-sm leading-6 text-[#7d7482]">
                This UI shell is prepared for live merchandising data, filters, and AI-generated
                actions in the next implementation phase.
              </p>
            </div>
          </div>
        </ChartCard>
        <div className="soft-card rounded-3xl p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9a86b2]">
            Suggested focus
          </p>
          <h2 className="mt-3 text-xl font-bold tracking-[-0.03em] text-[#342f40]">
            Make the next decision with confidence.
          </h2>
          <div className="mt-7 space-y-5">
            {["Review the strongest signal", "Compare week-over-week change", "Share action with the team"].map(
              (item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eee8f5] text-xs font-bold text-[#79669a]">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#686270]">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
