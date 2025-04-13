// src/routes/dashboard/_dashboardLayout.surveys.tsx
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
import SurveyList from "@/components/layout/surveyList";

export const Route = createFileRoute("/dashboard/_dashboardLayout/surveys")({
  component: SurveysPage,
  context: () => {
    return {
      pageTitle: "Surveys",
    };
  },
});

function SurveysPage() {
  const { setLayoutConfig } = useLayoutContext();

  useEffect(() => {
    setLayoutConfig({
      showHeader: false,
      showSidebar: true,
      headerProps: { title: "Surveys" },
      breadcrumbItems: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Surveys" },
      ],
    });
  }, [setLayoutConfig]);

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>All Surveys</CardTitle>
            <CardDescription>Manage your survey collection</CardDescription>
          </CardHeader>
          <CardContent>
            <SurveyList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
