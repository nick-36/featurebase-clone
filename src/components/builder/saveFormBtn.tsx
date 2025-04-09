import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useBuilder } from "@/stores/builderStore";
import { updateSurveyContent } from "@/services/surveyService";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const SaveFormBtn = ({ surveyId }: { surveyId: string }) => {
  const elements = useBuilder((state) => state.elements);
  const [loading, startTransition] = useTransition();

  const updateFormContent: () => void = useCallback(async () => {
    try {
      const jsonElement = JSON.stringify(elements);
      await updateSurveyContent(surveyId, jsonElement);
      toast.success("Survey saved successfully!");
    } catch (error) {
      console.log(error);
      toast.error("something went wront!");
    }
  }, [surveyId, elements]);

  return (
    <Button
      variant={"outline"}
      className="gap-2 cursor-pointer"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      <Save className="h-6 w-6" />

      {loading ? (
        <>
          Saving...
          <LoaderCircle className="animate-spin" />
        </>
      ) : (
        <>Save </>
      )}
    </Button>
  );
};

export default SaveFormBtn;
