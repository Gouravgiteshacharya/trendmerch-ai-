import { BusinessSetupExperience } from "@/components/BusinessSetupExperience";
import { PageHeader } from "@/components/PageHeader";

export default function BusinessSetupPage() {
  return (
    <>
      <PageHeader
        eyebrow="Personalized simulation"
        title="Business Data Setup"
        description="Choose how TrendMerch AI should understand your business. Your setup stays in this browser."
      />
      <BusinessSetupExperience />
    </>
  );
}
