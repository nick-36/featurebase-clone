import { useParams } from "@tanstack/react-router";
import { StatsCard } from "./statsCard";
import { MousePointerClick, PointerOff, BookText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SubmissionTable from "@/components/layout/submissionDashboard";
import VisitBtn from "@/components/layout/visitBtn";
import FormLinkShare from "@/components/layout/surveyLinkShare";
import { View } from "lucide-react";
import { DefaultPendingSkeleton } from "./loadingSkeleton";
import { ErrorDisplay } from "@/components/layout/errorDisplay";
import { useSurveyById } from "@/hooks/queries/useSurveyById";
import { useSurveysWithSubmissions } from "@/hooks/queries/useSurveyWithSubmission";
import UnpublishButton from "@/components/layout/unpublishButton";

const SurveyDetailComp = () => {
  const { surveyId } = useParams({ from: "/surveys/$surveyId/" });

  const {
    data: survey,
    isLoading: surveyLoading,
    error: surveyError,
  } = useSurveyById({ surveyId });

  const { data: submittedSurvey, isLoading: submissionsLoading } =
    useSurveysWithSubmissions({
      surveyId,
    });

  if (surveyLoading || submissionsLoading) {
    return <DefaultPendingSkeleton />;
  }

  if (surveyError) {
    return <ErrorDisplay error={surveyError} />;
  }

  if (!survey) {
    return <div className="p-4 text-red-500">Survey Not Found!</div>;
  }
  return (
    <div className="py-10 border-b border-muted flex flex-col">
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold truncate">{survey?.name}</h1>
            <div className="flex gap-2">
              <UnpublishButton
                surveyId={surveyId}
                isPublished={survey?.published}
              />
            </div>
          </div>
          <VisitBtn shareURl={survey?.share_url} />
        </div>
        <Separator />
        <div className="py-4 border-b border-muted">
          <div className="flex gap-2 items-center justify-between">
            <FormLinkShare shareURl={survey?.share_url} />
          </div>
        </div>
      </div>
      <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-4">
        <StatsCard
          title="Total visits"
          statValue={survey?.visits.toLocaleString() ?? ""}
          description="all time visits"
          loading={false}
          icon={<View className="text-blue-500" />}
        />
        <StatsCard
          title="Total Submission"
          statValue={survey?.submissions.toLocaleString() ?? ""}
          description="all time submissions"
          loading={false}
          icon={<BookText className="text-yellow-500" />}
        />
        <StatsCard
          title="Submission Rate"
          statValue={`${survey?.submissionRate?.toLocaleString() ?? ""}%`}
          description="all the visits that results into submissions"
          loading={false}
          icon={<MousePointerClick className="text-green-500" />}
        />
        <StatsCard
          title="Bounce Rate"
          statValue={`${survey?.bounceRate?.toLocaleString() ?? ""}%`}
          description="all the visits that left without interacting"
          loading={false}
          icon={<PointerOff className="text-red-500" />}
        />
      </div>
      <Separator />
      {submittedSurvey ? (
        <div className="pb-10">
          <SubmissionTable submittedSurvey={submittedSurvey} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SurveyDetailComp;
