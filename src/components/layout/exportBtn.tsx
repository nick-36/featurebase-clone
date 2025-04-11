import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

interface Answer {
  questionId: string;
  questionTitle: string;
  questionType: string;
  answer?: string;
}

interface Submission {
  id: string;
  submittedAt?: Date;
  answers: Answer[];
  title: string;
}

const ExportButton = ({ submissions }: { submissions?: Submission[] }) => {
  const exportToCSV = () => {
    if (!Array.isArray(submissions) || submissions.length === 0) {
      toast.error("No submissions to export.");
      return;
    }

    // Extract all unique question titles
    const questionTitles = Array.from(
      new Set(
        submissions.flatMap((submission) =>
          submission.answers.map((ans) => ans.questionTitle)
        )
      )
    );

    const headers = [
      "Submission ID",
      "Title",
      "Submitted At",
      ...questionTitles,
    ];

    // Properly escape CSV values
    const escapeCSV = (value: string) => {
      // If value contains commas, quotes, or newlines, wrap in quotes and escape any quotes
      const needsQuotes = /[",\n\r]/.test(String(value));
      const escaped = String(value).replace(/"/g, '""');
      return needsQuotes ? `"${escaped}"` : escaped;
    };

    const rows = submissions.map((submission) => {
      // Create an answer map for easy lookup
      const answerMap: Record<string, string> = {};
      submission.answers.forEach((ans) => {
        answerMap[ans.questionTitle] = ans.answer ?? "";
      });

      // Format the date
      const date = new Date(submission?.submittedAt ?? Date.now());
      const formattedDate = isNaN(date.getTime())
        ? "Invalid Date"
        : format(date, "EEEE, MM/dd/yyyy, h:mm a");

      // Build the row with proper CSV escaping
      const rowData = [
        escapeCSV(submission.id),
        escapeCSV(submission.title || ""),
        escapeCSV(formattedDate),
        ...questionTitles.map((title) => escapeCSV(answerMap[title] || "")),
      ];

      return rowData.join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "submissions_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 cursor-pointer"
        onClick={exportToCSV}
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
};

export default ExportButton;
