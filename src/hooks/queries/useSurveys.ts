import { useQuery } from "@tanstack/react-query";
import { getSurveys } from "@/services/surveyService";
import { queryKeys } from "@/lib/queryClient";

export function useSurveys() {
  return useQuery({
    queryKey: queryKeys.surveys.all,
    queryFn: getSurveys,
    select: (data) => data || [],
  });
}
