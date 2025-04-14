// src/components/survey-builder/SurveyMetadataEditor.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSurveyBuilder } from "@/stores/surveyBuilderStore";

export function SurveyMetadataEditor() {
  const { survey, updateSurveyMeta } = useSurveyBuilder();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg">Survey Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Survey Title</label>
            <Input
              value={survey.title}
              onChange={(e) => updateSurveyMeta("title", e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Survey Description</label>
            <Textarea
              value={survey.description || ""}
              onChange={(e) => updateSurveyMeta("description", e.target.value)}
              rows={3}
              className="resize-none transition-all focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}