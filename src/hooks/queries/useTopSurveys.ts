import { useQuery } from "@tanstack/react-query";
import { getTopSurveys } from "@/services/surveyService"; // adjust the import as needed

export function useTopSurveys() {
  return useQuery({
    queryKey: ["topSurveys"],
    queryFn: getTopSurveys,
  });
}
