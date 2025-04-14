import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  MessageSquare,
  ListChecks,
  Star,
  Link,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSurveyBuilder } from "@/stores/surveyBuilderStore";
import { Question, NextAction } from "@/types/survey";
import { questionCardVariants } from "@/lib/utils";

const questionTypes = [
  { value: "text", label: "Text", icon: MessageSquare },
  { value: "multiChoice", label: "Multiple Choice", icon: ListChecks },
  { value: "rating", label: "Rating", icon: Star },
  { value: "link", label: "Link", icon: Link },
];

interface QuestionEditorProps {
  pageIndex: number;
  questionIndex: number;
  question: Question;
}

export function QuestionEditor({
  pageIndex,
  questionIndex,
  question,
}: QuestionEditorProps) {
  const {
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption,
  } = useSurveyBuilder();

  //   const choices = useMemo(
  //     () =>
  //       (question.options || []).map((opt, idx) => ({
  //         id: `${idx}`,
  //         value: opt,
  //         label: opt,
  //       })),
  //     [question.options]
  //   );

  return (
    <motion.div
      variants={questionCardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout={false}
    >
      <Card className="shadow-sm border border-gray-200 hover:border-gray-300 transition-colors overflow-y-auto">
        <CardHeader className="pb-2 pt-2 px-3 sm:px-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center overflow-visible">
            <RadioGroup
              value={question.type}
              onValueChange={(value) =>
                updateQuestion(pageIndex, questionIndex, "type", value)
              }
              className="grid grid-cols-2 gap-2 sm:flex sm:gap-2 h-auto"
            >
              {questionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Label
                    key={type.value}
                    htmlFor={`question-${question.id}-type-${type.value}`}
                    className={cn(
                      "flex items-center justify-center h-9 px-2 rounded-md border text-xs cursor-pointer transition-all",
                      question.type === type.value
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-gray-200 hover:bg-gray-50",
                      "sm:h-8 sm:px-3 sm:text-sm"
                    )}
                  >
                    <RadioGroupItem
                      id={`question-${question.id}-type-${type.value}`}
                      value={type.value}
                      className="sr-only"
                    />
                    <Icon className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>{type.label}</span>
                  </Label>
                );
              })}
            </RadioGroup>
            <Button
              onClick={() => deleteQuestion(pageIndex, questionIndex)}
              size="sm"
              variant="ghost"
              disabled={
                useSurveyBuilder.getState().survey.pages[pageIndex].questions
                  .length <= 1
              }
              className="self-end h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 sm:self-center sm:h-9 sm:w-9"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
              value={question.description || ""}
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

          {question.type === "multiChoice" && (
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  Options
                </span>
              </div>
              <div className="space-y-2">
                {(question.options || []).length > 0 ? (
                  question?.options?.map((option, optionIndex) => (
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
                          deleteOption(pageIndex, questionIndex, optionIndex)
                        }
                        size="sm"
                        variant="ghost"
                        disabled={(question.options?.length || 0) <= 1}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <Button
                    onClick={() => addOption(pageIndex, questionIndex)}
                    size="sm"
                    variant="outline"
                    className="w-full text-sm h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add First Option
                  </Button>
                )}
              </div>
              {question.options && question.options.length > 0 && (
                <Button
                  onClick={() => addOption(pageIndex, questionIndex)}
                  size="sm"
                  variant="outline"
                  className="mt-1 text-sm h-8"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Option
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
                value={question.placeholder ?? "5"}
                defaultValue="5"
                onValueChange={(value) =>
                  updateQuestion(pageIndex, questionIndex, "placeholder", value)
                }
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">1-5 Scale</SelectItem>
                  <SelectItem value="10">1-10 Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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

          {question.type === "link" && (
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
                updateQuestion(pageIndex, questionIndex, "nextAction", value)
              }
            >
              <SelectTrigger className="w-40 h-8 text-sm">
                <SelectValue placeholder="After Answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nextPage">Go to Next Page</SelectItem>
                <SelectItem value="endSurvey">End Survey</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
