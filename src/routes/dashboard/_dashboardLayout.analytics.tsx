import { createFileRoute } from "@tanstack/react-router";

import { useLayoutContext } from "./_dashboardLayout";
import { useEffect } from "react";
import SurveyAnalytics from "@/components/layout/analytics";

function AnalyticsPage() {
  const { setLayoutConfig } = useLayoutContext();

  useEffect(() => {
    setLayoutConfig({
      showHeader: false,
      showSidebar: true,
      headerProps: { title: "Analytics" },
    });
  }, [setLayoutConfig]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <SurveyAnalytics />
    </div>
  );
}

export const Route = createFileRoute("/dashboard/_dashboardLayout/analytics")({
  component: AnalyticsPage,
});
