import { useQuery } from "@tanstack/react-query";
import { getSurveyById } from "@/services/surveyService";
import { queryKeys } from "@/lib/queryClient";

interface UseSurveyByIdProps {
  surveyId: string;
  enabled?: boolean;
}

export const useSurveyById = ({
  surveyId,
  enabled = true,
}: UseSurveyByIdProps) => {
  return useQuery({
    queryKey: queryKeys.surveys.detail(surveyId),
    queryFn: () => {
      const data = getSurveyById(surveyId);
      return data;
    },
    enabled,
    throwOnError: (error) => {
      if (error.message === "Survey Not Found!") throw error;
      return false;
    },
  });
};
