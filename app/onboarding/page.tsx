import { OnboardingExperience } from "@/components/OnboardingExperience";

function safeNextPath(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/dashboard";
  }

  if (candidate === "/dashboard" || candidate.startsWith("/business-setup")) {
    return candidate;
  }

  return "/dashboard";
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  return <OnboardingExperience nextPath={safeNextPath(params.next)} />;
}
