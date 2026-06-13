import { PageHeader } from "@/components/PageHeader";
import { WeeklyReportExperience } from "@/components/WeeklyReportExperience";

export default function WeeklyReportPage() {
  return (
    <>
      <PageHeader
        title="Weekly Report"
        description="Generate a profile-aware leadership brief with expandable revenue, inventory, market, customer, and trend evidence."
      />
      <WeeklyReportExperience />
    </>
  );
}
