import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Laptop,
  MonitorCheck,
  Smartphone,
  MessageSquare,
  ListChecks,
  Star,
  Link,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PublishFormBtn from "./publishFormBtn";
import SaveFormBtn from "./saveFormBtn";
import { SurveyParsed, useSurveyBuilder } from "@/stores/surveyBuilderStore";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";

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
          type: "text" as QuestionType,
          title: "Question 1",
          description: "",
          placeholder: "Enter your answer",
          required: false,
          nextAction: "nextPage" as NextAction,
        },
      ],
    },
  ];
};

// Card stack animation variants for questions
const questionCardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: index * 0.15,
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
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
    deviceView,
  } = useSurveyBuilder();

  // Hardcoded device view (should be managed in store for dynamic switching)

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
  }, [surveyData, setSurvey]);

  // Card variants for page transitions
  const cardVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  const questionTypes = [
    { value: "text", label: "Text", icon: MessageSquare },
    { value: "multiChoice", label: "Multiple Choice", icon: ListChecks },
    { value: "rating", label: "Rating", icon: Star },
    { value: "link", label: "Link", icon: Link },
  ];

  const getDeviceWidthClass = () => {
    switch (deviceView) {
      case "mobile":
        return "w-full max-w-xs";
      case "tablet":
        return "w-full max-w-md";
      default:
        return "w-full max-w-2xl";
    }
  };

  return (
    <div className="mx-4 py-4 px-0 md:px-2">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-lg shadow-lg bg-gray-100 border border-gray-300 w-full max-w-4xl mx-auto overflow-hidden">
            {/* Browser Chrome */}
            <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-700 rounded-md px-3 py-1 text-sm text-center truncate">
                  {survey.title || "Untitled Survey"} • Preview
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {/* Device Selection */}
                <div className="flex space-x-1 bg-gray-700 rounded-md p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-6 ${deviceView === "desktop" ? "bg-gray-600" : ""}`}
                  >
                    <MonitorCheck className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-6 ${deviceView === "tablet" ? "bg-gray-600" : ""}`}
                  >
                    <Laptop className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-6 ${deviceView === "mobile" ? "bg-gray-600" : ""}`}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView("edit")}
                  className="h-6 text-xs"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" /> Editor
                </Button>
              </div>
            </div>

            {/* Browser Content */}
            <div className="bg-gray-50 min-h-96 p-4 flex items-center justify-center">
              <div
                className={`${getDeviceWidthClass()} transition-all duration-300`}
              >
                <AnimatePresence mode="wait" initial={false} custom={1}>
                  <motion.div
                    key={activePageIndex}
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white rounded-lg shadow-md"
                  >
                    <div className="p-6 space-y-6">
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
                      <div className="space-y-4">
                        {survey?.pages[activePageIndex]?.questions.map(
                          (question, index) => (
                            <motion.div
                              key={question.id}
                              custom={index}
                              variants={questionCardVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              {/* Title + Required Marker */}
                              <div className="flex items-start gap-1">
                                <h3 className="text-lg font-medium text-gray-800">
                                  {question.title || `Question ${index + 1}`}
                                </h3>
                                {question.required && (
                                  <span className="text-red-500 text-sm">
                                    *
                                  </span>
                                )}
                              </div>

                              {/* Optional description */}
                              {question.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {question.description}
                                </p>
                              )}

                              {/* Input Types */}
                              <div className="pt-2">
                                {question.type === "text" && (
                                  <Input
                                    placeholder={
                                      question.placeholder ||
                                      "Your answer here..."
                                    }
                                    className="focus:ring-2 focus:ring-blue-500 transition-all"
                                  />
                                )}

                                {question.type === "multiChoice" && (
                                  <div className="space-y-2 pl-1">
                                    {(question.options || []).length > 0 ? (
                                      question?.options?.map((option, idx) => (
                                        <label
                                          key={idx}
                                          htmlFor={`option-preview-${question.id}-${idx}`}
                                          className="flex items-center gap-3 text-gray-700 py-2 px-2 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                        >
                                          <motion.input
                                            whileTap={{ scale: 1.2 }}
                                            type="radio"
                                            name={`question-preview-${question.id}`}
                                            id={`option-preview-${question.id}-${idx}`}
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
                                      length: parseInt(
                                        question.placeholder || "5"
                                      ),
                                    }).map((_, i) => (
                                      <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="h-10 w-10 rounded border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center font-medium"
                                      >
                                        {i + 1}
                                      </motion.button>
                                    ))}
                                  </div>
                                )}

                                {question.type === "link" && (
                                  <Input
                                    placeholder="https://example.com"
                                    className="focus:ring-2 focus:ring-blue-500 transition-all"
                                  />
                                )}
                              </div>
                            </motion.div>
                          )
                        )}
                      </div>

                      <Separator className="bg-gray-200 my-4" />

                      {/* Navigation buttons */}
                      <div className="pt-2 flex justify-between items-center">
                        {activePageIndex > 0 ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigatePreview("prev")}
                            className="px-4 py-2 rounded border border-gray-300 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                          >
                            <ArrowLeft className="h-4 w-4" /> Back
                          </motion.button>
                        ) : (
                          <div />
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            activePageIndex < survey?.pages.length - 1
                              ? navigatePreview("next")
                              : console.log("Survey submitted")
                          }
                          className="px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                          {activePageIndex < survey?.pages.length - 1 ? (
                            <>
                              Next <ArrowRight className="h-4 w-4" />
                            </>
                          ) : (
                            "Submit"
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Browser Footer */}
            <div className="bg-gray-200 border-t border-gray-300 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
              <div>
                Page {activePageIndex + 1} of {survey?.pages.length}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Preview Mode
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Builder - Scrollable independently */}
          <div className="flex flex-col gap-6 max-h-screen overflow-y-auto pb-6">
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
                            <motion.div
                              key={question.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
                                <CardHeader className="pb-2 pt-3 px-4">
                                  <div className="flex justify-between items-center">
                                    <RadioGroup
                                      value={question.type}
                                      onValueChange={(value) =>
                                        updateQuestion(
                                          pageIndex,
                                          questionIndex,
                                          "type",
                                          value
                                        )
                                      }
                                      className="flex space-x-2"
                                    >
                                      {questionTypes.map((type) => {
                                        const Icon = type.icon;
                                        return (
                                          <div key={type.value}>
                                            <Label
                                              htmlFor={`type-${type.value}`}
                                              className={cn(
                                                "flex items-center justify-center h-8 px-3 rounded-md border text-sm cursor-pointer transition-all",
                                                question.type === type.value
                                                  ? "border-primary bg-primary/5 text-primary font-medium"
                                                  : "border-gray-200 hover:bg-gray-50"
                                              )}
                                            >
                                              <RadioGroupItem
                                                id={`type-${type.value}`}
                                                value={type.value}
                                                className="sr-only"
                                              />
                                              <Icon className="mr-1 h-3 w-3" />
                                              <span className="text-xs">
                                                {type.label}
                                              </span>
                                            </Label>
                                          </div>
                                        );
                                      })}
                                    </RadioGroup>

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
                                          question?.options?.map(
                                            (option, optionIndex) => (
                                              <motion.div
                                                key={optionIndex}
                                                className="flex items-center gap-2"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
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
                                              </motion.div>
                                            )
                                          )
                                        ) : (
                                          <Button
                                            onClick={() =>
                                              addOption(
                                                pageIndex,
                                                questionIndex
                                              )
                                            }
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-sm h-8"
                                          >
                                            <Plus className="h-4 w-4 mr-1" />{" "}
                                            Add First Option
                                          </Button>
                                        )}
                                      </div>
                                      {question.options &&
                                        question.options.length > 0 && (
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
                                        )}
                                    </div>
                                  )}

                                  {question.type === "rating" && (
                                    <div className="space-y-1.5">
                                      <label className="text-sm font-medium text-gray-700">
                                        Scale Type
                                      </label>
                                      <Select
                                        value={question?.placeholder ?? "5"}
                                        defaultValue="5"
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
                            </motion.div>
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

          {/* Right Column - Browser Preview - Fixed position */}
          <div className="relative lg:h-screen">
            <div className="lg:sticky lg:w-full h-screen pb-10">
              <div className="h-full border border-gray-300 rounded-lg shadow-lg overflow-hidden flex flex-col">
                {/* Browser Chrome UI */}
                <div className="bg-gray-200 border-b border-gray-300 p-2 flex flex-col flex-shrink-0">
                  {/* Browser Controls */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5 ml-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <button className="p-1 hover:bg-gray-300 rounded">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 100-4 2 2 0 000 4zM10 12a2 2 0 100-4 2 2 0 000 4zM10 18a2 2 0 100-4 2 2 0 000 4z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* URL Bar */}
                  <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-1.5">
                    <div className="flex items-center text-gray-500 mr-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex-1 text-sm text-gray-600 truncate">
                      {survey.title
                        ? `survey-app.com/${survey.title.toLowerCase().replace(/\s+/g, "-")}`
                        : "survey-app.com/untitled-survey"}
                    </div>
                  </div>
                </div>

                {/* Browser Content - Scrollable */}
                <div className="bg-gray-100 flex-1 overflow-y-auto p-4">
                  <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto my-4">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={activePageIndex}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                      >
                        {/* Survey Title + Description */}
                        <div className="space-y-3">
                          <h2 className="text-xl font-bold text-gray-900">
                            {survey.title || "Untitled Survey"}
                          </h2>
                          {survey.description && (
                            <p className="text-gray-600 text-sm">
                              {survey.description}
                            </p>
                          )}
                        </div>

                        <Separator className="bg-gray-200" />

                        {/* Questions */}
                        <div className="space-y-4">
                          {survey?.pages[activePageIndex]?.questions.map(
                            (question, index) => (
                              <motion.div
                                key={question.id}
                                custom={index}
                                variants={questionCardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start gap-1">
                                  <h3 className="text-base font-medium text-gray-800">
                                    {question.title || `Question ${index + 1}`}
                                  </h3>
                                  {question.required && (
                                    <span className="text-red-500 text-xs">
                                      *
                                    </span>
                                  )}
                                </div>

                                {question.description && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {question.description}
                                  </p>
                                )}

                                <div className="pt-2">
                                  {question.type === "text" && (
                                    <Input
                                      placeholder={
                                        question.placeholder ||
                                        "Your answer here..."
                                      }
                                      disabled
                                      className="bg-gray-50"
                                    />
                                  )}

                                  {question.type === "multiChoice" && (
                                    <div className="space-y-2 pl-1">
                                      {(question.options || []).length > 0 ? (
                                        question?.options?.map(
                                          (option, idx) => (
                                            <label
                                              key={idx}
                                              className="flex items-center gap-2 text-gray-700"
                                            >
                                              <input
                                                type="radio"
                                                disabled
                                                className="h-4 w-4"
                                              />
                                              <span>{option}</span>
                                            </label>
                                          )
                                        )
                                      ) : (
                                        <p className="text-gray-400 italic text-sm">
                                          No options added
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {question.type === "rating" && (
                                    <div className="flex gap-2">
                                      {Array.from({
                                        length: parseInt(
                                          question.placeholder || "5"
                                        ),
                                      }).map((_, i) => (
                                        <div
                                          key={i}
                                          className="h-8 w-8 rounded border border-gray-300 flex items-center justify-center text-sm"
                                        >
                                          {i + 1}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {question.type === "link" && (
                                    <Input
                                      placeholder="https://example.com"
                                      disabled
                                      className="bg-gray-50"
                                    />
                                  )}
                                </div>
                              </motion.div>
                            )
                          )}
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex justify-between pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={activePageIndex === 0}
                            className="text-sm"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="text-sm"
                          >
                            {activePageIndex < survey?.pages?.length - 1
                              ? "Next"
                              : "Submit"}
                          </Button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Browser Status Bar */}
                <div className="bg-gray-200 border-t border-gray-300 px-3 py-1 text-xs text-gray-500 flex justify-between flex-shrink-0">
                  <div>Preview Mode</div>
                  <div>
                    Page {activePageIndex + 1} of {survey?.pages?.length || 1}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
