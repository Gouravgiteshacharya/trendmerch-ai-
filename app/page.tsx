import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  ChartNoAxesCombined,
  FileInput,
  MapPin,
  MessageSquareText,
  PenLine,
  RefreshCcw,
  ScanSearch,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Upload,
  UsersRound,
} from "lucide-react";

const problems = [
  {
    title: "Stockouts",
    text: "Spot high-velocity products before availability becomes lost revenue.",
    icon: Boxes,
  },
  {
    title: "Overstock",
    text: "Identify slow inventory early enough to protect margin and working capital.",
    icon: BarChart3,
  },
  {
    title: "High Returns",
    text: "Trace return exposure back to products, fit signals, and customer groups.",
    icon: RefreshCcw,
  },
  {
    title: "Wrong Size Mix",
    text: "Balance size depth around what customers are actually buying.",
    icon: SlidersHorizontal,
  },
  {
    title: "Regional Demand Gaps",
    text: "Route the right assortment toward the states showing real demand.",
    icon: MapPin,
  },
  {
    title: "Trend Uncertainty",
    text: "Separate short-lived spikes from seasonal and evergreen opportunity.",
    icon: TrendingUp,
  },
];

const inputs = [
  {
    title: "Upload CSV",
    text: "Bring sales, inventory, returns, customer, product, and regional data.",
    button: "Upload Data",
    href: "/onboarding?next=/business-setup?mode=csv",
    icon: Upload,
  },
  {
    title: "Fill Manually",
    text: "Enter business numbers like revenue, AOV, returns, regions, and product categories.",
    button: "Fill Profile",
    href: "/onboarding?next=/business-setup?mode=manual",
    icon: PenLine,
  },
  {
    title: "Use Guided Dropdowns",
    text: "Choose preset values to simulate a real fashion brand instantly.",
    button: "Start Demo",
    href: "/onboarding?next=/business-setup?mode=demo",
    icon: FileInput,
  },
];

const features = [
  {
    title: "Restock Planning",
    text: "Prioritize products where demand and inventory cover are moving out of balance.",
    icon: Boxes,
  },
  {
    title: "Markdown Strategy",
    text: "Find slow-moving stock and make disciplined, margin-aware markdown decisions.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Regional Demand",
    text: "Compare state-level revenue, units, categories, products, and customer mix.",
    icon: MapPin,
  },
  {
    title: "Customer Segments",
    text: "Turn age, gender, and category preference into sharper campaign direction.",
    icon: UsersRound,
  },
  {
    title: "Trend Duration",
    text: "Classify product momentum as viral, seasonal, evergreen, or declining.",
    icon: ScanSearch,
  },
  {
    title: "Weekly AI Reports",
    text: "Transform the week’s commercial signals into an explainable action plan.",
    icon: MessageSquareText,
  },
];

