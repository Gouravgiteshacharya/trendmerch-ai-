import { BusinessSetupExperience } from "@/components/BusinessSetupExperience";
import { PageHeader } from "@/components/PageHeader";
import type { BusinessDataSource } from "@/lib/business-profile";

export default async function BusinessSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const initialMode: BusinessDataSource | undefined =
    requestedMode === "csv" || requestedMode === "manual" || requestedMode === "demo"
      ? requestedMode
      : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Personalized simulation"
        title="Business Data Setup"
        description="Choose how TrendMerch AI should understand your business. Your setup stays in this browser."
      />
      <BusinessSetupExperience initialMode={initialMode} />
    </>
  );
}
