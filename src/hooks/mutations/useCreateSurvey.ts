import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSurvey } from "@/services/surveyService";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryClient";

export const useCreateSurvey = ({
  onSuccessCallback,
  shouldReset = false,
}: {
  onSuccessCallback?: () => void;
  shouldReset?: boolean;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSurvey,
    onSuccess: () => {
      toast.success("New survey created successfully!");
      if (shouldReset) {
        queryClient.resetQueries({
          queryKey: queryKeys.surveys.all,
        });
        document
          .getElementById("create-survey-section")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.surveys.all });
      }

      if (onSuccessCallback) {
        onSuccessCallback();
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
