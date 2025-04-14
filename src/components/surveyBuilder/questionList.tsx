import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuestionEditor } from "./questionEditor";
import { useSurveyBuilder } from "@/stores/surveyBuilderStore";

export function QuestionList({ pageIndex }: { pageIndex: number }) {
  const { survey, addQuestion } = useSurveyBuilder();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 overflow-y-auto overflow-hidden">
        {survey.pages[pageIndex].questions.map((question, questionIndex) => (
          <QuestionEditor
            key={question.id}
            pageIndex={pageIndex}
            questionIndex={questionIndex}
            question={question}
          />
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
  );
}
