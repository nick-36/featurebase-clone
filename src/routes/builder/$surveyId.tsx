// src/routes/builder/$surveyId.tsx
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import SurveyBuilder from "@/components/surveyBuilder/surveyBuilder";
import { getSurveyToEdit } from "@/services/surveyServiceV2";

const SurveyEditPage = () => {
  const routeData = useLoaderData({
    from: "/builder/$surveyId",
  });

  return <SurveyBuilder surveyData={routeData?.survey} />;
};

export const Route = createFileRoute("/builder/$surveyId")({
  loader: async ({ params }) => {
    const survey = await getSurveyToEdit(params.surveyId);
    return { survey };
  },
  component: SurveyEditPage,
});
