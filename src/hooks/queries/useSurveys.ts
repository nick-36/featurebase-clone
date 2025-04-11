import { useQuery } from "@tanstack/react-query";
import { getUserSurveys } from "@/services/surveyServiceV2";

import { queryKeys } from "@/lib/queryClient";

// export const useSurveys = ({ pageSize = 1 } = {}) => {
//   return useInfiniteQuery({
//     queryKey: queryKeys.surveys.all,
//     queryFn: ({ pageParam = 0 }) => getUserSurveys(pageParam, pageSize),
//     getNextPageParam: (lastPage, allPages) => {
//       return lastPage.hasMore ? allPages.length : undefined;
//     },
//     initialPageParam: 0,
//   });
// };

export const useSurveys = () => {
  return useQuery({
    queryKey: queryKeys.surveys.all,
    queryFn: () => getUserSurveys(),
  });
};
