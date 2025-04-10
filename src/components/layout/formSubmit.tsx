import { toast } from "sonner";
import { MousePointerClick, LoaderCircle, Lock } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { submitSurvey, trackUniqueFormVisit } from "@/services/surveyService";
import { FormElementInstance, LayoutElement } from "@/types/formElement";
import { FormElements } from "@/components/builder/formElements";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isQuestionElement } from "@/lib/utils";

export const SubmissionSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 p-6">
      <Card className="w-full max-w-xl text-center shadow-xl border-none bg-white dark:bg-gray-900">
        <CardContent className="p-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <CheckCircle className="text-green-500 w-16 h-16" />
          <h1 className="text-3xl font-bold text-foreground">
            Survey Submitted Successfully 🎉
          </h1>
          <p className="text-muted-foreground text-base">
            Thank you for taking the time to fill out the survey. You may now
            close this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export const SurveyUnavailable = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 p-6">
      <Card className="w-full max-w-xl text-center shadow-xl border-none bg-white dark:bg-gray-900">
        <CardContent className="p-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <Lock className="text-red-500 w-16 h-16" />
          <h1 className="text-3xl font-bold text-foreground">
            Survey Not Available
          </h1>
          <p className="text-muted-foreground text-base">
            This survey is currently unpublished and not accepting responses.
            Please check back later or contact the survey creator if you believe
            this is an error.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const FormSubmitComponent = ({
  surveyUrl,
  content,
  isPublished,
}: {
  surveyUrl: string;
  content: FormElementInstance[];
  isPublished: boolean;
}) => {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setSubmitted] = useState(false);
  const [loading, startTransition] = useTransition();
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    const visitKey = `visited-${surveyUrl}`;
    if (!hasTrackedRef.current && !sessionStorage.getItem(visitKey)) {
      trackUniqueFormVisit(surveyUrl);
      sessionStorage.setItem(visitKey, "true");
      hasTrackedRef.current = true;
    }
  }, [surveyUrl]);

  const validateForm = () => {
    for (const element of content) {
      const activeValue = formValues.current[element?.id] ?? "";
      const valid = FormElements[element.type].validate(element, activeValue);
      if (!valid) {
        formErrors.current[element.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    return true;
  };

  const submitValue = (key: string, value: any) => {
    formValues.current[key] = value;
  };

  const submitForm = async (): Promise<void> => {
    formErrors.current = {};

    if (!validateForm()) {
      setRenderKey(Date.now());
      toast.error("Please check the form for errors");
      return;
    }

    const titleElement = content.find(
      (element) => element.type === LayoutElement.TitleField
    );
    const surveyTitle =
      titleElement?.extraAttributes?.title || "Untitled Survey";

    try {
      const questionElements = content.filter((element) =>
        isQuestionElement(element.type)
      );

      const structuredAnswers = questionElements.map((element) => ({
        questionId: element.id,
        questionLabel:
          element.extraAttributes?.label ?? `Question-${element.id}`,
        questionType: element.type,
        answer: formValues.current[element.id],
      }));

      const answerPayload = {
        surveyId: surveyUrl,
        submittedAt: new Date().toISOString(),
        answers: structuredAnswers,
        title: surveyTitle,
      };

      const res = await submitSurvey(surveyUrl, JSON.stringify(answerPayload));

      if (res?.success) {
        setSubmitted(true);
        formValues.current = {};
        setRenderKey(Date.now());
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  if (submitted) {
    return <SubmissionSuccess />;
  }

  if (!isPublished) {
    return <SurveyUnavailable />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-10">
      <div
        key={renderKey}
        className="w-full max-w-2xl bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto max-h-[90vh] transition-all duration-300"
      >
        {content?.map((el) => {
          const FormComponent = FormElements[el.type]?.formComponent;
          return (
            <FormComponent
              key={el.id}
              elementInstance={el}
              submitValue={submitValue}
              isInvalid={formErrors?.current[el.id]}
              defaultValue={formValues?.current[el.id]}
            />
          );
        })}
        <div className="flex justify-center">
          <Button
            className="m-8 w-md cursor-pointer"
            onClick={() => startTransition(submitForm)}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                <MousePointerClick className="mr-2" />
                Submit
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormSubmitComponent;
