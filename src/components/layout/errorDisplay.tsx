import { FC, useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  error: Error | { message: string };
  reset?: () => void;
}

export const ErrorDisplay: FC<ErrorDisplayProps> = ({ error, reset }) => {
  const [isResetting, setIsResetting] = useState(false);

  const message = error?.message ?? "Something went off course.";

  const handleReset = () => {
    if (reset) {
      setIsResetting(true);
      reset();
      setTimeout(() => setIsResetting(false), 1000);
    }
  };

  return (
    <section
      className="w-[100vw] h-[100vh] bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 flex flex-col items-center justify-center px-6 py-12 text-gray-800 dark:text-gray-200 animate-fade-in"
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        <AlertCircle
          className="mx-auto w-16 h-16 text-red-500 dark:text-red-400"
          aria-hidden="true"
        />

        <h2 className="text-3xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Something Went Wrong
        </h2>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {reset && (
            <Button
              onClick={handleReset}
              variant="default"
              size="lg"
              disabled={isResetting}
              className={cn(
                "bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 transition-all",
                isResetting && "animate-spin-once"
              )}
            >
              <RotateCcw className="w-5 h-5" />
              {isResetting ? "Retrying..." : "Try Again"}
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
          >
            <Link to="/">Back to Home</Link>
          </Button>
        </div>

        {error instanceof Error && error.stack && (
          <details className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <summary className="cursor-pointer hover:underline">
              Technical Details
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md overflow-auto max-h-40 text-left text-xs">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </section>
  );
};
