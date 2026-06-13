import { AIChatExperience } from "@/components/AIChatExperience";
import { PageHeader } from "@/components/PageHeader";

export default function AIChatPage() {
  return (
    <>
      <PageHeader
        title="AI Chat"
        description="Ask merchandising questions and get instant rule-based answers grounded in the local fashion retail dataset."
      />
      <AIChatExperience />
    </>
  );
}

