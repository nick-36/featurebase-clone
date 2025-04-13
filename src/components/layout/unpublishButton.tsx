import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EyeOff } from "lucide-react";
import { useUnpublishSurvey } from "@/hooks/mutations/useUnpublishSurvey";

const UnpublishButton = ({
  surveyId,
  isPublished = false,
}: {
  surveyId: string;
  isPublished: boolean | null;
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate: unpublishSurvey, isPending } = useUnpublishSurvey();

  const handleUnpublish = () => {
    unpublishSurvey(
      { surveyId },
      {
        onSuccess: () => {
          setOpen(false);
          navigate({ to: "/dashboard" });
        },
      }
    );
  };

  if (!isPublished) {
    return <></>;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        <EyeOff className="w-4 h-4 mr-2" />
        Unpublish
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish this survey?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will make the survey inaccessible to respondents. Any
              existing data will be preserved, but no new submissions will be
              collected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnpublish}
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Unpublishing..." : "Unpublish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UnpublishButton;
