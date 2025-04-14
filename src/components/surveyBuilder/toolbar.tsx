// src/components/survey-builder/Toolbar.tsx
import { Badge } from "@/components/ui/badge";
import SaveFormBtn from "@/components/builder/saveFormBtn";
import PublishFormBtn from "@/components/builder/publishFormBtn";
import { useSurveyBuilder } from "@/stores/surveyBuilderStore";

interface ToolbarProps {
  surveyId?: string;
}

export function Toolbar({ surveyId }: ToolbarProps) {
  const { survey } = useSurveyBuilder();

  return (
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
        {/* <div className="flex items-center space-x-2">
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
        </div> */}
        <div className="flex gap-2">
          <SaveFormBtn />
          <PublishFormBtn surveyId={surveyId as string} />
        </div>
      </div>
    </div>
  );
}
