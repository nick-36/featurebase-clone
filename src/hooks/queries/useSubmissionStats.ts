import { useQuery } from "@tanstack/react-query";
import { getSubmissionStats } from "@/services/surveyService"; // adjust the import as needed

export function useSubmissionStats() {
  return useQuery({
    queryKey: ["submissionStats"],
    queryFn: getSubmissionStats,
  });
}
