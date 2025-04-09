import { useState, useMemo, useCallback } from "react";
import { formatDistance } from "date-fns";
import { FormElementInstance } from "@/types/formElement";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Search,
  CalendarDays,
  SlidersHorizontal,
  Clock,
  X,
  Clipboard,
} from "lucide-react";
import ExportButton from "./exportBtn";
import { useDebounce } from "@/hooks/utils/useDebounce";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { isQuestionElement } from "@/lib/utils";

type SubmittedSurvey = {
  form_submission: SurveySubmission[];
} & Survey;

type FilterOption = {
  field: string;
  value: string;
};

type Answer = { questionLabel: string; questionType: string; answer: string };

const SubmissionDashboard = ({
  submittedSurvey,
}: {
  submittedSurvey: SubmittedSurvey;
}) => {
  const [sortField, setSortField] = useState("submittedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const formElements = useMemo(() => {
    return typeof submittedSurvey?.content === "string"
      ? (JSON.parse(submittedSurvey?.content) as FormElementInstance[])
      : [];
  }, [submittedSurvey?.content]);

  const questionElements = useMemo(() => {
    if (!Array.isArray(formElements)) return [];

    return formElements.filter((el) => isQuestionElement(el.type));
  }, [formElements]);

  const rows = useMemo(() => {
    return Array.isArray(submittedSurvey?.form_submission)
      ? submittedSurvey.form_submission.map((submission, index) => {
          const parsed =
            typeof submission?.content === "string"
              ? JSON.parse(submission.content)
              : {};
          return {
            id: `submission-${index}`,
            answers: parsed.answers || [],
            submittedAt: new Date(parsed.submittedAt || submission.created_at),
            title: parsed.title,
          };
        })
      : [];
  }, [submittedSurvey?.form_submission]);

  const addFilter = useCallback(() => {
    if (!debouncedSearchTerm.trim()) return;

    setActiveFilters((prevFilters) => [
      ...prevFilters,
      { field: "all", value: debouncedSearchTerm.trim() },
    ]);

    setSearchTerm("");
  }, [debouncedSearchTerm]);

  const removeFilter = (index: number) => {
    setActiveFilters((prevFilters) => {
      const newFilters = [...prevFilters];
      newFilters.splice(index, 1);
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm("");
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getFieldLabel = (fieldId: string) => {
    if (fieldId === "all") return "All fields";
    const element = questionElements.find((el) => el.id === fieldId);
    return element?.extraAttributes?.label || "Unnamed field";
  };

  const displayedRows = useMemo(() => {
    if (!Array.isArray(rows)) return [];

    let processedRows = [...rows];

    if (activeFilters.length > 0) {
      processedRows = processedRows.filter((row) => {
        return activeFilters.every((filter) => {
          // If filter is for all fields
          if (filter.field === "all") {
            // Make sure row.answers exists and is an array
            return (
              Array.isArray(row.answers) &&
              row.answers.some(
                (ans) =>
                  ans.answer
                    ?.toLowerCase()
                    .includes(filter.value.toLowerCase()) ||
                  ans.questionLabel
                    ?.toLowerCase()
                    .includes(filter.value.toLowerCase())
              )
            );
          }

          // Filter by specific field
          const answer = Array.isArray(row.answers)
            ? row.answers.find((ans) => ans.questionId === filter.field)
            : undefined;
          if (!answer) return false;

          return answer.answer
            ?.toLowerCase()
            .includes(filter.value.toLowerCase());
        });
      });
    }

    if (debouncedSearchTerm) {
      processedRows = processedRows.filter((row) => {
        if (!Array.isArray(row.answers)) return false;

        return row.answers.some(
          (ans) =>
            ans.answer
              ?.toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            ans.questionLabel
              ?.toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
        );
      });
    }

    // Sort the filtered rows
    return processedRows.sort((a, b) => {
      if (sortField === "submittedAt") {
        return sortDirection === "asc"
          ? a.submittedAt.getTime() - b.submittedAt.getTime()
          : b.submittedAt.getTime() - a.submittedAt.getTime();
      }

      // Sort by answer value for specific question
      const aAnswer = Array.isArray(a.answers)
        ? a.answers.find((ans) => ans.questionId === sortField)?.answer || ""
        : "";
      const bAnswer = Array.isArray(b.answers)
        ? b.answers.find((ans) => ans.questionId === sortField)?.answer || ""
        : "";

      return sortDirection === "asc"
        ? aAnswer.localeCompare(bAnswer)
        : bAnswer.localeCompare(aAnswer);
    });
  }, [rows, sortField, sortDirection, activeFilters, debouncedSearchTerm]);

  return (
    <div className="flex flex-col mx-2 my-4">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 p-4 border rounded-sm mx-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-2xl font-bold">
              Survey Responses
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              {displayedRows.length} of {rows.length}{" "}
              {rows.length === 1 ? "submission" : "submissions"} shown
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton submissions={displayedRows} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-2/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search responses..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addFilter();
                  }
                }}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-1/3 justify-between">
              <Button
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={addFilter}
              >
                Add Filter
              </Button>
              <Button
                variant="outline"
                className="gap-1"
                onClick={() => toggleSort(sortField)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {sortDirection === "asc" ? "Asc" : "Desc"}
                </span>
              </Button>
            </div>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  <span className="font-medium">
                    {getFieldLabel(filter.field)}:
                  </span>
                  <span>{filter.value}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
                    onClick={() => removeFilter(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {activeFilters.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={clearAllFilters}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Responses List */}
        {displayedRows.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-2"
            onValueChange={(value) => setExpandedRowId(value)}
          >
            {displayedRows.map((row) => (
              <AccordionItem
                key={row.id}
                value={row.id}
                className={`border-l-4 rounded-sm ${
                  expandedRowId === row.id
                    ? "border-l-blue-500"
                    : "border-l-gray-300"
                }`}
              >
                <AccordionTrigger className="hover:bg-slate-50 dark:hover:bg-slate-900 p-4">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">
                          {row?.title ??
                            `Response #${displayedRows.indexOf(row) + 1}`}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1 gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistance(
                              new Date(row.submittedAt),
                              new Date(),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                      {row.answers
                        .slice(0, 2)
                        .map((ans: Answer, idx: number) => (
                          <div key={idx} className="max-w-xs">
                            <p className="text-xs text-muted-foreground">
                              {ans.questionLabel}
                            </p>
                            <p className="text-sm font-medium truncate w-32">
                              {ans.questionType === "CheckboxField"
                                ? ans.answer === "true"
                                  ? "Yes"
                                  : "No"
                                : ans.answer || "-"}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {row.answers.map((ans: Answer, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md"
                      >
                        <p className="text-sm font-medium text-muted-foreground">
                          {ans.questionLabel}
                        </p>
                        {ans.questionType === "CheckboxField" ? (
                          <div className="mt-2">
                            <Checkbox
                              checked={ans.answer === "true"}
                              disabled
                            />
                            <span className="ml-2">
                              {ans.answer === "true" ? "Yes" : "No"}
                            </span>
                          </div>
                        ) : (
                          <p className="text-md mt-1 break-words">
                            {ans.answer || "-"}
                          </p>
                        )}
                      </div>
                    ))}
                    <div className="sm:col-span-2 flex items-center justify-end">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                          Submitted on {row.submittedAt.toLocaleDateString()} at{" "}
                          {row.submittedAt.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
              <Clipboard className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="mt-4 font-medium text-lg">
              {activeFilters.length > 0 || searchTerm
                ? "No matching responses"
                : "No submissions yet"}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {activeFilters.length > 0 || searchTerm
                ? "Try adjusting your filters or search terms."
                : "Once users start submitting the survey, responses will appear here."}
            </p>
            {(activeFilters.length > 0 || searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={clearAllFilters}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default SubmissionDashboard;
