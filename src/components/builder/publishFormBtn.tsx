import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { BookCheck, LoaderCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePublishForm } from "@/hooks";
import { useNavigate } from "@tanstack/react-router";

const PublishFormBtn = ({
  surveyId,
  isPublishable,
}: {
  surveyId: string;
  isPublishable: boolean;
}) => {
  const [loading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate: publishMutation } = usePublishForm({
    surveyId: surveyId,
    onSuccessCallback: () => {
      setIsOpen(false);
      navigate({
        to: "/surveys/$surveyId/success",
        params: {
          surveyId,
        },
      });
    },
  });

  const handlePublish = () => {
    startTransition(() => publishMutation());
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={!isPublishable}
          variant={"outline"}
          className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400 cursor-pointer"
        >
          <BookCheck className="h-6 w-6" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.After publishing you will not be able
            to edit this form. <br />
            <br />
            <span className="font-medium">
              By publishing this form you will make it available to the public
              and you will able to collect the submissions
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            disabled={loading}
            onClick={handlePublish}
          >
            Proceed{" "}
            {loading ? <LoaderCircle className="animate-spin" /> : <></>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishFormBtn;