function EditorialMark() {
  return (
    <span className="grid size-10 place-items-center rounded-full border border-[#b9a98e] bg-[#f3ead9] text-[#4d402f]">
      <Sparkles className="size-4" strokeWidth={1.5} />
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-grain min-h-screen overflow-hidden bg-[#f4efe4] text-[#352a20]">
      <header className="relative z-30 border-b border-[#cfc1aa]/70 bg-[#f4efe4]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <EditorialMark />
            <span>
              <span className="editorial-serif block text-xl font-semibold tracking-[-0.02em]">
                TrendMerch AI
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8d7c67]">
                Fashion intelligence
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-semibold text-[#675846] md:flex">
            <a href="#features" className="transition hover:text-[#2f271f]">Features</a>
            <a href="#data-input" className="transition hover:text-[#2f271f]">Data Input</a>
            <a href="#explainability" className="transition hover:text-[#2f271f]">Explainability</a>
            <Link href="/onboarding?next=/dashboard" className="transition hover:text-[#2f271f]">Dashboard</Link>
          </nav>

          <Link
            href="/onboarding?next=/business-setup?mode=demo"
            className="inline-flex items-center gap-2 rounded-full bg-[#3c3329] px-4 py-2.5 text-xs font-bold text-[#fbf7ef] transition hover:bg-[#514437]"
          >
            Start Demo <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative border-b border-[#cfc1aa]/70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(190,168,130,0.17),transparent_31%),radial-gradient(circle_at_85%_70%,rgba(92,104,72,0.12),transparent_28%)]" />
          <div className="relative mx-auto grid min-h-[760px] max-w-[1440px] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:px-12 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#786849]">
                TrendMerch AI
              </p>
              <h1 className="editorial-serif mt-6 text-5xl leading-[0.98] tracking-[-0.055em] text-[#30261d] sm:text-6xl lg:text-[76px]">
                Merchandising,
                <br />
                <span className="italic text-[#6d7252]">Styled by Intelligence.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-[#746553] sm:text-lg">
                TrendMerch AI helps fashion brands translate sales, inventory, returns, customer
                behavior, and regional demand into sharper merchandising decisions.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/onboarding?next=/business-setup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3b3127] px-5 py-3.5 text-sm font-bold text-[#fffaf0] shadow-[0_14px_35px_rgba(59,49,39,0.18)] transition hover:-translate-y-0.5"
                >
                  Start with Guided Setup <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/onboarding?next=/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-[#a7967e] bg-[#f8f3e9]/70 px-5 py-3.5 text-sm font-bold text-[#4b3e30] transition hover:bg-[#ebe1d0]"
                >
                  Explore Demo Dashboard
                </Link>
                <Link
                  href="/onboarding?next=/business-setup?mode=csv"
                  className="inline-flex items-center justify-center gap-2 px-3 py-3.5 text-sm font-bold text-[#6c5a45] transition hover:text-[#342a21]"
                >
                  <Upload className="size-4" /> Upload Brand Data
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#cdbfa9] pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#91806a]">
                <span>Inventory clarity</span>
                <span>Demand intelligence</span>
                <span>Explainable AI</span>
              </div>
            </div>

            <div className="relative mx-auto min-h-[590px] w-full max-w-[650px]">
              <div className="absolute left-[8%] top-5 h-[510px] w-[58%] overflow-hidden rounded-[34px] border border-[#b9a98e] bg-[#d6c2a0] shadow-[0_35px_80px_rgba(78,62,43,0.18)]">
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,.26),transparent_35%),radial-gradient(circle_at_65%_22%,rgba(255,250,235,.55),transparent_20%),linear-gradient(160deg,#c6aa7e_0%,#eadbc1_48%,#8b8665_100%)]" />
                <div className="absolute inset-x-10 top-16 h-px bg-[#685b47]/40" />
                <div className="absolute left-1/2 top-28 h-64 w-36 -translate-x-1/2 rounded-[48%_48%_18%_18%] border border-[#6f624e]/35 bg-[#f0e4cf]/55 shadow-[inset_0_0_45px_rgba(79,67,47,.16)]" />
                <div className="absolute left-1/2 top-20 h-20 w-20 -translate-x-1/2 rounded-full border border-[#6f624e]/30 bg-[#ead8b9]/55" />
                <div className="absolute left-1/2 top-48 h-44 w-px -translate-x-1/2 bg-[#756a56]/35" />
                <div className="absolute inset-x-7 bottom-7 flex items-end justify-between text-[#453a2c]">
                  <div>
                    <p className="editorial-serif text-3xl italic">Summer Edit</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em]">
                      Quiet forms · natural texture
                    </p>
                  </div>
                  <span className="vertical-label text-[9px] font-bold uppercase tracking-[0.28em]">
                    2026
                  </span>
                </div>
                <div className="absolute left-7 top-7 flex gap-2">
                  {["Linen", "Silk", "Summer Edit"].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-[#7a6b55]/35 bg-[#f7eddc]/55 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#554837]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute right-0 top-24 w-[48%] rounded-3xl border border-[#b8aa95] bg-[#f9f3e8]/95 p-5 shadow-[0_24px_60px_rgba(65,53,39,0.17)] backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a775f]">
                    Assortment pulse
                  </span>
                  <span className="size-2 rounded-full bg-[#737a57]" />
                </div>
                <p className="editorial-serif mt-5 text-3xl text-[#352b22]">₹12.8L</p>
                <p className="mt-1 text-[10px] font-semibold text-[#8c7a65]">Revenue · Last 30 Days</p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-[#e8dfd0] p-3">
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[#85725d]">Stock risk</p>
                    <p className="mt-1 text-lg font-bold">4 SKUs</p>
                  </div>
                  <div className="rounded-2xl bg-[#dfe1cf] p-3">
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[#697052]">Trend score</p>
                    <p className="mt-1 text-lg font-bold">90/100</p>
                  </div>
                </div>
                <div className="mt-4 flex h-16 items-end gap-1.5">
                  {[34, 58, 45, 72, 62, 88, 76].map((height, index) => (
                    <span
                      key={height + index}
                      className="flex-1 rounded-t-md bg-[#776c55]"
                      style={{ height: `${height}%`, opacity: 0.42 + index * 0.07 }}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-3 right-[5%] w-[62%] rounded-3xl border border-[#a99b84] bg-[#404637] p-5 text-[#f7f1e6] shadow-[0_24px_55px_rgba(54,57,42,0.24)]">
                <div className="flex items-center gap-2 text-[#d8caa9]">
                  <Sparkles className="size-4" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em]">AI insight</span>
                </div>
                <p className="editorial-serif mt-3 text-lg leading-6">
                  “Restock linen shirts in Maharashtra. Demand is rising among 25–34 customers.”
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#c5bda9]">
                  <span>View supporting data</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#3b332a] px-5 py-24 text-[#f4eddf] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1360px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#c8b58e]">
              The merchandising tension
            </p>
            <h2 className="editorial-serif mt-5 max-w-3xl text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
              Fashion moves fast. Merchandising should move faster.
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-[#6d6152] bg-[#6d6152] md:grid-cols-2 xl:grid-cols-3">
              {problems.map(({ title, text, icon: ProblemIcon }) => (
                <article key={title} className="bg-[#443b31] p-6 sm:p-7">
                  <ProblemIcon className="size-5 text-[#ccb78e]" strokeWidth={1.4} />
                  <h3 className="editorial-serif mt-7 text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#c8bdaf]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="data-input" className="scroll-mt-20 border-b border-[#cfc1aa] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1360px]">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#827054]">
                Flexible by design
              </p>
              <h2 className="editorial-serif mt-5 text-4xl tracking-[-0.035em] sm:text-5xl">
                Start with the data you have.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#766755]">
                TrendMerch AI works with uploaded files, manual business inputs, or guided demo
                values.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {inputs.map(({ title, text, button, href, icon: InputIcon }, index) => (
                <article
                  key={title}
                  className={`group rounded-[28px] border border-[#c8baa4] p-7 transition hover:-translate-y-1 ${
                    index === 1 ? "bg-[#e7dfd0]" : "bg-[#f9f4ea]"
                  }`}
                >
                  <span className="grid size-12 place-items-center rounded-full border border-[#b9aa92] bg-[#efe6d7] text-[#5b4c3b]">
                    <InputIcon className="size-5" strokeWidth={1.4} />
                  </span>
                  <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.18em] text-[#938169]">
                    0{index + 1}
                  </p>
                  <h3 className="editorial-serif mt-2 text-3xl">{title}</h3>
                  <p className="mt-4 min-h-20 text-sm leading-6 text-[#746451]">{text}</p>
                  <Link
                    href={href}
                    className="mt-7 inline-flex items-center gap-2 border-b border-[#5e4e3b] pb-1 text-xs font-bold uppercase tracking-[0.1em]"
                  >
                    {button} <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 bg-[#ebe4d7] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1360px]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#827054]">
                The intelligence layer
              </p>
              <h2 className="editorial-serif mt-5 text-4xl tracking-[-0.035em] sm:text-5xl">
                From raw numbers to refined decisions.
              </h2>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map(({ title, text, icon: FeatureIcon }) => (
                <article
                  key={title}
                  className="rounded-[26px] border border-[#c8baa4] bg-[#f6f0e5]/75 p-6 transition hover:bg-[#faf6ee]"
                >
                  <div className="flex items-center justify-between">
                    <FeatureIcon className="size-5 text-[#667052]" strokeWidth={1.4} />
                    <span className="h-px w-12 bg-[#b7a88f]" />
                  </div>
                  <h3 className="editorial-serif mt-8 text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#766755]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="explainability" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#827054]">
                Explainable by default
              </p>
              <h2 className="editorial-serif mt-5 text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
                Every recommendation has a reason.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#766755]">
                Recommendations stay connected to the commercial evidence behind them, so teams can
                inspect the signal before acting on it.
              </p>
            </div>

            <article className="rounded-[32px] border border-[#ad9d83] bg-[#3f4637] p-6 text-[#f7f0e4] shadow-[0_30px_70px_rgba(58,55,42,0.18)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d5c59f]">
                  <Sparkles className="size-4" /> AI Recommendation
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-[9px] font-semibold text-[#cfc6b5]">
                  Inventory action
                </span>
              </div>
              <p className="editorial-serif mt-7 text-2xl leading-9 sm:text-3xl">
                “Restock linen shirts and floral midi dresses in Maharashtra and Karnataka.”
              </p>
              <details className="group mt-8 rounded-2xl border border-white/15 bg-black/10">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-bold">
                  View supporting data
                  <span className="text-xl font-light transition group-open:rotate-45">+</span>
                </summary>
                <div className="flex flex-wrap gap-2 border-t border-white/15 p-4">
                  {[
                    "Units sold",
                    "Stock level",
                    "Return rate",
                    "Top region",
                    "Age group",
                    "Gender",
                    "Trend score",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[#d4c7ac]/25 bg-[#f4ead8]/10 px-3 py-1.5 text-[10px] font-semibold text-[#e4dac7]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </details>
            </article>
          </div>
        </section>

        <section className="border-y border-[#c7b89f] bg-[#ded5c5] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <h2 className="editorial-serif text-4xl leading-tight tracking-[-0.035em]">
              Built as an MVP.
              <br />
              Designed like a real product.
            </h2>
            <p className="text-base leading-8 text-[#675846]">
              TrendMerch AI supports demo retail data, uploaded CSVs, and manually entered brand
              context. In production, the same workflow can connect to Shopify, marketplace
              dashboards, POS systems, and ERP data.
            </p>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[36px] border border-[#a8977b] bg-[#392f26] px-6 py-16 text-center text-[#f8f1e5] shadow-[0_35px_80px_rgba(55,44,33,0.18)] sm:px-10">
            <Shirt className="mx-auto size-7 text-[#c9b485]" strokeWidth={1.25} />
            <h2 className="editorial-serif mx-auto mt-6 max-w-3xl text-4xl tracking-[-0.04em] sm:text-5xl">
              Ready to style your merchandising decisions?
            </h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/onboarding?next=/business-setup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4ead8] px-5 py-3.5 text-sm font-bold text-[#3b3127]"
              >
                Start Guided Setup <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/onboarding?next=/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-[#c2b294]/60 px-5 py-3.5 text-sm font-bold"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#cfc1aa] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-4 text-xs text-[#776854] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <EditorialMark />
            <span className="editorial-serif text-lg font-semibold text-[#3a3026]">
              TrendMerch AI
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
            <span>Capstone MVP</span>
            <span>Built for fashion merchandising intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
