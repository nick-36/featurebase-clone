import { createFileRoute } from "@tanstack/react-router";
import { useLayoutContext } from "./_dashboardLayout";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateSurveyBtn from "@/components/layout/createSurvey";
import SurveyList from "@/components/layout/surveyList";

export const Route = createFileRoute("/dashboard/_dashboardLayout/surveys")({
  component: SurveysPage,
});

function SurveysPage() {
  const { setLayoutConfig } = useLayoutContext();

  useEffect(() => {
    setLayoutConfig({
      showHeader: false,
      showSidebar: true,
      headerProps: { title: "Surveys" },
    });
  }, [setLayoutConfig]);

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Surveys</h2>
          <CreateSurveyBtn btnView={true} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Surveys</CardTitle>
            <CardDescription>Manage your survey collection</CardDescription>
          </CardHeader>
          <CardContent>
            <SurveyList showCreteSurvey={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
