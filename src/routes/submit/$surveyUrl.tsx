import { createFileRoute } from "@tanstack/react-router";
import { getSurveyByFormURL } from "@/services/surveyService";
import FormSubmitComponent from "@/components/layout/formSubmit";
import { FormElementInstance } from "@/types/formElement";
import { useLoaderData } from "@tanstack/react-router";

const SubmitPage = () => {
  const { surveyUrl, formContent, isPublished } = useLoaderData({
    from: Route.id,
  });

  return (
    <FormSubmitComponent
      surveyUrl={surveyUrl}
      content={formContent}
      isPublished={isPublished}
    />
  );
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
      const survey = await getSurveyByFormURL(surveyUrl);

      if (!survey) {
        throw new Error("Survey Not Found!");
      }

      const formContent: FormElementInstance[] =
        typeof survey.content === "string" ? JSON.parse(survey.content) : [];

      return {
        surveyUrl,
        formContent,
        isPublished: survey.published,
      };
    } catch (error) {
      console.log(error);
      return {
        surveyUrl: "",
        formContent: "",
        isPublished: false,
      };
    }
  },
});

export default SubmitPage;
