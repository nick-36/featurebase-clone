import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSurvey } from "@/services/surveyService";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryClient";

export const useCreateSurvey = ({
  onSuccessCallback,
}: {
  onSuccessCallback?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSurvey,
    onSuccess: () => {
      toast.success("New survey created successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.surveys.all });

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again.");
    },
  });
};
