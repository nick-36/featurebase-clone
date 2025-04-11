import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { saveSurvey } from "@/services/surveyServiceV2";
import { useSurveyBuilder } from "@/stores/surveyBuilderStore";

const SaveFormBtn = () => {
  const { survey } = useSurveyBuilder((state) => state);
  const [loading, startTransition] = useTransition();

  const updateFormContent: () => void = useCallback(async () => {
    try {
      await saveSurvey(survey);
      toast.success("Survey saved successfully!");
    } catch (error) {
      console.log(error);
      toast.error("something went wront!");
    }
  }, [survey]);

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
