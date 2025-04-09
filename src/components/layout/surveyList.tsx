import { useRef } from "react";
import SurveyCard from "./surveyCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CreateSurveyBtn from "./createSurvey";
import { useSurveys } from "@/hooks/queries";
import { useIntersectionObserver } from "@/hooks/utils";
import { ErrorDisplay } from "./errorDisplay";

export const SurveyCardSkeleton = () => {
  return (
    <Card className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 border border-blue-200/50">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="flex items-center justify-between border-t pt-3">
        <Skeleton className="h-3 w-1/3" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};
const SurveyList = () => {
  const createSurveyRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSurveys({ pageSize: 10 });

  const surveys = data?.pages?.flatMap((page) => page.surveys) || [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const loadMoreRef = useIntersectionObserver(loadMore, {
    rootMargin: "100px",
    threshold: 0,
  });

  if (error) return <ErrorDisplay error={error} />;

  return (
    <div
      className="mx-auto mt-8 p-4"
      ref={createSurveyRef}
      id="create-survey-section"
    >
      <h2 className="text-2xl font-extrabold text-left mb-6">All Surveys</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <CreateSurveyBtn />

        {surveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            id={survey.id}
            name={survey.name}
            description={survey.description}
            shareURL={survey.share_url}
            createdAt={survey.created_at}
            responseCount={survey.submissions}
            isPublished={survey.published}
          />
        ))}

        {isLoading &&
          surveys?.length === 0 &&
          Array(5)
            .fill(0)
            .map((_, index) => <SurveyCardSkeleton key={`initial-${index}`} />)}

        {isFetchingNextPage &&
          Array(3)
            .fill(0)
            .map((_, index) => <SurveyCardSkeleton key={`next-${index}`} />)}
      </ul>
      {hasNextPage && <div ref={loadMoreRef} className="h-10 w-full mt-4" />}
    </div>
  );
};

export default SurveyList;
