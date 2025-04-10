import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSurveysPaginated } from "@/services/surveyService";
import { queryKeys } from "@/lib/queryClient";

export const useSurveys = ({ pageSize = 1 } = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.surveys.all,
    queryFn: ({ pageParam = 0 }) => fetchSurveysPaginated(pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};
