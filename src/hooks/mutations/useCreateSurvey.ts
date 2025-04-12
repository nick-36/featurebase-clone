import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSurvey } from "@/services/surveyServiceV2";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryClient";

export const useCreateSurvey = ({
  onSuccessCallback,
  shouldReset = false,
}: {
  onSuccessCallback?: (data: SurveyV2) => void;
  shouldReset?: boolean;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSurvey,
    onSuccess: (data) => {
      if (shouldReset) {
        queryClient.resetQueries({
          queryKey: queryKeys.surveys.all,
        });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.surveys.all });
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
        toast.success("New survey created successfully!");
      }
    },
    onError: (error: ApiError) => {
      if (error.code === "23505") {
        toast.error(`Survey with name already exist!`);
        return;
      }
      console.log(error.code, "ERROR");
      toast.error("Something went wrong! Please try again.");
    },
  });
};
