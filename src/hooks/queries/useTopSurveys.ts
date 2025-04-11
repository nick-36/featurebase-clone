import { useQuery } from "@tanstack/react-query";
import { getTopSurveys } from "@/services/surveyServiceV2"; // adjust the import as needed

export function useTopSurveys() {
  return useQuery({
    queryKey: ["topSurveys"],
    queryFn: getTopSurveys,
  });
}
