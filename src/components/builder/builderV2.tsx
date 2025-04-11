import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PublishFormBtn from "./publishFormBtn";
import SaveFormBtn from "./saveFormBtn";
import { SurveyParsed, useSurveyBuilder } from "@/stores/surveyBuilderStore";

type QuestionType = "text" | "multiChoice" | "rating" | "link";

type NextAction = "nextPage" | "endSurvey";

type SurveyWithStats = SurveyParsed & {
  bounceRate: number;
  submissionRate: number;
  visits: number;
  submissions: number;
};

const getInitialPages = () => {
  return [
    {
      id: crypto.randomUUID(),
      questions: [
        {
          id: crypto.randomUUID(),
          type: "text",
          title: "Question 1",
          description: "",
          placeholder: "Enter your answer",
          required: false,
          nextAction: "nextPage",
        },
      ],
    },
  ];
};

export default function SurveyBuilder({
  surveyData,
}: {
  surveyData?: SurveyParsed;
}) {
  const {
    survey,
    activePageIndex,
    activeView,
    setSurvey,
    setActivePageIndex,
    setActiveView,
    updateSurveyMeta,
    addPage,
    deletePage,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    addOption,
    updateOption,
    deleteOption,
    navigatePreview,
  } = useSurveyBuilder();
  useEffect(() => {
    if (!surveyData || !surveyData.id) return;

    const hasPages =
      Array.isArray(surveyData.pages) && surveyData.pages.length > 0;

    if (!hasPages) {
      const { bounceRate, submissionRate, submissions, visits, ...rest } =
        surveyData as SurveyWithStats;

      const newSurvey: SurveyParsed = {
        ...rest,
        pages: getInitialPages(),
      };

      setSurvey(newSurvey);
    } else {
      setSurvey(surveyData);
    }
  }, [surveyData]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">
            {survey.title || "Untitled Survey"}
          </h1>
          <Badge
            variant={survey.is_published ? "default" : "destructive"}
            className="h-6"
          >
            {survey.is_published ? "Published" : "Draft"}
          </Badge>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center space-x-2">
            <Label htmlFor="view-mode" className="text-sm font-medium">
              Preview
            </Label>
            <Switch
              id="view-mode"
              checked={activeView === "preview"}
              onCheckedChange={() =>
                setActiveView(activeView === "edit" ? "preview" : "edit")
              }
            />
          </div>
          <div className="flex gap-2">
            <SaveFormBtn />
            <PublishFormBtn surveyId={survey?.id ?? ""} />
          </div>
        </div>
      </div>

      {/* Main Content - Dynamic Layout based on activeView */}
      {activeView === "preview" ? (
        /* Full-width Preview Mode */
        <Card className="shadow-sm w-full max-w-3xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
            <CardTitle className="text-lg font-semibold">
              Survey Preview
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-gray-50">
                Page {activePageIndex + 1} of {survey?.pages.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView("edit")}
                className="h-8 text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Editor
              </Button>
            </div>
          </CardHeader>

          <CardContent className="bg-white p-6 space-y-8">
            {/* Survey Title + Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {survey.title || "Untitled Survey"}
              </h2>
              {survey.description && (
                <p className="text-gray-600">{survey.description}</p>
              )}
            </div>

            <Separator className="bg-gray-200" />

            {/* Page Questions */}
            <div className="space-y-10">
              {survey?.pages[activePageIndex]?.questions.map(
                (question, index) => (
                  <div key={question.id} className="space-y-3">
                    {/* Title + Required Marker */}
                    <div className="flex items-start gap-1">
                      <h3 className="text-lg font-medium text-gray-800">
                        {question.title || `Question ${index + 1}`}
                      </h3>
                      {question.required && (
                        <span className="text-red-500 text-sm">*</span>
                      )}
                    </div>

                    {/* Optional description */}
                    {question.description && (
                      <p className="text-sm text-gray-500">
                        {question.description}
                      </p>
                    )}

                    {/* Input Types */}
                    <div className="pt-1">
                      {question.type === "text" && (
                        <Input
                          placeholder={
                            question.placeholder || "Your answer here..."
                          }
                          disabled
                          className="cursor-not-allowed bg-gray-50 border-gray-200"
                        />
                      )}

                      {question.type === "multiChoice" && (
                        <div className="space-y-2 pl-1">
                          {(question.options || []).length > 0 ? (
                            (question.options ?? []).map((option, idx) => (
                              <label
                                key={idx}
                                htmlFor={`option-preview-${question.id}-${idx}`}
                                className="flex items-center gap-3 text-gray-700 py-1 hover:bg-gray-50 rounded px-1 transition-colors"
                              >
                                <input
                                  type="radio"
                                  name={`question-preview-${question.id}`}
                                  id={`option-preview-${question.id}-${idx}`}
                                  disabled
                                  className="h-4 w-4 accent-blue-500"
                                />
                                <span>{option}</span>
                              </label>
                            ))
                          ) : (
                            <p className="text-gray-400 italic">
                              No options added yet
                            </p>
                          )}
                        </div>
                      )}

                      {question.type === "rating" && (
                        <div className="flex gap-2 flex-wrap">
                          {Array.from({
                            length: parseInt(question.placeholder || "5"),
                          }).map((_, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              disabled
                              className="h-10 w-10 cursor-not-allowed hover:bg-gray-50"
                            >
                              {i + 1}
                            </Button>
                          ))}
                        </div>
                      )}

                      {question.type === "link" && (
                        <Input
                          placeholder="https://example.com"
                          disabled
                          className="cursor-not-allowed bg-gray-50 border-gray-200"
                        />
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            <Separator className="bg-gray-200" />

            {/* Navigation buttons */}
            <div className="pt-2 flex justify-between items-center">
              {/* Back button */}
              {activePageIndex > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => navigatePreview("prev")}
                  className="transition-all hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <div /> // Empty placeholder to keep layout aligned
              )}

              {/* Next/Submit button */}
              <Button
                onClick={() =>
                  activePageIndex < survey?.pages.length - 1
                    ? navigatePreview("next")
                    : console.log("Survey submitted")
                }
                className="transition-all"
              >
                {activePageIndex < survey?.pages.length - 1 ? (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Edit Mode with Side-by-Side Layout */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Builder */}
          <div className="flex flex-col gap-6">
            {/* Survey Metadata Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg">Survey Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Survey Title
                    </label>
                    <Input
                      value={survey.title}
                      onChange={(e) =>
                        updateSurveyMeta("title", e.target.value)
                      }
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Survey Description
                    </label>
                    <Textarea
                      value={survey?.description || ""}
                      onChange={(e) =>
                        updateSurveyMeta("description", e.target.value)
                      }
                      rows={3}
                      className="resize-none transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Survey Pages Card */}
            <Card className="flex-1 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
                <CardTitle className="text-lg">Survey Pages</CardTitle>
                <Button
                  onClick={addPage}
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Page
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs
                  value={activePageIndex.toString()}
                  onValueChange={(value) => setActivePageIndex(parseInt(value))}
                  className="w-full"
                >
                  <TabsList className="mb-4 w-full grid grid-cols-4 sm:grid-cols-6 gap-1">
                    {survey?.pages?.map((page, index) => (
                      <TabsTrigger
                        key={page.id}
                        value={index.toString()}
                        className="text-sm"
                      >
                        Page {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {survey?.pages.map((page, pageIndex) => (
                    <TabsContent key={page.id} value={pageIndex.toString()}>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-800">
                            Page {pageIndex + 1}
                          </h3>
                          <Button
                            onClick={() => deletePage(pageIndex)}
                            size="sm"
                            variant="destructive"
                            disabled={survey?.pages.length <= 1}
                            className="h-8"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete Page
                          </Button>
                        </div>

                        {/* Questions */}
                        <div className="space-y-4">
                          {page.questions.map((question, questionIndex) => (
                            <Card
                              key={question.id}
                              className="shadow-sm border border-gray-200"
                            >
                              <CardHeader className="pb-2 pt-3 px-4">
                                <div className="flex justify-between items-center">
                                  <Select
                                    value={question.type}
                                    onValueChange={(value: QuestionType) =>
                                      updateQuestion(
                                        pageIndex,
                                        questionIndex,
                                        "type",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-40 h-8 text-sm">
                                      <SelectValue placeholder="Question Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="multiChoice">
                                        Multiple Choice
                                      </SelectItem>
                                      <SelectItem value="rating">
                                        Rating
                                      </SelectItem>
                                      <SelectItem value="link">Link</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    onClick={() =>
                                      deleteQuestion(pageIndex, questionIndex)
                                    }
                                    size="sm"
                                    variant="ghost"
                                    disabled={page.questions.length <= 1}
                                    className="h-8 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4 pt-2 px-4 pb-4">
                                <div className="space-y-1.5">
                                  <label className="text-sm font-medium text-gray-700">
                                    Question Title
                                  </label>
                                  <Input
                                    value={question.title}
                                    onChange={(e) =>
                                      updateQuestion(
                                        pageIndex,
                                        questionIndex,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    className="text-sm"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-sm font-medium text-gray-700">
                                    Description (Optional)
                                  </label>
                                  <Textarea
                                    value={question.description}
                                    onChange={(e) =>
                                      updateQuestion(
                                        pageIndex,
                                        questionIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                    className="text-sm resize-none"
                                  />
                                </div>

                                {/* Question Type Specific Fields */}
                                {question.type === "text" && (
                                  <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">
                                      Placeholder
                                    </label>
                                    <Input
                                      value={question.placeholder || ""}
                                      onChange={(e) =>
                                        updateQuestion(
                                          pageIndex,
                                          questionIndex,
                                          "placeholder",
                                          e.target.value
                                        )
                                      }
                                      className="text-sm"
                                    />
                                  </div>
                                )}

                                {question.type === "multiChoice" && (
                                  <div className="space-y-3">
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium text-gray-700">
                                        Options
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {(question.options || []).length > 0 ? (
                                        <div className="space-y-2">
                                          {question.options?.map(
                                            (option, optionIndex) => (
                                              <div
                                                key={optionIndex}
                                                className="flex items-center gap-2"
                                              >
                                                <Input
                                                  value={option}
                                                  onChange={(e) =>
                                                    updateOption(
                                                      pageIndex,
                                                      questionIndex,
                                                      optionIndex,
                                                      e.target.value
                                                    )
                                                  }
                                                  className="text-sm"
                                                />
                                                <Button
                                                  onClick={() =>
                                                    deleteOption(
                                                      pageIndex,
                                                      questionIndex,
                                                      optionIndex
                                                    )
                                                  }
                                                  size="sm"
                                                  variant="ghost"
                                                  disabled={
                                                    (question.options?.length ||
                                                      0) <= 1
                                                  }
                                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            )
                                          )}
                                          <Button
                                            onClick={() =>
                                              addOption(
                                                pageIndex,
                                                questionIndex
                                              )
                                            }
                                            size="sm"
                                            variant="outline"
                                            className="mt-1 text-sm h-8"
                                          >
                                            <Plus className="h-4 w-4 mr-1" />{" "}
                                            Add Option
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          onClick={() =>
                                            addOption(pageIndex, questionIndex)
                                          }
                                          size="sm"
                                          variant="outline"
                                          className="w-full text-sm h-8"
                                        >
                                          <Plus className="h-4 w-4 mr-1" /> Add
                                          First Option
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {question.type === "rating" && (
                                  <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">
                                      Scale Type
                                    </label>
                                    <Select
                                      value={question.placeholder || "5"}
                                      onValueChange={(value) =>
                                        updateQuestion(
                                          pageIndex,
                                          questionIndex,
                                          "placeholder",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger className="text-sm">
                                        <SelectValue placeholder="Select Scale" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="5">
                                          1-5 Scale
                                        </SelectItem>
                                        <SelectItem value="10">
                                          1-10 Scale
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                {/* Bottom Controls */}
                                <div className="flex justify-between items-center pt-2 border-t mt-3">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`required-${question.id}`}
                                      checked={question.required}
                                      onChange={(e) =>
                                        updateQuestion(
                                          pageIndex,
                                          questionIndex,
                                          "required",
                                          e.target.checked
                                        )
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/25"
                                    />
                                    <label
                                      htmlFor={`required-${question.id}`}
                                      className="text-sm text-gray-700"
                                    >
                                      Required
                                    </label>
                                  </div>

                                  <Select
                                    value={question.nextAction}
                                    onValueChange={(value: NextAction) =>
                                      updateQuestion(
                                        pageIndex,
                                        questionIndex,
                                        "nextAction",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-40 h-8 text-sm">
                                      <SelectValue placeholder="After Answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="nextPage">
                                        Go to Next Page
                                      </SelectItem>
                                      <SelectItem value="endSurvey">
                                        End Survey
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <Button
                          onClick={() => addQuestion(pageIndex)}
                          variant="outline"
                          className="w-full group hover:bg-primary/5"
                        >
                          <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          Add Question
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Live Preview */}
          <Card className="shadow-sm h-full max-h-screen overflow-y-auto sticky top-4">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
              <CardTitle className="text-lg font-semibold">
                Survey Preview
              </CardTitle>
              <Badge variant="outline" className="bg-gray-50">
                Page {activePageIndex + 1} of {survey?.pages.length}
              </Badge>
            </CardHeader>

            <CardContent className="bg-white p-6 space-y-8">
              {/* Survey Title + Description */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {survey.title || "Untitled Survey"}
                </h2>
                {survey.description && (
                  <p className="text-gray-600">{survey.description}</p>
                )}
              </div>

              <Separator className="bg-gray-200" />

              {/* Page Questions */}
              <div className="space-y-10">
                {survey?.pages[activePageIndex]?.questions.map(
                  (question, index) => (
                    <div key={question.id} className="space-y-3">
                      {/* Title + Required Marker */}
                      <div className="flex items-start gap-1">
                        <h3 className="text-lg font-medium text-gray-800">
                          {question.title || `Question ${index + 1}`}
                        </h3>
                        {question.required && (
                          <span className="text-red-500 text-sm">*</span>
                        )}
                      </div>

                      {/* Optional description */}
                      {question.description && (
                        <p className="text-sm text-gray-500">
                          {question.description}
                        </p>
                      )}

                      {/* Input Types */}
                      <div className="pt-1">
                        {question.type === "text" && (
                          <Input
                            placeholder={
                              question.placeholder || "Your answer here..."
                            }
                            disabled
                            className="cursor-not-allowed bg-gray-50 border-gray-200"
                          />
                        )}

                        {question.type === "multiChoice" && (
                          <div className="space-y-2 pl-1">
                            {(question.options || []).length > 0 ? (
                              (question.options ?? []).map((option, idx) => (
                                <label
                                  key={idx}
                                  htmlFor={`option-preview-${question.id}-${idx}`}
                                  className="flex items-center gap-3 text-gray-700 py-1 hover:bg-gray-50 rounded px-1 transition-colors"
                                >
                                  <input
                                    type="radio"
                                    name={`question-preview-${question.id}`}
                                    id={`option-preview-${question.id}-${idx}`}
                                    disabled
                                    className="h-4 w-4 accent-blue-500"
                                  />
                                  <span>{option}</span>
                                </label>
                              ))
                            ) : (
                              <p className="text-gray-400 italic">
                                No options added yet
                              </p>
                            )}
                          </div>
                        )}

                        {question.type === "rating" && (
                          <div className="flex gap-2 flex-wrap">
                            {Array.from({
                              length: parseInt(question.placeholder || "5"),
                            }).map((_, i) => (
                              <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                disabled
                                className="h-10 w-10 cursor-not-allowed hover:bg-gray-50"
                              >
                                {i + 1}
                              </Button>
                            ))}
                          </div>
                        )}

                        {question.type === "link" && (
                          <Input
                            placeholder="https://example.com"
                            disabled
                            className="cursor-not-allowed bg-gray-50 border-gray-200"
                          />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              <Separator className="bg-gray-200" />

              {/* Navigation buttons */}
              <div className="pt-2 flex justify-between items-center">
                {/* Back button */}
                {activePageIndex > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => navigatePreview("prev")}
                    className="transition-all hover:bg-gray-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                ) : (
                  <div /> // Empty placeholder to keep layout aligned
                )}

                {/* Next/Submit button */}
                <Button
                  onClick={() =>
                    activePageIndex < survey?.pages.length - 1
                      ? navigatePreview("next")
                      : console.log("Survey submitted")
                  }
                  className="transition-all"
                >
                  {activePageIndex < survey?.pages.length - 1 ? (
                    <>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
