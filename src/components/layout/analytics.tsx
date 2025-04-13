import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import BarChartComp from "@/components/charts/barChart";
import { ConversionRatesChart } from "@/components/charts/conversionRatesChart";
import { TopVisitsChart } from "@/components/charts/topVisitsChart";
import { useTopSurveys } from "@/hooks/queries/useTopSurveys";

const SurveyAnalytics = () => {
  const {
    data: topSurveys,
    isLoading: loadingTop,
    isError: topError,
    error: topErrorObj,
  } = useTopSurveys();

  const submissionsData =
    topSurveys?.mostSubmissions?.slice(0, 5).map((survey) => ({
      name:
        survey.title && survey.title.length > 15
          ? survey.title.substring(0, 15) + "..."
          : survey.title || "Unnamed Survey",
      submissions: survey.submissions,
      fullName: survey.title || "Unnamed Survey",
    })) || [];

  const conversionData =
    topSurveys?.highestConversion?.slice(0, 4).map((survey) => ({
      name:
        survey.title && survey.title.length > 10
          ? survey.title.substring(0, 10) + "..."
          : survey.title || "Unnamed Survey",
      value: survey.conversionRate,
      fullName: `${survey.title} (${survey.conversionRate.toFixed(1)}%)`,
    })) || [];

  const visitsData =
    topSurveys?.mostVisits?.slice(0, 5).map((survey) => ({
      name:
        survey.title && survey.title.length > 15
          ? survey.title.substring(0, 15) + "..."
          : survey.title || "Unnamed Survey",
      visits: survey.visits,
      fullName: survey.title || "Unnamed Survey",
    })) || [];

  if (topError) {
    return (
      <div className="p-4 text-red-500">
        Error loading analytics data: {topErrorObj?.message}
      </div>
    );
  }

  if (loadingTop) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading analytics data...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              Top Surveys by Submissions
            </CardTitle>
            <CardDescription>
              Surveys that received the most responses
            </CardDescription>
          </CardHeader>

          <CardContent className="h-72 pt-4">
            {submissionsData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-muted-foreground">
                  No submission data available
                </p>
              </div>
            ) : (
              <BarChartComp submissionsData={submissionsData} />
            )}
          </CardContent>
        </Card>

        <ConversionRatesChart conversionData={conversionData} />
      </div>
      <TopVisitsChart visitsData={visitsData} />
    </div>
  );
};

export default SurveyAnalytics;
