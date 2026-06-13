import { PageHeader } from "@/components/PageHeader";
import { WeeklyReportExperience } from "@/components/WeeklyReportExperience";

export default function WeeklyReportPage() {
  return (
    <>
      <PageHeader
        title="Weekly Report"
        description="Generate a structured merchandising brief for leadership using the same analytics that power the dashboard."
      />
      <WeeklyReportExperience />
    </>
  );
}

