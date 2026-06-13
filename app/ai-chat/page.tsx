import { AIChatExperience } from "@/components/AIChatExperience";
import { PageHeader } from "@/components/PageHeader";

export default function AIChatPage() {
  return (
    <>
      <PageHeader
        title="AI Chat"
        description="Ask profile-aware merchandising questions and inspect the analytics behind every recommendation."
      />
      <AIChatExperience />
    </>
  );
}
