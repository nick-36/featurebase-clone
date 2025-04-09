import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { publishForm } from "@/services/surveyService";
import { queryClient, queryKeys } from "@/lib/queryClient";

export function usePublishForm({
  surveyId,
  onSuccessCallback,
}: {
  surveyId: string;
  onSuccessCallback?: () => void;
}) {
  return useMutation({
    mutationFn: () => publishForm(surveyId),
    onSuccess: () => {
      toast.success("Form Published Successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.surveys.detail(surveyId),
      });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to publish the form.");
    },
  });
}
