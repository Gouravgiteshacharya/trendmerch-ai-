import { ChartCard } from "@/components/ChartCard";
import { MetricBars } from "@/components/MetricBars";
import { PageHeader } from "@/components/PageHeader";
import { fashionRetailData } from "@/data/fashion-retail-data";
import { stateIntelligence } from "@/lib/intelligence";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function GeoDemandPage() {
  const states = stateIntelligence(fashionRetailData);
  const topStates = states.slice(0, 3);

  return (
    <>
      <PageHeader
        title="Geo Demand"
        description="Understand regional demand, customer mix, and the inventory moves most likely to capture revenue."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        {topStates.map((state, index) => (
          <article
            key={state.label}
            className={`rounded-3xl p-5 ${
              ["bg-[#eee8f6]", "bg-[#f8e7e1]", "bg-[#e3efe9]"][index]
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#847c89]">
                Top market #{index + 1}
              </span>
              <span className="rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-bold text-[#706778]">
                {state.share.toFixed(1)}% share
              </span>
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#383241]">{state.label}</h2>
            <p className="mt-1 text-sm text-[#817985]">
              {state.units} units · {currency.format(state.revenue)}
            </p>
            <p className="mt-4 text-xs font-semibold text-[#68616d]">
              Leads in {state.topCategory}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <ChartCard
          title="Demand by state"
          subtitle="Units sold across the ten tracked markets"
          badge={`${states.length} states`}
        >
          <MetricBars
            data={states.map((state) => ({
              label: state.label,
              value: state.units,
              detail: `${state.units} units`,
            }))}
          />
        </ChartCard>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {topStates.map((state, index) => (
            <article key={state.label} className="soft-card rounded-3xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a86b2]">
                Inventory action {index + 1}
              </p>
              <h2 className="mt-2 text-base font-bold text-[#3b3544]">
                Send more {state.topCategory.toLowerCase()} depth to {state.label}.
              </h2>
              <p className="mt-2 text-xs leading-5 text-[#817985]">
                {state.topProduct} leads local demand. Prioritize the {state.dominantAgeGroup}{" "}
                {state.dominantGender.toLowerCase()} cohort when allocating the next replenishment.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="soft-card mt-5 overflow-hidden rounded-3xl">
        <div className="border-b border-[#eeeaf0] p-5 sm:p-6">
          <h2 className="text-[17px] font-bold text-[#363142]">Market intelligence</h2>
          <p className="mt-1 text-xs text-[#98929f]">
            Leading category, product, and customer profile by state
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eeeaf0] bg-white/45 text-[10px] font-bold uppercase tracking-[0.09em] text-[#99929f]">
                {[
                  "State",
                  "Top category",
                  "Top product",
                  "Revenue",
                  "Units",
                  "Dominant gender",
                  "Dominant age",
                ].map((heading) => (
                  <th key={heading} className="px-5 py-4">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.label} className="border-b border-[#f1eef2] last:border-0">
                  <td className="px-5 py-4 text-sm font-bold text-[#433d49]">{state.label}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#706976]">
                    {state.topCategory}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#706976]">{state.topProduct}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#4c4652]">
                    {currency.format(state.revenue)}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#706976]">{state.units}</td>
                  <td className="px-5 py-4 text-xs text-[#706976]">
                    {state.dominantGender}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#706976]">
                    {state.dominantAgeGroup}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

