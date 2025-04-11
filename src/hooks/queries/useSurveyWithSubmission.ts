import { useQuery } from "@tanstack/react-query";
import { getSurveysWithSubmissions } from "@/services/surveyServiceV2";
import { queryKeys } from "@/lib/queryClient";

interface UseSurveysWithSubmissionsProps {
  surveyId: string;
  enabled?: boolean;
}

export const useSurveysWithSubmissions = ({
  surveyId,
  enabled = true,
}: UseSurveysWithSubmissionsProps) => {
  return useQuery({
    queryKey: queryKeys.surveys.withSubmissions(surveyId),
    queryFn: () => getSurveysWithSubmissions(surveyId),
    enabled,
    throwOnError: (error) => {
      console.error("Failed to fetch submitted survey:", error);
      return false;
    },
  });
};
