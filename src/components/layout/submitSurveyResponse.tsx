import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import {
  saveSurveyResponses,
  trackUniqueFormVisit,
} from "@/services/surveyServiceV2";

// Types
type QuestionType = "text" | "multiChoice" | "rating" | "link";
type NextAction = "nextPage" | "endSurvey";

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  nextAction: NextAction;
}

interface SurveyPage {
  id: string;
  questions: Question[];
}

interface SurveyResponse {
  questionId: string;
  answer: string | string[];
}

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

  // Handle input changes
  const handleInputChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handle radio selection for multiple choice
  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Check if current page has required questions that are not answered
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

  // Handle survey submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activePageIndex < parsedPages.length - 1) {
      // Navigate to next page
      navigatePreview("next");
      return;
    }

    // Last page: submit the survey
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

  // If the form has been successfully submitted
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

            {/* Display the active page questions */}
            <div className="space-y-8">
              {parsedPages[activePageIndex]?.questions?.map((question) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex items-start gap-1">
                    <h3 className="text-lg font-medium">{question.title}</h3>
                    {question.required && (
                      <span className="text-red-500">*</span>
                    )}
                  </div>

                  {question.description && (
                    <p className="text-gray-600 text-sm">
                      {question.description}
                    </p>
                  )}

                  {/* Different input types based on question type */}
                  {question.type === "text" && (
                    <Input
                      name={`question_${question.id}`}
                      placeholder={question.placeholder}
                      value={(answers[question.id] as string) || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(question.id, e.target.value)
                      }
                      required={question.required}
                    />
                  )}

                  {question.type === "multiChoice" && (
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="radio"
                            id={`option_${question.id}_${optionIndex}`}
                            name={`question_${question.id}`}
                            value={option}
                            checked={
                              (answers[question.id] as string) === option
                            }
                            onChange={() =>
                              handleRadioChange(question.id, option)
                            }
                            required={question.required && optionIndex === 0}
                          />
                          <label
                            htmlFor={`option_${question.id}_${optionIndex}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "rating" && (
                    <div className="flex gap-2">
                      {Array.from({
                        length: parseInt(question.placeholder || "5"),
                      }).map((_, i) => (
                        <Button
                          key={i}
                          type="button"
                          variant={
                            (answers[question.id] as string) ===
                            (i + 1).toString()
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="h-10 w-10"
                          onClick={() =>
                            handleInputChange(question.id, (i + 1).toString())
                          }
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Input
                        type="hidden"
                        name={`question_${question.id}`}
                        value={(answers[question.id] as string) || ""}
                        required={question.required}
                      />
                    </div>
                  )}

                  {question.type === "link" && (
                    <Input
                      name={`question_${question.id}`}
                      placeholder="https://example.com"
                      type="url"
                      value={(answers[question.id] as string) || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(question.id, e.target.value)
                      }
                      required={question.required}
                    />
                  )}
                </div>
              )) || <p>No questions available for this page.</p>}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 flex justify-between items-center">
              {/* Back button */}
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

              {/* Next/Submit button */}
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

            {/* Error message */}
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </Card>
      </form>
    </div>
  );
}
