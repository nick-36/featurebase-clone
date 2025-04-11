import { createFileRoute } from "@tanstack/react-router";
import { getSurveyByFormURL } from "@/services/surveyServiceV2";

import { useLoaderData } from "@tanstack/react-router";
import SurveySubmission from "@/components/layout/submitSurveyResponse";

const SubmitPage = () => {
  const { survey } = useLoaderData({
    from: Route.id,
  });

  return <SurveySubmission survey={survey} />;
};

export const Route = createFileRoute("/submit/$surveyUrl")({
  component: SubmitPage,
  context: () => {
    return {
      header: {
        hideHeader: true,
      },
    };
  },
  loader: async ({ params }) => {
    try {
      const surveyUrl = params.surveyUrl;
      const survey: SurveyV2 = await getSurveyByFormURL(surveyUrl);

      if (!survey) {
        throw new Error("Survey Not Found!");
      }

      return {
        survey,
      };
    } catch (error) {
      console.log(error);
    }
  },
});

export default SubmitPage;
