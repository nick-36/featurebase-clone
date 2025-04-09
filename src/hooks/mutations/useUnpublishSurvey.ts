import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { unpublishSurvey } from "@/services/surveyService";
import { queryKeys } from "@/lib/queryClient";

export const useUnpublishSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ surveyId }: { surveyId: string }) => {
      await unpublishSurvey({ surveyId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.surveys.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.surveys.detail(variables.surveyId),
      });

      toast.success("Survey unpublished successfully");
    },
    onError: (error) => {
      toast.error(`Failed to unpublish survey: ${error.message}`);
    },
  });
};
