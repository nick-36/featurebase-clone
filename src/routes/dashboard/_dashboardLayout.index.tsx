import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/_dashboardLayout/")({
  component: RouteComponent,
});

import { useLayoutContext } from "./_dashboardLayout";
import { useEffect } from "react";
import { BarChart, Activity, Mail } from "lucide-react";
import { StatsCard } from "@/components/layout/statsCard";
import SurveyList from "@/components/layout/surveyList";
import { useQuery } from "@tanstack/react-query";
import { getUserSurveyStats } from "@/services/surveyServiceV2";
import { ErrorDisplay } from "@/components/layout/errorDisplay";

function DashboardPage() {
  const { setLayoutConfig } = useLayoutContext();
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userSurveyStats"],
    queryFn: getUserSurveyStats,
  });

  // Set layout configuration for this route
  useEffect(() => {
    setLayoutConfig({
      showHeader: false,
      showSidebar: true,
      headerProps: { title: "Dashboard" },
    });
  }, [setLayoutConfig]);

  console.log(stats, "SURVEY Stas");

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <StatsCard
          title="Total Surveys"
          description={`+${stats?.responsesLastMonth || 0} from last month`}
          statValue={stats?.totalSurveys?.toString() || "0"}
          loading={isLoading}
          icon={<BarChart className="h-5 w-5" />}
        />

        <StatsCard
          title="Active Surveys"
          description={`+${stats?.activeSurveysLastMonth || 0} from last month`}
          statValue={stats?.activeSurveysLastMonth?.toString()}
          loading={isLoading}
          icon={<Activity className="h-5 w-5" />}
        />

        <StatsCard
          title="Responses"
          description={`+${stats?.responsesLastMonth || 0} from last month`}
          statValue={stats?.responsesLastMonth?.toString()}
          loading={isLoading}
          icon={<Mail className="h-5 w-5" />}
        />
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Surveys</CardTitle>
            <CardDescription>Your recently created surveys</CardDescription>
          </CardHeader>
          <CardContent>
            <SurveyList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RouteComponent() {
  return <DashboardPage />;
}
