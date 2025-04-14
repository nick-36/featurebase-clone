import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuestionInput } from "@/components/questions/questionInput";
import type {
  SurveyPage,
  SurveyResponse,
  QuestionChoice,
  QuestionType,
} from "@/types/survey";

import {
  saveSurveyResponses,
  trackUniqueFormVisit,
} from "@/services/surveyServiceV2";

export default function SurveySubmission({ survey }: { survey: SurveyV2 }) {
  const { share_url } = survey;
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    const visitKey = `visited-${share_url}`;
    if (!hasTrackedRef.current && !sessionStorage.getItem(visitKey)) {
      trackUniqueFormVisit(share_url as string);
      sessionStorage.setItem(visitKey, "true");
      hasTrackedRef.current = true;
    }
  }, [survey?.id]);

  const parsedPages: SurveyPage[] =
    typeof survey.pages === "string" ? JSON.parse(survey.pages) : survey.pages;

  const navigatePreview = (direction: "next" | "prev") => {
    if (direction === "next" && activePageIndex < parsedPages.length - 1) {
      setActivePageIndex(activePageIndex + 1);
    } else if (direction === "prev" && activePageIndex > 0) {
      setActivePageIndex(activePageIndex - 1);
    }
  };

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const canProceed = () => {
    const currentPage = parsedPages[activePageIndex];
    if (!currentPage || !currentPage.questions) return false;

    const requiredQuestions = currentPage.questions.filter((q) => q.required);
    return requiredQuestions.every(
      (q) =>
        answers[q.id] !== undefined &&
        answers[q.id] !== "" &&
        (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activePageIndex < parsedPages.length - 1) {
      navigatePreview("next");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const responses: SurveyResponse[] = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      await saveSurveyResponses(survey.id, responses);
      setSubmitted(true);
    } catch (error) {
      setError("Failed to submit survey");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold">
              Thank you for your responses!
            </h1>
            <p className="text-gray-600">Your submission has been received.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{survey.title}</h1>
              {survey.description && (
                <p className="text-gray-600">{survey.description}</p>
              )}
              <div className="text-sm text-gray-500">
                Page {activePageIndex + 1} of {parsedPages.length}
              </div>
            </div>

            <Separator />

            <div className="space-y-8">
              {parsedPages[activePageIndex]?.questions?.map((question) => {
                const choices: QuestionChoice[] = (question.options || []).map(
                  (opt, idx) => ({ id: `${idx}`, value: opt, label: opt })
                );
                const isInvalid =
                  question.required &&
                  (answers[question.id] === undefined ||
                    answers[question.id] === "");

                return (
                  <div key={question.id} className="space-y-2">
                    <QuestionInput
                      id={question.id}
                      label={question.title}
                      type={question.type as QuestionType}
                      value={(answers[question.id] as string) || ""}
                      placeholder={question.placeholder}
                      required={question.required}
                      choices={choices}
                      ratingScale={
                        question.placeholder
                          ? parseInt(question.placeholder)
                          : 5
                      }
                      onChange={(value) => {
                        console.log(value, "VALUE");
                        handleInputChange(question.id, value);
                      }}
                      isInvalid={isInvalid}
                      className="space-y-2"
                    />
                    {question.description && (
                      <p className="text-gray-600 text-sm">
                        {question.description}
                      </p>
                    )}
                  </div>
                );
              }) || <p>No questions available for this page.</p>}
            </div>

            <div className="pt-4 flex justify-between items-center">
              {activePageIndex > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigatePreview("prev")}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
              ) : (
                <div></div>
              )}

              <Button type="submit" disabled={!canProceed() || isSubmitting}>
                {activePageIndex < parsedPages.length - 1 ? (
                  <>
                    Next <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                ) : isSubmitting ? (
                  "Submitting..."
                ) : (
                  "Submit"
                )}
              </Button>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </Card>
      </form>
    </div>
  );
}
