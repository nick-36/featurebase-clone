import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSurveyById } from "@/hooks/queries/useSurveyById";
import { ErrorDisplay } from "@/components/layout/errorDisplay";
import { DefaultPendingSkeleton } from "@/components/layout/loadingSkeleton";

export const Route = createLazyFileRoute("/surveys/$surveyId/success")({
  component: RouteComponent,
});

function RouteComponent() {
  const { surveyId } = useParams({ from: "/surveys/$surveyId/success" });
  const {
    data: survey,
    isLoading,
    error,
  } = useSurveyById({
    surveyId,
    enabled: !!surveyId,
  });

  if (isLoading) {
    return <DefaultPendingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!survey) {
    return <p className="text-gray-500 text-center">Survey not found</p>;
  }

  const shareURL = `${import.meta.env.VITE_FRONTEND_DEV_URL}/submit/${survey?.share_url}`;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-10">
        <div className="w-full max-w-3xl bg-white/70 backdrop-blur-lg p-10 rounded-2xl shadow-xl border border-primary/20">
          <h2 className="text-center text-2xl font-bold text-primary mb-6">
            🎉 Survey Published Successfully! 🎉
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-2">
            Your survey is now live and ready to collect responses.
          </p>
          <p className="text-center text-sm text-muted-foreground mb-10">
            Anyone with the link can view and submit the survey.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <Input
              readOnly
              className="flex-1 text-base px-4 py-2 border-muted-foreground/40 shadow-sm"
              value={shareURL}
            />
            <Button
              className="w-full md:w-auto px-6 py-2 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(shareURL);
                toast.success("Link copied to clipboard");
              }}
            >
              📋 Copy Link
            </Button>
          </div>

          <div className="flex justify-center gap-6">
            <Button asChild variant="outline" className="gap-2 cursor-pointer">
              <Link to="/">
                <MoveLeft />
                Go Home
              </Link>
            </Button>
            <Button asChild className="gap-2 cursor-pointer">
              <Link to={`/surveys/${survey?.id}`}>
                Form Details
                <MoveRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
