import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/survey/$surveyId/")({
  component: SurveyDetailPage,
});

function SurveyDetailPage() {
  const { surveyId } = Route.useParams();
  return <div>Survey ID: {surveyId}</div>;
}
