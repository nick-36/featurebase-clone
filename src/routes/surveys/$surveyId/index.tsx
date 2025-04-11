// import { createLazyFileRoute } from "@tanstack/react-router";
// import SurveyDetailComp from "@/components/layout/surveyDetails";

// export const Route = createFileRoute("/surveys/$surveyId/")({
//   component: SurveyDetailComp,
// });


// src/routes/survey/$surveyId.tsx
import { createFileRoute } from '@tanstack/react-router';
import SurveyView from '@/components/layout/surveyView';
import { getSurveyById } from '@/services/surveyServiceV2';

export const Route = createFileRoute('/surveys/$surveyId/')({
  loader: async ({ params }) => {
    const survey = await getSurveyById(params.surveyId);
    return { survey };
  },
  component: SurveyView,
});