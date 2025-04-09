import { createLazyFileRoute } from "@tanstack/react-router";
import Builder from "@/components/builder/surveyBuilder";
import { useParams } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorDisplay } from "@/components/layout/errorDisplay";
import { useSurveyById } from "@/hooks/queries/useSurveyById";

const BuilderPage = () => {
  const { surveyId } = useParams({ from: "/surveys/$surveyId/builder" });
  const {
    data: survey,
    isLoading,
    error,
  } = useSurveyById({
    surveyId,
    enabled: !!surveyId,
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="w-full  mb-4" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!survey) {
    return <p className="text-gray-500 text-center">Survey not found</p>;
  }

  return <Builder survey={survey} />;
};

export const Route = createLazyFileRoute("/surveys/$surveyId/builder")({
  component: BuilderPage,
});
