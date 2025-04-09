import Hero from "@/components/layout/hero";
import SurveyList from "@/components/layout/surveyList";
import { useSession } from "@/hooks/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPageComp,
});

function IndexPageComp() {
  const { session } = useSession();
  return (
    <div>
      <Hero />
      {session && <SurveyList />}
    </div>
  );
}
