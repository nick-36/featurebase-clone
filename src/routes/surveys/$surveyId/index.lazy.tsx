import { createLazyFileRoute } from "@tanstack/react-router";
import SurveyDetailComp from "@/components/layout/surveyDetails";

export const Route = createLazyFileRoute("/surveys/$surveyId/")({
  component: SurveyDetailComp,
});
