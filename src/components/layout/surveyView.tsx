import { useParams } from "@tanstack/react-router";
import { StatsCard } from "./statsCard";
import { MousePointerClick, PointerOff, BookText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SubmissionTable from "@/components/layout/submissionDashboardV2";
import VisitBtn from "@/components/layout/visitBtn";
import FormLinkShare from "@/components/layout/surveyLinkShare";
import { View } from "lucide-react";
import { DefaultPendingSkeleton } from "./loadingSkeleton";
import { ErrorDisplay } from "@/components/layout/errorDisplay";
import { useSurveyById } from "@/hooks/queries/useSurveyById";
import { useSurveysWithSubmissions } from "@/hooks/queries/useSurveyWithSubmission";
import UnpublishButton from "@/components/layout/unpublishButton";
import { Key } from "react";

const SurveyDetailComp = () => {
  const { surveyId } = useParams({ from: "/surveys/$surveyId/" });

  const {
    data: survey,
    isLoading: surveyLoading,
    error: surveyError,
  } = useSurveyById({ surveyId });


  const { data: submittedSurvey, isLoading: submissionsLoading } =
    useSurveysWithSubmissions({ surveyId });


  if (surveyLoading || submissionsLoading) {
    return <DefaultPendingSkeleton />;
  }

  if (surveyError) {
    return <ErrorDisplay error={surveyError} />;
  }

  if (!survey) {
    return <div className="p-4 text-red-500">Survey Not Found!</div>;
  }

  const pages =
    typeof survey.content === "string" ? JSON.parse(survey.content) : [];

  return (
    <div className="py-10 border-b border-muted flex flex-col">
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold truncate">{survey?.title}</h1>
            <UnpublishButton
              surveyId={surveyId}
              isPublished={survey?.is_published}
            />
          </div>
          <VisitBtn shareURl={survey?.share_url} />
        </div>

        <Separator />

        <div className="py-4 border-b border-muted">
          <FormLinkShare shareURl={survey?.share_url} />
        </div>
      </div>

      <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-4">
        <StatsCard
          title="Total visits"
          statValue={survey?.visits?.toLocaleString() ?? "0"}
          description="All time visits"
          loading={false}
          icon={<View className="text-blue-500" />}
        />
        <StatsCard
          title="Total Submission"
          statValue={survey?.submissions?.toLocaleString() ?? "0"}
          description="All time submissions"
          loading={false}
          icon={<BookText className="text-yellow-500" />}
        />
        <StatsCard
          title="Submission Rate"
          statValue={`${survey?.submissionRate?.toLocaleString() ?? "0"}%`}
          description="Visits resulting in submissions"
          loading={false}
          icon={<MousePointerClick className="text-green-500" />}
        />
        <StatsCard
          title="Bounce Rate"
          statValue={`${survey?.bounceRate?.toLocaleString() ?? "0"}%`}
          description="Visits with no interaction"
          loading={false}
          icon={<PointerOff className="text-red-500" />}
        />
      </div>

      {/* Optional: Show question preview */}
      <div className="px-4">
        <h2 className="text-xl font-semibold mt-6 mb-2">Survey Questions</h2>
        <div className="space-y-4">
          {pages.map(
            (
              page: { id: Key | null | undefined; questions: any[] },
              pageIndex: number
            ) => (
              <div key={page.id} className="bg-muted/30 rounded-xl p-4">
                <h3 className="font-semibold text-muted-foreground mb-2">
                  Page {pageIndex + 1}
                </h3>
                {page.questions?.map((q, qIndex) => (
                  <div key={q.id} className="pl-4">
                    <p className="text-sm font-medium">
                      Q{qIndex + 1}: {q.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Type: {q.type} | Required: {q.required ? "Yes" : "No"}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      <Separator className="my-6" />

      {submittedSurvey ? (
        <div className="pb-10">
          <SubmissionTable submittedSurvey={submittedSurvey} />
        </div>
      ) : null}
    </div>
  );
};

export default SurveyDetailComp;
